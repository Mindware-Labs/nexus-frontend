'use client'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { ArrowUpDown, Star } from 'lucide-react'

const CLASS_OPTIONS = [
  { label: 'Todos', value: '' },
  { label: 'Alta', value: 'Alta' },
  { label: 'Media', value: 'Media' },
  { label: 'Baja', value: 'Baja' },
]

export function LeadFilters({
  currentSort,
  currentFilter,
}: {
  currentSort: 'date' | 'score'
  currentFilter: string | null
}) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  function setParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString())
    if (value) params.set(key, value)
    else params.delete(key)
    router.push(`${pathname}?${params.toString()}`)
  }

  const filterValue = currentFilter ?? ''

  return (
    <div className="flex items-center gap-2">
      {/* Sort toggle */}
      <button
        onClick={() => setParam('sort', currentSort === 'score' ? '' : 'score')}
        className={[
          'inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors',
          currentSort === 'score'
            ? 'border-nexus-purple/40 bg-nexus-purple/10 text-nexus-purple'
            : 'border-input bg-background text-muted-foreground hover:text-foreground',
        ].join(' ')}
        title={currentSort === 'score' ? 'Ordenar por fecha' : 'Ordenar por score'}
      >
        <ArrowUpDown className="size-3" />
        {currentSort === 'score' ? 'Por score' : 'Por fecha'}
      </button>

      {/* Class filter */}
      <div className="flex items-center gap-1 rounded-xl border bg-muted/40 p-1">
        {CLASS_OPTIONS.map((o) => {
          const active = filterValue === o.value
          const icon = o.value === 'Alta' ? <Star className="size-2.5 fill-current" /> : null
          return (
            <button
              key={o.value}
              onClick={() => setParam('filter', o.value)}
              className={[
                'inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-medium transition-colors',
                active
                  ? 'bg-nexus-purple text-white shadow-sm'
                  : 'text-muted-foreground hover:text-foreground',
              ].join(' ')}
            >
              {icon}
              {o.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
