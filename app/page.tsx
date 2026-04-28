import Link from "next/link";
import { AgentStoryCarousel } from "@/components/home/AgentStoryCarousel";
import { LatestResearch } from "@/components/home/LatestResearch";
import { Workstreams } from "@/components/home/Workstreams";
import { OpenQuestions } from "@/components/home/OpenQuestions";
import { JoinCommunity } from "@/components/home/JoinCommunity";
import { PocViewSwitcher } from "@/components/poc/PocViewSwitcher";
import { siteConfig } from "@/lib/site";
import { homeContent, homeWide } from "@/lib/layout";

const heroNoiseStyle = {
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 256 256'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
} as const;

const PRIMARY_STEWARD = siteConfig.stewards[0];

export default function HomePage() {
  return (
    <div>
      {/* ── Hero ───────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden border-b border-white/10 bg-[#161616]">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.14] mix-blend-overlay"
          style={heroNoiseStyle}
          aria-hidden
        />

        <div
          className={`${homeContent} flex flex-col items-center py-14 text-center sm:py-20`}
        >
          <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-zinc-400">
            {siteConfig.eyebrow}
          </p>
          <h1 className="mt-4 text-4xl font-normal tracking-tight text-white sm:text-5xl md:text-6xl">
            {siteConfig.title}
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-zinc-400 sm:text-lg">
            {siteConfig.tagline}
          </p>
          <div className="mt-9 flex flex-col items-center gap-3 sm:flex-row sm:gap-4">
            <Link
              href="/memo"
              className="inline-flex rounded-full bg-zinc-100 px-7 py-3 text-sm font-semibold text-zinc-950 transition-colors hover:bg-white"
            >
              Read the policy memo
            </Link>
            <Link
              href="/join"
              className="inline-flex rounded-full border border-white/20 px-7 py-3 text-sm font-semibold text-white transition-colors hover:border-white/40 hover:bg-white/[0.06]"
            >
              Join the community
            </Link>
            <a
              href={siteConfig.githubUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-sm font-medium text-zinc-300 underline-offset-4 transition-colors hover:text-white hover:underline"
            >
              View on GitHub
              <span aria-hidden>→</span>
            </a>
          </div>

          {/* Hosted-by line — quiet, italic, sets the steward framing. */}
          <p className="mt-9 text-xs text-zinc-500">
            Stewarded by{" "}
            <a
              href={PRIMARY_STEWARD.href}
              target="_blank"
              rel="noreferrer"
              className="font-medium text-zinc-300 underline-offset-4 hover:text-white hover:underline"
            >
              {PRIMARY_STEWARD.name}
            </a>
          </p>
        </div>
      </section>

      {/* ── Three-card story: arrival, verification, decision ──────── */}
      <AgentStoryCarousel />

      {/* ── Workstreams: what's shipping in public ─────────────────── */}
      <Workstreams />

      {/* ── Recently published research outputs ────────────────────── */}
      <LatestResearch />

      {/* ── Interactive PoC ────────────────────────────────────────── */}
      <section className="border-b border-slate-200/80 bg-slate-50/50">
        <div className={`${homeWide} pb-12 pt-12 sm:pb-16 sm:pt-14`}>
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#6B6B6B]">
            Proof of concept
          </p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight text-[#1a2744] sm:text-4xl">
            See it working
          </h2>
          <div
            className="mt-3 h-px max-w-md bg-gradient-to-r from-[#ea580c] via-[#ea580c]/50 to-transparent"
            aria-hidden
          />
          <PocViewSwitcher className="mt-8" />
        </div>
      </section>

      {/* ── Open questions: where we'd love your input ─────────────── */}
      <OpenQuestions />

      {/* ── Join the community ─────────────────────────────────────── */}
      <JoinCommunity />
    </div>
  );
}
