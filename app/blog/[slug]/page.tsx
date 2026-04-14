import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { GiscusComments } from "@/components/GiscusComments";
import { getAllSlugs, getPostBySlug } from "@/lib/blog";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return { title: "Not found" };
  return {
    title: post.meta.title,
    description: post.meta.description,
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const { meta, content } = post;

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <article>
        <header>
          <time
            dateTime={meta.date}
            className="text-xs font-semibold uppercase tracking-wide text-slate-500"
          >
            {meta.date}
          </time>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-[#1a2744]">
            {meta.title}
          </h1>
          <p className="mt-2 text-sm text-slate-600">By {meta.author}</p>
        </header>
        <div className="prose prose-slate prose-lg mt-10 max-w-none prose-headings:font-semibold prose-headings:text-[#1a2744] prose-a:text-[#0f4c5c]">
          <MDXRemote source={content} />
        </div>
      </article>
      <GiscusComments />
    </div>
  );
}
