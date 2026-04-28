import { siteConfig } from "@/lib/site";

/**
 * StewardsRow
 * ───────────
 * A slim "An initiative by" strip above the partner logos and footer.
 * The institution list is read from `siteConfig.stewards`.
 */
export function StewardsRow() {
  return (
    <section
      aria-label="Project initiative"
      className="border-b border-slate-200 bg-slate-50/70"
    >
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-3 px-4 py-8 text-center sm:flex-row sm:justify-center sm:gap-6 sm:px-6">
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">
          An initiative by
        </p>
        <ul className="flex list-none flex-wrap items-center justify-center gap-x-6 gap-y-2">
          {siteConfig.stewards.map((s) => (
            <li key={s.shortName}>
              <a
                href={s.href}
                target="_blank"
                rel="noreferrer"
                className="text-sm font-semibold text-[#1a2744] underline-offset-4 hover:underline"
              >
                {s.name}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default StewardsRow;
