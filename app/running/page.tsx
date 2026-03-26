import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { StatsCards } from "@/components/running/stats-cards";
import { RunList } from "@/components/running/run-list";
import { getStravaDashboard } from "@/lib/strava";

export const metadata = {
  title: "Running"
};

export default async function RunningPage() {
  const dashboard = await getStravaDashboard();

  return (
    <Container className="space-y-10 py-12">
      <Section
        title="Running"
        description="Recent Strava activity and lightweight summary statistics."
      >
        {dashboard ? (
          <div className="space-y-6">
            <StatsCards stats={dashboard} />
            <RunList runs={dashboard.recentRuns} />
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-border p-8 text-sm text-muted-foreground">
            Connect Strava by adding the required environment variables to load
            live run data.
          </div>
        )}
      </Section>
    </Container>
  );
}
