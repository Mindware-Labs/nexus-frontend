'use client'

import { motion, useScroll, useTransform } from 'motion/react'
import { useRef } from 'react'
import { Button } from '@/components/ui/button'
import { EASE } from './anim'

export function CtaSection() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })
  const headlineY = useTransform(scrollYProgress, [0, 1], [60, -60])
  const glowScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1.1, 0.8])

  return (
    <section
      ref={ref}
      className="relative overflow-hidden px-6 py-40 text-center md:py-56"
    >
      <motion.div
        aria-hidden
        style={{ scale: glowScale }}
        className="pointer-events-none absolute top-1/2 left-1/2 h-[560px] w-[560px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(124,58,237,0.28),transparent)] blur-3xl"
      />

      <motion.div
        style={{ y: headlineY }}
        className="relative mx-auto max-w-4xl"
      >
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.9, ease: EASE }}
          className="font-[family-name:var(--font-general-sans)] text-5xl leading-[1.02] font-normal tracking-[-0.02em] text-foreground md:text-8xl"
        >
          Tu próximo cliente
          <br />
          ya está <span className="text-gradient-aurora">escribiendo</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.8, delay: 0.15, ease: EASE }}
          className="mx-auto mt-7 max-w-md text-lg leading-8 text-foreground/60"
        >
          Deja que Nexus responda, califique y convierta mientras tú haces
          crecer tu negocio.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.8, delay: 0.3, ease: EASE }}
          className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <Button
            asChild
            className="h-auto rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 px-8 py-4 text-base font-semibold text-white shadow-lg shadow-purple-500/30 transition-transform duration-200 hover:scale-[1.03] active:scale-[0.98]"
          >
            <a href="/login">Empieza gratis</a>
          </Button>
          <Button
            asChild
            variant="heroSecondary"
            className="h-auto px-8 py-4 text-base"
          >
            <a href="#planes">Ver planes</a>
          </Button>
        </motion.div>
      </motion.div>
    </section>
  )
}
