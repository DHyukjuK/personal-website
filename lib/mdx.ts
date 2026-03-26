import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import readingTime from "reading-time";
import { compileMDX } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import type { BlogPostFrontmatter } from "@/lib/types";

const BLOG_DIR = path.join(process.cwd(), "content", "blog");

type BlogPostMeta = BlogPostFrontmatter & {
  slug: string;
  readingTime: string;
};

export async function getPostSlugs() {
  const entries = await fs.readdir(BLOG_DIR);
  return entries
    .filter((entry) => entry.endsWith(".mdx"))
    .map((entry) => entry.replace(/\.mdx$/, ""));
}

export async function getAllPostsMeta(): Promise<BlogPostMeta[]> {
  const slugs = await getPostSlugs();
  const posts = await Promise.all(slugs.map((slug) => getPostBySlug(slug)));

  return posts
    .filter((post) => !post.frontmatter.draft)
    .map((post) => ({
      ...post.frontmatter,
      slug: post.slug,
      readingTime: post.readingTime
    }))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export async function getPostBySlug(slug: string) {
  const raw = await fs.readFile(path.join(BLOG_DIR, `${slug}.mdx`), "utf-8");
  const { content, data } = matter(raw);
  const frontmatter = data as BlogPostFrontmatter;

  const compiled = await compileMDX<BlogPostFrontmatter>({
    source: content,
    options: {
      parseFrontmatter: false,
      mdxOptions: {
        remarkPlugins: [remarkGfm],
        rehypePlugins: [
          rehypeSlug,
          [rehypeAutolinkHeadings, { behavior: "wrap" }]
        ]
      }
    }
  });

  return {
    slug,
    frontmatter,
    content: compiled.content,
    readingTime: readingTime(content).text
  };
}
