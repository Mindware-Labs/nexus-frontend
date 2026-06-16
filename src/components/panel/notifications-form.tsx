'use client'

import { useState } from 'react'
import { useFormStatus } from 'react-dom'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { saveNotificationsAction, type CustomerBotConfig } from '@/app/actions/customer'

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" disabled={pending}>
      {pending ? <Loader2 className="size-4 animate-spin" /> : 'Guardar preferencias'}
    </Button>
  )
}

export function NotificationsForm({ config }: { config: CustomerBotConfig }) {
  const [notifyOnLead, setNotifyOnLead] = useState(config.notifyOnLead)

  return (
    <form action={saveNotificationsAction} className="space-y-5">
      <input type="hidden" name="notifyOnLead" value={notifyOnLead ? 'true' : 'false'} />

      {/* CUS-28 */}
      <label className="flex items-start gap-3">
        <button
          type="button"
          role="switch"
          aria-checked={notifyOnLead}
          onClick={() => setNotifyOnLead((v) => !v)}
          className={[
            'relative mt-0.5 inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors',
            notifyOnLead ? 'bg-nexus-mint' : 'bg-muted-foreground/30',
          ].join(' ')}
        >
          <span
            className={[
              'inline-block size-5 transform rounded-full bg-white shadow transition-transform',
              notifyOnLead ? 'translate-x-5' : 'translate-x-0.5',
            ].join(' ')}
          />
        </button>
        <span>
          <span className="block text-sm font-medium">Notificarme por email cuando se capture un lead</span>
          <span className="block text-xs text-muted-foreground">Recibirás el detalle del lead en cuanto el bot lo capture.</span>
        </span>
      </label>

      {/* CUS-29 */}
      <label className="block">
        <span className="mb-1.5 block text-sm font-medium">Resumen de actividad por email</span>
        <select
          name="summaryFrequency"
          defaultValue={config.summaryFrequency}
          className="w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:border-nexus-purple sm:max-w-xs"
        >
          <option value="none">No enviar</option>
          <option value="daily">Diario</option>
          <option value="weekly">Semanal</option>
        </select>
      </label>

      <label className="block">
        <span className="mb-1.5 block text-sm font-medium">Emails de notificación</span>
        <textarea
          name="notificationEmails"
          defaultValue={config.notificationEmails.join('\n')}
          rows={2}
          placeholder="ventas@empresa.com"
          className="w-full rounded-lg border bg-background p-3 text-sm outline-none focus:border-nexus-purple"
        />
        <span className="mt-1 block text-xs text-muted-foreground">
          Separados por coma o salto de línea. Si está vacío, se usa tu correo de cuenta.
        </span>
      </label>

      <div className="flex justify-end">
        <SubmitButton />
      </div>
    </form>
  )
}
