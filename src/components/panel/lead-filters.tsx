'use client'

import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { Search } from 'lucide-react'

const STATUS_OPTIONS = [
  { value: '', label: 'Todos los estados' },
  { value: 'nuevo', label: 'Nuevo' },
  { value: 'en_proceso', label: 'En proceso' },
  { value: 'cerrado_ganado', label: 'Ganado' },
  { value: 'cerrado_perdido', label: 'Perdido' },
]

export function LeadFilters() {
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
          placeholder="Buscar por nombre, email, empresa…"
          className="w-full rounded-lg border bg-background py-2 pl-9 pr-3 text-sm outline-none focus:border-nexus-purple"
        />
      </div>

      <select
        value={params.get('status') ?? ''}
        onChange={(e) => update({ status: e.target.value })}
        className="rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:border-nexus-purple"
      >
        {STATUS_OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>

      <div className="flex items-center gap-2">
        <input
          type="date"
          value={params.get('from') ?? ''}
          onChange={(e) => update({ from: e.target.value })}
          className="rounded-lg border bg-background px-2 py-2 text-sm outline-none focus:border-nexus-purple"
        />
        <span className="text-xs text-muted-foreground">a</span>
        <input
          type="date"
          value={params.get('to') ?? ''}
          onChange={(e) => update({ to: e.target.value })}
          className="rounded-lg border bg-background px-2 py-2 text-sm outline-none focus:border-nexus-purple"
        />
      </div>
    </div>
  )
}
