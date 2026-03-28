import Link from "next/link";
import { siteConfig } from "@/config/site";
import { Container } from "@/components/ui/container";

export function SiteFooter() {
  return (
    <footer className="border-t border-foreground/10">
      <Container className="flex flex-col gap-4 py-10 text-[11px] text-muted-foreground md:flex-row md:items-center md:justify-between md:gap-8">
        <p className="lowercase tracking-[0.04em]">
          © {new Date().getFullYear()} {siteConfig.name}
        </p>
        <div className="flex flex-wrap gap-x-6 gap-y-1">
          <Link
            href={siteConfig.links.github}
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors duration-200 hover:text-foreground"
          >
            GitHub
          </Link>
          <Link
            href={siteConfig.links.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors duration-200 hover:text-foreground"
          >
            LinkedIn
          </Link>
          <Link
            href={siteConfig.links.youtube}
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors duration-200 hover:text-foreground"
          >
            YouTube
          </Link>
          <Link
            href={`mailto:${siteConfig.links.email}`}
            className="transition-colors duration-200 hover:text-foreground"
          >
            email
          </Link>
        </div>
      </Container>
    </footer>
  );
}
