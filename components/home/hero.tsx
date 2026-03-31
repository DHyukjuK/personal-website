"use client";

import { useState } from "react";
import Image from "next/image";

import { siteConfig } from "@/config/site";
import { HeroImageParallax } from "@/components/home/hero-image-parallax";
import { SocialLinks } from "@/components/home/social-links";
import { cn } from "@/lib/utils";

export function Hero() {
  const [imgError, setImgError] = useState(false);

  return (
    <section className="relative pb-6 pt-6 md:pb-12 md:pt-10">
      {/* ---- Portrait + atmospheric glow ---- */}
      <div className="mb-12 flex justify-center md:mb-16 lg:float-right lg:mb-8 lg:ml-12 lg:mr-0 xl:ml-16">
        <HeroImageParallax>
          <div className="relative">
            <div
              className="hero-portrait-glow pointer-events-none absolute -inset-20 -z-10 rounded-full"
              aria-hidden
            />

            <div
              className={cn(
                "hero-portrait-ring home-hero-portrait-float",
                "transition-[transform,box-shadow] duration-700 ease-soft-out",
                "rounded-[1.1rem]",
                "shadow-[0_20px_55px_-16px_rgba(25,20,40,0.35)]",
                "dark:shadow-[0_24px_68px_-14px_rgba(0,0,0,0.75)]",
                "hover:scale-[1.015] hover:shadow-[0_26px_65px_-14px_rgba(25,20,40,0.45)]",
                "dark:hover:shadow-[0_30px_78px_-12px_rgba(0,0,0,0.85)]"
              )}
            >
              <figure className="relative overflow-hidden rounded-[calc(1.1rem-2px)] ring-1 ring-inset ring-foreground/[0.06] dark:ring-white/[0.08]">
                {!imgError ? (
                  <Image
                    src={siteConfig.profileImage}
                    alt={siteConfig.name}
                    width={480}
                    height={640}
                    priority
                    unoptimized
                    onError={() => setImgError(true)}
                    className="h-[16rem] w-[12rem] object-cover object-[center_18%] sm:h-[18rem] sm:w-[13.5rem] lg:h-[22rem] lg:w-[16.5rem]"
                  />
                ) : (
                  <div className="flex h-[16rem] w-[12rem] items-center justify-center bg-muted text-xs text-muted-foreground sm:h-[18rem] sm:w-[13.5rem] lg:h-[22rem] lg:w-[16.5rem]">
                    {siteConfig.name}
                  </div>
                )}

                <div
                  className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-br from-white/18 via-transparent to-transparent opacity-50 dark:from-white/10 dark:opacity-40"
                  aria-hidden
                />
                <div
                  className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-t from-slate-900/[0.06] via-transparent to-slate-800/[0.03] dark:from-slate-950/[0.16] dark:to-slate-900/[0.18]"
                  aria-hidden
                />
              </figure>
            </div>
          </div>
        </HeroImageParallax>
      </div>

      {/* ---- Text content ---- */}
      <div className="max-w-xl">
        <div className="animate-fade-in space-y-2">
          <p className="whitespace-nowrap text-[0.6875rem] font-medium uppercase tracking-[0.18em] text-muted-foreground/75 max-[480px]:whitespace-normal">
            {siteConfig.tagline}
          </p>
          <p className="text-[0.5625rem] font-medium uppercase tracking-[0.2em] text-muted-foreground/45">
            {siteConfig.location}
          </p>
        </div>

        <h1
          className={cn(
            "animate-fade-in-delayed mt-10 max-w-[16ch] border-l-[3px] border-accent/30 pl-4 font-serif text-[2.125rem] font-normal lowercase leading-[1.08] tracking-[-0.02em] text-foreground",
            "md:mt-12 md:pl-5",
            "md:max-w-[18ch] md:text-[2.65rem] md:leading-[1.06]",
            "lg:text-[2.85rem] xl:text-[3.05rem]"
          )}
        >
          to be cringe is to be free.
        </h1>

        <div className="animate-fade-in-delayed mt-10 max-w-[40ch] space-y-4 text-[0.9375rem] leading-[1.78] text-muted-foreground md:mt-12 md:text-[0.95rem] md:leading-[1.8]">
          {siteConfig.bioParagraphs.slice(0, -1).map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
          <p className="mt-6 italic text-muted-foreground/50">
            {siteConfig.bioParagraphs[siteConfig.bioParagraphs.length - 1]}
          </p>
        </div>

        <div className="animate-fade-in-delayed mt-8 md:mt-10">
          <SocialLinks />
        </div>
      </div>

      <div className="clear-both" />
    </section>
  );
}
