import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Bot, Plus, Trash2, ToggleRight } from 'lucide-react'
import { getSessionUser } from '@/lib/session'
import { listBots, createBotAction, deleteBotAction, type BotSummary } from '@/app/actions/bot'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { CreateBotButton, DeleteBotButton } from './_bot-list-actions'

export async function generateMetadata({ params }: { params: Promise<{ customerId: string }> }) {
  const { customerId } = await params
  return { title: `Bots — Cliente #${customerId} · Mindware Nexus` }
}

export default async function BotsListPage({
  params,
}: {
  params: Promise<{ customerId: string }>
}) {
  const user = await getSessionUser()
  if (!user || user.role !== 'owner') redirect('/login')

  const { customerId: customerIdStr } = await params
  const customerId = Number(customerIdStr)

  let bots: BotSummary[] = []
  let loadError: string | null = null
  try {
    bots = await listBots(customerId)
  } catch (e) {
    loadError = e instanceof Error ? e.message : 'No se pudieron cargar los bots'
  }

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Button asChild variant="ghost" size="icon" className="shrink-0">
            <Link href="/dashboard/customers">
              <ArrowLeft className="size-4" />
            </Link>
          </Button>
          <div>
            <h1 className="flex items-center gap-2 text-xl font-semibold text-foreground">
              <Bot className="size-5 text-primary" />
              Bots del cliente #{customerId}
            </h1>
            <p className="text-sm text-muted-foreground">Gestiona los chatbots de este cliente</p>
          </div>
        </div>
        <CreateBotButton customerId={customerId} action={createBotAction} />
      </div>

      {loadError && (
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {loadError}
        </div>
      )}

      {bots.length === 0 && !loadError && (
        <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed py-16 text-muted-foreground">
          <Bot className="size-10 opacity-30" />
          <p className="text-sm">Este cliente aún no tiene bots configurados.</p>
          <CreateBotButton customerId={customerId} action={createBotAction} variant="outline" />
        </div>
      )}

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {bots.map((bot) => (
          <div key={bot.id} className="flex flex-col gap-3 rounded-xl border bg-card p-4">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                <Bot className="size-4 shrink-0 text-primary" />
                <span className="font-medium text-sm truncate">{bot.name}</span>
              </div>
              <Badge
                className={`shrink-0 text-xs ${bot.isBotActive ? 'bg-nexus-purple text-white border-transparent' : ''}`}
                variant={bot.isBotActive ? 'default' : 'secondary'}
              >
                {bot.isBotActive ? 'Activo' : 'Inactivo'}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground font-mono truncate">{bot.clientId}</p>
            <div className="flex items-center gap-2 mt-auto pt-1">
              <Button asChild size="sm" className="flex-1">
                <Link href={`/dashboard/bots/${customerId}/${bot.id}`}>Configurar</Link>
              </Button>
              <DeleteBotButton
                customerId={customerId}
                botId={bot.id}
                botName={bot.name}
                action={deleteBotAction}
                disabled={bots.length <= 1}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
