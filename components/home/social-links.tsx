import Link from "next/link";
import { siteConfig } from "@/config/site";

const linkClass =
  "link-warm-underline inline-flex items-center text-[0.8125rem] text-muted-foreground hover:text-foreground";

export function SocialLinks() {
  return (
    <div className="flex flex-wrap gap-x-8 gap-y-2 pt-2">
      <Link
        href={siteConfig.links.github}
        target="_blank"
        rel="noopener noreferrer"
        className={linkClass}
      >
        GitHub
      </Link>
      <Link
        href={siteConfig.links.linkedin}
        target="_blank"
        rel="noopener noreferrer"
        className={linkClass}
      >
        LinkedIn
      </Link>
      <Link
        href={siteConfig.links.youtube}
        target="_blank"
        rel="noopener noreferrer"
        className={linkClass}
      >
        YouTube
      </Link>
      <Link
        href={`mailto:${siteConfig.links.email}`}
        className={linkClass}
      >
        email
      </Link>
    </div>
  );
}
