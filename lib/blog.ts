import fs from "fs";
import path from "path";
import matter from "gray-matter";

export type PostMeta = {
  slug: string;
  title: string;
  date: string;
  author: string;
  description: string;
};

const contentDir = path.join(process.cwd(), "content/blog");

function listMdxFiles(): string[] {
  if (!fs.existsSync(contentDir)) return [];
  return fs.readdirSync(contentDir).filter((f) => f.endsWith(".mdx"));
}

export function getAllPosts(): PostMeta[] {
  const files = listMdxFiles();
  const posts = files.map((file) => {
    const slug = file.replace(/\.mdx$/, "");
    const raw = fs.readFileSync(path.join(contentDir, file), "utf-8");
    const { data } = matter(raw);
    return {
      slug,
      title: String(data.title ?? ""),
      date: String(data.date ?? ""),
      author: String(data.author ?? ""),
      description: String(data.description ?? ""),
    };
  });
  return posts.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );
}

export function getLatestPosts(limit: number): PostMeta[] {
  return getAllPosts().slice(0, limit);
}

export function getPostBySlug(
  slug: string,
): { meta: PostMeta; content: string } | null {
  const filePath = path.join(contentDir, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;
  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);
  return {
    meta: {
      slug,
      title: String(data.title ?? ""),
      date: String(data.date ?? ""),
      author: String(data.author ?? ""),
      description: String(data.description ?? ""),
    },
    content,
  };
}

export function getAllSlugs(): string[] {
  return getAllPosts().map((p) => p.slug);
}
