'use client'

import { useState, useTransition } from 'react'
import { AlertCircle, CheckCircle2, ExternalLink, FileText, Info, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { savePrivacyAction, type PrivacySettings } from '@/app/actions/privacy'
import { DEFAULT_CONSENT_TEXT, DEFAULT_PRIVACY_POLICY } from '@/lib/default-privacy-policy'

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-medium text-muted-foreground">{label}</Label>
      {children}
      {hint && <p className="text-xs text-muted-foreground/80">{hint}</p>}
    </div>
  )
}

function Textarea({
  value,
  onChange,
  maxLength,
  rows = 5,
  placeholder,
}: {
  value: string
  onChange: (v: string) => void
  maxLength?: number
  rows?: number
  placeholder?: string
}) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      maxLength={maxLength}
      rows={rows}
      placeholder={placeholder}
      className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none resize-y focus:border-ring focus:ring-3 focus:ring-ring/50 dark:bg-input/30"
    />
  )
}

export function PrivacyForm({ settings }: { settings: PrivacySettings }) {
  const [isPending, startTransition] = useTransition()
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const [consentText, setConsentText] = useState(settings.consentText)
  const [privacyPolicyUrl, setPrivacyPolicyUrl] = useState(settings.privacyPolicyUrl)
  const [policyText, setPolicyText] = useState(settings.policyText)
  const [retentionConv, setRetentionConv] = useState(settings.retentionMonthsConversations)
  const [retentionLeads, setRetentionLeads] = useState(settings.retentionMonthsLeads)

  function handleSave() {
    startTransition(async () => {
      const result = await savePrivacyAction({ status: 'idle' } as never, {
        consentText,
        privacyPolicyUrl,
        policyText,
        retentionMonthsConversations: retentionConv,
        retentionMonthsLeads: retentionLeads,
      })
      setStatus(result.status === 'success' ? 'success' : 'error')
      setErrorMsg(result.status === 'error' ? result.message : '')
      if (result.status === 'success') setTimeout(() => setStatus('idle'), 3000)
    })
  }

  const retentionLabel = (months: number) => {
    if (months < 12) return `${months} mes${months > 1 ? 'es' : ''}`
    const y = Math.floor(months / 12)
    const m = months % 12
    return `${y} año${y > 1 ? 's' : ''}${m > 0 ? ` y ${m} mes${m > 1 ? 'es' : ''}` : ''}`
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Aviso de impacto global */}
      <div className="flex items-start gap-2.5 rounded-xl border border-amber-500/40 bg-amber-500/8 px-4 py-3 text-sm text-amber-700 dark:text-amber-400">
        <Info className="mt-0.5 size-4 shrink-0" />
        <span>
          Cualquier cambio aquí se propaga automáticamente a <strong>todos los chatbots activos</strong> sin
          necesidad de reconfigurar cada cliente.
        </span>
      </div>

      {/* Feedback */}
      {status === 'success' && (
        <div className="flex items-center gap-2 rounded-xl border border-green-500/30 bg-green-500/5 px-4 py-3 text-sm text-green-700 dark:text-green-400">
          <CheckCircle2 className="size-4 shrink-0" />
          Política guardada y propagada a todos los chatbots.
        </div>
      )}
      {status === 'error' && (
        <div className="flex items-start gap-2 rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          <AlertCircle className="mt-0.5 size-4 shrink-0" />
          {errorMsg || 'Error al guardar.'}
        </div>
      )}

      {/* DAT-02: texto de consentimiento (breve, para el widget y el bot) */}
      <section className="rounded-xl border bg-card p-5 space-y-4">
        <div>
          <h2 className="text-sm font-semibold">DAT-02 · Aviso de consentimiento</h2>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Texto corto que el widget muestra antes de pedir datos de contacto.
            También se inyecta en el system prompt de todos los bots.
          </p>
        </div>

        <Field label="Texto de consentimiento" hint="Máximo 2 000 caracteres.">
          <Textarea
            value={consentText}
            onChange={setConsentText}
            maxLength={2000}
            rows={4}
            placeholder="Al continuar aceptas que tus datos sean tratados conforme a nuestra Política de Privacidad."
          />
          <div className="flex items-center justify-between mt-1">
            <button
              type="button"
              onClick={() => setConsentText(DEFAULT_CONSENT_TEXT)}
              className="inline-flex items-center gap-1 text-xs text-nexus-purple hover:underline"
            >
              <RotateCcw className="size-3" />
              Cargar texto base (Ley 172-13)
            </button>
            <p className="text-xs text-muted-foreground">{consentText.length} / 2 000</p>
          </div>
        </Field>

        <Field label="URL de la política completa" hint="Enlace externo al documento. Se adjunta en el widget como 'Leer más'.">
          <div className="flex gap-2">
            <Input
              type="url"
              value={privacyPolicyUrl}
              onChange={(e) => setPrivacyPolicyUrl(e.target.value)}
              maxLength={500}
              placeholder="https://tuempresa.com/privacidad"
              className="flex-1"
            />
            {privacyPolicyUrl && (
              <a
                href={privacyPolicyUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center size-10 rounded-md border border-input bg-background hover:bg-muted transition-colors"
                title="Abrir enlace"
              >
                <ExternalLink className="size-4 text-muted-foreground" />
              </a>
            )}
          </div>
        </Field>
      </section>

      {/* Texto completo de la política */}
      <section className="rounded-xl border bg-card p-5 space-y-4">
        <div>
          <h2 className="text-sm font-semibold">Texto completo de la política de privacidad</h2>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Documento completo que se muestra a los clientes en su panel. No se inyecta en el
            prompt del bot — es solo para consulta y cumplimiento legal.
          </p>
        </div>

        <Field label="Contenido de la política" hint="Máximo 50 000 caracteres. Puedes usar saltos de línea para separar secciones.">
          <Textarea
            value={policyText}
            onChange={setPolicyText}
            maxLength={50000}
            rows={22}
            placeholder="1. RESPONSABLE DEL TRATAMIENTO&#10;&#10;Nombre de la empresa..."
          />
          <div className="flex items-center justify-between mt-1">
            <button
              type="button"
              onClick={() => setPolicyText(DEFAULT_PRIVACY_POLICY)}
              className="inline-flex items-center gap-1 text-xs text-nexus-purple hover:underline"
            >
              <FileText className="size-3" />
              Cargar política base (Ley 172-13 RD)
            </button>
            <p className="text-xs text-muted-foreground">
              {policyText.length.toLocaleString()} / 50 000
            </p>
          </div>
        </Field>
      </section>

      {/* DAT-01: retención de datos */}
      <section className="rounded-xl border bg-card p-5 space-y-4">
        <div>
          <h2 className="text-sm font-semibold">DAT-01 · Retención de datos</h2>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Períodos máximos de conservación antes de eliminar o anonimizar datos.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Conversaciones (meses)">
            <div className="flex items-center gap-3">
              <input
                type="range" min={1} max={120} step={1} value={retentionConv}
                onChange={(e) => setRetentionConv(Number(e.target.value))}
                className="flex-1 accent-nexus-purple"
              />
              <Input
                type="number" min={1} max={120} value={retentionConv}
                onChange={(e) => setRetentionConv(Math.max(1, Math.min(120, Number(e.target.value))))}
                className="w-20 text-center"
              />
            </div>
            <p className="text-xs text-muted-foreground">{retentionLabel(retentionConv)}</p>
          </Field>

          <Field label="Leads / Contactos (meses)">
            <div className="flex items-center gap-3">
              <input
                type="range" min={1} max={120} step={1} value={retentionLeads}
                onChange={(e) => setRetentionLeads(Number(e.target.value))}
                className="flex-1 accent-nexus-purple"
              />
              <Input
                type="number" min={1} max={120} value={retentionLeads}
                onChange={(e) => setRetentionLeads(Math.max(1, Math.min(120, Number(e.target.value))))}
                className="w-20 text-center"
              />
            </div>
            <p className="text-xs text-muted-foreground">{retentionLabel(retentionLeads)}</p>
          </Field>
        </div>

        <div className="flex items-start gap-2 rounded-lg border border-blue-200 bg-blue-50 dark:border-blue-900/40 dark:bg-blue-950/20 px-3 py-2 text-xs text-blue-700 dark:text-blue-300">
          <Info className="mt-0.5 size-3.5 shrink-0" />
          La purga automática de datos (cron job) se implementa en DAT-01 fase 2.
        </div>
      </section>

      {settings.updatedAt && (
        <p className="text-xs text-muted-foreground">
          Última actualización:{' '}
          {new Date(settings.updatedAt).toLocaleString('es', { dateStyle: 'medium', timeStyle: 'short' })}
        </p>
      )}

      <div className="flex justify-end pb-2">
        <Button
          type="button"
          disabled={isPending}
          onClick={handleSave}
          className="bg-nexus-purple text-white hover:bg-nexus-purple/85 disabled:opacity-50"
        >
          {isPending ? 'Guardando…' : 'Guardar política'}
        </Button>
      </div>
    </div>
  )
}
