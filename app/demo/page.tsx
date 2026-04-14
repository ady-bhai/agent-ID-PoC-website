import type { Metadata } from "next";
import { AgentIdPoc } from "@/components/poc/AgentIdPoc";

export const metadata: Metadata = {
  title: "Interactive demo",
  description:
    "Composite agent identity credential — Ecosystem, Credential, and Consequences views.",
};

export default function DemoPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="max-w-3xl">
        <h1 className="text-2xl font-semibold tracking-tight text-[#1a2744]">
          Interactive proof of concept
        </h1>
        <p className="mt-4 text-base leading-relaxed text-slate-700">
          This interactive proof of concept demonstrates how a composite agent
          identity credential enables governance capabilities across the AI
          supply chain. Use the three views —{" "}
          <strong className="font-medium text-slate-800">Ecosystem</strong>,{" "}
          <strong className="font-medium text-slate-800">Credential</strong>, and{" "}
          <strong className="font-medium text-slate-800">Consequences</strong> —
          to explore what each actor contributes and what services lose when
          information is missing.
        </p>
      </div>

      <div className="mt-8">
        <AgentIdPoc />
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
