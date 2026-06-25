'use client'

import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import type { RecentLead } from '@/app/actions/customer'

const SANS = "var(--font-hanken, 'Hanken Grotesk', system-ui, sans-serif)"
const MONO = "var(--font-geist-mono, ui-monospace, monospace)"

const PRIORITY: Record<string, { bg: string; color: string; dot: string }> = {
  Alta:  { bg: '#D1FAF0', color: '#059669',  dot: '#34D399' },
  Media: { bg: '#F8EDFB', color: '#522566',  dot: '#AD74C3' },
  Baja:  { bg: '#F3F4F6', color: '#6B7280',  dot: '#9CA3AF' },
}

const PRIORITY_DARK: Record<string, { bg: string; color: string; dot: string }> = {
  Alta:  { bg: '#0d2a1e', color: '#34D399', dot: '#34D399' },
  Media: { bg: '#2a1f32', color: '#b07fd4', dot: '#b07fd4' },
  Baja:  { bg: '#1e1e22', color: '#6b6b78', dot: '#6b6b78' },
}

function initials(s: string | null) {
  if (!s) return '?'
  return s.trim().split(/\s+/).slice(0, 2).map(w => w[0]?.toUpperCase() ?? '').join('')
}

function LeadRow({ l }: { l: RecentLead }) {
  const name = l.name || l.email || 'Contacto'
  const ini  = initials(name)
  const prio = l.classification ?? 'Baja'
  const ps   = PRIORITY[prio] ?? PRIORITY.Baja
  const date = new Date(l.created_at).toLocaleDateString('es-MX', {
    day: '2-digit', month: 'short', year: 'numeric',
  })

  return (
    <div
      className="grid items-center gap-3 px-6 py-4 border-b last:border-0 cursor-default"
      style={{
        gridTemplateColumns: '1fr minmax(0,2fr) 90px 100px',
        borderColor: 'var(--nx-border-2)',
        transition: 'background-color 0.15s ease',
      }}
      onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.background = 'var(--nx-surface-2)' }}
      onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.background = 'transparent' }}
    >
      {/* Lead */}
      <div className="flex items-center gap-3 min-w-0">
        <div
          className="flex size-9 shrink-0 items-center justify-center rounded-full text-[12px] font-bold"
          style={{ background: 'var(--nx-accent-soft)', color: 'var(--nx-accent)' }}
        >
          {ini}
        </div>
        <div className="min-w-0">
          <p className="truncate text-[13px] font-semibold" style={{ color: 'var(--nx-text)' }}>{name}</p>
          <p className="text-[11px]" style={{ color: 'var(--nx-text-3)', fontFamily: MONO }}>Lead nuevo</p>
        </div>
      </div>

      {/* Summary */}
      <p
        className="text-[12px] leading-relaxed"
        style={{
          color: 'var(--nx-text-2)',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}
      >
        {l.summary || '—'}
      </p>

      {/* Priority */}
      <div>
        <span
          className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold"
          style={{ background: ps.bg, color: ps.color, fontFamily: MONO }}
        >
          <span className="size-1.5 rounded-full shrink-0" style={{ background: ps.dot }} />
          {prio}
        </span>
      </div>

      {/* Date */}
      <p className="text-[11px] tabular-nums" style={{ color: 'var(--nx-text-3)', fontFamily: MONO }}>
        {date}
      </p>
    </div>
  )
}

export function LeadsTableHome({ leads }: { leads: RecentLead[] }) {
  return (
    <div className="nx-card" style={{ fontFamily: SANS }}>
      {/* Header */}
      <div
        className="flex items-center justify-between px-6 py-4 border-b"
        style={{ borderColor: 'var(--nx-border)' }}
      >
        <p className="text-[15px] font-bold" style={{ color: 'var(--nx-text)' }}>Leads recientes</p>
        <Link
          href="/panel/leads"
          className="flex items-center gap-1 text-[13px] font-semibold transition-opacity hover:opacity-70"
          style={{ color: 'var(--nx-accent)' }}
        >
          Ver todos <ArrowUpRight className="size-3.5" />
        </Link>
      </div>

      {/* Column headers */}
      <div
        className="grid items-center gap-3 px-6 py-3 border-b"
        style={{
          gridTemplateColumns: '1fr minmax(0,2fr) 90px 100px',
          borderColor: 'var(--nx-border-2)',
          background: 'var(--nx-surface-2)',
        }}
      >
        {['LEAD', 'RESUMEN', 'PRIORIDAD', 'FECHA'].map(h => (
          <span key={h} className="text-[10px] font-bold tracking-[0.8px]"
            style={{ color: 'var(--nx-text-3)', fontFamily: MONO }}>
            {h}
          </span>
        ))}
      </div>

      {leads.length === 0 ? (
        <p className="px-6 py-12 text-center text-[13px]" style={{ color: 'var(--nx-text-3)' }}>
          Aún no hay leads capturados.
        </p>
      ) : (
        leads.map((l, i) => <LeadRow key={i} l={l} />)
      )}
    </div>
  )
}
