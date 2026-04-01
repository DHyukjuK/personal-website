"use client";

import { useState } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

type PostEntryProps = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readingTime: string;
  tags: string[];
};

export function PostEntry({
  slug,
  title,
  excerpt,
  date,
  readingTime,
  tags
}: PostEntryProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <Link
      href={`/blog/${slug}`}
      className="group block py-5 md:py-6"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="flex items-baseline justify-between gap-6">
        <h3 className="font-serif text-lg tracking-tight text-foreground transition-colors duration-300 group-hover:text-foreground/80 md:text-xl">
          {title.toLowerCase()}
        </h3>
        <span className="shrink-0 text-[0.6875rem] tabular-nums text-muted-foreground/50 transition-colors duration-300 group-hover:text-muted-foreground/70">
          {format(new Date(date), "MMM d, yyyy").toLowerCase()}
        </span>
      </div>

      <div className="mt-1 flex items-center gap-3 text-[0.6875rem] text-muted-foreground/40">
        <span>{readingTime.toLowerCase()}</span>
        {tags.length > 0 ? (
          <>
            <span>·</span>
            <span>{tags.map((t) => t.toLowerCase()).join(", ")}</span>
          </>
        ) : null}
      </div>

      <div
        className={cn(
          "overflow-hidden transition-[max-height,opacity] duration-500 ease-soft-out",
          hovered ? "max-h-24 opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <p className="pt-3 text-[0.8125rem] leading-[1.7] text-muted-foreground/60">
          {excerpt}
        </p>
      </div>
    </Link>
  );
}
