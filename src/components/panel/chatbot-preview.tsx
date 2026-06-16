'use client'

import { useEffect, useRef, useState } from 'react'
import { Send, RefreshCw } from 'lucide-react'
import { previewChatAction } from '@/app/actions/customer'

interface Message {
  role: 'user' | 'bot'
  text: string
}

export function ChatbotPreview({
  assistantName,
  welcomeMessage,
  primaryColor,
}: {
  assistantName: string
  welcomeMessage: string
  primaryColor: string
}) {
  const initial: Message[] = welcomeMessage ? [{ role: 'bot', text: welcomeMessage }] : []
  const [messages, setMessages] = useState<Message[]>(initial)
  const [draft, setDraft] = useState('')
  const [sending, setSending] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  function reset() {
    setMessages(welcomeMessage ? [{ role: 'bot', text: welcomeMessage }] : [])
  }

  async function send() {
    const text = draft.trim()
    if (!text || sending) return
    const history = messages.map((m) => ({ role: m.role, text: m.text }))
    const next = [...messages, { role: 'user' as const, text }]
    setMessages(next)
    setDraft('')
    setSending(true)
    try {
      const res = await previewChatAction(text, history)
      setMessages([...next, { role: 'bot', text: res.reply }])
    } catch (e) {
      setMessages([...next, { role: 'bot', text: e instanceof Error ? e.message : 'Error al responder.' }])
    }
    setSending(false)
  }

  return (
    <div className="flex h-[460px] flex-col overflow-hidden rounded-xl border">
      <div className="flex items-center justify-between px-4 py-3 text-white" style={{ background: primaryColor }}>
        <span className="text-sm font-semibold">{assistantName}</span>
        <button onClick={reset} className="text-white/80 hover:text-white" title="Reiniciar">
          <RefreshCw className="size-4" />
        </button>
      </div>

      <div className="flex-1 space-y-2.5 overflow-y-auto bg-muted/30 p-3">
        {messages.map((m, i) => {
          const isUser = m.role === 'user'
          return (
            <div key={i} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
              <div
                className={[
                  'max-w-[80%] rounded-2xl px-3 py-2 text-sm whitespace-pre-wrap',
                  isUser ? 'text-white rounded-br-sm' : 'bg-card border rounded-bl-sm',
                ].join(' ')}
                style={isUser ? { background: primaryColor } : undefined}
              >
                {m.text}
              </div>
            </div>
          )
        })}
        {sending && <p className="text-xs text-muted-foreground">Escribiendo…</p>}
        <div ref={bottomRef} />
      </div>

      <div className="flex items-center gap-2 border-t bg-card p-2.5">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              send()
            }
          }}
          placeholder="Escribe un mensaje de prueba…"
          disabled={sending}
          className="flex-1 rounded-full border bg-background px-3.5 py-2 text-sm outline-none focus:border-nexus-purple"
        />
        <button
          onClick={send}
          disabled={sending || !draft.trim()}
          className="grid size-9 place-items-center rounded-full text-white disabled:opacity-50"
          style={{ background: primaryColor }}
        >
          <Send className="size-4" />
        </button>
      </div>
    </div>
  )
}
