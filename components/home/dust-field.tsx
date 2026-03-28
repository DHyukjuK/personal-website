"use client";

import { useTheme } from "next-themes";
import { useEffect, useRef, useState } from "react";

type Depth = 0 | 1 | 2;

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  seed: number;
  depth: Depth;
  /** Spectral tint (dark mode only; light uses a single neutral) */
  tint: 0 | 1 | 2 | 3;
};

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

/** Smooth flow + inertia; soft glow; cursor repels on md+ fine pointer. */
export function DustField() {
  const { resolvedTheme } = useTheme();
  const resolvedThemeRef = useRef<typeof resolvedTheme>(undefined);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const mouseSmoothRef = useRef({ x: -9999, y: -9999 });
  const repelEnabledRef = useRef(false);
  const particlesRef = useRef<Particle[]>([]);
  const [active, setActive] = useState(false);

  useEffect(() => {
    resolvedThemeRef.current = resolvedTheme;
  }, [resolvedTheme]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setActive(true);
  }, []);

  useEffect(() => {
    if (!active) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const md = window.matchMedia("(min-width: 768px)");
    const fine = window.matchMedia("(pointer: fine)");

    const syncRepel = () => {
      repelEnabledRef.current = md.matches && fine.matches;
    };
    syncRepel();
    md.addEventListener("change", syncRepel);
    fine.addEventListener("change", syncRepel);

    const onMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("mousemove", onMove, { passive: true });

    let raf = 0;
    let last = performance.now();

    function pickDepth(light: boolean): Depth {
      if (light && Math.random() < 0.48) return 0;
      const r = Math.random();
      if (r < 0.38) return 0;
      if (r < 0.72) return 1;
      return 2;
    }

    function isDarkMode() {
      const r = resolvedThemeRef.current;
      if (r === "dark") return true;
      if (r === "light") return false;
      return document.documentElement.classList.contains("dark");
    }

    function pickTint(): Particle["tint"] {
      const r = Math.random();
      if (r < 0.28) return 0;
      if (r < 0.55) return 1;
      if (r < 0.82) return 2;
      return 3;
    }

    function initParticles(w: number, h: number) {
      const area = w * h;
      const light = !isDarkMode();
      const density = light ? 24500 : 16800;
      const count = clamp(
        Math.floor(area / density),
        light ? 36 : 46,
        light ? 78 : 118
      );
      const particles: Particle[] = [];
      for (let i = 0; i < count; i++) {
        const depth = pickDepth(light);
        const baseR = depth === 0 ? 0.4 : depth === 1 ? 0.65 : 0.95;
        const r = baseR + Math.random() * (depth === 0 ? 0.5 : 0.75);
        particles.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: 0,
          vy: 0,
          r,
          seed: Math.random() * Math.PI * 2,
          depth,
          tint: pickTint()
        });
      }
      particlesRef.current = particles;
    }

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      mouseRef.current = { x: w * 0.5, y: h * 0.5 };
      mouseSmoothRef.current = { x: w * 0.5, y: h * 0.5 };
      initParticles(w, h);
    };

    resize();
    window.addEventListener("resize", resize, { passive: true });

    /**
     * Spatially smooth drift (no per-frame noise): direction varies slowly across
     * the plane and over time so paths feel like slow currents, not jitter.
     */
    function flowField(
      x: number,
      y: number,
      t: number,
      seed: number,
      depth: Depth
    ) {
      const layer = 0.9 + depth * 0.35;
      const ax = x * 0.0011 * layer;
      const ay = y * 0.001 * layer;
      const fx =
        Math.sin(ay + t * 0.095 + seed) * Math.cos(ax - t * 0.072 + seed * 0.6);
      const fy =
        Math.cos(ax + t * 0.088 + seed * 0.4) *
        Math.sin(ay * 0.95 + t * 0.1 + seed * 0.8);
      return { fx, fy };
    }

    const REPEL_RADIUS = 128;
    const REPEL_STRENGTH = 1.65;
    /** How quickly velocity eases toward the flow (lower = silkier). */
    const FLOW_EASE = 1.15;
    /** Tiny organic wobble (very small vs old Brownian). */
    const WHISPER = 0.045;
    const MOUSE_LAG = 5.5;
    const depthSpeed: Record<Depth, number> = {
      0: 22,
      1: 28,
      2: 34
    };
    const MAX_SPEED: Record<Depth, number> = {
      0: 0.42,
      1: 0.52,
      2: 0.62
    };

    const tick = (now: number) => {
      const dt = clamp((now - last) / 1000, 0, 0.05);
      last = now;
      const t = now * 0.001;

      const w = window.innerWidth;
      const h = window.innerHeight;
      const raw = mouseRef.current;
      const sm = mouseSmoothRef.current;
      const lag = 1 - Math.exp(-MOUSE_LAG * dt);
      sm.x += (raw.x - sm.x) * lag;
      sm.y += (raw.y - sm.y) * lag;
      const mouse = sm;
      const repel = repelEnabledRef.current;
      const particles = particlesRef.current;
      const root = document.documentElement;
      const resolved = resolvedThemeRef.current;
      const isDark =
        resolved === "dark" ||
        (resolved === undefined && root.classList.contains("dark"));

      ctx.clearRect(0, 0, w, h);

      // Subtle nebula wash (not game UI; just depth + color)
      const g = ctx.createRadialGradient(
        w * 0.15,
        h * 0.2,
        0,
        w * 0.5,
        h * 0.45,
        Math.max(w, h) * 0.85
      );
      if (isDark) {
        g.addColorStop(0, "rgba(20, 55, 58, 0.14)");
        g.addColorStop(0.45, "rgba(12, 28, 42, 0.08)");
        g.addColorStop(1, "rgba(5, 10, 18, 0)");
      } else {
        g.addColorStop(0, "rgba(115, 118, 125, 0.045)");
        g.addColorStop(0.45, "rgba(155, 158, 165, 0.028)");
        g.addColorStop(1, "rgba(255, 255, 255, 0)");
      }
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);

      for (const p of particles) {
        const { fx, fy } = flowField(p.x, p.y, t, p.seed, p.depth);
        const base = depthSpeed[p.depth];
        const desiredVx = fx * base * 0.022;
        const desiredVy = fy * base * 0.022;

        p.vx += (Math.random() - 0.5) * WHISPER * dt * 55;
        p.vy += (Math.random() - 0.5) * WHISPER * dt * 55;

        p.vx += (desiredVx - p.vx) * Math.min(1, FLOW_EASE * dt * 60);
        p.vy += (desiredVy - p.vy) * Math.min(1, FLOW_EASE * dt * 60);

        if (repel) {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const dist = Math.hypot(dx, dy);
          if (dist < REPEL_RADIUS && dist > 0.5) {
            const u = (REPEL_RADIUS - dist) / REPEL_RADIUS;
            const smooth = u * u * u;
            const push = (smooth * REPEL_STRENGTH) / (1 + p.depth * 0.35);
            p.vx += (dx / dist) * push * dt * 48;
            p.vy += (dy / dist) * push * dt * 48;
          }
        }

        const max = MAX_SPEED[p.depth];
        const sp = Math.hypot(p.vx, p.vy);
        if (sp > max) {
          p.vx = (p.vx / sp) * max;
          p.vy = (p.vy / sp) * max;
        }

        p.x += p.vx * dt * 60;
        p.y += p.vy * dt * 60;

        if (p.x < -6) p.x = w + 6;
        if (p.x > w + 6) p.x = -6;
        if (p.y < -6) p.y = h + 6;
        if (p.y > h + 6) p.y = -6;
      }

      const sorted = [...particles].sort((a, b) => a.depth - b.depth);
      const lightScale = isDark ? 1 : 1.05;

      for (const p of sorted) {
        const rd = p.r * lightScale;
        const a = isDark ? 0.38 + p.depth * 0.12 : 1;
        const { outer, mid, core } = spectralTint(p.tint, isDark, a);

        ctx.beginPath();
        ctx.arc(p.x, p.y, rd * 4.2, 0, Math.PI * 2);
        ctx.fillStyle = outer;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(p.x, p.y, rd * 2.1, 0, Math.PI * 2);
        ctx.fillStyle = mid;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(p.x, p.y, rd, 0, Math.PI * 2);
        ctx.fillStyle = core;
        ctx.fill();
      }

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
      md.removeEventListener("change", syncRepel);
      fine.removeEventListener("change", syncRepel);
    };
  }, [active]);

  if (!active) {
    return null;
  }

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[1] mix-blend-normal opacity-[0.7] dark:opacity-100 dark:mix-blend-screen"
    />
  );
}

function spectralTint(
  tint: Particle["tint"],
  isDark: boolean,
  alpha: number
) {
  if (!isDark) {
    return {
      outer: "hsla(0, 0%, 48%, 0.11)",
      mid: "hsla(0, 0%, 38%, 0.18)",
      core: "hsla(0, 0%, 28%, 0.52)"
    };
  }

  const bump = 1.15;
  switch (tint) {
    case 0:
      return {
        outer: `hsla(210, 28%, 88%, ${0.06 * bump * alpha})`,
        mid: `hsla(205, 35%, 92%, ${0.12 * bump * alpha})`,
        core: `hsla(200, 25%, 96%, ${0.55 * alpha})`
      };
    case 1:
      return {
        outer: `hsla(178, 42%, 72%, ${0.08 * bump * alpha})`,
        mid: `hsla(175, 48%, 78%, ${0.16 * bump * alpha})`,
        core: `hsla(172, 42%, 88%, ${0.62 * alpha})`
      };
    case 2:
      return {
        outer: `hsla(195, 48%, 70%, ${0.07 * bump * alpha})`,
        mid: `hsla(192, 45%, 76%, ${0.14 * bump * alpha})`,
        core: `hsla(198, 38%, 90%, ${0.58 * alpha})`
      };
    default:
      return {
        outer: `hsla(48, 52%, 82%, ${0.06 * bump * alpha})`,
        mid: `hsla(45, 48%, 88%, ${0.11 * bump * alpha})`,
        core: `hsla(42, 35%, 94%, ${0.52 * alpha})`
      };
  }
}
