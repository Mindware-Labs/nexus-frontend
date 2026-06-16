import { Suspense } from 'react'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { AlertCircle, Users } from 'lucide-react'
import { getSessionUser } from '@/lib/session'
import { getLeads, type LeadListItem, type LeadStatus } from '@/app/actions/customer'
import { LeadFilters } from '@/components/panel/lead-filters'
import { LeadStatusSelect } from '@/components/panel/lead-status-select'
import { LeadsExportButton } from '@/components/panel/leads-export-button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

export const metadata = { title: 'Leads — Mindware Nexus' }

function classBadge(c: string | null) {
  if (c === 'Alta') return 'bg-emerald-50 text-emerald-700 border-emerald-200'
  if (c === 'Media') return 'bg-amber-50 text-amber-700 border-amber-200'
  if (c === 'Baja') return 'bg-red-50 text-red-700 border-red-200'
  return 'bg-muted text-muted-foreground border-transparent'
}

export default async function LeadsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; search?: string; from?: string; to?: string }>
}) {
  const user = await getSessionUser()
  if (!user || user.role !== 'customer') redirect('/login')

  const sp = await searchParams

  let leads: LeadListItem[] = []
  let loadError: string | null = null
  try {
    leads = await getLeads({ status: sp.status, search: sp.search, from: sp.from, to: sp.to })
  } catch (e) {
    if (e instanceof Error && (e.message === 'NEXT_REDIRECT' || 'digest' in e)) throw e
    loadError = e instanceof Error ? e.message : 'No se pudieron cargar los leads'
  }

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="flex items-center gap-2 text-xl font-semibold text-foreground">
            <Users className="size-5 text-nexus-purple" />
            Leads
          </h1>
          <p className="mt-0.5 text-sm text-muted-foreground">
            {leads.length} {leads.length === 1 ? 'lead' : 'leads'}
          </p>
        </div>
        <LeadsExportButton leads={leads} />
      </div>

      <Suspense>
        <LeadFilters />
      </Suspense>

      {loadError && (
        <div className="flex items-start gap-2.5 rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          <AlertCircle className="mt-0.5 size-4 shrink-0" />
          {loadError}
        </div>
      )}

      <div className="rounded-xl border bg-card">
        {leads.length === 0 ? (
          <p className="py-14 text-center text-sm text-muted-foreground">
            No hay leads que coincidan con los filtros.
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Nombre</TableHead>
                <TableHead>Empresa</TableHead>
                <TableHead>Contacto</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Clasif.</TableHead>
                <TableHead>Estado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leads.map((l) => (
                <TableRow key={l.id} className="cursor-pointer">
                  <TableCell className="font-medium">
                    <Link href={`/panel/leads/${l.id}`} className="hover:text-nexus-purple">
                      {l.name || 'Sin nombre'}
                    </Link>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{l.company || '—'}</TableCell>
                  <TableCell className="text-muted-foreground">
                    <div className="flex flex-col">
                      <span className="text-xs">{l.email || '—'}</span>
                      {l.phone && <span className="text-xs">{l.phone}</span>}
                    </div>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {new Date(l.created_at).toLocaleDateString('es-MX')}
                  </TableCell>
                  <TableCell>
                    {l.classification ? (
                      <span className={`rounded-full border px-2 py-0.5 text-[11px] font-medium ${classBadge(l.classification)}`}>
                        {l.classification}
                        {l.score != null ? ` · ${l.score}` : ''}
                      </span>
                    ) : (
                      <span className="text-xs text-muted-foreground/50">—</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <LeadStatusSelect id={l.id} status={l.status as LeadStatus} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  )
}
