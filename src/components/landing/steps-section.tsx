'use client'

const STEPS = [
  {
    number: '01',
    title: 'El visitante inicia la conversación',
    body: 'El widget de Nexus atiende al usuario en la web del cliente, valida el contexto del tenant y empieza a responder con base en la información real del negocio.',
  },
  {
    number: '02',
    title: 'El sistema captura y califica',
    body: 'Durante la interacción, Nexus extrae datos útiles, detecta intención, calcula score y construye un resumen ejecutivo para el equipo comercial.',
  },
  {
    number: '03',
    title: 'La operación queda lista',
    body: 'El lead, la transcripción, las preguntas sin respuesta, la analítica y las integraciones posteriores quedan disponibles en el panel centralizado.',
  },
]

export function StepsSection() {
  return (
    <section id="how-it-works" className="relative z-10 border-t border-white/5 bg-[#0A0A0A] py-32 md:py-40 overflow-hidden">
      
      {/* Premium Background Layer */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        {/* Subtle animated grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
        
        {/* Animated glowing orbs */}
        <div className="absolute -left-[10%] top-[20%] h-[600px] w-[600px] rounded-full bg-nexus-purple/10 blur-[150px] animate-[drift-1_24s_ease-in-out_infinite_alternate]" />
        <div className="absolute right-[0%] top-[40%] h-[700px] w-[700px] rounded-full bg-nexus-lavender/5 blur-[120px] animate-[drift-2_30s_ease-in-out_infinite_alternate]" />
        
        {/* Vertical divider line spanning the section */}
        <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-white/5 to-transparent -translate-x-1/2 hidden md:block" />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-6 flex flex-col md:flex-row gap-16 md:gap-24">
        
        {/* Header Content */}
        <div className="md:w-5/12 md:sticky md:top-32 md:h-fit">
          <p className="text-sm font-medium tracking-[0.22em] text-white/36 uppercase">Flujo central</p>
          <h2 className="mt-5 text-4xl leading-[1.05] font-semibold tracking-tight text-white md:text-5xl lg:text-6xl">
            De conversación
            <br />
            a oportunidad.
          </h2>
          <p className="mt-6 max-w-sm text-base leading-relaxed text-gray-400 md:text-lg md:leading-8">
            El proceso real diseñado para que el asistente no sea solo un chat, sino una pieza operativa de tu embudo de ventas.
          </p>
        </div>

        {/* Minimalist Vertical Steps (Variant E) */}
        <div className="md:w-7/12 py-8">
          <div className="border-l border-white/10 pl-8 space-y-14">
            {STEPS.map((step) => (
              <div key={step.number} className="relative group cursor-default">
                {/* Glowing dot indicator */}
                <div className="absolute -left-[37.5px] top-1.5 w-[11px] h-[11px] bg-black border border-white/20 rounded-full transition-all duration-300 group-hover:bg-nexus-lavender group-hover:border-nexus-lavender group-hover:shadow-[0_0_12px_rgba(173,116,195,0.8)]" />
                
                <div className="text-[10px] font-bold tracking-[0.2em] text-white/30 uppercase mb-3 transition-colors duration-300 group-hover:text-nexus-lavender">
                  Paso {step.number}
                </div>
                <h3 className="text-2xl font-medium tracking-tight text-white mb-3 transition-colors duration-300">
                  {step.title}
                </h3>
                <p className="text-[15px] text-white/50 leading-relaxed md:text-base">
                  {step.body}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  )
}
