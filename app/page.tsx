import Link from "next/link";
import { DustField } from "@/components/home/dust-field";
import { Hero } from "@/components/home/hero";
import { RevealOnView } from "@/components/home/reveal-on-view";
import { Container } from "@/components/ui/container";
import { cn } from "@/lib/utils";

const focusAreas = [
  {
    title: "Projects",
    description: "Side projects and things I'm tinkering with.",
    href: "/projects"
  },
  {
    title: "Music practice",
    description: "Playing and listening on piano, clarinet, and violin.",
    href: "/music"
  },
  {
    title: "Running & other interests",
    description: "More running lately, plus golf, dance, and reading.",
    href: "/running"
  }
] as const;

export default function HomePage() {
  return (
    <>
      <DustField />
      <Container className="relative z-[2] space-y-24 py-16 md:space-y-32 md:py-24">
        <div className="space-y-12 md:space-y-16">
          <Hero />
        </div>
        <section className="border-t border-foreground/10 pt-16 md:pt-20">
          <RevealOnView>
            <div className="mb-12 space-y-4 md:mb-16 md:flex md:items-end md:justify-between md:gap-12">
              <h2 className="font-sans text-sm font-semibold lowercase tracking-tight text-foreground">
                focus.
              </h2>
              <p className="max-w-md text-[0.8125rem] leading-relaxed text-muted-foreground md:text-right">
                A short list of what I&apos;m focused on.
              </p>
            </div>
          </RevealOnView>
          <div className="grid gap-6 md:grid-cols-3 md:gap-8">
            {focusAreas.map((item, i) => (
              <RevealOnView key={item.title} delayMs={80 + i * 90}>
                <Link
                  href={item.href}
                  className={cn(
                    "group block space-y-3 rounded-lg border border-transparent p-4 -m-4",
                    "transition-[border-color,background-color,transform] duration-calm ease-soft-out",
                    "hover:border-foreground/10 hover:bg-muted/40",
                    "active:scale-[0.99]"
                  )}
                >
                  <h3 className="font-sans text-sm font-medium lowercase tracking-tight text-foreground">
                    {item.title}
                    <span
                      className="ml-1.5 inline-block text-muted-foreground opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                      aria-hidden
                    >
                      →
                    </span>
                  </h3>
                  <p className="text-[0.8125rem] leading-[1.75] text-muted-foreground transition-colors duration-200 group-hover:text-foreground/85">
                    {item.description}
                  </p>
                </Link>
              </RevealOnView>
            ))}
          </div>
        </section>
        <RevealOnView delayMs={60}>
          <p className="border-t border-foreground/10 pt-12 text-[0.8125rem] leading-relaxed text-muted-foreground md:pt-16">
            <Link
              href="/projects"
              className="text-foreground underline decoration-foreground/20 underline-offset-[5px] transition-colors duration-200 hover:decoration-foreground/40"
            >
              projects
            </Link>
            ,{" "}
            <Link
              href="/blog"
              className="text-foreground underline decoration-foreground/20 underline-offset-[5px] transition-colors duration-200 hover:decoration-foreground/40"
            >
              writing
            </Link>
            , or whatever you came for.
          </p>
        </RevealOnView>
      </Container>
    </>
  );
}
