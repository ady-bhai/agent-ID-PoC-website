import type { Metadata } from "next";
import { HomeFigure } from "@/components/HomeFigure";
import { AgentIdPoc } from "@/components/poc/AgentIdPoc";

export const metadata: Metadata = {
  title: "Interactive demo",
  description: "Composite agent identity credential — interactive exploration.",
};

export default function DemoPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="max-w-3xl">
        <h1 className="text-2xl font-semibold tracking-tight text-[#1a2744]">
          Interactive proof of concept
        </h1>
      </div>

      <div className="mt-8">
        <AgentIdPoc />
      </div>

      <div className="mt-14 max-w-3xl border-t border-slate-200 pt-12">
        <h2 className="text-lg font-semibold text-[#1a2744]">
          Standards landscape
        </h2>
        <HomeFigure
          className="mt-6"
          src="/images/figures/standards-matrix.png"
          width={1206}
          height={686}
          alt="Matrix comparing common standards against service questions such as provider behind the agent, deployer, capabilities, safety evidence, and incident recourse. Composite Agent ID rows show direct answers across columns."
          caption="Which questions each layer helps answer — no single standard provides a complete answer on its own."
        />
      </div>

      <div className="mt-12 max-w-3xl border-t border-slate-200 pt-12">
        <h2 className="text-lg font-semibold text-[#1a2744]">
          What&apos;s in the packet
        </h2>
        <HomeFigure
          className="mt-6"
          src="/images/figures/service-request-card.png"
          width={1706}
          height={858}
          alt="Diagram of a service request card packet: stacked signed blocks for provider identity, model version, incident response endpoint, deployer identity and capabilities, independent safety assurance, and instance-level fields, with brackets noting independent signers and cryptographic binding."
          caption="How attestations stack and bind so a valid provider signature cannot be reused with an unauthorized deployer."
        />
      </div>

      <div className="mx-auto mt-10 max-w-3xl rounded-lg border border-slate-200 bg-slate-50/80 px-4 py-5 text-sm leading-relaxed text-slate-700 sm:px-5">
        <h2 className="font-semibold text-[#1a2744]">Scenario & presets</h2>
        <p className="mt-2">
          The scenario follows a healthcare booking agent:{" "}
          <strong className="font-medium">MedBot SG</strong> requests patient
          appointment availability from a polyclinic API. Use the{" "}
          <strong className="font-medium">Agent ID state</strong> presets (
          Full Agent ID, No Deployer Info, No Safety Certification, No Agent ID)
          in the Consequences view to see which incident response phases succeed
          or stop entirely — missing credential sections cause hard stops, not
          gradual degradation.
        </p>
      </div>
    </div>
  );
}
