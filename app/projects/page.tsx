import { projects } from "@/content/projects/projects";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { ProjectGrid } from "@/components/projects/project-grid";

export const metadata = {
  title: "Projects"
};

export default function ProjectsPage() {
  return (
    <Container className="space-y-10 py-12">
      <Section
        title="Projects"
        description="A few course and independent projects. Reports open in Google Drive where linked."
      >
        <ProjectGrid projects={projects} />
      </Section>
    </Container>
  );
}
