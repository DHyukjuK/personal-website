import Link from "next/link";
import { MusicListeningSection } from "@/components/music/music-listening-section";
import { MediaEmbed } from "@/components/music/media-embed";
import { Container } from "@/components/ui/container";
import { RevealOnView } from "@/components/home/reveal-on-view";
import { siteConfig } from "@/config/site";
import { recordings } from "@/content/music/recordings";

export const metadata = {
  title: "Music"
};

export default function MusicPage() {
  return (
    <div className="relative">
      <div
        className="music-page-atmosphere pointer-events-none absolute inset-0 -z-10 min-h-full"
        aria-hidden
      />
      <Container className="relative max-w-2xl py-16 lowercase md:py-24">
        <RevealOnView>
          <header className="space-y-5">
            <h1 className="font-sans text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
              music
            </h1>
            <div className="max-w-lg space-y-4 text-[0.9375rem] leading-[1.75] text-muted-foreground">
              <p>
                music is probably the thing i&apos;ve spent the most time on
                outside of school. i play piano, clarinet, and violin — mostly
                piano these days, often with the{" "}
                <Link
                  href="https://www.princetonpianists.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-foreground underline decoration-foreground/18 underline-offset-[4px] transition-colors hover:decoration-foreground/40"
                >
                  princeton pianists ensemble
                </Link>
                .
              </p>
              <p>
                i listen to a lot of kpop, jpop, r&amp;b, and classical.
                streaming is how i find most of what i listen to.
              </p>
            </div>
          </header>
        </RevealOnView>

        <RevealOnView delayMs={60}>
          <section className="mt-16 md:mt-20">
            <h2 className="mb-8 flex items-center gap-2.5 text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground/60 md:mb-10">
              <span className="inline-block h-px w-4 bg-accent/40" />
              listening
            </h2>
            <MusicListeningSection />
          </section>
        </RevealOnView>

        <section className="mt-16 border-t border-foreground/[0.07] pt-16 md:mt-20 md:pt-20">
          <RevealOnView>
            <h2 className="mb-4 flex items-center gap-2.5 text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground/60 md:mb-5">
              <span className="inline-block h-px w-4 bg-accent/40" />
              recordings
            </h2>
            <p className="mb-12 max-w-lg text-[0.9375rem] leading-[1.75] text-muted-foreground md:mb-14">
              a few ensemble and solo recordings i&apos;m glad to keep in one
              place. more clips and older material live on{" "}
              <Link
                href={siteConfig.links.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground underline decoration-foreground/18 underline-offset-[4px] transition-colors hover:decoration-foreground/40"
              >
                youtube
              </Link>
              . {siteConfig.youtubeNote.toLowerCase()}
            </p>
          </RevealOnView>

          <div className="space-y-14 md:space-y-16">
            {recordings.map((recording, i) => (
              <RevealOnView key={recording.id} delayMs={40 + i * 60}>
                <article className="border-l-2 border-amber-500/25 pl-5 dark:border-amber-400/20 md:pl-6">
                  <p className="text-[0.6875rem] font-medium tracking-tight text-amber-600/60 dark:text-amber-400/50">
                    {recording.instrument.toLowerCase()} · {recording.year}
                  </p>
                  <h3 className="mt-2 text-[0.9375rem] font-semibold leading-snug tracking-tight text-foreground/85 md:text-base">
                    {recording.title.toLowerCase()}
                  </h3>
                  {recording.context ? (
                    <p className="mt-1.5 text-[0.75rem] leading-relaxed text-muted-foreground/55">
                      {recording.context.toLowerCase()}
                    </p>
                  ) : null}
                  <p className="mt-3 text-[0.9375rem] leading-[1.75] text-muted-foreground/75">
                    {recording.description}
                  </p>
                  {recording.embedUrl ? (
                    <div className="mt-5 space-y-3">
                      <MediaEmbed
                        title={recording.title}
                        url={recording.embedUrl}
                        frame="minimal"
                      />
                      {recording.watchUrl ? (
                        <p className="text-[0.75rem] text-muted-foreground">
                          <Link
                            href={recording.watchUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="link-warm-underline text-muted-foreground/70 hover:text-foreground"
                          >
                            open on youtube
                          </Link>
                        </p>
                      ) : null}
                    </div>
                  ) : null}
                </article>
              </RevealOnView>
            ))}
          </div>
        </section>

        <RevealOnView delayMs={80}>
          <p className="mt-20 text-center text-[0.8125rem] italic text-muted-foreground/40 md:mt-28">
            more on my{" "}
            <a
              href={siteConfig.links.youtube}
              target="_blank"
              rel="noopener noreferrer"
              className="not-italic text-muted-foreground/50 underline decoration-muted-foreground/20 underline-offset-[3px] transition-colors hover:text-muted-foreground/70 hover:decoration-muted-foreground/40"
            >
              youtube
            </a>
            .
          </p>
        </RevealOnView>
      </Container>
    </div>
  );
}
