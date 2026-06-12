"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

type Spark = {
  /* Posición polar respecto al centro del halo */
  baseAngle: number;
  baseRadius: number;
  /* Velocidad angular de la deriva orbital (rad/ms) */
  orbit: number;
  /* Respiración radial: la partícula se acerca/aleja del anillo */
  wobbleAmp: number;
  wobbleSpeed: number;
  /* Titileo individual */
  twinkleSpeed: number;
  phase: number;
  size: number;
  alpha: number;
  color: readonly [number, number, number];
  /* Desplazamiento por repulsión del cursor, con física de resorte */
  offX: number;
  offY: number;
  vx: number;
  vy: number;
};

/* Paleta del proyecto: mayoría lavanda, acentos lila claro y menta */
const COLORS = [
  [173, 116, 195], // nexus-lavender
  [248, 237, 251], // nexus-lilac (casi blanco)
  [52, 211, 153], // nexus-mint
] as const;

/* PRNG determinista: el campo se ve igual en cada rebuild/resize */
function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Halo de partículas dispersas (estilo confeti de luz): cientos de
 * motas de tamaño variable concentradas en una banda elíptica alrededor
 * del punto focal, que derivan en órbita lenta y titilan de forma
 * individual. A diferencia de DotField (retícula uniforme), aquí la
 * distribución es orgánica: densa junto al anillo y dispersándose hacia
 * afuera, como un remolino de polvo brillante. El cursor repele las
 * motas con física de resorte y las enciende a su paso. El loop solo
 * corre con la sección visible y la pestaña activa; con
 * prefers-reduced-motion se pinta un fotograma estático.
 */
export function SparkleHalo({
  className,
  haloX = 0.5,
  haloY = 0.55,
  haloRadius = 0.4,
  count = 760,
  influence = 170,
}: {
  className?: string;
  /* Centro del halo, como fracción del ancho/alto del canvas */
  haloX?: number;
  haloY?: number;
  /* Radio vertical del anillo como fracción de la altura */
  haloRadius?: number;
  count?: number;
  /* Radio de acción del cursor en px */
  influence?: number;
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

    let sparks: Spark[] = [];
    let raf = 0;
    let visible = false;
    let width = 0;
    let height = 0;
    let cx = 0;
    let cy = 0;
    let rx = 0;
    let ry = 0;
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

      cx = width * haloX;
      cy = height * haloY;
      ry = height * haloRadius;
      rx = Math.min(width * 0.44, ry * 1.5);

      const rand = mulberry32(0x9e3779b9);
      sparks = [];
      for (let i = 0; i < count; i++) {
        const angle = rand() * Math.PI * 2;
        /* Dispersión gaussiana aproximada alrededor del anillo (suma de
           uniformes): banda densa que se difumina hacia dentro y fuera */
        const spread = (rand() + rand() + rand()) / 3 - 0.5;
        const radius = 1 + spread * 0.8;
        /* Motas grandes y brillantes entre el polvo fino, ahora más */
        const big = rand() < 0.16;
        const colorRoll = rand();
        sparks.push({
          baseAngle: angle,
          baseRadius: radius,
          orbit: (rand() * 0.5 + 0.5) * 0.000018 * (rand() < 0.5 ? 1 : -1),
          wobbleAmp: 0.015 + rand() * 0.035,
          wobbleSpeed: 0.0003 + rand() * 0.0005,
          twinkleSpeed: 0.0008 + rand() * 0.0016,
          phase: rand() * Math.PI * 2,
          size: big ? 2 + rand() * 1.6 : 0.7 + rand() * 1.3,
          alpha: big ? 0.75 + rand() * 0.25 : 0.32 + rand() * 0.48,
          color:
            colorRoll < 0.58
              ? COLORS[0]
              : colorRoll < 0.88
                ? COLORS[1]
                : COLORS[2],
          offX: 0,
          offY: 0,
          vx: 0,
          vy: 0,
        });
      }
    }

    function draw(t: number) {
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);
      for (const s of sparks) {
        const angle = s.baseAngle + t * s.orbit;
        const radius =
          s.baseRadius + Math.sin(t * s.wobbleSpeed + s.phase) * s.wobbleAmp;
        const ox = cx + Math.cos(angle) * rx * radius;
        const oy = cy + Math.sin(angle) * ry * radius;

        /* Repulsión del cursor con caída cuadrática + resorte de regreso
           a la órbita y fricción (misma física que DotField) */
        const dx = ox + s.offX - mouse.x;
        const dy = oy + s.offY - mouse.y;
        const dist = Math.hypot(dx, dy);
        let glow = 0;
        if (dist < influence && dist > 0.001) {
          glow = 1 - dist / influence;
          const force = glow * glow * 3;
          s.vx += (dx / dist) * force;
          s.vy += (dy / dist) * force;
        }
        s.vx += -s.offX * 0.02;
        s.vy += -s.offY * 0.02;
        s.vx *= 0.88;
        s.vy *= 0.88;
        s.offX += s.vx;
        s.offY += s.vy;
        const x = ox + s.offX;
        const y = oy + s.offY;

        /* Titileo: la mayoría respira suave; el cuadrado acentúa
           los destellos sin apagar del todo el polvo fino. El cursor
           enciende las motas a su paso. */
        const tw = 0.5 + 0.5 * Math.sin(t * s.twinkleSpeed + s.phase);
        const alpha = Math.min(
          1,
          s.alpha * (0.25 + 0.75 * tw * tw) + glow * 0.6,
        );
        const size = s.size * (0.85 + 0.3 * tw + glow * 0.7);

        const [r, g, b] = s.color;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r},${g},${b},${alpha})`;
        ctx.fill();

        /* Aura suave en motas grandes o encendidas, sin shadowBlur (caro) */
        if (s.size > 1.9 || glow > 0.25) {
          ctx.beginPath();
          ctx.arc(x, y, size * 2.6, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${r},${g},${b},${alpha * 0.16})`;
          ctx.fill();
        }
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
  }, [haloX, haloY, haloRadius, count, influence]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className={cn("pointer-events-none", className)}
    />
  );
}
