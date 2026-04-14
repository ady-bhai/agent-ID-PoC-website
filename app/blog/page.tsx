import type { Metadata } from "next";
import Link from "next/link";
import { getAllPosts } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Blog",
  description: "Writing on agent identity, design, and governance.",
};

export default function BlogIndexPage() {
  const posts = getAllPosts();

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-semibold tracking-tight text-[#1a2744]">
        Writing
      </h1>
      <p className="mt-3 text-base text-slate-600">
        Updates from the Agent ID policy research project.
      </p>

      {posts.length === 0 ? (
        <p className="mt-10 text-slate-600">No posts published yet.</p>
      ) : (
        <ul className="mt-12 space-y-10">
          {posts.map((post) => (
            <li key={post.slug} className="border-b border-slate-200 pb-10 last:border-0">
              <article>
                <time
                  dateTime={post.date}
                  className="text-xs font-semibold uppercase tracking-wide text-slate-500"
                >
                  {post.date}
                </time>
                <h2 className="mt-2">
                  <Link
                    href={`/blog/${post.slug}`}
                    className="text-xl font-semibold text-[#1a2744] hover:underline"
                  >
                    {post.title}
                  </Link>
                </h2>
                <p className="mt-1 text-sm text-slate-500">By {post.author}</p>
                <p className="mt-3 text-base leading-relaxed text-slate-700">
                  {post.description}
                </p>
                <Link
                  href={`/blog/${post.slug}`}
                  className="mt-4 inline-block text-sm font-medium text-[#0f4c5c] underline-offset-2 hover:underline"
                >
                  Continue reading →
                </Link>
              </article>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
