"use client";

import { m, useScroll, useTransform } from "motion/react";
import {
  Activity,
  ArrowRight,
  Check,
  ChevronDown,
  PlayCircle,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { useRef } from "react";
import { HeroScene } from "./hero-scene";

/* Posiciones deterministas (evita mismatch de hidratación).
   Densidad recortada: menos capas animadas simultáneas = scroll fluido. */
const PARTICLES = [
  { left: "6%", size: 3, delay: 0, duration: 15 },
  { left: "24%", size: 2, delay: 9, duration: 14 },
  { left: "45%", size: 2, delay: 12, duration: 16 },
  { left: "64%", size: 3, delay: 1, duration: 15 },
  { left: "82%", size: 2, delay: 5, duration: 14 },
  { left: "91%", size: 3, delay: 8, duration: 17 },
];

const ENERGY_BEAMS = [
  { top: "22%", rotate: "-8deg", delay: "0s", duration: "7.6s" },
  { top: "62%", rotate: "6deg", delay: "3.1s", duration: "8.4s" },
];

const SPARKS = [
  { left: "12%", top: "24%", delay: "0s" },
  { left: "48%", top: "18%", delay: "1.1s" },
  { left: "86%", top: "64%", delay: "1.8s" },
];

/* Estrellas fijas que titilan (posiciones deterministas) */
const STARS = [
  { left: "8%", top: "14%", size: 2, delay: "0s", duration: "4.2s" },
  { left: "34%", top: "10%", size: 2, delay: "2.8s", duration: "3.8s" },
  { left: "44%", top: "44%", size: 1.5, delay: "0.9s", duration: "5.6s" },
  { left: "58%", top: "8%", size: 2, delay: "3.6s", duration: "4.6s" },
  { left: "78%", top: "20%", size: 2, delay: "0.5s", duration: "5.4s" },
  { left: "90%", top: "42%", size: 1.5, delay: "2.2s", duration: "4.4s" },
  { left: "15%", top: "78%", size: 1.5, delay: "3.1s", duration: "5s" },
];

/* Cometas: destellos diagonales ocasionales, desfasados entre sí */
const COMETS = [
  { top: "16%", left: "-4%", rotate: "16deg", delay: "2s", duration: "15s" },
  { top: "62%", left: "-6%", rotate: "-10deg", delay: "9s", duration: "19s" },
];

const HERO_SIGNALS = [
  { icon: Activity, label: "Streaming SSE", value: "token a token" },
  { icon: ShieldCheck, label: "Tenant guard", value: "origen validado" },
  { icon: Zap, label: "Score NEX", value: "lead priorizado" },
];

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const sceneY = useTransform(scrollYProgress, [0, 1], ["0%", "28%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section
      ref={ref}
      className="relative isolate flex min-h-svh flex-col overflow-hidden bg-nexus-deep"
    >
      {/* Fondo animado: auroras que derivan lentamente */}
      <div aria-hidden className="absolute inset-0 -z-10 overflow-hidden">
        {/* Malla cromática viva: varias capas radiales animadas */}
        <div
          className="absolute inset-[-20%] opacity-80 motion-safe:animate-hero-mesh"
          style={{
            backgroundImage:
              "radial-gradient(circle at 18% 22%, rgba(173,116,195,0.34), transparent 28%), radial-gradient(circle at 78% 18%, rgba(52,211,153,0.16), transparent 25%), radial-gradient(circle at 50% 80%, rgba(251,113,133,0.12), transparent 30%)",
            backgroundSize: "140% 140%, 130% 130%, 150% 150%",
          }}
        />
        {/* Dos orbes (no tres) con blur moderado: menos memoria de GPU */}
        <div className="absolute -top-32 left-1/4 size-[36rem] -translate-x-1/2 rounded-full bg-[#522566] blur-[120px] opacity-30 motion-safe:animate-drift-1" />
        <div className="absolute -bottom-40 right-1/4 size-[32rem] rounded-full bg-[#AD74C3] blur-[120px] opacity-25 motion-safe:animate-drift-2" />

        {/* Grid sutil con máscara radial, al estilo plano técnico */}
        <div
          className="absolute inset-0 opacity-[0.13]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(173,116,195,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(173,116,195,0.5) 1px, transparent 1px)",
            backgroundSize: "72px 72px",
            maskImage:
              "radial-gradient(ellipse 80% 60% at 50% 35%, black, transparent)",
            }}
        />

        {/* Haces de energía que cruzan el fondo */}
        {ENERGY_BEAMS.map((beam, i) => (
          <span
            key={i}
            className="absolute left-[-12%] h-px w-[124%]"
            style={{
              top: beam.top,
              transform: `rotate(${beam.rotate})`,
            }}
          >
            <span
              className="block h-px w-1/3 bg-gradient-to-r from-transparent via-nexus-lavender/55 to-transparent blur-[0.5px] motion-safe:animate-energy-beam"
              style={{
                animationDelay: beam.delay,
                animationDuration: beam.duration,
              }}
            />
          </span>
        ))}

        {/* Estrellas que titilan: capa mínima pero perceptible sobre el púrpura */}
        {STARS.map((star, i) => (
          <span
            key={`star-${i}`}
            className="absolute rounded-full bg-white motion-safe:animate-twinkle"
            style={{
              left: star.left,
              top: star.top,
              width: star.size,
              height: star.size,
              animationDelay: star.delay,
              animationDuration: star.duration,
              boxShadow: "0 0 8px rgba(248,237,251,0.55)",
            }}
          />
        ))}

        {/* Cometas: streaks diagonales que cruzan ocasionalmente */}
        {COMETS.map((comet, i) => (
          <span
            key={`comet-${i}`}
            className="absolute h-px w-[120%]"
            style={{
              top: comet.top,
              left: comet.left,
              transform: `rotate(${comet.rotate})`,
            }}
          >
            <span
              className="block h-px w-36 rounded-full bg-gradient-to-r from-transparent via-[#AD74C3]/50 to-white opacity-0 shadow-[0_0_14px_rgba(173,116,195,0.7)] motion-safe:animate-comet"
              style={{
                animationDelay: comet.delay,
                animationDuration: comet.duration,
              }}
            />
          </span>
        ))}

        {/* Nodos luminosos sobre la malla */}
        {SPARKS.map((spark, i) => (
          <span
            key={i}
            className="absolute size-1.5 rounded-full bg-white/70 motion-safe:animate-spark-drift"
            style={{
              left: spark.left,
              top: spark.top,
              animationDelay: spark.delay,
              boxShadow:
                "0 0 18px rgba(173,116,195,0.75), 0 0 34px rgba(52,211,153,0.22)",
            }}
          />
        ))}

        {/* Partículas que ascienden desde la base */}
        {PARTICLES.map((p, i) => (
          <span
            key={i}
            className="absolute bottom-[-8px] rounded-full bg-nexus-lavender/55 opacity-0 motion-safe:animate-rise"
            style={{
              left: p.left,
              width: p.size,
              height: p.size,
              animationDelay: `${p.delay}s`,
              animationDuration: `${p.duration}s`,
            }}
          />
        ))}

        {/* Velo inferior para fundir con la siguiente sección */}
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-nexus-deep to-transparent" />
      </div>

      <div className="mx-auto grid w-full max-w-7xl flex-1 items-center gap-16 px-5 pb-24 pt-32 sm:px-8 lg:grid-cols-[1.1fr_1fr] lg:gap-10 lg:pt-24">
        <m.div
          style={{ y: textY, opacity: fade }}
          className="flex flex-col items-center text-center lg:items-start lg:text-left"
        >
          {/* Entradas en CSS puro: visibles desde el primer pintado,
              sin esperar la hidratación de JS */}
          <span
            style={{ animationDelay: "0.05s" }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/8 px-4 py-1.5 text-xs font-medium tracking-wide text-nexus-lavender motion-safe:animate-enter-up"
          >
            <span className="relative flex size-1.5">
              <span
                aria-hidden
                className="absolute inline-flex size-full rounded-full bg-nexus-mint/60 motion-safe:animate-ping"
              />
              <span className="relative inline-flex size-1.5 rounded-full bg-nexus-mint" />
            </span>
            IA conversacional para tu negocio
          </span>

          <h1
            style={{ animationDelay: "0.12s" }}
            className="text-balance text-5xl font-bold leading-[1.04] tracking-tight bg-gradient-to-br from-[#FFFFFF] to-[#AD74C3] bg-clip-text text-transparent sm:text-6xl lg:text-[4.2rem] motion-safe:animate-enter-up"
          >
            Convierte visitantes en clientes reales, mientras duermes.
          </h1>

          <p
            style={{ animationDelay: "0.2s" }}
            className="mt-6 max-w-xl text-balance text-lg leading-relaxed text-white/65 sm:text-xl motion-safe:animate-enter-up"
          >
            Mindware Nexus es el chatbot con IA que atiende, captura y califica
            a tus leads 24/7 — entrenado en tu negocio e instalado en tu web
            con una sola línea de código.
          </p>

          <div
            style={{ animationDelay: "0.28s" }}
            className="mt-10 flex flex-col items-center gap-4 sm:flex-row motion-safe:animate-enter-up"
          >
            <a
              href="#contacto"
              className="group inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-medium text-nexus-deep shadow-xl shadow-black/20 transition-[transform,background-color] duration-200 ease-out hover:scale-[1.04] hover:bg-nexus-lilac active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-nexus-lavender"
            >
              Solicitar acceso anticipado
              <ArrowRight
                aria-hidden
                className="size-4 transition-transform duration-200 ease-out group-hover:translate-x-1"
              />
            </a>
            <a
              href="#demo"
              className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/8 px-7 py-3.5 text-sm font-medium text-white transition-[transform,background-color,border-color] duration-200 ease-out hover:border-nexus-lavender/60 hover:bg-white/12 active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-nexus-lavender"
            >
              <PlayCircle aria-hidden className="size-4 text-nexus-lavender" />
              Probar la demo en vivo
            </a>
          </div>

          <div
            style={{ animationDelay: "0.32s" }}
            className="mt-5 flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 lg:justify-start motion-safe:animate-enter-up"
          >
            {["Sin tarjeta de crédito", "En tu web en 5 minutos"].map(
              (item) => (
                <span
                  key={item}
                  className="inline-flex items-center gap-1.5 text-xs text-white/45"
                >
                  <Check
                    aria-hidden
                    strokeWidth={3}
                    className="size-3 text-nexus-mint"
                  />
                  {item}
                </span>
              ),
            )}
          </div>

          <div
            style={{ animationDelay: "0.38s" }}
            className="mt-7 grid w-full max-w-xl gap-2.5 sm:grid-cols-3 motion-safe:animate-enter-up"
          >
            {HERO_SIGNALS.map((signal) => (
              <div
                key={signal.label}
                className="group h-full rounded-2xl bg-gradient-to-b from-white/18 via-white/8 to-white/5 p-px"
              >
                <div className="relative h-full overflow-hidden rounded-[calc(1rem-1px)] bg-nexus-deep/75 p-3.5 text-left">
                  <span
                    aria-hidden
                    className="absolute inset-y-0 -left-16 w-16 bg-white/15 blur-xl motion-safe:animate-shimmer"
                  />
                  <div className="flex items-center gap-2">
                    <span className="grid size-8 shrink-0 place-items-center rounded-xl bg-white/8 text-nexus-lavender ring-1 ring-white/10 transition-transform duration-300 group-hover:scale-110">
                      <signal.icon className="size-4" />
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-xs font-semibold text-white">
                        {signal.label}
                      </p>
                      <p className="truncate text-[11px] text-white/45">
                        {signal.value}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </m.div>

        {/* El producto en acción: conversación → lead calificado, en loop.
            El parallax de scroll vive en motion; la entrada es CSS puro. */}
        <m.div
          style={{ y: sceneY, opacity: fade }}
          className="pb-12 lg:pb-0"
        >
          <div
            style={{ animationDelay: "0.2s" }}
            className="motion-safe:animate-enter-up"
          >
            <HeroScene />
          </div>
        </m.div>
      </div>

      <a
        href="#como-funciona"
        aria-label="Bajar a Cómo funciona"
        style={{ animationDelay: "0.9s" }}
        className="absolute bottom-6 left-1/2 grid size-10 -translate-x-1/2 place-items-center rounded-full border border-white/15 bg-white/8 text-white/50 transition-[color,border-color] duration-200 hover:border-nexus-lavender/50 hover:text-white motion-safe:animate-enter-fade"
      >
        <ChevronDown className="size-5 motion-safe:animate-bounce" />
      </a>
    </section>
  );
}
