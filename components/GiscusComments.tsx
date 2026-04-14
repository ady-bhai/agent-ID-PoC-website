"use client";

import Giscus from "@giscus/react";

/**
 * Configure via Vercel env (see .env.example).
 * If vars are missing, a short notice is shown so builds and previews still work.
 */
export function GiscusComments() {
  const repo = process.env.NEXT_PUBLIC_GISCUS_REPO as `${string}/${string}` | undefined;
  const repoId = process.env.NEXT_PUBLIC_GISCUS_REPO_ID;
  const category = process.env.NEXT_PUBLIC_GISCUS_CATEGORY;
  const categoryId = process.env.NEXT_PUBLIC_GISCUS_CATEGORY_ID;

  if (!repo || !repoId || !category || !categoryId) {
    return (
      <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-center text-sm text-slate-600">
        <p className="font-medium text-slate-800">Comments</p>
        <p className="mt-2">
          Discussion is powered by Giscus (GitHub Discussions). Add{" "}
          <code className="rounded bg-slate-200 px-1.5 py-0.5 text-xs">
            NEXT_PUBLIC_GISCUS_*
          </code>{" "}
          environment variables in Vercel to enable comments on this site.
        </p>
      </div>
    );
  }

  return (
    <div className="giscus-container mt-12 border-t border-slate-200 pt-10">
      <h2 className="mb-4 text-lg font-semibold text-[#1a2744]">Comments</h2>
      <Giscus
        id="comments"
        repo={repo}
        repoId={repoId}
        category={category}
        categoryId={categoryId}
        mapping="pathname"
        reactionsEnabled="1"
        emitMetadata="0"
        inputPosition="top"
        theme="light"
        lang="en"
        loading="lazy"
      />
    </div>
  );
}
