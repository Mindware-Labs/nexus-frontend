"use client";

import { m } from "motion/react";
import {
  Activity,
  ArrowUpRight,
  BellRing,
  DatabaseZap,
  Gauge,
  RadioTower,
  ShieldCheck,
  Sparkles,
  Workflow,
  Zap,
} from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { SectionHeading } from "./section-heading";
import { Reveal, RevealItem, RevealStagger } from "./reveal";

const workflow = [
  {
    icon: RadioTower,
    label: "Mensaje recibido",
    detail: "Validado por origen, tenant y límites del plan",
    value: "SSE activo",
  },
  {
    icon: DatabaseZap,
    label: "Contexto recuperado",
    detail: "Búsqueda semántica sobre tu base de conocimiento",
    value: "RAG listo",
  },
  {
    icon: Workflow,
    label: "Lead estructurado",
    detail: "Nombre, contacto y los campos de tu industria",
    value: "Campos OK",
  },
  {
    icon: Gauge,
    label: "Score NEX",
    detail: "Resumen ejecutivo y prioridad listos para ventas",
    value: "87/100",
  },
];

const metrics = [
  { label: "Respuesta media", value: "2.4s", accent: "text-nexus-mint" },
  { label: "Leads listos", value: "+31%", accent: "text-nexus-lavender" },
  { label: "Calidad NEX", value: "87", accent: "text-white" },
];

const integrations = ["CRM", "Email", "Webhook", "Owner panel"];

const bars = [48, 74, 62, 90, 68, 84, 56, 96, 72, 88, 64, 78];

/* Fondo animado determinista (sin Math.random: render estable en SSR) */
const SHOWCASE_BEAMS = [
  { top: "18%", rotate: "-6deg", delay: "0s", duration: "8.8s" },
  { top: "58%", rotate: "5deg", delay: "3.2s", duration: "9.6s" },
];

const SHOWCASE_STARS = [
  { left: "7%", top: "20%", size: 2, delay: "0s", duration: "4.7s" },
  { left: "18%", top: "72%", size: 1.5, delay: "1.9s", duration: "5.3s" },
  { left: "37%", top: "12%", size: 2, delay: "3.2s", duration: "4.1s" },
  { left: "62%", top: "82%", size: 1.5, delay: "0.8s", duration: "5.7s" },
  { left: "84%", top: "16%", size: 2, delay: "2.5s", duration: "4.9s" },
  { left: "94%", top: "58%", size: 1.5, delay: "1.4s", duration: "5s" },
];

const SHOWCASE_COMETS = [
  { top: "34%", left: "-9%", rotate: "9deg", delay: "3s", duration: "18s" },
  { top: "70%", left: "-8%", rotate: "-7deg", delay: "11s", duration: "22s" },
];

const SHOWCASE_COLUMNS = [
  { left: "8%", top: "30%", height: "7rem", delay: "0s", duration: "3.1s" },
  { left: "26%", top: "58%", height: "5rem", delay: "0.9s", duration: "3.5s" },
  { left: "47%", top: "20%", height: "6rem", delay: "1.5s", duration: "2.8s" },
  { left: "71%", top: "52%", height: "8rem", delay: "0.4s", duration: "3.4s" },
  { left: "91%", top: "26%", height: "5.5rem", delay: "1.1s", duration: "3s" },
];

const SHOWCASE_PARTICLES = [
  { left: "11%", size: 2, delay: "0s", duration: "19s" },
  { left: "33%", size: 3, delay: "7s", duration: "22s" },
  { left: "52%", size: 2, delay: "3s", duration: "17s" },
  { left: "69%", size: 2, delay: "11s", duration: "20s" },
  { left: "86%", size: 3, delay: "5s", duration: "18s" },
];

export function PremiumShowcase() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const timer = setInterval(
      () => setActive((current) => (current + 1) % workflow.length),
      2200,
    );
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative isolate overflow-hidden bg-nexus-deep py-20 text-white sm:py-28">
      <div aria-hidden className="absolute inset-0 -z-10 overflow-hidden">
        {/* Velo de carbón sobre el púrpura profundo: oscurece sin salir de la paleta */}
        <div className="absolute inset-0 bg-[#111827]/65" />
        <div className="absolute left-1/2 top-0 h-px w-4/5 -translate-x-1/2 bg-gradient-to-r from-transparent via-nexus-lavender/60 to-transparent" />
        <div
          className="absolute inset-[-18%] opacity-45 motion-safe:animate-hero-mesh"
          style={{
            backgroundImage:
              "radial-gradient(circle at 18% 30%, rgba(173,116,195,0.22), transparent 26%), radial-gradient(circle at 82% 20%, rgba(52,211,153,0.10), transparent 24%), radial-gradient(circle at 55% 88%, rgba(251,113,133,0.08), transparent 27%)",
            backgroundSize: "135% 135%, 128% 128%, 145% 145%",
          }}
        />
        <div className="absolute -left-56 top-24 size-[34rem] rounded-full bg-nexus-purple/45 blur-[150px] motion-safe:animate-drift-1" />
        <div className="absolute -right-44 bottom-8 size-[32rem] rounded-full bg-nexus-mint/10 blur-[130px] motion-safe:animate-drift-2" />
        <div
          className="absolute inset-0 opacity-[0.16]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(173,116,195,0.38) 1px, transparent 1px), linear-gradient(90deg, rgba(173,116,195,0.38) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
            maskImage:
              "radial-gradient(ellipse 70% 55% at 50% 45%, black, transparent)",
          }}
        />
        {SHOWCASE_BEAMS.map((beam, i) => (
          <span
            key={`showcase-beam-${i}`}
            className="absolute left-[-14%] h-px w-[128%]"
            style={{ top: beam.top, transform: `rotate(${beam.rotate})` }}
          >
            <span
              className="block h-px w-1/3 bg-gradient-to-r from-transparent via-nexus-lavender/45 to-transparent blur-[0.5px] motion-safe:animate-energy-beam"
              style={{
                animationDelay: beam.delay,
                animationDuration: beam.duration,
              }}
            />
          </span>
        ))}
        {SHOWCASE_COLUMNS.map((column, i) => (
          <span
            key={`showcase-column-${i}`}
            className="absolute w-px origin-bottom rounded-full bg-gradient-to-t from-transparent via-nexus-mint/40 to-nexus-lavender/55 motion-safe:animate-data-pulse"
            style={{
              left: column.left,
              top: column.top,
              height: column.height,
              animationDelay: column.delay,
              animationDuration: column.duration,
              boxShadow:
                "0 0 16px rgba(52,211,153,0.2), 0 0 26px rgba(173,116,195,0.18)",
            }}
          />
        ))}
        {SHOWCASE_STARS.map((star, i) => (
          <span
            key={`showcase-star-${i}`}
            className="absolute rounded-full bg-white motion-safe:animate-twinkle"
            style={{
              left: star.left,
              top: star.top,
              width: star.size,
              height: star.size,
              animationDelay: star.delay,
              animationDuration: star.duration,
              boxShadow: "0 0 9px rgba(248,237,251,0.55)",
            }}
          />
        ))}
        {SHOWCASE_COMETS.map((comet, i) => (
          <span
            key={`showcase-comet-${i}`}
            className="absolute h-px w-[120%]"
            style={{
              top: comet.top,
              left: comet.left,
              transform: `rotate(${comet.rotate})`,
            }}
          >
            <span
              className="block h-px w-40 rounded-full bg-gradient-to-r from-transparent via-[#AD74C3]/50 to-white opacity-0 shadow-[0_0_14px_rgba(173,116,195,0.7)] motion-safe:animate-comet"
              style={{
                animationDelay: comet.delay,
                animationDuration: comet.duration,
              }}
            />
          </span>
        ))}
        {SHOWCASE_PARTICLES.map((particle, i) => (
          <span
            key={`showcase-particle-${i}`}
            className="absolute bottom-[-8px] rounded-full bg-nexus-lavender/55 opacity-0 motion-safe:animate-rise"
            style={{
              left: particle.left,
              width: particle.size,
              height: particle.size,
              animationDelay: particle.delay,
              animationDuration: particle.duration,
            }}
          />
        ))}
      </div>

      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading
          dark
          eyebrow="Experiencia premium"
          title="Una operación de ventas que se siente viva"
          subtitle="La landing muestra el mismo estándar del producto: señales en tiempo real, datos accionables y una interfaz preparada para equipos que viven de sus leads."
        />

        <div className="mt-12 grid items-center gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <Reveal className="order-2 lg:order-1">
            <div className="relative">
              <div
                aria-hidden
                className="absolute left-1/2 top-1/2 size-72 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10"
              />
              <div
                aria-hidden
                className="absolute left-1/2 top-1/2 size-52 -translate-x-1/2 -translate-y-1/2 rounded-full border border-nexus-lavender/20"
              />
              <span
                aria-hidden
                className="absolute left-1/2 top-1/2 grid size-9 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-nexus-mint text-nexus-deep shadow-[0_0_40px_rgba(52,211,153,0.45)] motion-safe:animate-orbit"
              >
                <Zap className="size-4" />
              </span>
              <span
                aria-hidden
                className="absolute left-1/2 top-1/2 grid size-8 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-nexus-lavender text-white shadow-[0_0_34px_rgba(173,116,195,0.45)] motion-safe:animate-orbit-reverse"
              >
                <BellRing className="size-3.5" />
              </span>

              <div className="relative mx-auto max-w-md rounded-[2rem] bg-gradient-to-br from-white/22 via-white/8 to-white/5 p-px shadow-2xl shadow-black/40">
                <div className="relative overflow-hidden rounded-[calc(2rem-1px)] bg-nexus-deep/90 p-6 backdrop-blur-xl">
                  <div
                    aria-hidden
                    className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/60 to-transparent"
                  />
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-y-0 -left-24 w-24 bg-white/20 blur-xl motion-safe:animate-shimmer"
                  />

                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <span className="grid size-11 place-items-center rounded-2xl bg-gradient-to-br from-nexus-purple to-nexus-lavender shadow-lg shadow-nexus-lavender/25">
                        <Sparkles className="size-5" />
                      </span>
                      <div>
                        <p className="text-sm font-semibold">Nexus Control</p>
                        <p className="text-xs text-white/45">
                          Pipeline en tiempo real
                        </p>
                      </div>
                    </div>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-nexus-mint/12 px-3 py-1 text-xs font-medium text-nexus-mint ring-1 ring-nexus-mint/25">
                      <span className="size-1.5 rounded-full bg-nexus-mint motion-safe:animate-pulse" />
                      Live
                    </span>
                  </div>

                  <div className="mt-5 grid grid-cols-3 gap-2.5">
                    {metrics.map((metric) => (
                      <div
                        key={metric.label}
                        className="rounded-xl border border-white/10 bg-white/[0.04] p-3"
                      >
                        <p className="text-[10px] leading-snug text-white/42">
                          {metric.label}
                        </p>
                        <p
                          className={cn(
                            "mt-1.5 text-xl font-bold tabular-nums",
                            metric.accent,
                          )}
                        >
                          {metric.value}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 rounded-xl border border-white/10 bg-white/[0.045] p-3.5">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-medium text-white/70">
                        Conversaciones calificadas
                      </p>
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium tabular-nums text-nexus-mint">
                        <ArrowUpRight className="size-3.5" />
                        +18%
                      </span>
                    </div>
                    <div className="mt-4 flex h-20 items-end gap-1.5">
                      {bars.map((height, index) => (
                        <m.span
                          key={index}
                          initial={{ height: "0%" }}
                          whileInView={{ height: `${height}%` }}
                          viewport={{ once: true }}
                          transition={{ type: "spring", stiffness: 120, damping: 20, mass: 1, delay: index * 0.04 }}
                          className="flex-1 rounded-t-full bg-gradient-to-t from-[#522566] to-[#34D399]"
                        />
                      ))}
                    </div>
                    <p className="mt-2 text-right text-[10px] text-white/35">
                      Últimos 12 días
                    </p>
                  </div>

                  <div className="mt-4">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-nexus-lavender">
                      Conectado a
                    </p>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {integrations.map((item) => (
                        <span
                          key={item}
                          className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[11px] font-medium text-white/60"
                        >
                          <span className="size-1 rounded-full bg-nexus-mint" />
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>

          <RevealStagger
            stagger={0.12}
            className="order-1 grid gap-4 lg:order-2"
          >
            <RevealItem>
              <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-r from-nexus-lavender/60 via-white/20 to-nexus-mint/50 p-px">
                <div className="relative overflow-hidden rounded-[calc(2rem-1px)] bg-nexus-deep/90 p-6 backdrop-blur-xl sm:p-7">
                  <div
                    aria-hidden
                    className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-white/8 to-transparent"
                  />
                  <div
                    aria-hidden
                    className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-nexus-mint/10 to-transparent motion-safe:animate-scanline"
                  />

                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="text-xs font-medium uppercase text-nexus-lavender">
                        Live lead room
                      </p>
                      <h3 className="mt-1.5 text-xl font-bold leading-tight tracking-tight sm:text-2xl">
                        De conversación a oportunidad en segundos
                      </h3>
                    </div>
                    <span className="inline-flex w-fit shrink-0 items-center gap-2 rounded-full bg-white/8 px-3 py-1.5 text-[11px] font-medium text-white/65 ring-1 ring-white/10">
                      <Activity className="size-3.5 text-nexus-mint" />
                      Eventos sincronizados
                    </span>
                  </div>

                  <div className="mt-5 grid gap-2.5">
                    {workflow.map((item, index) => {
                      const Icon = item.icon;
                      const isActive = active === index;
                      const isDone =
                        active > index || (active === 0 && index === workflow.length - 1);

                      return (
                        <m.div
                          key={item.label}
                          animate={{
                            opacity: isActive ? 1 : 0.72,
                            x: isActive ? 8 : 0,
                          }}
                          transition={{
                            type: "spring",
                            stiffness: 240,
                            damping: 24,
                          }}
                          className={cn(
                            "relative flex items-center gap-3 rounded-2xl border p-3 transition-colors duration-300",
                            isActive
                              ? "border-nexus-mint/40 bg-nexus-mint/10 shadow-[0_0_35px_rgba(52,211,153,0.12)]"
                              : "border-white/10 bg-white/[0.035]",
                          )}
                        >
                          <span
                            className={cn(
                              "grid size-9 shrink-0 place-items-center rounded-xl transition-colors duration-300",
                              isActive
                                ? "bg-nexus-mint text-nexus-deep"
                                : isDone
                                  ? "bg-nexus-lavender/20 text-nexus-lavender"
                                  : "bg-white/8 text-white/50",
                            )}
                          >
                            <Icon className="size-4" />
                          </span>
                          <div className="min-w-0 flex-1">
                            <p className="text-[13px] font-semibold leading-tight text-white">
                              {item.label}
                            </p>
                            <p className="mt-0.5 truncate text-[11px] text-white/45">
                              {item.detail}
                            </p>
                          </div>
                          <span
                            className={cn(
                              "shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-medium tabular-nums",
                              isActive
                                ? "bg-nexus-mint text-nexus-deep"
                                : "bg-white/8 text-white/55",
                            )}
                          >
                            {item.value}
                          </span>
                        </m.div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </RevealItem>

            <RevealItem>
              <div className="grid gap-2.5 sm:grid-cols-2">
                <div className="rounded-2xl bg-gradient-to-b from-nexus-mint/30 via-white/10 to-transparent p-px">
                  <div className="h-full rounded-[calc(1rem-1px)] bg-nexus-deep/90 p-4 backdrop-blur-xl">
                    <div className="flex items-center gap-2.5">
                      <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-nexus-mint/12 ring-1 ring-nexus-mint/25">
                        <ShieldCheck className="size-4 text-nexus-mint" />
                      </span>
                      <p className="text-[13px] font-semibold">
                        Aislamiento multi-tenant
                      </p>
                    </div>
                    <p className="mt-2.5 text-[13px] leading-relaxed text-white/50">
                      Cada conversación respeta tenant, origen, límites de plan
                      y reglas de seguridad antes de tocar IA.
                    </p>
                  </div>
                </div>
                <div className="rounded-2xl bg-gradient-to-b from-nexus-lavender/35 via-white/10 to-transparent p-px">
                  <div className="h-full rounded-[calc(1rem-1px)] bg-nexus-deep/90 p-4 backdrop-blur-xl">
                    <div className="flex items-center gap-2.5">
                      <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-nexus-lavender/12 ring-1 ring-nexus-lavender/25">
                        <BellRing className="size-4 text-nexus-lavender" />
                      </span>
                      <p className="text-[13px] font-semibold">
                        Notificaciones accionables
                      </p>
                    </div>
                    <p className="mt-2.5 text-[13px] leading-relaxed text-white/50">
                      El lead llega con resumen, score y datos estructurados
                      para ventas, CRM o webhooks.
                    </p>
                  </div>
                </div>
              </div>
            </RevealItem>
          </RevealStagger>
        </div>
      </div>
    </section>
  );
}
