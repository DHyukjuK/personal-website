import type { PropsWithChildren } from "react";
import { cn } from "@/lib/utils";

type ProseProps = PropsWithChildren<{
  className?: string;
}>;

export function Prose({ children, className }: ProseProps) {
  return (
    <article
      className={cn(
        "prose prose-neutral max-w-prose text-foreground dark:prose-invert prose-headings:font-serif prose-headings:tracking-tight prose-a:text-foreground prose-a:underline-offset-4 hover:prose-a:underline",
        className
      )}
    >
      {children}
    </article>
  );
}
