"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { siteConfig } from "@/config/site";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { Container } from "@/components/ui/container";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b bg-background/90 backdrop-blur-md transition-[border-color,box-shadow] duration-300 ease-out",
        scrolled
          ? "border-foreground/15 shadow-[0_1px_0_0_rgba(0,0,0,0.04)] dark:shadow-[0_1px_0_0_rgba(255,255,255,0.04)]"
          : "border-foreground/10 shadow-none"
      )}
    >
      <Container className="py-4 md:py-5">
        <div className="grid grid-cols-[1fr_auto] grid-rows-[auto_auto] items-center gap-x-4 gap-y-3 md:grid-cols-[minmax(0,auto)_1fr_minmax(0,auto)] md:grid-rows-1 md:gap-x-8">
          <Link
            href="/"
            className="col-start-1 row-start-1 font-sans text-sm font-semibold tracking-tight text-foreground"
          >
            {siteConfig.name}
          </Link>
          <ThemeToggle />
          <nav
            className="col-span-2 row-start-2 flex flex-wrap content-start gap-x-5 gap-y-2 text-[11px] md:col-span-1 md:row-start-1 md:col-start-2 md:justify-self-center md:pt-0"
            aria-label="Main"
          >
            {siteConfig.nav.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "whitespace-nowrap lowercase tracking-[0.06em] transition-colors duration-200 ease-out",
                    isActive
                      ? "text-sky-600 dark:text-sky-400"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {item.label.toLowerCase()}
                </Link>
              );
            })}
          </nav>
        </div>
      </Container>
    </header>
  );
}
