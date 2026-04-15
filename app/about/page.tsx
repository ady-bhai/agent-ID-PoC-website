import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description: "Team — Agent ID policy research at Singapore AI Safety Hub (SASH).",
};

const team = [
  {
    name: "Miro Pluckebaum",
    title: "Founder, Singapore AI Safety Hub (SASH)",
  },
  {
    name: "Amin Oueslati",
    title: "Research Project Manager, SASH",
  },
  {
    name: "Sam Boger",
    title: "Research Fellow, SASH",
  },
  {
    name: "Aditya Mehta",
    title: "Research Contractor, SASH",
  },
] as const;

function initials(name: string) {
  return name
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function AboutPage() {
  return (
    <section className="min-h-full bg-[#f0f4f8] py-12 sm:py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <h1 className="text-3xl font-semibold tracking-tight text-[#1a2744]">
          About
        </h1>

        <ul className="mt-10 grid list-none gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {team.map((person) => (
            <li key={person.name}>
              <article className="flex h-full flex-col rounded-2xl border border-slate-200/90 bg-white p-6 shadow-[0_1px_3px_rgba(15,23,42,0.08),0_8px_24px_rgba(15,23,42,0.06)]">
                <div className="flex flex-col items-center">
                  <div
                    className="flex h-[104px] w-[104px] shrink-0 items-center justify-center rounded-full border-2 border-slate-200 bg-slate-100 text-xl font-semibold tracking-tight text-slate-600"
                    aria-hidden
                  >
                    {initials(person.name)}
                  </div>
                  <div className="mt-5 w-full text-left">
                    <p className="text-[11px] font-bold uppercase leading-snug tracking-[0.12em] text-[#2563eb] sm:text-xs">
                      {person.title}
                    </p>
                    <p className="mt-2 text-lg font-semibold leading-snug text-slate-900">
                      {person.name}
                    </p>
                  </div>
                </div>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
