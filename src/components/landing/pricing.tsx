"use client";

import { motion, useMotionValue, useTransform } from "motion/react";
import { Check, Minus, Zap } from "lucide-react";
import { useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { SectionHeading } from "./section-heading";
import { RevealItem, RevealStagger } from "./reveal";
import { TiltCard } from "./tilt-card";

const FEATURES = [
  "Conversaciones / mes",
  "Bots activos",
  "Documentos de conocimiento",
  "Calificación de leads (score NEX)",
  "Widget personalizable",
  "Notificaciones por email",
  "Webhooks e integraciones CRM",
  "Reportes avanzados",
  "Soporte prioritario",
] as const;

const TIERS: {
  name: string;
  monthly: number;
  description: string;
  featured?: boolean;
  values: (string | boolean)[];
}[] = [
  {
    name: "Plan X",
    monthly: 29,
    description: "Para validar el canal con tu primer bot.",
    values: ["500", "1", "10", true, true, true, false, false, false],
  },
  {
    name: "Plan Y",
    monthly: 79,
    description: "Para equipos que viven de sus leads.",
    featured: true,
    values: ["2.500", "3", "50", true, true, true, true, true, false],
  },
  {
    name: "Plan Z",
    monthly: 199,
    description: "Para operaciones con alto volumen.",
    values: ["10.000", "10", "Ilimitados", true, true, true, true, true, true],
  },
];

function CTAButton({ href, className, children }: { href: string; className?: string; children: React.ReactNode }) {
  const ref = useRef<HTMLAnchorElement>(null);
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const glareX = useTransform(px, [0, 1], ["0%", "100%"]);
  const glareY = useTransform(py, [0, 1], ["0%", "100%"]);

  function onMouseMove(e: React.MouseEvent<HTMLAnchorElement>) {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    px.set((e.clientX - rect.left) / rect.width);
    py.set((e.clientY - rect.top) / rect.height);
  }

  function onMouseLeave() {
    px.set(0.5);
    py.set(0.5);
  }

  return (
    <a
      ref={ref}
      href={href}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      className={cn("group relative overflow-hidden rounded-full py-3 text-center text-sm font-medium transition-[transform,background-color] duration-200 ease-out hover:scale-[1.03] active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-nexus-lavender", className)}
    >
      <span className="relative z-10">{children}</span>
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: useTransform(
            [glareX, glareY],
            ([x, y]) =>
              `radial-gradient(100px circle at ${x} ${y}, rgba(255,255,255,0.25), transparent 65%)`,
          ),
        }}
      />
    </a>
  );
}

export function Pricing() {
  const [annual, setAnnual] = useState(true);

  return (
    <section id="precios" className="bg-white py-28 sm:py-36">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading
          eyebrow="Planes y precios"
          title="Un plan para cada etapa"
          subtitle="Empieza pequeño y escala cuando tus leads lo pidan. Sin permanencia, cancela cuando quieras."
        />

        {/* Toggle mensual / anual */}
        <RevealStagger className="mt-10 flex justify-center">
          <RevealItem>
            <div className="relative flex items-center gap-1 rounded-full bg-nexus-lilac p-1">
              {(["Mensual", "Anual"] as const).map((label) => {
                const isAnnual = label === "Anual";
                const active = annual === isAnnual;
                return (
                  <button
                    key={label}
                    onClick={() => setAnnual(isAnnual)}
                    className={cn(
                      "relative rounded-full px-5 py-2 text-sm font-medium transition-colors duration-300",
                      active
                        ? "text-white"
                        : "text-nexus-ink/60 hover:text-nexus-ink",
                    )}
                  >
                    {active && (
                      <motion.span
                        layoutId="billing-pill"
                        className="absolute inset-0 rounded-full bg-nexus-purple"
                        transition={{
                          type: "spring",
                          stiffness: 350,
                          damping: 32,
                        }}
                      />
                    )}
                    <span className="relative">
                      {label}
                      {isAnnual && (
                        <span className="ml-1.5 text-xs text-nexus-mint">
                          −20%
                        </span>
                      )}
                    </span>
                  </button>
                );
              })}
            </div>
          </RevealItem>
        </RevealStagger>

        <RevealStagger
          stagger={0.1}
          className="mt-12 grid items-stretch gap-6 lg:grid-cols-3"
        >
          {TIERS.map((tier) => {
            const price = annual
              ? Math.round(tier.monthly * 0.8)
              : tier.monthly;
            return (
              <RevealItem key={tier.name} className="h-full">
                <TiltCard className="h-full rounded-[2.5rem]">
                <motion.article
                  whileHover={{ y: -8 }}
                  transition={{ type: "spring", stiffness: 220, damping: 20 }}
                  className={cn(
                    "relative flex h-full flex-col rounded-[2.5rem]",
                    tier.featured
                      ? "bg-gradient-to-b from-[#AD74C3]/50 via-[#522566]/40 to-[#AD74C3]/50 p-px shadow-2xl shadow-nexus-purple/30 lg:scale-[1.04]"
                      : "border border-nexus-purple/10 bg-white shadow-sm"
                  )}
                >
                  {/* Hilo de luz láser perimetral: conic-gradient que orbita
                      con rotación pura (GPU); el panel interior tapa todo
                      salvo el rim de 1px. */}
                  {tier.featured && (
                    <div
                      aria-hidden
                      className="absolute inset-0 overflow-hidden rounded-[2.5rem]"
                    >
                      <span
                        className="absolute -inset-[100%] motion-safe:animate-laser-orbit"
                        style={{
                          background:
                            "conic-gradient(from 0deg, transparent 0deg, transparent 280deg, #522566 305deg, #AD74C3 342deg, #F8EDFB 352deg, transparent 360deg)",
                        }}
                      />
                    </div>
                  )}
                  <div className={cn("relative z-10 flex h-full flex-col rounded-[calc(2.5rem-1px)] p-8", tier.featured ? "bg-[#3D1A4E] text-white" : "bg-white text-nexus-ink")}>
                    {tier.featured && (
                      <span className="absolute -top-3.5 left-1/2 inline-flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-nexus-mint px-3.5 py-1 text-xs font-medium text-nexus-deep shadow-lg">
                        <Zap className="size-3.5" /> Más popular
                      </span>
                    )}

                    <h3 className="text-lg font-semibold tracking-tight">
                      {tier.name}
                    </h3>
                    <p
                      className={cn(
                        "mt-1 text-sm",
                        tier.featured ? "text-white/60" : "text-nexus-ink/55",
                      )}
                    >
                      {tier.description}
                    </p>

                    <div className="mt-6 flex items-baseline gap-1.5">
                      <motion.span
                        key={price}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ type: "spring", stiffness: 200, damping: 20 }}
                        className="text-5xl font-bold tracking-tight tabular-nums"
                      >
                        ${price}
                      </motion.span>
                      <span
                        className={cn(
                          "text-sm",
                          tier.featured ? "text-white/55" : "text-nexus-ink/50",
                        )}
                      >
                        USD / mes
                      </span>
                    </div>

                    <ul className="mt-8 flex-1 space-y-3.5">
                      {FEATURES.map((feature, i) => {
                        const value = tier.values[i];
                        const excluded = value === false;
                        return (
                          <li
                            key={feature}
                            className={cn(
                              "flex items-center gap-3 text-sm",
                              excluded &&
                                (tier.featured
                                  ? "text-white/35"
                                  : "text-nexus-ink/35"),
                            )}
                          >
                            {excluded ? (
                              <Minus className="size-4 shrink-0 opacity-50" />
                            ) : (
                              <Check className="size-4 shrink-0 text-nexus-mint" />
                            )}
                            <span className="flex-1">{feature}</span>
                            {typeof value === "string" && (
                              <span
                                className={cn(
                                  "font-medium tabular-nums",
                                  tier.featured
                                    ? "text-nexus-lavender"
                                    : "text-nexus-purple",
                                )}
                              >
                                {value}
                              </span>
                            )}
                          </li>
                        );
                      })}
                    </ul>

                    <CTAButton
                      href="#contacto"
                      className={cn(
                        "mt-9",
                        tier.featured
                          ? "bg-white text-nexus-deep hover:bg-nexus-lilac"
                          : "bg-nexus-purple text-white hover:bg-[#3D1A4E]",
                      )}
                    >
                      Empezar con {tier.name}
                    </CTAButton>
                  </div>
                </motion.article>
                </TiltCard>
              </RevealItem>
            );
          })}
        </RevealStagger>

        <RevealStagger className="mt-10">
          <RevealItem>
            <p className="text-center text-sm text-nexus-ink/45">
              Precios de lanzamiento del programa de acceso anticipado. Todos
              los planes incluyen actualizaciones y mejoras continuas del motor
              de IA.
            </p>
          </RevealItem>
        </RevealStagger>
      </div>
    </section>
  );
}
