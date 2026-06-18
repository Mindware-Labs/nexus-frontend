'use client'

import { motion, useScroll, useTransform } from 'motion/react'
import { useRef } from 'react'
import { Counter, Reveal } from './anim'

const STATS = [
  { value: 3, suffix: '×', label: 'más conversaciones convertidas en leads' },
  { value: 92, suffix: '%', label: 'de consultas resueltas sin intervención' },
  { value: 5, prefix: '<', suffix: ' min', label: 'para dejarlo funcionando' },
  { value: 24, suffix: '/7', label: 'atendiendo, sin descanso ni festivos' },
]

export function StatsSection() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })
  const glowY = useTransform(scrollYProgress, [0, 1], ['-20%', '20%'])

  return (
    <section ref={ref} className="relative overflow-hidden py-28 md:py-40">
      {/* Resplandor que deriva en paralaje */}
      <motion.div
        aria-hidden
        style={{ y: glowY }}
        className="pointer-events-none absolute top-1/2 left-1/2 h-[420px] w-[820px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(124,58,237,0.18),transparent)] blur-2xl"
      />

      <div className="relative mx-auto max-w-6xl px-6">
        <Reveal className="mx-auto mb-16 max-w-xl text-center">
          <h2 className="font-[family-name:var(--font-general-sans)] text-3xl leading-tight font-normal tracking-[-0.02em] text-foreground md:text-5xl">
            Los números hablan{' '}
            <span className="text-gradient-aurora">por sí solos</span>
          </h2>
        </Reveal>

        <div className="grid grid-cols-2 gap-y-14 md:grid-cols-4 md:divide-x md:divide-foreground/10">
          {STATS.map((s, i) => (
            <Reveal
              key={s.label}
              delay={i * 0.08}
              className="px-4 text-center md:px-8"
            >
              <div className="font-[family-name:var(--font-general-sans)] text-5xl font-semibold text-foreground md:text-6xl">
                <Counter
                  to={s.value}
                  prefix={s.prefix ?? ''}
                  suffix={s.suffix ?? ''}
                />
              </div>
              <p className="mx-auto mt-4 max-w-[12rem] text-sm leading-6 text-foreground/55">
                {s.label}
              </p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
