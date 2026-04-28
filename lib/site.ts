/** Site-wide constants. Override with env on Vercel when the repo URL is final. */
export type PartnerLogo = {
  name: string;
  shortName: string;
  image: string;
  /** Omit until the partner URL is confirmed. */
  href?: string;
};

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
   * Slightly longer description used in metadata + the /about page.
   */
  description:
    "An open research community designing verifiable identity infrastructure for AI agents — an initiative by Singapore AI Safety Hub (SASH).",
  /**
   * The institution behind the initiative. Rendered in the hero line and
   * in the strip above the footer. As more institutions co-host, add them.
   */
  stewards: [
    {
      name: "Singapore AI Safety Hub (SASH)",
      shortName: "SASH",
      href: "https://www.aisafety.sg",
    },
  ] as const,
  /**
   * Partner logos in the bottom strip (replace placeholder assets in
   * public/images/partners/ when final artwork is available).
   */
  partnerLogos: [
    {
      name: "Singapore AI Safety Institute",
      shortName: "Singapore AISI",
      image: "/images/partners/singapore-ac.svg",
    },
    {
      name: "Singapore AI Safety Hub",
      shortName: "SASH",
      href: "https://www.aisafety.sg",
      image: "/images/partners/sash.svg",
    },
    {
      name: "Korea AI Safety Institute",
      shortName: "Korea AISI",
      image: "/images/partners/korea-ac.svg",
    },
  ] satisfies readonly PartnerLogo[],
  githubUrl:
    process.env.NEXT_PUBLIC_GITHUB_URL ??
    "https://github.com/ady-bhai/agent-ID-poc-SG",
} as const;
