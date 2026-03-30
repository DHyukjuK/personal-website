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
  /** YouTube embed (`/embed/VIDEO_ID`). Omit if the recording is not published yet. */
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
  distanceMiles: number;
  movingTimeSeconds: number;
  pacePerMileSeconds: number;
};

export type WeeklyMileageBin = {
  /** Short label for the week (e.g. start date) */
  label: string;
  miles: number;
};

export type RunHighlights = {
  longest: RunSummary;
  fastest: RunSummary;
  latest: RunSummary;
};

export type StravaDashboard = {
  /** Miles across all runs in this snapshot (recent activities from Strava). */
  totalDistanceMiles: number;
  averagePacePerMileSeconds: number;
  runCount: number;
  milesThisMonth: number;
  /** Mean miles per distinct calendar week represented in the snapshot. */
  avgWeeklyMiles: number;
  weeklyMileage: WeeklyMileageBin[];
  highlights: RunHighlights | null;
  /** Most recent runs for the list (capped). */
  recentRuns: RunSummary[];
};
