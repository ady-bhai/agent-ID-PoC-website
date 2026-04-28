"use client";

import { useState } from "react";
import { AgentIdPoc, type AgentIdPocView } from "@/components/poc/AgentIdPoc";
import { FigureSwitcher } from "@/components/FigureSwitcher";

const ITEMS: ReadonlyArray<{ id: AgentIdPocView; label: string; subtitle: string }> = [
  {
    id: "ecosystem",
    label: "1. Explore the ecosystem",
    subtitle: "Who's involved",
  },
  {
    id: "credential",
    label: "2. Examine the credential",
    subtitle: "What the service sees",
  },
  {
    id: "consequences",
    label: "3. See what changes",
    subtitle: "What breaks when fields are missing",
  },
];

const isView = (id: string): id is AgentIdPocView =>
  id === "ecosystem" || id === "credential" || id === "consequences";

export type PocViewSwitcherProps = {
  /** Extra classes on the FigureSwitcher wrapper (typically top margin). */
  className?: string;
};

/**
 * Left rail + one shared `<AgentIdPoc/>` tuned for Ecosystem / Credential /
 * Consequences. Used on `/demo` and the homepage "See it working" section.
 */
export function PocViewSwitcher({ className = "mt-8" }: PocViewSwitcherProps) {
  const [view, setView] = useState<AgentIdPocView>("ecosystem");

  return (
    <FigureSwitcher
      className={className}
      syncHash
      ariaLabel="Proof of concept views"
      value={view}
      onChange={(id) => {
        if (isView(id)) setView(id);
      }}
      items={ITEMS.map(({ id, label, subtitle }) => ({ id, label, subtitle }))}
      renderPanel={(activeId) => (
        <AgentIdPoc
          variant="full"
          view={isView(activeId) ? activeId : "ecosystem"}
          onViewChange={setView}
          hideSplash
          hideViewTabs
        />
      )}
    />
  );
}
