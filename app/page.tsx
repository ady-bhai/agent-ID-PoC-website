import Link from "next/link";
import { AgentIdPoc } from "@/components/poc/AgentIdPoc";
import { siteConfig } from "@/lib/site";

/** Matches `Nav` (`max-w-4xl` + `px-4 sm:px-6`) so hero, copy, and PoC share one left edge. */
const homeContent =
  "relative mx-auto w-full max-w-4xl px-4 sm:px-6" as const;

const heroNoiseStyle = {
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 256 256'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
} as const;

const processSteps = [
  {
    step: "01",
    title: "MedBot SG agent",
    subtitle: "Example consumer-facing agent",
    body: "An agent can book appointments and act on a user’s behalf—but the service only sees another client at the door.",
  },
  {
    step: "02",
    title: "Raffles Medical deployment",
    subtitle: "Organization-scoped rollout",
    body: "The same stack may be deployed under a hospital brand, procurement policy, and escalation path—separate from who trained the base model.",
  },
  {
    step: "03",
    title: "Polyclinic appointment API",
    subtitle: "The service’s view",
    body: "When traffic arrives, the API must judge accountability without a shared verifiable credential. Open questions include:",
    bullets: [
      { dotClass: "bg-[#2563eb]", text: "Who trained the model? (Developer)" },
      { dotClass: "bg-[#16a34a]", text: "Who built the agent? (Provider)" },
      { dotClass: "bg-[#ea580c]", text: "Who authorized deployment? (Deployer)" },
    ],
  },
] as const;

export default function HomePage() {
  return (
    <div>
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
          <Link
            href="/demo"
            className="mt-10 inline-flex rounded-full bg-zinc-100 px-7 py-3 text-sm font-semibold text-zinc-950 transition-colors hover:bg-white"
          >
            Interactive demo
          </Link>
        </div>

        <div className="border-t border-white/10">
          <div className={`${homeContent} pb-20 pt-14 sm:pb-24 sm:pt-16`}>
            <h2 className="sr-only">How a request reads to a service</h2>
            <p className="mx-auto max-w-2xl text-center text-base leading-relaxed text-zinc-300 sm:text-lg">
              AI agents are entering the economy: booking and transacting on our
              behalf. However, services receiving these requests have{" "}
              <em className="italic text-zinc-100">no way to verify their credibility</em>
              .
            </p>

            <ol className="mt-12 grid list-none gap-4 p-0 md:grid-cols-3">
              {processSteps.map((item) => (
                <li key={item.step}>
                  <article className="flex h-full flex-col rounded-2xl border border-white/10 bg-[#1f1f1f] p-6">
                    <span
                      className="text-4xl font-extralight tabular-nums leading-none text-zinc-500"
                      aria-hidden
                    >
                      {item.step}
                    </span>
                    <h3 className="mt-3 text-base font-semibold text-white">
                      {item.title}
                    </h3>
                    <p className="mt-1 text-xs font-medium uppercase tracking-wide text-zinc-500">
                      {item.subtitle}
                    </p>
                    <p className="mt-3 text-sm leading-relaxed text-zinc-300">
                      {item.body}
                    </p>
                    {"bullets" in item && item.bullets ? (
                      <ul className="mt-4 space-y-2.5 text-sm leading-snug text-zinc-300">
                        {item.bullets.map((b) => (
                          <li key={b.text} className="flex gap-2.5">
                            <span
                              className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${b.dotClass}`}
                              aria-hidden
                            />
                            <span>{b.text}</span>
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </article>
                </li>
              ))}
            </ol>

            <div className="mx-auto mt-10 max-w-2xl rounded-xl border border-amber-500/35 bg-amber-950/35 px-5 py-4 sm:px-6 sm:py-5">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-200/90">
                The failure mode
              </p>
              <p className="mt-2 text-sm font-medium leading-relaxed text-zinc-100 sm:text-base">
                Without this information, they face a binary choice: block all
                agents, or accept unknown risk.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-slate-200/80 bg-slate-50/50">
        <div className={`${homeContent} pb-10 pt-6 sm:pb-12 sm:pt-8`}>
          <h2 className="text-lg font-semibold tracking-tight text-[#1a2744]">
            Interactive proof of concept
          </h2>
          <div
            className="mt-2 h-px max-w-md bg-gradient-to-r from-[#ea580c] via-[#ea580c]/50 to-transparent"
            aria-hidden
          />
          <div className="mt-5">
            <AgentIdPoc variant="full" />
          </div>
        </div>
      </section>
    </div>
  );
}
