'use client'

import Link from 'next/link'
import { useState } from 'react'
import { ChevronDown, ChevronRight, Sparkles } from 'lucide-react'
import { type LeadListItem, type LeadStatus, type ScoringBreakdownItem } from '@/app/actions/customer'
import { LeadStatusSelect } from '@/components/panel/lead-status-select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

function classBadge(c: string | null) {
  if (c === 'Alta') return 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800'
  if (c === 'Media') return 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800'
  if (c === 'Baja') return 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950/40 dark:text-red-400 dark:border-red-800'
  return 'bg-muted text-muted-foreground border-transparent'
}

function pctColor(pct: number) {
  if (pct >= 80) return 'bg-emerald-500'
  if (pct >= 50) return 'bg-nexus-purple'
  if (pct >= 25) return 'bg-amber-500'
  return 'bg-red-400'
}

function RubricPanel({ breakdown, score }: { breakdown: ScoringBreakdownItem[]; score: number | null }) {
  const total = breakdown.reduce((s, c) => s + c.maxScore, 0)

  return (
    <div className="border-t bg-muted/20 px-6 py-4">
      <div className="flex items-center justify-between mb-3">
        <p className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
          <Sparkles className="size-3.5 text-nexus-purple" />
          Rúbrica de calificación
        </p>
        {score != null && (
          <span className="rounded-full border border-nexus-lavender/40 bg-nexus-lavender/10 px-2.5 py-0.5 text-xs font-semibold text-nexus-purple">
            {score}/{total} pts
          </span>
        )}
      </div>
      <ul className="space-y-2.5">
        {breakdown.map((c, i) => {
          const pct = c.maxScore > 0 ? Math.round((c.earned / c.maxScore) * 100) : 0
          return (
            <li key={i}>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className={`font-medium ${c.met ? 'text-foreground' : 'text-muted-foreground'}`}>
                  {c.criterion}
                </span>
                <span className={c.met ? 'text-emerald-600 dark:text-emerald-400 font-semibold' : 'text-muted-foreground'}>
                  {c.earned}/{c.maxScore}
                </span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${pctColor(pct)}`}
                  style={{ width: `${pct}%` }}
                />
              </div>
              {c.evidence && (
                <p className="mt-0.5 text-[11px] text-muted-foreground leading-tight">{c.evidence}</p>
              )}
            </li>
          )
        })}
      </ul>
    </div>
  )
}

function LeadRow({ lead }: { lead: LeadListItem }) {
  const [expanded, setExpanded] = useState(false)
  const hasRubric = lead.scoring_breakdown && lead.scoring_breakdown.length > 0

  return (
    <>
      <TableRow className={expanded ? 'bg-muted/20' : undefined}>
        <TableCell className="font-medium">
          <Link href={`/panel/leads/${lead.id}`} className="hover:text-nexus-purple">
            {lead.name || 'Sin nombre'}
          </Link>
        </TableCell>
        <TableCell className="text-muted-foreground">{lead.company || '—'}</TableCell>
        <TableCell className="text-muted-foreground">
          <div className="flex flex-col">
            <span className="text-xs">{lead.email || '—'}</span>
            {lead.phone && <span className="text-xs">{lead.phone}</span>}
          </div>
        </TableCell>
        <TableCell className="text-xs text-muted-foreground">
          {new Date(lead.created_at).toLocaleDateString('es-MX')}
        </TableCell>
        <TableCell>
          {lead.classification ? (
            <span className={`rounded-full border px-2 py-0.5 text-[11px] font-medium ${classBadge(lead.classification)}`}>
              {lead.classification}
              {lead.score != null ? ` · ${lead.score}` : ''}
            </span>
          ) : (
            <span className="text-xs text-muted-foreground/50">—</span>
          )}
        </TableCell>
        <TableCell>
          <LeadStatusSelect id={lead.id} status={lead.status as LeadStatus} />
        </TableCell>
        <TableCell>
          {hasRubric ? (
            <button
              type="button"
              onClick={() => setExpanded((v) => !v)}
              className="flex items-center gap-1 rounded-md px-2 py-1 text-xs text-nexus-purple hover:bg-nexus-purple/10 transition-colors"
              title={expanded ? 'Ocultar rúbrica' : 'Ver rúbrica'}
            >
              {expanded ? <ChevronDown className="size-3.5" /> : <ChevronRight className="size-3.5" />}
              Rúbrica
            </button>
          ) : (
            <span className="text-xs text-muted-foreground/40">—</span>
          )}
        </TableCell>
      </TableRow>

      {expanded && hasRubric && (
        <tr>
          <td colSpan={7} className="p-0">
            <RubricPanel breakdown={lead.scoring_breakdown!} score={lead.score} />
          </td>
        </tr>
      )}
    </>
  )
}

export function LeadsTable({ leads }: { leads: LeadListItem[] }) {
  if (leads.length === 0) {
    return (
      <p className="py-14 text-center text-sm text-muted-foreground">
        No hay leads que coincidan con los filtros.
      </p>
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow className="hover:bg-transparent">
          <TableHead>Nombre</TableHead>
          <TableHead>Empresa</TableHead>
          <TableHead>Contacto</TableHead>
          <TableHead>Fecha</TableHead>
          <TableHead>Clasif.</TableHead>
          <TableHead>Estado</TableHead>
          <TableHead className="w-24">Detalle</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {leads.map((l) => (
          <LeadRow key={l.id} lead={l} />
        ))}
      </TableBody>
    </Table>
  )
}
