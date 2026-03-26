import type { PropsWithChildren, ReactNode } from "react";
import { cn } from "@/lib/utils";

type SectionProps = PropsWithChildren<{
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}>;

export function Section({
  title,
  description,
  action,
  className,
  children
}: SectionProps) {
  return (
    <section className={cn("space-y-6", className)}>
      <div className="flex items-end justify-between gap-4">
        <div className="space-y-2">
          <h2 className="font-serif text-2xl tracking-tight text-foreground">
            {title}
          </h2>
          {description ? (
            <p className="max-w-prose text-sm leading-7 text-muted-foreground">
              {description}
            </p>
          ) : null}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}
