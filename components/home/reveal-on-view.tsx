"use client";

import {
  type PropsWithChildren,
  useEffect,
  useRef,
  useState
} from "react";
import { cn } from "@/lib/utils";

type RevealOnViewProps = PropsWithChildren<{
  className?: string;
  /** Stagger with sibling reveals (ms). */
  delayMs?: number;
}>;

export function RevealOnView({
  children,
  className,
  delayMs = 0
}: RevealOnViewProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.06, rootMargin: "0px 0px -4% 0px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={cn(
        "transition-[opacity,transform] duration-[1000ms] ease-soft-out",
        visible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0",
        className
      )}
      style={{ transitionDelay: `${delayMs}ms` }}
    >
      {children}
    </div>
  );
}
