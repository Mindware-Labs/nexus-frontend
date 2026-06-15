import { redirect } from "next/navigation"
import { AlertCircle, Building2 } from "lucide-react"
import { getSessionUser } from "@/lib/session"
import { listTenants } from "@/app/actions/tenants"
import { PLAN_LABELS } from "@/lib/schemas/tenants"
import { AddTenantDialog } from "./add-tenant-dialog"
import { EditTenantDialog } from "./edit-tenant-dialog"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export const metadata = {
  title: "Tenants — Mindware Nexus",
}

const PLAN_VARIANT = {
  trial: "outline",
  starter: "info",
  pro: "success",
  enterprise: "warning",
} as const

function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("es-MX", { dateStyle: "medium" }).format(new Date(iso))
}

function getErrorMessage(reason: unknown): string | null {
  return reason instanceof Error ? reason.message : null
}

function ErrorBanner({ message }: { message: string }) {
  return (
    <div className="flex items-start gap-2.5 rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
      <AlertCircle className="mt-0.5 size-4 shrink-0" />
      <span>{message}</span>
    </div>
  )
}

export default async function TenantsPage() {
  const user = await getSessionUser()
  if (!user || user.role !== "owner") redirect("/login")

  const [tenantsResult] = await Promise.allSettled([listTenants()])
  const tenants = tenantsResult.status === "fulfilled" ? tenantsResult.value : []
  const tenantsLoadMessage =
    tenantsResult.status === "rejected" ? getErrorMessage(tenantsResult.reason) : null

  const active = tenants.filter((t) => t.is_active).length

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-foreground">Tenants</h1>
          <p className="text-sm text-muted-foreground">
            Gestiona las organizaciones cliente de la plataforma
          </p>
        </div>
        <AddTenantDialog />
      </div>

      {tenantsLoadMessage && <ErrorBanner message={tenantsLoadMessage} />}

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <div className="flex items-center gap-3 rounded-xl border bg-muted/30 px-4 py-3">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-nexus-purple/10">
            <Building2 className="size-4 text-nexus-purple" />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">
              {tenantsLoadMessage ? "—" : tenants.length}
            </p>
            <p className="text-xs text-muted-foreground">
              {tenantsLoadMessage ? "no disponible" : "total"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-xl border bg-muted/30 px-4 py-3">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10">
            <span className="size-2 rounded-full bg-emerald-500" />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">
              {tenantsLoadMessage ? "—" : active}
            </p>
            <p className="text-xs text-muted-foreground">
              {tenantsLoadMessage ? "no disponible" : "activos"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-xl border bg-muted/30 px-4 py-3 col-span-2 sm:col-span-1">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted">
            <span className="size-2 rounded-full bg-muted-foreground/50" />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">
              {tenantsLoadMessage ? "—" : tenants.length - active}
            </p>
            <p className="text-xs text-muted-foreground">
              {tenantsLoadMessage ? "no disponible" : "inactivos"}
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-xl border bg-card">
        {tenantsLoadMessage ? (
          <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
            <div className="flex size-12 items-center justify-center rounded-full bg-destructive/10">
              <AlertCircle className="size-5 text-destructive" />
            </div>
            <div>
              <p className="font-medium text-foreground">No se pudieron cargar los tenants</p>
              <p className="mt-1 text-sm text-muted-foreground">{tenantsLoadMessage}</p>
            </div>
          </div>
        ) : tenants.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
            <div className="flex size-12 items-center justify-center rounded-full bg-muted">
              <AlertCircle className="size-5 text-muted-foreground" />
            </div>
            <div>
              <p className="font-medium text-foreground">Sin tenants todavía</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Usa el botón <span className="font-medium">Nuevo tenant</span> para crear el
                primero.
              </p>
            </div>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Organización</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Creado</TableHead>
                <TableHead className="w-10" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {tenants.map((tenant) => (
                <TableRow key={tenant.tenant_id}>
                  <TableCell className="font-medium text-foreground">
                    {tenant.name}
                  </TableCell>
                  <TableCell>
                    <code className="rounded bg-muted px-1.5 py-0.5 text-xs text-muted-foreground">
                      {tenant.slug}
                    </code>
                  </TableCell>
                  <TableCell>
                    <Badge variant={PLAN_VARIANT[tenant.plan]}>
                      {PLAN_LABELS[tenant.plan]}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {tenant.is_active ? (
                      <Badge variant="success">Activo</Badge>
                    ) : (
                      <Badge variant="secondary">Inactivo</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {formatDate(tenant.created_at)}
                  </TableCell>
                  <TableCell>
                    <EditTenantDialog tenant={tenant} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      <p className="text-xs text-muted-foreground/60">
        Todos los datos de cada tenant están aislados a nivel de base de datos mediante{" "}
        <code className="rounded bg-muted px-1 py-0.5 text-[11px]">tenant_id</code> +
        Row-Level Security (RLS) en PostgreSQL, conforme al Documento Maestro §6.
      </p>
    </div>
  )
}
