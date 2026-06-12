"use client";

import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useScroll,
  useTransform,
} from "motion/react";
import {
  BrainCircuit,
  Check,
  Clock3,
  Code2,
  Copy,
  Gauge,
  MessagesSquare,
  TrendingUp,
  Zap,
} from "lucide-react";
import { useEffect, useRef } from "react";
import { SectionHeading } from "./section-heading";
import { RevealItem, RevealStagger } from "./reveal";
import { TiltCard } from "./tilt-card";

const steps = [
  {
    icon: BrainCircuit,
    title: "Entrena tu bot",
    description:
      "Sube documentos, catálogos y preguntas frecuentes: Nexus aprende tu negocio con búsqueda semántica.",
    bullets: [
      "PDF, Word, texto y URLs",
      "Conocimiento por categorías",
      "Sin equipo técnico",
    ],
    meta: { icon: Clock3, label: "≈ 5 min de configuración" },
  },
  {
    icon: Code2,
    title: "Instálalo en tu web",
    description:
      "Copia una línea de código y el widget aparece en tu sitio, con tus colores y tu tono de marca.",
    bullets: [
      "Compatible con cualquier web",
      "Personalizado con tu marca",
      "Carga ligera, cero fricción",
    ],
    meta: { icon: Copy, label: "1 línea de código" },
  },
  {
    icon: MessagesSquare,
    title: "Conversa y captura",
    description:
      "El bot atiende a cada visitante con tu conocimiento y pide sus datos en el momento exacto.",
    bullets: [
      "Respuestas con tu información",
      "Captura datos sin formularios",
      "Conversaciones simultáneas",
    ],
    meta: { icon: Zap, label: "Atención 24/7" },
  },
  {
    icon: TrendingUp,
    title: "Recibe leads calificados",
    description:
      "Cada lead llega con score, resumen ejecutivo y datos estructurados, listo para tu equipo de ventas.",
    bullets: [
      "Resumen ejecutivo por lead",
      "Datos exportables a tu CRM",
      "Alertas por email y webhook",
    ],
    meta: { icon: Gauge, label: "Score NEX de 0 a 100" },
  },
];

/* Gauge circular del Score NEX: el arco y el número suben con la misma
   física spring; solo anima pathLength (SVG) y texto, nada de layout. */
function LeadScoreGauge() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const progress = useMotionValue(0);
  const pathLength = useTransform(progress, [0, 100], [0, 1]);
  const rounded = useTransform(progress, (v) => Math.round(v));

  useEffect(() => {
    if (!inView) return;
    const controls = animate(progress, 87, {
      type: "spring",
      stiffness: 90,
      damping: 20,
      mass: 1,
    });
    return () => controls.stop();
  }, [inView, progress]);

  return (
    <div
      ref={ref}
      role="img"
      aria-label="Score NEX de ejemplo: 87 de 100"
      className="relative grid size-16 shrink-0 place-items-center"
    >
      <svg viewBox="0 0 64 64" className="size-16 -rotate-90">
        <circle
          cx="32"
          cy="32"
          r="27"
          fill="none"
          stroke="#522566"
          strokeOpacity="0.1"
          strokeWidth="5"
        />
        <motion.circle
          cx="32"
          cy="32"
          r="27"
          fill="none"
          stroke="#34D399"
          strokeWidth="5"
          strokeLinecap="round"
          style={{ pathLength }}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <motion.span className="text-lg font-bold leading-none tabular-nums text-nexus-ink">
          {rounded}
        </motion.span>
        <span className="mt-0.5 text-[7px] font-bold uppercase tracking-widest text-nexus-mint">
          Score
        </span>
      </div>
    </div>
  );
}

export function HowItWorks() {
  const lineRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: lineRef,
    offset: ["start 75%", "end 60%"],
  });
  const lineScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section id="como-funciona" className="bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading
          eyebrow="Cómo funciona"
          title="De cero a vender en cuatro pasos"
          subtitle="Diseñado para que cualquier empresa lo ponga en marcha el mismo día, sin equipo técnico."
        />

        <div ref={lineRef} className="relative mt-14">
          {/* Línea de progreso que se dibuja con el scroll; los huecos entre
              tarjetas dejan ver los segmentos a la altura de los iconos */}
          <motion.div
            aria-hidden
            style={{ scaleX: lineScale }}
            className="absolute inset-x-0 top-12 hidden h-px origin-left bg-gradient-to-r from-nexus-purple via-nexus-lavender to-nexus-mint lg:block"
          />

          <RevealStagger
            stagger={0.08}
            className="grid gap-5 md:grid-cols-2 lg:grid-cols-4"
          >
            {steps.map((step, i) => (
              <RevealItem key={step.title} className="relative h-full">
                <TiltCard className="h-full rounded-[1.75rem]">
                  {/* Borde hairline degradado: wrapper de 1px con gradiente */}
                  <div className="h-full rounded-[1.75rem] bg-gradient-to-b from-nexus-purple/15 via-nexus-lavender/10 to-nexus-purple/5 p-px shadow-lg shadow-nexus-purple/5 transition-shadow duration-300 hover:shadow-xl hover:shadow-nexus-purple/10">
                    <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(1.75rem-1px)] bg-gradient-to-b from-white to-nexus-lilac/55 p-6">
                      <div className="flex items-start justify-between gap-4">
                        <div className="grid size-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-nexus-purple to-nexus-deep shadow-lg shadow-nexus-purple/25 transition-transform duration-300 hover:scale-110 hover:rotate-3">
                          <step.icon className="size-5 text-nexus-lavender" />
                        </div>
                        {i === 3 ? (
                          <LeadScoreGauge />
                        ) : (
                          <span
                            aria-hidden
                            className="select-none text-5xl font-bold leading-none tracking-tight text-nexus-purple/[0.08]"
                          >
                            0{i + 1}
                          </span>
                        )}
                      </div>

                      <span className="mt-5 text-[10px] font-bold uppercase tracking-widest text-nexus-lavender">
                        Paso {i + 1}
                      </span>
                      <h3 className="mt-1.5 text-lg font-semibold tracking-tight text-nexus-ink">
                        {step.title}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-nexus-ink/60">
                        {step.description}
                      </p>

                      <ul className="mb-5 mt-4 space-y-2">
                        {step.bullets.map((bullet) => (
                          <li
                            key={bullet}
                            className="flex items-start gap-2 text-[13px] leading-snug text-nexus-ink/75"
                          >
                            <span className="mt-0.5 grid size-4 shrink-0 place-items-center rounded-full bg-nexus-mint/15">
                              <Check
                                aria-hidden
                                strokeWidth={3.5}
                                className="size-2.5 text-nexus-mint"
                              />
                            </span>
                            {bullet}
                          </li>
                        ))}
                      </ul>

                      <div className="mt-auto flex items-center gap-2 border-t border-nexus-purple/10 pt-3.5">
                        <step.meta.icon
                          aria-hidden
                          className="size-3.5 text-nexus-lavender"
                        />
                        <span className="text-xs font-medium text-nexus-ink/70">
                          {step.meta.label}
                        </span>
                      </div>
                    </div>
                  </div>
                </TiltCard>
              </RevealItem>
            ))}
          </RevealStagger>
        </div>
      </div>
    </section>
  );
}
