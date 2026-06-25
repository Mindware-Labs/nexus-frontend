import { ArrowUpRight, ArrowDownRight } from 'lucide-react'

const SANS = "var(--font-hanken, 'Hanken Grotesk', system-ui, sans-serif)"
const MONO = "var(--font-geist-mono, ui-monospace, monospace)"

export type KpiProps = {
  icon: React.ReactNode
  value: string
  label: string
  sub: string
  delta?: number
  deltaLabel?: string
  sparkData: number[]
}

export function KpiCard({ icon, value, label, sub, delta, deltaLabel }: KpiProps) {
  const positive = delta !== undefined && delta >= 0

  return (
    <div className="nx-card p-5 flex flex-col gap-4" style={{ fontFamily: SANS }}>
      {/* Top row */}
      <div className="flex items-start justify-between gap-2">
        <div
          className="flex size-10 shrink-0 items-center justify-center rounded-xl"
          style={{ background: 'var(--nx-accent-soft)', color: 'var(--nx-accent)' }}
        >
          {icon}
        </div>
        {delta !== undefined && (
          <span
            className="flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold"
            style={{
              background: positive ? 'var(--nx-positive-soft)' : 'var(--nx-high-soft)',
              color: positive ? 'var(--nx-positive)' : 'var(--nx-high)',
              fontFamily: MONO,
            }}
          >
            {positive ? <ArrowUpRight className="size-3" /> : <ArrowDownRight className="size-3" />}
            {positive ? '+' : ''}{delta}{deltaLabel ?? '%'}
          </span>
        )}
      </div>

      {/* Value */}
      <div>
        <p
          className="text-[32px] font-bold leading-none tracking-[-1px]"
          style={{ color: 'var(--nx-text)' }}
        >
          {value}
        </p>
        <p className="mt-1.5 text-[13px] font-semibold" style={{ color: 'var(--nx-text)' }}>{label}</p>
        <p className="mt-0.5 text-[12px]" style={{ color: 'var(--nx-text-3)', fontFamily: MONO }}>{sub}</p>
      </div>

    </div>
  )
}
