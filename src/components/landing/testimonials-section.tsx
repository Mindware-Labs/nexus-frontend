'use client'

import { Reveal } from './anim'
import { SnapCarousel } from './snap-carousel'

const TESTIMONIALS = [
  {
    quote:
      'Pasamos de responder en horas a responder en segundos. Los leads llegan calificados y mi equipo solo se dedica a cerrar.',
    name: 'Lucía Fernández',
    role: 'Directora Comercial',
    company: 'Vortex',
  },
  {
    quote:
      'Lo instalamos un martes por la tarde. El miércoles ya teníamos la primera reunión agendada por el asistente.',
    name: 'Marc Oliveras',
    role: 'Fundador',
    company: 'Nimbus',
  },
  {
    quote:
      'Lo mejor no es que responda, es que entiende. Sabe cuándo alguien está listo para comprar y nos lo dice.',
    name: 'Daniela Ríos',
    role: 'Head of Growth',
    company: 'Prysma',
  },
  {
    quote:
      'Dejamos de perder consultas a las 3 de la mañana. Ahora cada visita nocturna se convierte en una oportunidad.',
    name: 'Iván Castro',
    role: 'CEO',
    company: 'Cirrus',
  },
  {
    quote:
      'El resumen diario por correo cambió nuestras mañanas. Sé exactamente con quién hablar antes de abrir el portátil.',
    name: 'Sara Méndez',
    role: 'Responsable de Ventas',
    company: 'Kynder',
  },
]

export function TestimonialsSection() {
  return (
    <section id="historias" className="relative py-28 md:py-40">
      <Reveal className="mx-auto mb-14 max-w-3xl px-6 text-center">
        <p className="text-sm font-medium tracking-[0.2em] text-foreground/40 uppercase">
          Historias reales
        </p>
        <h2 className="mt-5 font-[family-name:var(--font-general-sans)] text-4xl leading-[1.05] font-normal tracking-[-0.02em] text-foreground md:text-6xl">
          Equipos que ya{' '}
          <span className="text-gradient-aurora">dejaron de perder</span>{' '}
          oportunidades
        </h2>
      </Reveal>

      <SnapCarousel label="Testimonios de clientes">
        {TESTIMONIALS.map((t, i) => (
          <figure
            key={t.name}
            className="liquid-glass flex w-[85vw] shrink-0 snap-center flex-col justify-between rounded-[28px] p-8 select-none sm:w-[28rem] md:p-10"
          >
            <span
              aria-hidden
              className="text-gradient-aurora font-[family-name:var(--font-general-sans)] text-6xl leading-none font-semibold"
            >
              {String(i + 1).padStart(2, '0')}
            </span>
            <blockquote className="mt-6 text-xl leading-8 font-medium text-foreground/90 md:text-2xl">
              “{t.quote}”
            </blockquote>
            <figcaption className="mt-8 flex items-center gap-3">
              <span className="liquid-glass grid size-11 place-items-center rounded-full text-sm font-semibold text-foreground">
                {t.name[0]}
              </span>
              <span className="text-sm">
                <span className="block font-semibold text-foreground">
                  {t.name}
                </span>
                <span className="block text-foreground/50">
                  {t.role} · {t.company}
                </span>
              </span>
            </figcaption>
          </figure>
        ))}
      </SnapCarousel>
    </section>
  )
}
