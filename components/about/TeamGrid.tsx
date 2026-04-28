/**
 * TeamGrid
 * ────────
 * The four-card team grid that previously lived directly in
 * `app/about/page.tsx`. Extracted so the page can compose three
 * sections (intro, timeline, team) without inline JSX clutter.
 *
 * Card surfaces stay white but the surrounding section is cream
 * (`#F5F0E8`) to sit consistently with `ProjectIntro` and
 * `ProjectTimeline`. Border + shadow tones are nudged slightly
 * warmer to match the cream backdrop.
 */

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

export function TeamGrid() {
  return (
    <section
      aria-labelledby="about-team-heading"
      style={{ padding: "clamp(56px, 10vw, 96px) clamp(16px, 5vw, 48px)" }}
    >
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-3">
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#6B6B6B]">
            People
          </p>
          <h2
            id="about-team-heading"
            className="text-2xl font-semibold tracking-tight text-[#1A2744] sm:text-3xl"
          >
            Team
          </h2>
        </div>

        <ul className="mt-10 grid list-none gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {team.map((person) => (
            <li key={person.name}>
              <article className="flex h-full flex-col rounded-2xl border border-[rgba(26,26,26,0.12)] bg-white p-6 shadow-[0_1px_3px_rgba(26,39,68,0.08),0_8px_24px_rgba(26,39,68,0.06)]">
                <div className="flex flex-col items-center">
                  <div
                    className="flex h-[104px] w-[104px] shrink-0 items-center justify-center rounded-full border-2 border-[rgba(26,26,26,0.10)] bg-[#F5F0E8] text-xl font-semibold tracking-tight text-[#6B6B6B]"
                    aria-hidden
                  >
                    {initials(person.name)}
                  </div>
                  <div className="mt-5 w-full text-left">
                    <p className="text-[11px] font-bold uppercase leading-snug tracking-[0.12em] text-[#1A2744] sm:text-xs">
                      {person.title}
                    </p>
                    <p className="mt-2 text-lg font-semibold leading-snug text-[#1A1A1A]">
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

export default TeamGrid;
