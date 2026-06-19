'use client'

import { useRef } from 'react'
import { motion, useInView } from 'motion/react'
import { Target, TrendingUp, Zap, FileSearch } from 'lucide-react'

export function LeadScoringSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section id="lead-scoring" className="relative border-t border-white/5 bg-[#0A0A0A] py-32 md:py-40 overflow-hidden">
      
      {/* Dynamic Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-nexus-lavender/20 to-transparent" />
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-nexus-lavender/10 blur-[120px] rounded-[100%]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
          
          {/* Left: Interactive/Visual Component */}
          <div ref={ref} className="w-full lg:w-1/2 relative perspective-1000">
            <motion.div
              initial={{ opacity: 0, rotateY: -15, x: -30 }}
              animate={isInView ? { opacity: 1, rotateY: 0, x: 0 } : { opacity: 0, rotateY: -15, x: -30 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="relative w-full aspect-square max-w-md mx-auto"
            >
              <div className="absolute inset-0 rounded-[32px] bg-gradient-to-br from-white/10 to-transparent p-[1px]">
                <div className="absolute inset-0 rounded-[32px] bg-[#0F0F0F] backdrop-blur-2xl" />
              </div>
              
              <div className="relative h-full w-full rounded-[32px] p-8 flex flex-col justify-between overflow-hidden">
                <div className="absolute top-0 right-0 p-8">
                  <div className="inline-flex items-center gap-2 rounded-full bg-nexus-mint/10 px-3 py-1 border border-nexus-mint/20">
                    <div className="h-2 w-2 rounded-full bg-nexus-mint animate-pulse" />
                    <span className="text-xs font-semibold text-nexus-mint tracking-wide">Calificado</span>
                  </div>
                </div>

                <div className="space-y-6 mt-12">
                  <div className="flex items-end gap-3">
                    <span className="text-7xl font-light tracking-tighter text-white">95</span>
                    <span className="text-xl text-white/40 pb-2">/100</span>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-white/50">Urgencia</span>
                      <span className="text-white font-medium">Alta</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full w-[90%] bg-nexus-coral rounded-full" />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-white/50">Presupuesto</span>
                      <span className="text-white font-medium">Confirmado</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full w-[100%] bg-nexus-mint rounded-full" />
                    </div>
                  </div>
                </div>

                <div className="mt-8 rounded-2xl bg-white/[0.03] border border-white/[0.05] p-5">
                  <div className="flex items-center gap-3 mb-2">
                    <Zap className="h-4 w-4 text-nexus-lavender" />
                    <span className="text-sm font-medium text-white">Siguiente acción sugerida</span>
                  </div>
                  <p className="text-sm text-white/60 leading-relaxed">
                    &quot;Reunión de descubrimiento inmediata. Cliente tiene el presupuesto y busca implementar en Q3.&quot;
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right: Text Content */}
          <div className="w-full lg:w-1/2">
            <p className="text-sm font-bold tracking-[0.2em] text-nexus-lavender uppercase mb-4">Lead Scoring Inteligente</p>
            <h2 className="text-4xl leading-[1.1] font-semibold tracking-tight text-white md:text-5xl lg:text-6xl">
              No solo captura. <br/>
              <span className="text-white/50">Califica al instante.</span>
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-white/60 max-w-lg">
              El motor de calificación automática evalúa cada conversación de 0 a 100 usando una rúbrica personalizable. Tu equipo recibe leads priorizados, con datos estructurados y listos para cerrar.
            </p>

            <ul className="mt-10 space-y-5">
              {[
                { icon: Target, text: 'Rúbrica configurable por cliente (presupuesto, urgencia).' },
                { icon: FileSearch, text: 'Extracción estructurada de datos conversacionales.' },
                { icon: TrendingUp, text: 'Resumen ejecutivo IA en la ficha de cada oportunidad.' },
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-4">
                  <div className="mt-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-nexus-purple/20">
                    <item.icon className="h-3.5 w-3.5 text-nexus-lavender" />
                  </div>
                  <span className="text-[17px] text-white/80 leading-relaxed">{item.text}</span>
                </li>
              ))}
            </ul>
          </div>

        </div>
      </div>
    </section>
  )
}
