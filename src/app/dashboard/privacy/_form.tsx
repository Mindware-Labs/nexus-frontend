'use client'

import { useState, useTransition } from 'react'
import {
  AlertCircle,
  CheckCircle2,
  ExternalLink,
  FileText,
  Globe,
  Info,
  LockKeyhole,
  MessagesSquare,
  RefreshCcw,
  RotateCcw,
  ShieldCheck,
  TimerReset,
} from 'lucide-react'
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
      className="w-full resize-y rounded-[1.15rem] border border-[#E4D8EC] bg-[#FCFAFE] px-4 py-3 text-sm leading-6 text-[#24132D] shadow-xs outline-none transition focus:border-[#AD74C3] focus:ring-3 focus:ring-[#AD74C3]/15"
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

  const consentIsDefault = consentText.trim() === DEFAULT_CONSENT_TEXT.trim()
  const policyIsDefault = policyText.trim() === DEFAULT_PRIVACY_POLICY.trim()
  const hasPolicyUrl = Boolean(privacyPolicyUrl.trim())
  const latestUpdate = settings.updatedAt
    ? new Date(settings.updatedAt).toLocaleString('es', { dateStyle: 'medium', timeStyle: 'short' })
    : 'Sin registro todavia'

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
    return `${y} ano${y > 1 ? 's' : ''}${m > 0 ? ` y ${m} mes${m > 1 ? 'es' : ''}` : ''}`
  }

  return (
    <div className="grid flex-1 gap-4 xl:grid-rows-[auto_minmax(0,1fr)]">
      <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <StatusCard
          icon={<MessagesSquare className="size-4 text-[#522566]" />}
          label="Consentimiento"
          value={consentIsDefault ? 'Base legal' : 'Personalizado'}
          description={consentIsDefault ? 'Usando texto recomendado de referencia.' : 'Editado para el flujo actual.'}
          tone="lilac"
        />
        <StatusCard
          icon={<Globe className="size-4 text-[#522566]" />}
          label="Enlace externo"
          value={hasPolicyUrl ? 'Publicado' : 'Pendiente'}
          description={hasPolicyUrl ? 'El widget puede derivar al documento completo.' : 'Falta exponer una URL publica.'}
          tone="white"
        />
        <StatusCard
          icon={<LockKeyhole className="size-4 text-[#34D399]" />}
          label="Retencion"
          value={`${retentionConv} / ${retentionLeads} meses`}
          description="Conversaciones y leads gobernados desde un solo punto."
          tone="mint"
        />
        <StatusCard
          icon={<ShieldCheck className="size-4 text-[#FB7185]" />}
          label="Version legal"
          value={policyIsDefault ? 'Plantilla base' : 'Documento ajustado'}
          description="El texto largo se expone en panel y cumplimiento."
          tone="coral"
        />
      </section>

      <div className="min-h-0">
        <div className="min-h-0 rounded-[2rem] border border-[#DED0E8] bg-[linear-gradient(180deg,#FCF8FE_0%,#F6F0FA_100%)] p-3 shadow-[0_24px_80px_rgba(82,37,102,0.08)]">
          <div className="grid gap-3 xl:grid-rows-[auto_auto_minmax(0,1fr)]">
            <div className="flex items-start gap-2.5 rounded-[1.4rem] border border-amber-500/35 bg-[linear-gradient(135deg,rgba(251,191,36,0.14),rgba(255,255,255,0.78))] px-4 py-3 text-sm text-amber-900">
              <Info className="mt-0.5 size-4 shrink-0" />
              <span>
                Cualquier cambio aqui se propaga automaticamente a <strong>todos los chatbots activos</strong> sin
                tener que editar cliente por cliente.
              </span>
            </div>

            {(status === 'success' || status === 'error') && (
              <div
                className={`flex items-start gap-2 rounded-[1.4rem] px-4 py-3 text-sm ${
                  status === 'success'
                    ? 'border border-green-500/30 bg-green-500/5 text-green-700 dark:text-green-400'
                    : 'border border-destructive/30 bg-destructive/5 text-destructive'
                }`}
              >
                {status === 'success' ? (
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0" />
                ) : (
                  <AlertCircle className="mt-0.5 size-4 shrink-0" />
                )}
                {status === 'success' ? 'Politica guardada y propagada a todos los chatbots.' : errorMsg || 'Error al guardar.'}
              </div>
            )}

            <div className="grid min-h-0 gap-3 xl:grid-cols-[minmax(0,1fr)_minmax(300px,0.92fr)]">
              <div className="grid min-h-0 gap-3 xl:grid-rows-[auto_minmax(0,1fr)_auto]">
                <section className="rounded-[1.6rem] border border-[#E4D8EC] bg-white p-5 shadow-[0_18px_60px_rgba(82,37,102,0.08)] sm:p-6">
                  <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_17rem]">
                    <div className="space-y-4">
                      <SectionHeading
                        eyebrow="DAT-02"
                        title="Aviso de consentimiento"
                        description="Texto breve que el widget muestra antes de solicitar datos. Tambien se inyecta en el system prompt de todos los bots."
                      />

                      <Field label="Texto de consentimiento" hint="Maximo 2 000 caracteres.">
                        <Textarea
                          value={consentText}
                          onChange={setConsentText}
                          maxLength={2000}
                          rows={5}
                          placeholder="Al continuar aceptas que tus datos sean tratados conforme a nuestra Politica de Privacidad."
                        />
                        <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
                          <button
                            type="button"
                            onClick={() => setConsentText(DEFAULT_CONSENT_TEXT)}
                            className="inline-flex items-center gap-1 rounded-full bg-[#F8EDFB] px-3 py-1.5 text-xs font-medium text-nexus-purple transition-colors hover:bg-[#F0DDF7]"
                          >
                            <RotateCcw className="size-3" />
                            Cargar texto base
                          </button>
                          <p className="text-xs text-muted-foreground">{consentText.length} / 2 000</p>
                        </div>
                      </Field>

                      <Field label="URL de la politica completa" hint="Se adjunta en el widget como acceso a la version externa o ampliada.">
                        <div className="flex gap-2">
                          <Input
                            type="url"
                            value={privacyPolicyUrl}
                            onChange={(e) => setPrivacyPolicyUrl(e.target.value)}
                            maxLength={500}
                            placeholder="https://tuempresa.com/privacidad"
                            className="h-11 rounded-xl border-[#E4D8EC] bg-[#FCFAFE] px-4"
                          />
                          {privacyPolicyUrl && (
                            <a
                              href={privacyPolicyUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex size-11 items-center justify-center rounded-xl border border-[#E4D8EC] bg-[#FCFAFE] transition-colors hover:bg-[#F8EDFB]"
                              title="Abrir enlace"
                            >
                              <ExternalLink className="size-4 text-muted-foreground" />
                            </a>
                          )}
                        </div>
                      </Field>
                    </div>

                    <aside className="rounded-[1.4rem] border border-[#E9DFF0] bg-[linear-gradient(180deg,#FCF8FE_0%,#F8EDFB_100%)] p-5">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#8B6D98]">Lectura rapida</p>
                      <div className="mt-4 space-y-3 text-sm text-[#4B3755]">
                        <ChecklistItem
                          title="Visible antes del lead"
                          description="El consentimiento debe anticiparse a la captura de contacto."
                        />
                        <ChecklistItem
                          title="Copy corto y claro"
                          description="Explica finalidad, responsable y via para ejercer derechos."
                        />
                        <ChecklistItem
                          title="Documento ampliado"
                          description="La URL externa cubre detalle legal sin sobrecargar el widget."
                        />
                      </div>
                    </aside>
                  </div>
                </section>

                <section className="min-h-0 rounded-[1.6rem] border border-[#E4D8EC] bg-white p-5 shadow-[0_18px_60px_rgba(82,37,102,0.08)] sm:p-6">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <SectionHeading
                      eyebrow="Documento maestro"
                      title="Texto completo de la politica"
                      description="Version integral visible para clientes y compliance. No entra al prompt del bot."
                    />
                    <div className="rounded-2xl border border-[#E9DFF0] bg-[#FCFAFE] px-4 py-3 text-right">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#8B6D98]">Longitud actual</p>
                      <p className="mt-1 text-lg font-semibold text-[#3D1A4E]">{policyText.length.toLocaleString()} caracteres</p>
                    </div>
                  </div>

                  <div className="mt-4 flex h-[clamp(22rem,38vh,34rem)] min-h-0 flex-col">
                    <Field label="Contenido de la politica" hint="Maximo 50 000 caracteres. Puedes usar saltos de linea para estructurar secciones.">
                      <div className="flex min-h-0 flex-1 flex-col">
                        <Textarea
                          value={policyText}
                          onChange={setPolicyText}
                          maxLength={50000}
                          rows={18}
                          placeholder="1. RESPONSABLE DEL TRATAMIENTO&#10;&#10;Nombre de la empresa..."
                        />
                      </div>
                      <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
                        <button
                          type="button"
                          onClick={() => setPolicyText(DEFAULT_PRIVACY_POLICY)}
                          className="inline-flex items-center gap-1 rounded-full bg-[#F8EDFB] px-3 py-1.5 text-xs font-medium text-nexus-purple transition-colors hover:bg-[#F0DDF7]"
                        >
                          <FileText className="size-3" />
                          Cargar politica base
                        </button>
                        <p className="text-xs text-muted-foreground">
                          {policyText.length.toLocaleString()} / 50 000
                        </p>
                      </div>
                    </Field>
                  </div>
                </section>

                <section className="rounded-[1.6rem] border border-[#E4D8EC] bg-white p-5 shadow-[0_18px_60px_rgba(82,37,102,0.08)] sm:p-6">
                  <SectionHeading
                    eyebrow="DAT-01"
                    title="Retencion de datos"
                    description="Define cuanto tiempo se conservan conversaciones y leads antes de eliminar o anonimizar."
                  />

                  <div className="mt-4 grid gap-3 lg:grid-cols-2">
                    <RetentionCard
                      label="Conversaciones"
                      value={retentionConv}
                      readable={retentionLabel(retentionConv)}
                      onChange={setRetentionConv}
                    />
                    <RetentionCard
                      label="Leads / Contactos"
                      value={retentionLeads}
                      readable={retentionLabel(retentionLeads)}
                      onChange={setRetentionLeads}
                    />
                  </div>

                  <div className="mt-4 flex items-start gap-2 rounded-2xl border border-blue-200 bg-blue-50 px-3 py-2 text-xs text-blue-700">
                    <Info className="mt-0.5 size-3.5 shrink-0" />
                    La purga automatica de datos (cron job) se implementa en DAT-01 fase 2.
                  </div>
                </section>
              </div>

              <aside className="grid gap-3 xl:grid-rows-[auto_auto_1fr]">
                <section className="rounded-[1.6rem] border border-[#DCCCE8] bg-[linear-gradient(180deg,#FFFFFF_0%,#FCF7FE_100%)] p-5 shadow-[0_18px_60px_rgba(82,37,102,0.08)]">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#8B6D98]">Estado de publicacion</p>
                  <div className="mt-4 space-y-3">
                    <SideMetric
                      icon={<RefreshCcw className="size-4 text-[#522566]" />}
                      title="Ultima actualizacion"
                      value={latestUpdate}
                    />
                    <SideMetric
                      icon={<Globe className="size-4 text-[#522566]" />}
                      title="Politica externa"
                      value={hasPolicyUrl ? 'Con URL configurada' : 'Sin URL configurada'}
                    />
                    <SideMetric
                      icon={<TimerReset className="size-4 text-[#522566]" />}
                      title="Ventana total"
                      value={`${retentionLabel(retentionConv)} / ${retentionLabel(retentionLeads)}`}
                    />
                  </div>
                </section>

                <section className="rounded-[1.6rem] border border-[#E4D8EC] bg-white p-5 shadow-[0_18px_60px_rgba(82,37,102,0.08)]">
                  <SectionHeading
                    eyebrow="Marco visual"
                    title="Criterio de interfaz"
                    description="Se mantiene Hanken Grotesk, paneles lila claros y acentos Nexus para un tono formal y corporativo."
                  />
                </section>

                <section className="rounded-[1.6rem] border border-[#D7C2E4] bg-[linear-gradient(135deg,#3D1A4E_0%,#522566_100%)] p-5 text-white shadow-[0_24px_70px_rgba(61,26,78,0.24)]">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/60">Publicar cambios</p>
                  <p className="mt-3 text-sm leading-6 text-white/78">
                    Cuando guardes, el texto se replica en toda la plataforma y actualiza el estado legal global.
                  </p>
                  <div className="mt-5 flex flex-col gap-3">
                    <Button
                      type="button"
                      disabled={isPending}
                      onClick={handleSave}
                      className="h-11 rounded-xl bg-white text-[#3D1A4E] hover:bg-white/90 disabled:opacity-50"
                    >
                      {isPending ? 'Guardando...' : 'Guardar politica'}
                    </Button>
                    <p className="text-xs leading-5 text-white/62">
                      Recomendacion: validar URL externa y texto ARCO antes de publicar.
                    </p>
                  </div>
                </section>
              </aside>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function StatusCard({
  icon,
  label,
  value,
  description,
  tone,
}: {
  icon: React.ReactNode
  label: string
  value: string
  description: string
  tone: 'lilac' | 'white' | 'mint' | 'coral'
}) {
  const toneMap = {
    lilac: 'border-[#E2D2EC] bg-[linear-gradient(180deg,#FFFFFF_0%,#FAF2FD_100%)]',
    white: 'border-[#E6DCEC] bg-white',
    mint: 'border-[#CDEFE1] bg-[linear-gradient(180deg,#FFFFFF_0%,#F3FFFA_100%)]',
    coral: 'border-[#F6D5DA] bg-[linear-gradient(180deg,#FFFFFF_0%,#FFF7F8_100%)]',
  }

  return (
    <div className={`rounded-[1.5rem] border p-4 shadow-[0_12px_40px_rgba(82,37,102,0.06)] ${toneMap[tone]}`}>
      <div className="flex items-center justify-between gap-3">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#8B6D98]">{label}</p>
        <div className="flex size-9 items-center justify-center rounded-xl bg-white shadow-sm">{icon}</div>
      </div>
      <p className="mt-4 text-lg font-semibold text-[#3D1A4E]">{value}</p>
      <p className="mt-1 text-sm leading-5 text-[#6E5A78]">{description}</p>
    </div>
  )
}

function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string
  title: string
  description: string
}) {
  return (
    <div>
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#8B6D98]">{eyebrow}</p>
      <h2 className="mt-2 text-xl font-semibold tracking-tight text-[#24132D]">{title}</h2>
      <p className="mt-1 text-sm leading-6 text-muted-foreground">{description}</p>
    </div>
  )
}

function ChecklistItem({ title, description }: { title: string; description: string }) {
  return (
    <div className="rounded-2xl border border-white/70 bg-white/75 p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.45)]">
      <div className="flex items-start gap-3">
        <span className="mt-0.5 flex size-5 items-center justify-center rounded-full bg-[#522566] text-white">
          <CheckCircle2 className="size-3" />
        </span>
        <div>
          <p className="font-medium text-[#3D1A4E]">{title}</p>
          <p className="mt-1 text-xs leading-5 text-[#6E5A78]">{description}</p>
        </div>
      </div>
    </div>
  )
}

function RetentionCard({
  label,
  value,
  readable,
  onChange,
}: {
  label: string
  value: number
  readable: string
  onChange: (value: number) => void
}) {
  return (
    <div className="rounded-[1.5rem] border border-[#E9DFF0] bg-[linear-gradient(180deg,#FFFFFF_0%,#FCF8FE_100%)] p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-[#24132D]">{label}</p>
          <p className="mt-1 text-xs text-muted-foreground">{readable}</p>
        </div>
        <div className="rounded-2xl bg-[#F3E7F8] px-3 py-2 text-right">
          <p className="text-xl font-semibold leading-none text-[#522566]">{value}</p>
          <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#8B6D98]">meses</p>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-3">
        <input
          type="range"
          min={1}
          max={120}
          step={1}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="flex-1 accent-nexus-purple"
        />
        <Input
          type="number"
          min={1}
          max={120}
          value={value}
          onChange={(e) => onChange(Math.max(1, Math.min(120, Number(e.target.value))))}
          className="h-11 w-24 rounded-xl border-[#E4D8EC] bg-white text-center"
        />
      </div>
    </div>
  )
}

function SideMetric({
  icon,
  title,
  value,
}: {
  icon: React.ReactNode
  title: string
  value: string
}) {
  return (
    <div className="rounded-2xl border border-[#E9DFF0] bg-white/80 p-4">
      <div className="flex items-center gap-3">
        <div className="flex size-9 items-center justify-center rounded-xl bg-[#F8EDFB]">{icon}</div>
        <div>
          <p className="text-xs font-medium text-[#8B6D98]">{title}</p>
          <p className="mt-1 text-sm font-semibold leading-5 text-[#24132D]">{value}</p>
        </div>
      </div>
    </div>
  )
}
