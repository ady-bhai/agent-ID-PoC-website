import Link from "next/link";
import { siteConfig } from "@/lib/site";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-auto border-t border-slate-200 bg-slate-50">
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
        <p className="text-center text-sm text-slate-600">
          A research project by{" "}
          <span className="font-medium text-slate-800">
            Singapore AI Safety Hub (SASH) × ERA Cambridge
          </span>
          , contributing to Singapore&apos;s Model AI Governance Framework for
          Agentic AI.
        </p>
        <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-6">
          <Link
            href={siteConfig.githubUrl}
            className="text-sm font-medium text-[#1a2744] underline-offset-4 hover:underline"
          >
            GitHub
          </Link>
          <span className="hidden text-slate-300 sm:inline" aria-hidden>
            |
          </span>
          <span className="text-sm text-slate-500">
            © {year} {siteConfig.name}
          </span>
        </div>
      </div>
    </footer>
  );
}
