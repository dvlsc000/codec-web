"use client";

import { useEffect, useRef } from "react";

/**
 * The hero's signature visual — what a codec literally does.
 * On the left a smooth analog voice signal (steel); towards the right it is
 * sampled and quantised into orange pixels on a sample-and-hold staircase,
 * the same square pixels as the logo. Reacts gently to the pointer.
 */
export function SignalCanvas({ label, className = "" }: { label: string; className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let w = 0;
    let h = 0;
    let raf = 0;
    let visible = true;
    const start = performance.now();
    const pointer = { x: -1, target: -1, strength: 0 };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = rect.width;
      h = rect.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const smoothstep = (a: number, b: number, x: number) => {
      const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
      return t * t * (3 - 2 * t);
    };

    /** The voice signal, in -1..1. */
    const signal = (x: number, t: number, phase = 0) => {
      const syllable = 0.35 + 0.65 * Math.pow(Math.abs(Math.sin(x * 0.0062 - t * 1.5 + phase)), 1.5);
      return (
        (Math.sin(x * 0.042 + t * 3.6 + phase) * 0.55 + Math.sin(x * 0.097 - t * 5.4) * 0.25 + Math.sin(x * 0.021 + t * 1.4) * 0.35) *
        syllable
      );
    };

    const draw = (now: number) => {
      const t = reduce ? 2.4 : ((now - start) / 1000) * 0.5;
      const intro = reduce ? 1 : Math.min(1, Math.max(0, ((now - start) / 1000 - 0.3) / 1.8));
      const eased = 1 - Math.pow(1 - intro, 4);
      const reach = w * eased;

      pointer.x += (pointer.target - pointer.x) * 0.08;
      pointer.strength += ((pointer.target >= 0 ? 1 : 0) - pointer.strength) * 0.05;
      const boost = (x: number) => {
        if (pointer.x < 0) return 1;
        const d = (x - pointer.x) / 150;
        return 1 + 0.8 * pointer.strength * Math.exp(-d * d);
      };

      ctx.clearRect(0, 0, w, h);
      const mid = h / 2;
      const amp = Math.min(h * 0.36, 120);
      const edge = (u: number) => smoothstep(0, 0.06, u) * (1 - smoothstep(0.95, 1, u));

      // Analog layers (fade out to the right)
      const layers = [
        { a: 1, width: 1.8, alpha: 0.95, phase: 0 },
        { a: 0.7, width: 1, alpha: 0.35, phase: 1.9 },
        { a: 1.2, width: 0.8, alpha: 0.14, phase: 3.7 },
      ];
      for (const L of layers) {
        const grad = ctx.createLinearGradient(0, 0, w, 0);
        grad.addColorStop(0, "rgba(211,214,220,0)");
        grad.addColorStop(0.1, `rgba(211,214,220,${L.alpha})`);
        grad.addColorStop(0.42, `rgba(255,181,71,${L.alpha * 0.8})`);
        grad.addColorStop(0.62, "rgba(255,90,31,0)");
        ctx.strokeStyle = grad;
        ctx.lineWidth = L.width;
        ctx.beginPath();
        for (let x = 0; x <= Math.min(reach, w * 0.66); x += 2) {
          const u = x / w;
          const y = mid + signal(x, t, L.phase) * amp * L.a * edge(u) * boost(x);
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }

      // Digital: sample-and-hold staircase + quantised pixels
      const step = w < 640 ? 12 : 16;
      const q = w < 640 ? 9 : 11; // quantisation level height
      const startX = w * 0.34;
      ctx.beginPath();
      let prevY: number | null = null;
      const pixels: { x: number; y: number; a: number; s: number }[] = [];
      for (let x = Math.ceil(startX / step) * step; x <= Math.min(reach, w); x += step) {
        const u = x / w;
        const mixIn = smoothstep(0.34, 0.6, u);
        const raw = signal(x, t, 0) * amp * edge(u) * boost(x);
        const yq = mid + Math.round(raw / q) * q;
        if (prevY === null) ctx.moveTo(x, yq);
        else {
          ctx.lineTo(x, prevY);
          ctx.lineTo(x, yq);
        }
        ctx.lineTo(x + step, yq);
        prevY = yq;
        const size = (step * 0.42 + 1.5) * (0.6 + 0.4 * mixIn);
        pixels.push({ x, y: yq, a: mixIn, s: size });
      }
      const sgrad = ctx.createLinearGradient(startX, 0, w, 0);
      sgrad.addColorStop(0, "rgba(255,90,31,0)");
      sgrad.addColorStop(0.35, "rgba(255,90,31,0.35)");
      sgrad.addColorStop(0.92, "rgba(255,90,31,0.35)");
      sgrad.addColorStop(1, "rgba(255,90,31,0)");
      ctx.strokeStyle = sgrad;
      ctx.lineWidth = 1;
      ctx.stroke();

      for (const p of pixels) {
        const u = p.x / w;
        const fade = 1 - smoothstep(0.93, 1, u);
        ctx.globalAlpha = p.a * fade;
        // Larger pixels nearer the centre of the digital region, like the logo's trail
        ctx.fillStyle = u > 0.8 ? "#FF5A1F" : u > 0.6 ? "#FF7A3D" : "#FFB547";
        ctx.fillRect(p.x + step / 2 - p.s / 2, p.y - p.s / 2, p.s, p.s);
      }
      ctx.globalAlpha = 1;

      // Leading spark while drawing in
      if (intro < 1) {
        ctx.globalAlpha = 1 - intro;
        const g = ctx.createRadialGradient(reach, mid, 0, reach, mid, 70);
        g.addColorStop(0, "rgba(255,138,87,0.9)");
        g.addColorStop(1, "rgba(255,90,31,0)");
        ctx.fillStyle = g;
        ctx.fillRect(reach - 70, mid - 70, 140, 140);
        ctx.globalAlpha = 1;
      }

      if (!reduce && visible) raf = requestAnimationFrame(draw);
    };

    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      const inside = e.clientY >= rect.top - 80 && e.clientY <= rect.bottom + 80;
      pointer.target = inside ? e.clientX - rect.left : -1;
      if (pointer.x < 0 && inside) pointer.x = pointer.target;
    };

    const ro = new ResizeObserver(() => {
      resize();
      if (reduce) draw(performance.now());
    });
    ro.observe(canvas);
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      cancelAnimationFrame(raf);
      if (visible && !reduce) raf = requestAnimationFrame(draw);
    });
    io.observe(canvas);

    resize();
    raf = requestAnimationFrame(draw);
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  return <canvas ref={ref} role="img" aria-label={label} className={`block h-full w-full ${className}`} />;
}
