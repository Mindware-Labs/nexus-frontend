import type { DashboardData } from '@/app/actions/customer'

const SANS = "var(--font-hanken, 'Hanken Grotesk', system-ui, sans-serif)"
const MONO = "var(--font-geist-mono, ui-monospace, monospace)"

function fmt(n: number) { return n.toLocaleString('es-MX') }

export function PlanCardHome({ plan }: { plan: DashboardData['plan'] }) {
  const pct  = plan.percentage
  const hot  = pct >= 80
  const renewal = new Date(plan.renewalDate).toLocaleDateString('es-MX', {
    day: 'numeric', month: 'short',
  })

  return (
    <div className="nx-card p-4 flex flex-col gap-3" style={{ fontFamily: SANS }}>
      <div className="flex items-center justify-between gap-2">
        <p className="text-[13px] font-bold" style={{ color: 'var(--nx-text)' }}>Consumo del plan</p>
        <span
          className="rounded-full px-2 py-0.5 text-[10px] font-bold"
          style={{ background: 'var(--nx-accent-soft)', color: 'var(--nx-accent)', fontFamily: MONO }}
        >
          {plan.planLabel}
        </span>
      </div>

      <p className="text-[12px]" style={{ color: 'var(--nx-text-2)' }}>
        {plan.unlimited
          ? `${fmt(plan.used)} conversaciones`
          : `${fmt(plan.used)} / ${fmt(plan.monthlyLimit ?? 0)}`}
      </p>

      {!plan.unlimited && (
        <div className="flex flex-col gap-1.5">
          <div className="h-1.5 w-full rounded-full" style={{ background: 'var(--nx-border)' }}>
            <div
              className="h-full rounded-full"
              style={{
                width: `${Math.min(pct, 100)}%`,
                background: hot
                  ? 'linear-gradient(90deg, #FB7185, #e05070)'
                  : 'linear-gradient(90deg, #522566, #3D1A4E)',
                transition: 'width 0.8s cubic-bezier(.4,0,.2,1)',
              }}
            />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[11px]" style={{ color: hot ? 'var(--nx-high)' : 'var(--nx-text-3)', fontFamily: MONO }}>
              {pct}% usado
            </span>
            {hot && (
              <span className="text-[10px] font-semibold" style={{ color: 'var(--nx-high)', fontFamily: MONO }}>
                Casi al límite
              </span>
            )}
          </div>
        </div>
      )}

      <div className="border-t pt-2.5" style={{ borderColor: 'var(--nx-border-2)' }}>
        <span className="text-[11px]" style={{ color: 'var(--nx-text-3)', fontFamily: MONO }}>
          {plan.unlimited ? 'Plan ilimitado' : `Renueva el ${renewal}`}
        </span>
      </div>
    </div>
  )
}
