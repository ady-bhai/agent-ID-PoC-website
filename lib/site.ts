/** Site-wide constants. Override with env on Vercel when the repo URL is final. */
export const siteConfig = {
  name: "Agent ID",
  title: "Agent ID — Verifiable identity infrastructure for AI agents",
  description:
    "Policy research on composite agent identity for Singapore’s service ecosystem — SASH × ERA Cambridge.",
  githubUrl:
    process.env.NEXT_PUBLIC_GITHUB_URL ??
    "https://github.com/ady-bhai/agent-ID-poc-SG",
} as const;
