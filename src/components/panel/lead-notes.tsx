'use client'

import { useState, useTransition } from 'react'
import { Check, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { updateLeadNotesAction } from '@/app/actions/customer'

export function LeadNotes({ id, initialNotes }: { id: string; initialNotes: string | null }) {
  const [notes, setNotes] = useState(initialNotes ?? '')
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()

  function save() {
    setError(null)
    setSaved(false)
    startTransition(async () => {
      try {
        await updateLeadNotesAction(id, notes)
        setSaved(true)
        setTimeout(() => setSaved(false), 2000)
      } catch (e) {
        setError(e instanceof Error ? e.message : 'No se pudo guardar')
      }
    })
  }

  return (
    <div className="space-y-2">
      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        rows={5}
        placeholder="Notas internas sobre este lead (solo las ve tu equipo)…"
        className="w-full resize-y rounded-lg border bg-background p-3 text-sm outline-none focus:border-nexus-purple"
      />
      <div className="flex items-center gap-3">
        <Button size="sm" onClick={save} disabled={pending}>
          {pending ? <Loader2 className="size-4 animate-spin" /> : 'Guardar notas'}
        </Button>
        {saved && (
          <span className="flex items-center gap-1 text-xs text-emerald-600">
            <Check className="size-3.5" /> Guardado
          </span>
        )}
        {error && <span className="text-xs text-destructive">{error}</span>}
      </div>
    </div>
  )
}
