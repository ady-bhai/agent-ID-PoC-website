import Link from "next/link";
import type { ReactNode } from "react";
import { siteConfig } from "@/lib/site";

/**
 * Workstreams
 * ───────────
 * Home-page section that renders the community's active workstreams as
 * a 3-card row with status pills. The point of this section is to make
 * the work *visible in pieces* — the move that turns a research
 * publication into a research community. Modeled on EvalEval's
 * "Current Projects · Research · Infrastructure · Organization" row.
 *
 * Each card is intentionally thinner than a `LatestResearch` card: no
 * decorative top illustration, just status + heading + one-line update
 * + a "Track on GitHub" link. The visual language (rounded-2xl, white
 * card on cream, navy headings) deliberately matches `LatestResearch`
 * so the homepage reads as one design system, not a scrapbook.
 *
 * When a workstream's status changes, edit `WORKSTREAMS` below — the
 * pill colour follows automatically from `STATUS_STYLES`.
 */

type Status = "shipped" | "in-progress" | "planned";

type Workstream = {
  status: Status;
  /** Short label rendered as the eyebrow above the card title. */
  area: string;
  title: string;
  /**
   * One-line update describing where this workstream is right now.
   * Keep it concrete enough that a stranger can tell what's happening.
   */
  update: string;
  /** Optional next milestone, rendered after the update. */
  next?: string;
  /** Where "Track" should point — usually a GitHub label or PR. */
  trackHref: string;
  trackLabel: string;
};

const STATUS_STYLES: Record<Status, { label: string; pill: string; dot: string }> =
  {
    shipped: {
      label: "Shipped",
      pill: "border-emerald-200 bg-emerald-50 text-emerald-800",
      dot: "bg-emerald-500",
    },
    "in-progress": {
      label: "In progress",
      pill: "border-[#ea580c]/25 bg-[#ea580c]/10 text-[#9a3412]",
      dot: "bg-[#ea580c]",
    },
    planned: {
      label: "Planned",
      pill: "border-slate-200 bg-slate-50 text-slate-600",
      dot: "bg-slate-400",
    },
  };

const WORKSTREAMS: readonly Workstream[] = [
  {
    status: "shipped",
    area: "Spec & policy",
    title: "Designing Agent IDs",
    update:
      "v1 policy memo published — components, landscape, incentives, and ten guiding questions.",
    next: "v0.2 incorporating stakeholder feedback.",
    trackHref: `${siteConfig.githubUrl}/labels/spec`,
    trackLabel: "Track on GitHub",
  },
  {
    status: "in-progress",
    area: "Reference implementation",
    title: "Interactive proof of concept",
    update:
      "Live on this site — explore a credential, see what each layer answers.",
    next: "Signed-attestation packet demo with binding between deployer and provider.",
    trackHref: `${siteConfig.githubUrl}/labels/poc`,
    trackLabel: "Track on GitHub",
  },
  {
    status: "in-progress",
    area: "Field notes & consultations",
    title: "Stakeholder conversations",
    update:
      "Synthesising notes from public-sector, industry, and standards-body conversations.",
    next: "Public field-notes write-up.",
    trackHref: `${siteConfig.githubUrl}/labels/field-notes`,
    trackLabel: "Track on GitHub",
  },
];

export function Workstreams() {
  return (
    <section
      aria-labelledby="workstreams-heading"
      className="border-b border-slate-200/80 bg-white"
    >
      <div className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 sm:py-16">
        {/* ── Header row: eyebrow + title + lede ──────────────────── */}
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div className="flex max-w-xl flex-col gap-2">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#6B6B6B]">
              Workstreams
            </p>
            <h2
              id="workstreams-heading"
              className="text-3xl font-semibold tracking-tight text-[#1a2744] sm:text-4xl"
            >
              What we&apos;re working on
            </h2>
            <p className="text-base leading-relaxed text-slate-600">
              The work, in pieces. Each track ships in public; pull a thread
              and contribute where it&apos;s most useful to you.
            </p>
          </div>
          <Link
            href={siteConfig.githubUrl}
            target="_blank"
            rel="noreferrer"
            className="self-start rounded-full border border-slate-300 px-4 py-1.5 text-sm font-medium text-slate-700 transition-colors hover:border-[#1a2744] hover:bg-[#1a2744] hover:text-white md:self-end"
          >
            View repo
            <span aria-hidden> →</span>
          </Link>
        </div>

        {/* ── Cards ───────────────────────────────────────────────── */}
        <ul className="mt-10 grid list-none gap-6 md:grid-cols-3">
          {WORKSTREAMS.map((item) => (
            <li key={item.title}>
              <WorkstreamCard item={item} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default Workstreams;

/* ────────────────────────────────────────────────────────────── */
/* Card                                                            */
/* ────────────────────────────────────────────────────────────── */

function WorkstreamCard({ item }: { item: Workstream }): ReactNode {
  const status = STATUS_STYLES[item.status];

  return (
    <article className="group flex h-full flex-col gap-4 rounded-2xl border border-slate-200 bg-[#FBF7F0] p-6 transition-all hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-[0_2px_4px_rgba(15,23,42,0.05),0_12px_28px_rgba(15,23,42,0.06)]">
      <div className="flex items-center justify-between gap-3">
        <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#0f4c5c]">
          {item.area}
        </span>
        <span
          className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] ${status.pill}`}
        >
          <span className={`h-1.5 w-1.5 rounded-full ${status.dot}`} aria-hidden />
          {status.label}
        </span>
      </div>

      <h3 className="text-lg font-semibold leading-snug text-[#1a2744]">
        {item.title}
      </h3>

      <p className="text-sm leading-relaxed text-slate-700">{item.update}</p>

      {item.next ? (
        <p className="text-sm leading-relaxed text-slate-500">
          <span className="font-semibold text-slate-600">Next:</span>{" "}
          {item.next}
        </p>
      ) : null}

      <a
        href={item.trackHref}
        target="_blank"
        rel="noreferrer"
        className="mt-auto inline-flex items-center gap-1.5 pt-1 text-sm font-semibold text-[#1a2744] underline-offset-4 hover:underline"
      >
        {item.trackLabel}
        <span aria-hidden>→</span>
      </a>
    </article>
  );
}
