import { Suspense } from 'react'
import { redirect } from 'next/navigation'
import { AlertCircle, BarChart2, Clock, TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { getSessionUser } from '@/lib/session'
import {
  getAnalytics,
  getCustomerTopics,
  type AnalyticsData,
  type Period,
} from '@/app/actions/customer'
import type { TopicsReport } from '@/app/actions/reports'
import { TrendChart, ChartLegend } from '@/components/reports/trend-chart'
import { PeriodSelector } from '@/components/reports/period-selector'
import { TopicsPanel } from '@/components/reports/topics-panel'

export const metadata = { title: 'Analítica — Mindware Nexus' }

const VALID: Period[] = ['7d', '30d', 'month', '3m', 'all']
function isPeriod(v: unknown): v is Period {
  return VALID.includes(v as Period)
}

function fmtDuration(seconds: number) {
  if (seconds <= 0) return '0s'
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return m > 0 ? `${m}m ${s}s` : `${s}s`
}

function PeakHours({ data }: { data: AnalyticsData['peakHours'] }) {
  const max = Math.max(1, ...data.map((d) => d.count))
  return (
    <div className="flex items-end gap-1" style={{ height: 120 }}>
      {data.map((d) => (
        <div key={d.hour} className="flex flex-1 flex-col items-center gap-1" title={`${d.hour}:00 — ${d.count}`}>
          <div className="flex w-full flex-1 items-end">
            <div
              className="w-full rounded-t bg-nexus-purple/70"
              style={{ height: `${(d.count / max) * 100}%`, minHeight: d.count > 0 ? 2 : 0 }}
            />
          </div>
          {d.hour % 6 === 0 && <span className="text-[9px] text-muted-foreground">{d.hour}h</span>}
        </div>
      ))}
    </div>
  )
}

function ConversionComparison({ comparison }: { comparison: AnalyticsData['comparison'] }) {
  const diff = comparison.current.rate - comparison.previous.rate
  const Icon = diff > 0 ? TrendingUp : diff < 0 ? TrendingDown : Minus
  const color = diff > 0 ? 'text-emerald-600' : diff < 0 ? 'text-red-600' : 'text-muted-foreground'
  return (
    <div className="rounded-xl border bg-card p-5">
      <h2 className="text-sm font-semibold">Conversión vs período anterior</h2>
      <div className="mt-4 flex items-end gap-3">
        <span className="text-3xl font-bold text-nexus-purple">{comparison.current.rate}%</span>
        <span className={`flex items-center gap-1 pb-1 text-sm font-medium ${color}`}>
          <Icon className="size-4" />
          {diff > 0 ? '+' : ''}{diff.toFixed(1)} pts
        </span>
      </div>
      <p className="mt-2 text-xs text-muted-foreground">
        Actual: {comparison.current.leads} leads / {comparison.current.conversations} conv. ·
        {' '}Anterior: {comparison.previous.rate}% ({comparison.previous.leads}/{comparison.previous.conversations})
      </p>
    </div>
  )
}

export default async function AnalyticsPage({
  searchParams,
}: {
  searchParams: Promise<{ period?: string }>
}) {
  const user = await getSessionUser()
  if (!user || user.role !== 'customer') redirect('/login')

  const { period: raw } = await searchParams
  const period: Period = isPeriod(raw) ? raw : 'month'

  let analytics: AnalyticsData | null = null
  let topics: TopicsReport | null = null
  let loadError: string | null = null

  const [aRes, tRes] = await Promise.allSettled([getAnalytics(period), getCustomerTopics(period)])
  for (const r of [aRes, tRes]) {
    if (r.status === 'rejected') {
      const e = r.reason as Error & { digest?: string }
      if (e?.message === 'NEXT_REDIRECT' || e?.digest?.startsWith('NEXT_REDIRECT')) throw e
    }
  }
  if (aRes.status === 'fulfilled') analytics = aRes.value
  else loadError = aRes.reason instanceof Error ? aRes.reason.message : 'No se pudo cargar la analítica'
  if (tRes.status === 'fulfilled') topics = tRes.value

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-xl font-semibold text-foreground">
            <BarChart2 className="size-5 text-nexus-purple" />
            Analítica
          </h1>
          <p className="mt-0.5 text-sm text-muted-foreground">Tendencias y comportamiento de tu chatbot</p>
        </div>
        <Suspense>
          <PeriodSelector current={period} />
        </Suspense>
      </div>

      {loadError && (
        <div className="flex items-start gap-2.5 rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          <AlertCircle className="mt-0.5 size-4 shrink-0" />
          {loadError}
        </div>
      )}

      {analytics && (
        <>
          <div className="grid gap-4 sm:grid-cols-3">
            <ConversionComparison comparison={analytics.comparison} />
            <div className="rounded-xl border bg-card p-5">
              <h2 className="flex items-center gap-2 text-sm font-semibold">
                <Clock className="size-4 text-nexus-purple" />
                Duración promedio
              </h2>
              <p className="mt-4 text-3xl font-bold text-nexus-purple">{fmtDuration(analytics.avgDurationSeconds)}</p>
              <p className="mt-1 text-xs text-muted-foreground">por conversación · CUS-26</p>
            </div>
            <div className="rounded-xl border bg-card p-5">
              <h2 className="text-sm font-semibold">Total de conversaciones</h2>
              <p className="mt-4 text-3xl font-bold text-nexus-purple">{analytics.totalConversations}</p>
              <p className="mt-1 text-xs text-muted-foreground">en el período</p>
            </div>
          </div>

          {/* CUS-23 — conversaciones por período */}
          <div className="rounded-xl border bg-card p-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-sm font-semibold">
                <TrendingUp className="size-4 text-nexus-purple" />
                Conversaciones y leads por día
              </h2>
              <ChartLegend />
            </div>
            <TrendChart data={analytics.series} />
          </div>

          {/* CUS-27 — horas pico */}
          <div className="rounded-xl border bg-card p-5">
            <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold">
              <Clock className="size-4 text-nexus-purple" />
              Horas con mayor volumen
            </h2>
            <PeakHours data={analytics.peakHours} />
          </div>

          {/* CUS-25 — temas recurrentes */}
          {topics && (
            <div className="rounded-xl border bg-card">
              <div className="border-b px-5 py-4">
                <h2 className="flex items-center gap-2 text-sm font-semibold">
                  <BarChart2 className="size-4 text-nexus-purple" />
                  Temas más recurrentes
                </h2>
              </div>
              <div className="p-5">
                <TopicsPanel topics={topics} />
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
