'use client'

import { AnimatePresence, motion } from 'motion/react'
import { useState } from 'react'
import { EASE, Reveal } from './anim'

const FEATURES = [
  {
    title: 'Responde con la base de conocimiento del cliente',
    body: 'Nexus usa la Nexus Database para responder con servicios, FAQs, procesos y documentacion del negocio. La conversacion se apoya en material real, no en copy generico.',
    chat: [
      { from: 'user', text: 'Que incluye la implementacion del plan?' },
      { from: 'bot', text: 'Puedo responder con base en tus planes, procesos y preguntas frecuentes configuradas para este cliente.' },
    ],
  },
  {
    title: 'Captura y califica leads automaticamente',
    body: 'Cuando la conversacion avanza, el sistema extrae datos, calcula score, detecta presupuesto, urgencia y necesidad, y deja un resumen ejecutivo listo para ventas.',
    chat: [
      { from: 'bot', text: 'Antes de agendar, necesito tamano del equipo, presupuesto y urgencia.' },
      { from: 'user', text: 'Somos 18 personas y queremos implementarlo este mes.' },
      { from: 'bot', text: 'Lead capturado: alta intencion, ventana cercana y necesidad clara.' },
    ],
  },
  {
    title: 'Panel de control centralizado',
    body: 'Supervisa el rendimiento de tu asistente, gestiona leads capturados, revisa historiales de conversación y obtén analíticas clave desde una interfaz intuitiva.',
    chat: [
      { from: 'user', text: '¿Qué información puedo ver en mi panel?' },
      { from: 'bot', text: 'Tendrás acceso a tus leads, conversaciones en tiempo real, analíticas, configuración del chatbot y preguntas frecuentes que puedes agregar.' },
    ],
  },
  {
    title: 'Mantiene trazabilidad operativa',
    body: 'La app ya contempla transcripciones, filtros, exportables, clasificacion de temas y preguntas sin respuesta para que el canal no sea una caja negra.',
    chat: [
      { from: 'bot', text: 'Resumen diario: conversaciones, leads, temas detectados y preguntas sin respuesta.' },
      { from: 'bot', text: 'Nada se pierde: cada interaccion queda disponible para revision y accion posterior.' },
    ],
  },
]

function ChatMockup({ index }: { index: number }) {
  const messages = FEATURES[index].chat

  return (
    <div className="relative w-full max-w-md p-2">
      <div className="mb-8 flex items-center justify-center">
        <div className="rounded-full border border-white/10 bg-black px-4 py-1.5 text-[11px] font-medium tracking-[0.2em] text-white/60 uppercase">
          Conversación Nexus
        </div>
      </div>
      
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.45, ease: EASE }}
          className="flex min-h-[200px] flex-col gap-5 pt-4"
        >
          {messages.map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 + i * 0.15, ease: [0.25, 1, 0.5, 1] }}
              className={`relative flex w-full flex-col ${m.from === 'user' ? 'items-end' : 'items-start'}`}
            >
              {m.from === 'bot' && (
                <div className="mb-2 ml-2 flex items-center gap-2">
                  <span className="size-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                  <span className="text-xs font-medium text-white/50">Asistente</span>
                </div>
              )}
              {m.from === 'user' ? (
                <div className="max-w-[80%] rounded-2xl bg-white/5 px-5 py-4 text-sm leading-relaxed text-white/80">
                  {m.text}
                </div>
              ) : (
                <div className="relative max-w-[90%] rounded-2xl p-[1px] shadow-[0_10px_40px_rgba(173,116,195,0.15)]">
                  <div className="absolute inset-0 z-0 rounded-2xl bg-gradient-to-br from-nexus-lavender/40 to-nexus-purple/10" />
                  <div className="relative z-10 rounded-[15px] bg-black px-5 py-4 text-sm leading-relaxed text-white">
                    {m.text}
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

export function FeaturesSection() {
  const [active, setActive] = useState(0)

  return (
    <section id="plataforma" className="relative bg-[#020202] px-6 overflow-hidden">
      {/* Background Layer: Tech Grid + Radial Glow */}
      <div className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
        <div className="absolute left-1/2 top-1/2 h-[800px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-nexus-lavender/5 blur-[120px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl">
        <Reveal className="mx-auto max-w-3xl py-24 text-center md:py-32">
          <p className="text-sm font-medium tracking-[0.22em] text-white/40 uppercase">
            La plataforma
          </p>
          <h2 className="mt-5 font-[family-name:var(--font-general-sans)] text-4xl leading-[1.05] font-normal tracking-[-0.02em] text-white md:text-6xl">
            Conversaciones utiles para negocio,{' '}
            <span className="text-gradient-aurora">no solo respuestas bonitas</span>
          </h2>
        </Reveal>

        <div className="relative flex flex-col md:grid md:grid-cols-[1.05fr_0.95fr] gap-8 md:gap-16 pb-24 md:pb-32">
          {/* Sticky Mockup Container (Mobile & PC) */}
          <div className="sticky top-20 z-20 flex min-h-[350px] items-center justify-center bg-black/90 pt-8 pb-4 backdrop-blur-xl md:top-24 md:h-[calc(100vh-6rem)] md:bg-transparent md:p-0 md:backdrop-blur-none">
            <ChatMockup index={active} />
            {/* Gradient fade for mobile scrolling */}
            <div className="pointer-events-none absolute bottom-[-40px] left-0 right-0 h-[40px] bg-gradient-to-b from-black/90 to-transparent md:hidden" />
          </div>

          <div className="flex flex-col px-4 md:px-0 relative z-10">
            {FEATURES.map((f, i) => (
              <motion.div
                key={f.title}
                onViewportEnter={() => setActive(i)}
                viewport={{ margin: '-45% 0px -45% 0px', amount: 0.3 }}
                className="flex min-h-[50vh] flex-col justify-center border-b border-white/6 py-12 last:border-b-0 md:min-h-[78vh]"
              >
                <Reveal y={28}>
                  <span className="text-sm font-semibold tracking-[0.18em] text-white/28 uppercase">
                    0{i + 1}
                  </span>
                  <h3 className="mt-3 max-w-xl font-[family-name:var(--font-general-sans)] text-2xl font-semibold text-white md:text-4xl">
                    {f.title}
                  </h3>
                  <p className="mt-4 max-w-xl text-base leading-relaxed text-gray-400 md:text-lg md:leading-8">
                    {f.body}
                  </p>
                </Reveal>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
