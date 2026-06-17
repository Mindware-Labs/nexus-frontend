import { redirect } from "next/navigation"
import Link from "next/link"
import {
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  Search,
} from "lucide-react"
import { getSessionUser } from "@/lib/session"
import { getAuditLogs, getAuditActions, type AuditLog } from "@/app/actions/audit"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export const metadata = {
  title: "Auditoría — Mindware Nexus",
}

const PAGE_SIZE = 20

type SearchParams = {
  page?: string
  action?: string
  entity?: string
  from?: string
  to?: string
  search?: string
}

type AuditPageProps = {
  searchParams: Promise<SearchParams>
}

function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("es-MX", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(iso))
}

function getErrorMessage(reason: unknown): string | null {
  return reason instanceof Error ? reason.message : null
}

function isRedirectError(err: unknown): boolean {
  if (!(err instanceof Error)) return false
  const e = err as Error & { digest?: string }
  return e.message === "NEXT_REDIRECT" || (e.digest?.startsWith("NEXT_REDIRECT") ?? false)
}

const ACTION_LABELS: Record<string, string> = {
  "customer.create": "Cliente creado",
  "customer.update": "Cliente editado",
  "tenant.create": "Empresa creada",
  "tenant.update": "Empresa editada",
  "bot_config.update": "Config bot editada",
  "bot_config.activate": "Bot activado",
  "bot_config.deactivate": "Bot desactivado",
}

const ENTITY_LABELS: Record<string, string> = {
  customer: "Cliente",
  tenant: "Empresa",
  bot_config: "Config Bot",
}

const ACTION_BADGE_VARIANT: Record<string, "default" | "success" | "info" | "warning" | "destructive"> = {
  "customer.create": "success",
  "customer.update": "info",
  "tenant.create": "success",
  "tenant.update": "info",
  "bot_config.update": "warning",
  "bot_config.activate": "success",
  "bot_config.deactivate": "destructive",
}

function ErrorBanner({ message }: { message: string }) {
  return (
    <div className="flex items-start gap-2.5 rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
      <AlertCircle className="mt-0.5 size-4 shrink-0" />
      <span>{message}</span>
    </div>
  )
}

function DiffViewer({ diff }: { diff: AuditLog["diff"] }) {
  if (!diff) return <p className="text-sm text-muted-foreground">Sin cambios registrados.</p>

  const keys = Array.from(
    new Set([...Object.keys(diff.before), ...Object.keys(diff.after)])
  )

  return (
    <div className="space-y-2 text-sm">
      <div className="grid grid-cols-[auto_1fr_1fr] gap-x-3 gap-y-1">
        <div className="font-semibold text-muted-foreground">Campo</div>
        <div className="font-semibold text-destructive/80">Antes</div>
        <div className="font-semibold text-green-700 dark:text-green-400">Después</div>
        {keys.map((k) => (
          <>
            <div key={`k-${k}`} className="py-1 font-mono text-xs text-muted-foreground">{k}</div>
            <div key={`b-${k}`} className="py-1 break-all">
              {diff.before[k] !== undefined
                ? <code className="rounded bg-destructive/10 px-1 text-xs">{JSON.stringify(diff.before[k])}</code>
                : <span className="text-muted-foreground/50">—</span>}
            </div>
            <div key={`a-${k}`} className="py-1 break-all">
              {diff.after[k] !== undefined
                ? <code className="rounded bg-green-500/10 px-1 text-xs">{JSON.stringify(diff.after[k])}</code>
                : <span className="text-muted-foreground/50">—</span>}
            </div>
          </>
        ))}
      </div>
    </div>
  )
}

function buildUrl(base: SearchParams, overrides: Partial<SearchParams>): string {
  const p = new URLSearchParams()
  const merged = { ...base, ...overrides }
  if (merged.page && merged.page !== "1") p.set("page", merged.page)
  if (merged.action) p.set("action", merged.action)
  if (merged.entity) p.set("entity", merged.entity)
  if (merged.from) p.set("from", merged.from)
  if (merged.to) p.set("to", merged.to)
  if (merged.search) p.set("search", merged.search)
  const qs = p.toString()
  return `/dashboard/audit${qs ? `?${qs}` : ""}`
}

export default async function AuditPage({ searchParams }: AuditPageProps) {
  const user = await getSessionUser()
  if (!user || user.role !== "owner") redirect("/login")

  const params = await searchParams
  const page = Math.max(1, Number(params.page ?? 1))
  const action = params.action || undefined
  const entity = params.entity || undefined
  const from = params.from || undefined
  const to = params.to || undefined
  const search = params.search || undefined

  const [logsResult, actionsResult] = await Promise.allSettled([
    getAuditLogs({ page, limit: PAGE_SIZE, action, entity, from, to, search }),
    getAuditActions(),
  ])

  const logsError =
    logsResult.status === "rejected" && !isRedirectError(logsResult.reason)
      ? getErrorMessage(logsResult.reason)
      : null

  const logs = logsResult.status === "fulfilled" ? logsResult.value.data : []
  const total = logsResult.status === "fulfilled" ? logsResult.value.total : 0
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))
  const availableActions = actionsResult.status === "fulfilled" ? actionsResult.value : []

  const currentParams = { page: String(page), action, entity, from, to, search }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <ClipboardList className="size-5 text-muted-foreground" />
        <h1 className="text-xl font-semibold">Registro de Auditoría</h1>
        <Badge variant="outline" className="ml-auto">
          {total} {total === 1 ? "registro" : "registros"}
        </Badge>
      </div>

      {/* Filtros */}
      <form method="GET" action="/dashboard/audit" className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        <div className="relative col-span-2 sm:col-span-1 lg:col-span-2">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            name="search"
            placeholder="Buscar por entidad..."
            defaultValue={search}
            className="pl-9"
          />
        </div>

        <select
          name="action"
          defaultValue={action ?? ""}
          className="flex h-9 w-full items-center rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm"
        >
          <option value="">Todas las acciones</option>
          {availableActions.map((a) => (
            <option key={a} value={a}>{ACTION_LABELS[a] ?? a}</option>
          ))}
        </select>

        <select
          name="entity"
          defaultValue={entity ?? ""}
          className="flex h-9 w-full items-center rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm"
        >
          <option value="">Todas las entidades</option>
          <option value="customer">Cliente</option>
          <option value="tenant">Empresa</option>
          <option value="bot_config">Config Bot</option>
        </select>

        <div className="flex gap-2">
          <Input name="from" type="date" defaultValue={from} className="text-xs" title="Desde" />
          <Input name="to" type="date" defaultValue={to} className="text-xs" title="Hasta" />
        </div>

        <input type="hidden" name="page" value="1" />

        <Button type="submit" className="lg:col-span-1 bg-nexus-purple hover:bg-nexus-purple/90 text-white" size="sm">
          Filtrar
        </Button>

        {(search || action || entity || from || to) && (
          <Link href="/dashboard/audit">
            <Button type="button" variant="ghost" size="sm" className="w-full">
              Limpiar
            </Button>
          </Link>
        )}
      </form>

      {/* Error */}
      {logsError && <ErrorBanner message={logsError} />}

      {/* Tabla */}
      <div className="rounded-xl border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40">
              <TableHead className="w-40">Fecha</TableHead>
              <TableHead className="w-52">Actor</TableHead>
              <TableHead className="w-44">Acción</TableHead>
              <TableHead className="w-32">Entidad</TableHead>
              <TableHead>Objeto</TableHead>
              <TableHead className="w-20 text-center">Diff</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {logs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="py-12 text-center text-muted-foreground">
                  No hay registros de auditoría con los filtros actuales.
                </TableCell>
              </TableRow>
            ) : (
              logs.map((log) => (
                <TableRow key={log.id} className="hover:bg-muted/30">
                  <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                    {formatDate(log.created_at)}
                  </TableCell>
                  <TableCell className="text-xs truncate max-w-[200px]" title={log.actor_email}>
                    {log.actor_email}
                  </TableCell>
                  <TableCell>
                    <Badge variant={ACTION_BADGE_VARIANT[log.action] ?? "outline"} className="text-xs">
                      {ACTION_LABELS[log.action] ?? log.action}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {ENTITY_LABELS[log.entity] ?? log.entity}
                  </TableCell>
                  <TableCell className="text-sm">
                    {log.entity_label ?? log.entity_id ?? "—"}
                  </TableCell>
                  <TableCell className="text-center">
                    {log.diff ? (
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-7 px-2 text-xs text-nexus-purple hover:text-nexus-purple hover:bg-nexus-purple/10">
                            Ver
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle className="text-sm">
                              Cambios — {ACTION_LABELS[log.action] ?? log.action}
                              {log.entity_label ? ` · ${log.entity_label}` : ""}
                            </DialogTitle>
                          </DialogHeader>
                          <DiffViewer diff={log.diff} />
                        </DialogContent>
                      </Dialog>
                    ) : (
                      <span className="text-muted-foreground/40 text-xs">—</span>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Paginación */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>Página {page} de {totalPages}</span>
          <div className="flex gap-2">
            {page > 1 ? (
              <Link href={buildUrl(currentParams, { page: String(page - 1) })}>
                <Button variant="outline" size="sm" className="gap-1">
                  <ChevronLeft className="size-4" /> Anterior
                </Button>
              </Link>
            ) : (
              <Button variant="outline" size="sm" disabled className="gap-1">
                <ChevronLeft className="size-4" /> Anterior
              </Button>
            )}
            {page < totalPages ? (
              <Link href={buildUrl(currentParams, { page: String(page + 1) })}>
                <Button variant="outline" size="sm" className="gap-1">
                  Siguiente <ChevronRight className="size-4" />
                </Button>
              </Link>
            ) : (
              <Button variant="outline" size="sm" disabled className="gap-1">
                Siguiente <ChevronRight className="size-4" />
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
