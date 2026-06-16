'use client'

import { useState } from 'react'
import { useFormStatus } from 'react-dom'
import { Loader2, Upload } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { savePresentationAction, uploadAvatarAction, type CustomerBotConfig } from '@/app/actions/customer'

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" disabled={pending}>
      {pending ? <Loader2 className="size-4 animate-spin" /> : 'Guardar cambios'}
    </Button>
  )
}

const AVATAR_MODES = [
  { value: 'icon', label: 'Ícono' },
  { value: 'emoji', label: 'Emoji' },
  { value: 'image', label: 'Imagen' },
] as const

export function PresentationForm({ config }: { config: CustomerBotConfig }) {
  const [avatarMode, setAvatarMode] = useState(config.avatarMode)
  const [avatarValue, setAvatarValue] = useState(config.avatarValue)
  const [color, setColor] = useState(config.widgetPrimaryColor)
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    setUploadError(null)
    try {
      const fd = new FormData()
      fd.append('file', file)
      const { avatarUrl } = await uploadAvatarAction(fd)
      setAvatarValue(avatarUrl)
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : 'Error al subir la imagen')
    }
    setUploading(false)
  }

  return (
    <form action={savePresentationAction} className="space-y-5">
      <input type="hidden" name="avatarMode" value={avatarMode} />
      <input type="hidden" name="avatarValue" value={avatarValue} />
      <input type="hidden" name="widgetPrimaryColor" value={color} />

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Nombre del asistente">
          <input
            name="assistantName"
            defaultValue={config.assistantName}
            required
            maxLength={80}
            className="pf-input"
          />
        </Field>

        <Field label="Texto del botón (launcher)">
          <input name="launcherText" defaultValue={config.launcherText} required maxLength={60} className="pf-input" />
        </Field>
      </div>

      {/* Avatar */}
      <Field label="Avatar del bot">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex gap-1 rounded-lg border bg-muted/40 p-1">
            {AVATAR_MODES.map((m) => (
              <button
                key={m.value}
                type="button"
                onClick={() => setAvatarMode(m.value)}
                className={[
                  'rounded-md px-3 py-1.5 text-xs font-medium',
                  avatarMode === m.value ? 'bg-nexus-purple text-white' : 'text-muted-foreground',
                ].join(' ')}
              >
                {m.label}
              </button>
            ))}
          </div>

          {avatarMode === 'emoji' && (
            <input
              value={avatarValue}
              onChange={(e) => setAvatarValue(e.target.value)}
              placeholder="🤖"
              maxLength={4}
              className="pf-input w-20 text-center text-lg"
            />
          )}
          {avatarMode === 'icon' && (
            <select value={avatarValue} onChange={(e) => setAvatarValue(e.target.value)} className="pf-input w-44">
              <option value="sparkles">Sparkles</option>
              <option value="message-circle">Message Circle</option>
              <option value="bot">Bot</option>
              <option value="zap">Zap</option>
            </select>
          )}
          {avatarMode === 'image' && (
            <div className="flex items-center gap-3">
              {avatarValue && <img src={avatarValue} alt="avatar" className="size-10 rounded-full object-cover" />}
              <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border bg-background px-3 py-1.5 text-xs font-medium hover:bg-muted">
                {uploading ? <Loader2 className="size-3.5 animate-spin" /> : <Upload className="size-3.5" />}
                Subir imagen
                <input type="file" accept="image/*" onChange={onFile} className="hidden" />
              </label>
            </div>
          )}
        </div>
        {uploadError && <p className="mt-1 text-xs text-destructive">{uploadError}</p>}
      </Field>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Color principal del widget">
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="size-9 cursor-pointer rounded border bg-background"
            />
            <input
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="pf-input w-28 font-mono uppercase"
              maxLength={9}
            />
          </div>
        </Field>

        <Field label="Posición del widget">
          <select name="widgetPosition" defaultValue={config.widgetPosition} className="pf-input">
            <option value="right">Derecha</option>
            <option value="left">Izquierda</option>
          </select>
        </Field>
      </div>

      <Field label="Mensaje de bienvenida">
        <textarea name="welcomeMessage" defaultValue={config.welcomeMessage} required rows={2} maxLength={500} className="pf-input" />
      </Field>

      <Field label="Mensaje de cierre">
        <textarea name="closingMessage" defaultValue={config.closingMessage} required rows={2} maxLength={500} className="pf-input" />
      </Field>

      <Field label="Emails de notificación de leads" hint="Separados por coma o salto de línea">
        <textarea
          name="notificationEmails"
          defaultValue={config.notificationEmails.join('\n')}
          rows={2}
          className="pf-input"
          placeholder="ventas@empresa.com"
        />
      </Field>

      <div className="flex justify-end">
        <SubmitButton />
      </div>

      <style>{`
        .pf-input {
          width: 100%;
          border-radius: 0.5rem;
          border: 1px solid var(--border, #e4e4e7);
          background: var(--background, #fff);
          padding: 0.5rem 0.75rem;
          font-size: 0.875rem;
          outline: none;
        }
        .pf-input:focus { border-color: #522566; }
      `}</style>
    </form>
  )
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-foreground">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-xs text-muted-foreground">{hint}</span>}
    </label>
  )
}
