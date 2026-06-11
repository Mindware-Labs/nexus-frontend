"use client";

import { AnimatePresence, motion, type Variants } from "motion/react";
import {
  Building2,
  GraduationCap,
  HeartPulse,
  Scale,
  ShoppingBag,
  Sparkles,
  TrendingDown,
  Wrench,
  Zap,
} from "lucide-react";
import { useState } from "react";
import { SectionHeading } from "./section-heading";
import { ScoreMeter } from "./score-meter";
import { TiltCard } from "./tilt-card";
import { cn } from "@/lib/utils";

/* Cada industria muestra el producto completo: dolor que resuelve (coral),
   datos que captura, una conversación de muestra y el lead calificado con
   su Score NEX (menta = estado "Calificado", según diseño.md). */
const cases = [
  {
    icon: Building2,
    industry: "Inmobiliarias",
    description:
      "Califica compradores por presupuesto, zona y urgencia antes de que tu asesor levante el teléfono.",
    pain: "Asesores que pierden horas con curiosos sin presupuesto real.",
    highlight: "Leads con intención real de compra",
    fields: ["Presupuesto", "Zona", "Urgencia"],
    question: "¿Tienen deptos de 2 dormitorios con entrega este año?",
    answer:
      "¡Sí! Tenemos 3 proyectos con entrega 2026. ¿Buscas para vivir o para invertir?",
    lead: "Carolina M. · carolina@gmail.com",
    score: 91,
  },
  {
    icon: HeartPulse,
    industry: "Clínicas y salud",
    description:
      "Responde dudas sobre tratamientos y agenda valoraciones sin saturar a tu recepción.",
    pain: "Recepción colapsada y pacientes que no vuelven a llamar.",
    highlight: "Atención inmediata a pacientes",
    fields: ["Tratamiento", "Previsión", "Agenda"],
    question: "¿Cuánto cuesta una limpieza dental?",
    answer:
      "Desde $35.000 e incluye evaluación. ¿Te agendo una valoración sin costo?",
    lead: "Jorge A. · jorge.a@gmail.com",
    score: 84,
  },
  {
    icon: GraduationCap,
    industry: "Educación",
    description:
      "Orienta a aspirantes sobre programas, becas y fechas, y entrega prospectos listos a admisiones.",
    pain: "Aspirantes que se enfrían esperando respuesta de admisiones.",
    highlight: "Matrículas que no se enfrían",
    fields: ["Programa", "Beca", "Inicio"],
    question: "¿Tienen becas para el diplomado de datos?",
    answer:
      "Sí, hasta 40% según tu puntaje. El próximo inicio es en agosto. ¿Te envío la malla?",
    lead: "Valentina R. · vale.rojas@gmail.com",
    score: 88,
  },
  {
    icon: Scale,
    industry: "Despachos legales",
    description:
      "Filtra consultas por tipo de caso y urgencia para que tus abogados solo atiendan lo que importa.",
    pain: "Horas facturables perdidas filtrando consultas sin caso.",
    highlight: "Casos pre-evaluados",
    fields: ["Tipo de caso", "Urgencia", "Contacto"],
    question: "Me llegó una carta de despido, ¿pueden ayudarme?",
    answer:
      "Sí, es nuestra especialidad. ¿Hace cuántos días la recibiste? Los plazos importan.",
    lead: "Rodrigo S. · r.soto@empresa.cl",
    score: 86,
  },
  {
    icon: ShoppingBag,
    industry: "E-commerce y retail",
    description:
      "Resuelve dudas de producto, stock y envíos en el momento exacto de la decisión de compra.",
    pain: "Carritos abandonados por dudas que nadie respondió a tiempo.",
    highlight: "Menos carritos abandonados",
    fields: ["Producto", "Stock", "Envío"],
    question: "¿Este modelo tiene stock en talla M?",
    answer:
      "¡Quedan 4 en talla M! Si pides hoy, llega el jueves. ¿Te ayudo a cerrar la compra?",
    lead: "Camila T. · cami.torres@gmail.com",
    score: 79,
  },
  {
    icon: Wrench,
    industry: "Servicios profesionales",
    description:
      "Cotiza, agenda y captura datos de contacto mientras tu equipo está en campo trabajando.",
    pain: "Cotizaciones que llegan tarde porque el equipo está en terreno.",
    highlight: "Tu mejor vendedor, siempre activo",
    fields: ["Servicio", "Ubicación", "Plazo"],
    question: "¿Hacen mantención de aire acondicionado en oficinas?",
    answer:
      "Sí, atendemos empresas. ¿Cuántos equipos tienes? Te preparo la cotización hoy.",
    lead: "Felipe G. · fgodoy@empresa.cl",
    score: 90,
  },
];

/* Al cambiar de pestaña, los hijos del panel emergen en cascada desde
   abajo (y: 25 → 0) con física spring. */
const swapContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};

const swapItem: Variants = {
  hidden: { opacity: 0, y: 25 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 260, damping: 26, mass: 0.9 },
  },
};

export function UseCases() {
  const [activeIdx, setActiveIdx] = useState(0);
  const activeCase = cases[activeIdx];

  return (
    <section id="casos-de-uso" className="bg-[#F8EDFB] py-28 sm:py-36">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading
          eyebrow="Casos de uso"
          title="Hecho para tu industria"
          subtitle="Cada negocio conversa distinto. Nexus se adapta al tono, las reglas y los datos que tu sector necesita capturar."
        />

        {/* Control segmentado tipo iOS: la píldora activa se desplaza
            magnéticamente con física spring (layoutId) */}
        <div className="mt-16 flex justify-center">
          <div
            role="tablist"
            aria-label="Industrias"
            className="relative flex w-full max-w-4xl flex-wrap items-center justify-center gap-2 rounded-[2.5rem] bg-white p-2 shadow-sm ring-1 ring-[#522566]/5"
          >
            {cases.map((c, idx) => {
              const isActive = activeIdx === idx;
              return (
                <button
                  key={c.industry}
                  role="tab"
                  aria-selected={isActive}
                  aria-controls="use-case-panel"
                  onClick={() => setActiveIdx(idx)}
                  className={cn(
                    "relative flex items-center gap-2 rounded-full px-5 py-3 text-sm font-medium transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#AD74C3]",
                    isActive
                      ? "text-white"
                      : "text-[#111827]/60 hover:text-[#111827]",
                  )}
                >
                  {isActive && (
                    <motion.div
                      layoutId="use-cases-pill"
                      className="absolute inset-0 rounded-full bg-[#522566] shadow-lg shadow-[#522566]/25"
                      transition={{ type: "spring", stiffness: 380, damping: 32, mass: 0.8 }}
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-2">
                    <c.icon className="size-4" />
                    {c.industry}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Panel del caso activo: dossier de la industria + el producto en acción */}
        <div className="mx-auto mt-12 max-w-6xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIdx}
              id="use-case-panel"
              role="tabpanel"
              aria-label={activeCase.industry}
              variants={swapContainer}
              initial="hidden"
              animate="visible"
              exit={{
                opacity: 0,
                y: -14,
                transition: { duration: 0.18, ease: "easeOut" },
              }}
              className="grid items-stretch gap-6 lg:grid-cols-2"
            >
              {/* Dossier: dolor (coral), datos que captura y resultado */}
              <TiltCard className="h-full rounded-[2.5rem]">
                <article className="flex h-full flex-col rounded-[2.5rem] border border-[#522566]/8 bg-white p-9 shadow-xl shadow-[#522566]/5 sm:p-10">
                  <motion.div
                    variants={swapItem}
                    className="flex items-center gap-4"
                  >
                    <span className="grid size-14 shrink-0 place-items-center rounded-[1.1rem] bg-gradient-to-br from-[#522566] to-[#3D1A4E] shadow-lg shadow-[#522566]/25">
                      <activeCase.icon className="size-6 text-[#AD74C3]" />
                    </span>
                    <h3 className="text-2xl font-semibold tracking-tight text-[#111827]">
                      {activeCase.industry}
                    </h3>
                  </motion.div>

                  <motion.p
                    variants={swapItem}
                    className="mt-5 text-[15px] leading-relaxed text-[#111827]/60"
                  >
                    {activeCase.description}
                  </motion.p>

                  <motion.div
                    variants={swapItem}
                    className="mt-6 rounded-2xl bg-[#FB7185]/8 p-4 ring-1 ring-[#FB7185]/15"
                  >
                    <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-[#FB7185]">
                      <TrendingDown aria-hidden className="size-3.5" />
                      El dolor que resuelve
                    </p>
                    <p className="mt-1.5 text-sm leading-relaxed text-[#111827]/70">
                      {activeCase.pain}
                    </p>
                  </motion.div>

                  <motion.div variants={swapItem} className="mt-6">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-[#AD74C3]">
                      Captura en cada conversación
                    </p>
                    <div className="mt-2.5 flex flex-wrap gap-2">
                      {activeCase.fields.map((field) => (
                        <span
                          key={field}
                          className="rounded-full bg-[#F8EDFB] px-3.5 py-1.5 text-xs font-medium text-[#522566] ring-1 ring-[#522566]/10"
                        >
                          {field}
                        </span>
                      ))}
                    </div>
                  </motion.div>

                  <motion.p
                    variants={swapItem}
                    className="mt-auto inline-flex items-center gap-2 pt-7 text-sm font-medium text-[#522566]"
                  >
                    <span className="size-2 rounded-full bg-[#34D399]" />
                    {activeCase.highlight}
                  </motion.p>
                </article>
              </TiltCard>

              {/* El producto en acción: conversación de la industria que
                  termina en un lead con Score NEX calificado */}
              <TiltCard className="h-full rounded-[2.5rem]">
                <div className="flex h-full flex-col rounded-[2.5rem] bg-gradient-to-b from-[#AD74C3]/45 via-white/15 to-[#34D399]/40 p-px shadow-2xl shadow-[#522566]/25">
                  <div className="flex h-full flex-col overflow-hidden rounded-[calc(2.5rem-1px)] bg-[#3D1A4E]">
                    <motion.div
                      variants={swapItem}
                      className="relative flex items-center gap-3 bg-[linear-gradient(180deg,#522566_0%,#3D1A4E_100%)] px-5 py-4"
                    >
                      <span
                        aria-hidden
                        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent"
                      />
                      <span className="relative grid size-9 shrink-0 place-items-center rounded-full bg-gradient-to-br from-[#AD74C3] to-[#522566] ring-2 ring-white/15">
                        <Sparkles className="size-4 text-white" />
                        <span className="absolute -bottom-0.5 -right-0.5 size-2.5 rounded-full border-2 border-[#3D1A4E] bg-[#34D399]" />
                      </span>
                      <div>
                        <p className="text-[13px] font-semibold text-white">
                          {activeCase.industry}
                        </p>
                        <p className="text-[11px] text-[#AD74C3]">
                          Asistente Nexus · en línea
                        </p>
                      </div>
                    </motion.div>

                    <div className="relative flex flex-1 flex-col justify-center gap-3 px-5 py-6">
                      <div
                        aria-hidden
                        className="pointer-events-none absolute inset-0 opacity-[0.12]"
                        style={{
                          backgroundImage:
                            "linear-gradient(rgba(173,116,195,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(173,116,195,0.5) 1px, transparent 1px)",
                          backgroundSize: "34px 34px",
                          maskImage:
                            "linear-gradient(to bottom, transparent, black 20%, black 80%, transparent)",
                        }}
                      />
                      <motion.div
                        variants={swapItem}
                        className="relative max-w-[85%] self-end rounded-[18px] rounded-br-[5px] bg-white/10 px-4 py-2.5 text-[13px] leading-relaxed text-white ring-1 ring-white/10"
                      >
                        {activeCase.question}
                      </motion.div>
                      <motion.div
                        variants={swapItem}
                        className="relative flex max-w-[90%] items-end gap-2 self-start"
                      >
                        <span className="grid size-6 shrink-0 place-items-center rounded-full bg-gradient-to-br from-[#522566] to-[#AD74C3] shadow-sm">
                          <Sparkles aria-hidden className="size-3 text-white" />
                        </span>
                        <div className="rounded-[18px] rounded-bl-[5px] bg-white px-4 py-2.5 text-[13px] leading-relaxed text-[#111827] shadow-[0_12px_32px_-18px_rgba(61,26,78,0.6)]">
                          {activeCase.answer}
                        </div>
                      </motion.div>
                    </div>

                    <motion.div variants={swapItem} className="px-4 pb-4">
                      <div className="relative overflow-hidden rounded-2xl bg-[#111827]/40 p-4 ring-1 ring-white/10 backdrop-blur-xl">
                        <span
                          aria-hidden
                          className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#34D399]/70 to-transparent"
                        />
                        <div className="flex items-center justify-between gap-3">
                          <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-white/60">
                            <Zap aria-hidden className="size-3 text-[#34D399]" />
                            Score NEX
                          </span>
                          <span className="rounded-full bg-[#34D399]/15 px-2 py-0.5 text-[11px] font-medium text-[#34D399] ring-1 ring-[#34D399]/25">
                            Calificado
                          </span>
                        </div>
                        <p className="mt-2 truncate text-sm font-semibold text-white">
                          {activeCase.lead}
                        </p>
                        <ScoreMeter score={activeCase.score} className="mt-3" />
                      </div>
                    </motion.div>
                  </div>
                </div>
              </TiltCard>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
