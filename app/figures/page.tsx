import type { Metadata } from "next";
import { HomeFigure } from "@/components/HomeFigure";

export const metadata: Metadata = {
  title: "Figures and narrative",
  description:
    "Visual explainers: market incentive gap, composite Agent ID, standards landscape, credential stages, and healthcare scenario.",
};

export default function FiguresPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-14">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#0f4c5c]">
        Supporting visuals
      </p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight text-[#1a2744] sm:text-4xl">
        Figures and narrative
      </h1>

      <div className="mt-14 space-y-16">
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-[#1a2744]">
            The market incentive gap
          </h2>
          <HomeFigure
            className="mt-4"
            src="/images/figures/market-incentive-gap.png"
            width={1356}
            height={764}
            alt="Diagram titled The Market Incentive Gap: operational metadata markets supply versus accountability metadata governance needs, and a closing line on voluntary disclosure."
            caption="Governance-critical fields are the least likely to be disclosed voluntarily."
          />
        </div>

        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-[#1a2744]">
            Composite Agent ID — flow
          </h2>
          <HomeFigure
            className="mt-4"
            src="/images/figures/composite-credential-flow.png"
            width={1424}
            height={808}
            alt="Infographic: Developer, Provider, and Deployer feed a composite Agent ID card presented to a Service, with outcomes Deny, Require more information, or Grant access."
          />
        </div>

        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-[#1a2744]">
            Supply chain
          </h2>
          <HomeFigure
            className="mt-4"
            src="/images/figures/supply-chain.png"
            width={1746}
            height={688}
            alt="Four-step chain: Developer trains model, Provider builds agent, Deployer authorizes use, Agent instance carries the task."
            caption="From training to deployment: responsibility is distributed across the chain."
          />
        </div>

        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-[#1a2744]">
            Credential stages &amp; access
          </h2>
          <HomeFigure
            className="mt-4"
            src="/images/figures/credential-stages.png"
            width={1852}
            height={684}
            alt="Three stages: no verifiable ID leads to Deny; partial identity leads to Require more information; full composite identity leads to Grant access."
          />
        </div>

        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-[#1a2744]">
            Standards landscape
          </h2>
          <HomeFigure
            className="mt-4"
            src="/images/figures/standards-matrix.png"
            width={1206}
            height={686}
            alt="Matrix comparing OAuth, OpenID Connect, Singpass, MCP, and Composite Agent ID against service questions such as provider, deployer, capabilities, safety evidence, and recourse."
            caption="Which questions each layer helps answer — no single standard gives a complete answer on its own."
          />
        </div>

        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-[#1a2744]">
            Service request packet
          </h2>
          <HomeFigure
            className="mt-4"
            src="/images/figures/service-request-card.png"
            width={1706}
            height={858}
            alt="Vertical stack labeled Service Request Card: provider-signed blocks, deployer-signed blocks, independent safety assurance, and instance-level fields, with brackets for independent signers and cryptographic binding."
            caption="How attestations stack so a valid provider signature cannot be reused with an unauthorized deployer."
          />
        </div>

        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-[#1a2744]">
            Scenario sketch
          </h2>
          <HomeFigure
            className="mt-4"
            src="/images/figures/scenario-sketch.png"
            width={956}
            height={598}
            alt="Healthcare flow: MedBot SG agent through Raffles Medical deployment to Polyclinic API, with thought bubble questions on developer, provider, and deployer."
            caption="A concrete booking scenario: each verification question maps to a different supply-chain actor."
          />
        </div>
      </div>
    </div>
  );
}
