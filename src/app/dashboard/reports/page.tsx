import { Suspense } from 'react'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import {
  AlertCircle,
  BarChart2,
  MessageSquare,
  Users,
  Zap,
  DollarSign,
  Trophy,
  TrendingUp,
} from 'lucide-react'
import { getSessionUser } from '@/lib/session'
import { getGlobalReports, type Period, type GlobalReports } from '@/app/actions/reports'
import { PeriodSelector } from '@/components/reports/period-selector'
import { CsvExportButton } from '@/components/reports/csv-export-button'
import { TrendChart, ChartLegend } from '@/components/reports/trend-chart'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'

export const metadata = { title: 'Reportes — Mindware Nexus' }

const VALID_PERIODS: Period[] = ['7d', '30d', 'month', '3m', 'all']

function isPeriod(v: unknown): v is Period {
  return VALID_PERIODS.includes(v as Period)
}

function fmt(n: number) {
  return new Intl.NumberFormat('es-MX').format(n)
}

function fmtCost(usd: number) {
  return `$${usd.toFixed(4)}`
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

function ReportsContent({ reports, period }: { reports: GlobalReports; period: Period }) {
  const rankingCsvRows = reports.clientRanking.map((r) => ({
    Cliente: r.customerName,
    Conversaciones: r.conversations,
    Leads: r.leads,
    'Tokens totales': r.totalTokens,
    'Costo estimado USD': r.estimatedCostUsd,
  }))

  const trendCsvRows = reports.trend.map((t) => ({
    Fecha: t.date,
    Conversaciones: t.conversations,
    Leads: t.leads,
  }))

  const conversionGlobal =
    reports.totalConversations > 0
      ? ((reports.totalLeads / reports.totalConversations) * 100).toFixed(1)
      : '0.0'

  return (
    <>
      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon={<MessageSquare className="size-5" />}
          label="Conversaciones"
          value={fmt(reports.totalConversations)}
          sub="Turnos totales de chat"
        />
        <StatCard
          icon={<Users className="size-5" />}
          label="Leads capturados"
          value={fmt(reports.totalLeads)}
          sub={`Tasa de conversión: ${conversionGlobal}%`}
        />
        <StatCard
          icon={<Zap className="size-5" />}
          label="Tokens consumidos"
          value={fmt(reports.totalTokens)}
          sub={`${fmt(reports.promptTokens)} entrada · ${fmt(reports.completionTokens)} salida`}
        />
        <StatCard
          icon={<DollarSign className="size-5" />}
          label="Costo estimado"
          value={`$${reports.estimatedCostUsd.toFixed(4)}`}
          sub="USD · Gemini Flash Lite"
        />
      </div>

      {/* Trend chart — REP-05 */}
      <div className="rounded-xl border bg-card p-5">
        <div className="mb-4 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <TrendingUp className="size-4 text-nexus-purple" />
              Tendencia de uso
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">Conversaciones y leads por día</p>
          </div>
          <div className="flex items-center gap-3">
            <ChartLegend />
            <CsvExportButton
              filename={`tendencia-${period}.csv`}
              rows={trendCsvRows}
              label="CSV"
            />
          </div>
        </div>
        <TrendChart data={reports.trend} />
      </div>

      {/* Client ranking — REP-03 / REP-04 */}
      <div className="rounded-xl border bg-card">
        <div className="flex items-center justify-between gap-4 border-b px-5 py-4">
          <div>
            <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Trophy className="size-4 text-nexus-purple" />
              Ranking de clientes
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Ordenado por consumo de tokens · REP-03/04
            </p>
          </div>
          <CsvExportButton
            filename={`ranking-clientes-${period}.csv`}
            rows={rankingCsvRows}
          />
        </div>

        {reports.clientRanking.length === 0 ? (
          <div className="py-14 text-center text-sm text-muted-foreground">
            Sin actividad en el período seleccionado
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-8">#</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead className="text-right">Conversaciones</TableHead>
                <TableHead className="text-right">Leads</TableHead>
                <TableHead className="text-right">Tokens</TableHead>
                <TableHead className="text-right">Costo est.</TableHead>
                <TableHead className="w-8" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {reports.clientRanking.map((r, i) => (
                <TableRow key={r.customerId}>
                  <TableCell className="text-muted-foreground text-xs">{i + 1}</TableCell>
                  <TableCell className="font-medium text-foreground">{r.customerName}</TableCell>
                  <TableCell className="text-right tabular-nums">{fmt(r.conversations)}</TableCell>
                  <TableCell className="text-right tabular-nums">
                    <span className={r.leads > 0 ? 'text-nexus-mint font-medium' : 'text-muted-foreground'}>
                      {fmt(r.leads)}
                    </span>
                  </TableCell>
                  <TableCell className="text-right tabular-nums text-muted-foreground">
                    {fmt(r.totalTokens)}
                  </TableCell>
                  <TableCell className="text-right tabular-nums text-xs text-muted-foreground">
                    {fmtCost(r.estimatedCostUsd)}
                  </TableCell>
                  <TableCell>
                    <Link
                      href={`/dashboard/customers/${r.customerId}?period=${period}`}
                      className="text-xs text-nexus-purple hover:underline"
                    >
                      Ver
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </>
  )
}

export default async function ReportsPage({
  searchParams,
}: {
  searchParams: Promise<{ period?: string }>
}) {
  const user = await getSessionUser()
  if (!user || user.role !== 'owner') redirect('/login')

  const { period: rawPeriod } = await searchParams
  const period: Period = isPeriod(rawPeriod) ? rawPeriod : 'month'

  let reports: GlobalReports | null = null
  let loadError: string | null = null

  try {
    reports = await getGlobalReports(period)
  } catch (err) {
    loadError = err instanceof Error ? err.message : 'No se pudieron cargar los reportes'
  }

  const periodLabels: Record<Period, string> = {
    '7d': 'últimos 7 días',
    '30d': 'últimos 30 días',
    month: 'este mes',
    '3m': 'últimos 3 meses',
    all: 'todo el historial',
  }

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-xl font-semibold text-foreground">
            <BarChart2 className="size-5 text-nexus-purple" />
            Reportes
          </h1>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Vista global de la plataforma · {periodLabels[period]}
          </p>
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

      {reports && <ReportsContent reports={reports} period={period} />}

      {/* REP-12/14/15 placeholder */}
      <div className="rounded-xl border border-dashed bg-muted/20 p-5 text-center">
        <p className="text-sm font-medium text-muted-foreground">
          Análisis de temas frecuentes (REP-12) · Batch de temas con IA (REP-14) · Tablas
          agregadas diarias (REP-15)
        </p>
        <p className="mt-1 text-xs text-muted-foreground/60">
          Requieren worker de agregación diaria — próximamente
        </p>
      </div>
    </div>
  )
}
