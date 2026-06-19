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
                
                {/* Ultra Premium Card Container */}
                <div className="group relative w-full h-[540px] md:h-[600px] overflow-hidden rounded-[2.5rem] border border-white/[0.05] bg-[#070707] shadow-[0_30px_100px_-20px_rgba(0,0,0,0.8)] transition-all duration-700 hover:border-white/[0.12]">
                  
                  {/* Subtle Gradient Glow on Hover */}
                  <div className={`absolute inset-0 opacity-0 bg-gradient-to-br ${scene.glow} to-transparent mix-blend-screen transition-opacity duration-1000 group-hover:opacity-[0.08]`} />
                  
                  {/* Giant Outlined Typography Number */}
                  <div 
                    className="pointer-events-none absolute -bottom-10 -right-6 text-[180px] md:text-[280px] font-bold leading-none tracking-tighter text-transparent transition-all duration-1000 group-hover:scale-105" 
                    style={{ WebkitTextStroke: '2px rgba(255,255,255,0.04)' }}
                  >
                    {scene.number}
                  </div>
                  
                  <div className="relative h-full flex flex-col justify-between p-8 md:p-12 lg:p-16">
                    
                    <div>
                      {/* Eyebrow & Status Dot */}
                      <div className="flex items-center gap-4 mb-8">
                        <div className={`h-2.5 w-2.5 rounded-full ${scene.accent} shadow-[0_0_12px_rgba(255,255,255,0.4)] animate-pulse`} />
                        <div className="text-[11px] font-bold tracking-[0.25em] text-white/40 uppercase">
                          {scene.eyebrow}
                        </div>
                      </div>
                      
                      {/* Main Title */}
                      <h3 className="text-3xl leading-[1.15] font-semibold tracking-tight text-white lg:text-5xl lg:leading-[1.15] max-w-[90%]">
                        {scene.title}
                      </h3>
                      
                      {/* Animated Divider */}
                      <div className="mt-8 h-px w-12 bg-white/10 transition-all duration-700 ease-out group-hover:w-32 group-hover:bg-white/30" />
                      
                      {/* Body Text */}
                      <p className="mt-8 text-[15px] md:text-[17px] leading-relaxed text-white/50 max-w-xl font-light">
                        {scene.body}
                      </p>
                    </div>
                    
                    {/* Bottom Detail */}
                    <div className="mt-12 border-l border-white/10 pl-6 py-1 transition-colors duration-500 group-hover:border-white/30">
                      <p className="text-sm font-medium leading-relaxed text-white/80 max-w-md">
                        {scene.detail}
                      </p>
                    </div>
                    
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
