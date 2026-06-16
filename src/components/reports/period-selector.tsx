'use client'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import type { Period } from '@/app/actions/reports'

const OPTIONS: { label: string; value: Period }[] = [
  { label: '7 días', value: '7d' },
  { label: '30 días', value: '30d' },
  { label: 'Este mes', value: 'month' },
  { label: '3 meses', value: '3m' },
  { label: 'Todo', value: 'all' },
]

export function PeriodSelector({ current }: { current: Period }) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  function select(period: Period) {
    const params = new URLSearchParams(searchParams.toString())
    params.set('period', period)
    router.push(`${pathname}?${params.toString()}`)
  }

  return (
    <div className="flex items-center gap-1 rounded-xl border bg-muted/40 p-1">
      {OPTIONS.map((o) => (
        <button
          key={o.value}
          onClick={() => select(o.value)}
          className={[
            'rounded-lg px-3 py-1.5 text-xs font-medium transition-colors',
            current === o.value
              ? 'bg-nexus-purple text-white shadow-sm'
              : 'text-muted-foreground hover:text-foreground',
          ].join(' ')}
        >
          {o.label}
        </button>
      ))}
    </div>
  )
}
