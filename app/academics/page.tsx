import Link from "next/link";
import { courseGroups, princetonOverview } from "@/content/academics/data";
import { siteConfig } from "@/config/site";
import { Container } from "@/components/ui/container";
import { RevealOnView } from "@/components/home/reveal-on-view";
import { DriftingParticles } from "@/components/home/drifting-particles";
import { cn } from "@/lib/utils";

export const metadata = {
  title: "Academics"
};

const accentMap: Record<string, { left: string; bg: string; text: string; dot: string }> = {
  sky: {
    left: "border-l-sky-500/30 dark:border-l-sky-400/25",
    bg: "hover:bg-sky-500/[0.03] dark:hover:bg-sky-400/[0.03]",
    text: "text-sky-600/80 dark:text-sky-400/70",
    dot: "bg-sky-500/40 dark:bg-sky-400/30"
  },
  violet: {
    left: "border-l-violet-500/30 dark:border-l-violet-400/25",
    bg: "hover:bg-violet-500/[0.03] dark:hover:bg-violet-400/[0.03]",
    text: "text-violet-600/80 dark:text-violet-400/70",
    dot: "bg-violet-500/40 dark:bg-violet-400/30"
  },
  teal: {
    left: "border-l-teal-500/30 dark:border-l-teal-400/25",
    bg: "hover:bg-teal-500/[0.03] dark:hover:bg-teal-400/[0.03]",
    text: "text-teal-600/80 dark:text-teal-400/70",
    dot: "bg-teal-500/40 dark:bg-teal-400/30"
  },
  amber: {
    left: "border-l-amber-500/30 dark:border-l-amber-400/25",
    bg: "hover:bg-amber-500/[0.03] dark:hover:bg-amber-400/[0.03]",
    text: "text-amber-600/80 dark:text-amber-400/70",
    dot: "bg-amber-500/40 dark:bg-amber-400/30"
  },
  rose: {
    left: "border-l-rose-500/30 dark:border-l-rose-400/25",
    bg: "hover:bg-rose-500/[0.03] dark:hover:bg-rose-400/[0.03]",
    text: "text-rose-600/80 dark:text-rose-400/70",
    dot: "bg-rose-500/40 dark:bg-rose-400/30"
  },
  slate: {
    left: "border-l-slate-400/30 dark:border-l-slate-500/25",
    bg: "hover:bg-slate-500/[0.03] dark:hover:bg-slate-400/[0.03]",
    text: "text-slate-500/80 dark:text-slate-400/70",
    dot: "bg-slate-400/40 dark:bg-slate-500/30"
  }
};

export default function AcademicsPage() {
  return (
    <>
      <div
        className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
        aria-hidden
      >
        <div className="academics-atmosphere absolute inset-0" />
        <DriftingParticles />
      </div>

      <Container className="relative z-[2] max-w-2xl py-16 lowercase md:py-24">
        {/* ---- Header ---- */}
        <RevealOnView>
          <header className="space-y-5">
            <h1 className="font-sans text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
              academics
            </h1>
            <p className="max-w-lg text-[0.9375rem] leading-[1.75] text-muted-foreground">
              everything i&apos;ve taken at princeton so far. orfe is kind of
              hard to explain to people, but it&apos;s a lot of applied math,
              probability, and optimization. i also take a bunch of cs, econ,
              and whatever else looks interesting.
            </p>
          </header>
        </RevealOnView>

        {/* ---- School ---- */}
        <RevealOnView delayMs={60}>
          <section className="mt-16 md:mt-20">
            <h2 className="mb-6 flex items-center gap-2.5 text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground/60">
              <span className="inline-block h-px w-4 bg-accent/40" />
              school
            </h2>
            <div className="space-y-4 border-l-2 border-accent/20 pl-5 text-[0.9375rem] leading-[1.75] text-foreground">
              <p>
                {princetonOverview.classYear} at princeton. b.s.e. in orfe,
                minoring in {princetonOverview.minors.join(" and ")}.
                graduating {princetonOverview.graduationYear}.
              </p>
              <p>
                graduated{" "}
                <span className="font-medium">rank 1 (out of ~600)</span> from
                a public high school in southern california.
              </p>
            </div>
            <p className="mt-4 pl-5 text-[0.8125rem] text-muted-foreground/50">
              more on{" "}
              <Link
                href={siteConfig.links.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="link-warm-underline text-muted-foreground/70 hover:text-foreground"
              >
                linkedin
              </Link>
            </p>
          </section>
        </RevealOnView>

        {/* ---- Aside ---- */}
        <RevealOnView delayMs={100}>
          <p className="mt-16 max-w-sm font-serif text-[1.0625rem] italic leading-[1.7] text-foreground/50 md:mt-20">
            trying to take a wider range of things each semester.
          </p>
        </RevealOnView>

        {/* ---- Coursework ---- */}
        <section className="mt-14 md:mt-18">
          <RevealOnView>
            <h2 className="mb-10 flex items-center gap-2.5 text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground/60 md:mb-12">
              <span className="inline-block h-px w-4 bg-accent/40" />
              coursework
            </h2>
          </RevealOnView>

          <div className="space-y-8 md:space-y-10">
            {courseGroups.map((group, gi) => {
              const colors = accentMap[group.accent] ?? accentMap.sky;
              return (
                <RevealOnView key={group.label} delayMs={40 + gi * 60}>
                  <div
                    className={cn(
                      "rounded-lg border-l-2 pl-5 md:pl-6",
                      colors.left
                    )}
                  >
                    <div className="mb-4 flex items-center gap-2.5 md:mb-5">
                      <span
                        className={cn(
                          "h-1.5 w-1.5 rounded-full",
                          colors.dot
                        )}
                      />
                      <h3 className="text-[0.8125rem] font-semibold tracking-tight text-foreground/85">
                        {group.label}
                      </h3>
                    </div>
                    <ul className="space-y-0">
                      {group.courses.map((c, ci) => (
                        <li
                          key={c.code}
                          className={cn(
                            "group grid grid-cols-[5.5rem_minmax(0,1fr)] items-baseline gap-x-4 rounded-md px-2 py-2 -mx-2 text-[0.9375rem]",
                            "transition-[background-color,transform] duration-300",
                            colors.bg,
                            "hover:translate-x-0.5",
                            ci < group.courses.length - 1 &&
                              "border-b border-foreground/[0.025] dark:border-white/[0.025]"
                          )}
                        >
                          <span
                            className={cn(
                              "font-mono text-[0.8125rem] font-medium tracking-tight transition-opacity duration-300",
                              colors.text,
                              "group-hover:opacity-100 opacity-80"
                            )}
                          >
                            {c.code.toLowerCase()}
                          </span>
                          <span className="text-muted-foreground/75 transition-colors duration-300 group-hover:text-foreground/70">
                            {c.title.toLowerCase()}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </RevealOnView>
              );
            })}
          </div>
        </section>

        {/* ---- Closing ---- */}
        <RevealOnView delayMs={80}>
          <p className="mt-20 text-center text-[0.8125rem] italic text-muted-foreground/40 md:mt-28">
            there&apos;s a lot i still want to take.
          </p>
        </RevealOnView>
      </Container>
    </>
  );
}
