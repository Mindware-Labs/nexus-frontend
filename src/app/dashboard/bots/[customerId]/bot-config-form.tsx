'use client'

import { useState, useTransition } from 'react'
import { AlertCircle, Bot, CheckCircle2, Copy, Minus, Plus, Power, PowerOff } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import {
  toggleBotActiveAction,
  updateBotConfigAction,
  type BotConfig,
} from '@/app/actions/bot'

import type { ProductItem, RuleItem, PricingItem, QuestionItem, ContactField, ScoringCriterion } from './_shared'
import { SUPPORTED_LANGUAGES, TEMPERATURE_OPTIONS } from './_shared'
import { Section, Field, TagInput, ColorPickerField } from './_ui'
import { ProductsList, RulesList, PricingList, QuestionsList } from './_lists'
import { PreviewDialog, WidgetPreviewDialog } from './_dialogs'

// ── Main form ─────────────────────────────────────────────────────────────────

export function BotConfigForm({ config, customerId }: { config: BotConfig; customerId: number }) {
  const [isPending, startTransition] = useTransition()
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [saveMsg, setSaveMsg] = useState('')
  const [isToggling, startToggle] = useTransition()
  const [copied, setCopied] = useState(false)

  // ── State ───────────────────────────────────────────────────────────────────
  const [assistantName, setAssistantName]     = useState(config.assistantName)
  const [avatarMode, setAvatarMode]           = useState(config.avatarMode)
  const [avatarValue, setAvatarValue]         = useState(config.avatarValue)
  const [welcomeMessage, setWelcomeMessage]   = useState(config.welcomeMessage)
  const [supportedLanguages, setSupportedLanguages] = useState(config.supportedLanguages)
  const [tone, setTone]                       = useState(config.tone)
  const [temperature, setTemperature]         = useState(() => {
    const opts = [0, 0.4, 0.8, 1.3]
    return opts.reduce((p, c) => Math.abs(c - config.temperature) < Math.abs(p - config.temperature) ? c : p)
  })
  const [maxTokens, setMaxTokens]             = useState(config.maxTokens)
  const [systemPromptHtml, setSystemPromptHtml] = useState(config.systemPromptHtml)
  const [productsServices, setProductsServices] = useState<ProductItem[]>(config.productsServices as ProductItem[])
  const [businessRules, setBusinessRules]     = useState<RuleItem[]>(config.businessRules as RuleItem[])
  const [pricingRules, setPricingRules]       = useState<PricingItem[]>(config.pricingRules as PricingItem[])
  const [diagnosticQuestions, setDiagnosticQuestions] = useState<QuestionItem[]>(config.diagnosticQuestions as QuestionItem[])
  const [leadCaptureMoment, setLeadCaptureMoment] = useState(config.leadCaptureMoment)
  const [contactFields, setContactFields]     = useState<ContactField[]>(config.contactFields as ContactField[])
  const [notificationEmails, setNotificationEmails] = useState(config.notificationEmails)
  const [closingMessage, setClosingMessage]   = useState(config.closingMessage)
  const [fallbackMessage, setFallbackMessage] = useState(config.fallbackMessage)
  const [widgetPrimaryColor, setWidgetPrimaryColor] = useState(config.widgetPrimaryColor)
  const [widgetPosition, setWidgetPosition]   = useState(config.widgetPosition)
  const [launcherText, setLauncherText]       = useState(config.launcherText)
  const [websiteUrl, setWebsiteUrl]           = useState(config.websiteUrl)
  const [isBotActive, setIsBotActive]         = useState(config.isBotActive)
  const [scoringThreshold, setScoringThreshold] = useState(config.scoringThreshold ?? 70)
  const [scoringRubric, setScoringRubric]     = useState<ScoringCriterion[]>(
    config.scoringRubric?.length
      ? (config.scoringRubric as ScoringCriterion[])
      : [
          { criterion: 'Claridad de necesidad', maxScore: 25, description: 'El visitante expresó claramente qué necesita' },
          { criterion: 'Presupuesto disponible', maxScore: 25, description: 'Mencionó tener presupuesto o capacidad de pago' },
          { criterion: 'Urgencia',               maxScore: 25, description: 'Tiene una necesidad urgente o un plazo definido' },
          { criterion: 'Autoridad de compra',    maxScore: 25, description: 'Puede tomar o influir en la decisión de compra' },
        ],
  )

  // ── Derived ─────────────────────────────────────────────────────────────────
  const rubricTotal = scoringRubric.reduce((s, r) => s + r.maxScore, 0)
  const rubricValid = scoringRubric.length === 0 || rubricTotal === 100

  // ── Handlers ────────────────────────────────────────────────────────────────
  function handleSave() {
    if (!rubricValid) return
    startTransition(async () => {
      const result = await updateBotConfigAction(customerId, {
        assistantName, avatarMode, avatarValue, supportedLanguages, tone,
        llmModel: config.llmModel, temperature, maxTokens, systemPromptHtml,
        productsServices, businessRules, pricingRules, diagnosticQuestions,
        leadCaptureMoment, contactFields, notificationEmails, closingMessage,
        widgetPrimaryColor: widgetPrimaryColor.toUpperCase(), widgetPosition,
        launcherText, welcomeMessage, fallbackMessage, websiteUrl,
        scoringThreshold, scoringRubric,
      })
      setSaveStatus(result.status === 'success' ? 'success' : 'error')
      setSaveMsg(result.status === 'error' ? result.message : '')
      if (result.status === 'success') setTimeout(() => setSaveStatus('idle'), 3000)
    })
  }

  function handleToggle() {
    startToggle(async () => {
      await toggleBotActiveAction(customerId, !isBotActive)
      setIsBotActive((v) => !v)
    })
  }

  function handleImageFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setAvatarValue(reader.result as string)
    reader.readAsDataURL(file)
  }

  function copySnippet() {
    navigator.clipboard.writeText(config.snippet).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  function updateRubricRow(i: number, patch: Partial<ScoringCriterion>) {
    setScoringRubric(scoringRubric.map((r, j) => j === i ? { ...r, ...patch } : r))
  }

  function updateContactField(i: number, patch: Partial<ContactField>) {
    setContactFields(contactFields.map((f, j) => j === i ? { ...f, ...patch } : f))
  }

  // Widget preview props — single object for both uses
  const widgetPreviewProps = {
    assistantName, avatarMode, avatarValue, welcomeMessage,
    launcherText, widgetPrimaryColor, widgetPosition,
  }

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col gap-6">

      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Badge variant={isBotActive ? 'success' : 'secondary'}>
            {isBotActive ? 'Bot activo' : 'Bot inactivo'}
          </Badge>
          <span className="text-xs text-muted-foreground font-mono">{config.clientId}</span>
        </div>
        <div className="flex items-center gap-2">
          <PreviewDialog customerId={customerId} />
          <Button
            type="button" variant="outline" size="sm"
            disabled={isToggling} onClick={handleToggle}
            className={isBotActive ? 'text-destructive hover:text-destructive' : ''}
          >
            {isBotActive
              ? <><PowerOff className="mr-1.5 size-3.5" />Desactivar (BOT-26)</>
              : <><Power className="mr-1.5 size-3.5" />Activar (BOT-26)</>}
          </Button>
          <Button
            type="button" disabled={isPending || !rubricValid} onClick={handleSave}
            title={!rubricValid ? `La rúbrica suma ${rubricTotal} pts — debe ser exactamente 100` : undefined}
            className="bg-nexus-purple text-white hover:bg-nexus-purple/85 disabled:opacity-50"
          >
            {isPending ? 'Guardando…' : 'Guardar cambios'}
          </Button>
        </div>
      </div>

      {/* Alerts */}
      {!rubricValid && (
        <div className="flex items-start gap-2.5 rounded-xl border border-amber-500/40 bg-amber-500/8 px-4 py-3 text-sm text-amber-700 dark:text-amber-400">
          <AlertCircle className="mt-0.5 size-4 shrink-0" />
          <span>
            La rúbrica de calificación suma <strong>{rubricTotal} pts</strong> — debe ser exactamente <strong>100 pts</strong>.
            {rubricTotal < 100 ? ` Faltan ${100 - rubricTotal} pts por distribuir.` : ` Sobran ${rubricTotal - 100} pts; reduce algún criterio.`}
          </span>
        </div>
      )}
      {saveStatus === 'success' && (
        <div className="flex items-center gap-2 rounded-xl border border-green-500/30 bg-green-500/5 px-4 py-3 text-sm text-green-700 dark:text-green-400">
          <CheckCircle2 className="size-4 shrink-0" />
          Configuración guardada correctamente.
        </div>
      )}
      {saveStatus === 'error' && (
        <div className="flex items-start gap-2 rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          <AlertCircle className="mt-0.5 size-4 shrink-0" />
          {saveMsg || 'Error al guardar.'}
        </div>
      )}

      {/* BOT-01/02/24: Identidad */}
      <Section id="identidad" title="Identidad del asistente">
        <Field label="BOT-01 · Nombre del asistente">
          <Input value={assistantName} onChange={(e) => setAssistantName(e.target.value)} maxLength={80} placeholder="Nexus" />
        </Field>

        <Field label="BOT-02 · Avatar">
          <div className="flex gap-3">
            <Select value={avatarMode} onValueChange={(v) => setAvatarMode(v as typeof avatarMode)}>
              <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="icon">Ícono</SelectItem>
                <SelectItem value="emoji">Emoji</SelectItem>
                <SelectItem value="image">Imagen</SelectItem>
              </SelectContent>
            </Select>
            {avatarMode === 'image' ? (
              <div className="flex flex-1 items-center gap-3">
                <input type="file" accept="image/*" onChange={handleImageFile} className="text-sm" />
                {avatarValue?.startsWith('data:') && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={avatarValue} alt="avatar" className="size-9 rounded-full object-cover border" />
                )}
              </div>
            ) : (
              <Input
                className="flex-1"
                value={avatarValue}
                onChange={(e) => setAvatarValue(e.target.value)}
                placeholder={avatarMode === 'emoji' ? '🤖' : 'bot-circle'}
                maxLength={avatarMode === 'emoji' ? 8 : 80}
              />
            )}
          </div>
        </Field>

        <Field label="BOT-24 · Mensaje de bienvenida" hint="Se muestra al abrir el widget por primera vez.">
          <Input value={welcomeMessage} onChange={(e) => setWelcomeMessage(e.target.value)} maxLength={500} placeholder="Hola, ¿en qué puedo ayudarte hoy?" />
        </Field>
      </Section>

      {/* BOT-03/04/06/07/09: Modelo */}
      <Section id="modelo" title="Comportamiento del modelo" hint="BOT-08: Las API keys son gestionadas centralmente por Owners y nunca se exponen al cliente.">
        <Field label="BOT-03 · Idiomas soportados" hint="Selecciona uno o más idiomas en los que el asistente responderá.">
          <div className="flex flex-wrap gap-2">
            {SUPPORTED_LANGUAGES.map((lang) => {
              const active = supportedLanguages.includes(lang.value)
              return (
                <button
                  key={lang.value} type="button"
                  onClick={() =>
                    setSupportedLanguages(active
                      ? supportedLanguages.filter((l) => l !== lang.value)
                      : [...supportedLanguages, lang.value])
                  }
                  className={[
                    'inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-colors',
                    active
                      ? 'border-nexus-purple/40 bg-nexus-purple/10 text-nexus-purple'
                      : 'border-input bg-background text-muted-foreground hover:text-foreground hover:border-muted-foreground/40',
                  ].join(' ')}
                >
                  <span>{lang.flag}</span>{lang.label}
                </button>
              )
            })}
          </div>
          {supportedLanguages.length === 0 && (
            <p className="text-xs text-destructive mt-1">Selecciona al menos un idioma.</p>
          )}
        </Field>

        <Field label="BOT-04 · Tono de conversación">
          <Select value={tone} onValueChange={(v) => setTone(v as typeof tone)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="formal">Formal</SelectItem>
              <SelectItem value="tecnico">Técnico</SelectItem>
              <SelectItem value="amigable">Amigable</SelectItem>
              <SelectItem value="consultivo">Consultivo</SelectItem>
              <SelectItem value="directo">Directo</SelectItem>
            </SelectContent>
          </Select>
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field label="BOT-06 · Temperatura / creatividad" hint={`Valor actual: ${temperature}`}>
            <Select value={String(temperature)} onValueChange={(v) => setTemperature(Number(v))}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {TEMPERATURE_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={String(opt.value)}>
                    <span className="font-medium">{opt.label}</span>
                    <span className="ml-2 text-xs text-muted-foreground">{opt.description}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field label="BOT-07 · Máximo de tokens por respuesta">
            <Input type="number" min={64} step={64} value={maxTokens} onChange={(e) => setMaxTokens(Number(e.target.value))} />
          </Field>
        </div>

        <Field label="BOT-09 · System prompt del chatbot">
          <textarea
            value={systemPromptHtml}
            onChange={(e) => setSystemPromptHtml(e.target.value)}
            maxLength={30000} rows={6}
            placeholder="Instrucciones base para el asistente…"
            className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none resize-y focus:border-ring focus:ring-3 focus:ring-ring/50 dark:bg-input/30"
          />
        </Field>
      </Section>

      {/* BOT-10: Productos */}
      <Section id="productos" title="BOT-10 · Catálogo de productos y servicios">
        <ProductsList items={productsServices} onChange={setProductsServices} />
      </Section>

      {/* BOT-11: Reglas */}
      <Section id="reglas" title="BOT-11 · Reglas de negocio y lógica de recomendación">
        <RulesList
          items={businessRules} onChange={setBusinessRules}
          addLabel="Agregar regla de negocio"
          namePlaceholder="Título de la regla"
          valuePlaceholder="Instrucción para el bot"
        />
      </Section>

      {/* BOT-12: Precios */}
      <Section id="precios" title="BOT-12 · Rangos de precios por tipo de solución">
        <PricingList items={pricingRules} onChange={setPricingRules} />
      </Section>

      {/* BOT-13: Diagnóstico */}
      <Section id="diagnostico" title="BOT-13 · Preguntas diagnósticas clave">
        <QuestionsList items={diagnosticQuestions} onChange={setDiagnosticQuestions} />
      </Section>

      {/* BOT-15/16/17: Captura de leads */}
      <Section id="leads" title="Captura de leads">
        <Field label="BOT-15 · Momento para solicitar datos de contacto">
          <Select value={leadCaptureMoment} onValueChange={(v) => setLeadCaptureMoment(v as typeof leadCaptureMoment)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="early">Al inicio de la conversación</SelectItem>
              <SelectItem value="after_interest">Después de mostrar interés</SelectItem>
              <SelectItem value="after_diagnostics">Tras las preguntas diagnósticas</SelectItem>
              <SelectItem value="before_closing">Antes del cierre</SelectItem>
            </SelectContent>
          </Select>
        </Field>

        <Field label="BOT-16 · Campos de contacto solicitados al usuario final">
          <div className="rounded-lg border overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-xs text-muted-foreground">
                <tr>
                  <th className="px-3 py-2 text-left">Campo</th>
                  <th className="px-3 py-2 text-center">Habilitado</th>
                  <th className="px-3 py-2 text-center">Obligatorio</th>
                  <th className="px-3 py-2 text-left">Etiqueta</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {contactFields.map((field, i) => (
                  <tr key={field.key}>
                    <td className="px-3 py-2 font-mono text-xs text-muted-foreground">{field.key}</td>
                    <td className="px-3 py-2 text-center">
                      <input type="checkbox" checked={field.enabled}
                        onChange={(e) => updateContactField(i, { enabled: e.target.checked })}
                        className="accent-nexus-purple" />
                    </td>
                    <td className="px-3 py-2 text-center">
                      <input type="checkbox" checked={field.required} disabled={!field.enabled}
                        onChange={(e) => updateContactField(i, { required: e.target.checked })}
                        className="accent-nexus-purple disabled:opacity-30" />
                    </td>
                    <td className="px-3 py-2">
                      <Input value={field.label} onChange={(e) => updateContactField(i, { label: e.target.value })}
                        maxLength={40} className="h-7 text-xs" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Field>

        <Field label="BOT-17 · Emails de destino de notificaciones de captura de lead" hint="Escribe un email y presiona Enter.">
          <TagInput values={notificationEmails} onChange={setNotificationEmails} placeholder="equipo@empresa.com" type="email" />
        </Field>
      </Section>

      {/* NEX: Calificación inteligente */}
      <Section
        id="scoring"
        title="NEX · Calificación inteligente de leads"
        hint="El LLM evalúa cada lead según la rúbrica y asigna un score de 0 a 100. Leads con score ≥ umbral se marcan como calificados y reciben notificación prioritaria."
      >
        <Field label="NEX-05 · Umbral de calificación (0–100)" hint={`Leads con score ≥ ${scoringThreshold} se marcan como ⭐ Calificados.`}>
          <div className="flex items-center gap-3">
            <input
              type="range" min={0} max={100} step={5} value={scoringThreshold}
              onChange={(e) => setScoringThreshold(Number(e.target.value))}
              className="flex-1 accent-nexus-purple"
            />
            <Input
              type="number" min={0} max={100} value={scoringThreshold}
              onChange={(e) => setScoringThreshold(Math.max(0, Math.min(100, Number(e.target.value))))}
              className="w-20 text-center"
            />
          </div>
        </Field>

        <Field label="NEX-01 · Rúbrica de calificación" hint="Criterios usados por el LLM para evaluar leads. La suma de maxScore debería ser 100.">
          <div className="space-y-3">
            {scoringRubric.map((item, i) => (
              <div key={i} className="grid grid-cols-[2fr_1fr_auto] gap-2 items-start rounded-lg border bg-muted/20 p-3">
                <div className="space-y-2">
                  <Input
                    value={item.criterion}
                    onChange={(e) => updateRubricRow(i, { criterion: e.target.value })}
                    placeholder="Nombre del criterio" maxLength={120}
                  />
                  <Input
                    value={item.description}
                    onChange={(e) => updateRubricRow(i, { description: e.target.value })}
                    placeholder="Descripción: qué evalúa este criterio" maxLength={400}
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Pts máx</Label>
                  <Input
                    type="number" min={1} max={100} value={item.maxScore}
                    onChange={(e) => updateRubricRow(i, { maxScore: Number(e.target.value) })}
                    className="text-center"
                  />
                </div>
                <Button
                  type="button" variant="ghost" size="icon"
                  onClick={() => setScoringRubric(scoringRubric.filter((_, j) => j !== i))}
                  className="mt-6 text-muted-foreground hover:text-destructive"
                >
                  <Minus className="size-4" />
                </Button>
              </div>
            ))}
            <div className="flex items-center justify-between">
              <Button
                type="button" variant="outline" size="sm"
                onClick={() => setScoringRubric([...scoringRubric, { criterion: '', maxScore: 25, description: '' }])}
                disabled={scoringRubric.length >= 10}
              >
                <Plus className="mr-1.5 size-3.5" /> Agregar criterio
              </Button>
              {scoringRubric.length > 0 && (
                <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${
                  rubricTotal === 100
                    ? 'border-green-200 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-950/30 dark:text-green-400'
                    : 'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-400'
                }`}>
                  {rubricTotal === 100 ? '✓' : '!'} {rubricTotal} / 100 pts
                </span>
              )}
            </div>
          </div>
        </Field>
      </Section>

      {/* BOT-18/25: Mensajes */}
      <Section id="mensajes" title="Mensajes del bot">
        <Field label="BOT-18 · Mensaje de cierre / despedida">
          <textarea
            value={closingMessage} onChange={(e) => setClosingMessage(e.target.value)}
            maxLength={1200} rows={3}
            placeholder="Gracias por contactarnos. ¡Hasta pronto!"
            className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none resize-y focus:border-ring focus:ring-3 focus:ring-ring/50 dark:bg-input/30"
          />
        </Field>
        <Field label="BOT-25 · Mensaje de fallback" hint="Cuando el bot no tiene información suficiente para responder.">
          <Input value={fallbackMessage} onChange={(e) => setFallbackMessage(e.target.value)} maxLength={500} placeholder="Lo siento, no tengo información suficiente para responder eso." />
        </Field>
      </Section>

      {/* BOT-20/21/22: Apariencia */}
      <Section id="widget" title="Apariencia del widget">
        <Field label="BOT-20 · Color primario del widget" hint="Aparece en el botón de apertura y los elementos destacados del chat.">
          <ColorPickerField value={widgetPrimaryColor} onChange={setWidgetPrimaryColor} />
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field label="BOT-21 · Posición del widget">
            <Select value={widgetPosition} onValueChange={(v) => setWidgetPosition(v as typeof widgetPosition)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="right">Esquina inferior derecha</SelectItem>
                <SelectItem value="left">Esquina inferior izquierda</SelectItem>
              </SelectContent>
            </Select>
          </Field>
          <Field label="BOT-22 · Texto del botón de apertura">
            <Input value={launcherText} onChange={(e) => setLauncherText(e.target.value)} maxLength={40} placeholder="💬 Chatea con nosotros" />
          </Field>
        </div>

        <WidgetPreviewDialog {...widgetPreviewProps} />
      </Section>

      {/* BOT-19/23: Integración */}
      <Section id="integracion" title="Integración del widget">
        <Field label="URL del sitio web del cliente" hint="El backend aceptará automáticamente peticiones CORS desde esta URL. Debe incluir protocolo: https://cliente.com">
          <Input type="url" value={websiteUrl} onChange={(e) => setWebsiteUrl(e.target.value)} maxLength={500} placeholder="https://sitio-del-cliente.com" />
        </Field>

        <div className="flex items-center gap-3 rounded-lg bg-muted/40 px-3 py-2.5">
          <Bot className="size-4 shrink-0 text-muted-foreground" />
          <div className="min-w-0 flex-1">
            <p className="text-xs text-muted-foreground">BOT-23 · Client ID único</p>
            <p className="font-mono text-sm text-foreground">{config.clientId}</p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground">BOT-19 · Snippet HTML/JS para incrustar en el sitio del cliente</p>
            <Button type="button" variant="outline" size="sm" onClick={copySnippet}>
              {copied
                ? <><CheckCircle2 className="mr-1.5 size-3.5 text-green-500" />Copiado</>
                : <><Copy className="mr-1.5 size-3.5" />Copiar</>}
            </Button>
          </div>
          <pre className="overflow-x-auto rounded-lg bg-muted p-4 text-xs leading-relaxed">
            <code>{config.snippet}</code>
          </pre>
          <p className="text-xs text-muted-foreground">
            Pega este código antes del cierre de{' '}
            <code className="rounded bg-muted px-1 font-mono">&lt;/body&gt;</code>{' '}
            en el sitio web del cliente.
          </p>
        </div>
      </Section>

      {/* Footer save */}
      <div className="flex justify-end">
        <Button
          type="button" disabled={isPending || !rubricValid} onClick={handleSave}
          title={!rubricValid ? `La rúbrica suma ${rubricTotal} pts — debe ser exactamente 100` : undefined}
          className="bg-nexus-purple text-white hover:bg-nexus-purple/85 disabled:opacity-50"
        >
          {isPending ? 'Guardando…' : 'Guardar cambios'}
        </Button>
      </div>
    </div>
  )
}
