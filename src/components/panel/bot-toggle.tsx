'use client'

import { useState, useTransition } from 'react'
import { Power, Loader2 } from 'lucide-react'
import { toggleBotAction } from '@/app/actions/customer'

export function BotToggle({
  active,
  effective,
}: {
  active: boolean
  effective?: boolean
}) {
  const [isActive, setIsActive] = useState(active)
  const [error, setError] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()

  function onToggle() {
    const next = !isActive
    setError(null)
    setIsActive(next)
    startTransition(async () => {
      try {
        await toggleBotAction(next)
      } catch (e) {
        setIsActive(!next)
        setError(e instanceof Error ? e.message : 'Error al cambiar el estado')
      }
    })
  }

  const blockedByPlatform = isActive && effective === false

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center gap-3">
        <button
          type="button"
          role="switch"
          aria-checked={isActive}
          onClick={onToggle}
          disabled={pending}
          className={[
            'relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors',
            isActive ? 'bg-nexus-mint' : 'bg-muted-foreground/30',
            pending ? 'opacity-60' : '',
          ].join(' ')}
        >
          <span
            className={[
              'inline-block size-5 transform rounded-full bg-white shadow transition-transform',
              isActive ? 'translate-x-5' : 'translate-x-0.5',
            ].join(' ')}
          />
        </button>
        <span className="flex items-center gap-1.5 text-sm font-medium">
          {pending ? (
            <Loader2 className="size-3.5 animate-spin text-muted-foreground" />
          ) : (
            <Power className={`size-3.5 ${isActive ? 'text-nexus-mint' : 'text-muted-foreground'}`} />
          )}
          {isActive ? 'Activo' : 'Pausado'}
        </span>
      </div>
      {blockedByPlatform && (
        <p className="text-xs text-amber-600">
          Activado, pero no disponible: tu cuenta o empresa está inactiva. Contacta a soporte.
        </p>
      )}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  )
}
