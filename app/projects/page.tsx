import Link from "next/link";
import { projects } from "@/content/projects/projects";
import { Container } from "@/components/ui/container";
import { RevealOnView } from "@/components/home/reveal-on-view";
import { DriftingParticles } from "@/components/home/drifting-particles";
import { cn } from "@/lib/utils";

export const metadata = {
  title: "Projects"
};

const accentColors = [
  {
    left: "border-l-sky-500/30 dark:border-l-sky-400/25",
    tag: "text-sky-600/70 dark:text-sky-400/60"
  },
  {
    left: "border-l-violet-500/30 dark:border-l-violet-400/25",
    tag: "text-violet-600/70 dark:text-violet-400/60"
  },
  {
    left: "border-l-amber-500/30 dark:border-l-amber-400/25",
    tag: "text-amber-600/70 dark:text-amber-400/60"
  }
];

export default function ProjectsPage() {
  return (
    <>
      <div
        className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
        aria-hidden
      >
        <div className="projects-atmosphere absolute inset-0" />
        <DriftingParticles />
      </div>

      <Container className="relative z-[2] max-w-2xl py-16 lowercase md:py-24">
        <RevealOnView>
          <header className="space-y-5">
            <h1 className="font-sans text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
              projects
            </h1>
            <p className="max-w-lg text-[0.9375rem] leading-[1.75] text-muted-foreground">
              a few course and independent projects. reports open in
              google drive where linked.
            </p>
          </header>
        </RevealOnView>

        <section className="mt-16 md:mt-20">
          <RevealOnView>
            <h2 className="mb-10 flex items-center gap-2.5 text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground/60 md:mb-12">
              <span className="inline-block h-px w-4 bg-accent/40" />
              work
            </h2>
          </RevealOnView>

          <div className="space-y-8 md:space-y-10">
            {projects.map((project, i) => {
              const colors = accentColors[i % accentColors.length];
              return (
                <RevealOnView key={project.title} delayMs={40 + i * 60}>
                  <article
                    className={cn(
                      "rounded-lg border-l-2 pl-5 md:pl-6",
                      colors.left
                    )}
                  >
                    <p
                      className={cn(
                        "mb-3 text-[0.6875rem] font-medium tracking-tight",
                        colors.tag
                      )}
                    >
                      {project.tech.map((t) => t.toLowerCase()).join(" · ")}
                    </p>

                    <h3 className="text-[0.9375rem] font-semibold leading-snug tracking-tight text-foreground/85 md:text-base">
                      {project.title.toLowerCase()}
                    </h3>

                    <p className="mt-3 text-[0.9375rem] leading-[1.75] text-muted-foreground/75">
                      {project.description}
                    </p>

                    <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-1 text-[0.8125rem]">
                      {project.reportUrl ? (
                        <Link
                          href={project.reportUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="link-warm-underline text-muted-foreground/70 hover:text-foreground"
                        >
                          report
                        </Link>
                      ) : null}
                      {project.repoUrl ? (
                        <Link
                          href={project.repoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="link-warm-underline text-muted-foreground/70 hover:text-foreground"
                        >
                          code
                        </Link>
                      ) : null}
                      {project.demoUrl ? (
                        <Link
                          href={project.demoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="link-warm-underline text-muted-foreground/70 hover:text-foreground"
                        >
                          live
                        </Link>
                      ) : null}
                    </div>
                  </article>
                </RevealOnView>
              );
            })}
          </div>
        </section>

        <RevealOnView delayMs={80}>
          <p className="mt-20 text-center text-[0.8125rem] italic text-muted-foreground/40 md:mt-28">
            more coming as i finish things.
          </p>
        </RevealOnView>
      </Container>
    </>
  );
}
