import Image from "next/image";
import { siteConfig } from "@/config/site";
import { SocialLinks } from "@/components/home/social-links";

export function Hero() {
  return (
    <section className="grid gap-12 md:grid-cols-[minmax(0,1.2fr)_minmax(0,0.65fr)] md:items-start md:gap-16 lg:gap-24">
      <div className="animate-fade-in space-y-8 md:pt-1">
        <div className="space-y-2">
          <p className="text-[0.625rem] font-medium uppercase tracking-[0.2em] text-muted-foreground">
            {siteConfig.tagline}
          </p>
          <p className="text-[0.625rem] font-medium uppercase tracking-[0.18em] text-muted-foreground/90">
            {siteConfig.location}
          </p>
        </div>
        <h1 className="max-w-[32ch] font-sans text-[2rem] font-semibold lowercase leading-[1.15] tracking-[-0.03em] text-foreground md:max-w-[40ch] md:text-[2.5rem] md:leading-[1.12] lg:text-[2.75rem]">
          to be cringe is to be free.
        </h1>
        <p className="max-w-[52ch] text-[0.9375rem] leading-[1.75] text-muted-foreground">
          {siteConfig.bio}
        </p>
        <SocialLinks />
      </div>
      <div className="animate-fade-in-delayed md:justify-self-end">
        <figure className="group relative mx-auto aspect-[3/4] w-full max-w-[11rem] overflow-hidden rounded-md border border-foreground/10 bg-muted/40 md:mx-0 md:max-w-[13rem]">
          <Image
            src="/images/profile.png"
            alt="David H. Kwon"
            fill
            priority
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
          />
        </figure>
      </div>
    </section>
  );
}
