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
      <dl className="mt-10 space-y-6">
        <div>
          <dt className="text-sm font-medium uppercase tracking-wide text-slate-500">
            Aditya Mehta
          </dt>
          <dd className="mt-1">
            <a
              href="mailto:aditya.mehta@berkeley.edu"
              className="text-lg font-medium text-[#0f4c5c] underline-offset-2 hover:underline"
            >
              aditya.mehta@berkeley.edu
            </a>
          </dd>
        </div>
      </dl>
      <p className="mt-10 text-sm text-slate-500">
        A project-specific inbox may be added later; for now, use the address
        above.
      </p>
    </div>
  );
}
