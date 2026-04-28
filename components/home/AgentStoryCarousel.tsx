"use client";

import Image from "next/image";
import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  useSyncExternalStore,
  type CSSProperties,
  type KeyboardEvent,
} from "react";
import { withPublicBasePath } from "@/lib/paths";

/**
 * AgentStoryCarousel
 * ──────────────────
 * Two-column layout (md+): left = problem copy + per-slide caption that
 * fades when the step changes; right = image carousel with prev/next
 * flanking the frame and numbered tabs below. Stacks on small screens.
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

const CAPTION_FADE_MS = 240;

type Slide = {
  src: string;
  alt: string;
  caption: string;
};

/** Slide content; captions render in the left column for the active step. */
const SLIDES: readonly Slide[] = [
  {
    src: "/images/home/carousel-1.jpg",
    alt: "An agent arrives at a bank API service; the bank is unsure whether the agent is trustworthy.",
    caption:
      "An agent arrives at a service: a bank API. The bank API isn't sure whether the Agent is trustworthy.",
  },
  {
    src: "/images/home/carousel-2.jpg",
    alt: "The Agent presents its Agent ID to the bank API; the service's questions are answered.",
    caption:
      "The Agent presents its ID, answering the Bank API's questions",
  },
  {
    src: "/images/home/carousel-3.jpg",
    alt: "Agents with IDs are allowed through; agents without IDs are denied access.",
    caption:
      "Agents with IDs are allowed access to services while Agents without are denied access",
  },
];

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

/**
 * Drives caption text + opacity so copy cross-fades when `activeIndex` changes.
 * Skips animation on first paint and when prefers-reduced-motion is set.
 */
function useCaptionFade(activeIndex: number, reducedMotion: boolean) {
  const [captionIndex, setCaptionIndex] = useState(activeIndex);
  const [opacity, setOpacity] = useState(1);
  const isFirstPaint = useRef(true);

  useEffect(() => {
    if (reducedMotion) {
      setCaptionIndex(activeIndex);
      setOpacity(1);
      return;
    }

    if (isFirstPaint.current) {
      isFirstPaint.current = false;
      setCaptionIndex(activeIndex);
      setOpacity(1);
      return;
    }

    if (captionIndex === activeIndex) {
      setOpacity(1);
      return;
    }

    let cancelled = false;
    setOpacity(0);
    const id = window.setTimeout(() => {
      if (cancelled) return;
      setCaptionIndex(activeIndex);
      requestAnimationFrame(() => {
        if (!cancelled) setOpacity(1);
      });
    }, CAPTION_FADE_MS);

    return () => {
      cancelled = true;
      window.clearTimeout(id);
    };
  }, [activeIndex, reducedMotion, captionIndex]);

  return { captionIndex, opacity };
}

export function AgentStoryCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const reduced = useReducedMotion();
  const { captionIndex, opacity: captionOpacity } = useCaptionFade(
    activeIndex,
    reduced,
  );
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

  const trackStyle: CSSProperties = {
    display: "flex",
    width: `${total * 100}%`,
    height: "100%",
    transform: `translateX(-${activeIndex * (100 / total)}%)`,
    transition: reduced
      ? "none"
      : "transform 400ms cubic-bezier(0.4, 0, 0.2, 1)",
  };

  const captionTransition = reduced
    ? "none"
    : `opacity ${CAPTION_FADE_MS}ms ease, transform ${CAPTION_FADE_MS}ms ease`;

  return (
    <section
      tabIndex={0}
      aria-roledescription="carousel"
      aria-label="How an Agent ID changes a service interaction"
      onKeyDown={onKeyDown}
      className="outline-none focus-visible:ring-2 focus-visible:ring-[#1a2744] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F5F0E8]"
      style={{
        background: PALETTE.bg,
        color: PALETTE.ink,
        borderTop: `1px solid ${PALETTE.border}`,
        borderBottom: `1px solid ${PALETTE.border}`,
        padding: "clamp(40px, 7vw, 72px) clamp(16px, 5vw, 48px)",
      }}
    >
      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-8 md:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] md:items-start md:gap-10 lg:gap-12">
        {/* ── Left: problem copy + fading step caption ─────────────── */}
        <div className="flex min-w-0 flex-col gap-6">
          <header
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 10,
            }}
          >
            <p
              style={{
                margin: 0,
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: PALETTE.inkDim,
              }}
            >
              The problem
            </p>
            <h2
              style={{
                margin: 0,
                fontSize: "clamp(24px, 3.4vw, 34px)",
                fontWeight: 600,
                letterSpacing: "-0.01em",
                lineHeight: 1.15,
                color: PALETTE.navy,
              }}
            >
              Why agent IDs?
            </h2>
            <p
              style={{
                margin: 0,
                fontSize: "clamp(15px, 1.7vw, 17px)",
                lineHeight: 1.55,
                color: PALETTE.slate800,
              }}
            >
              An agent ID is how those answers get carried in. Agent IDs help
              services answer questions to make them feel confident.
            </p>
          </header>

          <p
            aria-live="polite"
            style={{
              margin: 0,
              minHeight: "4.5em",
              fontFamily: "ui-serif, Georgia, 'Times New Roman', serif",
              fontStyle: "italic",
              fontSize: "clamp(17px, 2.1vw, 22px)",
              lineHeight: 1.45,
              color: PALETTE.slate800,
              textAlign: "left",
              opacity: captionOpacity,
              transform:
                reduced || captionOpacity === 1
                  ? "translateY(0)"
                  : "translateY(4px)",
              transition: captionTransition,
            }}
          >
            {SLIDES[captionIndex]?.caption}
          </p>
        </div>

        {/* ── Right: arrows + viewport, tabs below ──────────────────── */}
        <div className="flex min-w-0 flex-col gap-4">
          <div
            className="flex w-full items-center gap-2 sm:gap-3"
            style={{ minWidth: 0 }}
          >
            <ArrowButton
              direction="prev"
              disabled={!canPrev}
              onClick={() => goTo(activeIndex - 1)}
            />
            <div
              style={{
                position: "relative",
                flex: "1 1 0",
                minWidth: 0,
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
                        sizes="(max-width: 768px) 90vw, 50vw"
                        style={{ objectFit: "contain" }}
                        priority={i === 0}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
            <ArrowButton
              direction="next"
              disabled={!canNext}
              onClick={() => goTo(activeIndex + 1)}
            />
          </div>

          <div
            className="flex justify-center gap-2"
            role="tablist"
            aria-label="Story step"
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
        </div>
      </div>
    </section>
  );
}

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
