'use client'

import { useEffect, useRef, useState } from 'react'
import { Send } from 'lucide-react'

const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL!

type AvatarMode = 'icon' | 'emoji' | 'image'

interface WidgetConfig {
  clientId: string
  enabled: boolean
  assistantName: string
  avatarMode: AvatarMode
  avatarValue: string
  supportedLanguages: string[]
  widgetPrimaryColor: string
  widgetPosition: 'left' | 'right'
  launcherText: string
  welcomeMessage: string
  closingMessage: string
}

interface Message {
  role: 'user' | 'bot'
  text: string
}

function Avatar({ mode, value, color, size = 36 }: { mode: AvatarMode; value: string; color: string; size?: number }) {
  const s = { width: size, height: size, borderRadius: '50%', flexShrink: 0 }

  if (mode === 'image' && value) {
    return <img src={value} alt="avatar" style={{ ...s, objectFit: 'cover' }} />
  }
  if (mode === 'emoji') {
    return (
      <div style={{ ...s, background: color + '22', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: size * 0.5 }}>
        {value || '🤖'}
      </div>
    )
  }
  // icon fallback — simple bot circle
  return (
    <div style={{ ...s, background: color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg width={size * 0.55} height={size * 0.55} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="10" rx="2" />
        <circle cx="12" cy="5" r="2" />
        <line x1="12" y1="7" x2="12" y2="11" />
        <line x1="8" y1="15" x2="8" y2="15" />
        <line x1="16" y1="15" x2="16" y2="15" />
      </svg>
    </div>
  )
}

export default function WidgetPage({ params }: { params: { clientId: string } }) {
  const { clientId } = params
  const [config, setConfig] = useState<WidgetConfig | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [draft, setDraft] = useState('')
  const [sending, setSending] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    fetch(`${BACKEND}/bot/widget/${clientId}/config`)
      .then((r) => r.json())
      .then((data: WidgetConfig) => {
        setConfig(data)
        if (data.welcomeMessage) {
          setMessages([{ role: 'bot', text: data.welcomeMessage }])
        }
      })
      .catch(() => setError('No se pudo cargar el chat.'))
  }, [clientId])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function send() {
    const text = draft.trim()
    if (!text || sending || !config) return

    const next: Message[] = [...messages, { role: 'user', text }]
    setMessages(next)
    setDraft('')
    setSending(true)

    try {
      const res = await fetch(`${BACKEND}/bot/widget/${clientId}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          history: next.slice(0, -1).map((m) => ({ role: m.role, text: m.text })),
        }),
      })
      const data = await res.json()
      setMessages([...next, { role: 'bot', text: data.reply ?? 'Sin respuesta.' }])
    } catch {
      setMessages([...next, { role: 'bot', text: 'Ocurrió un error. Inténtalo de nuevo.' }])
    }

    setSending(false)
    setTimeout(() => inputRef.current?.focus(), 50)
  }

  const color = config?.widgetPrimaryColor ?? '#6D28D9'

  if (error) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100dvh', fontFamily: 'system-ui, sans-serif', color: '#666', fontSize: 14 }}>
        {error}
      </div>
    )
  }

  if (!config) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100dvh', fontFamily: 'system-ui, sans-serif', color: '#999', fontSize: 13 }}>
        Cargando…
      </div>
    )
  }

  if (!config.enabled) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100dvh', fontFamily: 'system-ui, sans-serif', color: '#999', fontSize: 13, textAlign: 'center', padding: 24 }}>
        Este chatbot no está disponible en este momento.
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100dvh', fontFamily: 'system-ui, -apple-system, sans-serif', background: '#fff', overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '14px 16px', background: color, color: '#fff', flexShrink: 0 }}>
        <Avatar mode={config.avatarMode} value={config.avatarValue} color="#fff" size={36} />
        <div>
          <div style={{ fontWeight: 600, fontSize: 15, lineHeight: 1.2 }}>{config.assistantName}</div>
          <div style={{ fontSize: 11, opacity: 0.8 }}>En línea</div>
        </div>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {messages.map((m, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start', gap: 8, alignItems: 'flex-end' }}>
            {m.role === 'bot' && (
              <Avatar mode={config.avatarMode} value={config.avatarValue} color={color} size={28} />
            )}
            <div
              style={{
                maxWidth: '78%',
                padding: '9px 13px',
                borderRadius: m.role === 'user' ? '18px 18px 4px 18px' : '4px 18px 18px 18px',
                background: m.role === 'user' ? color : '#f1f0f5',
                color: m.role === 'user' ? '#fff' : '#1a1a1a',
                fontSize: 14,
                lineHeight: 1.45,
                wordBreak: 'break-word',
                whiteSpace: 'pre-wrap',
              }}
            >
              {m.text}
            </div>
          </div>
        ))}

        {sending && (
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8 }}>
            <Avatar mode={config.avatarMode} value={config.avatarValue} color={color} size={28} />
            <div style={{ padding: '9px 14px', borderRadius: '4px 18px 18px 18px', background: '#f1f0f5' }}>
              <span style={{ display: 'inline-flex', gap: 4 }}>
                {[0, 1, 2].map((i) => (
                  <span key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: '#999', display: 'inline-block', animation: `bounce 1s ease-in-out ${i * 0.15}s infinite` }} />
                ))}
              </span>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div style={{ display: 'flex', gap: 8, padding: '10px 12px', borderTop: '1px solid #e8e8e8', flexShrink: 0, background: '#fff' }}>
        <input
          ref={inputRef}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() } }}
          placeholder="Escribe un mensaje…"
          disabled={sending}
          style={{
            flex: 1, border: '1px solid #ddd', borderRadius: 22, padding: '9px 14px', fontSize: 14,
            outline: 'none', background: '#fafafa', color: '#1a1a1a',
          }}
        />
        <button
          onClick={send}
          disabled={sending || !draft.trim()}
          style={{
            width: 40, height: 40, borderRadius: '50%', border: 'none', background: draft.trim() && !sending ? color : '#e0e0e0',
            color: '#fff', cursor: draft.trim() && !sending ? 'pointer' : 'default',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'background 0.2s',
          }}
        >
          <Send size={16} />
        </button>
      </div>

      <style>{`
        @keyframes bounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-5px); }
        }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { overflow: hidden; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #ddd; border-radius: 2px; }
      `}</style>
    </div>
  )
}
