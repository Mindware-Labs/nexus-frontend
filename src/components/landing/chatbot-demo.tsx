'use client'

import { useEffect, useRef, useState } from 'react'

const PRESET_REPLY =
  'Entendido. En la operacion real de Nexus, este mensaje entra al flujo de captura: se identifica el tenant, se consulta la base de conocimiento y, si aplica, se extraen datos para scoring y seguimiento comercial.'

export function ChatbotDemo() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      text: 'Hola. Soy Nexus. Atiendo conversaciones del sitio web, respondo con conocimiento del negocio y ayudo a capturar leads utiles para tu equipo.',
    },
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    const userMsg = input.trim()
    setMessages((prev) => [...prev, { role: 'user', text: userMsg }])
    setInput('')
    setIsTyping(true)

    setTimeout(() => {
      setMessages((prev) => [...prev, { role: 'assistant', text: PRESET_REPLY }])
      setIsTyping(false)
    }, 1000)
  }

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  return (
    <section id="demo" className="relative overflow-hidden border-t border-white/5 bg-black py-32">
      <div className="pointer-events-none absolute top-1/2 right-0 h-[800px] w-1/2 -translate-y-1/2 rounded-full bg-nexus-purple/10 blur-[160px]" />
      <div className="relative z-10 mx-auto grid max-w-6xl grid-cols-1 items-center gap-16 px-6 md:grid-cols-[0.9fr_1.1fr]">
        <div>
          <p className="text-sm font-medium tracking-[0.22em] text-white/36 uppercase">Flujo visible</p>
          <h2 className="mt-5 text-4xl leading-tight font-semibold tracking-tight text-white md:text-5xl">
            Una demo que explica
            <br />
            el trabajo real del producto.
          </h2>
          <p className="mt-6 max-w-xl text-lg leading-8 text-gray-400">
            La idea no es teatralidad. La idea es que el visitor entienda que Nexus responde, captura contexto, deja trazabilidad y prepara una siguiente accion util para ventas.
          </p>

          <div className="mt-10 space-y-5">
            {[
              'Conversacion embebida en la web del cliente',
              'Consulta de conocimiento, scoring y resumen del lead',
              'Salida operativa hacia paneles, reportes e integraciones',
            ].map((item, index) => (
              <div key={item} className="flex items-start gap-4">
                <div className="mt-0.5 flex h-7 w-7 items-center justify-center rounded-full border border-white/10 bg-white/5 text-xs font-semibold text-nexus-lavender">
                  {index + 1}
                </div>
                <p className="text-base leading-7 text-white/72">{item}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative flex h-[560px] flex-col overflow-hidden rounded-[2rem] border border-white/10 bg-[#0a0a0a] shadow-[0_0_80px_rgba(82,37,102,0.3)]">
          <div className="flex items-center justify-between border-b border-white/6 bg-[#101010] px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="h-2.5 w-2.5 rounded-full bg-[#ff5f56]" />
              <div className="h-2.5 w-2.5 rounded-full bg-[#ffbd2e]" />
              <div className="h-2.5 w-2.5 rounded-full bg-[#27c93f]" />
            </div>
            <div className="text-xs font-medium tracking-[0.18em] text-white/38 uppercase">
              Flujo de conversacion
            </div>
            <div className="h-4 w-4" />
          </div>

          <div className="nexus-chat-scroll flex-1 space-y-4 overflow-y-auto bg-gradient-to-b from-[#0a0a0a] to-[#111] p-6">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[80%] rounded-2xl px-5 py-3 text-sm leading-6 shadow-md ${
                    msg.role === 'user'
                      ? 'rounded-tr-sm bg-nexus-purple font-medium text-white'
                      : 'rounded-tl-sm border border-white/5 bg-[#1a1a1a] text-gray-300'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="flex items-center gap-1.5 rounded-2xl rounded-tl-sm border border-white/5 bg-[#1a1a1a] px-5 py-4">
                  <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-nexus-lavender" />
                  <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-nexus-lavender" style={{ animationDelay: '0.15s' }} />
                  <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-nexus-lavender" style={{ animationDelay: '0.3s' }} />
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          <form onSubmit={handleSubmit} className="border-t border-white/6 bg-[#0a0a0a] p-4">
            <div className="relative">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Escribe una pregunta de negocio o caso de uso..."
                className="w-full rounded-full border border-white/10 bg-[#171717] py-3 pr-12 pl-5 text-sm text-white transition-all placeholder:text-gray-500 focus:border-nexus-purple focus:bg-[#1d1d1d] focus:outline-none"
              />
              <button
                type="submit"
                disabled={!input.trim() || isTyping}
                className="absolute top-1/2 right-2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white text-black transition-all duration-200 hover:scale-105 active:scale-95 disabled:opacity-50"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  )
}
