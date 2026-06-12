import { Quote, Star, TrendingUp } from "lucide-react";
import { SectionHeading } from "./section-heading";

/* Placeholders — se reemplazarán por casos de éxito reales (LP-06). */
const TESTIMONIALS = [
  {
    quote:
      "Pasamos de responder consultas a las 10 de la noche a despertar con leads calificados en la bandeja. Cambió nuestra operación por completo.",
    name: "María G.",
    role: "Directora Comercial · Inmobiliaria",
    initials: "MG",
    result: "+62 leads calificados el primer mes",
  },
  {
    quote:
      "Lo instalamos un viernes por la tarde. El lunes ya teníamos 14 leads con score y resumen. El equipo de ventas no lo podía creer.",
    name: "Carlos R.",
    role: "Fundador · Clínica dental",
    initials: "CR",
    result: "14 leads el primer fin de semana",
  },
  {
    quote:
      "El bot responde con nuestro tono y nuestros precios reales. Los aspirantes creen que hablan con un asesor de admisiones.",
    name: "Lucía F.",
    role: "Coordinadora · Instituto educativo",
    initials: "LF",
    result: "Tono y precios 100% propios",
  },
  {
    quote:
      "Antes perdíamos las consultas del fin de semana. Ahora el lunes llegan ordenadas, calificadas y con teléfono de contacto.",
    name: "Andrés M.",
    role: "Gerente · Servicios industriales",
    initials: "AM",
    result: "0 consultas perdidas desde el día uno",
  },
  {
    quote:
      "La demo nos convenció en cinco minutos. La integración con nuestro CRM, en una tarde. Hoy es nuestro mejor canal de captación.",
    name: "Paula S.",
    role: "Head of Growth · E-commerce",
    initials: "PS",
    result: "CRM integrado en una tarde",
  },
];

/* Listas de los carriles calculadas una sola vez: identidad estable
   entre renders (evita reordenar "el mismo set" de hijos en caliente) */
const MARQUEE_ROW = [...TESTIMONIALS, ...TESTIMONIALS];
const MARQUEE_ROW_REVERSE = [...MARQUEE_ROW].reverse();

function TestimonialCard({
  t,
}: {
  t: (typeof TESTIMONIALS)[number];
}) {
  return (
    <figure className="w-80 shrink-0 rounded-[1.5rem] bg-gradient-to-b from-nexus-purple/12 via-nexus-lavender/8 to-nexus-purple/5 p-px shadow-sm shadow-nexus-purple/5 transition-shadow duration-300 hover:shadow-lg hover:shadow-nexus-purple/10 sm:w-[24rem]">
      <div className="flex h-full flex-col rounded-[calc(1.5rem-1px)] bg-white p-6">
        <div className="flex items-center justify-between">
          <Quote aria-hidden className="size-5 text-nexus-lavender" />
          <div className="flex gap-0.5" role="img" aria-label="5 de 5 estrellas">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                aria-hidden
                className="size-3 fill-nexus-mint text-nexus-mint"
              />
            ))}
          </div>
        </div>
        <blockquote className="mt-3 flex-1 text-sm leading-relaxed text-nexus-ink/75">
          “{t.quote}”
        </blockquote>
        <p className="mt-4 inline-flex w-fit items-center gap-1.5 rounded-full bg-nexus-mint/10 px-2.5 py-1 text-[11px] font-medium text-nexus-ink/70 ring-1 ring-nexus-mint/20">
          <TrendingUp aria-hidden className="size-3 text-nexus-mint" />
          {t.result}
        </p>
        <figcaption className="mt-4 flex items-center gap-2.5 border-t border-nexus-purple/8 pt-4">
          <span className="grid size-9 shrink-0 place-items-center rounded-full bg-gradient-to-br from-nexus-purple to-nexus-lavender text-[11px] font-semibold text-white ring-2 ring-nexus-lilac">
            {t.initials}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[13px] font-semibold leading-tight text-nexus-ink">
              {t.name}
            </p>
            <p className="truncate text-[11px] text-nexus-ink/50">{t.role}</p>
          </div>
        </figcaption>
      </div>
    </figure>
  );
}

export function Testimonials() {
  return (
    <section className="overflow-hidden bg-nexus-lilac py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading
          eyebrow="Casos de éxito"
          title="Equipos que ya no pierden leads"
          subtitle="Historias de ejemplo de los primeros pilotos. Pronto, la tuya."
        />
      </div>

      {/* Doble marquee en contraflujo; ambos se pausan al pasar el cursor */}
      <div className="group relative mt-12">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-nexus-lilac to-transparent"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-nexus-lilac to-transparent"
        />
        <div className="flex w-max gap-5 motion-safe:animate-marquee group-hover:[animation-play-state:paused]">
          {MARQUEE_ROW.map((t, i) => (
            <TestimonialCard key={`${t.name}-${i}`} t={t} />
          ))}
        </div>
        {/* Carril inverso: mismo contenido, solo decorativo para el lector */}
        <div
          aria-hidden
          className="mt-5 flex w-max gap-5 [animation-direction:reverse] [animation-duration:52s] motion-safe:animate-marquee group-hover:[animation-play-state:paused]"
        >
          {MARQUEE_ROW_REVERSE.map((t, i) => (
            <TestimonialCard key={`reverse-${t.name}-${i}`} t={t} />
          ))}
        </div>
      </div>
    </section>
  );
}
