"use client";

import Image from "next/image";
import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import { withPublicBasePath } from "@/lib/paths";

const CARD_IMAGE_SRC = withPublicBasePath("/images/home/agent-id-card.png");

/**
 * CredentialBridge
 * ────────────────
 * A light, non-pinned section that sits between the scroll narrative and the
 * interactive PoC. Its single job: re-surface the three questions the reader
 * just internalized, and show them mapping onto the three fields of one
 * Agent ID credential.
 *
 * Explicitly does NOT:
 *   - Claim the credential solves the binary.
 *   - Reference the PoC's mechanics.
 *   - Explain any standards or protocols.
 *
 * Animation: one-shot reveal when the section enters the viewport — card
 * fades in, then questions stagger in, then connector paths draw. No scroll
 * pinning; no replay on exit. Reduced-motion users get the final state
 * immediately.
 */

// ─── Palette (subset of narrative palette, plus a blue for row 1) ────────────
const INK = "#1A1A1A";
const INK_DIM = "#6B6B6B";
const BG = "#F5F0E8";
const CONNECTOR = "#A89E8F"; // inkFaint — hairline that doesn't compete

const ROW_COLORS = ["#4A6D9E", "#5B7E63", "#B8935A"] as const; // blue, green, amber

// ─── Card row geometry (fractions of card image dimensions) ──────────────────
// Measured off the source image. The colored bar on each row starts at ~10%
// of the card's width; the vertical centers land roughly at these fractions.
const CARD_ROW_LEFT_FRACTION = 0.11;
const CARD_ROW_CENTERS = [0.295, 0.465, 0.635] as const;

// Image intrinsic dimensions — from the source PNG.
const CARD_WIDTH = 690;
const CARD_HEIGHT = 984;

const QUESTIONS = [
  "Who built this agent?",
  "What is it authorized to do?",
  "Who's accountable if something fails?",
] as const;

const HEADING = "Three questions. One credential.";

// Reveal timings (ms from entry).
const TIMING = {
  card: 0,
  questions: [150, 300, 450],
  connectors: [500, 650, 800],
  cardDur: 500,
  questionDur: 450,
  connectorDur: 500,
} as const;

// Mobile cutoff — below this we stack and drop connectors.
const MOBILE_MAX = 767;

// ─── Hooks ───────────────────────────────────────────────────────────────────

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

/** Returns true once the node has been at least `threshold` in-view once. */
function useInViewOnce<T extends HTMLElement>(
  ref: React.RefObject<T | null>,
  threshold = 0.3,
): boolean {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const node = ref.current;
    if (!node || inView) return;
    if (typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setInView(true);
            io.disconnect();
            return;
          }
        }
      },
      { threshold },
    );
    io.observe(node);
    return () => io.disconnect();
  }, [ref, threshold, inView]);
  return inView;
}

// ─── Connector geometry ──────────────────────────────────────────────────────

type Point = { x: number; y: number };
type ConnectorPath = {
  d: string;
  length: number;
};

function buildPath(start: Point, end: Point): string {
  const dx = end.x - start.x;
  // S-curve with horizontal control handles so the path leaves and enters
  // horizontally — reads as a calm, deliberate line rather than a diagonal.
  const c1x = start.x + dx * 0.55;
  const c1y = start.y;
  const c2x = end.x - dx * 0.55;
  const c2y = end.y;
  return `M ${start.x.toFixed(1)} ${start.y.toFixed(1)} C ${c1x.toFixed(1)} ${c1y.toFixed(1)} ${c2x.toFixed(1)} ${c2y.toFixed(1)} ${end.x.toFixed(1)} ${end.y.toFixed(1)}`;
}

// Very rough path-length estimate good enough for strokeDasharray animation.
// Using the sum of control-polygon segments tends to overshoot; adding a
// correction factor brings it close to the rendered length.
function estimatePathLength(start: Point, end: Point): number {
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const straight = Math.hypot(dx, dy);
  // Add a small amount proportional to |dy| to account for curvature.
  return straight + Math.abs(dy) * 0.15;
}

// ─── Component ───────────────────────────────────────────────────────────────

export function CredentialBridge() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const gridRef = useRef<HTMLDivElement | null>(null);
  const cardWrapRef = useRef<HTMLDivElement | null>(null);
  const questionRefs = useRef<Array<HTMLLIElement | null>>([null, null, null]);

  const reduced = useReducedMotion();
  const isMobile = useMediaQuery(`(max-width: ${MOBILE_MAX}px)`);
  const inView = useInViewOnce(sectionRef, 0.3);

  const revealActive = reduced || inView;

  const [paths, setPaths] = useState<ConnectorPath[]>([]);

  // Recompute connector paths whenever layout could change.
  useLayoutEffect(() => {
    if (isMobile) {
      setPaths([]);
      return;
    }

    function measure() {
      const grid = gridRef.current;
      const cardWrap = cardWrapRef.current;
      if (!grid || !cardWrap) return;

      const gridRect = grid.getBoundingClientRect();
      const cardRect = cardWrap.getBoundingClientRect();
      if (gridRect.width === 0 || cardRect.width === 0) return;

      const next: ConnectorPath[] = [];
      for (let i = 0; i < 3; i += 1) {
        const qNode = questionRefs.current[i];
        if (!qNode) return;
        const qRect = qNode.getBoundingClientRect();

        const start: Point = {
          x: qRect.right - gridRect.left,
          y: qRect.top + qRect.height / 2 - gridRect.top,
        };
        const end: Point = {
          x:
            cardRect.left +
            cardRect.width * CARD_ROW_LEFT_FRACTION -
            gridRect.left,
          y:
            cardRect.top +
            cardRect.height * CARD_ROW_CENTERS[i] -
            gridRect.top,
        };
        next.push({
          d: buildPath(start, end),
          length: estimatePathLength(start, end),
        });
      }
      setPaths(next);
    }

    measure();
    if (typeof ResizeObserver === "undefined") {
      window.addEventListener("resize", measure);
      return () => window.removeEventListener("resize", measure);
    }
    const ro = new ResizeObserver(measure);
    if (gridRef.current) ro.observe(gridRef.current);
    if (cardWrapRef.current) ro.observe(cardWrapRef.current);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [isMobile]);

  return (
    <section
      ref={sectionRef}
      aria-label="Three questions, one credential"
      style={{
        background: BG,
        color: INK,
        borderBottom: "1px solid rgba(26, 26, 26, 0.08)",
      }}
    >
      <div
        style={{
          maxWidth: 1040,
          margin: "0 auto",
          padding: isMobile
            ? "clamp(48px, 10vw, 72px) clamp(20px, 5vw, 36px)"
            : "clamp(72px, 10vh, 112px) clamp(24px, 5vw, 48px)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: isMobile ? 28 : 48,
        }}
      >
        <h2
          style={{
            fontFamily: "ui-serif, Georgia, 'Times New Roman', serif",
            fontStyle: "italic",
            fontWeight: 400,
            fontSize: "clamp(22px, 3.2vw, 30px)",
            lineHeight: 1.25,
            letterSpacing: "-0.01em",
            textAlign: "center",
            margin: 0,
            color: INK,
            opacity: revealActive ? 1 : 0,
            transform: revealActive ? "translateY(0)" : "translateY(6px)",
            transition: reduced
              ? undefined
              : "opacity 500ms ease, transform 500ms ease",
          }}
        >
          {HEADING}
        </h2>

        {isMobile ? (
          <MobileLayout
            cardWrapRef={cardWrapRef}
            questionRefs={questionRefs}
            revealActive={revealActive}
            reduced={reduced}
          />
        ) : (
          <DesktopLayout
            gridRef={gridRef}
            cardWrapRef={cardWrapRef}
            questionRefs={questionRefs}
            revealActive={revealActive}
            reduced={reduced}
            paths={paths}
          />
        )}
      </div>
    </section>
  );
}

// ─── Desktop layout ──────────────────────────────────────────────────────────

function DesktopLayout({
  gridRef,
  cardWrapRef,
  questionRefs,
  revealActive,
  reduced,
  paths,
}: {
  gridRef: React.RefObject<HTMLDivElement | null>;
  cardWrapRef: React.RefObject<HTMLDivElement | null>;
  questionRefs: React.RefObject<Array<HTMLLIElement | null>>;
  revealActive: boolean;
  reduced: boolean;
  paths: ConnectorPath[];
}) {
  return (
    <div
      ref={gridRef}
      style={{
        position: "relative",
        width: "100%",
        display: "grid",
        // Left column holds questions; right column holds the card.
        // Middle is implicit empty space the connectors cross.
        gridTemplateColumns: "minmax(260px, 1fr) minmax(180px, 0.7fr) auto",
        alignItems: "center",
        gap: 0,
      }}
    >
      <div style={{ position: "relative", height: "100%" }}>
        <QuestionList
          refs={questionRefs}
          revealActive={revealActive}
          reduced={reduced}
          align="right"
        />
      </div>

      {/* Middle spacer column — just provides scroll/layout room for the
          connector paths. No content. */}
      <div aria-hidden />

      <div
        ref={cardWrapRef}
        style={{
          position: "relative",
          justifySelf: "end",
          width: 300,
          height: Math.round(300 * (CARD_HEIGHT / CARD_WIDTH)),
          opacity: revealActive ? 1 : 0,
          transform: revealActive ? "scale(1)" : "scale(0.98)",
          transition: reduced
            ? undefined
            : `opacity ${TIMING.cardDur}ms ease ${TIMING.card}ms, transform ${TIMING.cardDur}ms ease ${TIMING.card}ms`,
        }}
      >
        <Image
          src={CARD_IMAGE_SRC}
          alt="An Agent ID credential card with three colored rows representing the three identity fields."
          fill
          sizes="300px"
          style={{ objectFit: "contain" }}
        />
      </div>

      {/* Connector overlay — absolute, spans the whole grid. */}
      <Connectors paths={paths} revealActive={revealActive} reduced={reduced} />
    </div>
  );
}

// ─── Mobile layout ───────────────────────────────────────────────────────────

function MobileLayout({
  cardWrapRef,
  questionRefs,
  revealActive,
  reduced,
}: {
  cardWrapRef: React.RefObject<HTMLDivElement | null>;
  questionRefs: React.RefObject<Array<HTMLLIElement | null>>;
  revealActive: boolean;
  reduced: boolean;
}) {
  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 28,
      }}
    >
      <QuestionList
        refs={questionRefs}
        revealActive={revealActive}
        reduced={reduced}
        align="left"
      />
      <div
        ref={cardWrapRef}
        style={{
          position: "relative",
          width: "min(260px, 80%)",
          aspectRatio: `${CARD_WIDTH} / ${CARD_HEIGHT}`,
          opacity: revealActive ? 1 : 0,
          transform: revealActive ? "scale(1)" : "scale(0.98)",
          transition: reduced
            ? undefined
            : `opacity ${TIMING.cardDur}ms ease ${TIMING.card}ms, transform ${TIMING.cardDur}ms ease ${TIMING.card}ms`,
        }}
      >
        <Image
          src={CARD_IMAGE_SRC}
          alt="An Agent ID credential card with three colored rows representing the three identity fields."
          fill
          sizes="260px"
          style={{ objectFit: "contain" }}
        />
      </div>
    </div>
  );
}

// ─── Question list (shared desktop/mobile) ───────────────────────────────────

function QuestionList({
  refs,
  revealActive,
  reduced,
  align,
}: {
  refs: React.RefObject<Array<HTMLLIElement | null>>;
  revealActive: boolean;
  reduced: boolean;
  align: "left" | "right";
}) {
  // Distribute the three items so their vertical centers roughly align with
  // the card rows (28%, 47%, 64% of the card). On mobile we just use
  // even spacing; alignment there is handled via colored dots.
  const distribution = align === "right" ? "absolute" : "flex";

  if (distribution === "absolute") {
    return (
      <ol
        aria-label="Unanswered questions"
        style={{
          position: "relative",
          listStyle: "none",
          margin: 0,
          padding: 0,
          height: "100%",
          minHeight: 340,
        }}
      >
        {QUESTIONS.map((q, i) => (
          <QuestionItem
            key={q}
            index={i}
            text={q}
            align="right"
            revealActive={revealActive}
            reduced={reduced}
            liRef={(el) => {
              refs.current[i] = el;
            }}
            style={{
              position: "absolute",
              // Align vertical center to the matching card row.
              top: `${CARD_ROW_CENTERS[i] * 100}%`,
              transform: "translateY(-50%)",
              right: 0,
              maxWidth: 320,
            }}
          />
        ))}
      </ol>
    );
  }

  return (
    <ol
      aria-label="Unanswered questions"
      style={{
        listStyle: "none",
        margin: 0,
        padding: 0,
        display: "flex",
        flexDirection: "column",
        gap: 14,
        width: "100%",
      }}
    >
      {QUESTIONS.map((q, i) => (
        <QuestionItem
          key={q}
          index={i}
          text={q}
          align="left"
          revealActive={revealActive}
          reduced={reduced}
          liRef={(el) => {
            refs.current[i] = el;
          }}
        />
      ))}
    </ol>
  );
}

function QuestionItem({
  index,
  text,
  align,
  revealActive,
  reduced,
  liRef,
  style,
}: {
  index: number;
  text: string;
  align: "left" | "right";
  revealActive: boolean;
  reduced: boolean;
  liRef: (el: HTMLLIElement | null) => void;
  style?: CSSProperties;
}) {
  const accent = ROW_COLORS[index];
  const delay = TIMING.questions[index];

  const markerStyle: CSSProperties =
    align === "right"
      ? {
          // Right-aligned: colored rule sits to the right of the text,
          // pointing toward the card.
          width: 28,
          height: 2,
          background: accent,
          flexShrink: 0,
        }
      : {
          width: 10,
          height: 10,
          borderRadius: "50%",
          background: accent,
          flexShrink: 0,
        };

  return (
    <li
      ref={liRef}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: align === "right" ? "flex-end" : "flex-start",
        gap: align === "right" ? 14 : 12,
        opacity: revealActive ? 1 : 0,
        transform: revealActive ? "translateY(0)" : "translateY(6px)",
        transition: reduced
          ? undefined
          : `opacity ${TIMING.questionDur}ms ease ${delay}ms, transform ${TIMING.questionDur}ms ease ${delay}ms`,
        ...style,
      }}
    >
      {align === "left" && <span aria-hidden style={markerStyle} />}
      <span
        style={{
          fontFamily: "ui-serif, Georgia, 'Times New Roman', serif",
          fontStyle: "italic",
          fontSize: "clamp(15px, 1.7vw, 18px)",
          lineHeight: 1.35,
          color: INK,
          textAlign: align === "right" ? "right" : "left",
        }}
      >
        {text}
      </span>
      {align === "right" && <span aria-hidden style={markerStyle} />}
    </li>
  );
}

// ─── Connectors ──────────────────────────────────────────────────────────────

function Connectors({
  paths,
  revealActive,
  reduced,
}: {
  paths: ConnectorPath[];
  revealActive: boolean;
  reduced: boolean;
}) {
  const ready = paths.length === 3;

  return (
    <svg
      aria-hidden
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        overflow: "visible",
      }}
    >
      {ready &&
        paths.map((p, i) => {
          const delay = TIMING.connectors[i];
          const drawn = revealActive;
          return (
            <path
              key={i}
              d={p.d}
              fill="none"
              stroke={CONNECTOR}
              strokeWidth={1}
              strokeLinecap="round"
              strokeDasharray={p.length}
              strokeDashoffset={drawn && !reduced ? 0 : reduced ? 0 : p.length}
              style={{
                transition: reduced
                  ? undefined
                  : `stroke-dashoffset ${TIMING.connectorDur}ms ease ${delay}ms`,
              }}
            />
          );
        })}
    </svg>
  );
}

export default CredentialBridge;
