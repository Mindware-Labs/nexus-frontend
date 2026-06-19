'use client'

import Link from 'next/link'
import { motion } from 'motion/react'

export function PricingSection() {
  return (
    <section id="pricing" className="relative overflow-hidden border-t border-white/5 bg-[#010101] py-20 md:py-24">
      
      {/* Background Aurora */}
      <div className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center">
        <div className="absolute top-[20%] h-[400px] w-[600px] rounded-[100%] bg-nexus-purple/10 blur-[100px] mix-blend-screen" />
        <div className="absolute top-[40%] h-[500px] w-[500px] rounded-[100%] bg-nexus-lavender/5 blur-[120px] mix-blend-screen" />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-6">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
          className="mx-auto max-w-3xl text-center"
        >
          <p className="text-xs font-medium tracking-[0.22em] text-white/36 uppercase">Planes a tu medida</p>
          <h2 className="mt-4 text-4xl font-semibold tracking-tighter text-white md:text-5xl lg:text-6xl">
            Soluciones para cada etapa.
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-gray-400">
            Comienza a automatizar hoy mismo con planes diseñados para escalar junto al crecimiento de tu negocio.
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.23, 1, 0.32, 1] }}
          className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 max-w-4xl mx-auto"
        >
          <div className="rounded-[2rem] border border-white/7 bg-[#0a0a0a] p-8 shadow-[0_18px_70px_rgba(0,0,0,0.22)] md:p-10 flex flex-col justify-between transition-transform duration-500 hover:-translate-y-2">
            <div>
              <div className="inline-flex rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[10px] font-semibold tracking-[0.18em] text-white/60 uppercase">
                Plan Starter
              </div>
              <h3 className="mt-5 text-2xl font-semibold text-white md:text-3xl">Ideal para comenzar</h3>
              <p className="mt-3 text-sm leading-relaxed text-gray-400">
                Obtén lo esencial para capturar leads y responder consultas frecuentes sin complicaciones.
              </p>

              <ul className="mt-6 space-y-3 text-[13px] leading-relaxed text-white/72">
                <li className="flex items-start gap-3"><span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-nexus-lavender" /> Hasta 1,000 conversaciones/mes</li>
                <li className="flex items-start gap-3"><span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-nexus-lavender" /> Captura básica de leads</li>
                <li className="flex items-start gap-3"><span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-nexus-lavender" /> Panel de control y analítica estándar</li>
              </ul>
            </div>

            <Link
              href="/login"
              className="mt-8 inline-flex justify-center rounded-full border border-white/10 bg-white/5 px-6 py-2.5 text-xs font-semibold tracking-[0.14em] text-white uppercase transition-colors hover:border-white/20 hover:bg-white/8"
            >
              Comenzar gratis
            </Link>
          </div>

          <div className="rounded-[2rem] border border-nexus-purple/60 bg-[linear-gradient(180deg,rgba(82,37,102,0.22),rgba(17,17,17,1))] p-8 shadow-[0_30px_90px_rgba(61,26,78,0.34)] md:p-10 flex flex-col justify-between transition-transform duration-500 hover:-translate-y-2">
            <div>
              <div className="inline-flex rounded-full bg-white px-3 py-1.5 text-[10px] font-bold tracking-[0.18em] text-black uppercase">
                Plan Pro
              </div>
              <h3 className="mt-5 text-2xl font-semibold text-white md:text-3xl">Autonomía total para tu negocio</h3>
              <p className="mt-3 text-sm leading-relaxed text-gray-300">
                Para empresas con alto volumen que necesitan integraciones avanzadas y personalización completa.
              </p>

              <ul className="mt-6 space-y-3 text-[13px] leading-relaxed text-white/78">
                <li className="flex items-start gap-3"><span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-nexus-mint" /> Conversaciones ilimitadas</li>
                <li className="flex items-start gap-3"><span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-nexus-mint" /> Lead scoring y automatización avanzada</li>
                <li className="flex items-start gap-3"><span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-nexus-mint" /> Acceso a API y soporte prioritario 24/7</li>
              </ul>
            </div>

            <Link
              href="/login"
              className="mt-8 inline-flex justify-center rounded-full bg-white px-6 py-2.5 text-xs font-bold tracking-[0.14em] text-black uppercase transition-transform duration-200 hover:scale-[1.03] active:scale-[0.97]"
            >
              Contactar ventas
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
