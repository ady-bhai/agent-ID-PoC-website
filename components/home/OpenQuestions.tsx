import Link from "next/link";

/**
 * OpenQuestions
 * ─────────────
 * Home-page section that surfaces a curated subset of the memo's "ten
 * guiding questions" (see /memo §4) as the project's *active* design
 * questions — the ones we'd most like external input on.
 *
 * This is the single most "research community" beat on the page: it
 * says we don't have all the answers, here's what we're stuck on,
 * come help us think about it.
 *
 * Why these four (out of ten):
 *   - Q1 (entities) and Q9 (infrastructure ownership) are governance
 *     questions where outside perspectives — regulators, deployers,
 *     services — are the most useful.
 *   - Q7 (privacy vs. transparency) is the question with the most
 *     legitimate disagreement; we expect this list to evolve.
 *   - Q10 (voluntary vs. mandated) anchors the policy framing and is
 *     where adoption advocates and incumbents tend to weigh in first.
 *
 * Each "Weigh in" link routes to /join. As GitHub Discussions / issue
 * labels mature, swap the per-item href for a deep link.
 */

type OpenQuestion = {
  /** The number from the memo's table (1-indexed). */
  number: number;
  /** Short heading for the question — concrete, not a topic label. */
  title: string;
  /** Optional subtitle under the title (e.g. entity options). */
  subtitle?: string;
  /** One-line gloss explaining why this is contested. */
  gloss: string;
  /** Where the "Weigh in" link should go. /join for now. */
  href: string;
};

const QUESTIONS: readonly OpenQuestion[] = [
  {
    number: 1,
    title: "Which entity or entities should an ID identify?",
    subtitle: "Agent, provider, deployer — or all three?",
    gloss:
      "Different services, different jurisdictions, different answers. Authentication burden scales with risk.",
    href: "/join",
  },
  {
    number: 7,
    title:
      "How should IDs balance privacy with transparency and accountability?",
    gloss:
      "Selective disclosure, pseudonymity, and verifiable credentials all trade differently.",
    href: "/join",
  },
  {
    number: 9,
    title: "Who should own and operate ID infrastructure?",
    gloss:
      "Governments, registries, providers, or open consortia each create different incentives, attack surfaces, and lock-in.",
    href: "/join",
  },
  {
    number: 10,
    title: "Voluntary adoption or mandated compliance, and where?",
    gloss:
      "Mandates close gaps faster but risk capture; voluntary regimes need a credible adoption story.",
    href: "/join",
  },
];

export function OpenQuestions() {
  return (
    <section
      aria-labelledby="open-questions-heading"
      className="border-b border-slate-200/80 bg-[#FBF7F0]"
    >
      <div className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 sm:py-16">
        {/* ── Header row ──────────────────────────────────────────── */}
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div className="flex max-w-2xl flex-col gap-2">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#6B6B6B]">
              Open questions
            </p>
            <h2
              id="open-questions-heading"
              className="text-3xl font-semibold tracking-tight text-[#1a2744] sm:text-4xl"
            >
              Where we&apos;d love your input
            </h2>
            <p className="text-base leading-relaxed text-slate-600">
              Four of the memo&apos;s{" "}
              <Link
                href="/memo#options"
                className="text-[#1a2744] underline decoration-[#1a2744]/30 underline-offset-4 hover:decoration-[#1a2744]"
              >
                ten guiding questions
              </Link>{" "}
              that benefit most from outside perspective.
            </p>
          </div>
        </div>

        {/* ── Questions list ──────────────────────────────────────── */}
        <ol className="mt-10 grid list-none gap-4 md:grid-cols-2">
          {QUESTIONS.map((q) => (
            <li key={q.number}>
              <Link
                href={q.href}
                className="group block h-full rounded-2xl border border-slate-200 bg-white p-6 transition-all hover:-translate-y-0.5 hover:border-[#1a2744]/40 hover:shadow-[0_2px_4px_rgba(15,23,42,0.05),0_12px_28px_rgba(15,23,42,0.06)]"
              >
                <div className="flex items-start gap-4">
                  <span
                    className="flex h-8 w-8 flex-none items-center justify-center rounded-full border border-[#1a2744]/15 bg-[#FBF7F0] text-sm font-semibold text-[#1a2744]"
                    aria-hidden
                  >
                    {q.number}
                  </span>
                  <div className="flex flex-col gap-2">
                    <h3 className="text-base font-semibold leading-snug text-[#1a2744] sm:text-lg">
                      {q.title}
                    </h3>
                    {q.subtitle ? (
                      <p className="text-sm font-medium text-slate-500">
                        {q.subtitle}
                      </p>
                    ) : null}
                    <p className="text-sm leading-relaxed text-slate-600">
                      {q.gloss}
                    </p>
                    <span className="mt-1 inline-flex items-center gap-1.5 text-sm font-semibold text-[#0f4c5c] underline-offset-4 group-hover:underline">
                      Weigh in
                      <span aria-hidden>→</span>
                    </span>
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export default OpenQuestions;
