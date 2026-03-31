import { MusicListeningSection } from "@/components/music/music-listening-section";
import { MusicPerformanceSection } from "@/components/music/music-performance-section";
import { Container } from "@/components/ui/container";

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
      <Container className="relative space-y-0 py-12 md:py-16">
        <MusicListeningSection />
        <MusicPerformanceSection />
      </Container>
    </div>
  );
}
