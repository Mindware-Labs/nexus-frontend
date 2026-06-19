'use client'

import { useRef } from 'react'
import { motion, useInView } from 'motion/react'
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

export function KnowledgeBaseSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section id="knowledge-base" className="relative border-t border-white/5 bg-[#050505] py-32 md:py-40 overflow-hidden">
      
      {/* Background Orbs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1000px] h-full pointer-events-none">
        <div className="absolute top-[20%] left-[10%] w-[400px] h-[400px] bg-nexus-purple/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-[20%] right-[10%] w-[500px] h-[500px] bg-nexus-lavender/5 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-bold tracking-[0.2em] text-nexus-lavender uppercase mb-4">Nexus Database (KB)</p>
          <h2 className="text-4xl leading-[1.1] font-semibold tracking-tight text-white md:text-5xl">
            Conocimiento estructurado. <br/>
            <span className="text-white/50">Cero alucinaciones.</span>
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-white/60">
            El cerebro de tu asistente virtual. Alimenta la base de conocimiento con tu documentación y asegúrate de que cada respuesta esté fundamentada en los datos reales de tu empresa.
          </p>
        </div>

        <div ref={ref} className="mt-20 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.6, delay: index * 0.1, ease: [0.21, 0.47, 0.32, 0.98] }}
              className="group relative overflow-hidden rounded-[24px] border border-white/10 bg-white/[0.02] p-8 transition-colors hover:bg-white/[0.04] hover:border-white/20"
            >
              <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-white/[0.05] border border-white/10 group-hover:bg-nexus-lavender/10 group-hover:border-nexus-lavender/30 transition-colors">
                <feature.icon className="h-5 w-5 text-white/70 group-hover:text-nexus-lavender transition-colors" />
              </div>
              <h3 className="mb-3 text-lg font-medium text-white tracking-tight">
                {feature.title}
              </h3>
              <p className="text-[15px] leading-relaxed text-white/50">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
