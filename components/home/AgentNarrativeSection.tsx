"use client";

import Image from "next/image";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type RefObject,
} from "react";
import { withPublicBasePath } from "@/lib/paths";

/**
 * AgentNarrativeSection
 * ─────────────────────
 * A scroll-pinned visual narrative that walks a cold reader from "agent
 * arrives" to "service is forced into a binary choice" without leaking the
 * solution. Five stages, driven by a single scroll-progress value.
 *
 * Architecture:
 *   - The outer <section> is tall (SECTION_VH_MULTIPLIER × viewport height),
 *     which provides scroll distance.
 *   - The inner sticky <div> pins to the top of the viewport. We account for
 *     the site's sticky <Nav> (≈57px) via NAV_OFFSET_PX so scene content
 *     never renders beneath it.
 *   - A single scrollProgress value (0..1) drives every transition.
 *
 * Assets are a blend:
 *   - Static backdrops (arrival, diptych) are bitmap illustrations living in
 *     /public/images/home/. These carry the editorial aesthetic.
 *   - Everything dynamic — the thought bubble, question reveals, red-dash
 *     dimming, caption text, and the cross-fade between single-scene and
 *     diptych — is code. Labels for the diptych are also code so copy can be
 *     edited without regenerating the image.
 *
 * Principles:
 *   - The risk signal lives inside the service, not on the agent. The diptych
 *     illustration follows this: "bad" robots only turn red after they cross
 *     the threshold, never before.
 *   - Reduced-motion users get a static, fully-composed state using the same
 *     backdrops.
 */

const PALETTE = {
  bg: "#F5F0E8",
  ink: "#1A1A1A",
  inkDim: "#6B6B6B",
  inkFaint: "#A89E8F",
  alert: "#B85450",
  // Permissive / "allow" tone. Muted editorial green — not a bright
  // brand-positive green. Sits next to `alert` as the opposing semantic.
  permit: "#5B7E63",
  accent: "#B8935A",
} as const;

const QUESTIONS = [
  "Who built this agent?",
  "What is it authorized to do?",
  "Who's accountable if something fails?",
] as const;

const CAPTIONS: Record<Stage, string> = {
  intro: "",
  arrival: "An AI agent requests access to a service.",
  questioning: "The service has questions it needs answered.",
  unanswered: "It has no way to get them.",
  binary: "So the service must choose.",
};

const DIPTYCH_LABELS = {
  block: { title: "Block every agent", body: "Lose legitimate activity." },
  allow: { title: "Allow every agent", body: "Accept unknown risk." },
} as const;

const THRESHOLDS = {
  arrival: 0.1,
  questioning: 0.25,
  unanswered: 0.6,
  binary: 0.72,
} as const;

const QUESTION_APPEARANCE = [0.3, 0.42, 0.54] as const;

const DIPTYCH_FADE_START = 0.72;
const DIPTYCH_FADE_END = 0.82;

const SECTION_VH_MULTIPLIER = 2.75;

/**
 * Site <Nav> is sticky, opaque white, ~57px tall. The pinned scene lives
 * *underneath* the nav in z-order, so we need top padding/offset on the
 * scene contents to keep them out from behind it.
 */
const NAV_OFFSET_PX = 57;

const MOBILE_MAX_WIDTH = 640;

const IMAGES = {
  arrival: {
    src: "/images/home/narrative-arrival.png",
    alt: "An AI agent carrying a briefcase approaches a classical bank building, with a thin arrow pointing from the agent toward the bank.",
    // Intrinsic dimensions of the source image. Needed so next/image can
    // serve a responsive srcset without layout shift.
    width: 1536,
    height: 864,
  },
  diptych: {
    src: "/images/home/service-must-choose.png",
    alt: "Two panels side by side. Left: the bank with closed doors, with four robots carrying business items stalled outside. Right: the same bank with open doors, robots streaming inside, with two robots turning red and red warning triangles above them after they cross the threshold.",
    width: 1536,
    height: 864,
  },
} as const;

type Stage = "intro" | "arrival" | "questioning" | "unanswered" | "binary";

// ─── Derived state ───────────────────────────────────────────────────────────

function computeStage(p: number): Stage {
  if (p < THRESHOLDS.arrival) return "intro";
  if (p < THRESHOLDS.questioning) return "arrival";
  if (p < THRESHOLDS.unanswered) return "questioning";
  if (p < THRESHOLDS.binary) return "unanswered";
  return "binary";
}

function computeVisibleQuestions(p: number): number {
  let count = 0;
  for (const threshold of QUESTION_APPEARANCE) {
    if (p >= threshold) count += 1;
  }
  return count;
}

function computeDiptychProgress(p: number): number {
  const raw =
    (p - DIPTYCH_FADE_START) / (DIPTYCH_FADE_END - DIPTYCH_FADE_START);
  return Math.max(0, Math.min(1, raw));
}

function computeFigureEntry(p: number): number {
  return Math.max(0, Math.min(1, p / 0.15));
}

// ─── Hooks ───────────────────────────────────────────────────────────────────

function useScrollProgress<T extends HTMLElement>(
  ref: RefObject<T | null>,
): number {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let rafId = 0;
    const node = ref.current;
    if (!node) return;

    const update = () => {
      const rect = node.getBoundingClientRect();
      const vh = window.innerHeight || document.documentElement.clientHeight;
      const total = rect.height - vh;
      if (total <= 0) {
        setProgress(0);
        return;
      }
      const p = Math.max(0, Math.min(1, -rect.top / total));
      setProgress(p);
    };

    const onScroll = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [ref]);

  return progress;
}

function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const listener = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", listener);
    return () => mq.removeEventListener("change", listener);
  }, []);

  return reduced;
}

function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia(query);
    setMatches(mq.matches);
    const listener = (e: MediaQueryListEvent) => setMatches(e.matches);
    mq.addEventListener("change", listener);
    return () => mq.removeEventListener("change", listener);
  }, [query]);

  return matches;
}

// ─── Backdrop illustration ───────────────────────────────────────────────────

/**
 * Thin wrapper around next/image that renders an illustration as a
 * `fill` layer inside a positioned parent. The parent is responsible for
 * sizing (typically via an aspect ratio). This keeps scroll-animation
 * transforms on the parent, not on the image.
 */
function Illustration({
  image,
  priority = false,
  sizes,
  style,
}: {
  image: (typeof IMAGES)[keyof typeof IMAGES];
  priority?: boolean;
  sizes: string;
  style?: CSSProperties;
}) {
  return (
    <Image
      src={withPublicBasePath(image.src)}
      alt={image.alt}
      fill
      priority={priority}
      sizes={sizes}
      style={{ objectFit: "contain", ...style }}
    />
  );
}

// ─── Thought bubble ──────────────────────────────────────────────────────────

function ThoughtBubble({
  visibleCount,
  dimmed,
  entirelyVisible,
  maxWidth = 340,
}: {
  visibleCount: number;
  dimmed: boolean;
  entirelyVisible: boolean;
  maxWidth?: number;
}) {
  return (
    <div
      role="note"
      aria-label="Questions the service is trying to answer"
      style={{
        position: "relative",
        background: PALETTE.bg,
        border: `1.4px solid ${PALETTE.ink}`,
        borderRadius: 18,
        padding: "14px 18px",
        width: `min(${maxWidth}px, 100%)`,
        opacity: entirelyVisible ? 1 : 0,
        transform: entirelyVisible ? "translateY(0)" : "translateY(12px)",
        transition: "opacity 0.5s ease, transform 0.5s ease",
        boxSizing: "border-box",
      }}
    >
      {/* Trailing bubbles drop straight down from the bubble's bottom-center,
          toward the bank sitting below. */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          bottom: -10,
          left: "50%",
          transform: "translateX(-50%)",
          width: 14,
          height: 14,
          borderRadius: "50%",
          background: PALETTE.bg,
          border: `1.4px solid ${PALETTE.ink}`,
        }}
      />
      <div
        aria-hidden
        style={{
          position: "absolute",
          bottom: -24,
          left: "50%",
          transform: "translateX(calc(-50% + 8px))",
          width: 7,
          height: 7,
          borderRadius: "50%",
          background: PALETTE.bg,
          border: `1.4px solid ${PALETTE.ink}`,
        }}
      />

      <ul
        style={{
          listStyle: "none",
          padding: 0,
          margin: 0,
          display: "flex",
          flexDirection: "column",
          gap: 9,
        }}
      >
        {QUESTIONS.map((q, i) => {
          const visible = i < visibleCount;
          return (
            <li
              key={q}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "baseline",
                gap: 12,
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(8px)",
                transition:
                  "opacity 0.5s ease, transform 0.5s ease, color 0.4s ease",
              }}
            >
              <span
                style={{
                  fontFamily: "ui-serif, Georgia, 'Times New Roman', serif",
                  fontStyle: "italic",
                  fontSize: 13,
                  lineHeight: 1.35,
                  color: dimmed ? PALETTE.inkDim : PALETTE.ink,
                  transition: "color 0.4s ease",
                }}
              >
                {q}
              </span>
              <span
                aria-hidden
                style={{
                  fontFamily:
                    "ui-monospace, 'SF Mono', Menlo, Consolas, monospace",
                  fontSize: 13,
                  letterSpacing: "-0.5px",
                  color: dimmed ? PALETTE.alert : PALETTE.inkFaint,
                  transition: "color 0.4s ease",
                  minWidth: 18,
                  textAlign: "right",
                }}
              >
                —
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

// ─── Single scene (arrival + questioning + unanswered stages) ───────────────

function SingleScene({
  stage,
  visibleQuestions,
  figureEntry,
  isMobile,
}: {
  stage: Stage;
  visibleQuestions: number;
  figureEntry: number;
  isMobile: boolean;
}) {
  const bubbleVisible = stage === "questioning" || stage === "unanswered";
  const bubbleDimmed = stage === "unanswered";

  const entryTransform = `translateY(${(1 - figureEntry) * 20}px)`;

  if (isMobile) {
    // Mobile: image on top, bubble beneath it (below the bank in the image).
    // Bubble has reserved min-height so its appearance doesn't shift layout.
    return (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "clamp(8px, 2vh, 20px)",
        }}
      >
        <div
          style={{
            position: "relative",
            width: "100%",
            maxWidth: 560,
            aspectRatio: "16 / 9",
            opacity: figureEntry,
            transform: entryTransform,
            transition: "opacity 0.4s ease, transform 0.5s ease",
          }}
        >
          <Illustration
            image={IMAGES.arrival}
            priority
            sizes="(max-width: 640px) 100vw, 560px"
          />
        </div>
        <div
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            // Reserve space so the bubble appearing doesn't push the image
            // upward — value matches the bubble's roughly-max height.
            minHeight: 130,
          }}
        >
          <ThoughtBubble
            visibleCount={visibleQuestions}
            dimmed={bubbleDimmed}
            entirelyVisible={bubbleVisible}
            maxWidth={300}
          />
        </div>
      </div>
    );
  }

  // Desktop: the illustration fills the frame; the bubble overlays the
  // top-right corner above the bank, with its tail dropping down toward
  // the bank body.
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          position: "relative",
          width: "min(880px, 100%)",
          aspectRatio: "16 / 9",
          opacity: figureEntry,
          transform: entryTransform,
          transition: "opacity 0.4s ease, transform 0.5s ease",
        }}
      >
        <Illustration
          image={IMAGES.arrival}
          priority
          sizes="(max-width: 1024px) 80vw, 880px"
        />

        {/* Bubble hovers above the bank. The bank sits in the right half
            of the image; we anchor the bubble's horizontal center to match. */}
        <div
          style={{
            position: "absolute",
            // Center the bubble horizontally over the bank (~75% of width)
            left: "75%",
            top: "-6%",
            transform: "translateX(-50%)",
            pointerEvents: "none",
          }}
        >
          <ThoughtBubble
            visibleCount={visibleQuestions}
            dimmed={bubbleDimmed}
            entirelyVisible={bubbleVisible}
            maxWidth={340}
          />
        </div>
      </div>
    </div>
  );
}

// ─── Diptych (binary stage) ──────────────────────────────────────────────────

function DiptychScene({
  intensity,
  isMobile = false,
}: {
  intensity: number;
  isMobile?: boolean;
}) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: isMobile ? "clamp(6px, 1.5vh, 14px)" : "clamp(10px, 2.5vh, 24px)",
        opacity: intensity,
      }}
    >
      <div
        style={{
          position: "relative",
          width: "min(960px, 100%)",
          aspectRatio: "16 / 9",
        }}
      >
        <Illustration
          image={IMAGES.diptych}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 960px"
        />
      </div>
      {/* Labels sit below the image, aligned to its two halves. */}
      <div
        style={{
          width: "min(960px, 100%)",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: isMobile ? "clamp(10px, 3vw, 24px)" : "clamp(20px, 5vw, 60px)",
        }}
      >
        <DiptychLabel
          title={DIPTYCH_LABELS.block.title}
          body={DIPTYCH_LABELS.block.body}
          titleColor={PALETTE.ink}
          bodyColor={PALETTE.inkDim}
        />
        {/* Allow panel: title is permissive (green), body carries the
            risk (red). The action is fine; the consequence is the problem. */}
        <DiptychLabel
          title={DIPTYCH_LABELS.allow.title}
          body={DIPTYCH_LABELS.allow.body}
          titleColor={PALETTE.permit}
          bodyColor={PALETTE.alert}
        />
      </div>
    </div>
  );
}

function DiptychLabel({
  title,
  body,
  titleColor = PALETTE.ink,
  bodyColor = PALETTE.inkDim,
}: {
  title: string;
  body: string;
  titleColor?: string;
  bodyColor?: string;
}) {
  return (
    <div style={{ textAlign: "center" }}>
      <p
        style={{
          fontFamily: "ui-serif, Georgia, 'Times New Roman', serif",
          fontSize: "clamp(14px, 2.2vw, 17px)",
          fontWeight: 600,
          color: titleColor,
          margin: 0,
          letterSpacing: "-0.2px",
        }}
      >
        {title}
      </p>
      <p
        style={{
          fontSize: "clamp(12px, 1.9vw, 14px)",
          color: bodyColor,
          margin: "4px 0 0",
        }}
      >
        {body}
      </p>
    </div>
  );
}

// ─── Caption ─────────────────────────────────────────────────────────────────

function StageCaption({ stage }: { stage: Stage }) {
  const text = CAPTIONS[stage];
  return (
    <p
      aria-live="polite"
      style={{
        fontFamily: "ui-serif, Georgia, 'Times New Roman', serif",
        fontSize: "clamp(18px, 2.6vw, 24px)",
        lineHeight: 1.4,
        color: PALETTE.ink,
        textAlign: "center",
        margin: 0,
        fontStyle: "italic",
        minHeight: "1.4em",
        opacity: text ? 1 : 0,
        transition: "opacity 0.5s ease",
      }}
    >
      {text || "\u00A0"}
    </p>
  );
}

// ─── Reduced-motion fallback ─────────────────────────────────────────────────

function StaticNarrativeFallback() {
  const isMobile = useMediaQuery(`(max-width: ${MOBILE_MAX_WIDTH}px)`);
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 40,
        padding: "clamp(40px, 8vw, 80px) clamp(16px, 5vw, 48px)",
        background: PALETTE.bg,
        color: PALETTE.ink,
      }}
    >
      <div
        style={{
          maxWidth: 880,
          margin: "0 auto",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 20,
        }}
      >
        <div
          style={{
            position: "relative",
            width: "100%",
            aspectRatio: "16 / 9",
          }}
        >
          <Illustration
            image={IMAGES.arrival}
            sizes="(max-width: 640px) 100vw, 880px"
          />
        </div>

        <ThoughtBubble
          visibleCount={QUESTIONS.length}
          dimmed
          entirelyVisible
          maxWidth={isMobile ? 300 : 360}
        />

        <p
          style={{
            fontFamily: "ui-serif, Georgia, 'Times New Roman', serif",
            fontSize: 22,
            fontStyle: "italic",
            textAlign: "center",
            margin: 0,
          }}
        >
          An agent arrives with questions the service has no way to answer.
        </p>
      </div>

      <div style={{ maxWidth: 960, margin: "0 auto", width: "100%" }}>
        <DiptychScene intensity={1} isMobile={isMobile} />
      </div>

      <p
        style={{
          fontFamily: "ui-serif, Georgia, 'Times New Roman', serif",
          fontSize: 22,
          fontStyle: "italic",
          textAlign: "center",
          margin: 0,
        }}
      >
        So the service must choose.
      </p>
    </div>
  );
}

// ─── Main ────────────────────────────────────────────────────────────────────

export function AgentNarrativeSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const progress = useScrollProgress(sectionRef);
  const reducedMotion = useReducedMotion();
  const isMobile = useMediaQuery(`(max-width: ${MOBILE_MAX_WIDTH}px)`);

  const stage = useMemo(() => computeStage(progress), [progress]);
  const visibleQuestions = useMemo(
    () => computeVisibleQuestions(progress),
    [progress],
  );
  const diptychProgress = useMemo(
    () => computeDiptychProgress(progress),
    [progress],
  );
  const figureEntry = useMemo(() => computeFigureEntry(progress), [progress]);

  const singleSceneOpacity = 1 - diptychProgress;
  const diptychOpacity = diptychProgress;

  if (reducedMotion) {
    return (
      <section
        aria-label="Why agent identity matters"
        style={{ background: PALETTE.bg }}
      >
        <StaticNarrativeFallback />
      </section>
    );
  }

  const sceneTopInset = `calc(${NAV_OFFSET_PX}px + clamp(8px, 3vh, 36px))`;

  return (
    <section
      ref={sectionRef}
      aria-label="Why agent identity matters"
      style={{
        position: "relative",
        background: PALETTE.bg,
        height: `${SECTION_VH_MULTIPLIER * 100}vh`,
        color: PALETTE.ink,
      }}
    >
      <div
        style={{
          position: "sticky",
          top: 0,
          height: "100vh",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            flex: "1 1 auto",
            position: "relative",
            minHeight: 0,
            padding: `${sceneTopInset} clamp(16px, 4vw, 48px) 0`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: sceneTopInset,
              right: "clamp(16px, 4vw, 48px)",
              bottom: 0,
              left: "clamp(16px, 4vw, 48px)",
              opacity: singleSceneOpacity,
              pointerEvents: singleSceneOpacity > 0.5 ? "auto" : "none",
              transition: "opacity 0.3s ease",
              overflow: "hidden",
            }}
          >
            <SingleScene
              stage={stage}
              visibleQuestions={visibleQuestions}
              figureEntry={figureEntry}
              isMobile={isMobile}
            />
          </div>

          <div
            style={{
              position: "absolute",
              top: sceneTopInset,
              right: "clamp(16px, 4vw, 48px)",
              bottom: 0,
              left: "clamp(16px, 4vw, 48px)",
              opacity: diptychOpacity,
              pointerEvents: diptychOpacity > 0.5 ? "auto" : "none",
              transition: "opacity 0.3s ease",
              overflow: "hidden",
            }}
          >
            <DiptychScene intensity={diptychProgress} isMobile={isMobile} />
          </div>
        </div>

        <div
          style={{
            flex: "0 0 auto",
            padding: "clamp(20px, 4vh, 48px) clamp(16px, 6vw, 80px)",
          }}
        >
          <StageCaption stage={stage} />
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          width: 1,
          height: 1,
          overflow: "hidden",
          clip: "rect(0 0 0 0)",
          clipPath: "inset(50%)",
          whiteSpace: "nowrap",
        }}
      >
        <h2>The service's dilemma</h2>
        <p>
          An AI agent requests access to a service. The service has three
          questions it cannot answer: who built the agent, what it is
          authorized to do, and who is accountable if it fails. With no way to
          answer these, the service faces a forced binary: block every agent
          and lose legitimate activity, or allow every agent and accept
          unknown risk.
        </p>
      </div>
    </section>
  );
}

export default AgentNarrativeSection;
