import { Suspense } from 'react'
import { redirect } from 'next/navigation'
import { AlertCircle, Users } from 'lucide-react'
import { getSessionUser } from '@/lib/session'
import { getLeads, type LeadListItem } from '@/app/actions/customer'
import { LeadFilters } from '@/components/panel/lead-filters'
import { LeadsExportButton } from '@/components/panel/leads-export-button'
import { LeadsTable } from '@/components/panel/leads-table'

export const metadata = { title: 'Leads — Mindware Nexus' }

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

      <div className="rounded-xl border bg-card overflow-hidden">
        <LeadsTable leads={leads} />
      </div>
    </div>
  )
}
