import Link from "next/link";

import { Hero } from "@/components/home/hero";
import { HomeAtmosphere } from "@/components/home/home-atmosphere";
import { SpotifySection } from "@/components/home/spotify-section";
import { RevealOnView } from "@/components/home/reveal-on-view";
import { Container } from "@/components/ui/container";
import { cn } from "@/lib/utils";

const exploreLinks = [
  {
    title: "projects",
    description: "things i'm building and tinkering with.",
    href: "/projects"
  },
  {
    title: "music",
    description: "what i'm playing and listening to.",
    href: "/music"
  },
  {
    title: "running",
    description: "miles logged, routes, and progress.",
    href: "/running"
  },
  {
    title: "blog",
    description: "writing about whatever's on my mind.",
    href: "/blog"
  }
] as const;

const latelyItems = [
  "getting into distance running",
  "learning golf swings from YouTube",
  "reading more fiction",
  "building side projects",
  "watching too much anime"
] as const;

export default function HomePage() {
  return (
    <>
      <HomeAtmosphere />
      <Container className="relative z-[2] pt-5 pb-16 md:pt-7 md:pb-20">
        <div className="home-page space-y-12 md:space-y-16">
          <Hero />

          <RevealOnView delayMs={40}>
            <SpotifySection variant="music" />
          </RevealOnView>
        </div>

        {/* Explore section */}
        <section className="mt-24 border-t border-foreground/[0.07] pt-16 md:mt-32 md:pt-24">
          <RevealOnView>
            <h2 className="mb-12 font-sans text-sm font-semibold lowercase tracking-tight text-foreground md:mb-16">
              explore.
            </h2>
          </RevealOnView>
          <div className="max-w-lg space-y-0">
            {exploreLinks.map((item, i) => (
              <RevealOnView key={item.title} delayMs={60 + i * 80}>
                <Link
                  href={item.href}
                  className={cn(
                    "group block rounded-lg border border-transparent px-4 py-4 -mx-4 md:py-5",
                    "transition-[border-color,background-color,box-shadow,transform] duration-500 ease-soft-out",
                    "hover:border-foreground/[0.08] hover:bg-accent/[0.06] hover:shadow-[0_2px_12px_-4px_rgba(0,0,0,0.06)]",
                    "dark:hover:border-white/[0.08] dark:hover:bg-accent/[0.08] dark:hover:shadow-[0_2px_16px_-4px_rgba(0,0,0,0.3)]",
                    "active:scale-[0.997]"
                  )}
                >
                  <div className="flex items-baseline justify-between gap-6">
                    <h3 className="font-sans text-[0.9375rem] font-medium tracking-tight text-foreground">
                      {item.title}
                      <span
                        className="ml-2 inline-block text-accent/60 opacity-0 transition-[opacity,transform] duration-500 group-hover:translate-x-0.5 group-hover:opacity-100"
                        aria-hidden
                      >
                        →
                      </span>
                    </h3>
                    <p className="text-right text-[0.8125rem] text-muted-foreground/60 transition-colors duration-500 group-hover:text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                </Link>
              </RevealOnView>
            ))}
          </div>
        </section>

        {/* Lately section */}
        <section className="mt-20 md:mt-28">
          <RevealOnView>
            <h2 className="mb-8 font-sans text-sm font-semibold lowercase tracking-tight text-foreground md:mb-10">
              lately.
            </h2>
          </RevealOnView>
          <RevealOnView delayMs={80}>
            <div className="flex flex-wrap gap-2.5">
              {latelyItems.map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-foreground/[0.08] bg-muted/40 px-3.5 py-1.5 text-[0.75rem] text-muted-foreground transition-colors duration-500 hover:border-accent/25 hover:text-foreground dark:bg-muted/30"
                >
                  {item}
                </span>
              ))}
            </div>
          </RevealOnView>
        </section>

      </Container>
    </>
  );
}
