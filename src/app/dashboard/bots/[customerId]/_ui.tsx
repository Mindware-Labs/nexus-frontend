'use client'

import { useState, useRef } from 'react'
import { ImagePlus, Loader2, Plus, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { COLOR_PRESETS } from './_shared'

// ── Section / Field ───────────────────────────────────────────────────────────

export function Section({
  id, title, hint, children,
}: {
  id?: string; title: string; hint?: string; children: React.ReactNode
}) {
  return (
    <section id={id} className="rounded-xl border bg-card p-5 space-y-4">
      <div>
        <h2 className="text-sm font-semibold text-foreground">{title}</h2>
        {hint && <p className="mt-0.5 text-xs text-muted-foreground">{hint}</p>}
      </div>
      {children}
    </section>
  )
}

export function Field({
  label, hint, children,
}: {
  label: string; hint?: string; children: React.ReactNode
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-medium text-muted-foreground">{label}</Label>
      {children}
      {hint && <p className="text-xs text-muted-foreground/80">{hint}</p>}
    </div>
  )
}

// ── TagInput ──────────────────────────────────────────────────────────────────

export function TagInput({
  values, onChange, placeholder, type = 'text',
}: {
  values: string[]
  onChange: (v: string[]) => void
  placeholder?: string
  type?: string
}) {
  const [draft, setDraft] = useState('')

  function add() {
    const v = draft.trim()
    if (v && !values.includes(v)) onChange([...values, v])
    setDraft('')
  }

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <Input
          type={type}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); add() } }}
          placeholder={placeholder}
          className="flex-1"
        />
        <Button type="button" variant="outline" size="icon" onClick={add}>
          <Plus className="size-4" />
        </Button>
      </div>
      {values.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {values.map((v) => (
            <span key={v} className="inline-flex items-center gap-1 rounded-full border bg-muted/50 px-2.5 py-0.5 text-xs">
              {v}
              <button type="button" onClick={() => onChange(values.filter((x) => x !== v))} className="text-muted-foreground hover:text-foreground">
                <X className="size-3" />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

// ── ColorPickerField ──────────────────────────────────────────────────────────

export function ColorPickerField({
  value, onChange,
}: {
  value: string
  onChange: (hex: string) => void
}) {
  const nativeRef = useRef<HTMLInputElement>(null)
  const [draft, setDraft] = useState(value)

  const handlePreset = (hex: string) => {
    onChange(hex.toUpperCase())
    setDraft(hex.toUpperCase())
  }

  const handleNative = (e: React.ChangeEvent<HTMLInputElement>) => {
    const hex = e.target.value.toUpperCase()
    onChange(hex)
    setDraft(hex)
  }

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value
    setDraft(raw)
    if (/^#[0-9A-Fa-f]{6}$/.test(raw)) onChange(raw.toUpperCase())
  }

  const handleTextBlur = () => {
    if (!/^#[0-9A-Fa-f]{6}$/.test(draft)) setDraft(value)
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => nativeRef.current?.click()}
          title="Elegir color personalizado"
          className="relative size-10 shrink-0 rounded-xl border-2 border-white shadow-md ring-1 ring-black/10 transition-transform hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring dark:border-white/10"
          style={{ background: value }}
        >
          <input
            ref={nativeRef}
            type="color"
            value={value}
            onChange={handleNative}
            className="sr-only"
            tabIndex={-1}
            aria-hidden
          />
        </button>
        <div className="flex flex-col gap-0.5">
          <input
            type="text"
            value={draft}
            onChange={handleTextChange}
            onBlur={handleTextBlur}
            maxLength={7}
            spellCheck={false}
            placeholder="#522566"
            className="w-32 rounded-md border border-input bg-transparent px-3 py-1.5 font-mono text-sm uppercase shadow-xs outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/40 dark:bg-input/30"
          />
          <span className="text-[10px] text-muted-foreground pl-1">Clic en el cuadro para abrir el selector</span>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {COLOR_PRESETS.map((preset) => {
          const active = preset.hex.toUpperCase() === value.toUpperCase()
          return (
            <button
              key={preset.hex}
              type="button"
              title={preset.label}
              onClick={() => handlePreset(preset.hex)}
              className={[
                'group relative size-7 rounded-lg border-2 shadow-sm transition-all hover:scale-110 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                active
                  ? 'border-white ring-2 ring-offset-1 ring-offset-background scale-110'
                  : 'border-transparent hover:border-white/80 dark:hover:border-white/40',
              ].join(' ')}
              style={{ background: preset.hex }}
            >
              {active && (
                <span className="absolute inset-0 flex items-center justify-center">
                  <svg viewBox="0 0 10 10" className="size-3.5 drop-shadow" fill="none">
                    <path d="M2 5l2.5 2.5L8 3" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              )}
              <span className="pointer-events-none absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-foreground px-1.5 py-0.5 text-[10px] text-background opacity-0 transition-opacity group-hover:opacity-100">
                {preset.label}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

// ── AvatarPickerField ─────────────────────────────────────────────────────────

const AVATAR_EMOJIS = ['🤖', '🦾', '💬', '🧠', '⚡', '🌟', '🎯', '🚀', '🦊', '🐬', '🦋', '💎', '🎩', '🌈', '🔮', '✨']

interface AvatarPickerProps {
  mode: 'icon' | 'emoji' | 'image'
  value: string
  primaryColor: string
  customerId: number
  onChange: (mode: 'icon' | 'emoji' | 'image', value: string) => void
}

export function AvatarPickerField({ mode, value, primaryColor, customerId, onChange }: AvatarPickerProps) {
  const fileRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')

  // Current preview
  const previewUrl = mode === 'image' ? value : null
  const previewEmoji = mode === 'emoji' ? value : null

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    e.target.value = ''

    if (file.size > 2 * 1024 * 1024) {
      setUploadError('El archivo no puede superar 2 MB.')
      return
    }
    if (!['image/jpeg', 'image/png', 'image/webp', 'image/gif'].includes(file.type)) {
      setUploadError('Solo se permiten JPG, PNG, WebP o GIF.')
      return
    }

    setUploadError('')
    setUploading(true)

    try {
      const form = new FormData()
      form.append('file', file)
      const res = await fetch(`/api/bot/${customerId}/avatar`, { method: 'POST', body: form })
      const data = await res.json() as { avatarUrl?: string; message?: string }
      if (!res.ok) throw new Error(data.message ?? 'Error al subir')
      onChange('image', data.avatarUrl!)
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : 'Error al subir la imagen.')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-4">
      {/* Current avatar preview */}
      <div className="flex items-center gap-3">
        <div
          className="size-14 rounded-2xl flex items-center justify-center shrink-0 overflow-hidden border shadow-sm"
          style={{ background: primaryColor }}
        >
          {previewUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={previewUrl} alt="avatar" className="size-full object-cover" />
          ) : previewEmoji ? (
            <span className="text-2xl">{previewEmoji}</span>
          ) : (
            <svg viewBox="0 0 24 24" className="size-7" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="10" rx="2" />
              <circle cx="12" cy="7" r="3" />
              <line x1="8" y1="15" x2="8" y2="15" strokeWidth="2.5" />
              <line x1="12" y1="15" x2="12" y2="15" strokeWidth="2.5" />
              <line x1="16" y1="15" x2="16" y2="15" strokeWidth="2.5" />
            </svg>
          )}
        </div>
        <div className="space-y-0.5">
          <p className="text-sm font-medium text-foreground">
            {mode === 'image' ? 'Imagen personalizada' : mode === 'emoji' ? `Emoji: ${value}` : 'Ícono predeterminado'}
          </p>
          <p className="text-xs text-muted-foreground">
            {mode === 'image' ? 'Subida al bucket de archivos' : 'Elige un emoji o sube tu imagen'}
          </p>
        </div>
        {mode === 'image' && (
          <Button
            type="button" variant="ghost" size="sm"
            onClick={() => onChange('icon', 'bot')}
            className="ml-auto text-xs text-muted-foreground hover:text-destructive"
          >
            <X className="size-3.5 mr-1" />Quitar
          </Button>
        )}
      </div>

      {/* Emoji grid */}
      <div className="space-y-1.5">
        <p className="text-xs font-medium text-muted-foreground">Emojis</p>
        <div className="flex flex-wrap gap-1.5">
          {AVATAR_EMOJIS.map((emoji) => {
            const active = mode === 'emoji' && value === emoji
            return (
              <button
                key={emoji}
                type="button"
                onClick={() => onChange('emoji', emoji)}
                className={[
                  'size-9 rounded-xl text-lg transition-all hover:scale-110 active:scale-95 border',
                  active
                    ? 'border-nexus-purple/50 bg-nexus-purple/10 ring-2 ring-nexus-purple/30 scale-110'
                    : 'border-input bg-background hover:border-muted-foreground/30',
                ].join(' ')}
                title={emoji}
              >
                {emoji}
              </button>
            )
          })}
        </div>
      </div>

      {/* Image upload */}
      <div className="space-y-1.5">
        <p className="text-xs font-medium text-muted-foreground">Imagen propia</p>
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="flex items-center gap-2.5 rounded-xl border border-dashed border-input px-4 py-3 text-sm text-muted-foreground transition-colors hover:border-nexus-purple/50 hover:text-foreground hover:bg-muted/30 disabled:opacity-50 w-full"
        >
          {uploading
            ? <Loader2 className="size-4 animate-spin shrink-0" />
            : <ImagePlus className="size-4 shrink-0" />}
          <span>{uploading ? 'Subiendo…' : 'Subir imagen (JPG, PNG, WebP · máx 2 MB)'}</span>
        </button>
        <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={handleFile} className="sr-only" />
        {uploadError && <p className="text-xs text-destructive">{uploadError}</p>}
      </div>
    </div>
  )
}
