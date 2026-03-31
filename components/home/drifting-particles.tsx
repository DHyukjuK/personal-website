"use client";

import { useEffect, useRef } from "react";

const enum Layer {
  Far = 0,
  Mid = 1,
  Near = 2
}

interface Particle {
  x: number;
  y: number;
  r: number;
  opacity: number;
  baseOpacity: number;
  angle: number;
  /** Constant turn rate — positive = CW, negative = CCW */
  turnRate: number;
  /** Extra wobble on top of the constant turn */
  wobbleFreq: number;
  wobblePhase: number;
  speed: number;
  layer: Layer;
  /** How many active connections this frame (for glow boost) */
  connections: number;
}

const LAYER_CONFIG = {
  [Layer.Far]:  { count: 16, rMin: 0.8, rMax: 1.5, speed: 0.10, opLight: 0.55, opDark: 0.20 },
  [Layer.Mid]:  { count: 18, rMin: 1.4, rMax: 2.2, speed: 0.14, opLight: 0.65, opDark: 0.30 },
  [Layer.Near]: { count: 10, rMin: 2.0, rMax: 3.0, speed: 0.09, opLight: 0.70, opDark: 0.40 }
} as const;

const CONNECTION_DIST = 160;
const CURSOR_RADIUS = 130;
const CURSOR_PUSH = 0.35;

function createParticle(w: number, h: number, layer: Layer, dark: boolean): Particle {
  const cfg = LAYER_CONFIG[layer];
  const r = cfg.rMin + Math.random() * (cfg.rMax - cfg.rMin);
  const angle = Math.random() * Math.PI * 2;
  const baseOp = dark ? cfg.opDark : cfg.opLight;
  const opVariance = baseOp * 0.25;

  let turnRate = 0.004 + Math.random() * 0.008;
  if (Math.random() < 0.5) turnRate *= -1;

  return {
    x: Math.random() * w,
    y: Math.random() * h,
    r,
    opacity: baseOp - opVariance + Math.random() * opVariance * 2,
    baseOpacity: baseOp - opVariance + Math.random() * opVariance * 2,
    angle,
    turnRate,
    wobbleFreq: 0.01 + Math.random() * 0.02,
    wobblePhase: Math.random() * Math.PI * 2,
    speed: cfg.speed * (0.6 + Math.random() * 0.8),
    layer,
    connections: 0
  };
}

export function DriftingParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    let w = window.innerWidth;
    let h = window.innerHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const mobile = w < 768;
    const scale = mobile ? 0.5 : 1;

    const isDark = () =>
      document.documentElement.classList.contains("dark");

    const dark = isDark();
    const particles: Particle[] = [];
    for (const layer of [Layer.Far, Layer.Mid, Layer.Near]) {
      const n = Math.round(LAYER_CONFIG[layer].count * scale);
      for (let i = 0; i < n; i++) {
        particles.push(createParticle(w, h, layer, dark));
      }
    }

    const mouse = { x: -9999, y: -9999 };
    const onMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    const onLeave = () => {
      mouse.x = -9999;
      mouse.y = -9999;
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseleave", onLeave);

    let raf = 0;
    let frame = 0;

    const tick = () => {
      frame++;
      ctx.clearRect(0, 0, w, h);

      const dark = isDark();

      for (const p of particles) {
        p.connections = 0;

        if (!reducedMotion) {
          p.angle += p.turnRate + Math.sin(frame * p.wobbleFreq + p.wobblePhase) * 0.005;

          const tx = Math.cos(p.angle) * p.speed;
          const ty = Math.sin(p.angle) * p.speed;

          p.x += tx;
          p.y += ty;

          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < CURSOR_RADIUS && dist > 0) {
            const t = (CURSOR_RADIUS - dist) / CURSOR_RADIUS;
            const force = t * t * CURSOR_PUSH;
            p.x += (dx / dist) * force;
            p.y += (dy / dist) * force;
          }

          if (p.x < -40) p.x = w + 40;
          if (p.x > w + 40) p.x = -40;
          if (p.y < -40) p.y = h + 40;
          if (p.y > h + 40) p.y = -40;
        }
      }

      // -- Constellation connections --
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i];
          const b = particles[j];

          if (Math.abs(a.layer - b.layer) > 1) continue;

          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const distSq = dx * dx + dy * dy;

          if (distSq < CONNECTION_DIST * CONNECTION_DIST) {
            const dist = Math.sqrt(distSq);
            const fade = 1 - dist / CONNECTION_DIST;
            const strength = fade * fade;

            a.connections++;
            b.connections++;

            if (dark) {
              const coreOp = strength * 0.12;
              const glowOp = strength * 0.04;

              ctx.beginPath();
              ctx.moveTo(a.x, a.y);
              ctx.lineTo(b.x, b.y);
              ctx.strokeStyle = `rgba(150, 180, 220, ${glowOp})`;
              ctx.lineWidth = 2.5;
              ctx.stroke();

              ctx.beginPath();
              ctx.moveTo(a.x, a.y);
              ctx.lineTo(b.x, b.y);
              ctx.strokeStyle = `rgba(170, 195, 235, ${coreOp})`;
              ctx.lineWidth = 0.5;
              ctx.stroke();
            } else {
              const coreOp = strength * 0.2;
              const glowOp = strength * 0.06;

              ctx.beginPath();
              ctx.moveTo(a.x, a.y);
              ctx.lineTo(b.x, b.y);
              ctx.strokeStyle = `rgba(10, 20, 50, ${glowOp})`;
              ctx.lineWidth = 2.5;
              ctx.stroke();

              ctx.beginPath();
              ctx.moveTo(a.x, a.y);
              ctx.lineTo(b.x, b.y);
              ctx.strokeStyle = `rgba(15, 25, 45, ${coreOp})`;
              ctx.lineWidth = 0.7;
              ctx.stroke();
            }
          }
        }
      }

      // -- Draw particles --
      for (const p of particles) {
        const connBoost = Math.min(p.connections * 0.04, 0.15);
        const op = Math.min(p.baseOpacity + connBoost, 1);

        if (dark) {
          const rgb = `${160 + p.layer * 15}, ${185 + p.layer * 12}, ${220 + p.layer * 8}`;

          if (p.layer === Layer.Near) {
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r * 4, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${rgb}, ${op * 0.1})`;
            ctx.fill();
          }

          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${rgb}, ${op})`;
          ctx.fill();
        } else {
          const rgb = `${5 + p.layer * 5}, ${8 + p.layer * 5}, ${18 + p.layer * 4}`;

          if (p.layer === Layer.Near) {
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r * 3.5, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${rgb}, ${op * 0.06})`;
            ctx.fill();
          }

          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${rgb}, ${op})`;
          ctx.fill();
        }
      }

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    window.addEventListener("resize", resize, { passive: true });

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0"
      aria-hidden="true"
    />
  );
}
