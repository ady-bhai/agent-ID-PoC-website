/**
 * Resolve a path inside `/public` to the URL it will be served from.
 *
 * Why this exists:
 *   The site is deployed to GitHub Pages under a project sub-path
 *   (e.g. `/agent-ID-PoC-website`). Next.js sets `basePath` from the
 *   `NEXT_PUBLIC_BASE_PATH` env var at build time, which auto-prefixes
 *   `<Link>` hrefs, but in static-export mode with `images.unoptimized`
 *   it does NOT auto-prefix raw `src` strings passed to `next/image`,
 *   nor plain `<a href="/...">` attributes. Those references will 404
 *   on Pages unless we manually prepend the base path.
 *
 * Inputs:
 *   - An absolute-looking public path (`/images/foo.png`, `/docs/bar.pdf`).
 *   - Anything else (relative paths, full URLs) is returned unchanged.
 *
 * Local dev: `NEXT_PUBLIC_BASE_PATH` is unset, so this is a no-op.
 */
export function withPublicBasePath(path: string): string {
  const raw = process.env.NEXT_PUBLIC_BASE_PATH?.trim() ?? "";
  const base = raw === "/" ? "" : raw.replace(/\/$/, "");
  if (!path.startsWith("/") || !base) return path;
  return `${base}${path}`;
}
