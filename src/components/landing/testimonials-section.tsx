'use client'

const ITEMS = [
  {
    number: '01',
    title: 'Landing publica',
    body: 'Explica el producto, aterriza el flujo y dirige al acceso sin duplicar logica de autenticacion ni inventar promesas comerciales.',
  },
  {
    number: '02',
    title: 'Panel Owner',
    body: 'Concentra gestion de clientes, tenants, bots, planes, reportes, auditoria, API keys y privacidad desde la operacion central.',
  },
  {
    number: '03',
    title: 'Panel Customer',
    body: 'Permite revisar leads, conversaciones, analitica, estado del bot, plan, notificaciones y configuracion empresarial.',
  },
]

export function TestimonialsSection() {
  return (
    <section className="relative overflow-hidden border-t border-white/5 bg-gradient-to-b from-[#010101] to-black py-40">
      <div className="pointer-events-none absolute top-0 left-1/2 h-[420px] w-[900px] -translate-x-1/2 rounded-[100%] bg-nexus-lavender/5 blur-[140px]" />

      <div className="relative z-10 mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-medium tracking-[0.22em] text-white/36 uppercase">Arquitectura visible</p>
          <h2 className="mt-5 text-4xl leading-tight font-semibold tracking-tight text-white md:text-6xl">
            Tres superficies claras
            <br />
            para una operacion ordenada.
          </h2>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {ITEMS.map((item) => (
            <article
              key={item.title}
              className="rounded-[2rem] border border-white/8 bg-white/[0.03] p-8 shadow-[0_16px_50px_rgba(0,0,0,0.16)]"
            >
              <div className="text-sm font-medium tracking-[0.22em] text-white/32 uppercase">
                {item.number}
              </div>
              <h3 className="mt-6 text-2xl font-semibold text-white">{item.title}</h3>
              <p className="mt-4 text-base leading-7 text-gray-400">{item.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
