import { notFound } from "next/navigation";
import { format } from "date-fns";
import { Container } from "@/components/ui/container";
import { Prose } from "@/components/ui/prose";
import { RevealOnView } from "@/components/home/reveal-on-view";
import { DriftingParticles } from "@/components/home/drifting-particles";
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
    <>
      <div
        className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
        aria-hidden
      >
        <div className="blog-post-atmosphere absolute inset-0" />
        <DriftingParticles />
      </div>

      <Container className="relative z-[2] max-w-2xl py-16 md:py-24">
        <RevealOnView>
          <header className="space-y-4 lowercase">
            <h1 className="font-serif text-3xl tracking-tight text-foreground md:text-4xl">
              {post.frontmatter.title.toLowerCase()}
            </h1>
            <div className="flex items-center gap-3 text-[0.75rem] text-muted-foreground/55">
              <span>
                {format(
                  new Date(post.frontmatter.date),
                  "MMMM d, yyyy"
                ).toLowerCase()}
              </span>
              <span>·</span>
              <span>{post.readingTime.toLowerCase()}</span>
            </div>
            {post.frontmatter.tags?.length > 0 ? (
              <div className="flex flex-wrap gap-x-3 gap-y-1 pt-1">
                {post.frontmatter.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[0.6875rem] italic text-muted-foreground/35"
                  >
                    {tag.toLowerCase()}
                  </span>
                ))}
              </div>
            ) : null}
          </header>
        </RevealOnView>

        <RevealOnView delayMs={60}>
          <div className="mt-12 md:mt-16">
            <Prose>{post.content}</Prose>
          </div>
        </RevealOnView>
      </Container>
    </>
  );
}
