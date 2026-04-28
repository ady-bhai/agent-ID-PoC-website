import type { Metadata } from "next";
import { ProjectIntro } from "@/components/about/ProjectIntro";
import { ProjectTimeline } from "@/components/about/ProjectTimeline";
import { TeamGrid } from "@/components/about/TeamGrid";

export const metadata: Metadata = {
  title: "About",
  description:
    "About — project description, milestone timeline, and team behind Agent ID policy research at Singapore AI Safety Hub (SASH).",
};

export default function AboutPage() {
  return (
    <div className="min-h-full bg-[#F5F0E8] text-[#1A1A1A]">
      <ProjectIntro />
      <ProjectTimeline />
      <TeamGrid />
    </div>
  );
}
