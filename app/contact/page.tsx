import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description: "Reach the Agent ID research team.",
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-semibold tracking-tight text-[#1a2744]">
        Contact
      </h1>
      <p className="mt-6 text-base leading-relaxed text-slate-700">
        For questions about the research, collaboration opportunities, or
        feedback on the proof of concept, reach out to us.
        <span className="mt-4 block text-slate-600">
          We welcome engagement from government agencies, enterprises, and the
          AI safety research community.
        </span>
      </p>
    </div>
  );
}
