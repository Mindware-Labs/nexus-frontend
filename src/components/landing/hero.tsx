'use client'

import Link from 'next/link'
import { useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { useReducedMotion } from 'motion/react'
import AnimatedBackground from './animated-background'

gsap.registerPlugin(ScrollTrigger)

const BADGES = [
  'Atención 24/7',
  'Nexus Database',
  'Lead scoring',
  'Fácil integración',
]

export function Hero() {
  const containerRef = useRef<HTMLElement>(null)
  const reducedMotion = useReducedMotion()

  useGSAP(() => {
    if (reducedMotion) return

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top top',
        end: '+=100%',
        scrub: 1,
        pin: true,
        pinSpacing: false,
      },
    })

    tl.to('#hero-eyebrow', { opacity: 0 }, 0)
      .to('#hero-copy', { opacity: 0 }, 0)
      .to('#hero-actions', { opacity: 0 }, 0)
      .to('#hero-badges', { opacity: 0 }, 0)
      .to(
        '#hero-title',
        {
          scale: 42,
          ease: 'none',
          duration: 1,
        },
        0.14,
      )
      .to(
        '#hero-title',
        {
          opacity: 0,
          duration: 0.2,
        },
        0.62,
      )
      .to(
        containerRef.current,
        {
          autoAlpha: 0,
          duration: 0.3,
          ease: 'power2.inOut',
        },
        0.84,
      )
  }, { scope: containerRef, dependencies: [reducedMotion] })

  return (
    <section ref={containerRef} className="relative z-20 h-screen bg-black">
      <div className="absolute inset-0 z-0">
        <AnimatedBackground />
      </div>

      <div className="relative z-10 flex h-full w-full flex-col items-center justify-center overflow-hidden px-6">
        <div
          id="hero-eyebrow"
          className="mb-8 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[11px] font-medium tracking-[0.22em] text-white/75 uppercase backdrop-blur-sm"
        >
          Mindware Nexus
        </div>

        <div id="hero-title" className="flex origin-center flex-col items-center justify-center">
          <h1 className="max-w-5xl text-center text-6xl leading-[0.88] font-semibold tracking-[-0.05em] text-white drop-shadow-2xl md:text-[7rem] lg:text-[9rem]">
            Conversaciones que
            <br />
            <span className="bg-gradient-to-r from-white via-nexus-lavender to-[#f7c46c] bg-clip-text text-transparent">
              salen a vender
            </span>
          </h1>
        </div>

        <p
          id="hero-copy"
          className="mt-8 max-w-3xl text-center text-lg leading-8 font-light text-gray-300 md:text-2xl md:leading-9"
        >
          Plataforma SaaS para captar conversaciones en la web del cliente, responder con contexto real del negocio y entregar leads listos para seguimiento comercial.
        </p>

        <div id="hero-actions" className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
          <a
            href="#demo"
            className="rounded-full bg-white px-7 py-4 text-sm font-semibold tracking-[0.18em] text-black uppercase transition-transform duration-200 hover:scale-[1.03] active:scale-[0.97]"
          >
            Ver flujo real
          </a>
          <Link
            href="/login"
            className="rounded-full border border-white/10 bg-white/5 px-7 py-4 text-sm font-medium tracking-[0.14em] text-white uppercase transition-colors hover:border-white/20 hover:bg-white/8"
          >
            Entrar a la plataforma
          </Link>
        </div>

        <div id="hero-badges" className="mt-10 flex flex-wrap justify-center gap-3">
          {BADGES.map((item) => (
            <span
              key={item}
              className="rounded-full border border-white/8 bg-black/30 px-4 py-2 text-xs tracking-[0.14em] text-white/65 uppercase"
            >
              {item}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
