'use client'

import { useState, useTransition, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Trash2, Bot } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import type { BotActionState } from '@/app/actions/bot'

type CreateBotButtonProps = {
  customerId: number
  action: (customerId: number, name: string) => Promise<BotActionState>
  variant?: 'default' | 'outline'
}

export function CreateBotButton({ customerId, action, variant = 'default' }: CreateBotButtonProps) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('Nuevo Bot')
  const [pending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  function handleOpen() {
    setName('Nuevo Bot')
    setError(null)
    setOpen(true)
    setTimeout(() => inputRef.current?.select(), 50)
  }

  function handleCreate() {
    if (!name.trim()) return
    setError(null)
    startTransition(async () => {
      const result = await action(customerId, name.trim())
      if (result.status === 'error') {
        setError(result.message)
      } else {
        setOpen(false)
        router.refresh()
      }
    })
  }

  return (
    <>
      <Button variant={variant} size="sm" onClick={handleOpen}>
        <Plus className="size-4 mr-1.5" />
        Nuevo bot
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Bot className="size-4 text-primary" />
              Crear nuevo bot
            </DialogTitle>
            <DialogDescription>
              Ingresa un nombre para identificar este chatbot.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="bot-name">Nombre</Label>
            <Input
              id="bot-name"
              ref={inputRef}
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
              placeholder="Ej. Bot de ventas"
              disabled={pending}
            />
            {error && <p className="text-xs text-destructive">{error}</p>}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)} disabled={pending}>
              Cancelar
            </Button>
            <Button onClick={handleCreate} disabled={pending || !name.trim()}>
              {pending ? 'Creando…' : 'Crear bot'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

type DeleteBotButtonProps = {
  customerId: number
  botId: number
  botName: string
  action: (customerId: number, botId: number) => Promise<BotActionState>
  disabled?: boolean
}

export function DeleteBotButton({ customerId, botId, botName, action, disabled }: DeleteBotButtonProps) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()

  function handleDelete() {
    if (!confirm(`¿Eliminar el bot "${botName}"? Esta acción no se puede deshacer.`)) return
    startTransition(async () => {
      await action(customerId, botId)
      router.refresh()
    })
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      className="shrink-0 text-destructive hover:text-destructive hover:bg-destructive/10"
      onClick={handleDelete}
      disabled={disabled || pending}
      title={disabled ? 'No puedes eliminar el único bot' : 'Eliminar bot'}
    >
      <Trash2 className="size-4" />
    </Button>
  )
}
