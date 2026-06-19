'use client'

import { motion, useScroll, useTransform } from 'motion/react'
import { useRef } from 'react'
import { Counter, Reveal } from './anim'

const STATS = [
  { value: 24, suffix: '/7', label: 'atencion automatica del agente en la web del cliente' },
  { value: 2, label: 'roles operativos dentro de la plataforma' },
  { value: 1, label: 'widget embebible conectado por HTTPS y SSE' },
  { value: 6, label: 'industrias objetivo definidas en el documento maestro' },
]

export function StatsSection() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })
  const glowY = useTransform(scrollYProgress, [0, 1], ['-20%', '20%'])

  return (
    <section ref={ref} className="relative overflow-hidden border-t border-white/5 bg-[#030303] py-28 md:py-40">
      
      {/* Background Data Lines */}
      <div className="pointer-events-none absolute inset-0 z-0 opacity-20">
        <div className="absolute inset-0 bg-[repeating-linear-gradient(to_bottom,transparent,transparent_40px,rgba(255,255,255,0.05)_40px,rgba(255,255,255,0.05)_41px)]" />
        <motion.div
          animate={{ y: [0, 41] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-0 bg-[repeating-linear-gradient(to_bottom,transparent,transparent_40px,rgba(173,116,195,0.3)_40px,rgba(173,116,195,0.3)_41px)] [mask-image:linear-gradient(to_bottom,transparent_0%,black_50%,transparent_100%)]"
        />
      </div>

      <motion.div
        aria-hidden
        style={{ y: glowY }}
        className="pointer-events-none absolute top-1/2 left-1/2 z-0 h-[420px] w-[820px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(124,58,237,0.18),transparent)] blur-2xl"
      />

      <div className="relative z-10 mx-auto max-w-6xl px-6">
        <Reveal className="mx-auto mb-16 max-w-2xl text-center">
          <p className="text-sm font-medium tracking-[0.22em] text-white/36 uppercase">Alcance real</p>
          <h2 className="mt-5 font-[family-name:var(--font-general-sans)] text-3xl leading-tight font-normal tracking-[-0.02em] text-white md:text-5xl">
            El producto ya tiene un{' '}
            <span className="text-gradient-aurora">contorno claro</span>
          </h2>
          <p className="mt-5 text-base leading-7 text-gray-400 md:text-lg">
            Esta landing resume datos concretos del producto y de la arquitectura del MVP, sin cifras de marketing inventadas.
          </p>
        </Reveal>

        <div className="grid grid-cols-2 gap-y-14 md:grid-cols-4 md:divide-x md:divide-white/10">
          {STATS.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.08} className="px-4 text-center md:px-8">
              <div className="font-[family-name:var(--font-general-sans)] text-5xl font-semibold text-white md:text-6xl">
                <Counter to={s.value} suffix={s.suffix ?? ''} />
              </div>
              <p className="mx-auto mt-4 max-w-[14rem] text-sm leading-6 text-gray-400">
                {s.label}
              </p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
