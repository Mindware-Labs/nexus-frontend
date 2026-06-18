'use client'

import { AnimatePresence, motion } from 'motion/react'
import { useState } from 'react'
import { EASE, Reveal } from './anim'

const FEATURES = [
  {
    title: 'Entrenado en tu negocio',
    body: 'Sube tus documentos, tu web y tus FAQs. Nexus aprende tu tono, tus productos y tu conocimiento para responder como uno más de tu equipo.',
    chat: [
      { from: 'user', text: '¿Hacen envíos a toda España?' },
      {
        from: 'bot',
        text: 'Sí, enviamos a toda la península en 24-48h y a Baleares y Canarias en 3-5 días. ¿Te preparo el pedido?',
      },
    ],
  },
  {
    title: 'Califica sin que muevas un dedo',
    body: 'Detecta intención de compra, captura los datos clave y puntúa cada lead automáticamente. Tu equipo solo habla con quien está listo.',
    chat: [
      { from: 'bot', text: '¿Para cuántas personas sería el plan?' },
      { from: 'user', text: 'Somos un equipo de 40 y queremos empezar ya.' },
      { from: 'bot', text: 'Lead calificado · Pro · alta intención ✓' },
    ],
  },
  {
    title: 'Conversaciones que entiendes',
    body: 'Cada diálogo queda transcrito, buscable y resumido. Retoma cualquier conversación con su contexto completo. Nada se pierde.',
    chat: [
      { from: 'user', text: 'Quería retomar lo que hablamos ayer.' },
      {
        from: 'bot',
        text: 'Claro, lo tengo: te interesaba el plan anual con onboarding. ¿Seguimos por ahí?',
      },
    ],
  },
  {
    title: 'Analíticas en tiempo real',
    body: 'Temas, volumen, conversión y leads en un panel claro. Recibe un resumen por correo cada día o cada semana, sin abrir nada.',
    chat: [
      { from: 'bot', text: 'Resumen de hoy:' },
      { from: 'bot', text: '128 conversaciones · 31 leads · 92% resueltas' },
    ],
  },
]

function ChatMockup({ index }: { index: number }) {
  const messages = FEATURES[index].chat
  return (
    <div className="liquid-glass relative w-full max-w-sm rounded-[28px] p-5">
      <div className="flex items-center gap-2.5 pb-4">
        <span className="size-2.5 rounded-full bg-gradient-to-br from-indigo-400 to-purple-400" />
        <span className="text-sm font-semibold text-foreground/80">
          Asistente Nexus
        </span>
        <span className="ml-auto text-xs text-foreground/40">en línea</span>
      </div>
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.45, ease: EASE }}
          className="flex min-h-[180px] flex-col gap-3"
        >
          {messages.map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.12 + i * 0.14, ease: EASE }}
              className={
                m.from === 'user'
                  ? 'ml-auto max-w-[80%] rounded-2xl rounded-br-md bg-white/10 px-4 py-2.5 text-sm text-foreground'
                  : 'mr-auto max-w-[85%] rounded-2xl rounded-bl-md bg-gradient-to-br from-indigo-500/30 to-purple-500/20 px-4 py-2.5 text-sm text-foreground'
              }
            >
              {m.text}
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
    <section id="plataforma" className="relative mx-auto max-w-6xl px-6">
      <Reveal className="mx-auto max-w-2xl py-24 text-center md:py-32">
        <p className="text-sm font-medium tracking-[0.2em] text-foreground/40 uppercase">
          La plataforma
        </p>
        <h2 className="mt-5 font-[family-name:var(--font-general-sans)] text-4xl leading-[1.05] font-normal tracking-[-0.02em] text-foreground md:text-6xl">
          Todo lo que diría tu mejor comercial,{' '}
          <span className="text-gradient-aurora">a cualquier hora</span>
        </h2>
      </Reveal>

      <div className="grid gap-16 pb-24 md:grid-cols-2 md:pb-32">
        {/* Visual fijo que cambia según la característica activa */}
        <div className="hidden md:block">
          <div className="sticky top-0 flex h-screen items-center justify-center">
            <ChatMockup index={active} />
          </div>
        </div>

        {/* Texto que se desplaza; al cruzar el centro activa su visual */}
        <div className="flex flex-col">
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
              onViewportEnter={() => setActive(i)}
              viewport={{ margin: '-50% 0px -50% 0px', amount: 0.3 }}
              className="flex min-h-[60vh] flex-col justify-center md:min-h-screen"
            >
              {/* Mockup inline en móvil (sin sticky) */}
              <div className="mb-8 md:hidden">
                <ChatMockup index={i} />
              </div>
              <Reveal y={32}>
                <span className="text-sm font-semibold text-foreground/30">
                  0{i + 1}
                </span>
                <h3 className="mt-3 font-[family-name:var(--font-general-sans)] text-3xl font-semibold text-foreground md:text-4xl">
                  {f.title}
                </h3>
                <p className="mt-4 max-w-md text-lg leading-8 text-foreground/60">
                  {f.body}
                </p>
              </Reveal>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
