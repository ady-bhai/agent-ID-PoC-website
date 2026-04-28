import Link from "next/link";
import type { ReactNode } from "react";

/**
 * LatestResearch ("Recently published")
 * ──────────────────────────────────────
 * Home-page section that surfaces the community's recent research
 * outputs as a three-card row. Visual reference: evalevalai.com — open,
 * editorial, collaborative-research vibe.
 *
 * Each card has:
 *   - a decorative top illustration (inline SVG, server-renderable)
 *   - a date stamp
 *   - a title that links to the artefact
 *   - a short description
 *   - optional tag pills
 *
 * Right now only the policy memo is published. The other two cards are
 * intentionally rendered as upcoming placeholders with a "Coming soon"
 * pill and a "Get notified" link into /join — the section reads as a
 * public roadmap rather than vapourware. When those artefacts ship,
 * promote them by populating the matching entry in `RESEARCH_ITEMS`
 * and dropping the `upcoming` flag.
 *
 * The "View all" link points at the /about timeline, which is the
 * canonical chronological view of the project's outputs. Swap to a
 * dedicated /research index page if/when that lands.
 */

type ResearchItem = {
  date: string;
  kind: string;
  title: string;
  description: string;
  href: string;
  tags: readonly string[];
  illustration: ReactNode;
  /** When true, render as a faded "Coming soon" card and disable the link. */
  upcoming?: boolean;
};

const RESEARCH_ITEMS: readonly ResearchItem[] = [
  {
    date: "Mar 2026",
    kind: "Policy memo",
    title: "Designing Agent IDs",
    description:
      "A SASH policy memo mapping the design space for agent ID systems: functions, existing protocols, private incentives, and ten guiding questions.",
    href: "/memo",
    tags: ["Policy memo", "Agent IDs", "SASH"],
    illustration: <MemoIllustration />,
  },
  {
    date: "Coming soon",
    kind: "Proof of concept",
    title: "Interactive agent ID demo",
    description:
      "A walkthrough of how an agent ID changes a service interaction — what the polyclinic sees, what it can verify, and what changes when fields are missing.",
    href: "/demo",
    tags: ["Proof of concept", "Demo"],
    illustration: <DemoIllustration />,
  },
  {
    date: "In progress",
    kind: "Stakeholder consultations",
    title: "Notes from public-sector and industry meetings",
    description:
      "Synthesised takeaways from conversations with regulators, model providers, and services on what agent IDs need to support.",
    href: "#",
    tags: ["Consultations", "Field notes"],
    illustration: <NotesIllustration />,
    upcoming: true,
  },
];

export function LatestResearch() {
  return (
    <section
      aria-labelledby="latest-research-heading"
      className="border-b border-slate-200/80 bg-[#FBF7F0]"
    >
      <div className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 sm:py-16">
        {/* ── Header row: eyebrow + title + view-all ──────────────── */}
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="flex flex-col gap-2">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#6B6B6B]">
              Research outputs
            </p>
            <h2
              id="latest-research-heading"
              className="text-3xl font-semibold tracking-tight text-[#1a2744] sm:text-4xl"
            >
              Recently published
            </h2>
          </div>
          <Link
            href="/about"
            className="inline-flex items-center gap-2 rounded-full border border-[#1a2744] px-4 py-1.5 text-sm font-semibold text-[#1a2744] transition-colors hover:bg-[#1a2744] hover:text-white"
          >
            View all
            <span aria-hidden>→</span>
          </Link>
        </div>

        {/* ── Cards ─────────────────────────────────────────────── */}
        <ul className="mt-10 grid list-none gap-6 md:grid-cols-3">
          {RESEARCH_ITEMS.map((item) => (
            <li key={item.title}>
              <ResearchCard item={item} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default LatestResearch;

/* ────────────────────────────────────────────────────────────── */
/* Card                                                            */
/* ────────────────────────────────────────────────────────────── */

function ResearchCard({ item }: { item: ResearchItem }) {
  const isLink = !item.upcoming && item.href !== "#";

  return (
    <article
      className={`group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_1px_3px_rgba(15,23,42,0.06),0_8px_24px_rgba(15,23,42,0.05)] transition-all ${
        isLink
          ? "hover:-translate-y-0.5 hover:shadow-[0_2px_4px_rgba(15,23,42,0.08),0_12px_32px_rgba(15,23,42,0.08)]"
          : ""
      }`}
    >
      <div className="relative aspect-[16/10] w-full border-b border-slate-200 bg-[#F5F0E8]">
        {item.illustration}
        {item.upcoming ? (
          <span className="absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-full border border-[#0f4c5c]/20 bg-white/95 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#0f4c5c] shadow-sm backdrop-blur">
            <span
              className="h-1.5 w-1.5 rounded-full bg-[#0f4c5c]"
              aria-hidden
            />
            Coming soon
          </span>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-6">
        <div className="flex items-center justify-between gap-3">
          <time className="text-xs font-medium uppercase tracking-[0.14em] text-slate-500">
            {item.date}
          </time>
          <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#0f4c5c]">
            {item.kind}
          </span>
        </div>

        <h3 className="text-lg font-semibold leading-snug text-[#1a2744]">
          {isLink ? (
            <Link
              href={item.href}
              className="underline-offset-4 group-hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1a2744]/30"
            >
              {item.title}
            </Link>
          ) : (
            item.title
          )}
        </h3>

        <p className="text-sm leading-relaxed text-slate-600">
          {item.description}
        </p>

        {item.tags.length > 0 ? (
          <ul className="flex flex-wrap gap-2 pt-1">
            {item.tags.map((tag) => (
              <li
                key={tag}
                className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600"
              >
                {tag}
              </li>
            ))}
          </ul>
        ) : null}

        {item.upcoming ? (
          <Link
            href="/join"
            className="mt-auto inline-flex items-center gap-1.5 pt-2 text-sm font-semibold text-[#0f4c5c] underline-offset-4 hover:underline"
          >
            Get notified
            <span aria-hidden>→</span>
          </Link>
        ) : null}
      </div>
    </article>
  );
}

/* ────────────────────────────────────────────────────────────── */
/* Inline SVG illustrations                                        */
/* ────────────────────────────────────────────────────────────── */
/* Kept local to this file: small enough that a separate module    */
/* would add more boilerplate than it removes. Each one fills its   */
/* parent and uses muted site palette colours.                      */

function MemoIllustration() {
  return (
    <svg
      viewBox="0 0 320 200"
      role="img"
      aria-hidden
      className="h-full w-full"
      preserveAspectRatio="xMidYMid slice"
    >
      <rect width="320" height="200" fill="#F5F0E8" />
      <g transform="translate(70 30)">
        <rect
          x="0"
          y="0"
          width="180"
          height="140"
          rx="6"
          fill="#FFFFFF"
          stroke="#1a2744"
          strokeOpacity="0.18"
        />
        {[24, 44, 64, 84, 104].map((y, i) => (
          <rect
            key={y}
            x="16"
            y={y}
            width={i === 0 ? 110 : i === 4 ? 78 : 148}
            height="6"
            rx="3"
            fill="#1a2744"
            fillOpacity={i === 0 ? 0.55 : 0.18}
          />
        ))}
        {/* Stamp */}
        <circle
          cx="148"
          cy="118"
          r="14"
          fill="none"
          stroke="#ea580c"
          strokeOpacity="0.6"
          strokeWidth="2"
        />
        <text
          x="148"
          y="121"
          textAnchor="middle"
          fontSize="8"
          fontWeight="700"
          fill="#ea580c"
          fillOpacity="0.85"
          fontFamily="ui-sans-serif, system-ui, sans-serif"
        >
          MEMO
        </text>
      </g>
    </svg>
  );
}

function DemoIllustration() {
  return (
    <svg
      viewBox="0 0 320 200"
      role="img"
      aria-hidden
      className="h-full w-full"
      preserveAspectRatio="xMidYMid slice"
    >
      <rect width="320" height="200" fill="#F5F0E8" />
      {/* Browser frame */}
      <g transform="translate(40 32)">
        <rect
          x="0"
          y="0"
          width="240"
          height="136"
          rx="8"
          fill="#FFFFFF"
          stroke="#1a2744"
          strokeOpacity="0.18"
        />
        <rect
          x="0"
          y="0"
          width="240"
          height="22"
          rx="8"
          fill="#1a2744"
          fillOpacity="0.06"
        />
        {[10, 22, 34].map((cx) => (
          <circle
            key={cx}
            cx={cx}
            cy="11"
            r="3"
            fill="#1a2744"
            fillOpacity="0.22"
          />
        ))}
        {/* Two columns: agent → service */}
        <rect
          x="20"
          y="42"
          width="86"
          height="76"
          rx="6"
          fill="#1a2744"
          fillOpacity="0.05"
        />
        <rect
          x="134"
          y="42"
          width="86"
          height="76"
          rx="6"
          fill="#0f4c5c"
          fillOpacity="0.08"
        />
        {/* Arrow */}
        <path
          d="M110 80 L130 80"
          stroke="#ea580c"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M126 76 L130 80 L126 84"
          fill="none"
          stroke="#ea580c"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Token chips */}
        {[58, 74, 90].map((y) => (
          <rect
            key={y}
            x="28"
            y={y}
            width="70"
            height="6"
            rx="3"
            fill="#1a2744"
            fillOpacity={y === 58 ? 0.55 : 0.22}
          />
        ))}
        {[58, 74, 90].map((y) => (
          <rect
            key={`r-${y}`}
            x="142"
            y={y}
            width="70"
            height="6"
            rx="3"
            fill="#0f4c5c"
            fillOpacity={y === 58 ? 0.6 : 0.25}
          />
        ))}
      </g>
    </svg>
  );
}

function NotesIllustration() {
  return (
    <svg
      viewBox="0 0 320 200"
      role="img"
      aria-hidden
      className="h-full w-full"
      preserveAspectRatio="xMidYMid slice"
    >
      <rect width="320" height="200" fill="#F5F0E8" />
      {/* Three speech bubbles */}
      <g transform="translate(28 38)">
        <rect
          x="0"
          y="0"
          width="120"
          height="48"
          rx="10"
          fill="#FFFFFF"
          stroke="#1a2744"
          strokeOpacity="0.18"
        />
        <rect x="14" y="14" width="86" height="6" rx="3" fill="#1a2744" fillOpacity="0.55" />
        <rect x="14" y="28" width="64" height="6" rx="3" fill="#1a2744" fillOpacity="0.22" />
      </g>
      <g transform="translate(140 78)">
        <rect
          x="0"
          y="0"
          width="150"
          height="48"
          rx="10"
          fill="#FFFFFF"
          stroke="#0f4c5c"
          strokeOpacity="0.28"
        />
        <rect x="14" y="14" width="110" height="6" rx="3" fill="#0f4c5c" fillOpacity="0.6" />
        <rect x="14" y="28" width="78" height="6" rx="3" fill="#0f4c5c" fillOpacity="0.28" />
      </g>
      <g transform="translate(60 120)">
        <rect
          x="0"
          y="0"
          width="100"
          height="42"
          rx="10"
          fill="#FFFFFF"
          stroke="#ea580c"
          strokeOpacity="0.4"
        />
        <rect x="14" y="12" width="68" height="6" rx="3" fill="#ea580c" fillOpacity="0.55" />
        <rect x="14" y="24" width="50" height="6" rx="3" fill="#ea580c" fillOpacity="0.25" />
      </g>
    </svg>
  );
}
