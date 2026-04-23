import Image from "next/image";
import { withPublicBasePath } from "@/lib/paths";

type HomeFigureProps = {
  /** Path under `/public`, e.g. `/images/figures/market-incentive-gap.png` */
  src: string;
  alt: string;
  caption?: string;
  priority?: boolean;
  className?: string;
  width?: number;
  height?: number;
};

const DEFAULT_WIDTH = 1200;
const DEFAULT_HEIGHT = 675;

/**
 * Responsive figure for homepage and demo static diagrams.
 * Assumes PNG (or SVG) sources with known intrinsic dimensions to avoid CLS.
 */
export function HomeFigure({
  src,
  alt,
  caption,
  priority,
  className = "",
  width = DEFAULT_WIDTH,
  height = DEFAULT_HEIGHT,
}: HomeFigureProps) {
  const resolvedSrc = withPublicBasePath(src);
  return (
    <figure className={className}>
      <div className="overflow-hidden rounded-lg border border-slate-200/80 bg-white shadow-sm">
        <Image
          src={resolvedSrc}
          alt={alt}
          width={width}
          height={height}
          className="h-auto w-full"
          sizes="(max-width: 1280px) 100vw, 1152px"
          priority={priority}
        />
      </div>
      {caption ? (
        <figcaption className="mt-2 text-center text-sm leading-relaxed text-slate-600">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}
