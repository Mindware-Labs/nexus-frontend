import { redirect } from 'next/navigation'
import { AlertCircle, CreditCard, MessageSquare, Sparkles, Users, Zap } from 'lucide-react'
import { getSessionUser } from '@/lib/session'
import { getCustomerPlan, type CustomerPlanUsage } from '@/app/actions/customer-plan'

export const metadata = { title: 'Mi Plan — Mindware Nexus' }

const MONTHS = [
  '', 'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
]

function fmt(n: number | null, unit = ''): string {
  if (n === null) return '∞'
  return n.toLocaleString('es') + (unit ? ' ' + unit : '')
}

function pctColor(p: number): string {
  if (p >= 100) return 'bg-destructive'
  if (p >= 80) return 'bg-amber-500'
  if (p >= 50) return 'bg-nexus-purple'
  return 'bg-nexus-purple'
}

function pctTextColor(p: number): string {
  if (p >= 100) return 'text-destructive'
  if (p >= 80) return 'text-amber-500'
  return 'text-nexus-purple'
}

function UsageBar({
  label, icon: Icon, used, max, percent, unit = '',
}: {
  label: string
  icon: React.ElementType
  used: number
  max: number | null
  percent: number
  unit?: string
}) {
  const unlimited = max === null
  const displayPercent = unlimited ? 0 : percent

  return (
    <div className="rounded-xl border bg-card p-5 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex size-8 items-center justify-center rounded-lg bg-nexus-purple/10">
            <Icon className="size-4 text-nexus-purple" />
          </div>
          <span className="text-sm font-medium text-foreground">{label}</span>
        </div>
        {unlimited ? (
          <span className="text-xs font-medium text-nexus-purple bg-nexus-purple/10 rounded-full px-2.5 py-1">
            Ilimitado
          </span>
        ) : (
          <span className={`text-xs font-semibold ${pctTextColor(percent)}`}>
            {percent}%
          </span>
        )}
      </div>

      {/* Progress bar */}
      {!unlimited && (
        <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${pctColor(percent)}`}
            style={{ width: `${Math.min(displayPercent, 100)}%` }}
          />
        </div>
      )}

      <div className="flex items-end justify-between">
        <div>
          <p className="text-2xl font-bold text-foreground">
            {used.toLocaleString('es')}
            {unit && <span className="ml-1 text-sm font-normal text-muted-foreground">{unit}</span>}
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">
            {unlimited ? 'Sin límite' : `de ${fmt(max, unit)} este mes`}
          </p>
        </div>
        {!unlimited && max !== null && (
          <p className="text-sm text-muted-foreground">
            {Math.max(0, max - used).toLocaleString('es')} restantes
          </p>
        )}
      </div>

      {!unlimited && percent >= 80 && percent < 100 && (
        <div className="flex items-center gap-2 rounded-lg border border-amber-500/30 bg-amber-500/8 px-3 py-2 text-xs text-amber-600 dark:text-amber-400">
          <AlertCircle className="size-3.5 shrink-0" />
          Estás por alcanzar el límite de tu plan este mes.
        </div>
      )}

      {!unlimited && percent >= 100 && (
        <div className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/8 px-3 py-2 text-xs text-destructive">
          <AlertCircle className="size-3.5 shrink-0" />
          Límite alcanzado. Contacta a soporte para ampliar tu plan.
        </div>
      )}
    </div>
  )
}

export default async function CustomerPlanPage() {
  const user = await getSessionUser()
  if (!user || user.role !== 'customer') redirect('/login')

  let data: CustomerPlanUsage | null = null
  let loadError: string | null = null

  try {
    data = await getCustomerPlan()
  } catch (e) {
    if (e instanceof Error && ('digest' in e || e.message === 'NEXT_REDIRECT')) throw e
    loadError = e instanceof Error ? e.message : 'Error al cargar el plan'
  }

  const monthLabel = data ? `${MONTHS[data.month]} ${data.year}` : ''

  return (
    <div className="p-6 pb-12">
      <div className="max-w-2xl mx-auto space-y-6">

        {/* Header */}
        <div>
          <h1 className="flex items-center gap-2 text-xl font-semibold text-foreground">
            <CreditCard className="size-5 text-nexus-purple" />
            Mi Plan
          </h1>
          {monthLabel && (
            <p className="mt-1 text-sm text-muted-foreground">
              Consumo del ciclo actual: <span className="font-medium text-foreground">{monthLabel}</span>
            </p>
          )}
        </div>

        {loadError && (
          <div className="flex items-start gap-2.5 rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
            <AlertCircle className="mt-0.5 size-4 shrink-0" />
            {loadError}
          </div>
        )}

        {data && (
          <>
            {/* Plan badge */}
            <div className="flex items-center gap-4 rounded-2xl border bg-gradient-to-br from-nexus-purple/10 to-nexus-lavender/5 p-5">
              <div className="flex size-12 items-center justify-center rounded-xl bg-gradient-to-br from-nexus-purple to-nexus-lavender shadow-lg shadow-nexus-purple/20">
                <Sparkles className="size-6 text-white" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Plan activo</p>
                <p className="text-2xl font-bold text-foreground mt-0.5">{data.planName}</p>
              </div>
              <div className="ml-auto text-right">
                {data.planId === null ? (
                  <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-1.5 text-xs text-amber-600 dark:text-amber-400">
                    Sin plan asignado
                  </div>
                ) : (
                  <span className="text-xs text-muted-foreground/60">ID #{data.planId}</span>
                )}
              </div>
            </div>

            {/* Usage bars */}
            <div className="grid gap-4">
              <UsageBar
                label="Conversaciones"
                icon={MessageSquare}
                used={data.conversationsCount}
                max={data.maxConversations}
                percent={data.conversationsPercent}
              />
              <UsageBar
                label="Tokens"
                icon={Zap}
                used={data.tokensCount}
                max={data.maxTokens}
                percent={data.tokensPercent}
                unit="tokens"
              />
              <UsageBar
                label="Leads capturados"
                icon={Users}
                used={data.leadsCount}
                max={data.maxLeads}
                percent={data.leadsPercent}
              />
            </div>

            {/* Renewal note */}
            <p className="text-xs text-muted-foreground text-center">
              Los contadores se reinician el 1 del próximo mes. Para ampliar tu plan, contacta a{' '}
              <a href="mailto:labsmindware@gmail.com" className="text-nexus-purple hover:underline">
                labsmindware@gmail.com
              </a>
            </p>
          </>
        )}
      </div>
    </div>
  )
}
