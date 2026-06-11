import { Quote, Star } from "lucide-react";
import { SectionHeading } from "./section-heading";

/* Placeholders — se reemplazarán por casos de éxito reales (LP-06). */
const TESTIMONIALS = [
  {
    quote:
      "Pasamos de responder consultas a las 10 de la noche a despertar con leads calificados en la bandeja. Cambió nuestra operación por completo.",
    name: "María G.",
    role: "Directora Comercial · Inmobiliaria",
    initials: "MG",
  },
  {
    quote:
      "Lo instalamos un viernes por la tarde. El lunes ya teníamos 14 leads con score y resumen. El equipo de ventas no lo podía creer.",
    name: "Carlos R.",
    role: "Fundador · Clínica dental",
    initials: "CR",
  },
  {
    quote:
      "El bot responde con nuestro tono y nuestros precios reales. Los aspirantes creen que hablan con un asesor de admisiones.",
    name: "Lucía F.",
    role: "Coordinadora · Instituto educativo",
    initials: "LF",
  },
  {
    quote:
      "Antes perdíamos las consultas del fin de semana. Ahora el lunes llegan ordenadas, calificadas y con teléfono de contacto.",
    name: "Andrés M.",
    role: "Gerente · Servicios industriales",
    initials: "AM",
  },
  {
    quote:
      "La demo nos convenció en cinco minutos. La integración con nuestro CRM, en una tarde. Hoy es nuestro mejor canal de captación.",
    name: "Paula S.",
    role: "Head of Growth · E-commerce",
    initials: "PS",
  },
];

function TestimonialCard({
  t,
}: {
  t: (typeof TESTIMONIALS)[number];
}) {
  return (
    <figure className="flex w-[22rem] shrink-0 flex-col rounded-3xl border border-nexus-purple/8 bg-white p-7 shadow-sm shadow-nexus-purple/5 sm:w-[26rem]">
      <Quote aria-hidden className="size-6 text-nexus-lavender" />
      <blockquote className="mt-4 flex-1 text-[15px] leading-relaxed text-nexus-ink/75">
        “{t.quote}”
      </blockquote>
      <figcaption className="mt-6 flex items-center gap-3">
        <span className="grid size-10 place-items-center rounded-full bg-gradient-to-br from-nexus-purple to-nexus-lavender text-xs font-semibold text-white">
          {t.initials}
        </span>
        <div className="flex-1">
          <p className="text-sm font-semibold text-nexus-ink">{t.name}</p>
          <p className="text-xs text-nexus-ink/50">{t.role}</p>
        </div>
        <div className="flex gap-0.5" role="img" aria-label="5 de 5 estrellas">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              aria-hidden
              className="size-3.5 fill-nexus-mint text-nexus-mint"
            />
          ))}
        </div>
      </figcaption>
    </figure>
  );
}

export function Testimonials() {
  return (
    <section className="overflow-hidden bg-nexus-lilac py-28 sm:py-36">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading
          eyebrow="Casos de éxito"
          title="Equipos que ya no pierden leads"
          subtitle="Historias de ejemplo de los primeros pilotos. Pronto, la tuya."
        />
      </div>

      {/* Marquee infinito; se pausa al pasar el cursor */}
      <div className="group relative mt-16">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-nexus-lilac to-transparent"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-nexus-lilac to-transparent"
        />
        <div className="flex w-max gap-6 motion-safe:animate-marquee group-hover:[animation-play-state:paused]">
          {[...TESTIMONIALS, ...TESTIMONIALS].map((t, i) => (
            <TestimonialCard key={`${t.name}-${i}`} t={t} />
          ))}
        </div>
      </div>
    </section>
  );
}
