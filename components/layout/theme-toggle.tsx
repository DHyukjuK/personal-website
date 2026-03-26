"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = resolvedTheme === "dark";
  const label = mounted ? (isDark ? "light" : "dark") : "theme";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="col-start-2 row-start-1 inline-flex min-w-[2.75rem] justify-end font-sans text-[11px] lowercase tracking-[0.12em] text-muted-foreground transition-colors duration-200 hover:text-foreground md:col-start-3"
      aria-label={mounted ? (isDark ? "Switch to light theme" : "Switch to dark theme") : "Theme"}
    >
      {label}
    </button>
  );
}
