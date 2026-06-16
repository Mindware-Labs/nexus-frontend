'use client'

import { useState, useTransition } from 'react'
import { Loader2 } from 'lucide-react'
import { updateLeadStatusAction, type LeadStatus } from '@/app/actions/customer'

const OPTIONS: { value: LeadStatus; label: string }[] = [
  { value: 'nuevo', label: 'Nuevo' },
  { value: 'en_proceso', label: 'En proceso' },
  { value: 'cerrado_ganado', label: 'Ganado' },
  { value: 'cerrado_perdido', label: 'Perdido' },
]

const STYLES: Record<LeadStatus, string> = {
  nuevo: 'border-nexus-lavender/40 bg-nexus-lavender/10 text-nexus-purple',
  en_proceso: 'border-amber-200 bg-amber-50 text-amber-700',
  cerrado_ganado: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  cerrado_perdido: 'border-red-200 bg-red-50 text-red-700',
}

export function LeadStatusSelect({
  id,
  status,
}: {
  id: string
  status: LeadStatus
}) {
  const [value, setValue] = useState<LeadStatus>(status)
  const [pending, startTransition] = useTransition()

  function onChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const next = e.target.value as LeadStatus
    const prev = value
    setValue(next)
    startTransition(async () => {
      try {
        await updateLeadStatusAction(id, next)
      } catch {
        setValue(prev)
      }
    })
  }

  return (
    <div className="inline-flex items-center gap-1.5">
      <select
        value={value}
        onChange={onChange}
        disabled={pending}
        className={`rounded-full border px-2.5 py-1 text-xs font-medium outline-none ${STYLES[value]}`}
        onClick={(e) => e.stopPropagation()}
      >
        {OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      {pending && <Loader2 className="size-3 animate-spin text-muted-foreground" />}
    </div>
  )
}
