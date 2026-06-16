import { redirect } from 'next/navigation'
import { AlertCircle, Building2, CreditCard } from 'lucide-react'
import { getSessionUser } from '@/lib/session'
import { getBotConfig, getPlan, type CustomerBotConfig, type PlanInfo } from '@/app/actions/customer'
import { CompanyForm } from '@/components/panel/company-form'

export const metadata = { title: 'Mi Empresa — Mindware Nexus' }

function fmt(n: number) {
  return new Intl.NumberFormat('es-MX').format(n)
}

function PlanCard({ plan }: { plan: PlanInfo }) {
  const renewal = new Date(plan.renewalDate).toLocaleDateString('es-MX', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
  const danger = !plan.unlimited && plan.percentage >= 80
  return (
    <div className="rounded-xl border bg-card">
      <div className="border-b px-5 py-4">
        <h2 className="flex items-center gap-2 text-sm font-semibold">
          <CreditCard className="size-4 text-nexus-purple" /> Mi plan
        </h2>
      </div>
      <div className="space-y-4 p-5">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Plan actual</span>
          <span className="rounded-full bg-nexus-purple/10 px-3 py-1 text-sm font-semibold text-nexus-purple">
            {plan.planLabel}
          </span>
        </div>

        <div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Consumo del ciclo</span>
            <span className="font-medium">
              {plan.unlimited ? `${fmt(plan.used)} (ilimitado)` : `${fmt(plan.used)} / ${fmt(plan.monthlyLimit ?? 0)}`}
            </span>
          </div>
          {!plan.unlimited && (
            <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-muted">
              <div
                className={`h-full rounded-full ${danger ? 'bg-amber-500' : 'bg-nexus-purple'}`}
                style={{ width: `${plan.percentage}%` }}
              />
            </div>
          )}
          {!plan.unlimited && (
            <p className="mt-1.5 text-xs text-muted-foreground">{plan.percentage}% usado este ciclo</p>
          )}
        </div>

        <div className="flex items-center justify-between border-t pt-3 text-sm">
          <span className="text-muted-foreground">Renovación</span>
          <span className="font-medium">{renewal}</span>
        </div>

        {danger && (
          <p className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-700">
            Estás cerca del límite de tu plan. Considera actualizarlo para no interrumpir el servicio.
          </p>
        )}
      </div>
    </div>
  )
}

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
    <div className="flex flex-1 flex-col gap-6 p-6">
      <div>
        <h1 className="flex items-center gap-2 text-xl font-semibold text-foreground">
          <Building2 className="size-5 text-nexus-purple" />
          Mi Empresa
        </h1>
        <p className="mt-0.5 text-sm text-muted-foreground">Datos de la empresa e información del plan</p>
      </div>

      {loadError && (
        <div className="flex items-start gap-2.5 rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          <AlertCircle className="mt-0.5 size-4 shrink-0" />
          {loadError}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        {config && (
          <div className="rounded-xl border bg-card">
            <div className="border-b px-5 py-4">
              <h2 className="flex items-center gap-2 text-sm font-semibold">
                <Building2 className="size-4 text-nexus-purple" /> Datos de la empresa
              </h2>
            </div>
            <div className="p-5">
              <CompanyForm config={config} />
            </div>
          </div>
        )}

        {plan && <PlanCard plan={plan} />}
      </div>
    </div>
  )
}
