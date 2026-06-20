'use client'

import { motion } from 'motion/react'
import { useRef, useState } from 'react'
import { Send, Bot, Zap, ShieldCheck, BarChart3, Users } from 'lucide-react'

const CLIENT_ID = 'nxbot_1957644b814ddb7ac1d5'
const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL ?? 'http://localhost:3001'

type Message = { role: 'user' | 'bot'; text: string }

const HIGHLIGHTS = [
  {
    icon: Zap,
    title: 'Instalación en 2 minutos',
    desc: 'Un snippet de código y tu bot ya está en tu sitio.',
  },
  {
    icon: BarChart3,
    title: 'Leads calificados automáticamente',
    desc: 'Scoring por IA para que tu equipo sepa a quién llamar primero.',
  },
  {
    icon: Users,
    title: 'Múltiples bots por cuenta',
    desc: 'Un bot para ventas, otro para soporte, otro para onboarding.',
  },
  {
    icon: ShieldCheck,
    title: 'Sin tarjeta de crédito',
    desc: 'Empieza gratis y escala cuando lo necesites.',
  },
]

function MiniChat() {
  const [messages, setMessages] = useState<Message[]>([])
  const [draft, setDraft] = useState('')
  const [sending, setSending] = useState(false)
  const [sessionId] = useState(() =>
    typeof crypto !== 'undefined' && crypto.randomUUID
      ? crypto.randomUUID()
      : Math.random().toString(36).slice(2),
  )
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  function scrollToBottom() {
    const el = scrollAreaRef.current
    if (el) el.scrollTop = el.scrollHeight
  }

  async function send() {
    const text = draft.trim()
    if (!text || sending) return
    const next: Message[] = [...messages, { role: 'user', text }]
    setMessages(next)
    setDraft('')
    setSending(true)
    setTimeout(scrollToBottom, 30)
    try {
      const res = await fetch(`${BACKEND}/bot/widget/${CLIENT_ID}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          history: messages.map((m) => ({ role: m.role, text: m.text })),
          sessionId,
        }),
      })
      const data = await res.json()
      setMessages((prev) => [...prev, { role: 'bot', text: data.reply ?? 'Error al obtener respuesta.' }])
    } catch {
      setMessages((prev) => [...prev, { role: 'bot', text: 'No se pudo conectar con el asistente.' }])
    }
    setSending(false)
    setTimeout(scrollToBottom, 30)
  }

  return (
    <div className="flex h-[460px] flex-col rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-white/8 px-4 py-3 shrink-0">
        <div className="flex size-8 items-center justify-center rounded-full bg-nexus-purple">
          <Bot className="size-4 text-white" />
        </div>
        <div>
          <p className="text-sm font-semibold text-white">Asistente Nexus</p>
          <p className="text-xs text-white/40">Responde al instante</p>
        </div>
        <span className="ml-auto flex items-center gap-1.5 text-xs text-nexus-mint">
          <span className="inline-block size-1.5 rounded-full bg-nexus-mint animate-pulse" />
          En línea
        </span>
      </div>

      {/* Messages */}
      <div ref={scrollAreaRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3 nexus-chat-scroll">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full gap-3 text-center">
            <div className="flex size-12 items-center justify-center rounded-full bg-nexus-purple/20">
              <Bot className="size-6 text-nexus-lavender" />
            </div>
            <p className="text-sm text-white/50 max-w-[200px]">
              ¿Tienes dudas sobre Nexus? Pregúntame lo que quieras.
            </p>
          </div>
        )}
        {messages.map((m, i) => (
          <div key={i} className={`flex gap-2 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {m.role === 'bot' && (
              <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-nexus-purple mt-1">
                <Bot className="size-3.5 text-white" />
              </div>
            )}
            <div
              className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm leading-relaxed ${
                m.role === 'user'
                  ? 'bg-nexus-purple text-white rounded-tr-sm'
                  : 'bg-white/8 text-white/90 rounded-tl-sm'
              }`}
            >
              {m.text}
            </div>
          </div>
        ))}
        {sending && (
          <div className="flex gap-2 justify-start">
            <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-nexus-purple mt-1">
              <Bot className="size-3.5 text-white" />
            </div>
            <div className="rounded-2xl rounded-tl-sm bg-white/8 px-3 py-2.5">
              <span className="flex gap-1">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className="inline-block size-1.5 rounded-full bg-white/40 animate-[typing-dot_1.2s_ease-in-out_infinite]"
                    style={{ animationDelay: `${i * 0.2}s` }}
                  />
                ))}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="border-t border-white/8 px-3 py-3 shrink-0">
        <div className="flex items-center gap-2 rounded-xl bg-white/8 px-3 py-2">
          <input
            className="flex-1 bg-transparent text-sm text-white placeholder:text-white/30 outline-none"
            placeholder="Escribe tu mensaje…"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && send()}
            disabled={sending}
          />
          <button
            onClick={send}
            disabled={sending || !draft.trim()}
            className="flex size-7 items-center justify-center rounded-lg bg-nexus-purple text-white transition-opacity disabled:opacity-40"
          >
            <Send className="size-3.5" />
          </button>
        </div>
      </div>
    </div>
  )
}

export function CtaSection() {
  return (
    <section className="relative overflow-hidden border-t border-white/5 bg-black py-32">
      {/* Glows */}
      <div className="pointer-events-none absolute bottom-0 left-1/2 z-0 h-[600px] w-[1000px] -translate-x-1/2 translate-y-1/2 rounded-[100%] bg-nexus-lavender/20 blur-[150px] mix-blend-screen" />
      <div className="pointer-events-none absolute bottom-0 left-1/2 z-0 h-[400px] w-[600px] -translate-x-1/2 translate-y-1/2 rounded-[100%] bg-nexus-mint/10 blur-[100px] mix-blend-screen" />

      <div className="relative z-10 mx-auto max-w-6xl px-6">
        <div className="grid items-center gap-16 lg:grid-cols-2">

          {/* Left — copy + highlights */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
          >
            <p className="text-sm font-medium tracking-[0.22em] text-white/36 uppercase">¿Listo para empezar?</p>
            <h2 className="mt-5 text-5xl font-semibold leading-[0.95] tracking-tighter text-white md:text-7xl">
              Habla con
              <br />
              el asistente.
            </h2>
            <p className="mt-6 max-w-md text-lg leading-8 text-gray-400">
              Cuéntanos tu caso de uso directamente aquí. El asistente puede resolver tus dudas y conectarte con el equipo si lo necesitas.
            </p>

            <ul className="mt-10 space-y-4">
              {HIGHLIGHTS.map(({ icon: Icon, title, desc }) => (
                <li key={title} className="flex items-start gap-3">
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-nexus-purple/20 mt-0.5">
                    <Icon className="size-4 text-nexus-lavender" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{title}</p>
                    <p className="text-sm text-white/45">{desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Right — mini chat */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.23, 1, 0.32, 1] }}
          >
            <MiniChat />
          </motion.div>

        </div>
      </div>
    </section>
  )
}
