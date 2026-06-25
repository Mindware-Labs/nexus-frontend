import { redirect } from 'next/navigation'
import {
  AlertCircle,
  ArrowUpRight,
  CalendarClock,
  CheckCircle2,
  CreditCard,
  Mail,
  MessageSquare,
  Sparkles,
  Users,
  Zap,
} from 'lucide-react'
import { getSessionUser } from '@/lib/session'
import { getCustomerPlan, type CustomerPlanUsage } from '@/app/actions/customer-plan'
import { cn } from '@/lib/utils'

export const metadata = { title: 'Mi Plan — Mindware Nexus' }

const FONT = "'Hanken Grotesk', system-ui, sans-serif"

const MONTHS = [
  '', 'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
]

function fmt(n: number): string {
  return n.toLocaleString('es-MX')
}

/* ── Radial ring progress ─────────────────────────────────────────── */
function RadialProgress({
  percent,
  size = 96,
  stroke = 8,
  color,
}: {
  percent: number
  size?: number
  stroke?: number
  color: string
}) {
  const r = (size - stroke) / 2
  const circ = 2 * Math.PI * r
  const offset = circ - (Math.min(percent, 100) / 100) * circ

  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#F0E6F8" strokeWidth={stroke} />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke={color}
        strokeWidth={stroke}
        strokeDasharray={circ}
        strokeDashoffset={offset}
        strokeLinecap="round"
        style={{ transition: 'stroke-dashoffset 0.6s ease' }}
      />
    </svg>
  )
}

/* ── Metric colors ────────────────────────────────────────────────── */
function metricColor(pct: number, unlimited: boolean) {
  if (unlimited) return '#34D399'
  if (pct >= 100) return '#FB7185'
  if (pct >= 80)  return '#FBBF24'
  return '#AD74C3'
}

/* ── Usage metric card ───────────────────────────────────────────── */
function UsageCard({
  label,
  icon: Icon,
  used,
  max,
  percent,
  unit = '',
  iconBg,
  iconColor,
}: {
  label: string
  icon: React.ElementType
  used: number
  max: number | null
  percent: number
  unit?: string
  iconBg: string
  iconColor: string
}) {
  const unlimited = max === null
  const color = metricColor(percent, unlimited)
  const remaining = max !== null ? Math.max(0, max - used) : null

  return (
    <div className="rounded-2xl border border-[#EADCF3] bg-white p-6 shadow-[0_2px_12px_rgba(61,26,78,0.06)] flex flex-col gap-4">
      {/* Top row */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl" style={{ background: iconBg }}>
            <Icon className="size-5" style={{ color: iconColor }} />
          </div>
          <div>
            <p className="text-[13px] font-semibold text-[#374151]">{label}</p>
            <p className="text-[11px] text-[#A18AAF]">
              {unlimited ? 'Sin límite' : `de ${fmt(max!)}${unit ? ' ' + unit : ''}`}
            </p>
          </div>
        </div>
        {unlimited ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-[#ECFDF5] px-2.5 py-1 text-[11px] font-semibold text-[#059669]">
            <CheckCircle2 className="size-3" /> Ilimitado
          </span>
        ) : (
          <span
            className="text-[13px] font-bold tabular-nums"
            style={{ color }}
          >
            {percent}%
          </span>
        )}
      </div>

      {/* Radial + number */}
      <div className="flex items-center gap-5">
        <div className="relative shrink-0">
          <RadialProgress percent={unlimited ? 100 : percent} color={color} />
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-[15px] font-bold leading-none text-[#111827]">
              {unlimited ? '∞' : `${Math.min(percent, 100)}%`}
            </span>
          </div>
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-3xl font-bold tracking-tight text-[#111827]">
            {fmt(used)}
            {unit && <span className="ml-1 text-[14px] font-normal text-[#9CA3AF]">{unit}</span>}
          </p>
          {!unlimited && remaining !== null && (
            <p className="mt-1 text-[12px] text-[#8A7397]">
              <span className="font-semibold text-[#111827]">{fmt(remaining)}</span> restantes
            </p>
          )}
        </div>
      </div>

      {/* Progress bar */}
      {!unlimited && (
        <div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-[#F0E6F8]">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min(percent, 100)}%`, background: color }}
            />
          </div>
        </div>
      )}

      {/* Alert */}
      {!unlimited && percent >= 100 && (
        <div className="flex items-center gap-2 rounded-xl border border-[#FB7185]/30 bg-[#FFF1F2] px-3 py-2 text-[12px] text-[#BE123C]">
          <AlertCircle className="size-3.5 shrink-0" />
          Límite alcanzado. Contacta soporte para ampliar.
        </div>
      )}
      {!unlimited && percent >= 80 && percent < 100 && (
        <div className="flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-[12px] text-amber-700">
          <AlertCircle className="size-3.5 shrink-0" />
          Estás por alcanzar el límite.
        </div>
      )}
    </div>
  )
}

/* ── Page ──────────────────────────────────────────────────────────── */
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

  /* Overall health score — simple average of non-unlimited metrics */
  const healthPcts = data
    ? [
        data.maxConversations !== null ? data.conversationsPercent : null,
        data.maxTokens        !== null ? data.tokensPercent        : null,
        data.maxLeads         !== null ? data.leadsPercent         : null,
      ].filter((v): v is number => v !== null)
    : []
  const healthAvg = healthPcts.length
    ? Math.round(healthPcts.reduce((a, b) => a + b, 0) / healthPcts.length)
    : 0
  const healthColor = metricColor(healthAvg, healthPcts.length === 0)

  return (
    <div className="flex flex-1 flex-col gap-6 p-6" style={{ fontFamily: FONT }}>

      {/* ── Page header ── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-[#F0E6F8]">
            <CreditCard className="size-5 text-[#522566]" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-[#111827]">Mi Plan</h1>
            {monthLabel && (
              <p className="text-[13px] text-[#8A7397]">
                Ciclo actual: <span className="font-semibold text-[#522566]">{monthLabel}</span>
              </p>
            )}
          </div>
        </div>
        <a
          href="mailto:labsmindware@gmail.com"
          className="inline-flex items-center gap-2 self-start rounded-xl border border-[#EADCF3] bg-white px-4 py-2.5 text-[13px] font-semibold text-[#522566] shadow-sm hover:bg-[#F8EDFB] transition-colors sm:self-auto"
        >
          <Mail className="size-4" />
          Ampliar plan
          <ArrowUpRight className="size-3.5" />
        </a>
      </div>

      {loadError && (
        <div className="flex items-start gap-2.5 rounded-2xl border border-[#FB7185]/30 bg-[#FFF1F2] px-4 py-3 text-[13px] text-[#BE123C]">
          <AlertCircle className="mt-0.5 size-4 shrink-0" />
          {loadError}
        </div>
      )}

      {data && (
        <>
          {/* ── Hero plan banner ── */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#3D1A4E] via-[#522566] to-[#7B3FA0] p-6 shadow-[0_8px_32px_rgba(61,26,78,0.22)]">
            <div className="pointer-events-none absolute -top-10 -right-10 h-40 w-40 rounded-full bg-[#AD74C3]/20 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-6 left-1/4 h-28 w-28 rounded-full bg-[#34D399]/15 blur-2xl" />

            <div className="relative z-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-sm border border-white/20 shadow-xl">
                  <Sparkles className="size-7 text-white" />
                </div>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-widest text-white/50">
                    Plan activo
                  </p>
                  <p className="text-2xl font-bold text-white">{data.planName}</p>
                  {data.planId && (
                    <p className="text-[12px] text-white/40">ID #{data.planId}</p>
                  )}
                </div>
              </div>

              {/* Health gauge */}
              <div className="flex items-center gap-4 rounded-2xl border border-white/15 bg-white/10 px-5 py-4 backdrop-blur-sm">
                <div className="relative shrink-0">
                  <RadialProgress
                    percent={healthPcts.length === 0 ? 100 : healthAvg}
                    size={64}
                    stroke={6}
                    color={healthPcts.length === 0 ? '#34D399' : healthColor}
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-[13px] font-bold text-white">
                      {healthPcts.length === 0 ? '∞' : `${healthAvg}%`}
                    </span>
                  </div>
                </div>
                <div>
                  <p className="text-[11px] text-white/50 uppercase tracking-wide">Consumo total</p>
                  <p className="text-[14px] font-bold text-white">
                    {healthPcts.length === 0
                      ? 'Ilimitado'
                      : healthAvg < 60 ? 'Saludable'
                      : healthAvg < 80 ? 'Moderado'
                      : 'Alto'}
                  </p>
                  <div className="mt-1 flex items-center gap-1.5">
                    <CalendarClock className="size-3 text-white/40" />
                    <span className="text-[11px] text-white/40">Reinicia el 1 del mes</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── Usage cards ── */}
          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            <UsageCard
              label="Conversaciones"
              icon={MessageSquare}
              used={data.conversationsCount}
              max={data.maxConversations}
              percent={data.conversationsPercent}
              iconBg="#F0E6F8"
              iconColor="#522566"
            />
            <UsageCard
              label="Tokens"
              icon={Zap}
              used={data.tokensCount}
              max={data.maxTokens}
              percent={data.tokensPercent}
              unit="tokens"
              iconBg="#FFF7ED"
              iconColor="#D97706"
            />
            <UsageCard
              label="Leads capturados"
              icon={Users}
              used={data.leadsCount}
              max={data.maxLeads}
              percent={data.leadsPercent}
              iconBg="#ECFDF5"
              iconColor="#059669"
            />
          </div>

          {/* ── Footer note ── */}
          <div className="rounded-2xl border border-[#EADCF3] bg-[#FDFAFF] px-6 py-4">
            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-[13px] text-[#7C6589]">
                Los contadores se reinician automáticamente el 1 de cada mes.
              </p>
              <a
                href="mailto:labsmindware@gmail.com"
                className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#522566] hover:underline underline-offset-2"
              >
                <Mail className="size-3.5" />
                labsmindware@gmail.com
              </a>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
