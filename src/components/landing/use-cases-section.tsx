'use client'

import { useRef } from 'react'
import { motion, useScroll, useSpring, useTransform } from 'motion/react'

const SCENES = [
  {
    number: '01',
    eyebrow: 'Software y B2B',
    title: 'Discovery, demo y calificación inicial.',
    body: 'Responde preguntas comerciales y técnicas, filtra por tamaño de equipo, necesidad, presupuesto e interés de implementación y deja contexto suficiente para que ventas no empiece desde cero.',
    accent: 'bg-nexus-lavender',
    glow: 'from-nexus-purple/20',
    detail: 'Ideal para pipelines con varias conversaciones exploratorias antes del cierre.',
  },
  {
    number: '02',
    eyebrow: 'Inmobiliaria y construcción',
    title: 'Consultas altas en volumen, seguimiento limpio.',
    body: 'Permite identificar zona de interés, rango de inversión, tipo de propiedad y urgencia para separar consultas exploratorias de oportunidades listas para seguimiento humano.',
    accent: 'bg-nexus-mint',
    glow: 'from-emerald-500/20',
    detail: 'Útil cuando el equipo comercial no puede absorber cada consulta de forma manual.',
  },
  {
    number: '03',
    eyebrow: 'Clínicas, logística y consultoría',
    title: 'Más contexto antes del contacto humano.',
    body: 'Convierte preguntas repetitivas en conversaciones guiadas, captura datos previos a la atención y ayuda a detectar vacíos de información mediante preguntas sin respuesta.',
    accent: 'bg-nexus-coral',
    glow: 'from-orange-500/20',
    detail: 'Pensado para operaciones que necesitan orden, trazabilidad y tiempos de respuesta estables.',
  },
]

export function UseCasesSection() {
  const targetRef = useRef<HTMLElement>(null)

  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ['start start', 'end end'],
  })

  const progress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 28,
    restDelta: 0.001,
  })

  // Width is 300% of the container. Shift by -66.666% to reach the last item.
  const x = useTransform(progress, [0, 1], ['0%', '-66.666%'])

  return (
    <section ref={targetRef} id="use-cases" className="relative h-[300vh] border-t border-white/5 bg-[#050505]">
      <div className="sticky top-0 flex h-screen w-full flex-col overflow-hidden bg-[#050505] lg:flex-row">
        
        {/* Background Ambient Auroras */}
        <div className="pointer-events-none absolute inset-0 z-0">
          <div className="absolute -left-[20%] -top-[20%] h-[600px] w-[600px] rounded-full bg-nexus-lavender/10 blur-[150px]" />
          <div className="absolute -bottom-[20%] -right-[20%] h-[800px] w-[800px] rounded-full bg-nexus-mint/5 blur-[150px]" />
        </div>

        {/* Title Area: Top on mobile, Left on desktop */}
        <div className="relative z-10 flex h-[35vh] w-full shrink-0 flex-col justify-center px-8 lg:h-full lg:w-[40vw] lg:px-16 xl:px-24">
          <p className="text-xs font-bold tracking-[0.25em] text-nexus-lavender uppercase">Industrias objetivo</p>
          <h2 className="mt-5 text-4xl leading-[1.05] font-semibold tracking-tight text-white md:text-5xl lg:text-6xl">
            Casos de uso con
            <br />
            <span className="bg-gradient-to-r from-white to-white/40 bg-clip-text text-transparent">criterio operativo</span>
          </h2>
          <p className="mt-6 max-w-sm text-base leading-relaxed text-white/50">
            Diseñado para equipos que no pueden permitirse cuellos de botella en la atención comercial.
          </p>
        </div>

        {/* Scrolling Cards Area: Bottom on mobile, Right on desktop */}
        <div className="relative h-[65vh] w-full overflow-hidden lg:h-full lg:w-[60vw]">
          <motion.div style={{ x }} className="flex h-full w-[300vw] items-center lg:w-[180vw]">
            {SCENES.map((scene) => (
              <div key={scene.title} className="relative flex h-full w-[100vw] items-center p-6 lg:w-[60vw] lg:p-12 xl:p-20">
                
                {/* Redesigned Card Container */}
                <div className="group relative w-full overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.02] p-8 shadow-2xl backdrop-blur-xl transition-all duration-500 hover:border-white/20 hover:bg-white/[0.04] md:p-12 lg:h-auto min-h-[480px] flex flex-col justify-between">
                  
                  {/* Subtle Inner Glow */}
                  <div className={`pointer-events-none absolute -left-20 -top-20 h-64 w-64 rounded-full bg-gradient-to-br ${scene.glow} to-transparent blur-[80px] opacity-50 transition-opacity duration-700 group-hover:opacity-100`} />

                  {/* Giant Typography Number Background */}
                  <div className="pointer-events-none absolute -bottom-10 -right-6 text-[180px] font-bold leading-none tracking-tighter text-white/[0.03] transition-transform duration-700 group-hover:scale-105 md:-bottom-16 md:-right-10 md:text-[240px]">
                    {scene.number}
                  </div>
                  
                  <div className="relative z-10">
                    <div className="flex items-center gap-4 mb-8">
                      <div className={`h-2 w-2 rounded-full ${scene.accent} shadow-[0_0_12px_rgba(255,255,255,0.3)]`} />
                      <div className="text-xs font-bold tracking-[0.2em] text-white/50 uppercase">
                        {scene.eyebrow}
                      </div>
                    </div>
                    
                    <h3 className="text-3xl leading-[1.15] font-medium tracking-tight text-white lg:text-4xl lg:leading-[1.15] max-w-[90%]">
                      {scene.title}
                    </h3>
                    
                    <p className="mt-6 text-[17px] leading-relaxed text-white/60 max-w-xl">
                      {scene.body}
                    </p>
                  </div>
                  
                  {/* Detached Detail Block */}
                  <div className="relative z-10 mt-12 border-l-2 border-white/10 pl-6 py-1 transition-colors duration-500 group-hover:border-white/30">
                    <p className="text-sm font-medium leading-relaxed text-white/80 max-w-md">
                      {scene.detail}
                    </p>
                  </div>

                </div>
                
              </div>
            ))}
          </motion.div>
        </div>
        
      </div>
    </section>
  )
}
