import { siteConfig } from "@/lib/site";

/**
 * ProjectIntro
 * ────────────
 * Top section of the /about page. Server component — no client APIs needed.
 * The copy intentionally pulls from `siteConfig` so it stays in lockstep
 * with the rest of the site (homepage hero, metadata).
 *
 * The "View source on GitHub" link is the open-source signal: kept small
 * and inline so it reads as collaborative framing, not a marketing CTA.
 */
export function ProjectIntro() {
  return (
    <section
      aria-labelledby="about-project-heading"
      className="border-b border-[rgba(26,26,26,0.12)]"
      style={{ padding: "clamp(56px, 10vw, 96px) clamp(16px, 5vw, 48px)" }}
    >
      <div className="mx-auto flex max-w-3xl flex-col gap-6">
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#6B6B6B]">
          About this project
        </p>
        <h1
          id="about-project-heading"
          className="text-3xl font-semibold leading-tight tracking-tight text-[#1A2744] sm:text-4xl"
        >
          {siteConfig.tagline}
        </h1>
        <div className="flex flex-col gap-4 text-base leading-relaxed text-[#1A1A1A] sm:text-lg">
          <p>{siteConfig.description}</p>
          <p>
            We work in the open with the Singapore AI Safety Hub. The memo,
            the proof of concept, and the meeting notes that shaped them all
            live in one repository — read the work, file an issue, or open a
            pull request.
          </p>
        </div>
        <p className="text-sm text-[#6B6B6B]">
          <a
            href={siteConfig.githubUrl}
            target="_blank"
            rel="noreferrer"
            className="underline decoration-[#1A2744]/40 underline-offset-4 transition-colors hover:text-[#1A2744] hover:decoration-[#1A2744]"
          >
            View source on GitHub
          </a>
          <span aria-hidden> →</span>
        </p>
      </div>
    </section>
  );
}

export default ProjectIntro;
