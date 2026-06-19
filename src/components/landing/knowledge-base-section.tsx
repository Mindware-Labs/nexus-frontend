'use client'

import { useRef, useState } from 'react'
import { motion, useInView, AnimatePresence } from 'motion/react'
import { Database, FileText, LayoutList, MessageSquareWarning } from 'lucide-react'

const FEATURES = [
  {
    title: 'Ingesta de documentos',
    description: 'Sube PDFs, Word o texto plano. El sistema los procesa en segundo plano para alimentar el "cerebro" del bot.',
    icon: FileText,
  },
  {
    title: 'Recuperación semántica (RAG)',
    description: 'Búsqueda vectorial que encuentra el contexto exacto para fundamentar respuestas precisas en tiempo real.',
    icon: Database,
  },
  {
    title: 'Categorización estructurada',
    description: 'Organiza la información en Servicios, Productos, Tarifas y FAQs para mantener la coherencia del negocio.',
    icon: LayoutList,
  },
  {
    title: 'Cero alucinaciones',
    description: 'El bot responde únicamente con la información existente. Si no sabe algo, usa un fallback y deriva a un humano.',
    icon: MessageSquareWarning,
  },
]

function IngestaVisualizer() {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
      animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
      exit={{ opacity: 0, scale: 1.05, filter: 'blur(10px)' }}
      transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
      className="absolute inset-0 flex items-center justify-center"
    >
      <div className="relative flex h-40 w-32 items-center justify-center rounded-2xl border border-white/20 bg-gradient-to-b from-white/10 to-transparent backdrop-blur-md shadow-2xl">
        <FileText className="h-10 w-10 text-white/50" strokeWidth={1.5} />
        <motion.div 
          animate={{ top: ['0%', '100%', '0%'] }}
          transition={{ duration: 3, ease: "linear", repeat: Infinity }}
          className="absolute left-0 right-0 h-[2px] bg-nexus-lavender shadow-[0_0_15px_#caafff] z-10"
        />
        <div className="absolute inset-x-4 top-8 h-1.5 rounded-full bg-white/10" />
        <div className="absolute inset-x-4 top-14 h-1.5 rounded-full bg-white/10" />
        <div className="absolute inset-x-4 top-20 w-1/2 h-1.5 rounded-full bg-white/10" />
      </div>
    </motion.div>
  )
}

function RAGVisualizer() {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
      animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
      exit={{ opacity: 0, scale: 1.05, filter: 'blur(10px)' }}
      transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
      className="absolute inset-0 flex items-center justify-center"
    >
      <div className="grid grid-cols-5 gap-3 lg:gap-5">
         {Array.from({ length: 25 }).map((_, i) => {
           const isHighlighted = [7, 11, 12, 13, 17].includes(i);
           return (
             <motion.div 
               key={i}
               initial={{ scale: 0, opacity: 0 }}
               animate={{ scale: 1, opacity: isHighlighted ? [0.4, 1, 0.4] : 0.2 }}
               transition={{ 
                 duration: isHighlighted ? 2 : 0.5, 
                 repeat: isHighlighted ? Infinity : 0, 
                 delay: i * 0.02,
                 ease: "easeInOut"
               }}
               className={`h-1.5 w-1.5 lg:h-2 lg:w-2 rounded-full ${isHighlighted ? 'bg-nexus-lavender shadow-[0_0_10px_#caafff]' : 'bg-white'}`}
             />
           )
         })}
      </div>
    </motion.div>
  )
}

function CategoryVisualizer() {
  const categories = ['Servicios', 'Productos', 'Tarifas', 'FAQs']
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
      animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
      exit={{ opacity: 0, scale: 1.05, filter: 'blur(10px)' }}
      transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
      className="absolute inset-0 flex flex-col gap-3 items-center justify-center"
    >
      {categories.map((cat, i) => (
        <motion.div
          key={cat}
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: i * 0.1, duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
          className="flex w-48 items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-3 backdrop-blur-md relative overflow-hidden"
        >
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-nexus-lavender/50" />
          <div className="h-1.5 w-1.5 rounded-full bg-nexus-lavender" />
          <span className="text-sm font-medium text-white/80">{cat}</span>
        </motion.div>
      ))}
    </motion.div>
  )
}

function ShieldVisualizer() {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
      animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
      exit={{ opacity: 0, scale: 1.05, filter: 'blur(10px)' }}
      transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
      className="absolute inset-0 flex items-center justify-center"
    >
      <div className="relative flex h-32 w-32 items-center justify-center rounded-full border border-nexus-lavender/30 bg-gradient-to-br from-nexus-lavender/20 to-transparent backdrop-blur-md">
        <motion.div
          animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0, 0.3] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 rounded-full border border-nexus-lavender"
        />
        <motion.div
          animate={{ scale: [1, 1.5, 1], opacity: [0.1, 0, 0.1] }}
          transition={{ duration: 2.5, delay: 0.5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 rounded-full border border-nexus-lavender"
        />
        <MessageSquareWarning className="h-8 w-8 text-nexus-lavender" strokeWidth={1.5} />
      </div>
    </motion.div>
  )
}

const VISUALIZERS = [
  IngestaVisualizer,
  RAGVisualizer,
  CategoryVisualizer,
  ShieldVisualizer
]

export function KnowledgeBaseSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const [activeIndex, setActiveIndex] = useState(0)

  const ActiveVisualizer = VISUALIZERS[activeIndex]

  return (
    <section id="knowledge-base" className="relative border-t border-white/5 bg-[#050505] py-20 md:py-24 overflow-hidden">
      
      {/* Background Orbs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1000px] h-full pointer-events-none">
        <div className="absolute top-[20%] left-[10%] w-[400px] h-[400px] bg-nexus-purple/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-[20%] right-[10%] w-[500px] h-[500px] bg-nexus-lavender/5 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
          className="mx-auto max-w-2xl text-center mb-12"
        >
          <p className="text-sm font-bold tracking-[0.2em] text-nexus-lavender uppercase mb-3">Nexus Database (KB)</p>
          <h2 className="text-3xl leading-[1.1] font-semibold tracking-tight text-white md:text-4xl">
            Conocimiento estructurado. <br/>
            <span className="text-white/50">Cero alucinaciones.</span>
          </h2>
          <p className="mt-4 text-base leading-relaxed text-white/60">
            El cerebro de tu asistente virtual. Alimenta la base de conocimiento con tu documentación y asegúrate de que cada respuesta esté fundamentada en los datos reales de tu empresa.
          </p>
        </motion.div>

        <div ref={ref} className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          
          {/* Left: Interactive List */}
          <div className="flex flex-col w-full relative">
            {/* Vertical guide line */}
            <div className="absolute left-[2px] top-6 bottom-6 w-[2px] bg-white/5 hidden sm:block" />

            {FEATURES.map((feature, index) => {
              const isActive = activeIndex === index
              return (
                <button 
                  key={index}
                  className="text-left group relative py-4 sm:py-5 pl-0 sm:pl-24 pr-6 transition-colors outline-none"
                  onMouseEnter={() => setActiveIndex(index)}
                  onClick={() => setActiveIndex(index)}
                  onFocus={() => setActiveIndex(index)}
                >
                  {/* Animated indicator */}
                  {isActive && (
                    <motion.div 
                      layoutId="activeKbIndicator"
                      className="absolute left-[1px] top-6 bottom-6 w-[4px] rounded-full bg-nexus-lavender shadow-[0_0_15px_rgba(202,175,255,0.5)] z-10 hidden sm:block"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                  
                  {/* Number icon */}
                  <motion.div 
                    whileTap={{ scale: 0.95 }}
                    className={`relative sm:absolute left-0 sm:left-8 sm:top-5 mb-3 sm:mb-0 h-[48px] w-[48px] rounded-xl border flex items-center justify-center transition-all duration-500 z-10 ${
                      isActive 
                        ? 'border-nexus-lavender/50 bg-nexus-lavender/10 text-nexus-lavender shadow-[0_0_20px_rgba(202,175,255,0.2)]' 
                        : 'border-white/10 bg-[#0A0A0A] text-white/30 group-hover:border-white/20 group-hover:text-white/50'
                    }`}
                  >
                    <feature.icon className="w-5 h-5" />
                  </motion.div>

                  <h3 className={`text-xl font-semibold tracking-tight transition-colors duration-300 ${
                    isActive ? 'text-white' : 'text-white/40 group-hover:text-white/70'
                  }`}>
                    {feature.title}
                  </h3>
                  
                  <motion.div 
                    initial={false}
                    animate={{ 
                      height: isActive ? 'auto' : 0, 
                      opacity: isActive ? 1 : 0,
                      filter: isActive ? 'blur(0px)' : 'blur(4px)',
                      marginTop: isActive ? 8 : 0
                    }}
                    className="overflow-hidden"
                    transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                  >
                    <p className="text-base text-white/60 leading-relaxed">
                      {feature.description}
                    </p>
                  </motion.div>
                </button>
              )
            })}
          </div>

          {/* Right: Visualizer */}
          <div className="relative aspect-square lg:aspect-[4/3] max-h-[400px] w-full rounded-[2rem] border border-white/10 bg-white/[0.02] overflow-hidden flex items-center justify-center p-8 lg:p-12 shadow-2xl transition-all duration-500 hover:border-white/20">
            {/* Inner ambient glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-nexus-lavender/5 via-transparent to-transparent pointer-events-none" />
            <div className="absolute top-0 right-0 w-64 h-64 bg-nexus-lavender/5 rounded-full blur-[80px]" />
            
            <AnimatePresence mode="wait">
              <ActiveVisualizer key={activeIndex} />
            </AnimatePresence>
          </div>

        </div>
      </div>
    </section>
  )
}

