import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Tag } from "@/components/ui/tag";
import type { Project } from "@/lib/types";

type ProjectCardProps = {
  project: Project;
};

const linkClass =
  "underline underline-offset-4 transition-colors hover:text-foreground";

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Card className="space-y-4">
      <div className="space-y-2">
        <h3 className="font-serif text-xl tracking-tight text-foreground">
          {project.title}
        </h3>
        <p className="text-sm leading-7 text-muted-foreground">
          {project.description}
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        {project.tech.map((stack) => (
          <Tag key={stack} label={stack} />
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
        {project.repoUrl ? (
          <Link
            href={project.repoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={linkClass}
          >
            Code
          </Link>
        ) : null}
        {project.reportUrl ? (
          <Link
            href={project.reportUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={linkClass}
          >
            Report
          </Link>
        ) : null}
        {project.demoUrl ? (
          <Link
            href={project.demoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={linkClass}
          >
            Live
          </Link>
        ) : null}
      </div>
    </Card>
  );
}
