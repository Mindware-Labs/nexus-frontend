"use client";

import { motion } from "motion/react";
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
    value: "SSE activo",
  },
  {
    icon: DatabaseZap,
    label: "Contexto recuperado",
    value: "RAG listo",
  },
  {
    icon: Workflow,
    label: "Lead estructurado",
    value: "Campos OK",
  },
  {
    icon: Gauge,
    label: "Score NEX",
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
    <section className="relative isolate overflow-hidden bg-nexus-deep py-28 text-white sm:py-36">
      <div aria-hidden className="absolute inset-0 -z-10 overflow-hidden">
        {/* Velo de carbón sobre el púrpura profundo: oscurece sin salir de la paleta */}
        <div className="absolute inset-0 bg-[#111827]/65" />
        <div className="absolute left-1/2 top-0 h-px w-4/5 -translate-x-1/2 bg-gradient-to-r from-transparent via-nexus-lavender/60 to-transparent" />
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
      </div>

      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading
          dark
          eyebrow="Experiencia premium"
          title="Una operación de ventas que se siente viva"
          subtitle="La landing muestra el mismo estándar del producto: señales en tiempo real, datos accionables y una interfaz preparada para equipos que viven de sus leads."
        />

        <div className="mt-16 grid items-center gap-8 lg:grid-cols-[0.9fr_1.1fr]">
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

              <div className="relative mx-auto max-w-md rounded-[2.5rem] bg-gradient-to-br from-white/22 via-white/8 to-white/5 p-px shadow-2xl shadow-black/40">
                <div className="relative overflow-hidden rounded-[calc(2.5rem-1px)] bg-nexus-deep/90 p-8 backdrop-blur-xl">
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

                  <div className="mt-7 grid grid-cols-3 gap-3">
                    {metrics.map((metric) => (
                      <div
                        key={metric.label}
                        className="rounded-2xl border border-white/10 bg-white/[0.04] p-4"
                      >
                        <p className="text-[11px] leading-snug text-white/42">
                          {metric.label}
                        </p>
                        <p
                          className={cn(
                            "mt-2 text-2xl font-bold tabular-nums",
                            metric.accent,
                          )}
                        >
                          {metric.value}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-7 rounded-2xl border border-white/10 bg-white/[0.045] p-4">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-medium text-white/70">
                        Conversaciones calificadas
                      </p>
                      <ArrowUpRight className="size-4 text-nexus-mint" />
                    </div>
                    <div className="mt-5 flex h-24 items-end gap-2">
                      {bars.map((height, index) => (
                        <motion.span
                          key={index}
                          initial={{ height: "0%" }}
                          whileInView={{ height: `${height}%` }}
                          viewport={{ once: true }}
                          transition={{ type: "spring", stiffness: 120, damping: 20, mass: 1, delay: index * 0.04 }}
                          className="flex-1 rounded-t-full bg-gradient-to-t from-[#522566] to-[#34D399]"
                        />
                      ))}
                    </div>
                  </div>

                  <div className="mt-5 flex flex-wrap gap-2">
                    {integrations.map((item) => (
                      <span
                        key={item}
                        className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-medium text-white/60"
                      >
                        {item}
                      </span>
                    ))}
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
              <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-r from-nexus-lavender/60 via-white/20 to-nexus-mint/50 p-px">
                <div className="relative overflow-hidden rounded-[calc(2.5rem-1px)] bg-nexus-deep/90 p-8 backdrop-blur-xl">
                  <div
                    aria-hidden
                    className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-white/8 to-transparent"
                  />
                  <div
                    aria-hidden
                    className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-nexus-mint/10 to-transparent motion-safe:animate-scanline"
                  />

                  <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="text-xs font-medium uppercase text-nexus-lavender">
                        Live lead room
                      </p>
                      <h3 className="mt-2 text-2xl font-bold leading-tight sm:text-3xl">
                        De conversación a oportunidad en segundos
                      </h3>
                    </div>
                    <span className="inline-flex w-fit items-center gap-2 rounded-full bg-white/8 px-3 py-1.5 text-xs font-medium text-white/65 ring-1 ring-white/10">
                      <Activity className="size-3.5 text-nexus-mint" />
                      Eventos sincronizados
                    </span>
                  </div>

                  <div className="mt-7 grid gap-3">
                    {workflow.map((item, index) => {
                      const Icon = item.icon;
                      const isActive = active === index;
                      const isDone =
                        active > index || (active === 0 && index === workflow.length - 1);

                      return (
                        <motion.div
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
                            "relative flex items-center gap-4 rounded-2xl border p-4 transition-colors duration-300",
                            isActive
                              ? "border-nexus-mint/40 bg-nexus-mint/10 shadow-[0_0_35px_rgba(52,211,153,0.12)]"
                              : "border-white/10 bg-white/[0.035]",
                          )}
                        >
                          <span
                            className={cn(
                              "grid size-11 shrink-0 place-items-center rounded-2xl transition-colors duration-300",
                              isActive
                                ? "bg-nexus-mint text-nexus-deep"
                                : isDone
                                  ? "bg-nexus-lavender/20 text-nexus-lavender"
                                  : "bg-white/8 text-white/50",
                            )}
                          >
                            <Icon className="size-5" />
                          </span>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-semibold text-white">
                              {item.label}
                            </p>
                            <p className="mt-1 text-xs text-white/45">
                              Guardado con tenant scope y auditoría de evento
                            </p>
                          </div>
                          <span
                            className={cn(
                              "rounded-full px-3 py-1 text-xs font-medium",
                              isActive
                                ? "bg-nexus-mint text-nexus-deep"
                                : "bg-white/8 text-white/55",
                            )}
                          >
                            {item.value}
                          </span>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </RevealItem>

            <RevealItem>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
                  <ShieldCheck className="size-6 text-nexus-mint" />
                  <p className="mt-4 text-sm font-semibold">
                    Aislamiento multi-tenant
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-white/50">
                    Cada conversación respeta tenant, origen, límites de plan y
                    reglas de seguridad antes de tocar IA.
                  </p>
                </div>
                <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
                  <BellRing className="size-6 text-nexus-lavender" />
                  <p className="mt-4 text-sm font-semibold">
                    Notificaciones accionables
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-white/50">
                    El lead llega con resumen, score y datos estructurados para
                    ventas, CRM o webhooks.
                  </p>
                </div>
              </div>
            </RevealItem>
          </RevealStagger>
        </div>
      </div>
    </section>
  );
}
