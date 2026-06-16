import { redirect } from 'next/navigation'
import {
  AlertCircle,
  Bot,
  Check,
  Code2,
  Eye,
  Lock,
  Palette,
  Power,
} from 'lucide-react'
import { getSessionUser } from '@/lib/session'
import { getBotConfig, type CustomerBotConfig } from '@/app/actions/customer'
import { BotToggle } from '@/components/panel/bot-toggle'
import { PresentationForm } from '@/components/panel/presentation-form'
import { ChatbotPreview } from '@/components/panel/chatbot-preview'
import { CopySnippet, InstallInstructions } from '@/components/panel/copy-snippet'

export const metadata = { title: 'Mi Chatbot — Mindware Nexus' }

function Section({
  icon,
  title,
  desc,
  children,
}: {
  icon: React.ReactNode
  title: string
  desc?: string
  children: React.ReactNode
}) {
  return (
    <div className="rounded-xl border bg-card">
      <div className="border-b px-5 py-4">
        <h2 className="flex items-center gap-2 text-sm font-semibold">
          <span className="text-nexus-purple">{icon}</span>
          {title}
        </h2>
        {desc && <p className="mt-0.5 text-xs text-muted-foreground">{desc}</p>}
      </div>
      <div className="p-5">{children}</div>
    </div>
  )
}

function ReadOnlyConfig({ config }: { config: CustomerBotConfig }) {
  const products = config.productsServices as Array<{ name?: string; description?: string }>
  const rules = config.businessRules as Array<{ title?: string; instruction?: string }>
  return (
    <div className="space-y-5">
      <div className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-700">
        <Lock className="mt-0.5 size-3.5 shrink-0" />
        La lógica de IA (modelo, prompt y reglas) la administra el equipo de Mindware. Para cambios, contáctanos.
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Meta label="Modelo de IA" value={config.llmModel} />
        <Meta label="Tono" value={config.tone} />
        <Meta label="Momento de captura" value={config.leadCaptureMoment} />
      </div>

      {config.systemPromptHtml && (
        <div>
          <p className="mb-1.5 text-sm font-medium">Prompt base del sistema</p>
          <div
            className="prose prose-sm max-w-none rounded-lg border bg-muted/40 p-3 text-sm text-muted-foreground"
            dangerouslySetInnerHTML={{ __html: config.systemPromptHtml }}
          />
        </div>
      )}

      {products.length > 0 && (
        <div>
          <p className="mb-1.5 text-sm font-medium">Productos y servicios</p>
          <ul className="space-y-1 text-sm text-muted-foreground">
            {products.map((p, i) => (
              <li key={i}>
                <span className="font-medium text-foreground">{p.name}</span>
                {p.description ? ` — ${p.description}` : ''}
              </li>
            ))}
          </ul>
        </div>
      )}

      {rules.length > 0 && (
        <div>
          <p className="mb-1.5 text-sm font-medium">Reglas de negocio</p>
          <ul className="space-y-1 text-sm text-muted-foreground">
            {rules.map((r, i) => (
              <li key={i}>
                <span className="font-medium text-foreground">{r.title}</span>
                {r.instruction ? ` — ${r.instruction}` : ''}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border bg-muted/30 px-3 py-2">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-sm font-medium">{value || '—'}</p>
    </div>
  )
}

export default async function ChatbotPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string }>
}) {
  const user = await getSessionUser()
  if (!user || user.role !== 'customer') redirect('/login')

  const { saved } = await searchParams

  let config: CustomerBotConfig | null = null
  let loadError: string | null = null
  try {
    config = await getBotConfig()
  } catch (e) {
    if (e instanceof Error && (e.message === 'NEXT_REDIRECT' || 'digest' in e)) throw e
    loadError = e instanceof Error ? e.message : 'No se pudo cargar la configuración'
  }

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="flex items-center gap-2 text-xl font-semibold text-foreground">
            <Bot className="size-5 text-nexus-purple" />
            Mi Chatbot
          </h1>
          <p className="mt-0.5 text-sm text-muted-foreground">Configura la apariencia e instala tu asistente</p>
        </div>
        {config && (
          <div className="flex items-center gap-2 rounded-xl border bg-card px-4 py-2.5">
            <Power className="size-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Estado</span>
            <BotToggle active={config.isBotActive} effective={config.isBotActiveEffective} />
          </div>
        )}
      </div>

      {saved && (
        <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          <Check className="size-4" /> Cambios guardados correctamente.
        </div>
      )}

      {loadError && (
        <div className="flex items-start gap-2.5 rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          <AlertCircle className="mt-0.5 size-4 shrink-0" />
          {loadError}
        </div>
      )}

      {config && (
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-6">
            {/* CUS-08 */}
            <Section icon={<Palette className="size-4" />} title="Presentación" desc="Apariencia del widget y notificaciones">
              <PresentationForm config={config} />
            </Section>

            {/* CUS-07 */}
            <Section icon={<Lock className="size-4" />} title="Configuración de IA (solo lectura)">
              <ReadOnlyConfig config={config} />
            </Section>
          </div>

          <div className="space-y-6">
            {/* CUS-09 */}
            <Section icon={<Eye className="size-4" />} title="Vista previa" desc="Prueba tu chatbot con la configuración actual">
              <ChatbotPreview
                assistantName={config.assistantName}
                welcomeMessage={config.welcomeMessage}
                primaryColor={config.widgetPrimaryColor}
              />
            </Section>

            {/* CUS-11 */}
            <Section icon={<Code2 className="size-4" />} title="Código de instalación" desc="Pega este snippet en tu sitio web">
              <CopySnippet snippet={config.snippet} />
              <p className="mt-3 text-xs text-muted-foreground">
                URL directa del widget:{' '}
                <a href={config.widgetUrl} target="_blank" rel="noreferrer" className="text-nexus-purple hover:underline">
                  {config.widgetUrl}
                </a>
              </p>
            </Section>

            {/* CUS-12 */}
            <Section icon={<Code2 className="size-4" />} title="Instrucciones de instalación">
              <InstallInstructions />
            </Section>
          </div>
        </div>
      )}
    </div>
  )
}
