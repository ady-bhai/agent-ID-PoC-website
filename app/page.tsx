import Link from "next/link";
import { AgentIdPoc } from "@/components/poc/AgentIdPoc";
import { AgentStoryCarousel } from "@/components/home/AgentStoryCarousel";
import { LatestResearch } from "@/components/home/LatestResearch";
import { FigureSwitcher } from "@/components/FigureSwitcher";
import { HomeFigure } from "@/components/HomeFigure";
import { siteConfig } from "@/lib/site";

/** Matches `Nav` (`max-w-4xl` + `px-4 sm:px-6`) so hero and PoC share one left edge. */
const homeContent =
  "relative mx-auto w-full max-w-4xl px-4 sm:px-6" as const;

const heroNoiseStyle = {
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 256 256'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
} as const;

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
          className={`${homeContent} flex flex-col items-center py-20 text-center sm:py-28`}
        >
          <h1 className="text-4xl font-normal tracking-tight text-white sm:text-5xl md:text-6xl">
            {siteConfig.title}
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-zinc-400 sm:text-lg">
            {siteConfig.tagline}
          </p>
          <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:gap-5">
            <Link
              href="/demo"
              className="inline-flex rounded-full bg-zinc-100 px-7 py-3 text-sm font-semibold text-zinc-950 transition-colors hover:bg-white"
            >
              Interactive demo
            </Link>
            <Link
              href="/memo"
              className="inline-flex items-center gap-1 text-sm font-medium text-zinc-300 underline-offset-4 transition-colors hover:text-white hover:underline"
            >
              Read the policy memo
              <span aria-hidden>→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Three-card story: arrival, verification, decision ──────── */}
      <AgentStoryCarousel />

      {/* ── Latest research: Memo + upcoming outputs ──────────────── */}
      <LatestResearch />

      {/* ── Interactive PoC ────────────────────────────────────────── */}
      <section className="border-b border-slate-200/80 bg-slate-50/50">
        <div className={`${homeContent} pb-10 pt-8 sm:pb-12 sm:pt-10`}>
          <h2 className="text-lg font-semibold tracking-tight text-[#1a2744]">
            Interactive proof of concept
          </h2>
          <div
            className="mt-2 h-px max-w-md bg-gradient-to-r from-[#ea580c] via-[#ea580c]/50 to-transparent"
            aria-hidden
          />
          <FigureSwitcher
            className="mt-6"
            syncHash
            defaultId="poc"
            ariaLabel="Proof of concept figures"
            items={[
              {
                id: "poc",
                label: "Interactive PoC",
                subtitle: "Click to explore the credential",
                content: <AgentIdPoc variant="full" />,
              },
              {
                id: "standards",
                label: "Standards landscape",
                subtitle: "Where each layer fits",
                content: (
                  <HomeFigure
                    src="/images/figures/standards-matrix.png"
                    width={1206}
                    height={686}
                    alt="Matrix comparing common standards against service questions such as provider behind the agent, deployer, capabilities, safety evidence, and incident recourse. Composite Agent ID rows show direct answers across columns."
                    caption="Which questions each layer helps answer — no single standard provides a complete answer on its own."
                  />
                ),
              },
              {
                id: "packet",
                label: "What's in the packet",
                subtitle: "How attestations stack",
                content: (
                  <HomeFigure
                    src="/images/figures/service-request-card.png"
                    width={1706}
                    height={858}
                    alt="Diagram of a service request card packet: stacked signed blocks for provider identity, model version, incident response endpoint, deployer identity and capabilities, independent safety assurance, and instance-level fields, with brackets noting independent signers and cryptographic binding."
                    caption="How attestations stack and bind so a valid provider signature cannot be reused with an unauthorized deployer."
                  />
                ),
              },
            ]}
          />
        </div>
      </section>
    </div>
  );
}
