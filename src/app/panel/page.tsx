import Link from 'next/link'
import { redirect } from 'next/navigation'
import {
  AlertCircle,
  ArrowRight,
  CalendarDays,
  Gauge,
  MessageSquare,
  Power,
  TrendingUp,
  Users,
} from 'lucide-react'
import { getSessionUser } from '@/lib/session'
import { getDashboard, type DashboardData } from '@/app/actions/customer'
import { BotToggle } from '@/components/panel/bot-toggle'
import { Badge } from '@/components/ui/badge'

export const metadata = { title: 'Inicio — Mindware Nexus' }

function fmt(n: number) {
  return new Intl.NumberFormat('es-MX').format(n)
}

function StatCard({
  icon,
  label,
  value,
  sub,
}: {
  icon: React.ReactNode
  label: string
  value: string
  sub?: string
}) {
  return (
    <div className="rounded-xl border bg-card p-5">
      <div className="flex size-10 items-center justify-center rounded-lg bg-nexus-purple/10">
        <span className="text-nexus-purple">{icon}</span>
      </div>
      <p className="mt-4 text-2xl font-bold tracking-tight text-foreground">{value}</p>
      <p className="mt-0.5 text-sm font-medium text-foreground">{label}</p>
      {sub && <p className="mt-0.5 text-xs text-muted-foreground">{sub}</p>}
    </div>
  )
}

function classColor(c: string | null) {
  if (c === 'Alta') return 'bg-nexus-mint/15 text-emerald-700 border-emerald-200'
  if (c === 'Media') return 'bg-amber-100 text-amber-700 border-amber-200'
  if (c === 'Baja') return 'bg-red-100 text-red-700 border-red-200'
  return 'bg-muted text-muted-foreground'
}

function PlanUsage({ data }: { data: DashboardData['plan'] }) {
  const renewal = new Date(data.renewalDate).toLocaleDateString('es-MX', {
    day: 'numeric',
    month: 'long',
  })
  const danger = data.percentage >= 80
  const barColor = data.unlimited
    ? 'bg-nexus-lavender'
    : danger
      ? 'bg-amber-500'
      : 'bg-nexus-purple'

  return (
    <div className="rounded-xl border bg-card p-5">
      <div className="flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-sm font-semibold">
          <Gauge className="size-4 text-nexus-purple" />
          Consumo del plan
        </h2>
        <Badge variant="outline" className="text-xs">{data.planLabel}</Badge>
      </div>

      {data.unlimited ? (
        <p className="mt-4 text-2xl font-bold">{fmt(data.used)}</p>
      ) : (
        <p className="mt-4 text-2xl font-bold">
          {fmt(data.used)} <span className="text-base font-normal text-muted-foreground">/ {fmt(data.monthlyLimit ?? 0)}</span>
        </p>
      )}
      <p className="text-xs text-muted-foreground">conversaciones este ciclo</p>

      {!data.unlimited && (
        <div className="mt-3 h-2.5 w-full overflow-hidden rounded-full bg-muted">
          <div
            className={`h-full rounded-full ${barColor} transition-all`}
            style={{ width: `${data.percentage}%` }}
          />
        </div>
      )}

      <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
        <span>{data.unlimited ? 'Plan ilimitado' : `${data.percentage}% usado`}</span>
        <span>Renueva el {renewal}</span>
      </div>
      {danger && !data.unlimited && (
        <p className="mt-2 text-xs text-amber-600">Estás cerca del límite de tu plan.</p>
      )}
    </div>
  )
}

export default async function PanelHome() {
  const user = await getSessionUser()
  if (!user || user.role !== 'customer') redirect('/login')

  let data: DashboardData | null = null
  let loadError: string | null = null
  try {
    data = await getDashboard()
  } catch (e) {
    if (e instanceof Error && (e.message === 'NEXT_REDIRECT' || 'digest' in e)) throw e
    loadError = e instanceof Error ? e.message : 'No se pudo cargar el panel'
  }

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold text-foreground">
            Hola, {data?.customerName ?? user.name}
          </h1>
          <p className="mt-0.5 text-sm text-muted-foreground">Resumen de la actividad de tu chatbot</p>
        </div>
        {data && (
          <div className="flex items-center gap-2 rounded-xl border bg-card px-4 py-2.5">
            <Power className="size-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Estado del bot</span>
            <BotToggle active={data.isBotActive} effective={data.isBotActiveEffective} />
          </div>
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
          {/* CUS-01 / CUS-02 / CUS-03 */}
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              icon={<MessageSquare className="size-5" />}
              label="Conversaciones hoy"
              value={fmt(data.conversationsToday)}
              sub={`${fmt(data.conversationsWeek)} en los últimos 7 días`}
            />
            <StatCard
              icon={<CalendarDays className="size-5" />}
              label="Conversaciones este mes"
              value={fmt(data.conversationsMonth)}
            />
            <StatCard
              icon={<Users className="size-5" />}
              label="Leads este mes"
              value={fmt(data.leadsMonth)}
              sub={`${fmt(data.leadsToday)} hoy · ${fmt(data.leadsWeek)} esta semana`}
            />
            <StatCard
              icon={<TrendingUp className="size-5" />}
              label="Tasa de conversión"
              value={`${data.conversionRate}%`}
              sub="leads ÷ conversaciones (mes)"
            />
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            {/* CUS-06 */}
            <PlanUsage data={data.plan} />

            {/* CUS-03 visual conversion gauge */}
            <div className="rounded-xl border bg-card p-5">
              <h2 className="flex items-center gap-2 text-sm font-semibold">
                <TrendingUp className="size-4 text-nexus-purple" />
                Conversión del mes
              </h2>
              <div className="mt-4 flex items-end gap-2">
                <span className="text-3xl font-bold text-nexus-purple">{data.conversionRate}%</span>
              </div>
              <div className="mt-3 h-2.5 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-nexus-mint transition-all"
                  style={{ width: `${Math.min(100, data.conversionRate)}%` }}
                />
              </div>
              <p className="mt-3 text-xs text-muted-foreground">
                {fmt(data.leadsMonth)} leads de {fmt(data.conversationsMonth)} conversaciones
              </p>
            </div>

            {/* CUS-05 — acceso rápido a leads nuevos */}
            <Link
              href="/panel/leads?status=nuevo"
              className="group flex flex-col justify-between rounded-xl border bg-card p-5 transition-colors hover:border-nexus-purple/40"
            >
              <div>
                <h2 className="flex items-center gap-2 text-sm font-semibold">
                  <Users className="size-4 text-nexus-purple" />
                  Leads sin revisar
                </h2>
                <p className="mt-3 text-sm text-muted-foreground">
                  Revisa los leads nuevos capturados por tu chatbot y muévelos por el pipeline.
                </p>
              </div>
              <span className="mt-4 flex items-center gap-1.5 text-sm font-medium text-nexus-purple">
                Ver leads nuevos
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
              </span>
            </Link>
          </div>

          {/* CUS-01 — leads recientes */}
          <div className="rounded-xl border bg-card">
            <div className="flex items-center justify-between border-b px-5 py-4">
              <h2 className="text-sm font-semibold">Leads recientes</h2>
              <Link href="/panel/leads" className="text-xs font-medium text-nexus-purple hover:underline">
                Ver todos
              </Link>
            </div>
            {data.recentLeads.length === 0 ? (
              <p className="px-5 py-10 text-center text-sm text-muted-foreground">
                Aún no hay leads capturados.
              </p>
            ) : (
              <ul className="divide-y">
                {data.recentLeads.map((l, i) => (
                  <li key={i} className="flex items-center justify-between gap-4 px-5 py-3.5">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-foreground">
                        {l.name || l.email || 'Contacto sin nombre'}
                      </p>
                      <p className="truncate text-xs text-muted-foreground">{l.summary || l.email || '—'}</p>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      {l.classification && (
                        <span className={`rounded-full border px-2 py-0.5 text-[11px] font-medium ${classColor(l.classification)}`}>
                          {l.classification}
                        </span>
                      )}
                      <span className="text-xs text-muted-foreground">
                        {new Date(l.created_at).toLocaleDateString('es-MX')}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </>
      )}
    </div>
  )
}
