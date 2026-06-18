'use client'

import { Check } from 'lucide-react'
import { Reveal } from './anim'
import { SnapCarousel } from './snap-carousel'

/* Límites alineados con el backend (PLAN_LIMITS): trial 100 · starter 1.000 ·
   pro 5.000 · enterprise ilimitado. Los precios son orientativos. */
const PLANS = [
  {
    name: 'Trial',
    price: 'Gratis',
    period: '14 días',
    tagline: 'Para probarlo sin compromiso.',
    messages: '100 mensajes',
    features: ['Asistente con IA', 'Captura de leads', 'Panel básico'],
    featured: false,
  },
  {
    name: 'Starter',
    price: '€29',
    period: '/mes',
    tagline: 'Para pequeños negocios que arrancan.',
    messages: '1.000 mensajes / mes',
    features: [
      'Entrenamiento con tus contenidos',
      'Calificación de leads',
      'Resúmenes por correo',
    ],
    featured: false,
  },
  {
    name: 'Pro',
    price: '€89',
    period: '/mes',
    tagline: 'Para equipos en pleno crecimiento.',
    messages: '5.000 mensajes / mes',
    features: [
      'Todo lo de Starter',
      'Analíticas avanzadas',
      'Conversaciones ilimitadas en historial',
      'Soporte prioritario',
    ],
    featured: true,
  },
  {
    name: 'Enterprise',
    price: 'A medida',
    period: '',
    tagline: 'Para grandes operaciones y multi-marca.',
    messages: 'Mensajes ilimitados',
    features: [
      'Multi-tenant y roles',
      '2FA y seguridad reforzada',
      'Integraciones a medida',
      'Acompañamiento dedicado',
    ],
    featured: false,
  },
]

export function PricingSection() {
  return (
    <section id="planes" className="relative py-28 md:py-40">
      <Reveal className="mx-auto mb-14 max-w-3xl px-6 text-center">
        <p className="text-sm font-medium tracking-[0.2em] text-foreground/40 uppercase">
          Planes
        </p>
        <h2 className="mt-5 font-[family-name:var(--font-general-sans)] text-4xl leading-[1.05] font-normal tracking-[-0.02em] text-foreground md:text-6xl">
          Empieza gratis,{' '}
          <span className="text-gradient-aurora">crece sin límites</span>
        </h2>
        <p className="mx-auto mt-6 max-w-md text-lg leading-8 text-foreground/55">
          Sin permanencia. Cambia de plan cuando lo necesites. Arrastra para ver
          todas las opciones.
        </p>
      </Reveal>

      <SnapCarousel label="Planes de precios">
        {PLANS.map((plan) => (
          <div
            key={plan.name}
            className={[
              'flex w-[85vw] shrink-0 snap-center flex-col rounded-[28px] p-8 select-none sm:w-[24rem] md:p-10',
              plan.featured
                ? 'liquid-glass bg-gradient-to-b from-purple-500/[0.12] to-transparent ring-1 ring-purple-400/30'
                : 'liquid-glass',
            ].join(' ')}
          >
            <div className="flex items-center justify-between">
              <h3 className="font-[family-name:var(--font-general-sans)] text-xl font-semibold text-foreground">
                {plan.name}
              </h3>
              {plan.featured && (
                <span className="rounded-full bg-gradient-to-r from-indigo-500/30 to-purple-500/30 px-3 py-1 text-xs font-semibold text-foreground">
                  Más elegido
                </span>
              )}
            </div>

            <p className="mt-2 text-sm text-foreground/55">{plan.tagline}</p>

            <div className="mt-8 flex items-end gap-1">
              <span className="font-[family-name:var(--font-general-sans)] text-5xl font-semibold text-foreground">
                {plan.price}
              </span>
              {plan.period && (
                <span className="pb-1.5 text-sm text-foreground/50">
                  {plan.period}
                </span>
              )}
            </div>

            <p className="mt-5 text-sm font-medium text-foreground/80">
              {plan.messages}
            </p>

            <ul className="mt-6 flex flex-1 flex-col gap-3">
              {plan.features.map((f) => (
                <li
                  key={f}
                  className="flex items-start gap-3 text-sm text-foreground/70"
                >
                  <Check className="mt-0.5 size-4 shrink-0 text-purple-300" />
                  {f}
                </li>
              ))}
            </ul>

            <a
              href="/login"
              className={[
                'mt-9 grid h-12 place-items-center rounded-full text-sm font-semibold transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98]',
                plan.featured
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg shadow-purple-500/30'
                  : 'liquid-glass text-foreground hover:bg-white/[0.05]',
              ].join(' ')}
            >
              {plan.price === 'A medida' ? 'Hablemos' : 'Empezar'}
            </a>
          </div>
        ))}
      </SnapCarousel>
    </section>
  )
}
