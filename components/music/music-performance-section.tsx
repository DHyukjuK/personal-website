import Link from "next/link";

import { recordings } from "@/content/music/recordings";
import { siteConfig } from "@/config/site";
import { RecordingCard } from "@/components/music/recording-card";
import { Section } from "@/components/ui/section";

export function MusicPerformanceSection() {
  return (
    <section className="border-t border-foreground/10 pt-14 md:pt-20">
      <Section
        title="Performance"
        description="A few ensemble and solo recordings I’m glad to keep in one place. Mostly piano, with violin when the arrangement asks for it."
        className="max-w-5xl"
      >
        <div className="space-y-6 text-[0.9375rem] leading-[1.7] text-muted-foreground md:space-y-7">
          <p>
            I play piano, clarinet, and violin. Several of these are with the{" "}
            <Link
              href="https://www.princetonpianists.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground underline decoration-foreground/18 underline-offset-[4px] transition-colors hover:decoration-foreground/40"
            >
              Princeton Pianists Ensemble
            </Link>
            . More clips and older material live on{" "}
            <Link
              href={siteConfig.links.youtube}
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground underline decoration-foreground/18 underline-offset-[4px] transition-colors hover:decoration-foreground/40"
            >
              YouTube
            </Link>
            . {siteConfig.youtubeNote}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-x-8 gap-y-10 pt-10 md:grid-cols-2 md:pt-12">
          {recordings.map((recording) => (
            <RecordingCard key={recording.id} recording={recording} />
          ))}
        </div>
      </Section>
    </section>
  );
}
