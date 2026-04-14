import type { NextConfig } from "next";
import path from "path";
import { fileURLToPath } from "url";

const projectRoot = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  /** Keeps Turbopack anchored when multiple lockfiles exist above this project. */
  turbopack: {
    root: projectRoot,
  },
  async redirects() {
    return [
      {
        source: "/poc",
        destination: "/demo",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
