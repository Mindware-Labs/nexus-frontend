import Link from 'next/link'
import { redirect } from 'next/navigation'
import {
  ArrowLeft,
  AlertCircle,
  MessageSquare,
  Users,
  Zap,
  Clock,
  Mail,
  Phone,
  Building2,
  User,
} from 'lucide-react'
import { getSessionUser } from '@/lib/session'
import { getCustomerStats } from '@/app/actions/customers'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return { title: `Detalle cliente #${id} — Mindware Nexus` }
}

function formatDate(iso: string): string {
  return new Intl.DateTimeFormat('es-MX', { dateStyle: 'medium', timeStyle: 'short' }).format(
    new Date(iso),
  )
}

function formatDateShort(iso: string): string {
  return new Intl.DateTimeFormat('es-MX', { dateStyle: 'medium' }).format(new Date(iso))
}

function formatNumber(n: number): string {
  return new Intl.NumberFormat('es-MX').format(n)
}

interface StatCardProps {
  icon: React.ReactNode
  label: string
  value: string
  sub?: string
  accent?: boolean
}

function StatCard({ icon, label, value, sub, accent }: StatCardProps) {
  return (
    <div className="rounded-xl border bg-card p-5">
      <div className="flex items-start justify-between gap-3">
        <div
          className={`flex size-10 shrink-0 items-center justify-center rounded-lg ${
            accent ? 'bg-nexus-purple/10' : 'bg-muted'
          }`}
        >
          <span className={accent ? 'text-nexus-purple' : 'text-muted-foreground'}>{icon}</span>
        </div>
      </div>
      <p className="mt-4 text-2xl font-bold tracking-tight text-foreground">{value}</p>
      <p className="mt-0.5 text-sm font-medium text-foreground">{label}</p>
      {sub && <p className="mt-0.5 text-xs text-muted-foreground">{sub}</p>}
    </div>
  )
}

export default async function CustomerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const user = await getSessionUser()
  if (!user || user.role !== 'owner') redirect('/login')

  const { id } = await params
  const customerId = Number(id)

  let stats = null
  let loadError: string | null = null

  try {
    stats = await getCustomerStats(customerId)
  } catch (err) {
    loadError = err instanceof Error ? err.message : 'No se pudo cargar el detalle del cliente'
  }

  const now = new Date()
  const monthName = now.toLocaleString('es-MX', { month: 'long' })

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button asChild variant="ghost" size="icon" className="shrink-0">
          <Link href="/dashboard/customers">
            <ArrowLeft className="size-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-xl font-semibold text-foreground">
            {stats ? stats.customerName : `Cliente #${customerId}`}
          </h1>
          <p className="text-sm text-muted-foreground">
            {stats ? stats.customerEmail : 'Detalle del cliente'}
          </p>
        </div>
      </div>

      {loadError && (
        <div className="flex items-start gap-2.5 rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          <AlertCircle className="mt-0.5 size-4 shrink-0" />
          {loadError}
        </div>
      )}

      {stats && (
        <>
          {/* Stat cards */}
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              icon={<Clock className="size-5" />}
              label="Último acceso"
              value={stats.lastActivity ? formatDate(stats.lastActivity) : 'Sin actividad'}
              sub="Última sesión registrada"
              accent
            />
            <StatCard
              icon={<MessageSquare className="size-5" />}
              label="Conversaciones"
              value={formatNumber(stats.conversationsThisMonth)}
              sub={`Turnos de chat en ${monthName}`}
              accent
            />
            <StatCard
              icon={<Users className="size-5" />}
              label="Leads generados"
              value={formatNumber(stats.leadsThisMonth)}
              sub={`Contactos capturados en ${monthName}`}
              accent
            />
            <StatCard
              icon={<Zap className="size-5" />}
              label="Tokens consumidos"
              value={formatNumber(stats.tokensThisMonth)}
              sub={`Tokens de Gemini en ${monthName}`}
              accent
            />
          </div>

          {/* Recent leads */}
          <div className="rounded-xl border bg-card">
            <div className="flex items-center justify-between gap-4 border-b px-5 py-4">
              <div>
                <h2 className="text-sm font-semibold text-foreground">Últimos leads capturados</h2>
                <p className="text-xs text-muted-foreground">Los 5 más recientes de este cliente</p>
              </div>
              <Button asChild variant="outline" size="sm">
                <Link href={`/dashboard/bots/${customerId}`}>Ver configuración del bot</Link>
              </Button>
            </div>

            {stats.recentLeads.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-3 py-14 text-center">
                <div className="flex size-11 items-center justify-center rounded-full bg-muted">
                  <Users className="size-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Sin leads todavía</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Los leads capturados por el chatbot aparecerán aquí.
                  </p>
                </div>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead>Contacto</TableHead>
                    <TableHead>Empresa</TableHead>
                    <TableHead>Resumen</TableHead>
                    <TableHead>Fecha</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {stats.recentLeads.map((lead, i) => (
                    <TableRow key={i}>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          {lead.name && (
                            <span className="flex items-center gap-1.5 text-sm font-medium text-foreground">
                              <User className="size-3 shrink-0 text-muted-foreground" />
                              {lead.name}
                            </span>
                          )}
                          {lead.email && (
                            <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                              <Mail className="size-3 shrink-0" />
                              {lead.email}
                            </span>
                          )}
                          {lead.phone && (
                            <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                              <Phone className="size-3 shrink-0" />
                              {lead.phone}
                            </span>
                          )}
                          {!lead.name && !lead.email && !lead.phone && (
                            <span className="text-xs text-muted-foreground/60">—</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {lead.company ? (
                          <span className="flex items-center gap-1.5 text-sm text-foreground">
                            <Building2 className="size-3 shrink-0 text-muted-foreground" />
                            {lead.company}
                          </span>
                        ) : (
                          <span className="text-xs text-muted-foreground/60">—</span>
                        )}
                      </TableCell>
                      <TableCell className="max-w-xs">
                        {lead.summary ? (
                          <p className="line-clamp-2 text-sm text-muted-foreground">
                            {lead.summary}
                          </p>
                        ) : (
                          <span className="text-xs text-muted-foreground/60">—</span>
                        )}
                      </TableCell>
                      <TableCell className="whitespace-nowrap text-sm text-muted-foreground">
                        {formatDateShort(lead.created_at)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>

          {/* Badges de estado */}
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="text-xs">
              ID #{customerId}
            </Badge>
            <Badge variant="outline" className="text-xs">
              Mes actual: {monthName} {now.getFullYear()}
            </Badge>
          </div>
        </>
      )}
    </div>
  )
}
