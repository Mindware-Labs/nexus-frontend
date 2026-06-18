'use client'

import { motion, useScroll, useTransform } from 'motion/react'
import { useRef } from 'react'
import { EASE, Reveal } from './anim'

const STEPS = [
  {
    n: '01',
    title: 'Instala en minutos',
    body: 'Pega una sola línea de código en tu sitio y tu asistente con IA cobra vida. Sin desarrolladores, sin fricción, sin esperar.',
  },
  {
    n: '02',
    title: 'Conversa y califica',
    body: 'Entrenado en tu negocio, responde 24/7, entiende la intención real de cada visitante y lo califica mientras conversa.',
  },
  {
    n: '03',
    title: 'Recibe leads listos',
    body: 'Los contactos calificados aterrizan en tu panel y en tu correo, con el contexto completo de la conversación y listos para vender.',
  },
]

function StepBlock({ n, title, body }: (typeof STEPS)[number]) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })
  /* La cifra grande deriva en paralaje a distinta velocidad que el texto. */
  const numberY = useTransform(scrollYProgress, [0, 1], [80, -80])
  const numberOpacity = useTransform(
    scrollYProgress,
    [0, 0.3, 0.7, 1],
    [0.15, 0.9, 0.9, 0.15],
  )

  return (
    <div ref={ref} className="relative pl-10 md:pl-16">
      {/* Punto luminoso en la línea de tiempo */}
      <span className="absolute top-3 left-0 grid size-4 -translate-x-1/2 place-items-center">
        <span className="size-2 rounded-full bg-gradient-to-br from-indigo-400 to-purple-400 shadow-[0_0_18px_4px_rgba(168,85,247,0.55)]" />
      </span>

      <motion.div
        style={{ y: numberY, opacity: numberOpacity }}
        className="text-gradient-aurora font-[family-name:var(--font-general-sans)] text-7xl leading-none font-semibold md:text-8xl"
      >
        {n}
      </motion.div>

      <Reveal className="mt-6" y={28}>
        <h3 className="font-[family-name:var(--font-general-sans)] text-2xl font-semibold text-foreground md:text-3xl">
          {title}
        </h3>
        <p className="mt-3 max-w-md text-base leading-7 text-foreground/60">
          {body}
        </p>
      </Reveal>
    </div>
  )
}

export function StepsSection() {
  return (
    <section
      id="como-funciona"
      className="relative mx-auto max-w-6xl px-6 py-32 md:py-48"
    >
      <div className="grid gap-16 md:grid-cols-[0.85fr_1fr] md:gap-24">
        <div className="md:sticky md:top-32 md:h-fit">
          <Reveal>
            <p className="text-sm font-medium tracking-[0.2em] text-foreground/40 uppercase">
              Cómo funciona
            </p>
            <h2 className="mt-5 font-[family-name:var(--font-general-sans)] text-4xl leading-[1.05] font-normal tracking-[-0.02em] text-foreground md:text-6xl">
              De visitante a{' '}
              <span className="text-gradient-aurora">cliente</span> en tres
              pasos
            </h2>
            <p className="mt-6 max-w-sm text-lg leading-8 text-foreground/55">
              Sin formularios fríos ni esperas. Una conversación que trabaja por
              ti desde el primer minuto.
            </p>
          </Reveal>
        </div>

        <div className="relative">
          {/* Línea de tiempo vertical con degradado */}
          <motion.span
            aria-hidden
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true, margin: '-120px' }}
            transition={{ duration: 1.2, ease: EASE }}
            className="absolute top-2 bottom-2 left-0 w-px origin-top bg-gradient-to-b from-indigo-500/60 via-purple-500/40 to-transparent md:left-6"
          />
          <div className="flex flex-col gap-28 md:gap-40">
            {STEPS.map((step) => (
              <StepBlock key={step.n} {...step} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
