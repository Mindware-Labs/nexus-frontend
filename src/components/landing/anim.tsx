'use client'

import {
  animate,
  motion,
  useInView,
  useReducedMotion,
  useScroll,
  useSpring,
} from 'motion/react'
import { useEffect, useRef, type ReactNode } from 'react'

/* Curva de easing de la landing (ease-out expresivo, estilo "lax"). */
export const EASE = [0.16, 1, 0.3, 1] as const

/* Entrada fade-up al entrar en viewport. Respeta prefers-reduced-motion
   (sin desplazamiento, solo opacidad). */
export function Reveal({
  children,
  delay = 0,
  y = 40,
  className,
}: {
  children: ReactNode
  delay?: number
  y?: number
  className?: string
}) {
  const reduced = useReducedMotion()
  return (
    <motion.div
      initial={{ opacity: 0, y: reduced ? 0 : y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.8, delay, ease: EASE }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

/* Contador que anima de 0 al valor objetivo cuando entra en viewport. */
export function Counter({
  to,
  decimals = 0,
  duration = 1.8,
  prefix = '',
  suffix = '',
}: {
  to: number
  decimals?: number
  duration?: number
  prefix?: string
  suffix?: string
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const reduced = useReducedMotion()

  useEffect(() => {
    const node = ref.current
    if (!node || !inView) return
    const format = (v: number) => `${prefix}${v.toFixed(decimals)}${suffix}`
    if (reduced) {
      node.textContent = format(to)
      return
    }
    const controls = animate(0, to, {
      duration,
      ease: EASE,
      onUpdate: (v) => {
        node.textContent = format(v)
      },
    })
    return () => controls.stop()
  }, [inView, to, decimals, duration, prefix, suffix, reduced])

  return (
    <span ref={ref}>
      {prefix}
      {(0).toFixed(decimals)}
      {suffix}
    </span>
  )
}

/* Barra de progreso de scroll fija en el borde superior de la página. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  })
  return (
    <motion.div
      aria-hidden
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-[60] h-0.5 origin-left bg-gradient-to-r from-indigo-500 via-purple-500 to-amber-300"
    />
  )
}
