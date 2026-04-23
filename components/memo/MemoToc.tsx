"use client";

import { useEffect, useRef, useState } from "react";

/**
 * MemoToc
 * ───────
 * Left-rail table of contents for the policy memo. Highlights the section
 * currently in view while the reader scrolls (inspired by uncensorable.ai
 * and workshop labs' scroll-progress rail).
 *
 * Behaviour:
 *  - IntersectionObserver tracks which `<section>` (or heading) is "active".
 *    The chosen threshold — the observer root is shrunk so only sections
 *    whose heading is in the upper ~35% of the viewport become active —
 *    matches the reader's eye rather than a section's first pixel.
 *  - Clicking an item smooth-scrolls (globals.css has `scroll-smooth` on
 *    <html>) with an extra offset so the target heading isn't tucked
 *    underneath the sticky <Nav>.
 *  - A thin vertical progress bar mirrors total document progress, like
 *    the Workshop Labs rail.
 *
 * The component is purely visual; it reads from `id` attributes placed on
 * headings in the memo page.
 */

export type MemoTocItem = {
  /** Must match the `id` attribute on the corresponding heading. */
  id: string;
  /** Short label shown in the rail (can differ from the heading text). */
  label: string;
  /** 1 = major section, 2 = sub-section (indented). */
  level: 1 | 2;
};

type Props = {
  items: readonly MemoTocItem[];
  /** Approximate sticky-nav height, used for scroll offset and sticky top. */
  navOffsetPx?: number;
};

const DEFAULT_NAV_OFFSET = 72;

export function MemoToc({ items, navOffsetPx = DEFAULT_NAV_OFFSET }: Props) {
  const [activeId, setActiveId] = useState<string>(items[0]?.id ?? "");
  const [progress, setProgress] = useState(0);
  const articleRef = useRef<HTMLElement | null>(null);

  // Track scroll progress and recompute the active TOC entry on every
  // scroll/resize. A scroll-position scan is more reliable than
  // IntersectionObserver for this use case: when the reader is deep
  // inside a long section, no heading is "intersecting" a narrow active
  // band, yet the section should still read as active.
  useEffect(() => {
    articleRef.current = document.querySelector("article[data-memo]");

    let raf = 0;
    const update = () => {
      const article = articleRef.current;

      if (article) {
        const rect = article.getBoundingClientRect();
        const vh =
          window.innerHeight || document.documentElement.clientHeight;
        const total = rect.height - vh;
        if (total <= 0) {
          setProgress(rect.top <= 0 ? 1 : 0);
        } else {
          const p = Math.max(0, Math.min(1, -rect.top / total));
          setProgress(p);
        }
      }

      // "Active" heading: the last one whose top edge is above the
      // threshold line (just under the sticky nav). Falls back to the
      // first item when nothing has scrolled past yet.
      const threshold = navOffsetPx + 24;
      let newActive: string | null = null;
      for (const item of items) {
        const el = document.getElementById(item.id);
        if (!el) continue;
        const top = el.getBoundingClientRect().top;
        if (top - threshold <= 0) {
          newActive = item.id;
        } else {
          break;
        }
      }
      if (newActive) setActiveId(newActive);
      else if (items[0]) setActiveId(items[0].id);
    };

    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [items, navOffsetPx]);

  const onClick = (
    event: React.MouseEvent<HTMLAnchorElement>,
    id: string,
  ) => {
    const target = document.getElementById(id);
    if (!target) return;
    event.preventDefault();
    const y = target.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({
      top: y - navOffsetPx - 16,
      behavior: "smooth",
    });
    // Update the hash without triggering a jump.
    history.replaceState(null, "", `#${id}`);
    setActiveId(id);
  };

  return (
    <nav
      aria-label="Policy memo table of contents"
      className="relative text-sm"
    >
      <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
        Contents
      </p>
      <div className="relative">
        {/* Rail track (faint) */}
        <div
          aria-hidden
          className="absolute left-0 top-0 h-full w-px bg-slate-200"
        />
        {/* Rail fill (animates with scroll progress) */}
        <div
          aria-hidden
          className="absolute left-0 top-0 w-px origin-top bg-[#1a2744] transition-[height] duration-150"
          style={{ height: `${progress * 100}%` }}
        />
        <ul className="space-y-1">
          {items.map((item) => {
            const active = activeId === item.id;
            return (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  onClick={(e) => onClick(e, item.id)}
                  className={[
                    "group relative block py-1.5 pl-4 pr-2 leading-snug transition-colors",
                    item.level === 2 ? "pl-7 text-[13px]" : "",
                    active
                      ? "font-semibold text-[#1a2744]"
                      : "text-slate-500 hover:text-[#1a2744]",
                  ].join(" ")}
                >
                  {/* Active marker: small filled square on the rail */}
                  {active ? (
                    <span
                      aria-hidden
                      className="absolute left-[-3px] top-1/2 h-2 w-[7px] -translate-y-1/2 rounded-[1px] bg-[#1a2744]"
                    />
                  ) : null}
                  {item.label}
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}

/**
 * Mobile variant: a compact expandable panel of the same TOC, anchored
 * to the top of the memo on small viewports where the rail can't fit.
 */
export function MemoTocMobile({ items }: Props) {
  const [open, setOpen] = useState(false);
  return (
    <details
      className="group rounded-lg border border-slate-200 bg-white/80 backdrop-blur lg:hidden"
      onToggle={(e) => setOpen((e.target as HTMLDetailsElement).open)}
    >
      <summary className="flex cursor-pointer select-none items-center justify-between px-4 py-3 text-sm font-medium text-[#1a2744]">
        <span>Contents</span>
        <span
          aria-hidden
          className={`transition-transform ${open ? "rotate-180" : ""}`}
        >
          ▾
        </span>
      </summary>
      <ul className="space-y-1 border-t border-slate-200 px-4 py-3">
        {items.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              className={[
                "block py-1 text-sm text-slate-600 hover:text-[#1a2744]",
                item.level === 2 ? "pl-4 text-[13px]" : "",
              ].join(" ")}
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </details>
  );
}
