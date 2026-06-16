'use client'

import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { Search } from 'lucide-react'

export function ConversationFilters() {
  const router = useRouter()
  const pathname = usePathname()
  const params = useSearchParams()
  const [search, setSearch] = useState(params.get('search') ?? '')

  function update(next: Record<string, string>) {
    const p = new URLSearchParams(params.toString())
    for (const [k, v] of Object.entries(next)) {
      if (v) p.set(k, v)
      else p.delete(k)
    }
    router.push(`${pathname}?${p.toString()}`)
  }

  const filter = params.get('filter') ?? 'all'

  const chips = [
    { value: 'all', label: 'Todas' },
    { value: 'lead', label: 'Generaron lead' },
    { value: 'nolead', label: 'Sin lead' },
    { value: 'relevant', label: 'Relevantes' },
  ]

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') update({ search })
          }}
          placeholder="Buscar dentro de las conversaciones…"
          className="w-full rounded-lg border bg-background py-2 pl-9 pr-3 text-sm outline-none focus:border-nexus-purple"
        />
      </div>

      <div className="flex items-center gap-1 rounded-xl border bg-muted/40 p-1">
        {chips.map((c) => (
          <button
            key={c.value}
            onClick={() => update({ filter: c.value === 'all' ? '' : c.value })}
            className={[
              'rounded-lg px-3 py-1.5 text-xs font-medium transition-colors',
              filter === c.value
                ? 'bg-nexus-purple text-white shadow-sm'
                : 'text-muted-foreground hover:text-foreground',
            ].join(' ')}
          >
            {c.label}
          </button>
        ))}
      </div>
    </div>
  )
}
