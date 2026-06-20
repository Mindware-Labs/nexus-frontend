import { redirect } from 'next/navigation'
import { AlertCircle, ArrowLeft, Bot, Code2, Eye, Power } from 'lucide-react'
import Link from 'next/link'
import { getSessionUser } from '@/lib/session'
import { getCustomerBotConfig, toggleCustomerBotAction, type CustomerBotConfig } from '@/app/actions/customer'
import { BotToggle } from '@/components/panel/bot-toggle'
import { ChatbotPreview } from '@/components/panel/chatbot-preview'
import { CopySnippet, InstallInstructions } from '@/components/panel/copy-snippet'
import { BotConfigForm } from '@/app/dashboard/bots/[customerId]/bot-config-form'
import { Button } from '@/components/ui/button'
import type { BotConfig } from '@/app/actions/bot'

export async function generateMetadata({ params }: { params: Promise<{ botId: string }> }) {
  const { botId } = await params
  return { title: `Chatbot #${botId} — Mindware Nexus` }
}

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

function toFormConfig(c: CustomerBotConfig): BotConfig {
  return c as unknown as BotConfig
}

export default async function CustomerBotConfigPage({
  params,
}: {
  params: Promise<{ botId: string }>
}) {
  const user = await getSessionUser()
  if (!user || user.role !== 'customer') redirect('/login')

  const { botId: botIdStr } = await params
  const botId = Number(botIdStr)

  async function toggleThisBot(active: boolean) {
    'use server'
    await toggleCustomerBotAction(botId, active)
  }

  let config: CustomerBotConfig | null = null
  let loadError: string | null = null
  try {
    config = await getCustomerBotConfig(botId)
  } catch (e) {
    if (e instanceof Error && (e.message === 'NEXT_REDIRECT' || 'digest' in e)) throw e
    loadError = e instanceof Error ? e.message : 'No se pudo cargar la configuración'
  }

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Button asChild variant="ghost" size="icon" className="shrink-0">
            <Link href="/panel/chatbot">
              <ArrowLeft className="size-4" />
            </Link>
          </Button>
          <div>
            <h1 className="flex items-center gap-2 text-xl font-semibold text-foreground">
              <Bot className="size-5 text-nexus-purple" />
              {config?.botName ?? `Chatbot #${botId}`}
            </h1>
            <p className="mt-0.5 text-sm text-muted-foreground">Configura tu asistente e instálalo en tu sitio</p>
          </div>
        </div>
        {config && (
          <div className="flex items-center gap-2 rounded-xl border bg-card px-4 py-2.5">
            <Power className="size-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Estado</span>
            <BotToggle active={config.isBotActive} effective={config.isBotActiveEffective} onToggle={toggleThisBot} />
          </div>
        )}
      </div>

      {loadError && (
        <div className="flex items-start gap-2.5 rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          <AlertCircle className="mt-0.5 size-4 shrink-0" />
          {loadError}
        </div>
      )}

      {config && (
        <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
          <BotConfigForm
            config={toFormConfig(config)}
            customerId={config.customerId}
            botId={botId}
            mode="customer"
          />

          <div className="space-y-6">
            <Section icon={<Eye className="size-4" />} title="Vista previa" desc="Prueba tu chatbot con la configuración actual">
              <ChatbotPreview
                assistantName={config.assistantName}
                welcomeMessage={config.welcomeMessage}
                primaryColor={config.widgetPrimaryColor}
              />
            </Section>

            <Section icon={<Code2 className="size-4" />} title="Código de instalación" desc="Pega este snippet en tu sitio web">
              <CopySnippet snippet={config.snippet} />
              <p className="mt-3 text-xs text-muted-foreground">
                URL directa del widget:{' '}
                <a href={config.widgetUrl} target="_blank" rel="noreferrer" className="text-nexus-purple hover:underline">
                  {config.widgetUrl}
                </a>
              </p>
            </Section>

            <Section icon={<Code2 className="size-4" />} title="Instrucciones de instalación">
              <InstallInstructions />
            </Section>
          </div>
        </div>
      )}
    </div>
  )
}
