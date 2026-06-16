'use client'

import { useState, useRef } from 'react'
import { Eye, MessageSquare, Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { previewBotChatAction } from '@/app/actions/bot'

// ── Chat preview dialog (BOT-14) ──────────────────────────────────────────────

type ChatMessage = { role: 'user' | 'bot'; text: string }

export function PreviewDialog({ customerId }: { customerId: number }) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [draft, setDraft] = useState('')
  const [sending, setSending] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  async function send() {
    const text = draft.trim()
    if (!text || sending) return
    const next: ChatMessage[] = [...messages, { role: 'user', text }]
    setMessages(next)
    setDraft('')
    setSending(true)
    const result = await previewBotChatAction(customerId, text, messages)
    if ('error' in result) {
      setMessages([...next, { role: 'bot', text: `Error: ${result.error}` }])
    } else {
      setMessages([...next, { role: 'bot', text: result.reply }])
    }
    setSending(false)
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 50)
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <MessageSquare className="mr-1.5 size-3.5" />
          Probar bot (BOT-14)
        </Button>
      </DialogTrigger>
      <DialogContent className="flex h-[600px] max-w-lg flex-col gap-0 p-0">
        <DialogHeader className="border-b px-5 py-4">
          <DialogTitle className="text-sm">Vista previa del bot</DialogTitle>
          <p className="text-xs text-muted-foreground">Usa la configuración guardada en la base de datos.</p>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.length === 0 && (
            <p className="text-center text-xs text-muted-foreground pt-8">Escribe un mensaje para comenzar la prueba.</p>
          )}
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] rounded-2xl px-3.5 py-2 text-sm ${m.role === 'user' ? 'bg-nexus-purple text-white' : 'bg-muted text-foreground'}`}>
                {m.text}
              </div>
            </div>
          ))}
          {sending && (
            <div className="flex justify-start">
              <div className="rounded-2xl bg-muted px-3.5 py-2 text-sm text-muted-foreground">Escribiendo...</div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>
        <div className="border-t p-4 flex gap-2">
          <Input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') send() }}
            placeholder="Escribe un mensaje..."
            disabled={sending}
            className="flex-1"
          />
          <Button
            type="button"
            size="icon"
            onClick={send}
            disabled={sending || !draft.trim()}
            className="bg-nexus-purple text-white hover:bg-nexus-purple/85"
          >
            <Send className="size-4" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// ── Widget preview dialog ─────────────────────────────────────────────────────

interface WidgetPreviewProps {
  assistantName: string
  avatarMode: 'icon' | 'emoji' | 'image'
  avatarValue: string
  welcomeMessage: string
  launcherText: string
  widgetPrimaryColor: string
  widgetPosition: 'left' | 'right'
}

function WidgetMockup(props: WidgetPreviewProps) {
  const { assistantName, avatarMode, avatarValue, welcomeMessage, launcherText, widgetPrimaryColor, widgetPosition } = props
  const [open, setOpen] = useState(true)
  const posClass = widgetPosition === 'left' ? 'items-start' : 'items-end'
  const posX     = widgetPosition === 'left' ? 'left-4' : 'right-4'

  function Avatar({ size = 32 }: { size?: number }) {
    const s = `${size}px`
    if (avatarMode === 'image' && avatarValue?.startsWith('data:')) {
      // eslint-disable-next-line @next/next/no-img-element
      return <img src={avatarValue} alt="" style={{ width: s, height: s }} className="rounded-full object-cover shrink-0" />
    }
    if (avatarMode === 'emoji') {
      return (
        <div style={{ width: s, height: s, background: widgetPrimaryColor }} className="rounded-full flex items-center justify-center shrink-0 text-base">
          {avatarValue || '🤖'}
        </div>
      )
    }
    return (
      <div style={{ width: s, height: s, background: widgetPrimaryColor }} className="rounded-full flex items-center justify-center shrink-0">
        <svg viewBox="0 0 24 24" style={{ width: size * 0.55, height: size * 0.55 }} fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="11" width="18" height="10" rx="2" />
          <circle cx="12" cy="7" r="3" />
          <line x1="8" y1="15" x2="8" y2="15" strokeWidth="2.5" />
          <line x1="12" y1="15" x2="12" y2="15" strokeWidth="2.5" />
          <line x1="16" y1="15" x2="16" y2="15" strokeWidth="2.5" />
        </svg>
      </div>
    )
  }

  return (
    <div className="rounded-xl border bg-muted/30 overflow-hidden">
      {/* Browser chrome */}
      <div className="flex items-center gap-1.5 border-b bg-muted/60 px-3 py-2">
        <span className="size-2.5 rounded-full bg-red-400/70" />
        <span className="size-2.5 rounded-full bg-amber-400/70" />
        <span className="size-2.5 rounded-full bg-green-400/70" />
        <div className="mx-2 flex-1 rounded bg-background/60 px-2 py-0.5 text-[10px] text-muted-foreground">
          cliente.com
        </div>
      </div>

      {/* Page */}
      <div className="relative h-[420px] select-none overflow-hidden bg-[repeating-linear-gradient(90deg,transparent,transparent_39px,hsl(var(--border)/0.3)_39px,hsl(var(--border)/0.3)_40px),repeating-linear-gradient(0deg,transparent,transparent_39px,hsl(var(--border)/0.3)_39px,hsl(var(--border)/0.3)_40px)]">
        {/* Skeleton */}
        <div className="absolute inset-6 space-y-2.5 opacity-20">
          <div className="h-4 w-1/2 rounded bg-foreground/40" />
          <div className="h-2.5 w-3/4 rounded bg-foreground/30" />
          <div className="h-2.5 w-2/3 rounded bg-foreground/30" />
          <div className="mt-4 h-2.5 w-4/5 rounded bg-foreground/20" />
          <div className="h-2.5 w-3/5 rounded bg-foreground/20" />
          <div className="mt-4 h-2.5 w-5/6 rounded bg-foreground/15" />
          <div className="h-2.5 w-2/4 rounded bg-foreground/15" />
        </div>

        {/* Widget stack */}
        <div className={`absolute bottom-4 flex flex-col gap-3 ${posClass} ${posX}`}>
          {open && (
            <div className="w-72 rounded-2xl border bg-background shadow-2xl overflow-hidden text-sm">
              <div style={{ background: widgetPrimaryColor }} className="flex items-center gap-2.5 px-4 py-3">
                <Avatar size={28} />
                <span className="font-semibold text-white truncate flex-1">{assistantName || 'Asistente'}</span>
                <button type="button" onClick={() => setOpen(false)} className="text-white/70 hover:text-white leading-none text-base" aria-label="Cerrar">✕</button>
              </div>
              <div className="space-y-3 p-4 bg-muted/20 min-h-[120px]">
                <div className="flex items-end gap-2">
                  <Avatar size={22} />
                  <div className="rounded-2xl rounded-bl-sm bg-background border px-3 py-2 text-foreground max-w-[200px] leading-relaxed text-xs">
                    {welcomeMessage || 'Hola, ¿en qué puedo ayudarte?'}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 border-t bg-background px-3 py-2.5">
                <div className="flex-1 rounded-full bg-muted/60 px-3 py-1.5 text-xs text-muted-foreground">
                  Escribe un mensaje…
                </div>
                <div style={{ background: widgetPrimaryColor }} className="size-6 rounded-full flex items-center justify-center shrink-0">
                  <svg viewBox="0 0 16 16" className="size-3.5" fill="white">
                    <path d="M14 8L2 2l2.5 6L2 14z" />
                  </svg>
                </div>
              </div>
            </div>
          )}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            style={{ background: widgetPrimaryColor }}
            className="self-end rounded-full px-4 py-2.5 text-sm font-semibold text-white shadow-lg transition-transform hover:scale-105 active:scale-95 max-w-[240px] truncate"
          >
            {launcherText || '💬 Chat'}
          </button>
        </div>
      </div>
    </div>
  )
}

export function WidgetPreviewDialog(props: WidgetPreviewProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Eye className="mr-1.5 size-3.5" />
          Vista previa del widget
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-sm">Vista previa del widget</DialogTitle>
          <p className="text-xs text-muted-foreground">Se actualiza en tiempo real con la configuración actual.</p>
        </DialogHeader>
        <WidgetMockup {...props} />
      </DialogContent>
    </Dialog>
  )
}
