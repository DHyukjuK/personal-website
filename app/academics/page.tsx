import Link from "next/link";
import { courseGroups, princetonOverview } from "@/content/academics/data";
import { siteConfig } from "@/config/site";
import { Container } from "@/components/ui/container";
import { cn } from "@/lib/utils";

export const metadata = {
  title: "Academics"
};

function staggerClass(i: number) {
  const offsets = ["ml-0", "md:ml-8", "md:ml-4", "md:ml-14", "md:ml-6", "md:ml-10"];
  return offsets[i % offsets.length];
}

const linkClass =
  "text-orange-600 underline decoration-orange-600/30 underline-offset-[3px] transition-colors hover:text-orange-700 hover:decoration-orange-700/50 dark:text-orange-400 dark:decoration-orange-400/40 dark:hover:text-orange-300";

export default function AcademicsPage() {
  let courseIndex = 0;

  return (
    <Container className="max-w-2xl py-14 lowercase md:py-20">
      <header className="space-y-2">
        <h1 className="font-sans text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
          academics
        </h1>
        <p className="text-sm text-muted-foreground">
          coursework &amp; school. more detail (activities, jobs) on{" "}
          <Link
            href={siteConfig.links.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className={linkClass}
          >
            linkedin
          </Link>
          .
        </p>
      </header>

      <section className="mt-14 space-y-6">
        <h2 className="text-sm font-medium text-muted-foreground">school</h2>
        <div className="space-y-5 border-l-2 border-orange-500/25 pl-5 text-[0.9375rem] leading-relaxed text-foreground dark:border-orange-400/20">
          <p>
            {princetonOverview.classYear} at princeton, working toward a b.s.e.
            in orfe, minors in {princetonOverview.minors.join(" and ")},
            graduating {princetonOverview.graduationYear}.
          </p>
          <p>
            graduated <em>rank 1 (out of ~600)</em> from a public high school in
            southern california.
          </p>
        </div>
      </section>

      <section className="mt-16 space-y-10">
        <h2 className="text-sm font-medium text-muted-foreground">
          coursework
        </h2>

        {courseGroups.map((group) => (
          <div key={group.label} className="space-y-4">
            <h3 className="text-lg font-normal tracking-tight text-foreground/90">
              {group.label}
            </h3>
            <ul className="space-y-3">
              {group.courses.map((c) => {
                const i = courseIndex++;
                return (
                  <li
                    key={c.code}
                    className="flex flex-wrap items-baseline gap-x-3 gap-y-1 text-[0.9375rem]"
                  >
                    <span className="font-semibold text-foreground">
                      {c.code.toLowerCase()}
                    </span>
                    <span
                      className={cn(
                        "italic text-muted-foreground",
                        staggerClass(i)
                      )}
                    >
                      {c.title.toLowerCase()}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </section>
    </Container>
  );
}
