'use client'
import { useState } from 'react'
import { ScrollText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

interface Message {
  role: 'user' | 'bot'
  text: string
}

interface TranscriptDialogProps {
  transcript: Message[]
  assistantName?: string
  leadName?: string | null
}

export function TranscriptDialog({
  transcript,
  assistantName = 'Asistente',
  leadName,
}: TranscriptDialogProps) {
  const [open, setOpen] = useState(false)

  if (!transcript?.length) {
    return <span className="text-xs text-muted-foreground/50">Sin transcripción</span>
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="h-7 gap-1.5 text-xs text-nexus-purple hover:text-nexus-purple hover:bg-nexus-lilac">
          <ScrollText className="size-3" />
          Ver conversación
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-base">
            Conversación{leadName ? ` — ${leadName}` : ''}
          </DialogTitle>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto space-y-3 py-2 pr-1">
          {transcript.map((m, i) => {
            const isUser = m.role === 'user'
            return (
              <div
                key={i}
                className={`flex gap-2 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={[
                    'max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed whitespace-pre-wrap',
                    isUser
                      ? 'bg-nexus-purple text-white rounded-br-sm'
                      : 'bg-muted text-foreground rounded-bl-sm',
                  ].join(' ')}
                >
                  <p className={`text-[10px] font-semibold mb-1 ${isUser ? 'text-white/60' : 'text-muted-foreground'}`}>
                    {isUser ? 'Visitante' : assistantName}
                  </p>
                  {m.text}
                </div>
              </div>
            )
          })}
        </div>
      </DialogContent>
    </Dialog>
  )
}
