'use client'

import Link from 'next/link'
import { motion } from 'motion/react'

export function CtaSection() {
  return (
    <section className="relative overflow-hidden border-t border-white/5 bg-black py-40">
      {/* End of journey intense glow */}
      <div className="pointer-events-none absolute bottom-0 left-1/2 z-0 h-[600px] w-[1000px] -translate-x-1/2 translate-y-1/2 rounded-[100%] bg-nexus-lavender/20 blur-[150px] mix-blend-screen" />
      <div className="pointer-events-none absolute bottom-0 left-1/2 z-0 h-[400px] w-[600px] -translate-x-1/2 translate-y-1/2 rounded-[100%] bg-nexus-mint/10 blur-[100px] mix-blend-screen" />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
        className="relative z-10 mx-auto max-w-4xl px-6 text-center"
      >
        <p className="text-sm font-medium tracking-[0.22em] text-white/36 uppercase">Cierre</p>
        <h2 className="mt-5 text-5xl leading-[0.95] font-semibold tracking-tighter text-white md:text-8xl">
          Listo para
          <br />
          operar.
        </h2>
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-gray-400">
          Si ya tienes acceso, entra a la plataforma. Si estas evaluando Nexus, revisa la politica publica o habla con Mindware Labs.
        </p>

        <div className="mt-12 flex flex-col justify-center gap-4 sm:flex-row">
          <Link
            href="/login"
            className="rounded-full bg-white px-8 py-4 text-sm font-semibold tracking-[0.16em] text-black uppercase transition-transform duration-200 hover:scale-[1.03] active:scale-[0.97]"
          >
            Iniciar sesion
          </Link>
          <Link
            href="/privacidad"
            className="rounded-full border border-white/10 bg-white/5 px-8 py-4 text-sm font-medium tracking-[0.14em] text-white uppercase transition-colors hover:border-white/20 hover:bg-white/8"
          >
            Ver politica de privacidad
          </Link>
          <a
            href="mailto:labsmindware@gmail.com"
            className="rounded-full border border-transparent px-8 py-4 text-sm font-medium tracking-[0.14em] text-white/72 uppercase transition-colors hover:text-white"
          >
            Contactar a Mindware
          </a>
        </div>
      </motion.div>
    </section>
  )
}
