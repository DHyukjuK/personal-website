"use client";

import { useEffect, useRef, useState } from "react";

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  opacity: number;
};

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

/** Ambient specks with drift; cursor repels on md+ with fine pointer. Decorative only. */
export function DustField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const repelEnabledRef = useRef(false);
  const particlesRef = useRef<Particle[]>([]);
  const [active, setActive] = useState(false);

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

    function initParticles(w: number, h: number) {
      const area = w * h;
      const count = clamp(Math.floor(area / 18000), 55, 130);
      const particles: Particle[] = [];
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.35,
          vy: (Math.random() - 0.5) * 0.35,
          r: 0.55 + Math.random() * 1.35,
          opacity: 0.1 + Math.random() * 0.18
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
      initParticles(w, h);
    };

    resize();
    window.addEventListener("resize", resize, { passive: true });

    const REPEL_RADIUS = 132;
    const REPEL = 2.85;
    const BROWN = 0.85;
    const DAMP = 0.988;
    const MAX_SPEED = 1.05;
    const SPEED_SCALE = 28;

    const tick = (now: number) => {
      const dt = clamp((now - last) / 1000, 0, 0.048);
      last = now;

      const w = window.innerWidth;
      const h = window.innerHeight;
      const mouse = mouseRef.current;
      const repel = repelEnabledRef.current;
      const particles = particlesRef.current;

      const root = document.documentElement;
      const fg = getComputedStyle(root).getPropertyValue("--foreground").trim();

      ctx.clearRect(0, 0, w, h);

      for (const p of particles) {
        p.vx += (Math.random() - 0.5) * BROWN * dt * 60;
        p.vy += (Math.random() - 0.5) * BROWN * dt * 60;
        p.vx *= DAMP;
        p.vy *= DAMP;

        if (repel) {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const dist = Math.hypot(dx, dy);
          if (dist < REPEL_RADIUS && dist > 0.01) {
            const t = (REPEL_RADIUS - dist) / REPEL_RADIUS;
            const f = t * t * REPEL;
            p.vx += (dx / dist) * f * dt * 55;
            p.vy += (dy / dist) * f * dt * 55;
          }
        }

        const sp = Math.hypot(p.vx, p.vy);
        if (sp > MAX_SPEED) {
          p.vx = (p.vx / sp) * MAX_SPEED;
          p.vy = (p.vy / sp) * MAX_SPEED;
        }

        p.x += p.vx * dt * SPEED_SCALE;
        p.y += p.vy * dt * SPEED_SCALE;

        if (p.x < -4) p.x = w + 4;
        if (p.x > w + 4) p.x = -4;
        if (p.y < -4) p.y = h + 4;
        if (p.y > h + 4) p.y = -4;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `hsl(${fg} / ${p.opacity})`;
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
      className="pointer-events-none fixed inset-0 z-[1] mix-blend-multiply dark:mix-blend-screen"
    />
  );
}
