export type Project = {
  title: string;
  description: string;
  tech: string[];
  /** Source / repo; omit if not public */
  repoUrl?: string;
  /** Written report (e.g. PDF on Drive) */
  reportUrl?: string;
  demoUrl?: string;
  image?: string;
  featured?: boolean;
};

export type Recording = {
  title: string;
  instrument: "Piano" | "Clarinet" | "Ensemble";
  year: number;
  description: string;
  embedType: "audio" | "video";
  /** YouTube embed (`/embed/VIDEO_ID`). Omit when the recording is not published yet. */
  embedUrl?: string;
  /** Optional “watch on YouTube” URL */
  watchUrl?: string;
  duration?: string;
  /** Full-width highlight at the top of the list */
  featured?: boolean;
  /** Short line under the title (e.g. venue, concert name) */
  context?: string;
};

export type BlogPostFrontmatter = {
  title: string;
  date: string;
  excerpt: string;
  tags: string[];
  draft?: boolean;
};

export type RunSummary = {
  id: string;
  name: string;
  date: string;
  distanceKm: number;
  movingTimeSeconds: number;
  pacePerKmSeconds: number;
};

export type StravaDashboard = {
  totalDistanceKm: number;
  averagePacePerKmSeconds: number;
  runCount: number;
  recentRuns: RunSummary[];
};
