import Link from "next/link";
import type { ReactNode } from "react";
import { siteConfig } from "@/lib/site";
import { withPublicBasePath } from "@/lib/paths";

/**
 * JoinCommunity
 * ─────────────
 * The home page's last content beat before the stewards row + footer.
 * Three "lanes" of contribution + a primary CTA into /join. Modeled on
 * EvalEval's "Get Involved · Join Our Community" footer block, but
 * mapped to surfaces this project actually has today: the memo PDF,
 * the GitHub repo, and the /join page.
 *
 * The dark navy background is intentional — it visually closes the
 * page (mirroring the dark hero at the top) and gives the CTA the
 * weight it needs to read as the page's call-to-action of last resort.
 */

const PDF_HREF = withPublicBasePath(
  "/docs/agent-ids-policy-memo-sash-2026-03-31.pdf",
);

type Lane = {
  heading: string;
  body: string;
  cta: string;
  href: string;
  external?: boolean;
  icon: ReactNode;
};

const LANES: readonly Lane[] = [
  {
    heading: "Read & cite",
    body: "Download the policy memo, share it with collaborators, and cite it in your own work.",
    cta: "Download the memo",
    href: PDF_HREF,
    external: true,
    icon: <PaperIcon />,
  },
  {
    heading: "Contribute on GitHub",
    body: "Open an issue, start a discussion, or send a pull request. The repo is the source of truth.",
    cta: "Open the repo",
    href: siteConfig.githubUrl,
    external: true,
    icon: <RepoIcon />,
  },
  {
    heading: "Get in touch",
    body: "Researchers, regulators, and industry collaborators welcome — tell us what you’re working on.",
    cta: "Reach the team",
    href: "/join",
    icon: <MailIcon />,
  },
];

export function JoinCommunity() {
  return (
    <section
      aria-labelledby="join-heading"
      className="border-b border-white/10 bg-[#1a2744] text-white"
    >
      <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div className="flex max-w-2xl flex-col gap-2">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-white/60">
              Get involved
            </p>
            <h2
              id="join-heading"
              className="text-3xl font-semibold tracking-tight text-white sm:text-4xl"
            >
              Join the community
            </h2>
            <p className="text-base leading-relaxed text-white/70">
              We&apos;d love to shape the future of agent IDs with you. Here are
              three ways to contribute.
            </p>
          </div>
          <Link
            href="/join"
            className="inline-flex self-start rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-[#1a2744] transition-colors hover:bg-zinc-100 md:self-end"
          >
            Join the community
            <span aria-hidden> →</span>
          </Link>
        </div>

        <ul className="mt-10 grid list-none gap-4 md:grid-cols-3">
          {LANES.map((lane) => (
            <li key={lane.heading}>
              <LaneCard lane={lane} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default JoinCommunity;

/* ────────────────────────────────────────────────────────────── */
/* Lane card                                                       */
/* ────────────────────────────────────────────────────────────── */

function LaneCard({ lane }: { lane: Lane }): ReactNode {
  const className =
    "group flex h-full flex-col gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-6 transition-colors hover:border-white/25 hover:bg-white/[0.07]";

  const inner = (
    <>
      <span
        className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-white"
        aria-hidden
      >
        {lane.icon}
      </span>
      <h3 className="text-lg font-semibold tracking-tight text-white">
        {lane.heading}
      </h3>
      <p className="text-sm leading-relaxed text-white/70">{lane.body}</p>
      <span className="mt-auto inline-flex items-center gap-1.5 pt-2 text-sm font-semibold text-white underline-offset-4 group-hover:underline">
        {lane.cta}
        <span aria-hidden>→</span>
      </span>
    </>
  );

  if (lane.external) {
    return (
      <a
        href={lane.href}
        target="_blank"
        rel="noreferrer"
        className={className}
      >
        {inner}
      </a>
    );
  }

  return (
    <Link href={lane.href} className={className}>
      {inner}
    </Link>
  );
}

/* ────────────────────────────────────────────────────────────── */
/* Inline icons (kept tiny + local)                                */
/* ────────────────────────────────────────────────────────────── */

function PaperIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M7 4h7l5 5v11a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M14 4v5h5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M9 13h7M9 17h5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function RepoIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M6 4.5A1.5 1.5 0 0 1 7.5 3H18a1 1 0 0 1 1 1v14.5a1 1 0 0 1-1 1H7.5A1.5 1.5 0 0 1 6 18V4.5Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M6 17.5A1.5 1.5 0 0 1 7.5 16H19"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M10 7h5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect
        x="3.5"
        y="5.5"
        width="17"
        height="13"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path
        d="m4 7 8 6 8-6"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}
