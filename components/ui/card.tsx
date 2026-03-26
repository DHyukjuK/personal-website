import type { PropsWithChildren } from "react";
import { cn } from "@/lib/utils";

type CardProps = PropsWithChildren<{
  className?: string;
}>;

export function Card({ children, className }: CardProps) {
  return (
    <article
      className={cn(
        "rounded-xl border border-border bg-card p-5 transition-colors hover:border-foreground/30",
        className
      )}
    >
      {children}
    </article>
  );
}
