"use client";

import ArchV5Poc from "./ArchV5Poc.jsx";

/**
 * Wraps the embedded PoC (inline styles, dark theme) in the light site chrome.
 */
export function AgentIdPoc() {
  return (
    <div
      className="overflow-hidden rounded-lg border border-slate-700/40 shadow-[0_20px_50px_-12px_rgba(26,39,68,0.25)]"
      style={{ minHeight: "min(85vh, 900px)" }}
    >
      <div className="max-h-[calc(100vh-12rem)] min-h-[520px] overflow-auto">
        <ArchV5Poc />
      </div>
    </div>
  );
}
