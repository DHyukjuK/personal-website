import Link from "next/link";
import { recordings } from "@/content/music/recordings";
import { siteConfig } from "@/config/site";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { RecordingCard } from "@/components/music/recording-card";

export const metadata = {
  title: "Music"
};

export default function MusicPage() {
  return (
    <Container className="space-y-10 py-12">
      <Section
        title="Music"
        description="Performances, arrangements, and practice across the instruments I play."
      >
        <div className="max-w-2xl space-y-4 border-b border-foreground/10 pb-8 text-[0.9375rem] leading-relaxed text-muted-foreground">
          <p>
            I play piano, clarinet, and violin. Below are a few performances
            I’m glad to share; some are with the{" "}
            <Link
              href="https://www.princetonpianists.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground underline decoration-foreground/20 underline-offset-[5px] transition-colors hover:decoration-foreground/40"
            >
              Princeton Pianists Ensemble
            </Link>
            , one of several groups I’m involved with on campus. More clips and
            older recordings are on{" "}
            <Link
              href={siteConfig.links.youtube}
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground underline decoration-foreground/20 underline-offset-[5px] transition-colors hover:decoration-foreground/40"
            >
              YouTube
            </Link>
            . {siteConfig.youtubeNote}
          </p>
        </div>
        <div className="grid gap-4 pt-4 md:grid-cols-2">
          {recordings.map((recording) => (
            <RecordingCard key={recording.title} recording={recording} />
          ))}
        </div>
      </Section>
    </Container>
  );
}
