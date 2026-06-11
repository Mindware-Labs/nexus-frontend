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
  Code2,
  MessagesSquare,
  TrendingUp,
} from "lucide-react";
import { useEffect, useRef } from "react";
import { SectionHeading } from "./section-heading";
import { RevealItem, RevealStagger } from "./reveal";
import { TiltCard } from "./tilt-card";
import { cn } from "@/lib/utils";

const steps = [
  {
    icon: BrainCircuit,
    title: "Entrena tu bot",
    description:
      "Sube tus documentos, catálogos y preguntas frecuentes. Nexus aprende tu negocio en minutos con búsqueda semántica.",
  },
  {
    icon: Code2,
    title: "Instálalo en tu web",
    description:
      "Copia una línea de código y el widget aparece en tu sitio. Sin desarrolladores, sin fricción, con tu marca.",
  },
  {
    icon: MessagesSquare,
    title: "Conversa y captura",
    description:
      "El bot atiende a cada visitante, responde con tu conocimiento y captura sus datos en el momento exacto.",
  },
  {
    icon: TrendingUp,
    title: "Recibe leads calificados",
    description:
      "Cada lead llega con score de 0 a 100, resumen ejecutivo y datos estructurados, listo para tu equipo de ventas.",
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
      className="relative grid size-24 shrink-0 place-items-center"
    >
      <svg viewBox="0 0 96 96" className="size-24 -rotate-90">
        <circle
          cx="48"
          cy="48"
          r="40"
          fill="none"
          stroke="#522566"
          strokeOpacity="0.1"
          strokeWidth="7"
        />
        <motion.circle
          cx="48"
          cy="48"
          r="40"
          fill="none"
          stroke="#34D399"
          strokeWidth="7"
          strokeLinecap="round"
          style={{ pathLength }}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <motion.span className="text-2xl font-bold leading-none tabular-nums text-[#111827]">
          {rounded}
        </motion.span>
        <span className="mt-1 text-[9px] font-bold uppercase tracking-widest text-[#34D399]">
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
    <section id="como-funciona" className="bg-white py-28 sm:py-36">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading
          eyebrow="Cómo funciona"
          title="De cero a vender en cuatro pasos"
          subtitle="Diseñado para que cualquier empresa lo ponga en marcha el mismo día, sin equipo técnico."
        />

        <div ref={lineRef} className="relative mt-20">
          {/* Línea de progreso que se dibuja con el scroll */}
          <div
            aria-hidden
            className="absolute left-7 top-0 hidden h-full w-px bg-nexus-lilac lg:left-1/2 lg:top-7 lg:h-px lg:w-full lg:bg-transparent"
          />
          <motion.div
            aria-hidden
            style={{ scaleX: lineScale }}
            className="absolute left-0 top-7 hidden h-px w-full origin-left bg-gradient-to-r from-nexus-purple via-nexus-lavender to-nexus-mint lg:block"
          />

          <RevealStagger
            stagger={0.08}
            className="grid gap-8 lg:grid-cols-12"
          >
            {steps.map((step, i) => (
              <RevealItem key={step.title} className={cn("relative h-full", i === 0 || i === 3 ? "lg:col-span-7" : "lg:col-span-5")}>
                <TiltCard className="h-full rounded-[2.5rem]">
                  <div className="flex h-full flex-col items-start rounded-[2.5rem] bg-[#F8EDFB]/50 p-10 transition-shadow hover:shadow-xl hover:shadow-[#522566]/5">
                    <div className="flex w-full items-start justify-between gap-6">
                      <div className="relative z-10 grid size-16 shrink-0 place-items-center rounded-[1.25rem] bg-gradient-to-br from-[#522566] to-[#3D1A4E] shadow-lg shadow-[#522566]/25 transition-transform duration-300 hover:scale-110 hover:rotate-3">
                        <step.icon className="size-7 text-[#AD74C3]" />
                      </div>
                      {i === 3 && <LeadScoreGauge />}
                    </div>
                    <div className="mt-8 flex flex-col flex-1">
                      <span className="text-[11px] font-bold uppercase tracking-widest text-[#AD74C3]">
                        Paso {i + 1}
                      </span>
                      <h3 className="mt-3 text-2xl font-semibold tracking-tight text-[#111827]">
                        {step.title}
                      </h3>
                      <p className="mt-4 text-[16px] leading-relaxed text-[#111827]/60">
                        {step.description}
                      </p>
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
