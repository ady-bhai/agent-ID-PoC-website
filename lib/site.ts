/** Site-wide constants. Override with env on Vercel when the repo URL is final. */
export const siteConfig = {
  name: "Agent IDs",
  title: "Agent IDs",
  /** Homepage hero line under the main title. */
  tagline: "Verifiable identity infrastructure for AI Agents",
  description:
    "Verifiable identity infrastructure for AI Agents — policy research with Singapore AI Safety Hub (SASH).",
  githubUrl:
    process.env.NEXT_PUBLIC_GITHUB_URL ??
    "https://github.com/ady-bhai/agent-ID-poc-SG",
} as const;
