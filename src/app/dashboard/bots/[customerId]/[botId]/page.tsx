import { redirect } from 'next/navigation'
import Link from 'next/link'
import { AlertCircle, ArrowLeft } from 'lucide-react'
import { getSessionUser } from '@/lib/session'
import { getBotConfig } from '@/app/actions/bot'
import { listAvailableModels } from '@/app/actions/api-keys'
import { Button } from '@/components/ui/button'
import { BotConfigForm } from '../bot-config-form'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ customerId: string; botId: string }>
}) {
  const { customerId, botId } = await params
  return { title: `Bot #${botId} — Cliente #${customerId} · Mindware Nexus` }
}

export default async function BotConfigPage({
  params,
}: {
  params: Promise<{ customerId: string; botId: string }>
}) {
  const user = await getSessionUser()
  if (!user || user.role !== 'owner') redirect('/login')

  const { customerId: customerIdStr, botId: botIdStr } = await params
  const customerId = Number(customerIdStr)
  const botId = Number(botIdStr)

  let config = null
  let loadError: string | null = null

  const [configResult, modelsResult] = await Promise.allSettled([
    getBotConfig(customerId, botId),
    listAvailableModels(),
  ])

  if (configResult.status === 'fulfilled') {
    config = configResult.value
  } else {
    const err = configResult.reason
    loadError = err instanceof Error ? err.message : 'No se pudo cargar la configuración del bot'
  }

  const availableModels = modelsResult.status === 'fulfilled' ? modelsResult.value : []

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <div className="flex items-center gap-3">
        <Button asChild variant="ghost" size="icon" className="shrink-0">
          <Link href={`/dashboard/bots/${customerId}`}>
            <ArrowLeft className="size-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-xl font-semibold text-foreground">
            {config ? `${config.botName} — ${config.customerName}` : `Bot #${botId}`}
          </h1>
          <p className="text-sm text-muted-foreground">
            {config?.tenantName ? `${config.tenantName} · ` : ''}
            Configuración completa del chatbot
          </p>
        </div>
      </div>

      {loadError && (
        <div className="flex items-start gap-2.5 rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          <AlertCircle className="mt-0.5 size-4 shrink-0" />
          {loadError}
        </div>
      )}

      {config && (
        <BotConfigForm
          config={config}
          customerId={customerId}
          botId={botId}
          availableModels={availableModels}
        />
      )}
    </div>
  )
}
