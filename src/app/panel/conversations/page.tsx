import { Suspense } from 'react'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { AlertCircle, MessagesSquare } from 'lucide-react'
import { getSessionUser } from '@/lib/session'
import { getConversations, type ConversationListItem } from '@/app/actions/customer'
import { ConversationFilters } from '@/components/panel/conversation-filters'
import { RelevantToggle } from '@/components/panel/relevant-toggle'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'

export const metadata = { title: 'Conversaciones — Mindware Nexus' }

function fmtDuration(seconds: number) {
  if (seconds <= 0) return '—'
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return m > 0 ? `${m}m ${s}s` : `${s}s`
}

export default async function ConversationsPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; filter?: string }>
}) {
  const user = await getSessionUser()
  if (!user || user.role !== 'customer') redirect('/login')

  const sp = await searchParams
  const filters: { search?: string; hasLead?: boolean; relevant?: boolean } = { search: sp.search }
  if (sp.filter === 'lead') filters.hasLead = true
  else if (sp.filter === 'nolead') filters.hasLead = false
  else if (sp.filter === 'relevant') filters.relevant = true

  let items: ConversationListItem[] = []
  let loadError: string | null = null
  try {
    items = await getConversations(filters)
  } catch (e) {
    if (e instanceof Error && (e.message === 'NEXT_REDIRECT' || 'digest' in e)) throw e
    loadError = e instanceof Error ? e.message : 'No se pudieron cargar las conversaciones'
  }

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <div>
        <h1 className="flex items-center gap-2 text-xl font-semibold text-foreground">
          <MessagesSquare className="size-5 text-nexus-purple" />
          Conversaciones
        </h1>
        <p className="mt-0.5 text-sm text-muted-foreground">
          Historial completo de conversaciones, generen o no un lead
        </p>
      </div>

      <Suspense>
        <ConversationFilters />
      </Suspense>

      {loadError && (
        <div className="flex items-start gap-2.5 rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          <AlertCircle className="mt-0.5 size-4 shrink-0" />
          {loadError}
        </div>
      )}

      <div className="rounded-xl border bg-card">
        {items.length === 0 ? (
          <p className="py-14 text-center text-sm text-muted-foreground">
            No hay conversaciones que coincidan.
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Conversación</TableHead>
                <TableHead>Inicio</TableHead>
                <TableHead>Mensajes</TableHead>
                <TableHead>Duración</TableHead>
                <TableHead>Lead</TableHead>
                <TableHead className="w-10" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((c) => (
                <TableRow key={c.id}>
                  <TableCell className="max-w-xs">
                    <Link href={`/panel/conversations/${c.id}`} className="block truncate text-sm hover:text-nexus-purple">
                      {c.preview || 'Conversación sin contenido'}
                    </Link>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {new Date(c.startedAt).toLocaleString('es-MX')}
                  </TableCell>
                  <TableCell className="text-xs tabular-nums text-muted-foreground">{c.messageCount}</TableCell>
                  <TableCell className="text-xs tabular-nums text-muted-foreground">{fmtDuration(c.durationSeconds)}</TableCell>
                  <TableCell>
                    {c.leadId ? (
                      <Badge className="bg-nexus-mint/15 text-emerald-700 border-emerald-200 text-[11px]">Sí</Badge>
                    ) : (
                      <span className="text-xs text-muted-foreground/50">No</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <RelevantToggle id={c.id} relevant={c.isRelevant} />
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
