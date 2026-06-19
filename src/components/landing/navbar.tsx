'use client'

import Link from 'next/link'
import { useRef, useState } from 'react'
import { motion, useMotionValueEvent, useScroll } from 'motion/react'

export function Navbar() {
  const { scrollY } = useScroll()
  const prevRef = useRef(0)
  const [scrolled, setScrolled] = useState(false)
  const [hidden, setHidden] = useState(false)

  useMotionValueEvent(scrollY, 'change', (latest) => {
    const nextScrolled = latest > 24
    const nextHidden = latest > prevRef.current && latest > 180

    setScrolled((current) => (current === nextScrolled ? current : nextScrolled))
    setHidden((current) => (current === nextHidden ? current : nextHidden))
    prevRef.current = latest
  })

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault()
    const target = document.querySelector(targetId)
    if (!target) return

    // Offset para que la navbar fija no tape el inicio de la sección
    const offset = 80
    const targetY = target.getBoundingClientRect().top + window.scrollY - offset

    // Si estamos arriba del todo (en el Hero) y la sección NO es Flujo
    if (window.scrollY < 50 && targetId !== '#how-it-works') {
      const firstSection = document.querySelector('#how-it-works') as HTMLElement
      // Ocultamos Flujo para que al terminar el Hero se vea el fondo negro,
      // dando la ilusión de que la sección objetivo está justo detrás.
      if (firstSection) firstSection.style.opacity = '0'

      // Hacemos que pase la animación del Hero bajando suavemente 100vh
      window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })

      const checkScroll = () => {
        // Tolerancia de 2px por posibles problemas de redondeo en algunas pantallas
        if (window.scrollY >= window.innerHeight - 2) {
          window.removeEventListener('scroll', checkScroll)
          // Saltamos instantáneamente a la sección que el usuario quería
          window.scrollTo({ top: targetY, behavior: 'auto' })
          if (firstSection) firstSection.style.opacity = '1'
        }
      }
      window.addEventListener('scroll', checkScroll)
      
      // Fallback de seguridad por si el smooth scroll es interrumpido
      setTimeout(() => {
        window.removeEventListener('scroll', checkScroll)
        if (firstSection) firstSection.style.opacity = '1'
        // Solo saltamos si no hemos llegado
        if (Math.abs(window.scrollY - targetY) > 10) {
           window.scrollTo({ top: targetY, behavior: 'auto' })
        }
      }, 1200)
    } else {
      // Comportamiento normal (bajada suave directa)
      window.scrollTo({ top: targetY, behavior: 'smooth' })
    }
  }

  return (
    <motion.nav
      animate={{ y: hidden ? -96 : 0 }}
      transition={{ duration: 0.28, ease: [0.23, 1, 0.32, 1] }}
      className="fixed top-0 z-50 w-full px-4 pt-4"
    >
      <div
        className={`mx-auto flex max-w-7xl items-center justify-between rounded-full border px-4 py-3 transition-all duration-300 sm:px-6 ${
          scrolled
            ? 'border-white/10 bg-black/70 shadow-[0_12px_50px_rgba(0,0,0,0.35)] backdrop-blur-2xl'
            : 'border-white/6 bg-black/25 backdrop-blur-xl'
        }`}
      >
        <Link href="/" className="text-sm font-semibold tracking-[0.22em] text-white uppercase">
          Nexus
        </Link>

        <div className="hidden items-center gap-7 text-sm text-white/60 md:flex">
          <a href="#how-it-works" onClick={(e) => handleNavClick(e, '#how-it-works')} className="transition-colors hover:text-white">Flujo</a>
          <a href="#use-cases" onClick={(e) => handleNavClick(e, '#use-cases')} className="transition-colors hover:text-white">Industrias</a>
          <a href="#knowledge-base" onClick={(e) => handleNavClick(e, '#knowledge-base')} className="transition-colors hover:text-white">Base de Conocimiento</a>
          <a href="#lead-scoring" onClick={(e) => handleNavClick(e, '#lead-scoring')} className="transition-colors hover:text-white">Lead Scoring</a>
          <a href="#pricing" onClick={(e) => handleNavClick(e, '#pricing')} className="transition-colors hover:text-white">Planes</a>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="hidden text-sm font-medium text-white/65 transition-colors hover:text-white md:block"
          >
            Iniciar sesion
          </Link>
          <a
            href="#demo"
            onClick={(e) => handleNavClick(e, '#demo')}
            className="rounded-full bg-white px-4 py-2 text-xs font-semibold tracking-[0.18em] text-black uppercase transition-transform duration-200 hover:scale-[1.03] active:scale-[0.97] sm:px-5"
          >
            Ver demo
          </a>
        </div>
      </div>
    </motion.nav>
  )
}
