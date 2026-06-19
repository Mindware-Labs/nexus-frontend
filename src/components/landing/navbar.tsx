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
          <a href="#how-it-works" className="transition-colors hover:text-white">Flujo</a>
          <a href="#plataforma" className="transition-colors hover:text-white">Plataforma</a>
          <a href="#use-cases" className="transition-colors hover:text-white">Industrias</a>
          <a href="#demo" className="transition-colors hover:text-white">Demo</a>
          <a href="#pricing" className="transition-colors hover:text-white">Superficies</a>
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
            className="rounded-full bg-white px-4 py-2 text-xs font-semibold tracking-[0.18em] text-black uppercase transition-transform duration-200 hover:scale-[1.03] active:scale-[0.97] sm:px-5"
          >
            Ver demo
          </a>
        </div>
      </div>
    </motion.nav>
  )
}
