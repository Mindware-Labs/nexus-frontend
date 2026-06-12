"use client";

import { AnimatePresence, motion, type Variants } from "motion/react";
import {
  Building2,
  GraduationCap,
  HeartPulse,
  MoreHorizontal,
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

/* Cada industria cuenta la historia completa del producto: el dolor que
   resuelve (coral), los datos que captura, métricas de resultado, una
   conversación real con quick replies y el lead calificado tal como llega
   al panel — avatar, valores capturados, resumen ejecutivo del motor NEX
   y Score (menta = "Calificado", según diseño.md). */
const cases = [
  {
    icon: Building2,
    industry: "Inmobiliarias",
    description:
      "Califica compradores por presupuesto, zona y urgencia antes de que tu asesor levante el teléfono.",
    pain: "Asesores que pierden horas con curiosos sin presupuesto real.",
    highlight: "Leads con intención real de compra",
    fields: ["Presupuesto", "Zona", "Urgencia"],
    stats: [
      { value: "3×", label: "más visitas con intención real" },
      { value: "−70%", label: "tiempo filtrando curiosos" },
    ],
    question: "¿Tienen deptos de 2 dormitorios con entrega este año?",
    answer:
      "¡Sí! Tenemos 3 proyectos con entrega 2026. ¿Buscas para vivir o para invertir?",
    quickReplies: ["Para invertir", "Para vivir"],
    lead: {
      name: "Carolina Mendoza",
      email: "carolina.m@gmail.com",
      time: "hace 2 min",
      captured: [
        { label: "Presupuesto", value: "UF 4.000–4.500" },
        { label: "Zona", value: "Ñuñoa · RM" },
        { label: "Urgencia", value: "Alta · este año" },
      ],
      summary:
        "Busca 2 dormitorios para invertir, entrega 2026. Pidió agendar visita este sábado.",
      score: 91,
    },
  },
  {
    icon: HeartPulse,
    industry: "Clínicas y salud",
    description:
      "Responde dudas sobre tratamientos y agenda valoraciones sin saturar a tu recepción.",
    pain: "Recepción colapsada y pacientes que no vuelven a llamar.",
    highlight: "Atención inmediata a pacientes",
    fields: ["Tratamiento", "Previsión", "Agenda"],
    stats: [
      { value: "+40%", label: "valoraciones agendadas" },
      { value: "24/7", label: "atención sin recepción" },
    ],
    question: "¿Cuánto cuesta una limpieza dental?",
    answer:
      "Desde $35.000 e incluye evaluación. ¿Te agendo una valoración sin costo?",
    quickReplies: ["Sí, agéndame", "¿Qué incluye?"],
    lead: {
      name: "Jorge Araya",
      email: "jorge.araya@gmail.com",
      time: "hace 5 min",
      captured: [
        { label: "Tratamiento", value: "Limpieza dental" },
        { label: "Previsión", value: "Isapre" },
        { label: "Agenda", value: "Esta semana" },
      ],
      summary:
        "Paciente nuevo, disponible jueves o viernes. Aceptó valoración sin costo.",
      score: 84,
    },
  },
  {
    icon: GraduationCap,
    industry: "Educación",
    description:
      "Orienta a aspirantes sobre programas, becas y fechas, y entrega prospectos listos a admisiones.",
    pain: "Aspirantes que se enfrían esperando respuesta de admisiones.",
    highlight: "Matrículas que no se enfrían",
    fields: ["Programa", "Beca", "Inicio"],
    stats: [
      { value: "2×", label: "prospectos para admisiones" },
      { value: "<1 min", label: "primera respuesta" },
    ],
    question: "¿Tienen becas para el diplomado de datos?",
    answer:
      "Sí, hasta 40% según tu puntaje. El próximo inicio es en agosto. ¿Te envío la malla?",
    quickReplies: ["Envíame la malla", "Requisitos de beca"],
    lead: {
      name: "Valentina Rojas",
      email: "vale.rojas@gmail.com",
      time: "hace 1 min",
      captured: [
        { label: "Programa", value: "Diplomado en Datos" },
        { label: "Beca", value: "Hasta 40%" },
        { label: "Inicio", value: "Agosto 2026" },
      ],
      summary:
        "Aspirante con puntaje para beca. Pidió malla y proceso de matrícula para agosto.",
      score: 88,
    },
  },
  {
    icon: Scale,
    industry: "Despachos legales",
    description:
      "Filtra consultas por tipo de caso y urgencia para que tus abogados solo atiendan lo que importa.",
    pain: "Horas facturables perdidas filtrando consultas sin caso.",
    highlight: "Casos pre-evaluados",
    fields: ["Tipo de caso", "Urgencia", "Contacto"],
    stats: [
      { value: "+8 h", label: "facturables a la semana" },
      { value: "100%", label: "consultas pre-evaluadas" },
    ],
    question: "Me llegó una carta de despido, ¿pueden ayudarme?",
    answer:
      "Sí, es nuestra especialidad. ¿Hace cuántos días la recibiste? Los plazos importan.",
    quickReplies: ["Hace 3 días", "Hace una semana"],
    lead: {
      name: "Rodrigo Soto",
      email: "r.soto@empresa.cl",
      time: "hace 8 min",
      captured: [
        { label: "Caso", value: "Laboral · despido" },
        { label: "Urgencia", value: "Alta · plazo legal" },
        { label: "Contacto", value: "Prefiere llamada" },
      ],
      summary:
        "Carta de despido hace 3 días: dentro de plazo de tutela. Derivar a área laboral hoy.",
      score: 86,
    },
  },
  {
    icon: ShoppingBag,
    industry: "E-commerce y retail",
    description:
      "Resuelve dudas de producto, stock y envíos en el momento exacto de la decisión de compra.",
    pain: "Carritos abandonados por dudas que nadie respondió a tiempo.",
    highlight: "Menos carritos abandonados",
    fields: ["Producto", "Stock", "Envío"],
    stats: [
      { value: "−35%", label: "carritos abandonados" },
      { value: "24/7", label: "dudas resueltas al momento" },
    ],
    question: "¿Este modelo tiene stock en talla M?",
    answer:
      "¡Quedan 4 en talla M! Si pides hoy, llega el jueves. ¿Te ayudo a cerrar la compra?",
    quickReplies: ["Sí, lo quiero", "Guía de tallas"],
    lead: {
      name: "Camila Torres",
      email: "cami.torres@gmail.com",
      time: "hace 3 min",
      captured: [
        { label: "Producto", value: "Runner Pro · talla M" },
        { label: "Stock", value: "4 unidades" },
        { label: "Envío", value: "Jueves · RM" },
      ],
      summary:
        "Lista para comprar talla M con envío el jueves. Dejó su email para el link de pago.",
      score: 79,
    },
  },
  {
    icon: Wrench,
    industry: "Servicios profesionales",
    description:
      "Cotiza, agenda y captura datos de contacto mientras tu equipo está en campo trabajando.",
    pain: "Cotizaciones que llegan tarde porque el equipo está en terreno.",
    highlight: "Tu mejor vendedor, siempre activo",
    fields: ["Servicio", "Ubicación", "Plazo"],
    stats: [
      { value: "+50%", label: "cotizaciones a tiempo" },
      { value: "0", label: "llamadas perdidas" },
    ],
    question: "¿Hacen mantención de aire acondicionado en oficinas?",
    answer:
      "Sí, atendemos empresas. ¿Cuántos equipos tienes? Te preparo la cotización hoy.",
    quickReplies: ["Son 12 equipos", "Agendar visita"],
    lead: {
      name: "Felipe Godoy",
      email: "fgodoy@empresa.cl",
      time: "hace 6 min",
      captured: [
        { label: "Servicio", value: "Mantención A/C" },
        { label: "Ubicación", value: "Providencia" },
        { label: "Plazo", value: "Este mes" },
      ],
      summary:
        "Empresa con 12 equipos pide mantención este mes. Espera cotización formal hoy.",
      score: 90,
    },
  },
];

function initialsOf(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("");
}

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
    <section id="casos-de-uso" className="bg-nexus-lilac py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading
          eyebrow="Casos de uso"
          title="Hecho para tu industria"
          subtitle="Cada negocio conversa distinto. Nexus se adapta al tono, las reglas y los datos que tu sector necesita capturar."
        />

        {/* Control segmentado tipo iOS: la píldora activa se desplaza
            magnéticamente con física spring (layoutId) */}
        <div className="mt-10 flex justify-center">
          <div
            role="tablist"
            aria-label="Industrias"
            className="relative flex w-full max-w-3xl flex-wrap items-center justify-center gap-1.5 rounded-[2rem] bg-white p-1.5 shadow-sm ring-1 ring-nexus-purple/5"
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
                    "relative flex items-center gap-2 rounded-full px-4 py-2.5 text-[13px] font-medium transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-nexus-lavender",
                    isActive
                      ? "text-white"
                      : "text-nexus-ink/60 hover:text-nexus-ink",
                  )}
                >
                  {isActive && (
                    <motion.div
                      layoutId="use-cases-pill"
                      className="absolute inset-0 rounded-full bg-nexus-purple shadow-lg shadow-nexus-purple/25"
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
        <div className="mx-auto mt-8 max-w-5xl">
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
              className="grid items-stretch gap-5 lg:grid-cols-2"
            >
              {/* Dossier: dolor (coral), datos que captura y métricas de resultado */}
              <TiltCard className="h-full rounded-[2rem]">
                <div className="h-full rounded-[2rem] bg-gradient-to-b from-nexus-purple/15 via-nexus-lavender/10 to-nexus-purple/5 p-px shadow-xl shadow-nexus-purple/5">
                  <article className="relative flex h-full flex-col overflow-hidden rounded-[calc(2rem-1px)] bg-white p-7 sm:p-8">
                    {/* Marca de agua de la industria */}
                    <activeCase.icon
                      aria-hidden
                      strokeWidth={1}
                      className="pointer-events-none absolute -right-7 -top-7 size-36 text-nexus-purple/[0.05]"
                    />

                    <motion.div
                      variants={swapItem}
                      className="flex items-center gap-3.5"
                    >
                      <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-nexus-purple to-nexus-deep shadow-lg shadow-nexus-purple/25">
                        <activeCase.icon className="size-5 text-nexus-lavender" />
                      </span>
                      <div>
                        <h3 className="text-xl font-semibold tracking-tight text-nexus-ink">
                          {activeCase.industry}
                        </h3>
                        <p className="mt-0.5 flex items-center gap-1.5 text-[13px] font-medium text-nexus-purple">
                          <span
                            aria-hidden
                            className="size-1.5 rounded-full bg-nexus-mint"
                          />
                          {activeCase.highlight}
                        </p>
                      </div>
                    </motion.div>

                    <motion.p
                      variants={swapItem}
                      className="mt-4 text-sm leading-relaxed text-nexus-ink/60"
                    >
                      {activeCase.description}
                    </motion.p>

                    <motion.div
                      variants={swapItem}
                      className="mt-5 rounded-xl bg-nexus-coral/8 p-3.5 ring-1 ring-nexus-coral/15"
                    >
                      <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-nexus-coral">
                        <TrendingDown aria-hidden className="size-3.5" />
                        El dolor que resuelve
                      </p>
                      <p className="mt-1 text-[13px] leading-relaxed text-nexus-ink/70">
                        {activeCase.pain}
                      </p>
                    </motion.div>

                    <motion.div variants={swapItem} className="mb-6 mt-5">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-nexus-lavender">
                        Captura en cada conversación
                      </p>
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {activeCase.fields.map((field) => (
                          <span
                            key={field}
                            className="rounded-full bg-nexus-lilac px-3 py-1 text-[11px] font-medium text-nexus-purple ring-1 ring-nexus-purple/10"
                          >
                            {field}
                          </span>
                        ))}
                      </div>
                    </motion.div>

                    <motion.div
                      variants={swapItem}
                      className="mt-auto border-t border-nexus-purple/10 pt-4"
                    >
                      <p className="text-[10px] font-bold uppercase tracking-widest text-nexus-lavender">
                        Resultados en el sector
                      </p>
                      <div className="mt-2.5 grid grid-cols-2 divide-x divide-nexus-purple/10">
                        {activeCase.stats.map((stat, i) => (
                          <div key={stat.label} className={cn(i === 1 && "pl-4")}>
                            <p className="text-xl font-bold tabular-nums tracking-tight text-nexus-purple">
                              {stat.value}
                            </p>
                            <p className="mt-0.5 text-[11px] leading-snug text-nexus-ink/55">
                              {stat.label}
                            </p>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  </article>
                </div>
              </TiltCard>

              {/* El producto en acción: conversación con quick replies que
                  termina en el lead tal como llega al panel del cliente */}
              <TiltCard className="h-full rounded-[2rem]">
                <div className="flex h-full flex-col rounded-[2rem] bg-gradient-to-b from-nexus-lavender/45 via-white/15 to-nexus-mint/40 p-px shadow-2xl shadow-nexus-purple/25">
                  <div className="flex h-full flex-col overflow-hidden rounded-[calc(2rem-1px)] bg-nexus-deep">
                    <motion.div
                      variants={swapItem}
                      className="relative flex items-center gap-3 bg-[linear-gradient(180deg,#522566_0%,#3D1A4E_100%)] px-4 py-3.5"
                    >
                      <span
                        aria-hidden
                        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent"
                      />
                      <span className="relative grid size-9 shrink-0 place-items-center rounded-full bg-gradient-to-br from-nexus-lavender to-nexus-purple ring-2 ring-white/15">
                        <Sparkles className="size-4 text-white" />
                        <span className="absolute -bottom-0.5 -right-0.5 size-2.5 rounded-full border-2 border-nexus-deep bg-nexus-mint" />
                      </span>
                      <div>
                        <p className="text-[13px] font-semibold text-white">
                          {activeCase.industry}
                        </p>
                        <p className="text-[11px] text-nexus-lavender">
                          Asistente Nexus · en línea
                        </p>
                      </div>
                      <MoreHorizontal
                        aria-hidden
                        className="ml-auto size-4 text-white/30"
                      />
                    </motion.div>

                    <div className="relative flex flex-1 flex-col justify-center gap-2.5 px-4 py-5">
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
                        className="relative max-w-[85%] self-end rounded-[18px] rounded-br-[5px] bg-white/10 px-3.5 py-2 text-[13px] leading-relaxed text-white ring-1 ring-white/10"
                      >
                        {activeCase.question}
                      </motion.div>
                      <motion.div
                        variants={swapItem}
                        className="relative flex max-w-[90%] items-end gap-2 self-start"
                      >
                        <span className="grid size-6 shrink-0 place-items-center rounded-full bg-gradient-to-br from-nexus-purple to-nexus-lavender shadow-sm">
                          <Sparkles aria-hidden className="size-3 text-white" />
                        </span>
                        <div className="rounded-[18px] rounded-bl-[5px] bg-white px-3.5 py-2 text-[13px] leading-relaxed text-nexus-ink shadow-[0_12px_32px_-18px_rgba(61,26,78,0.6)]">
                          {activeCase.answer}
                        </div>
                      </motion.div>
                      {/* Quick replies: las opciones que el visitante tocaría */}
                      <motion.div
                        variants={swapItem}
                        className="relative ml-8 flex flex-wrap gap-1.5"
                      >
                        {activeCase.quickReplies.map((reply) => (
                          <span
                            key={reply}
                            className="rounded-full border border-nexus-lavender/40 bg-nexus-lavender/10 px-3 py-1 text-[11px] font-medium text-nexus-lavender"
                          >
                            {reply}
                          </span>
                        ))}
                      </motion.div>
                    </div>

                    <motion.div variants={swapItem} className="px-3.5 pb-3.5">
                      <div className="relative overflow-hidden rounded-2xl bg-nexus-ink/40 p-3.5 ring-1 ring-white/10 backdrop-blur-xl">
                        <span
                          aria-hidden
                          className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-nexus-mint/70 to-transparent"
                        />
                        <div className="flex items-center justify-between gap-3">
                          <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-white/60">
                            <Zap aria-hidden className="size-3 text-nexus-mint" />
                            Lead capturado · {activeCase.lead.time}
                          </span>
                          <span className="rounded-full bg-nexus-mint/15 px-2 py-0.5 text-[11px] font-medium text-nexus-mint ring-1 ring-nexus-mint/25">
                            Calificado
                          </span>
                        </div>

                        <div className="mt-2.5 flex items-center gap-2.5">
                          <span
                            aria-hidden
                            className="grid size-8 shrink-0 place-items-center rounded-full bg-gradient-to-br from-nexus-lavender to-nexus-purple text-[10px] font-semibold text-white ring-1 ring-white/20"
                          >
                            {initialsOf(activeCase.lead.name)}
                          </span>
                          <div className="min-w-0">
                            <p className="truncate text-[13px] font-semibold leading-tight text-white">
                              {activeCase.lead.name}
                            </p>
                            <p className="truncate text-[11px] text-white/50">
                              {activeCase.lead.email}
                            </p>
                          </div>
                        </div>

                        <div className="mt-2.5 flex flex-wrap gap-1">
                          {activeCase.lead.captured.map(({ label, value }) => (
                            <span
                              key={label}
                              className="inline-flex items-center gap-1 rounded-full bg-white/8 px-2 py-0.5 text-[10px] font-medium ring-1 ring-white/10"
                            >
                              <span className="text-white/45">{label}</span>
                              <span className="text-white/85">{value}</span>
                            </span>
                          ))}
                        </div>

                        <p className="mt-2.5 border-l-2 border-nexus-lavender/60 pl-2.5 text-[11px] leading-relaxed text-white/65">
                          <span className="font-semibold text-nexus-lavender">
                            Resumen NEX ·{" "}
                          </span>
                          {activeCase.lead.summary}
                        </p>

                        <ScoreMeter
                          score={activeCase.lead.score}
                          className="mt-3"
                        />
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
