'use client'

import Link from 'next/link'

export function PricingSection() {
  return (
    <section id="pricing" className="relative overflow-hidden border-t border-white/5 bg-[#010101] py-40">
      
      {/* Background Aurora */}
      <div className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center">
        <div className="absolute top-[20%] h-[500px] w-[800px] rounded-[100%] bg-nexus-purple/10 blur-[120px] mix-blend-screen" />
        <div className="absolute top-[40%] h-[600px] w-[600px] rounded-[100%] bg-nexus-lavender/5 blur-[150px] mix-blend-screen" />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-medium tracking-[0.22em] text-white/36 uppercase">Planes a tu medida</p>
          <h2 className="mt-5 text-5xl font-semibold tracking-tighter text-white md:text-7xl">
            Soluciones para cada etapa.
          </h2>
          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-gray-400">
            Comienza a automatizar hoy mismo con planes diseñados para escalar junto al crecimiento de tu negocio.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2">
          <div className="rounded-[2.2rem] border border-white/7 bg-[#0a0a0a] p-10 shadow-[0_18px_70px_rgba(0,0,0,0.22)] md:p-12">
            <div className="inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs tracking-[0.18em] text-white/60 uppercase">
              Plan Starter
            </div>
            <h3 className="mt-6 text-3xl font-semibold text-white md:text-4xl">Ideal para comenzar</h3>
            <p className="mt-4 max-w-lg text-base leading-7 text-gray-400">
              Obtén lo esencial para capturar leads y responder consultas frecuentes sin complicaciones.
            </p>

            <ul className="mt-8 space-y-4 text-sm leading-7 text-white/72">
              <li className="flex items-start gap-3"><span className="mt-2 h-1.5 w-1.5 rounded-full bg-nexus-lavender" /> Hasta 1,000 conversaciones/mes</li>
              <li className="flex items-start gap-3"><span className="mt-2 h-1.5 w-1.5 rounded-full bg-nexus-lavender" /> Captura básica de leads</li>
              <li className="flex items-start gap-3"><span className="mt-2 h-1.5 w-1.5 rounded-full bg-nexus-lavender" /> Panel de control y analítica estándar</li>
            </ul>

            <Link
              href="/login"
              className="mt-10 inline-flex rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-medium tracking-[0.14em] text-white uppercase transition-colors hover:border-white/20 hover:bg-white/8"
            >
              Comenzar gratis
            </Link>
          </div>

          <div className="rounded-[2.2rem] border border-nexus-purple/60 bg-[linear-gradient(180deg,rgba(82,37,102,0.22),rgba(17,17,17,1))] p-10 shadow-[0_30px_90px_rgba(61,26,78,0.34)] md:p-12">
            <div className="inline-flex rounded-full bg-white px-4 py-1.5 text-xs font-semibold tracking-[0.18em] text-black uppercase">
              Plan Pro
            </div>
            <h3 className="mt-6 text-3xl font-semibold text-white md:text-4xl">Autonomía total para tu negocio</h3>
            <p className="mt-4 max-w-lg text-base leading-7 text-gray-300">
              Para empresas con alto volumen que necesitan integraciones avanzadas y personalización completa.
            </p>

            <ul className="mt-8 space-y-4 text-sm leading-7 text-white/78">
              <li className="flex items-start gap-3"><span className="mt-2 h-1.5 w-1.5 rounded-full bg-nexus-mint" /> Conversaciones ilimitadas</li>
              <li className="flex items-start gap-3"><span className="mt-2 h-1.5 w-1.5 rounded-full bg-nexus-mint" /> Lead scoring y automatización avanzada</li>
              <li className="flex items-start gap-3"><span className="mt-2 h-1.5 w-1.5 rounded-full bg-nexus-mint" /> Acceso a API y soporte prioritario 24/7</li>
            </ul>

            <Link
              href="/login"
              className="mt-10 inline-flex rounded-full bg-white px-6 py-3 text-sm font-semibold tracking-[0.14em] text-black uppercase transition-transform duration-200 hover:scale-[1.03] active:scale-[0.97]"
            >
              Contactar ventas
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
