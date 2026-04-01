import { Container } from "@/components/ui/container";
import { RevealOnView } from "@/components/home/reveal-on-view";
import { DriftingParticles } from "@/components/home/drifting-particles";
import { PostEntry } from "@/components/blog/post-entry";
import { getAllPostsMeta } from "@/lib/mdx";

export const metadata = {
  title: "Blog"
};

export default async function BlogPage() {
  const posts = await getAllPostsMeta();

  return (
    <>
      <div
        className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
        aria-hidden
      >
        <div className="blog-atmosphere absolute inset-0" />
        <DriftingParticles />
      </div>

      <Container className="relative z-[2] max-w-2xl py-16 lowercase md:py-24">
        <RevealOnView>
          <header className="space-y-5">
            <h1 className="font-sans text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
              blog
            </h1>
            <p className="max-w-lg text-[0.9375rem] leading-[1.75] text-muted-foreground">
              a digital journal, kind of. random thoughts, things
              i&apos;ve been interested in, stuff i want to learn more
              about, and whatever else is going on.
            </p>
          </header>
        </RevealOnView>

        <section className="mt-16 md:mt-20">
          <RevealOnView>
            <h2 className="mb-10 flex items-center gap-2.5 text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground/60 md:mb-12">
              <span className="inline-block h-px w-4 bg-accent/40" />
              entries
            </h2>
          </RevealOnView>

          {posts.length > 0 ? (
            <div className="divide-y divide-foreground/[0.05] dark:divide-white/[0.05]">
              {posts.map((post, i) => (
                <RevealOnView key={post.slug} delayMs={40 + i * 60}>
                  <PostEntry
                    slug={post.slug}
                    title={post.title}
                    excerpt={post.excerpt}
                    date={post.date}
                    readingTime={post.readingTime}
                    tags={post.tags}
                  />
                </RevealOnView>
              ))}
            </div>
          ) : (
            <RevealOnView>
              <p className="text-[0.8125rem] italic text-muted-foreground/50">
                nothing here yet. check back soon.
              </p>
            </RevealOnView>
          )}
        </section>
      </Container>
    </>
  );
}
