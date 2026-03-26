import { notFound } from "next/navigation";
import { Container } from "@/components/ui/container";
import { Prose } from "@/components/ui/prose";
import { PostMeta } from "@/components/blog/post-meta";
import { getPostBySlug, getPostSlugs } from "@/lib/mdx";

type BlogPostPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const slugs = await getPostSlugs();
  return slugs.map((slug) => ({ slug }));
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  let post: Awaited<ReturnType<typeof getPostBySlug>>;

  try {
    post = await getPostBySlug(slug);
  } catch {
    notFound();
  }

  return (
    <Container className="py-12">
      <article className="space-y-8">
        <header className="space-y-3">
          <h1 className="font-serif text-4xl tracking-tight">{post.frontmatter.title}</h1>
          <PostMeta date={post.frontmatter.date} readingTime={post.readingTime} />
        </header>
        <Prose>{post.content}</Prose>
      </article>
    </Container>
  );
}
