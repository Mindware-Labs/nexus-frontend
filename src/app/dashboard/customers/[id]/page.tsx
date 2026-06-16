import { Suspense } from 'react'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import {
  ArrowLeft,
  AlertCircle,
  MessageSquare,
  Users,
  Zap,
  Clock,
  DollarSign,
  TrendingUp,
  Bot,
  RefreshCw,
  Mail,
  Phone,
  Building2,
  User,
  Star,
  ArrowUpDown,
  Filter,
  Lightbulb,
} from 'lucide-react'
import { getSessionUser } from '@/lib/session'
import { getCustomerReports, type Period, type CustomerReports } from '@/app/actions/reports'
import { PeriodSelector } from '@/components/reports/period-selector'
import { LeadFilters } from '@/components/reports/lead-filters'
import { CsvExportButton } from '@/components/reports/csv-export-button'
import { ExcelExportButton } from '@/components/reports/excel-export-button'
import { PdfExportButton } from '@/components/reports/pdf-export-button'
import { TrendChart, ChartLegend } from '@/components/reports/trend-chart'
import { TranscriptDialog } from '@/components/reports/transcript-dialog'
import { ScoringBreakdownDialog } from '@/components/reports/scoring-breakdown-dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return { title: `Reporte cliente #${id} — Mindware Nexus` }
}

const VALID_PERIODS: Period[] = ['7d', '30d', 'month', '3m', 'all']
function isPeriod(v: unknown): v is Period {
  return VALID_PERIODS.includes(v as Period)
}

function fmt(n: number) {
  return new Intl.NumberFormat('es-MX').format(n)
}

function fmtDate(iso: string) {
  return new Intl.DateTimeFormat('es-MX', { dateStyle: 'medium', timeStyle: 'short' }).format(
    new Date(iso),
  )
}

function fmtDateShort(iso: string) {
  return new Intl.DateTimeFormat('es-MX', { dateStyle: 'short' }).format(new Date(iso))
}

function ScoreBadge({ score, classification }: { score: number | null; classification: string | null }) {
  if (score == null) return <span className="text-xs text-muted-foreground/50">—</span>
  const color =
    classification === 'Alta' ? 'text-green-700 bg-green-50 border-green-200 dark:text-green-400 dark:bg-green-950/30 dark:border-green-800'
    : classification === 'Media' ? 'text-amber-700 bg-amber-50 border-amber-200 dark:text-amber-400 dark:bg-amber-950/30 dark:border-amber-800'
    : 'text-red-700 bg-red-50 border-red-200 dark:text-red-400 dark:bg-red-950/30 dark:border-red-800'
  return (
    <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-semibold ${color}`}>
      {classification === 'Alta' && <Star className="size-3 fill-current" />}
      {classification} · {score}
    </span>
  )
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

function ReportsContent({
  reports,
  period,
  sortLeads,
  filterClass,
}: {
  reports: CustomerReports
  period: Period
  sortLeads: 'date' | 'score'
  filterClass: string | null
}) {
  let displayLeads = [...reports.leadsList]
  if (filterClass) displayLeads = displayLeads.filter((l) => l.classification === filterClass)
  if (sortLeads === 'score') {
    displayLeads.sort((a, b) => (b.score ?? -1) - (a.score ?? -1))
  }

  const leadsCsvRows = displayLeads.map((l) => ({
    Nombre: l.name ?? '',
    Email: l.email ?? '',
    Teléfono: l.phone ?? '',
    Empresa: l.company ?? '',
    Score: l.score ?? '',
    Clasificación: l.classification ?? '',
    Resumen: l.summary,
    'Siguiente acción': l.next_action ?? '',
    Fecha: l.created_at,
  }))

  return (
    <>
      {/* Stats — REP-07/08/11 */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard
          icon={<MessageSquare className="size-5" />}
          label="Conversaciones"
          value={fmt(reports.conversations)}
          sub="Turnos en el período"
        />
        <StatCard
          icon={<Users className="size-5" />}
          label="Leads capturados"
          value={fmt(reports.leads)}
          sub="En el período"
        />
        <StatCard
          icon={<RefreshCw className="size-5" />}
          label="Conversión"
          value={`${reports.conversionRate}%`}
          sub="Conversaciones → lead"
        />
        <StatCard
          icon={<Zap className="size-5" />}
          label="Tokens"
          value={fmt(reports.totalTokens)}
          sub={`${fmt(reports.promptTokens)} entrada · ${fmt(reports.completionTokens)} salida`}
        />
        <StatCard
          icon={<DollarSign className="size-5" />}
          label="Costo est."
          value={`$${reports.estimatedCostUsd.toFixed(4)}`}
          sub="USD · Gemini Flash"
        />
      </div>

      {/* Modelos utilizados — REP-11 */}
      {reports.modelsUsed.length > 0 && (
        <div className="rounded-xl border bg-card p-5">
          <h2 className="mb-3 text-sm font-semibold text-foreground flex items-center gap-2">
            <Bot className="size-4 text-nexus-purple" />
            Modelos utilizados
          </h2>
          <div className="flex flex-wrap gap-2">
            {reports.modelsUsed.map((m) => (
              <div
                key={m.model}
                className="flex items-center gap-2 rounded-lg border bg-muted/30 px-3 py-2"
              >
                <span className="text-sm font-medium text-foreground">{m.model}</span>
                <Badge variant="outline" className="text-xs">
                  {fmt(m.count)} turnos
                </Badge>
                <span className="text-xs text-muted-foreground">{fmt(m.tokens)} tokens</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tendencia — REP-05/07 */}
      <div className="rounded-xl border bg-card p-5">
        <div className="mb-4 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <TrendingUp className="size-4 text-nexus-purple" />
              Tendencia de uso
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">Conversaciones y leads por día</p>
          </div>
          <ChartLegend />
        </div>
        <TrendChart data={reports.trend} />
      </div>

      {/* Leads list — REP-09/10 + NEX-06 */}
      <div className="rounded-xl border bg-card">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b px-5 py-4">
          <div>
            <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Users className="size-4 text-nexus-purple" />
              Leads capturados
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              {displayLeads.length} de {reports.leadsList.length} leads · con calificación inteligente (NEX-01)
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {/* NEX-06: filtro por clasificación */}
            <Suspense>
              <LeadFilters currentSort={sortLeads} currentFilter={filterClass} />
            </Suspense>
            <CsvExportButton
              filename={`leads-${reports.customerName.toLowerCase().replace(/\s+/g, '-')}-${period}.csv`}
              rows={leadsCsvRows}
            />
          </div>
        </div>

        {reports.leadsList.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 py-14 text-center">
            <div className="flex size-11 items-center justify-center rounded-full bg-muted">
              <Users className="size-5 text-muted-foreground" />
            </div>
            <p className="text-sm font-medium text-foreground">Sin leads todavía</p>
            <p className="text-xs text-muted-foreground">
              Los contactos capturados por el chatbot aparecerán aquí.
            </p>
          </div>
        ) : displayLeads.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 py-10 text-center">
            <Filter className="size-8 text-muted-foreground/40" />
            <p className="text-sm text-muted-foreground">Sin leads con clasificación &quot;{filterClass}&quot;</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Score · Clase</TableHead>
                <TableHead>Contacto</TableHead>
                <TableHead>Empresa</TableHead>
                <TableHead className="max-w-xs">Resumen · Siguiente acción</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Conversación</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {displayLeads.map((lead) => (
                <TableRow key={lead.id}>
                  <TableCell className="w-[120px]">
                    <ScoreBadge score={lead.score} classification={lead.classification} />
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      {lead.name && (
                        <span className="flex items-center gap-1.5 text-sm font-medium text-foreground">
                          <User className="size-3 shrink-0 text-muted-foreground" />
                          {lead.name}
                        </span>
                      )}
                      {lead.email && (
                        <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <Mail className="size-3 shrink-0" />
                          {lead.email}
                        </span>
                      )}
                      {lead.phone && (
                        <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <Phone className="size-3 shrink-0" />
                          {lead.phone}
                        </span>
                      )}
                      {!lead.name && !lead.email && !lead.phone && (
                        <span className="text-xs text-muted-foreground/50">—</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {lead.company ? (
                      <span className="flex items-center gap-1.5 text-sm text-foreground">
                        <Building2 className="size-3 shrink-0 text-muted-foreground" />
                        {lead.company}
                      </span>
                    ) : (
                      <span className="text-xs text-muted-foreground/50">—</span>
                    )}
                  </TableCell>
                  <TableCell className="max-w-xs">
                    {lead.summary ? (
                      <p className="line-clamp-2 text-sm text-muted-foreground">{lead.summary}</p>
                    ) : (
                      <span className="text-xs text-muted-foreground/50">—</span>
                    )}
                    {lead.next_action && (
                      <p className="mt-1 flex items-start gap-1 text-xs text-nexus-purple line-clamp-1">
                        <Lightbulb className="size-3 mt-0.5 shrink-0" />
                        {lead.next_action}
                      </p>
                    )}
                  </TableCell>
                  <TableCell className="whitespace-nowrap text-xs text-muted-foreground">
                    {fmtDateShort(lead.created_at)}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <TranscriptDialog
                        transcript={lead.transcript}
                        leadName={lead.name}
                      />
                      {lead.scoring_breakdown && lead.scoring_breakdown.length > 0 && lead.score != null && (
                        <ScoringBreakdownDialog
                          breakdown={lead.scoring_breakdown}
                          score={lead.score}
                          classification={lead.classification}
                          leadName={lead.name}
                        />
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      {/* REP-13 placeholder */}
      <p className="text-xs text-muted-foreground/60 text-center">
        Exportación en PDF (REP-13) · próximamente
      </p>
    </>
  )
}

export default async function CustomerReportsPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ period?: string; sort?: string; filter?: string }>
}) {
  const user = await getSessionUser()
  if (!user || user.role !== 'owner') redirect('/login')

  const [{ id }, { period: rawPeriod, sort: rawSort, filter: rawFilter }] = await Promise.all([params, searchParams])
  const customerId = Number(id)
  const period: Period = isPeriod(rawPeriod) ? rawPeriod : 'month'
  const sortLeads: 'date' | 'score' = rawSort === 'score' ? 'score' : 'date'
  const validClasses = ['Alta', 'Media', 'Baja']
  const filterClass = rawFilter && validClasses.includes(rawFilter) ? rawFilter : null

  let reports: CustomerReports | null = null
  let loadError: string | null = null

  try {
    reports = await getCustomerReports(customerId, period)
  } catch (err) {
    loadError = err instanceof Error ? err.message : 'No se pudo cargar el reporte'
  }

  const periodLabels: Record<Period, string> = {
    '7d': 'últimos 7 días',
    '30d': 'últimos 30 días',
    month: 'este mes',
    '3m': 'últimos 3 meses',
    all: 'todo el historial',
  }

  const periodLabel = periodLabels[period]
  const exportSlug = reports
    ? reports.customerName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
    : `cliente-${customerId}`

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-center gap-3">
          <Button asChild variant="ghost" size="icon" className="shrink-0">
            <Link href="/dashboard/customers">
              <ArrowLeft className="size-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-xl font-semibold text-foreground">
              {reports ? reports.customerName : `Cliente #${customerId}`}
            </h1>
            <p className="text-sm text-muted-foreground">
              {reports?.customerEmail} · {periodLabels[period]}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2 pl-12 sm:pl-0">
          {reports && (
            <>
              <ExcelExportButton
                reports={reports}
                periodLabel={periodLabel}
                filename={`reporte-${exportSlug}-${period}.xlsx`}
              />
              <PdfExportButton
                reports={reports}
                periodLabel={periodLabel}
                filename={`reporte-${exportSlug}-${period}.pdf`}
              />
            </>
          )}
          <Button asChild variant="outline" size="sm">
            <Link href={`/dashboard/bots/${customerId}`}>
              <Bot className="size-4" />
              Configurar bot
            </Link>
          </Button>
          <Suspense>
            <PeriodSelector current={period} />
          </Suspense>
        </div>
      </div>

      {/* Último acceso */}
      {reports?.lastActivity && (
        <div className="flex items-center gap-2 rounded-lg border bg-muted/20 px-4 py-2.5 text-sm text-muted-foreground w-fit">
          <Clock className="size-4 shrink-0" />
          Último acceso: {fmtDate(reports.lastActivity)}
        </div>
      )}

      {loadError && (
        <div className="flex items-start gap-2.5 rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          <AlertCircle className="mt-0.5 size-4 shrink-0" />
          {loadError}
        </div>
      )}

      {reports && <ReportsContent reports={reports} period={period} sortLeads={sortLeads} filterClass={filterClass} />}
    </div>
  )
}
