import Link from "next/link";
import type { PostMeta } from "@/lib/blog";

type Props = {
  post: PostMeta;
  className?: string;
};

export function BlogCard({ post, className = "" }: Props) {
  return (
    <article
      className={`rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md ${className}`}
    >
      <time
        dateTime={post.date}
        className="text-xs font-medium uppercase tracking-wide text-slate-500"
      >
        {post.date}
      </time>
      <h2 className="mt-2 text-lg font-semibold text-[#1a2744]">
        <Link
          href={`/blog/${post.slug}`}
          className="hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1a2744]/30"
        >
          {post.title}
        </Link>
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-slate-600">
        {post.description}
      </p>
      <Link
        href={`/blog/${post.slug}`}
        className="mt-3 inline-block text-sm font-medium text-[#0f4c5c] underline-offset-2 hover:underline"
      >
        Read more
      </Link>
    </article>
  );
}
