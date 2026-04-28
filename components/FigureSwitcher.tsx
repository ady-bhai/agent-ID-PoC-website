"use client";

import {
  useCallback,
  useId,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from "react";

export type FigureItem = {
  /** Stable id, also used for hash sync (e.g. "poc"). */
  id: string;
  label: string;
  subtitle?: string;
  /**
   * Pre-rendered content for the right pane. Stays mounted across switches.
   * Must be a `ReactNode` (not a function) so server components can hand
   * `<FigureSwitcher>` an items array across the client boundary.
   */
  content: ReactNode;
};

type Props = {
  items: FigureItem[];
  /** Initial selection if no matching `#hash` is present. Defaults to first item. */
  defaultId?: string;
  className?: string;
  /**
   * If true, reads `window.location.hash` on mount and replaces it on click.
   * Use on pages where deep-linking to a specific item is useful.
   */
  syncHash?: boolean;
  /** Optional aria-label for the rail (tablist). */
  ariaLabel?: string;
};

/**
 * GIM-style left-rail figure switcher.
 *
 * - Left rail (md+) is sticky; on small screens it collapses to a horizontally
 *   scrollable row of pills above the pane.
 * - All panels stay mounted and toggle visibility with `hidden`, so heavy
 *   children (like the interactive PoC) keep their internal state when you
 *   switch away and back.
 */
export function FigureSwitcher({
  items,
  defaultId,
  className = "",
  syncHash = false,
  ariaLabel = "Figures",
}: Props) {
  const reactId = useId();
  const groupId = `figswitch-${reactId.replace(/[:]/g, "")}`;

  const initialId = useMemo(() => {
    const fallback = defaultId && items.some((i) => i.id === defaultId)
      ? defaultId
      : items[0]?.id;
    return fallback ?? "";
  }, [defaultId, items]);

  // Lazy initializer reads `#hash` at first client render so we never need a
  // post-mount setState. On the server this branch is skipped, matching SSR
  // output; the page is statically exported so server HTML cannot know the
  // hash anyway, and any one-frame mismatch is invisible (panels are siblings
  // toggled with `hidden`).
  const [activeId, setActiveId] = useState<string>(() => {
    if (syncHash && typeof window !== "undefined") {
      const fromHash = window.location.hash.replace(/^#/, "");
      if (fromHash && items.some((i) => i.id === fromHash)) {
        return fromHash;
      }
    }
    return initialId;
  });
  const railRef = useRef<HTMLDivElement | null>(null);

  const select = useCallback(
    (id: string) => {
      setActiveId(id);
      if (syncHash && typeof window !== "undefined") {
        const url = `${window.location.pathname}${window.location.search}#${id}`;
        window.history.replaceState(null, "", url);
      }
    },
    [syncHash],
  );

  const onKeyDown = useCallback(
    (e: KeyboardEvent<HTMLDivElement>) => {
      const idx = items.findIndex((i) => i.id === activeId);
      if (idx < 0) return;
      let next = idx;
      switch (e.key) {
        case "ArrowDown":
        case "ArrowRight":
          next = (idx + 1) % items.length;
          break;
        case "ArrowUp":
        case "ArrowLeft":
          next = (idx - 1 + items.length) % items.length;
          break;
        case "Home":
          next = 0;
          break;
        case "End":
          next = items.length - 1;
          break;
        default:
          return;
      }
      e.preventDefault();
      const nextItem = items[next];
      if (!nextItem) return;
      select(nextItem.id);
      // Move focus to the newly active tab.
      const root = railRef.current;
      if (root) {
        const btn = root.querySelector<HTMLButtonElement>(
          `[data-figswitch-tab="${nextItem.id}"]`,
        );
        btn?.focus();
      }
    },
    [activeId, items, select],
  );

  return (
    <div
      className={`grid gap-6 md:grid-cols-[220px_minmax(0,1fr)] md:gap-10 ${className}`}
    >
      {/* Rail (md+): vertical list. <md: horizontal scroll. */}
      <div
        ref={railRef}
        role="tablist"
        aria-label={ariaLabel}
        aria-orientation="vertical"
        onKeyDown={onKeyDown}
        className="
          -mx-4 flex snap-x snap-mandatory gap-1 overflow-x-auto px-4
          md:mx-0 md:flex-col md:gap-1 md:overflow-visible md:px-0
          md:sticky md:top-24 md:self-start
        "
      >
        {items.map((item) => {
          const isActive = item.id === activeId;
          return (
            <button
              key={item.id}
              type="button"
              role="tab"
              data-figswitch-tab={item.id}
              id={`${groupId}-tab-${item.id}`}
              aria-selected={isActive}
              aria-controls={`${groupId}-panel-${item.id}`}
              tabIndex={isActive ? 0 : -1}
              onClick={() => select(item.id)}
              className={`
                relative shrink-0 snap-start rounded-md py-2 pl-4 pr-3 text-left
                transition-colors outline-none
                focus-visible:ring-2 focus-visible:ring-[#ea580c]/60 focus-visible:ring-offset-2
                md:w-full md:rounded-none md:border-l md:py-3 md:pl-5 md:pr-2
                ${
                  isActive
                    ? "md:border-[#ea580c]"
                    : "md:border-slate-200 md:hover:border-slate-300"
                }
              `}
            >
              <span
                aria-hidden
                className={`
                  pointer-events-none absolute left-0 top-1/2 hidden h-7 w-[3px]
                  -translate-y-1/2 rounded-full bg-[#ea580c]
                  transition-opacity duration-200
                  md:block
                  ${isActive ? "opacity-100" : "opacity-0"}
                `}
              />
              <span
                className={`block text-sm transition-colors ${
                  isActive
                    ? "font-semibold text-[#1a2744]"
                    : "font-medium text-slate-400 hover:text-slate-700"
                }`}
              >
                {item.label}
              </span>
              {item.subtitle ? (
                <span
                  className={`mt-0.5 block text-xs leading-snug transition-colors ${
                    isActive ? "text-slate-600" : "text-slate-400"
                  }`}
                >
                  {item.subtitle}
                </span>
              ) : null}
            </button>
          );
        })}
      </div>

      {/* Right pane: all panels mounted; visibility toggled. */}
      <div className="min-w-0">
        {items.map((item) => {
          const isActive = item.id === activeId;
          return (
            <div
              key={item.id}
              role="tabpanel"
              id={`${groupId}-panel-${item.id}`}
              aria-labelledby={`${groupId}-tab-${item.id}`}
              aria-hidden={!isActive}
              hidden={!isActive}
              className="motion-safe:transition-opacity motion-safe:duration-200"
            >
              {item.content}
            </div>
          );
        })}
      </div>
    </div>
  );
}
