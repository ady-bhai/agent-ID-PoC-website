import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/lib/site";
import { withPublicBasePath } from "@/lib/paths";

export const metadata: Metadata = {
  title: "Join the community",
  description:
    "Researchers, regulators, and industry collaborators welcome. Three concrete ways to plug into the Agent ID research community.",
};

const PDF_HREF = withPublicBasePath(
  "/docs/agent-ids-policy-memo-sash-2026-03-31.pdf",
);

const CONTACT_EMAIL = "agent-ids@aisafety.sg";

/**
 * /join — replaces the old /contact page.
 *
 * Three concrete contribution paths surfaced as cards (read & cite,
 * contribute on GitHub, get in touch), a "who this is for" list to
 * give different audiences a quick sense of belonging, and a soft
 * email CTA at the bottom. No form yet — `mailto:` is honest about
 * the current cadence; swap in Formspree/Tally when volume justifies.
 *
 * Visual language deliberately matches the rest of the site (cream
 * background, navy accents, FBF7F0 cards) so /join reads as a first-
 * class part of the site, not a contact-form afterthought.
 */
export default function JoinPage() {
  return (
    <div className="bg-[#F5F0E8] text-[#1A1A1A]">
      {/* ── Hero ───────────────────────────────────────────────────── */}
      <section className="border-b border-[rgba(26,26,26,0.12)]">
        <div className="mx-auto w-full max-w-4xl px-4 py-16 sm:px-6 sm:py-20">
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#6B6B6B]">
            Get involved
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-[#1a2744] sm:text-5xl">
            Join the community
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-slate-700">
            Agent IDs are too foundational a piece of infrastructure to design
            behind closed doors. Whoever you are — a researcher, a regulator,
            a deployer, a service provider, a curious student — there&rsquo;s
            a way to plug in.
          </p>
        </div>
      </section>

      {/* ── Three lanes ────────────────────────────────────────────── */}
      <section
        aria-labelledby="lanes-heading"
        className="border-b border-[rgba(26,26,26,0.12)] bg-[#FBF7F0]"
      >
        <div className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 sm:py-16">
          <h2
            id="lanes-heading"
            className="text-2xl font-semibold tracking-tight text-[#1a2744] sm:text-3xl"
          >
            Three ways to contribute
          </h2>
          <ul className="mt-8 grid list-none gap-5 md:grid-cols-3">
            <li>
              <LaneCard
                eyebrow="01 · Read & cite"
                heading="The policy memo"
                body="Download the SASH policy memo, share it, and cite it in your own work. The memo is the canonical statement of where the project stands."
                cta="Download the memo"
                href={PDF_HREF}
                external
              />
            </li>
            <li>
              <LaneCard
                eyebrow="02 · Contribute"
                heading="On GitHub"
                body="Open an issue, start a discussion, or send a pull request. The repo holds the memo source, the proof of concept, and the meeting notes."
                cta="Open the repo"
                href={siteConfig.githubUrl}
                external
              />
            </li>
            <li>
              <LaneCard
                eyebrow="03 · Get in touch"
                heading="By email"
                body="Tell us what you’re working on, what you disagree with, or what your organisation needs from agent ID infrastructure."
                cta={CONTACT_EMAIL}
                href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
                  "Agent IDs — joining the community",
                )}`}
              />
            </li>
          </ul>
        </div>
      </section>

      {/* ── Who this is for ────────────────────────────────────────── */}
      <section
        aria-labelledby="audiences-heading"
        className="border-b border-[rgba(26,26,26,0.12)]"
      >
        <div className="mx-auto w-full max-w-4xl px-4 py-14 sm:px-6 sm:py-16">
          <h2
            id="audiences-heading"
            className="text-2xl font-semibold tracking-tight text-[#1a2744] sm:text-3xl"
          >
            Who this community is for
          </h2>
          <ul className="mt-6 grid list-none gap-4 sm:grid-cols-2">
            {AUDIENCES.map((a) => (
              <li
                key={a.title}
                className="rounded-2xl border border-slate-200 bg-white p-5"
              >
                <p className="text-sm font-semibold text-[#1a2744]">
                  {a.title}
                </p>
                <p className="mt-1 text-sm leading-relaxed text-slate-600">
                  {a.body}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Closing CTA ────────────────────────────────────────────── */}
      <section className="bg-[#1a2744] text-white">
        <div className="mx-auto flex w-full max-w-4xl flex-col items-start gap-5 px-4 py-14 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-16">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-white/60">
              Questions?
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
              Drop us a line — we read every email.
            </h2>
          </div>
          <a
            href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
              "Agent IDs — questions",
            )}`}
            className="inline-flex flex-shrink-0 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-[#1a2744] transition-colors hover:bg-zinc-100"
          >
            Email the team
            <span aria-hidden> →</span>
          </a>
        </div>
      </section>

      {/* ── Quiet "back home" link ─────────────────────────────────── */}
      <div className="mx-auto w-full max-w-4xl px-4 py-8 text-center sm:px-6">
        <Link
          href="/"
          className="text-sm text-slate-500 underline-offset-4 hover:text-[#1a2744] hover:underline"
        >
          ← Back to home
        </Link>
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────── */
/* Data + sub-components                                           */
/* ────────────────────────────────────────────────────────────── */

const AUDIENCES = [
  {
    title: "Researchers",
    body: "Working on AI evaluation, identity, security, or governance — we want your sharp eyes on the open questions.",
  },
  {
    title: "Regulators & policymakers",
    body: "Designing rules that will need verifiable agent identity to enforce. Tell us what you’d want from this infrastructure.",
  },
  {
    title: "Model providers & deployers",
    body: "Shipping agents into the world. Help us pressure-test the spec against real deployment constraints.",
  },
  {
    title: "Services & infrastructure",
    body: "On the receiving end of agent traffic. Tell us what verification would actually move the needle.",
  },
] as const;

function LaneCard({
  eyebrow,
  heading,
  body,
  cta,
  href,
  external,
}: {
  eyebrow: string;
  heading: string;
  body: string;
  cta: string;
  href: string;
  external?: boolean;
}) {
  const className =
    "group flex h-full flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-6 transition-all hover:-translate-y-0.5 hover:border-[#1a2744]/40 hover:shadow-[0_2px_4px_rgba(15,23,42,0.05),0_12px_28px_rgba(15,23,42,0.06)]";

  const inner = (
    <>
      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#0f4c5c]">
        {eyebrow}
      </p>
      <h3 className="text-lg font-semibold tracking-tight text-[#1a2744]">
        {heading}
      </h3>
      <p className="text-sm leading-relaxed text-slate-600">{body}</p>
      <span className="mt-auto inline-flex items-center gap-1.5 break-all pt-2 text-sm font-semibold text-[#1a2744] underline-offset-4 group-hover:underline">
        {cta}
        <span aria-hidden>→</span>
      </span>
    </>
  );

  if (external) {
    return (
      <a href={href} target="_blank" rel="noreferrer" className={className}>
        {inner}
      </a>
    );
  }

  // mailto: links open in the user's mail client; treat as plain anchor.
  return (
    <a href={href} className={className}>
      {inner}
    </a>
  );
}
