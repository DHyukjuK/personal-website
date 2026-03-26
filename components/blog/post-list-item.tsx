import Link from "next/link";
import { Card } from "@/components/ui/card";
import { PostMeta } from "@/components/blog/post-meta";

type PostListItemProps = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readingTime: string;
  tags: string[];
};

export function PostListItem({
  slug,
  title,
  excerpt,
  date,
  readingTime,
  tags
}: PostListItemProps) {
  return (
    <Card className="space-y-3">
      <div className="space-y-2">
        <Link href={`/blog/${slug}`} className="font-serif text-xl tracking-tight">
          {title}
        </Link>
        <PostMeta date={date} readingTime={readingTime} />
      </div>
      <p className="text-sm leading-7 text-muted-foreground">{excerpt}</p>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground"
          >
            {tag}
          </span>
        ))}
      </div>
    </Card>
  );
}
