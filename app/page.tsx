import Link from "next/link";
import { BlogCard } from "@/components/BlogCard";
import { HomeFigure } from "@/components/HomeFigure";
import { getLatestPosts } from "@/lib/blog";
import { siteConfig } from "@/lib/site";

const questionItems = [
  {
    dotClass: "bg-[#2563eb]",
    text: "How safe is this model?",
  },
  {
    dotClass: "bg-[#16a34a]",
    text: "Who do we contact if it fails?",
  },
  {
    dotClass: "bg-[#ea580c]",
    text: "Where did this model come from?",
  },
] as const;

export default function HomePage() {
  const posts = getLatestPosts(3);

  return (
    <div>
      <section className="relative overflow-hidden border-b border-slate-200/80">
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_90%_50%_at_50%_-20%,rgba(26,39,68,0.14),transparent)]"
          aria-hidden
        />
        <div className="relative mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-20">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#0f4c5c]">
            Policy research
          </p>
          <h1 className="mt-4 max-w-3xl text-3xl font-semibold tracking-tight text-[#1a2744] sm:text-4xl">
            {siteConfig.title}
          </h1>
          <div className="mt-8 max-w-2xl text-base leading-relaxed text-slate-700">
            <p>
              AI agents are entering the economy. They now book appointments
              and make transactions on our behalf. However, services receiving
              these requests have no way to verify their credibility.
            </p>
          </div>

          <div className="mt-14 grid gap-10 lg:grid-cols-2 lg:items-start lg:gap-12">
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-wide text-[#1a2744]">
                Unresolved questions
              </h2>
              <ul className="mt-4 space-y-3 text-base leading-relaxed text-slate-800">
                {questionItems.map((item) => (
                  <li key={item.text} className="flex gap-3">
                    <span
                      className={`mt-2 h-2 w-2 shrink-0 rounded-full ${item.dotClass}`}
                      aria-hidden
                    />
                    <span>{item.text}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-6 text-base leading-relaxed text-slate-700">
                The answers lie in safety testing, accountability, and incident
                response. Those fields have the{" "}
                <strong className="font-medium text-slate-800">
                  weakest market incentives
                </strong>{" "}
                for voluntary disclosure.
              </p>
            </div>
            <HomeFigure
              src="/images/home/scenario-questions.png"
              alt="Healthcare booking flow: an agent requests data from a polyclinic API. A thought bubble lists three verification questions tied to developer, provider, and deployer roles."
              caption="A concrete scenario: each verification question must be answered by a different supply-chain actor — so no single party can provide the full picture alone."
              priority
              className="lg:pt-1"
            />
          </div>

          <div className="mt-16 space-y-3">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-[#1a2744]">
              The market incentive gap
            </h2>
            <HomeFigure
              src="/images/home/market-incentive-gap.png"
              alt="Comparison of what markets readily supply—session IDs and operational metadata—versus what governance needs: deployer identity, model provenance, safety assurances, and incident response contacts."
              caption="Governance-critical fields are the least likely to be disclosed voluntarily."
            />
          </div>

          <div className="mt-16 space-y-6">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-[#1a2744]">
              Composite Agent ID
            </h2>
            <HomeFigure
              src="/images/home/composite-credential-flow.png"
              alt="Flow from developer, provider, and deployer contributions into a single Agent ID credential presented to a service, which may deny access, request more information, or grant access."
            />
            <p className="max-w-2xl text-base leading-relaxed text-slate-700">
              Our proof of concept demonstrates a composite credential where the
              model developer, the service provider, and the deployer each sign
              different sections of the Agent ID.
            </p>
            <HomeFigure
              src="/images/home/supply-chain.png"
              alt="Supply chain from the developer who trains the model, through the provider who builds the agent and the deployer who authorizes use, to the running agent instance."
              caption="From training to deployment: responsibility is distributed across the chain."
              className="max-w-4xl"
            />
            <div className="pt-2">
              <Link
                href="/demo"
                className="inline-flex items-center justify-center rounded-md bg-[#1a2744] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#243a5c] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1a2744] focus-visible:ring-offset-2"
              >
                Explore the interactive demo
              </Link>
              <p className="mt-3 max-w-xl text-sm text-slate-500">
                Three views — Ecosystem, Credential, and Consequences — walk
                through contributions and what breaks when information is
                missing.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-14 sm:px-6">
        <h2 className="text-lg font-semibold text-[#1a2744]">Latest writing</h2>
        <p className="mt-1 text-sm text-slate-600">
          Notes on design, governance, and implementation.
        </p>
        {posts.length === 0 ? (
          <p className="mt-6 text-sm text-slate-500">
            No posts yet — check back soon.
          </p>
        ) : (
          <ul className="mt-8 grid gap-6 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
            {posts.map((post) => (
              <li key={post.slug}>
                <BlogCard post={post} className="h-full" />
              </li>
            ))}
          </ul>
        )}
        {posts.length > 0 ? (
          <p className="mt-8">
            <Link
              href="/blog"
              className="text-sm font-medium text-[#0f4c5c] underline-offset-2 hover:underline"
            >
              View all posts →
            </Link>
          </p>
        ) : null}
      </section>
    </div>
  );
}
