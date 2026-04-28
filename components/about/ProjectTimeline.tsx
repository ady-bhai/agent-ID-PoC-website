"use client";

import {
  useCallback,
  useId,
  useState,
  useSyncExternalStore,
  type CSSProperties,
  type KeyboardEvent,
} from "react";

/**
 * ProjectTimeline
 * ───────────────
 * Horizontal milestone timeline for the /about page. Five clickable
 * markers along a single rule; clicking one expands an inline panel
 * below the timeline with a 20-30 word description. Only one panel is
 * open at a time (accordion); clicking the active marker collapses it.
 *
 * Layout matches the reference screenshot:
 *
 *   [ DATE ]    [ DATE ]    [ DATE ]    [ DATE ]    [ DATE ]
 *   ────▢────────▢────────▢────────▢────────▢────
 *   title       title       title       title       title
 *
 * Implementation:
 *   - CSS grid with one column per milestone; three rows (date/marker/title).
 *   - The horizontal rule is a single absolutely-positioned `<span>` behind
 *     the markers so it spans the row without grid borders fighting markers.
 *   - On mobile (< 640px) the grid collapses to a vertical layout via
 *     Tailwind's `sm:` breakpoint — pure CSS, no `matchMedia` (avoids
 *     hydration mismatches).
 *   - ARIA pattern: tablist + tabpanel. Arrow keys move focus + selection
 *     between markers, Home/End jump to ends. Mirrors the keyboard model
 *     in `components/home/AgentStoryCarousel.tsx`.
 */

type Milestone = {
  id: string;
  dateLabel: string;
  title: string;
  description: string;
};

// TODO: replace with final copy. Each `description` is a placeholder
// in the 20-30 word range; keep it that length so the expanded panel
// doesn't shift the team grid below by an unpredictable amount.
const MILESTONES: readonly Milestone[] = [
  {
    id: "memo",
    dateLabel: "Nov 2025",
    title: "Policy memo",
    description:
      "First public memo laying out the case for verifiable identity infrastructure for AI agents and outlining the open research questions ahead.",
  },
  {
    id: "poc",
    dateLabel: "Jan 2026",
    title: "Proof of concept",
    description:
      "Built an interactive proof of concept showing how an Agent ID could be issued, presented, and verified in a realistic service interaction.",
  },
  {
    id: "stakeholders",
    dateLabel: "Mar 2026",
    title: "Stakeholder meetings",
    description:
      "Workshopped the approach with policymakers, researchers, and operators across multiple jurisdictions to pressure-test assumptions and refine scope.",
  },
  {
    id: "site",
    dateLabel: "Apr 2026",
    title: "Public site",
    description:
      "Launched this site to bring the memo, the demo, and the working code together in one place that's easy to read, fork, and contribute to.",
  },
  {
    id: "next",
    dateLabel: "Q3 2026",
    title: "Next steps",
    description:
      "Engaging standards bodies and pilot partners, expanding the proof of concept toward a deployable reference implementation, and growing the contributor base.",
  },
];

// ─── prefers-reduced-motion (mirrors AgentStoryCarousel) ────────────────────

function useReducedMotion(): boolean {
  return useSyncExternalStore(
    subscribePrefersReducedMotion,
    getPrefersReducedMotion,
    getPrefersReducedMotionServer,
  );
}

function subscribePrefersReducedMotion(callback: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  mq.addEventListener("change", callback);
  return () => mq.removeEventListener("change", callback);
}

function getPrefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function getPrefersReducedMotionServer(): boolean {
  return false;
}

// ─── Component ──────────────────────────────────────────────────────────────

export function ProjectTimeline() {
  const [activeId, setActiveId] = useState<string | null>(MILESTONES[0]?.id ?? null);
  const reduced = useReducedMotion();
  const baseId = useId();

  const total = MILESTONES.length;
  const activeIndex = MILESTONES.findIndex((m) => m.id === activeId);
  const activeMilestone = activeIndex >= 0 ? MILESTONES[activeIndex] : null;

  // The horizontal and vertical layouts both render in the DOM (CSS
  // toggles which is visible), so each tab needs a layout-specific id
  // to avoid duplicate `id` attributes. `panelId` is layout-specific
  // for the same reason — the desktop panel is a separate DOM node
  // from the mobile inline panels.
  const tabId = useCallback(
    (id: string, layout: "h" | "v") => `${baseId}-${layout}-tab-${id}`,
    [baseId],
  );
  const panelIdFor = useCallback(
    (layout: "h" | "v", id?: string) =>
      layout === "h" ? `${baseId}-h-panel` : `${baseId}-v-panel-${id}`,
    [baseId],
  );
  const horizontalPanelId = panelIdFor("h");

  const focusTab = (idx: number, layout: "h" | "v") => {
    if (typeof document === "undefined") return;
    const target = MILESTONES[idx];
    if (!target) return;
    const el = document.getElementById(tabId(target.id, layout));
    el?.focus();
  };

  const makeOnTabKeyDown = (layout: "h" | "v") =>
    (event: KeyboardEvent<HTMLButtonElement>) => {
      if (activeIndex < 0) return;
      let next = activeIndex;
      switch (event.key) {
        case "ArrowLeft":
        case "ArrowUp":
          next = Math.max(0, activeIndex - 1);
          break;
        case "ArrowRight":
        case "ArrowDown":
          next = Math.min(total - 1, activeIndex + 1);
          break;
        case "Home":
          next = 0;
          break;
        case "End":
          next = total - 1;
          break;
        default:
          return;
      }
      event.preventDefault();
      const nextMilestone = MILESTONES[next];
      if (nextMilestone) {
        setActiveId(nextMilestone.id);
        focusTab(next, layout);
      }
    };

  const onHorizontalKeyDown = makeOnTabKeyDown("h");
  const onVerticalKeyDown = makeOnTabKeyDown("v");

  const handleClick = (id: string) => {
    // Click the active marker → collapse. Click any other marker → switch.
    setActiveId((prev) => (prev === id ? null : id));
  };

  const transition = reduced ? "none" : undefined;

  return (
    <section
      aria-labelledby={`${baseId}-heading`}
      className="border-b border-[rgba(26,26,26,0.12)]"
      style={{ padding: "clamp(56px, 10vw, 96px) clamp(16px, 5vw, 48px)" }}
    >
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-col gap-3">
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#6B6B6B]">
            How we got here
          </p>
          <h2
            id={`${baseId}-heading`}
            className="text-2xl font-semibold tracking-tight text-[#1A2744] sm:text-3xl"
          >
            Project timeline
          </h2>
          <p className="max-w-2xl text-sm leading-relaxed text-[#6B6B6B]">
            Click any milestone to read more. Use the arrow keys to step
            through the timeline.
          </p>
        </div>

        {/* Horizontal timeline (≥ sm) */}
        <div
          className="mt-12 hidden sm:block"
          role="tablist"
          aria-label="Project milestones"
          aria-orientation="horizontal"
        >
          <div
            className="grid"
            style={{
              gridTemplateColumns: `repeat(${total}, minmax(0, 1fr))`,
              gridTemplateRows: "auto 28px auto",
              rowGap: "16px",
            }}
          >
            {/*
              The rule lives as a grid item on row 2, spanning all columns.
              `align-self: center` drops it onto the visual centerline of
              the marker row so the 12-square markers rest cleanly on it.
              Markers render with `z-index: 1` to sit on top of the rule.
            */}
            <span
              aria-hidden
              className="pointer-events-none"
              style={{
                gridColumn: `1 / ${total + 1}`,
                gridRow: 2,
                alignSelf: "center",
                height: 1,
                background: "rgba(26, 26, 26, 0.25)",
              }}
            />

            {MILESTONES.map((m, i) => (
              <DateLabel key={`d-${m.id}`} column={i + 1} text={m.dateLabel} />
            ))}

            {MILESTONES.map((m, i) => {
              const isActive = m.id === activeId;
              return (
                <MarkerCell
                  key={`m-${m.id}`}
                  column={i + 1}
                  isActive={isActive}
                  transition={transition}
                  onClick={() => handleClick(m.id)}
                  onKeyDown={onHorizontalKeyDown}
                  tabId={tabId(m.id, "h")}
                  panelId={horizontalPanelId}
                  ariaLabel={`Milestone ${i + 1} of ${total}: ${m.title}, ${m.dateLabel}`}
                />
              );
            })}

            {MILESTONES.map((m, i) => {
              const isActive = m.id === activeId;
              return (
                <TitleLabel
                  key={`t-${m.id}`}
                  column={i + 1}
                  text={m.title}
                  isActive={isActive}
                  onClick={() => handleClick(m.id)}
                />
              );
            })}
          </div>

          {/* Expanded panel */}
          <ExpansionPanel
            panelId={horizontalPanelId}
            activeMilestone={activeMilestone}
            tabId={
              activeMilestone ? tabId(activeMilestone.id, "h") : undefined
            }
            reduced={reduced}
          />
        </div>

        {/* Vertical timeline (< sm) */}
        <ol
          className="mt-10 flex flex-col gap-0 sm:hidden"
          role="tablist"
          aria-label="Project milestones"
          aria-orientation="vertical"
        >
          {MILESTONES.map((m, i) => {
            const isActive = m.id === activeId;
            const isLast = i === total - 1;
            return (
              <li key={m.id} className="relative pl-8">
                {/* Vertical rule on the left */}
                {!isLast && (
                  <span
                    aria-hidden
                    className="absolute left-[5px] top-3 bottom-0"
                    style={{
                      width: 1,
                      background: "rgba(26, 26, 26, 0.25)",
                    }}
                  />
                )}
                <button
                  type="button"
                  role="tab"
                  id={tabId(m.id, "v")}
                  aria-selected={isActive}
                  aria-controls={panelIdFor("v", m.id)}
                  tabIndex={isActive ? 0 : -1}
                  onClick={() => handleClick(m.id)}
                  onKeyDown={onVerticalKeyDown}
                  className="group flex w-full flex-col items-start gap-1 py-3 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1A2744]"
                >
                  <span
                    aria-hidden
                    className="absolute left-0 top-[18px]"
                    style={{
                      width: 12,
                      height: 12,
                      borderRadius: 2,
                      border: "1px solid #1A2744",
                      background: isActive ? "#1A2744" : "#F5F0E8",
                      transition: transition ?? "background 150ms ease",
                    }}
                  />
                  <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#6B6B6B]">
                    {m.dateLabel}
                  </span>
                  <span
                    className="text-base font-medium text-[#1A1A1A]"
                    style={{
                      color: isActive ? "#1A2744" : undefined,
                    }}
                  >
                    {m.title}
                  </span>
                </button>
                {isActive && (
                  <div
                    id={panelIdFor("v", m.id)}
                    role="tabpanel"
                    aria-labelledby={tabId(m.id, "v")}
                    className="mb-3 ml-0 mt-1 rounded-md border border-[rgba(26,26,26,0.12)] bg-white p-4 shadow-[0_1px_3px_rgba(15,23,42,0.06)]"
                    style={{ borderLeft: "3px solid #1A2744" }}
                  >
                    <p className="m-0 text-[15px] leading-relaxed text-[#1F2937]">
                      {m.description}
                    </p>
                  </div>
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}

// ─── Subcomponents ─────────────────────────────────────────────────────────

function DateLabel({ column, text }: { column: number; text: string }) {
  return (
    <div
      className="flex items-end justify-center text-center"
      style={{ gridColumn: column, gridRow: 1, minHeight: 28 }}
    >
      <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#6B6B6B]">
        {text}
      </span>
    </div>
  );
}

function MarkerCell({
  column,
  isActive,
  transition,
  onClick,
  onKeyDown,
  tabId,
  panelId,
  ariaLabel,
}: {
  column: number;
  isActive: boolean;
  transition: string | undefined;
  onClick: () => void;
  onKeyDown: (e: KeyboardEvent<HTMLButtonElement>) => void;
  tabId: string;
  panelId: string;
  ariaLabel: string;
}) {
  return (
    <div
      className="relative flex items-center justify-center"
      style={{ gridColumn: column, gridRow: 2 }}
    >
      <button
        type="button"
        role="tab"
        id={tabId}
        aria-selected={isActive}
        aria-controls={panelId}
        aria-label={ariaLabel}
        tabIndex={isActive ? 0 : -1}
        onClick={onClick}
        onKeyDown={onKeyDown}
        className="relative z-10 flex h-7 w-7 items-center justify-center rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1A2744]"
      >
        <span
          aria-hidden
          style={{
            width: 12,
            height: 12,
            borderRadius: 2,
            border: "1px solid #1A2744",
            background: isActive ? "#1A2744" : "#F5F0E8",
            transition: transition ?? "background 150ms ease",
            display: "block",
          }}
        />
      </button>
    </div>
  );
}

function TitleLabel({
  column,
  text,
  isActive,
  onClick,
}: {
  column: number;
  text: string;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <div
      className="flex items-start justify-center text-center"
      style={{ gridColumn: column, gridRow: 3 }}
    >
      <button
        type="button"
        onClick={onClick}
        tabIndex={-1}
        className="text-sm transition-colors hover:text-[#1A2744]"
        style={{
          color: isActive ? "#1A2744" : "#1A1A1A",
          fontWeight: isActive ? 600 : 500,
        }}
      >
        {text}
      </button>
    </div>
  );
}

function ExpansionPanel({
  panelId,
  activeMilestone,
  tabId,
  reduced,
}: {
  panelId: string;
  activeMilestone: Milestone | null;
  tabId: string | undefined;
  reduced: boolean;
}) {
  const isOpen = activeMilestone !== null;

  // Use a wrapper that animates max-height + opacity. The inner panel
  // remains in the DOM so screen readers can read it via aria-live, but
  // we still toggle aria-hidden when collapsed for clarity.
  const wrapperStyle: CSSProperties = {
    overflow: "hidden",
    maxHeight: isOpen ? 320 : 0,
    opacity: isOpen ? 1 : 0,
    transition: reduced
      ? "none"
      : "max-height 220ms ease, opacity 180ms ease",
  };

  return (
    <div style={wrapperStyle} aria-hidden={!isOpen}>
      <div
        id={panelId}
        role="tabpanel"
        aria-labelledby={tabId}
        aria-live="polite"
        className="mt-8 rounded-md border border-[rgba(26,26,26,0.12)] bg-white p-6 shadow-[0_1px_3px_rgba(15,23,42,0.06)] sm:p-7"
        style={{ borderLeft: "3px solid #1A2744" }}
      >
        {activeMilestone && (
          <div className="flex flex-col gap-2">
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#6B6B6B]">
              {activeMilestone.dateLabel} · {activeMilestone.title}
            </p>
            <p className="m-0 text-base leading-relaxed text-[#1F2937] sm:text-lg">
              {activeMilestone.description}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProjectTimeline;
