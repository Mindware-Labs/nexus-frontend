import { redirect } from 'next/navigation'
import { AlertCircle, Bot } from 'lucide-react'
import { getSessionUser } from '@/lib/session'
import { listCustomerBots, createCustomerBotAction, type CustomerBotSummary } from '@/app/actions/customer'
import { Badge } from '@/components/ui/badge'
import { CreateCustomerBotButton } from './_bot-list-actions'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export const metadata = { title: 'Mis Chatbots — Mindware Nexus' }

export default async function ChatbotPage() {
  const user = await getSessionUser()
  if (!user || user.role !== 'customer') redirect('/login')

  let bots: CustomerBotSummary[] = []
  let loadError: string | null = null
  try {
    bots = await listCustomerBots()
  } catch (e) {
    if (e instanceof Error && ('digest' in e || e.message === 'NEXT_REDIRECT')) throw e
    loadError = e instanceof Error ? e.message : 'No se pudieron cargar los bots'
  }

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="flex items-center gap-2 text-xl font-semibold text-foreground">
            <Bot className="size-5 text-nexus-purple" />
            Mis Chatbots
          </h1>
          <p className="mt-0.5 text-sm text-muted-foreground">Gestiona y configura tus asistentes</p>
        </div>
        <CreateCustomerBotButton action={createCustomerBotAction} />
      </div>

      {loadError && (
        <div className="flex items-start gap-2.5 rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          <AlertCircle className="mt-0.5 size-4 shrink-0" />
          {loadError}
        </div>
      )}

      {bots.length === 0 && !loadError && (
        <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed py-16 text-muted-foreground">
          <Bot className="size-10 opacity-30" />
          <p className="text-sm">Aún no tienes bots configurados.</p>
          <CreateCustomerBotButton action={createCustomerBotAction} variant="outline" />
        </div>
      )}

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {bots.map((bot) => (
          <div key={bot.id} className="flex flex-col gap-3 rounded-xl border bg-card p-4">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                <Bot className="size-4 shrink-0 text-nexus-purple" />
                <span className="font-medium text-sm truncate">{bot.name}</span>
              </div>
              <Badge variant={bot.isBotActive ? 'default' : 'secondary'} className="shrink-0 text-xs">
                {bot.isBotActive ? 'Activo' : 'Inactivo'}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground font-mono truncate">{bot.clientId}</p>
            <Button asChild size="sm" className="mt-auto">
              <Link href={`/panel/chatbot/${bot.id}`}>Configurar</Link>
            </Button>
          </div>
        ))}
      </div>
    </div>
  )
}
