import Link from "next/link";
import { siteConfig } from "@/lib/site";

/**
 * Footer
 * ──────
 * Three-column layout:
 *   - About: project name + one-line description.
 *   - Community: navigational links (memo, demo, join, repo).
 *   - Initiative / legal: who runs it + the year.
 *
 * Width matches the new homepage wide sections (`max-w-6xl`) so the
 * footer doesn't read as narrower than the page above it.
 */
export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-auto border-t border-slate-200 bg-slate-50">
      <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-10 md:grid-cols-3">
          {/* ── About ────────────────────────────────────────────── */}
          <div className="flex flex-col gap-3">
            <p className="text-sm font-semibold text-[#1a2744]">
              {siteConfig.name}
            </p>
            <p className="text-sm leading-relaxed text-slate-600">
              An open research community designing verifiable identity
              infrastructure for AI agents.
            </p>
          </div>

          {/* ── Community links ──────────────────────────────────── */}
          <nav aria-label="Footer community" className="flex flex-col gap-3">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">
              Community
            </p>
            <ul className="flex list-none flex-col gap-2">
              <li>
                <Link
                  href="/memo"
                  className="text-sm text-slate-700 underline-offset-4 hover:text-[#1a2744] hover:underline"
                >
                  Read the memo
                </Link>
              </li>
              <li>
                <Link
                  href="/demo"
                  className="text-sm text-slate-700 underline-offset-4 hover:text-[#1a2744] hover:underline"
                >
                  Interactive demo
                </Link>
              </li>
              <li>
                <Link
                  href="/join"
                  className="text-sm text-slate-700 underline-offset-4 hover:text-[#1a2744] hover:underline"
                >
                  Join the community
                </Link>
              </li>
              <li>
                <a
                  href={siteConfig.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm text-slate-700 underline-offset-4 hover:text-[#1a2744] hover:underline"
                >
                  GitHub
                </a>
              </li>
            </ul>
          </nav>

          {/* ── Initiative / legal ─────────────────────────────────── */}
          <div className="flex flex-col gap-3">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">
              An initiative by
            </p>
            <ul className="flex list-none flex-col gap-2">
              {siteConfig.stewards.map((s) => (
                <li key={s.shortName}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm font-medium text-[#1a2744] underline-offset-4 hover:underline"
                  >
                    {s.name}
                  </a>
                </li>
              ))}
            </ul>
            <p className="mt-2 text-xs text-slate-500">
              © {year} {siteConfig.name} contributors.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
