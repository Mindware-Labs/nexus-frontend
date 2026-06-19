'use client'

import { useRef } from 'react'
import { motion, useInView } from 'motion/react'
import { Zap, MessageSquare } from 'lucide-react'

export function LeadScoringSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section id="lead-scoring" className="relative border-t border-white/5 bg-[#030303] py-16 md:py-20 overflow-hidden">
      
      {/* Blueprint Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_20%,transparent_100%)] pointer-events-none" />
      
      {/* Background Ambient Glows */}
      <div className="absolute top-1/4 left-0 w-[400px] h-[400px] bg-nexus-lavender/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 right-0 w-[400px] h-[400px] bg-nexus-mint/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
        
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center mb-12">
          <p className="text-sm font-bold tracking-[0.2em] text-nexus-lavender uppercase mb-3 flex items-center justify-center gap-2">
            <Zap className="w-4 h-4" /> Lead Scoring Inteligente
          </p>
          <h2 className="text-3xl leading-[1.1] font-semibold tracking-tight text-white md:text-4xl lg:text-5xl mb-4">
            El motor que convierte <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-nexus-lavender via-white to-nexus-mint">ruido en oportunidades.</span>
          </h2>
          <p className="text-base text-white/60 max-w-2xl mx-auto">
            Deja atrás la lectura de transcripciones interminables. El sistema analiza el contexto, evalúa según tu rúbrica y te entrega el lead listo para cerrar.
          </p>
        </div>

        {/* The Pipeline Visualization */}
        <div ref={ref} className="relative w-full mx-auto py-4 flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-0">
          
          {/* STEP 1: INPUT */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="w-full lg:w-[280px] flex flex-col relative z-10"
          >
            <div className="hidden lg:block absolute -left-6 top-0 bottom-0 w-1 bg-gradient-to-b from-white/20 to-transparent rounded-full" />
            <h3 className="text-white font-medium mb-4 flex items-center gap-3 text-sm lg:text-base">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-white/10 text-xs font-bold border border-white/5">1</span>
              Captura de contexto
            </h3>
            
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 backdrop-blur-md relative shadow-2xl">
              <div className="absolute -top-3 -right-3">
                <span className="relative flex h-6 w-6">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-nexus-lavender opacity-20"></span>
                  <span className="relative inline-flex rounded-full h-6 w-6 bg-[#0A0A0A] border border-nexus-lavender/30 items-center justify-center">
                    <MessageSquare className="w-3 h-3 text-nexus-lavender" />
                  </span>
                </span>
              </div>
              <p className="text-sm text-white/70 italic leading-relaxed">
                "Nos encantó la propuesta. Tenemos un presupuesto de <span className="text-white font-semibold border-b border-nexus-mint/50">$5k</span> y queremos lanzar en <span className="text-white font-semibold border-b border-nexus-lavender/50">Q3</span>. ¿Cuándo vemos una demo?"
              </p>
            </div>
          </motion.div>

          {/* CONNECTION 1 */}
          <div className="hidden lg:flex flex-1 items-center justify-center h-full relative px-6 z-0">
            <div className="w-full h-[1px] bg-gradient-to-r from-white/10 via-nexus-lavender/40 to-transparent relative overflow-hidden">
                <motion.div 
                  className="absolute top-1/2 -translate-y-1/2 left-0 w-[20%] h-[2px] bg-nexus-lavender shadow-[0_0_8px_#caafff] rounded-full"
                  animate={{ x: ['-100%', '500%'] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                />
            </div>
          </div>

          {/* STEP 2: THE CORE */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
            transition={{ duration: 1, ease: [0.23, 1, 0.32, 1], delay: 0.2 }}
            className="w-full lg:w-auto flex flex-col items-center justify-center relative z-10"
          >
            <div className="relative w-48 h-48 flex items-center justify-center">
              {/* Ambient core glow */}
              <div className="absolute inset-0 bg-nexus-lavender/10 rounded-full blur-[40px]" />
              <div className="absolute inset-8 bg-nexus-mint/10 rounded-full blur-[30px]" />
              
              {/* Outer rotating ring */}
              <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 rounded-full border border-white/5 border-l-nexus-lavender/50 border-r-nexus-mint/50"
              />
              
              {/* Inner rotating dashed ring */}
              <motion.div 
                  animate={{ rotate: -360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-6 rounded-full border border-dashed border-white/10"
              />
              
              {/* Central Core Node */}
              <div className="absolute inset-12 rounded-full bg-[#050505] border border-white/10 shadow-[0_0_30px_rgba(202,175,255,0.15)] flex items-center justify-center overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-nexus-lavender/20 to-transparent opacity-50" />
                  <Zap className="w-6 h-6 text-white relative z-10" />
              </div>

              {/* Orbiting Tags */}
              <motion.div 
                  animate={{ y: [-6, 6, -6] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -top-2 -left-6 bg-[#0A0A0A]/90 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-full flex items-center gap-2 shadow-xl"
              >
                  <div className="w-1.5 h-1.5 rounded-full bg-nexus-lavender shadow-[0_0_8px_#caafff]" />
                  <span className="text-xs text-white/90 font-medium">Timeline: Q3</span>
              </motion.div>

              <motion.div 
                  animate={{ y: [6, -6, 6] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -bottom-2 -right-6 bg-[#0A0A0A]/90 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-full flex items-center gap-2 shadow-xl"
              >
                  <div className="w-1.5 h-1.5 rounded-full bg-nexus-mint shadow-[0_0_8px_#10b981]" />
                  <span className="text-xs text-white/90 font-medium">Presupuesto: OK</span>
              </motion.div>
            </div>

            <h3 className="text-white font-medium mt-8 flex items-center gap-3 text-sm lg:text-base">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-white/10 text-xs font-bold border border-white/5">2</span>
              Análisis Estructurado
            </h3>
          </motion.div>

          {/* CONNECTION 2 */}
          <div className="hidden lg:flex flex-1 items-center justify-center h-full relative px-6 z-0">
            <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-nexus-mint/40 to-white/10 relative overflow-hidden">
                <motion.div 
                  className="absolute top-1/2 -translate-y-1/2 left-0 w-[20%] h-[2px] bg-nexus-mint shadow-[0_0_8px_#10b981] rounded-full"
                  animate={{ x: ['-100%', '500%'] }}
                  transition={{ duration: 2, delay: 1, repeat: Infinity, ease: 'linear' }}
                />
            </div>
          </div>

          {/* STEP 3: OUTPUT */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
            className="w-full lg:w-[280px] flex flex-col relative z-10"
          >
            <div className="hidden lg:block absolute -right-6 top-0 bottom-0 w-1 bg-gradient-to-b from-nexus-mint/50 to-transparent rounded-full" />
            
            <h3 className="text-white font-medium mb-4 flex items-center lg:justify-end gap-3 text-sm lg:text-base">
              <span className="lg:hidden flex items-center justify-center w-6 h-6 rounded-full bg-nexus-mint/20 text-nexus-mint text-xs font-bold border border-nexus-mint/30">3</span>
              Lead Score Final
              <span className="hidden lg:flex items-center justify-center w-6 h-6 rounded-full bg-nexus-mint/20 text-nexus-mint text-xs font-bold border border-nexus-mint/30">3</span>
            </h3>

            <div className="flex flex-col lg:items-end">
              <div className="flex items-start gap-1 mb-3">
                  <span className="text-[5rem] leading-none font-light tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-white/20">95</span>
                  <span className="text-lg text-white/30 mt-2">/100</span>
              </div>
              
              <div className="inline-flex items-center gap-2 rounded-full bg-nexus-mint/10 px-3 py-1 border border-nexus-mint/20 mb-6 lg:mr-1">
                  <div className="h-1.5 w-1.5 rounded-full bg-nexus-mint animate-pulse shadow-[0_0_10px_#10b981]" />
                  <span className="text-[10px] font-bold text-nexus-mint tracking-widest uppercase">Hot Lead</span>
              </div>

              <div className="w-full p-4 rounded-xl bg-white/[0.02] border border-white/5 backdrop-blur-md shadow-2xl relative lg:text-right">
                  <p className="text-[10px] text-white/40 uppercase tracking-widest mb-2 font-semibold">Próxima acción IA</p>
                  <p className="text-sm text-white/80 leading-relaxed">
                    Programar demo técnica enfocada en integraciones. El cliente tiene fondos confirmados.
                  </p>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  )
}


