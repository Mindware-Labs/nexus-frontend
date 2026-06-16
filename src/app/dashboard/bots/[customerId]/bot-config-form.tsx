'use client'

import { useState, useTransition, useRef } from 'react'
import {
  AlertCircle,
  Bot,
  CheckCircle2,
  Copy,
  MessageSquare,
  Minus,
  Plus,
  Power,
  PowerOff,
  Send,
  X,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  previewBotChatAction,
  toggleBotActiveAction,
  updateBotConfigAction,
  type BotConfig,
} from '@/app/actions/bot'

// ── Types ────────────────────────────────────────────────────────────────────

type ProductItem = { name: string; description: string }
type RuleItem = { title: string; instruction: string }
type PricingItem = { label: string; fromPrice: string; toPrice: string; currency: string; notes: string }
type QuestionItem = { question: string; purpose: string }
type ContactField = { key: string; label: string; enabled: boolean; required: boolean }
type ScoringCriterion = { criterion: string; maxScore: number; description: string }

// ── Small helpers ─────────────────────────────────────────────────────────────

function Section({ id, title, hint, children }: { id?: string; title: string; hint?: string; children: React.ReactNode }) {
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

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-medium text-muted-foreground">{label}</Label>
      {children}
      {hint && <p className="text-xs text-muted-foreground/80">{hint}</p>}
    </div>
  )
}

function TagInput({
  values,
  onChange,
  placeholder,
  type = 'text',
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

// ── List editors ──────────────────────────────────────────────────────────────

function ProductsList({ items, onChange }: { items: ProductItem[]; onChange: (v: ProductItem[]) => void }) {
  function add() { onChange([...items, { name: '', description: '' }]) }
  function remove(i: number) { onChange(items.filter((_, j) => j !== i)) }
  function update(i: number, field: keyof ProductItem, val: string) {
    onChange(items.map((item, j) => j === i ? { ...item, [field]: val } : item))
  }
  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <div key={i} className="grid grid-cols-[1fr_2fr_auto] gap-2 items-start rounded-lg border bg-muted/20 p-3">
          <Input value={item.name} onChange={(e) => update(i, 'name', e.target.value)} placeholder="Nombre del producto" maxLength={120} />
          <Input value={item.description} onChange={(e) => update(i, 'description', e.target.value)} placeholder="Descripción breve" maxLength={600} />
          <Button type="button" variant="ghost" size="icon" onClick={() => remove(i)} className="text-muted-foreground hover:text-destructive">
            <Minus className="size-4" />
          </Button>
        </div>
      ))}
      <Button type="button" variant="outline" size="sm" onClick={add} className="w-full">
        <Plus className="mr-1.5 size-3.5" /> Agregar producto / servicio
      </Button>
    </div>
  )
}

function RulesList({ items, onChange, addLabel, namePlaceholder, valuePlaceholder }: {
  items: RuleItem[]
  onChange: (v: RuleItem[]) => void
  addLabel: string
  namePlaceholder: string
  valuePlaceholder: string
}) {
  function add() { onChange([...items, { title: '', instruction: '' }]) }
  function remove(i: number) { onChange(items.filter((_, j) => j !== i)) }
  function update(i: number, field: keyof RuleItem, val: string) {
    onChange(items.map((item, j) => j === i ? { ...item, [field]: val } : item))
  }
  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <div key={i} className="grid grid-cols-[1fr_2fr_auto] gap-2 items-start rounded-lg border bg-muted/20 p-3">
          <Input value={item.title} onChange={(e) => update(i, 'title', e.target.value)} placeholder={namePlaceholder} maxLength={120} />
          <Input value={item.instruction} onChange={(e) => update(i, 'instruction', e.target.value)} placeholder={valuePlaceholder} maxLength={600} />
          <Button type="button" variant="ghost" size="icon" onClick={() => remove(i)} className="text-muted-foreground hover:text-destructive">
            <Minus className="size-4" />
          </Button>
        </div>
      ))}
      <Button type="button" variant="outline" size="sm" onClick={add} className="w-full">
        <Plus className="mr-1.5 size-3.5" /> {addLabel}
      </Button>
    </div>
  )
}

function PricingList({ items, onChange }: { items: PricingItem[]; onChange: (v: PricingItem[]) => void }) {
  function add() { onChange([...items, { label: '', fromPrice: '', toPrice: '', currency: 'MXN', notes: '' }]) }
  function remove(i: number) { onChange(items.filter((_, j) => j !== i)) }
  function update(i: number, field: keyof PricingItem, val: string) {
    onChange(items.map((item, j) => j === i ? { ...item, [field]: val } : item))
  }
  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <div key={i} className="rounded-lg border bg-muted/20 p-3 space-y-2">
          <div className="grid grid-cols-[2fr_1fr_1fr_1fr_auto] gap-2 items-center">
            <Input value={item.label} onChange={(e) => update(i, 'label', e.target.value)} placeholder="Tipo de solución" maxLength={120} />
            <Input value={item.fromPrice} onChange={(e) => update(i, 'fromPrice', e.target.value)} placeholder="Desde" maxLength={40} />
            <Input value={item.toPrice} onChange={(e) => update(i, 'toPrice', e.target.value)} placeholder="Hasta" maxLength={40} />
            <Input value={item.currency} onChange={(e) => update(i, 'currency', e.target.value)} placeholder="MXN" maxLength={12} />
            <Button type="button" variant="ghost" size="icon" onClick={() => remove(i)} className="text-muted-foreground hover:text-destructive">
              <Minus className="size-4" />
            </Button>
          </div>
          <Input value={item.notes} onChange={(e) => update(i, 'notes', e.target.value)} placeholder="Notas adicionales (opcional)" maxLength={400} />
        </div>
      ))}
      <Button type="button" variant="outline" size="sm" onClick={add} className="w-full">
        <Plus className="mr-1.5 size-3.5" /> Agregar rango de precio
      </Button>
    </div>
  )
}

function QuestionsList({ items, onChange }: { items: QuestionItem[]; onChange: (v: QuestionItem[]) => void }) {
  function add() { onChange([...items, { question: '', purpose: '' }]) }
  function remove(i: number) { onChange(items.filter((_, j) => j !== i)) }
  function update(i: number, field: keyof QuestionItem, val: string) {
    onChange(items.map((item, j) => j === i ? { ...item, [field]: val } : item))
  }
  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <div key={i} className="grid grid-cols-[2fr_1fr_auto] gap-2 items-start rounded-lg border bg-muted/20 p-3">
          <Input value={item.question} onChange={(e) => update(i, 'question', e.target.value)} placeholder="¿Pregunta diagnóstica?" maxLength={280} />
          <Input value={item.purpose} onChange={(e) => update(i, 'purpose', e.target.value)} placeholder="Objetivo" maxLength={300} />
          <Button type="button" variant="ghost" size="icon" onClick={() => remove(i)} className="text-muted-foreground hover:text-destructive">
            <Minus className="size-4" />
          </Button>
        </div>
      ))}
      <Button type="button" variant="outline" size="sm" onClick={add} className="w-full">
        <Plus className="mr-1.5 size-3.5" /> Agregar pregunta diagnóstica
      </Button>
    </div>
  )
}

// ── Preview dialog (BOT-14) ───────────────────────────────────────────────────

type ChatMessage = { role: 'user' | 'bot'; text: string }

function PreviewDialog({ customerId }: { customerId: number }) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [draft, setDraft] = useState('')
  const [sending, setSending] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  async function send() {
    const text = draft.trim()
    if (!text || sending) return
    const next: ChatMessage[] = [...messages, { role: 'user', text }]
    setMessages(next)
    setDraft('')
    setSending(true)
    const result = await previewBotChatAction(customerId, text, messages)
    if ('error' in result) {
      setMessages([...next, { role: 'bot', text: `Error: ${result.error}` }])
    } else {
      setMessages([...next, { role: 'bot', text: result.reply }])
    }
    setSending(false)
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 50)
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <MessageSquare className="mr-1.5 size-3.5" />
          Probar bot (BOT-14)
        </Button>
      </DialogTrigger>
      <DialogContent className="flex h-[600px] max-w-lg flex-col gap-0 p-0">
        <DialogHeader className="border-b px-5 py-4">
          <DialogTitle className="text-sm">Vista previa del bot</DialogTitle>
          <p className="text-xs text-muted-foreground">Usa la configuración guardada en la base de datos.</p>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.length === 0 && (
            <p className="text-center text-xs text-muted-foreground pt-8">Escribe un mensaje para comenzar la prueba.</p>
          )}
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] rounded-2xl px-3.5 py-2 text-sm ${m.role === 'user' ? 'bg-nexus-purple text-white' : 'bg-muted text-foreground'}`}>
                {m.text}
              </div>
            </div>
          ))}
          {sending && (
            <div className="flex justify-start">
              <div className="rounded-2xl bg-muted px-3.5 py-2 text-sm text-muted-foreground">
                Escribiendo...
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>
        <div className="border-t p-4 flex gap-2">
          <Input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') send() }}
            placeholder="Escribe un mensaje..."
            disabled={sending}
            className="flex-1"
          />
          <Button type="button" size="icon" onClick={send} disabled={sending || !draft.trim()} className="bg-nexus-purple text-white hover:bg-nexus-purple/85">
            <Send className="size-4" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// ── Main form ─────────────────────────────────────────────────────────────────

export function BotConfigForm({ config, customerId }: { config: BotConfig; customerId: number }) {
  const [isPending, startTransition] = useTransition()
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [saveMsg, setSaveMsg] = useState('')
  const [isToggling, startToggle] = useTransition()
  const [copied, setCopied] = useState(false)

  // ── Form state ──────────────────────────────────────────────────────────────
  const [assistantName, setAssistantName] = useState(config.assistantName)
  const [avatarMode, setAvatarMode] = useState(config.avatarMode)
  const [avatarValue, setAvatarValue] = useState(config.avatarValue)
  const [welcomeMessage, setWelcomeMessage] = useState(config.welcomeMessage)
  const [supportedLanguages, setSupportedLanguages] = useState(config.supportedLanguages)
  const [tone, setTone] = useState(config.tone)
  const [temperature, setTemperature] = useState(config.temperature)
  const [maxTokens, setMaxTokens] = useState(config.maxTokens)
  const [systemPromptHtml, setSystemPromptHtml] = useState(config.systemPromptHtml)
  const [productsServices, setProductsServices] = useState<ProductItem[]>(config.productsServices as ProductItem[])
  const [businessRules, setBusinessRules] = useState<RuleItem[]>(config.businessRules as RuleItem[])
  const [pricingRules, setPricingRules] = useState<PricingItem[]>(config.pricingRules as PricingItem[])
  const [diagnosticQuestions, setDiagnosticQuestions] = useState<QuestionItem[]>(config.diagnosticQuestions as QuestionItem[])
  const [leadCaptureMoment, setLeadCaptureMoment] = useState(config.leadCaptureMoment)
  const [contactFields, setContactFields] = useState<ContactField[]>(config.contactFields as ContactField[])
  const [notificationEmails, setNotificationEmails] = useState(config.notificationEmails)
  const [closingMessage, setClosingMessage] = useState(config.closingMessage)
  const [fallbackMessage, setFallbackMessage] = useState(config.fallbackMessage)
  const [widgetPrimaryColor, setWidgetPrimaryColor] = useState(config.widgetPrimaryColor)
  const [widgetPosition, setWidgetPosition] = useState(config.widgetPosition)
  const [launcherText, setLauncherText] = useState(config.launcherText)
  const [websiteUrl, setWebsiteUrl] = useState(config.websiteUrl)
  const [isBotActive, setIsBotActive] = useState(config.isBotActive)
  const [scoringThreshold, setScoringThreshold] = useState(config.scoringThreshold ?? 70)
  const [scoringRubric, setScoringRubric] = useState<ScoringCriterion[]>(
    config.scoringRubric?.length
      ? (config.scoringRubric as ScoringCriterion[])
      : [
          { criterion: 'Claridad de necesidad', maxScore: 25, description: 'El visitante expresó claramente qué necesita' },
          { criterion: 'Presupuesto disponible', maxScore: 25, description: 'Mencionó tener presupuesto o capacidad de pago' },
          { criterion: 'Urgencia', maxScore: 25, description: 'Tiene una necesidad urgente o un plazo definido' },
          { criterion: 'Autoridad de compra', maxScore: 25, description: 'Puede tomar o influir en la decisión de compra' },
        ],
  )

  // ── Save ────────────────────────────────────────────────────────────────────
  function handleSave() {
    startTransition(async () => {
      const result = await updateBotConfigAction(customerId, {
        assistantName,
        avatarMode,
        avatarValue,
        supportedLanguages,
        tone,
        llmModel: config.llmModel,
        temperature,
        maxTokens,
        systemPromptHtml,
        productsServices,
        businessRules,
        pricingRules,
        diagnosticQuestions,
        leadCaptureMoment,
        contactFields,
        notificationEmails,
        closingMessage,
        widgetPrimaryColor: widgetPrimaryColor.toUpperCase(),
        widgetPosition,
        launcherText,
        welcomeMessage,
        fallbackMessage,
        websiteUrl,
        scoringThreshold,
        scoringRubric,
      })
      setSaveStatus(result.status === 'success' ? 'success' : 'error')
      setSaveMsg(result.status === 'error' ? result.message : '')
      if (result.status === 'success') setTimeout(() => setSaveStatus('idle'), 3000)
    })
  }

  // ── Toggle ──────────────────────────────────────────────────────────────────
  function handleToggle() {
    startToggle(async () => {
      await toggleBotActiveAction(customerId, !isBotActive)
      setIsBotActive((v) => !v)
    })
  }

  // ── Avatar image ─────────────────────────────────────────────────────────────
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

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col gap-6">
      {/* Header actions */}
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
            type="button"
            variant="outline"
            size="sm"
            disabled={isToggling}
            onClick={handleToggle}
            className={isBotActive ? 'text-destructive hover:text-destructive' : ''}
          >
            {isBotActive ? <><PowerOff className="mr-1.5 size-3.5" />Desactivar (BOT-26)</> : <><Power className="mr-1.5 size-3.5" />Activar (BOT-26)</>}
          </Button>
          <Button
            type="button"
            disabled={isPending}
            onClick={handleSave}
            className="bg-nexus-purple text-white hover:bg-nexus-purple/85"
          >
            {isPending ? 'Guardando…' : 'Guardar cambios'}
          </Button>
        </div>
      </div>

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

      {/* BOT-01 / BOT-02: Identidad */}
      <Section id="identidad" title="Identidad del asistente">
        <Field label="BOT-01 · Nombre del asistente">
          <Input value={assistantName} onChange={(e) => setAssistantName(e.target.value)} maxLength={80} placeholder="Nexus" />
        </Field>

        <Field label="BOT-02 · Avatar">
          <div className="flex gap-3">
            <Select value={avatarMode} onValueChange={(v) => setAvatarMode(v as typeof avatarMode)}>
              <SelectTrigger className="w-36">
                <SelectValue />
              </SelectTrigger>
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

      {/* BOT-03 / BOT-04 / BOT-06 / BOT-07 / BOT-09: Modelo */}
      <Section id="modelo" title="Comportamiento del modelo" hint="BOT-08: Las API keys son gestionadas centralmente por Owners y nunca se exponen al cliente.">
        <Field label="BOT-03 · Idiomas soportados" hint="Escribe y presiona Enter para agregar.">
          <TagInput values={supportedLanguages} onChange={setSupportedLanguages} placeholder="Español" />
        </Field>

        <Field label="BOT-04 · Tono de conversación">
          <Select value={tone} onValueChange={(v) => setTone(v as typeof tone)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
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
          <Field label="BOT-06 · Temperatura / creatividad" hint="0 = preciso, 2 = muy creativo">
            <Input
              type="number"
              min={0}
              max={2}
              step={0.1}
              value={temperature}
              onChange={(e) => setTemperature(Number(e.target.value))}
            />
          </Field>
          <Field label="BOT-07 · Máximo de tokens por respuesta">
            <Input
              type="number"
              min={64}
              step={64}
              value={maxTokens}
              onChange={(e) => setMaxTokens(Number(e.target.value))}
            />
          </Field>
        </div>

        <Field label="BOT-09 · System prompt del chatbot">
          <textarea
            value={systemPromptHtml}
            onChange={(e) => setSystemPromptHtml(e.target.value)}
            maxLength={30000}
            rows={6}
            placeholder="Instrucciones base para el asistente…"
            className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none resize-y focus:border-ring focus:ring-3 focus:ring-ring/50 dark:bg-input/30"
          />
        </Field>
      </Section>

      {/* BOT-10: Productos y servicios */}
      <Section id="productos" title="BOT-10 · Catálogo de productos y servicios">
        <ProductsList items={productsServices} onChange={setProductsServices} />
      </Section>

      {/* BOT-11: Reglas de negocio */}
      <Section id="reglas" title="BOT-11 · Reglas de negocio y lógica de recomendación">
        <RulesList
          items={businessRules}
          onChange={setBusinessRules}
          addLabel="Agregar regla de negocio"
          namePlaceholder="Título de la regla"
          valuePlaceholder="Instrucción para el bot"
        />
      </Section>

      {/* BOT-12: Precios */}
      <Section id="precios" title="BOT-12 · Rangos de precios por tipo de solución">
        <PricingList items={pricingRules} onChange={setPricingRules} />
      </Section>

      {/* BOT-13: Preguntas diagnósticas */}
      <Section id="diagnostico" title="BOT-13 · Preguntas diagnósticas clave">
        <QuestionsList items={diagnosticQuestions} onChange={setDiagnosticQuestions} />
      </Section>

      {/* BOT-15 / BOT-16 / BOT-17: Captura de leads */}
      <Section id="leads" title="Captura de leads">
        <Field label="BOT-15 · Momento para solicitar datos de contacto">
          <Select value={leadCaptureMoment} onValueChange={(v) => setLeadCaptureMoment(v as typeof leadCaptureMoment)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
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
                      <input
                        type="checkbox"
                        checked={field.enabled}
                        onChange={(e) => setContactFields(contactFields.map((f, j) => j === i ? { ...f, enabled: e.target.checked } : f))}
                        className="accent-nexus-purple"
                      />
                    </td>
                    <td className="px-3 py-2 text-center">
                      <input
                        type="checkbox"
                        checked={field.required}
                        disabled={!field.enabled}
                        onChange={(e) => setContactFields(contactFields.map((f, j) => j === i ? { ...f, required: e.target.checked } : f))}
                        className="accent-nexus-purple disabled:opacity-30"
                      />
                    </td>
                    <td className="px-3 py-2">
                      <Input
                        value={field.label}
                        onChange={(e) => setContactFields(contactFields.map((f, j) => j === i ? { ...f, label: e.target.value } : f))}
                        maxLength={40}
                        className="h-7 text-xs"
                      />
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

      {/* NEX-01/05: Calificación inteligente de leads */}
      <Section
        id="scoring"
        title="NEX · Calificación inteligente de leads"
        hint="El LLM evalúa cada lead según la rúbrica y asigna un score de 0 a 100. Leads con score ≥ umbral se marcan como calificados y reciben notificación prioritaria."
      >
        <Field label="NEX-05 · Umbral de calificación (0–100)" hint={`Leads con score ≥ ${scoringThreshold} se marcan como ⭐ Calificados.`}>
          <div className="flex items-center gap-3">
            <input
              type="range"
              min={0}
              max={100}
              step={5}
              value={scoringThreshold}
              onChange={(e) => setScoringThreshold(Number(e.target.value))}
              className="flex-1 accent-nexus-purple"
            />
            <Input
              type="number"
              min={0}
              max={100}
              value={scoringThreshold}
              onChange={(e) => setScoringThreshold(Math.max(0, Math.min(100, Number(e.target.value))))}
              className="w-20 text-center"
            />
          </div>
        </Field>

        <Field
          label="NEX-01 · Rúbrica de calificación"
          hint="Criterios usados por el LLM para evaluar leads. La suma de maxScore debería ser 100."
        >
          <div className="space-y-3">
            {scoringRubric.map((item, i) => (
              <div key={i} className="grid grid-cols-[2fr_1fr_auto] gap-2 items-start rounded-lg border bg-muted/20 p-3">
                <div className="space-y-2">
                  <Input
                    value={item.criterion}
                    onChange={(e) => setScoringRubric(scoringRubric.map((r, j) => j === i ? { ...r, criterion: e.target.value } : r))}
                    placeholder="Nombre del criterio"
                    maxLength={120}
                  />
                  <Input
                    value={item.description}
                    onChange={(e) => setScoringRubric(scoringRubric.map((r, j) => j === i ? { ...r, description: e.target.value } : r))}
                    placeholder="Descripción: qué evalúa este criterio"
                    maxLength={400}
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Pts máx</Label>
                  <Input
                    type="number"
                    min={1}
                    max={100}
                    value={item.maxScore}
                    onChange={(e) => setScoringRubric(scoringRubric.map((r, j) => j === i ? { ...r, maxScore: Number(e.target.value) } : r))}
                    className="text-center"
                  />
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => setScoringRubric(scoringRubric.filter((_, j) => j !== i))}
                  className="mt-6 text-muted-foreground hover:text-destructive"
                >
                  <Minus className="size-4" />
                </Button>
              </div>
            ))}
            <div className="flex items-center justify-between">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setScoringRubric([...scoringRubric, { criterion: '', maxScore: 25, description: '' }])}
                disabled={scoringRubric.length >= 10}
              >
                <Plus className="mr-1.5 size-3.5" /> Agregar criterio
              </Button>
              {scoringRubric.length > 0 && (
                <span className={`text-xs ${scoringRubric.reduce((s, r) => s + r.maxScore, 0) === 100 ? 'text-green-600' : 'text-amber-600'}`}>
                  Total: {scoringRubric.reduce((s, r) => s + r.maxScore, 0)} / 100 pts
                </span>
              )}
            </div>
          </div>
        </Field>
      </Section>

      {/* BOT-18 / BOT-25: Mensajes */}
      <Section id="mensajes" title="Mensajes del bot">
        <Field label="BOT-18 · Mensaje de cierre / despedida">
          <textarea
            value={closingMessage}
            onChange={(e) => setClosingMessage(e.target.value)}
            maxLength={1200}
            rows={3}
            placeholder="Gracias por contactarnos. ¡Hasta pronto!"
            className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none resize-y focus:border-ring focus:ring-3 focus:ring-ring/50 dark:bg-input/30"
          />
        </Field>

        <Field label="BOT-25 · Mensaje de fallback" hint="Cuando el bot no tiene información suficiente para responder.">
          <Input value={fallbackMessage} onChange={(e) => setFallbackMessage(e.target.value)} maxLength={500} placeholder="Lo siento, no tengo información suficiente para responder eso." />
        </Field>
      </Section>

      {/* BOT-20 / BOT-21 / BOT-22: Apariencia del widget */}
      <Section id="widget" title="Apariencia del widget">
        <div className="grid grid-cols-3 gap-4">
          <Field label="BOT-20 · Color primario">
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={widgetPrimaryColor}
                onChange={(e) => setWidgetPrimaryColor(e.target.value)}
                className="size-9 cursor-pointer rounded-md border border-input bg-transparent p-0.5"
              />
              <Input
                value={widgetPrimaryColor}
                onChange={(e) => setWidgetPrimaryColor(e.target.value)}
                maxLength={7}
                className="font-mono uppercase"
                placeholder="#6D28D9"
              />
            </div>
          </Field>

          <Field label="BOT-21 · Posición del widget">
            <Select value={widgetPosition} onValueChange={(v) => setWidgetPosition(v as typeof widgetPosition)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
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
      </Section>

      {/* BOT-19 / BOT-23: Integración */}
      <Section id="integracion" title="Integración del widget">
        <Field
          label="URL del sitio web del cliente"
          hint="El backend aceptará automáticamente peticiones CORS desde esta URL. Debe incluir protocolo: https://cliente.com"
        >
          <Input
            type="url"
            value={websiteUrl}
            onChange={(e) => setWebsiteUrl(e.target.value)}
            maxLength={500}
            placeholder="https://sitio-del-cliente.com"
          />
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
              {copied ? <><CheckCircle2 className="mr-1.5 size-3.5 text-green-500" />Copiado</> : <><Copy className="mr-1.5 size-3.5" />Copiar</>}
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

      {/* Sticky save */}
      <div className="flex justify-end">
        <Button
          type="button"
          disabled={isPending}
          onClick={handleSave}
          className="bg-nexus-purple text-white hover:bg-nexus-purple/85"
        >
          {isPending ? 'Guardando…' : 'Guardar cambios'}
        </Button>
      </div>
    </div>
  )
}
