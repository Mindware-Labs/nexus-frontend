import { redirect } from 'next/navigation'
import {
  AlertCircle,
  Building2,
  CalendarClock,
  CreditCard,
  Flame,
  Sparkles,
  TrendingUp,
} from 'lucide-react'
import { getSessionUser } from '@/lib/session'
import { getBotConfig, getPlan, type CustomerBotConfig, type PlanInfo } from '@/app/actions/customer'
import { CompanyForm } from '@/components/panel/company-form'
import { cn } from '@/lib/utils'

export const metadata = { title: 'Mi Empresa — Mindware Nexus' }

const FONT = "'Hanken Grotesk', system-ui, sans-serif"

function fmt(n: number) {
  return new Intl.NumberFormat('es-MX').format(n)
}

/* ── Plan card ───────────────────────────────────────────────────────── */
function PlanCard({ plan }: { plan: PlanInfo }) {
  const renewal = new Date(plan.renewalDate).toLocaleDateString('es-MX', {
    day: 'numeric', month: 'long', year: 'numeric',
  })
  const danger  = !plan.unlimited && plan.percentage >= 80
  const warning = !plan.unlimited && plan.percentage >= 60 && plan.percentage < 80
  const barColor = plan.unlimited
    ? '#34D399'
    : danger   ? '#FB7185'
    : warning  ? '#FBBF24'
    : '#AD74C3'

  return (
    <div className="rounded-2xl border border-[#EADCF3] bg-white shadow-[0_2px_12px_rgba(61,26,78,0.06)]">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-[#F3EAF8] px-6 py-4">
        <div className="flex size-8 items-center justify-center rounded-xl bg-[#F0E6F8]">
          <CreditCard className="size-4 text-[#522566]" />
        </div>
        <div>
          <h2 className="text-[14px] font-bold text-[#111827]">Mi plan</h2>
          <p className="text-[12px] text-[#8A7397]">Consumo y renovación del ciclo actual</p>
        </div>
      </div>

      <div className="p-6 space-y-5">
        {/* Plan badge */}
        <div className="flex items-center justify-between">
          <span className="text-[13px] text-[#6B7280]">Plan activo</span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-[#522566] to-[#AD74C3] px-3 py-1 text-[12px] font-bold text-white shadow-sm">
            <Sparkles className="size-3" />
            {plan.planLabel}
          </span>
        </div>

        {/* Usage */}
        <div>
          <div className="mb-2 flex items-center justify-between">
            <span className="text-[13px] text-[#6B7280]">Consumo del ciclo</span>
            <span className="text-[13px] font-semibold text-[#111827]">
              {plan.unlimited
                ? `${fmt(plan.used)} conversaciones`
                : `${fmt(plan.used)} / ${fmt(plan.monthlyLimit ?? 0)}`}
            </span>
          </div>
          <div className="h-2.5 w-full overflow-hidden rounded-full bg-[#F0E6F8]">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: plan.unlimited ? '100%' : `${Math.min(100, plan.percentage)}%`,
                background: barColor,
              }}
            />
          </div>
          <div className="mt-2 flex items-center justify-between">
            <span className="text-[11px] text-[#A18AAF]">
              {plan.unlimited ? 'Plan ilimitado' : `${plan.percentage}% usado`}
            </span>
            {!plan.unlimited && (
              <span className="text-[11px] text-[#A18AAF]">
                {fmt((plan.monthlyLimit ?? 0) - plan.used)} restantes
              </span>
            )}
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-[#EADCF3] bg-[#FDFAFF] p-3">
            <div className="flex items-center gap-1.5 text-[11px] font-medium text-[#8A7397]">
              <TrendingUp className="size-3.5 text-[#34D399]" />
              Conversaciones
            </div>
            <p className="mt-1 text-[18px] font-bold text-[#111827]">{fmt(plan.used)}</p>
          </div>
          <div className="rounded-xl border border-[#EADCF3] bg-[#FDFAFF] p-3">
            <div className="flex items-center gap-1.5 text-[11px] font-medium text-[#8A7397]">
              <CalendarClock className="size-3.5 text-[#AD74C3]" />
              Renovación
            </div>
            <p className="mt-1 text-[13px] font-bold text-[#111827]">{renewal}</p>
          </div>
        </div>

        {/* Alert */}
        {danger && (
          <div className="flex items-start gap-2.5 rounded-xl border border-[#FB7185]/30 bg-[#FFF1F2] px-4 py-3">
            <Flame className="mt-0.5 size-4 shrink-0 text-[#FB7185]" />
            <p className="text-[12px] text-[#BE123C]">
              Estás cerca del límite. Considera actualizar tu plan para evitar interrupciones.
            </p>
          </div>
        )}
        {warning && !danger && (
          <div className="flex items-start gap-2.5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
            <Flame className="mt-0.5 size-4 shrink-0 text-amber-500" />
            <p className="text-[12px] text-amber-700">
              Has usado más del 60% de tu plan este ciclo.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

/* ── Page ──────────────────────────────────────────────────────────── */
export default async function CompanyPage() {
  const user = await getSessionUser()
  if (!user || user.role !== 'customer') redirect('/login')

  let config: CustomerBotConfig | null = null
  let plan: PlanInfo | null = null
  let loadError: string | null = null

  const [cRes, pRes] = await Promise.allSettled([getBotConfig(), getPlan()])
  for (const r of [cRes, pRes]) {
    if (r.status === 'rejected') {
      const e = r.reason as Error & { digest?: string }
      if (e?.message === 'NEXT_REDIRECT' || e?.digest?.startsWith('NEXT_REDIRECT')) throw e
    }
  }
  if (cRes.status === 'fulfilled') config = cRes.value
  else loadError = cRes.reason instanceof Error ? cRes.reason.message : 'No se pudo cargar la empresa'
  if (pRes.status === 'fulfilled') plan = pRes.value

  return (
    <div className="flex flex-1 flex-col gap-6 p-6" style={{ fontFamily: FONT }}>

      {/* ── Page header ── */}
      <div className="flex items-center gap-3">
        <div className="flex size-10 items-center justify-center rounded-xl bg-[#F0E6F8]">
          <Building2 className="size-5 text-[#522566]" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-[#111827]">Mi Empresa</h1>
          <p className="text-[13px] text-[#8A7397]">Datos de la empresa e información del plan</p>
        </div>
      </div>

      {loadError && (
        <div className="flex items-start gap-2.5 rounded-2xl border border-[#FB7185]/30 bg-[#FFF1F2] px-4 py-3 text-[13px] text-[#BE123C]">
          <AlertCircle className="mt-0.5 size-4 shrink-0" />
          {loadError}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Company form card */}
        {config && (
          <div className="rounded-2xl border border-[#EADCF3] bg-white shadow-[0_2px_12px_rgba(61,26,78,0.06)]">
            <div className="flex items-center gap-3 border-b border-[#F3EAF8] px-6 py-4">
              <div className="flex size-8 items-center justify-center rounded-xl bg-[#F0E6F8]">
                <Building2 className="size-4 text-[#522566]" />
              </div>
              <div>
                <h2 className="text-[14px] font-bold text-[#111827]">Datos de la empresa</h2>
                <p className="text-[12px] text-[#8A7397]">Información visible en tu chatbot</p>
              </div>
            </div>
            <div className="p-6">
              <CompanyForm config={config} />
            </div>
          </div>
        )}

        {plan && <PlanCard plan={plan} />}
      </div>
    </div>
  )
}
