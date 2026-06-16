'use client'

import { useState, useTransition } from 'react'
import { Star } from 'lucide-react'
import { toggleRelevantAction } from '@/app/actions/customer'

export function RelevantToggle({
  id,
  relevant,
  withLabel = false,
}: {
  id: string
  relevant: boolean
  withLabel?: boolean
}) {
  const [value, setValue] = useState(relevant)
  const [pending, startTransition] = useTransition()

  function onToggle(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    const next = !value
    setValue(next)
    startTransition(async () => {
      try {
        await toggleRelevantAction(id, next)
      } catch {
        setValue(!next)
      }
    })
  }

  return (
    <button
      type="button"
      onClick={onToggle}
      disabled={pending}
      title={value ? 'Quitar de relevantes' : 'Marcar como relevante'}
      className={[
        'inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-xs transition-colors',
        value ? 'text-amber-500' : 'text-muted-foreground hover:text-amber-500',
      ].join(' ')}
    >
      <Star className={`size-4 ${value ? 'fill-amber-400' : ''}`} />
      {withLabel && (value ? 'Relevante' : 'Marcar relevante')}
    </button>
  )
}
