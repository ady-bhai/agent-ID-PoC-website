import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description:
    "Research questions, team, and references — Agent ID policy research (SASH × ERA Cambridge).",
};

const team = [
  {
    name: "Aditya Mehta",
    role: "ERA Cambridge Research Fellow; proof of concept builder",
    affiliation: "UC Berkeley",
  },
  {
    name: "Sam Boger",
    role: "Mentor and project lead",
    affiliation: "Singapore AI Safety Hub (SASH)",
  },
  {
    name: "Amin Oueslati",
    role: "SASH executive team; field-building lead",
    affiliation: "SASH",
  },
  {
    name: "Miro Pluckebaum",
    role: "Founder",
    affiliation: "SASH",
  },
] as const;

const references = [
  {
    label: "IDs for AI Systems (Alan Chan et al.)",
    href: "https://arxiv.org/search/cs?query=IDs+for+AI+Systems+Chan",
  },
  {
    label: "Infrastructure for AI Agents (Alan Chan et al.)",
    href: "https://arxiv.org/search/cs?query=Infrastructure+for+AI+Agents+Chan",
  },
  {
    label: "IMDA — Model AI Governance Framework for Agentic AI",
    href: "https://www.imda.gov.sg/",
  },
  {
    label: "SASH / IAPS working draft on Agent IDs",
    href: "https://aisafety.sg",
  },
] as const;

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-semibold tracking-tight text-[#1a2744]">
        About this project
      </h1>

      <div className="mt-10 space-y-5 text-base leading-relaxed text-slate-700">
        <p>
          This project asks how verifiable identity infrastructure can support
          safe deployment of AI agents when services need to answer questions
          no single vendor can answer alone — who built the agent, what it
          runs, whether it has been tested for safety, and who is accountable
          when something goes wrong.
        </p>
        <p>
          The approach centers on a{" "}
          <strong className="font-medium text-slate-800">
            composite credential
          </strong>{" "}
          with independently signed sections from different supply-chain
          actors, aligned with ongoing work on Singapore&apos;s Model AI
          Governance Framework for Agentic AI (IMDA) and with foundational
          research on IDs for AI systems and infrastructure for AI agents (Alan
          Chan and colleagues).
        </p>
        <p>
          Singapore AI Safety Hub (SASH) and the ERA Cambridge fellowship
          collaboration contextualize this work for policymakers, enterprises,
          and the AI safety research community. Content on this site will grow
          iteratively as the research proceeds.
        </p>
      </div>

      <h2 className="mt-14 text-xl font-semibold text-[#1a2744]">Team</h2>
      <ul className="mt-6 space-y-6">
        {team.map((person) => (
          <li key={person.name} className="border-l-2 border-[#0f4c5c]/40 pl-4">
            <p className="font-medium text-slate-900">{person.name}</p>
            <p className="text-sm text-slate-600">{person.role}</p>
            <p className="text-sm text-slate-500">{person.affiliation}</p>
          </li>
        ))}
      </ul>

      <h2 className="mt-14 text-xl font-semibold text-[#1a2744]">
        Institutional backing
      </h2>
      <p className="mt-4 text-base leading-relaxed text-slate-700">
        Hosted in connection with{" "}
        <strong className="font-medium">Singapore AI Safety Hub (SASH)</strong>{" "}
        and the{" "}
        <strong className="font-medium">ERA Cambridge</strong> research
        fellowship programme, with reference to{" "}
        <strong className="font-medium">IMDA</strong>
        &apos;s governance framework work for agentic AI in Singapore.
      </p>

      <h2 className="mt-14 text-xl font-semibold text-[#1a2744]">
        Foundational references
      </h2>
      <ul className="mt-4 list-inside list-disc space-y-2 text-slate-700">
        {references.map((ref) => (
          <li key={ref.href}>
            <a
              href={ref.href}
              className="text-[#0f4c5c] underline-offset-2 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              {ref.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
