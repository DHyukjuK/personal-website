import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { PostListItem } from "@/components/blog/post-list-item";
import { getAllPostsMeta } from "@/lib/mdx";

export const metadata = {
  title: "Blog"
};

export default async function BlogPage() {
  const posts = await getAllPostsMeta();

  return (
    <Container className="space-y-10 py-12">
      <Section
        title="Blog"
        description="Notes on ORFE, projects, music, running, and anything worth thinking through."
      >
        <div className="space-y-4">
          {posts.map((post) => (
            <PostListItem
              key={post.slug}
              slug={post.slug}
              title={post.title}
              excerpt={post.excerpt}
              date={post.date}
              readingTime={post.readingTime}
              tags={post.tags}
            />
          ))}
        </div>
      </Section>
    </Container>
  );
}
