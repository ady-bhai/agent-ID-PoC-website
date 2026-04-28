/** Site-wide constants. Override with env on Vercel when the repo URL is final. */
export const siteConfig = {
  name: "Agent IDs",
  title: "Agent IDs",
  /** Eyebrow above the homepage hero — sets the framing as a research community. */
  eyebrow: "Research community",
  /**
   * Homepage hero line under the main title. Reads as a one-line manifesto
   * rather than a tagline; deliberately frames the project as a community,
   * not a product or paper.
   */
  tagline:
    "An open research community designing verifiable identity infrastructure for AI agents.",
  /**
   * Slightly longer description used in metadata + the /about page. Keeps
   * the SASH framing as steward (not owner) of the work.
   */
  description:
    "An open research community designing verifiable identity infrastructure for AI agents — stewarded by Singapore AI Safety Hub (SASH).",
  /**
   * The institution that hosts and stewards the community. Rendered in
   * the hero's hosted-by line and in the dedicated stewards row above
   * the footer. As more institutions co-host, add them to this list.
   */
  stewards: [
    {
      name: "Singapore AI Safety Hub (SASH)",
      shortName: "SASH",
      href: "https://www.aisafety.sg",
    },
  ] as const,
  githubUrl:
    process.env.NEXT_PUBLIC_GITHUB_URL ??
    "https://github.com/ady-bhai/agent-ID-poc-SG",
} as const;
