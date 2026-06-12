"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

type Dot = {
  ox: number;
  oy: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  phase: number;
  /* Pertenencia al anillo-halo (0..1) y ángulo respecto al centro */
  haloBase: number;
  angle: number;
};

/**
 * Campo de puntos interactivo (estilo Stripe / Google Antigravity):
 * retícula de puntos en canvas que flota con deriva suave y se repele
 * del cursor con física de resorte, iluminándose de lavanda a menta
 * cerca del mouse. Por defecto un anillo-halo de puntos brillantes
 * rodea el punto focal (la card), con una onda de brillo que recorre
 * el círculo. El loop solo corre cuando la sección es visible y la
 * pestaña está activa; con prefers-reduced-motion se pinta estática.
 */
export function DotField({
  className,
  spacing = 30,
  influence = 170,
  halo = true,
  haloX = 0.5,
  haloY = 0.58,
  haloRadius = 0.38,
}: {
  className?: string;
  spacing?: number;
  influence?: number;
  /* Anillo de puntos brillantes alrededor del punto focal */
  halo?: boolean;
  /* Centro del halo, como fracción del ancho/alto del canvas */
  haloX?: number;
  haloY?: number;
  /* Radio del halo como fracción de la altura (capado al ancho) */
  haloRadius?: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    let dots: Dot[] = [];
    let raf = 0;
    let visible = false;
    let width = 0;
    let height = 0;
    const mouse = { x: -9999, y: -9999 };

    function build() {
      if (!canvas || !ctx) return;
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      dots = [];
      const cx = width * haloX;
      const cy = height * haloY;
      const ringR = Math.min(height * haloRadius, width * 0.46);
      const band = Math.max(spacing * 2.2, 64);
      for (let y = spacing / 2; y < height; y += spacing) {
        for (let x = spacing / 2; x < width; x += spacing) {
          const ddx = x - cx;
          const ddy = y - cy;
          const distC = Math.hypot(ddx, ddy);
          const haloBase = halo
            ? Math.max(0, 1 - Math.abs(distC - ringR) / band)
            : 0;
          dots.push({
            ox: x,
            oy: y,
            x,
            y,
            vx: 0,
            vy: 0,
            /* Fase determinista por posición: deriva orgánica sin Math.random */
            phase: (x * 0.37 + y * 0.73) % (Math.PI * 2),
            haloBase,
            angle: Math.atan2(ddy, ddx),
          });
        }
      }
    }

    function draw(t: number) {
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);
      for (const d of dots) {
        /* Deriva "antigravedad": flotación senoidal sutil en reposo */
        const driftX = Math.sin(t * 0.0006 + d.phase) * 1.3;
        const driftY = Math.cos(t * 0.0005 + d.phase * 1.7) * 1.3;

        /* Repulsión del cursor con caída cuadrática */
        const dx = d.x - mouse.x;
        const dy = d.y - mouse.y;
        const dist = Math.hypot(dx, dy);
        let glow = 0;
        if (dist < influence && dist > 0.001) {
          glow = 1 - dist / influence;
          const force = glow * glow * 3;
          d.vx += (dx / dist) * force;
          d.vy += (dy / dist) * force;
        }

        /* Resorte de regreso al origen + fricción */
        d.vx += (d.ox - d.x) * 0.02;
        d.vy += (d.oy - d.y) * 0.02;
        d.vx *= 0.88;
        d.vy *= 0.88;
        d.x += d.vx;
        d.y += d.vy;

        /* Halo: onda de brillo que recorre el anillo alrededor de la card */
        const wave = 0.55 + 0.45 * Math.sin(t * 0.0012 - d.angle * 3);
        const haloGlow = d.haloBase * wave;
        const intensity = Math.max(glow, haloGlow);

        /* Lavanda (#AD74C3) → menta (#34D399): el cursor tiñe directo;
           en el anillo el degradado rota lentamente alrededor del círculo */
        const mintMix = Math.min(
          1,
          glow + haloGlow * (0.5 + 0.5 * Math.sin(d.angle + t * 0.0004)),
        );
        const r = 173 + (52 - 173) * mintMix;
        const g = 116 + (211 - 116) * mintMix;
        const b = 195 + (153 - 195) * mintMix;
        ctx.beginPath();
        ctx.arc(
          d.x + driftX,
          d.y + driftY,
          1.25 + intensity * 1.7,
          0,
          Math.PI * 2,
        );
        ctx.fillStyle = `rgba(${r | 0},${g | 0},${b | 0},${Math.min(0.9, 0.28 + intensity * 0.55)})`;
        ctx.fill();
      }
    }

    function loop(t: number) {
      draw(t);
      raf = requestAnimationFrame(loop);
    }

    function start() {
      if (!raf && visible && !document.hidden) {
        raf = requestAnimationFrame(loop);
      }
    }

    function stop() {
      cancelAnimationFrame(raf);
      raf = 0;
    }

    build();

    if (reduceMotion) {
      draw(0);
      const ro = new ResizeObserver(() => {
        build();
        draw(0);
      });
      ro.observe(canvas);
      return () => ro.disconnect();
    }

    function onPointerMove(e: PointerEvent) {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    }
    function onPointerLeave() {
      mouse.x = -9999;
      mouse.y = -9999;
    }
    function onVisibility() {
      if (document.hidden) stop();
      else start();
    }

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onPointerLeave);
    document.addEventListener("visibilitychange", onVisibility);

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) start();
      else stop();
    });
    io.observe(canvas);

    const ro = new ResizeObserver(build);
    ro.observe(canvas);

    return () => {
      stop();
      io.disconnect();
      ro.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
      document.documentElement.removeEventListener(
        "pointerleave",
        onPointerLeave,
      );
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [spacing, influence, halo, haloX, haloY, haloRadius]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className={cn("pointer-events-none", className)}
    />
  );
}
