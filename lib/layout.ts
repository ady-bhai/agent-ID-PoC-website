/**
 * Shared layout shell classes for the homepage and adjacent pages.
 *
 * Two widths, deliberately:
 *   - `homeContent` (max-w-4xl) for prose-shaped sections — hero text,
 *     short essay-style copy, the memo article body. Anything where line
 *     length matters.
 *   - `homeWide`    (max-w-6xl) for grid- or figure-shaped sections —
 *     research card rows, the interactive PoC, the workstreams grid,
 *     the join-the-community block. Anything that wants room.
 *
 * Both share the same horizontal padding (`px-4 sm:px-6`) so adjacent
 * sections at different widths line up at the same outer edge on
 * narrow viewports — there's no jarring shift between sections.
 */
export const homeContent =
  "relative mx-auto w-full max-w-4xl px-4 sm:px-6" as const;

export const homeWide =
  "relative mx-auto w-full max-w-6xl px-4 sm:px-6" as const;
