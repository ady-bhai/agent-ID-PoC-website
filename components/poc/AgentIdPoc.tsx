"use client";

import ArchV5Poc from "./ArchV5Poc.jsx";

type AgentIdPocProps = {
  /**
   * `full` — homepage: natural-height panel sized via `height`, so the
   *          inner PoC can resolve `height: 100%` to a concrete value.
   *          No nested scrollbar; the page scroll handles overflow.
   * `home` — legacy tighter embed (unused if only full on home).
   * `page` — /demo standalone page. Inner has a min-height and a max-h
   *          cap with `overflow-auto` to avoid pushing the page height
   *          unreasonably when a user has a short viewport.
   */
  variant?: "page" | "home" | "full";
};

export function AgentIdPoc({ variant = "page" }: AgentIdPocProps) {
  const isFull = variant === "full";
  const isHome = variant === "home";

  // Resolve a concrete target height per variant. On `full` we pass this
  // as `height` (not just `minHeight`) so `ArchV5Poc`'s `height: 100%`
  // resolves deterministically and the whole demo is visible without a
  // nested scrollbar.
  const targetHeight = isFull
    ? "min(820px, calc(100vh - 5rem))"
    : isHome
      ? "min(760px, 72vh)"
      : "min(900px, 85vh)";

  const innerClass = isFull
    ? "flex flex-col"
    : isHome
      ? "max-h-[calc(100vh-10rem)] min-h-[480px] overflow-auto"
      : "max-h-[calc(100vh-12rem)] min-h-[520px] overflow-auto";

  // `full`: outer frame is fixed-height so page scroll owns vertical
  //         motion; inner takes its height from the same value.
  // others: outer/inner use min-height — the variants that legitimately
  //         want scroll-within preserve their existing behaviour.
  const outerStyle = isFull
    ? ({ height: targetHeight } as const)
    : ({ minHeight: targetHeight } as const);

  const innerStyle = isFull
    ? ({ height: "100%" } as const)
    : ({ minHeight: targetHeight } as const);

  return (
    <div
      className={
        isFull
          ? "w-full overflow-hidden rounded-lg border border-slate-700/40 shadow-[0_24px_60px_-12px_rgba(26,39,68,0.28)] sm:rounded-xl"
          : "overflow-hidden rounded-lg border border-slate-700/40 shadow-[0_20px_50px_-12px_rgba(26,39,68,0.25)]"
      }
      style={outerStyle}
    >
      <div className={innerClass} style={innerStyle}>
        <ArchV5Poc />
      </div>
    </div>
  );
}
