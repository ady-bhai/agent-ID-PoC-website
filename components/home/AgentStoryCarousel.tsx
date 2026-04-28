"use client";

import Image from "next/image";
import {
  useCallback,
  useId,
  useState,
  useSyncExternalStore,
  type CSSProperties,
  type KeyboardEvent,
} from "react";
import { withPublicBasePath } from "@/lib/paths";

/**
 * AgentStoryCarousel
 * ──────────────────
 * Three-card horizontal carousel for the home page. Replaces the older
 * scroll-pinned `AgentNarrativeSection` + the static `AgentIdAnswerSection`
 * with a single, manually-driven story:
 *
 *   1. arrival      — the agent shows up; the service has questions
 *   2. verification — the Agent ID supplies the answers
 *   3. decision     — verified agents pass; unverified ones are stopped
 *
 * Manual interaction only: arrow buttons, numbered tabs, and keyboard
 * arrow keys. No auto-advance, no swipe, no looping. Swipe would be
 * roughly ten lines of touch-event handling on the viewport ref if you
 * decide to add it later.
 *
 * The slide track holds all three images and translates as one unit;
 * only the active slide is visible because the viewport clips. This
 * keeps non-active images mounted (so transitions never reflow images)
 * but `aria-hidden` keeps screen readers focused on just the active one.
 */

const PALETTE = {
  bg: "#F5F0E8",
  ink: "#1A1A1A",
  inkDim: "#6B6B6B",
  navy: "#1A2744",
  border: "rgba(26, 26, 26, 0.12)",
  white: "#FFFFFF",
  slate300: "#CBD5E1",
  slate800: "#1F2937",
} as const;

type Slide = {
  src: string;
  alt: string;
  caption: string;
};

/**
 * Slide content. Captions are TODO placeholders — replace with the
 * final copy in this array; they'll appear under each card verbatim.
 */
const SLIDES: readonly Slide[] = [
  {
    src: "/images/home/carousel-1.png",
    alt: "An AI agent stands before a closed bank, which has a thought bubble of three unanswered questions.",
    caption: "TODO: caption for slide 1",
  },
  {
    src: "/images/home/carousel-2.png",
    alt: "The agent presents an Agent ID credential to the bank; the thought bubble's three questions now show check marks.",
    caption: "TODO: caption for slide 2",
  },
  {
    src: "/images/home/carousel-3.png",
    alt: "Diptych: a verified agent is admitted through open doors on the left, while a rogue red agent is stopped at closed doors on the right.",
    caption: "TODO: caption for slide 3",
  },
];

// ─── Hooks ───────────────────────────────────────────────────────────────────

/**
 * Tracks `prefers-reduced-motion` via `useSyncExternalStore` rather than
 * an effect-and-state pair, which keeps the hook lint-clean (no synchronous
 * setState inside an effect) and yields the correct value on first render.
 * Server snapshot returns `false` — assume motion is enabled until the
 * client confirms otherwise.
 */
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

// ─── Component ───────────────────────────────────────────────────────────────

export function AgentStoryCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const reduced = useReducedMotion();
  const sectionId = useId();
  const slideIdPrefix = `${sectionId}-slide`;

  const total = SLIDES.length;
  const canPrev = activeIndex > 0;
  const canNext = activeIndex < total - 1;

  const goTo = useCallback(
    (idx: number) => {
      const next = Math.max(0, Math.min(total - 1, idx));
      setActiveIndex(next);
    },
    [total],
  );

  const onKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      goTo(activeIndex - 1);
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      goTo(activeIndex + 1);
    }
  };

  // Track is `total * 100%` wide; each slide takes `100/total` of the track
  // (which equals 100% of the viewport). Translating by `-activeIndex *
  // (100 / total)` of the track shifts exactly one viewport-width per step.
  const trackStyle: CSSProperties = {
    display: "flex",
    width: `${total * 100}%`,
    height: "100%",
    transform: `translateX(-${activeIndex * (100 / total)}%)`,
    transition: reduced
      ? "none"
      : "transform 400ms cubic-bezier(0.4, 0, 0.2, 1)",
  };

  return (
    <section
      aria-roledescription="carousel"
      aria-label="How an Agent ID changes a service interaction"
      onKeyDown={onKeyDown}
      style={{
        background: PALETTE.bg,
        color: PALETTE.ink,
        borderTop: `1px solid ${PALETTE.border}`,
        borderBottom: `1px solid ${PALETTE.border}`,
        padding: "clamp(56px, 10vw, 96px) clamp(16px, 5vw, 48px)",
      }}
    >
      <div
        style={{
          maxWidth: 960,
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          gap: "clamp(20px, 3vw, 32px)",
        }}
      >
        {/* ── Card viewport (clips the track) ───────────────────────── */}
        <div
          style={{
            position: "relative",
            width: "100%",
            aspectRatio: "16 / 9",
            overflow: "hidden",
            borderRadius: 12,
            background: PALETTE.bg,
            boxShadow: "0 24px 60px -12px rgba(26, 39, 68, 0.18)",
          }}
        >
          <div style={trackStyle}>
            {SLIDES.map((slide, i) => {
              const isActive = i === activeIndex;
              return (
                <div
                  key={slide.src}
                  id={`${slideIdPrefix}-${i}`}
                  role="group"
                  aria-roledescription="slide"
                  aria-label={`Slide ${i + 1} of ${total}`}
                  aria-hidden={!isActive}
                  style={{
                    flex: `0 0 ${100 / total}%`,
                    position: "relative",
                    height: "100%",
                  }}
                >
                  <Image
                    src={withPublicBasePath(slide.src)}
                    alt={slide.alt}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 960px"
                    style={{ objectFit: "contain" }}
                    priority={i === 0}
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/*
          Caption for the active slide. `aria-live="polite"` so screen
          readers announce the new line when the reader steps through.
          A reserved `min-height` keeps multi-line captions from jolting
          the controls below.
        */}
        <p
          aria-live="polite"
          style={{
            margin: 0,
            minHeight: "3.5em",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "ui-serif, Georgia, 'Times New Roman', serif",
            fontStyle: "italic",
            fontSize: "clamp(18px, 2.4vw, 24px)",
            lineHeight: 1.4,
            color: PALETTE.slate800,
            textAlign: "center",
          }}
        >
          {SLIDES[activeIndex]?.caption}
        </p>

        {/* ── Footer: prev arrow | numbered tabs | next arrow ───────── */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 16,
          }}
        >
          <ArrowButton
            direction="prev"
            disabled={!canPrev}
            onClick={() => goTo(activeIndex - 1)}
          />
          <div
            role="tablist"
            aria-label="Story step"
            style={{ display: "flex", gap: 8 }}
          >
            {SLIDES.map((_, i) => {
              const isActive = i === activeIndex;
              return (
                <button
                  key={i}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  aria-current={isActive ? "step" : undefined}
                  aria-label={`Show step ${i + 1} of ${total}`}
                  aria-controls={`${slideIdPrefix}-${i}`}
                  onClick={() => goTo(i)}
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 6,
                    border: isActive
                      ? `1px solid ${PALETTE.navy}`
                      : `1px solid ${PALETTE.slate300}`,
                    background: isActive ? PALETTE.navy : PALETTE.white,
                    color: isActive ? PALETTE.white : PALETTE.inkDim,
                    fontFamily: "inherit",
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: "pointer",
                    transition:
                      "background 0.15s ease, color 0.15s ease, border-color 0.15s ease",
                  }}
                >
                  {i + 1}
                </button>
              );
            })}
          </div>
          <ArrowButton
            direction="next"
            disabled={!canNext}
            onClick={() => goTo(activeIndex + 1)}
          />
        </div>
      </div>
    </section>
  );
}

// ─── Arrow button ────────────────────────────────────────────────────────────

function ArrowButton({
  direction,
  disabled,
  onClick,
}: {
  direction: "prev" | "next";
  disabled: boolean;
  onClick: () => void;
}) {
  const label = direction === "prev" ? "Previous slide" : "Next slide";
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-disabled={disabled}
      aria-label={label}
      style={{
        width: 40,
        height: 40,
        borderRadius: 999,
        border: `1px solid ${PALETTE.border}`,
        background: PALETTE.white,
        color: PALETTE.ink,
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.35 : 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        transition: "background 0.15s ease, opacity 0.15s ease",
      }}
    >
      <ArrowGlyph direction={direction} />
    </button>
  );
}

function ArrowGlyph({ direction }: { direction: "prev" | "next" }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d={direction === "prev" ? "M15 6l-6 6 6 6" : "M9 6l6 6-6 6"}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default AgentStoryCarousel;
