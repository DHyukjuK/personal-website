"use client";

import {
  type PropsWithChildren,
  useEffect,
  useRef
} from "react";

/**
 * Subtle vertical parallax tied to scroll (disabled when reduced motion is on).
 */
export function HeroImageParallax({ children }: PropsWithChildren) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const el = ref.current;
    if (!el) return;

    const onScroll = () => {
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const center = rect.top + rect.height / 2;
      const progress = (center - vh * 0.5) / (vh * 0.85);
      const y = Math.max(-1, Math.min(1, progress)) * -14;
      el.style.setProperty("--hero-parallax-y", `${y}px`);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      ref={ref}
      className="hero-image-parallax shrink-0 will-change-transform [transform:translate3d(0,var(--hero-parallax-y,0px),0)]"
    >
      {children}
    </div>
  );
}
