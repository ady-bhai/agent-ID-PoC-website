import Image from "next/image";
import { withPublicBasePath } from "@/lib/paths";

/**
 * AgentIdAnswerSection
 * ────────────────────
 * The quiet third beat on the homepage, following the scroll-pinned
 * narrative. The narrative ends with "services face a binary choice";
 * this section says: here is the thing that answers those questions.
 *
 * Intentionally static:
 *   - No scroll animation. The prior `CredentialBridge` animated three
 *     questions into a credential card; that worked but competed with
 *     the narrative above it. A single editorial illustration reads
 *     faster and matches the memo-style aesthetic we're evolving toward.
 *   - The illustration contains its own thought-bubble questions. We do
 *     not repeat them in copy below — the caption speaks only to what
 *     the picture is doing in the story ("Agent IDs answer these
 *     questions.").
 *
 * Divider: a hairline `borderTop` gives the reader a clear break
 * between the narrative's cream background (which also ends on cream)
 * and this section — without either component having to change
 * palette. `borderBottom` carries through the same hairline so the
 * section still visibly separates from the PoC below.
 */

const PALETTE = {
  bg: "#F5F0E8",
  ink: "#1A1A1A",
  inkDim: "#6B6B6B",
  border: "rgba(26, 26, 26, 0.12)",
} as const;

const ILLUSTRATION = {
  src: "/images/home/agent-id-bank.jpg",
  alt: "An AI agent presenting an Agent ID credential to a Bank API, which has a thought bubble asking three questions: what can this agent do, how does this agent operate, and is this agent trustworthy and secure.",
  width: 1024,
  height: 614,
} as const;

export function AgentIdAnswerSection() {
  return (
    <section
      aria-label="Agent IDs answer these questions"
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
          maxWidth: 880,
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "clamp(24px, 4vw, 40px)",
        }}
      >
        <h2
          style={{
            fontFamily: "ui-serif, Georgia, 'Times New Roman', serif",
            fontStyle: "italic",
            fontSize: "clamp(22px, 3.2vw, 30px)",
            lineHeight: 1.3,
            fontWeight: 500,
            textAlign: "center",
            margin: 0,
            letterSpacing: "-0.01em",
          }}
        >
          Agent IDs answer these questions.
        </h2>

        <figure
          style={{
            margin: 0,
            width: "100%",
            maxWidth: 880,
          }}
        >
          <div
            style={{
              position: "relative",
              width: "100%",
              aspectRatio: `${ILLUSTRATION.width} / ${ILLUSTRATION.height}`,
            }}
          >
            <Image
              src={withPublicBasePath(ILLUSTRATION.src)}
              alt={ILLUSTRATION.alt}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 880px"
              style={{ objectFit: "contain" }}
            />
          </div>
        </figure>
      </div>
    </section>
  );
}

export default AgentIdAnswerSection;
