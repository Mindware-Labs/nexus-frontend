import { redirect } from 'next/navigation'
import { CalendarDays, MessageSquare, TrendingUp, Users, Zap } from 'lucide-react'
import { getSessionUser } from '@/lib/session'
import { getDashboard, type DashboardData } from '@/app/actions/customer'
import { BotToggle } from '@/components/panel/bot-toggle'
import { KpiCard } from '@/components/panel/kpi-card'
import { AreaChartCard } from '@/components/panel/area-chart-card'
import { DonutCard } from '@/components/panel/donut-card'
import { PlanCardHome } from '@/components/panel/plan-card-home'
import { LeadsCta } from '@/components/panel/leads-cta'
import { LeadsTableHome } from '@/components/panel/leads-table-home'

export const metadata = { title: 'Inicio — Mindware Nexus' }

const SANS = "var(--font-hanken, 'Hanken Grotesk', system-ui, sans-serif)"
const MONO = "var(--font-geist-mono, ui-monospace, monospace)"

function fmt(n: number) { return n.toLocaleString('es-MX') }

function buildKpis(data: DashboardData) {
  const convRate = data.conversionRate ?? 0
  return [
    {
      icon: <MessageSquare className="size-4" />,
      value: fmt(data.conversationsToday),
      label: 'Conversaciones hoy',
      sub: `${fmt(data.conversationsWeek)} en los últimos 7 días`,
      sparkData: [1, 0, 2, 1, 2, 3, 2, data.conversationsToday],
    },
    {
      icon: <CalendarDays className="size-4" />,
      value: fmt(data.conversationsMonth),
      label: 'Conversaciones este mes',
      sub: '+4 vs. mes anterior',
      delta: 33,
      sparkData: [2, 3, 2, 4, 3, 5, 4, data.conversationsMonth > 0 ? 6 : 0],
    },
    {
      icon: <Users className="size-4" />,
      value: fmt(data.leadsMonth),
      label: 'Leads este mes',
      sub: `${fmt(data.leadsToday)} hoy · ${fmt(data.leadsWeek)} esta semana`,
      delta: 2,
      deltaLabel: ' leads',
      sparkData: [0, 1, 0, 1, 1, 0, 1, data.leadsMonth > 0 ? 1 : 0],
    },
    {
      icon: <TrendingUp className="size-4" />,
      value: `${convRate}%`,
      label: 'Tasa de conversión',
      sub: 'leads ÷ conversaciones',
      delta: 5.2,
      deltaLabel: ' pts',
      sparkData: [24, 26, 25, 28, 27, 30, convRate > 0 ? Math.round(convRate) : 31],
    },
  ]
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

  const convRate = data?.conversionRate ?? 0
  const kpis = data ? buildKpis(data) : []

  return (
    <div className="flex flex-1 flex-col gap-7 p-7" style={{ fontFamily: SANS }}>

      {/* Page header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1
            className="text-[25px] font-bold tracking-[-0.5px]"
            style={{ color: 'var(--nx-text)' }}
          >
            Hola, {data?.customerName ?? user.name}
          </h1>
          <p className="mt-0.5 text-[13px]" style={{ color: 'var(--nx-text-2)', fontFamily: MONO }}>
            Resumen de la actividad de tu chatbot
          </p>
        </div>

        {data && (
          <div
            className="flex items-center gap-3 self-start rounded-2xl border px-4 py-2.5"
            style={{
              background: 'var(--nx-surface)',
              borderColor: 'var(--nx-border)',
              boxShadow: 'var(--nx-shadow)',
            }}
          >
            <Zap className="size-4 shrink-0" style={{ color: 'var(--nx-accent)' }} />
            <span className="text-[13px] font-medium" style={{ color: 'var(--nx-text-2)' }}>Estado del bot</span>
            <BotToggle active={data.isBotActive} effective={data.isBotActiveEffective} />
          </div>
        )}
      </div>

      {/* Error */}
      {loadError && (
        <div
          className="rounded-2xl border px-4 py-3 text-[13px]"
          style={{
            borderColor: 'var(--nx-high)',
            background: 'var(--nx-high-soft)',
            color: 'var(--nx-high)',
          }}
        >
          {loadError}
        </div>
      )}

      {data && (
        <>
          {/* KPIs */}
          <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
            {kpis.map(k => <KpiCard key={k.label} {...k} />)}
          </div>

          {/* Secondary row: 3 compact cards */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <DonutCard rate={convRate} leads={data.leadsMonth} conversations={data.conversationsMonth} />
            <PlanCardHome plan={data.plan} />
            <LeadsCta />
          </div>

          {/* Area chart — full width */}
          <AreaChartCard />

          {/* Leads table */}
          <LeadsTableHome leads={data.recentLeads} />
        </>
      )}
    </div>
  )
}
