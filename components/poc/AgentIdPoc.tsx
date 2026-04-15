"use client";

import ArchV5Poc from "./ArchV5Poc.jsx";

type AgentIdPocProps = {
  /**
   * `full` — homepage: maximum width and vertical room.
   * `home` — legacy tighter embed (unused if only full on home).
   * `page` — /demo standalone page.
   */
  variant?: "page" | "home" | "full";
};

export function AgentIdPoc({ variant = "page" }: AgentIdPocProps) {
  const isFull = variant === "full";
  const isHome = variant === "home";

  const minHeight = isFull
    ? "min(78vh, 820px)"
    : isHome
      ? "min(72vh, 760px)"
      : "min(85vh, 900px)";

  const scrollClass = isFull
    ? "max-h-[calc(100vh-8rem)] min-h-[480px] overflow-auto"
    : isHome
      ? "max-h-[calc(100vh-10rem)] min-h-[480px] overflow-auto"
      : "max-h-[calc(100vh-12rem)] min-h-[520px] overflow-auto";

  return (
    <div
      className={
        isFull
          ? "w-full overflow-hidden rounded-lg border border-slate-700/40 shadow-[0_24px_60px_-12px_rgba(26,39,68,0.28)] sm:rounded-xl"
          : "overflow-hidden rounded-lg border border-slate-700/40 shadow-[0_20px_50px_-12px_rgba(26,39,68,0.25)]"
      }
      style={{ minHeight }}
    >
      <div className={scrollClass}>
        <ArchV5Poc />
      </div>
    </div>
  );
}
