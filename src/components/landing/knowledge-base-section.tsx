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
      <div className="relative flex h-48 w-36 overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-transparent backdrop-blur-xl shadow-[0_20px_40px_-10px_rgba(0,0,0,0.5)]">
        {/* Subtle top border reflection */}
        <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-50" />
        
        {/* Document Content Abstract */}
        <div className="flex w-full flex-col gap-3 p-5 opacity-40">
          <div className="h-2 w-1/2 rounded-full bg-white" />
          <div className="h-1.5 w-full rounded-full bg-white/50" />
          <div className="h-1.5 w-[90%] rounded-full bg-white/50" />
          <div className="h-1.5 w-[80%] rounded-full bg-white/50" />
          <div className="mt-2 h-14 w-full rounded-xl border border-white/20 bg-white/5 flex items-center justify-center">
            <FileText className="h-5 w-5 text-white/80" strokeWidth={1.5} />
          </div>
        </div>

        {/* Premium Scanner */}
        <motion.div 
          animate={{ top: ['-10%', '110%', '-10%'] }}
          transition={{ duration: 3.5, ease: "easeInOut", repeat: Infinity }}
          className="absolute left-0 right-0 z-10 flex flex-col items-center"
        >
          {/* Intense center line */}
          <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-nexus-lavender to-transparent shadow-[0_0_15px_#caafff]" />
          {/* Trailing scan glow */}
          <div className="h-12 w-full bg-gradient-to-b from-nexus-lavender/30 to-transparent blur-md transform -translate-y-full" />
        </motion.div>
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
      <div className="grid grid-cols-6 gap-3 lg:gap-4 p-6 rounded-[2rem] border border-white/5 bg-white/[0.02] backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative overflow-hidden">
         {/* Subtle beam crossing */}
         <motion.div
           animate={{ left: ['-100%', '200%'] }}
           transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
           className="absolute top-0 bottom-0 w-[80px] bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-[-20deg]"
         />

         {Array.from({ length: 36 }).map((_, i) => {
           // Highlight a cluster of nodes simulating a "nearest neighbor" vector search
           const isHighlighted = [14, 15, 20, 21, 22, 27].includes(i);
           const isQuery = i === 21;
           return (
             <motion.div 
               key={i}
               initial={{ scale: 0, opacity: 0 }}
               animate={{ scale: 1, opacity: isQuery ? 1 : isHighlighted ? [0.3, 0.8, 0.3] : 0.15 }}
               transition={{ 
                 duration: isHighlighted ? 2 : 0.5, 
                 repeat: isHighlighted ? Infinity : 0, 
                 delay: i * 0.01,
                 ease: "easeInOut"
               }}
               className={`h-2 w-2 rounded-full ${isQuery ? 'bg-nexus-mint shadow-[0_0_15px_#10b981]' : isHighlighted ? 'bg-nexus-lavender shadow-[0_0_10px_#caafff]' : 'bg-white'}`}
             />
           )
         })}
      </div>
    </motion.div>
  )
}

function CategoryVisualizer() {
  const categories = [
    { name: 'Servicios', width: 'w-48', delay: 0 },
    { name: 'Productos', width: 'w-40', delay: 0.1 },
    { name: 'Tarifas', width: 'w-32', delay: 0.2 },
    { name: 'FAQs', width: 'w-24', delay: 0.3 }
  ]
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
      animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
      exit={{ opacity: 0, scale: 1.05, filter: 'blur(10px)' }}
      transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
      className="absolute inset-0 flex flex-col gap-3 items-center justify-center"
    >
      {categories.map((cat) => (
        <motion.div
          key={cat.name}
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: cat.delay, duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
          className={`flex ${cat.width} items-center justify-between rounded-xl border border-white/5 bg-gradient-to-r from-white/[0.03] to-transparent p-3 backdrop-blur-md relative overflow-hidden group hover:border-white/10 hover:bg-white/[0.05] transition-all`}
        >
          {/* Subtle animated border left */}
          <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-nexus-lavender/40 group-hover:bg-nexus-lavender transition-colors" />
          
          <div className="flex items-center gap-3">
            <div className="h-1.5 w-1.5 rounded-full bg-nexus-lavender shadow-[0_0_8px_#caafff]" />
            <span className="text-sm font-medium text-white/80">{cat.name}</span>
          </div>
          
          <div className="h-4 w-4 rounded border border-white/10 flex items-center justify-center bg-black/20">
            <div className="h-1 w-1 bg-white/30 rounded-full" />
          </div>
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
      <div className="relative flex h-32 w-32 items-center justify-center rounded-full border border-white/10 bg-gradient-to-br from-white/5 to-transparent backdrop-blur-xl shadow-2xl">
        <div className="absolute inset-0 rounded-full border-t border-white/20" />
        
        <motion.div
          animate={{ scale: [1, 1.4, 1], opacity: [0.5, 0, 0.5] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 rounded-full border border-nexus-lavender/50"
        />
        <motion.div
          animate={{ scale: [1, 1.8, 1], opacity: [0.2, 0, 0.2] }}
          transition={{ duration: 3, delay: 0.5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 rounded-full border border-nexus-lavender/30"
        />
        
        {/* Core Shield */}
        <div className="relative flex h-14 w-14 items-center justify-center rounded-full bg-nexus-lavender/20 border border-nexus-lavender/30 shadow-[0_0_30px_rgba(202,175,255,0.4)]">
           <MessageSquareWarning className="h-6 w-6 text-nexus-lavender drop-shadow-[0_0_8px_rgba(202,175,255,0.8)]" strokeWidth={1.5} />
        </div>
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

