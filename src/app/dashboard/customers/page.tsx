import Link from "next/link"
import type { ComponentProps } from "react"
import { redirect } from "next/navigation"
import { AlertCircle, Bot, Search, Users } from "lucide-react"
import { getSessionUser } from "@/lib/session"
import { listCustomers, type CustomerListFilters } from "@/app/actions/customers"
import { listActiveTenants, listTenants } from "@/app/actions/tenants"
import { PLAN_LABELS, TENANT_PLANS, type TenantPlan } from "@/lib/schemas/tenants"
import { AddCustomerDialog } from "./add-customer-dialog"
import { EditCustomerDialog } from "./edit-customer-dialog"
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

export const metadata = {
  title: "Clientes — Mindware Nexus",
}

type CustomersPageProps = {
  searchParams: Promise<{
    name?: string
    tenantId?: string
    plan?: string
    isActive?: string
  }>
}

function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("es-MX", { dateStyle: "medium" }).format(new Date(iso))
}

function getErrorMessage(reason: unknown): string | null {
  return reason instanceof Error ? reason.message : null
}

function parseFilters(raw: {
  name?: string
  tenantId?: string
  plan?: string
  isActive?: string
}): CustomerListFilters {
  const name = raw.name?.trim() || undefined
  const tenantIdValue = raw.tenantId?.trim()
  const tenantId = tenantIdValue ? Number(tenantIdValue) : undefined
  const planValue = raw.plan?.trim()
  const plan = TENANT_PLANS.includes(planValue as TenantPlan)
    ? (planValue as TenantPlan)
    : undefined
  const isActive =
    raw.isActive === "true" ? true
    : raw.isActive === "false" ? false
    : undefined

  return {
    name,
    tenantId: tenantId && Number.isFinite(tenantId) && tenantId > 0 ? tenantId : undefined,
    plan,
    isActive,
  }
}

function hasFilters(filters: CustomerListFilters): boolean {
  return !!(
    filters.name ||
    filters.tenantId !== undefined ||
    filters.plan ||
    filters.isActive !== undefined
  )
}

function ErrorBanner({ message }: { message: string }) {
  return (
    <div className="flex items-start gap-2.5 rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
      <AlertCircle className="mt-0.5 size-4 shrink-0" />
      <span>{message}</span>
    </div>
  )
}

function NativeSelect(props: ComponentProps<"select">) {
  return (
    <select
      {...props}
      className={[
        "h-9 w-full rounded-md border border-input bg-transparent px-2.5 py-1 text-sm shadow-xs outline-none",
        "focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
        "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 dark:bg-input/30",
        props.className,
      ]
        .filter(Boolean)
        .join(" ")}
    />
  )
}

export default async function CustomersPage({ searchParams }: CustomersPageProps) {
  const user = await getSessionUser()
  if (!user || user.role !== "owner") redirect("/login")

  const filters = parseFilters(await searchParams)
  const filtersActive = hasFilters(filters)

  const [customersResult, activeTenantsResult, tenantsResult] = await Promise.allSettled([
    listCustomers(filters),
    listActiveTenants(),
    listTenants(),
  ])

  const customers = customersResult.status === "fulfilled" ? customersResult.value : []
  const activeTenants = activeTenantsResult.status === "fulfilled" ? activeTenantsResult.value : []
  const tenants = tenantsResult.status === "fulfilled" ? tenantsResult.value : []
  const customersLoadMessage =
    customersResult.status === "rejected" ? getErrorMessage(customersResult.reason) : null
  const activeTenantsLoadMessage =
    activeTenantsResult.status === "rejected" ? getErrorMessage(activeTenantsResult.reason) : null
  const tenantsLoadMessage =
    tenantsResult.status === "rejected" ? getErrorMessage(tenantsResult.reason) : null

  const tenantMap = new Map(tenants.map((t) => [t.tenant_id, t]))

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-foreground">Clientes</h1>
          <p className="text-sm text-muted-foreground">
            Gestiona las cuentas de cliente del sistema
          </p>
        </div>
        <AddCustomerDialog
          tenants={activeTenants}
          tenantsLoadError={activeTenantsLoadMessage}
        />
      </div>

      <form method="GET" className="rounded-xl border bg-card p-4">
        <div className="grid gap-3 lg:grid-cols-[minmax(0,2fr)_repeat(3,minmax(0,1fr))_auto]">
          <div className="space-y-1.5">
            <label htmlFor="customer-name-filter" className="text-xs font-medium text-muted-foreground">
              Nombre
            </label>
            <div className="relative">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="customer-name-filter"
                name="name"
                defaultValue={filters.name ?? ""}
                placeholder="Buscar cliente por nombre"
                className="pl-8"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="customer-tenant-filter" className="text-xs font-medium text-muted-foreground">
              Tenant
            </label>
            <NativeSelect
              id="customer-tenant-filter"
              name="tenantId"
              defaultValue={filters.tenantId ? String(filters.tenantId) : ""}
            >
              <option value="">Todos</option>
              {tenants.map((tenant) => (
                <option key={tenant.tenant_id} value={tenant.tenant_id}>
                  {tenant.name}
                </option>
              ))}
            </NativeSelect>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="customer-plan-filter" className="text-xs font-medium text-muted-foreground">
              Plan
            </label>
            <NativeSelect id="customer-plan-filter" name="plan" defaultValue={filters.plan ?? ""}>
              <option value="">Todos</option>
              {TENANT_PLANS.map((plan) => (
                <option key={plan} value={plan}>
                  {PLAN_LABELS[plan]}
                </option>
              ))}
            </NativeSelect>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="customer-status-filter" className="text-xs font-medium text-muted-foreground">
              Estado
            </label>
            <NativeSelect
              id="customer-status-filter"
              name="isActive"
              defaultValue={
                filters.isActive === undefined ? "" : filters.isActive ? "true" : "false"
              }
            >
              <option value="">Todos</option>
              <option value="true">Activo</option>
              <option value="false">Inactivo</option>
            </NativeSelect>
          </div>

          <div className="flex items-end gap-2">
            <Button type="submit" className="bg-nexus-purple text-white hover:bg-nexus-purple/85">
              Aplicar
            </Button>
            {filtersActive && (
              <Button asChild variant="outline">
                <Link href="/dashboard/customers">Limpiar</Link>
              </Button>
            )}
          </div>
        </div>
      </form>

      {customersLoadMessage && <ErrorBanner message={customersLoadMessage} />}
      {tenantsLoadMessage && <ErrorBanner message={tenantsLoadMessage} />}
      {activeTenantsLoadMessage && !customersLoadMessage && (
        <ErrorBanner message={activeTenantsLoadMessage} />
      )}

      <div className="flex items-center gap-3 rounded-xl border bg-muted/30 px-4 py-3">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-nexus-purple/10">
          <Users className="size-4 text-nexus-purple" />
        </div>
        <div>
          <p className="text-sm font-medium text-foreground">
            {customersLoadMessage ? "—" : customers.length}
          </p>
          <p className="text-xs text-muted-foreground">
            {customersLoadMessage
              ? "no disponible por error de carga"
              : filtersActive
                ? `resultado${customers.length !== 1 ? "s" : ""} con filtros`
                : `cliente${customers.length !== 1 ? "s" : ""} registrado${customers.length !== 1 ? "s" : ""}`}
          </p>
        </div>
      </div>

      <div className="rounded-xl border bg-card">
        {customersLoadMessage ? (
          <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
            <div className="flex size-12 items-center justify-center rounded-full bg-destructive/10">
              <AlertCircle className="size-5 text-destructive" />
            </div>
            <div>
              <p className="font-medium text-foreground">No se pudieron cargar los clientes</p>
              <p className="mt-1 text-sm text-muted-foreground">{customersLoadMessage}</p>
            </div>
          </div>
        ) : customers.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
            <div className="flex size-12 items-center justify-center rounded-full bg-muted">
              <AlertCircle className="size-5 text-muted-foreground" />
            </div>
            <div>
              <p className="font-medium text-foreground">
                {filtersActive ? "Sin coincidencias" : "Sin clientes todavía"}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                {filtersActive ? (
                  "Ajusta o limpia filtros para ver más resultados."
                ) : (
                  <>
                    Usa el botón <span className="font-medium">Agregar cliente</span> para crear
                    el primero.
                  </>
                )}
              </p>
            </div>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Nombre</TableHead>
                <TableHead>Correo electrónico</TableHead>
                <TableHead>Tenant</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>Fecha de alta</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="w-10" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {customers.map((c) => {
                const tenant = c.tenant_id ? tenantMap.get(c.tenant_id) : undefined
                const tenantInactive = tenant ? !tenant.is_active : false
                return (
                  <TableRow key={c.id}>
                    <TableCell className="font-medium text-foreground">{c.name}</TableCell>
                    <TableCell className="text-muted-foreground">{c.email}</TableCell>
                    <TableCell>
                      {tenant ? (
                        <Badge variant={tenant.is_active ? "info" : "secondary"}>
                          {tenant.name}
                        </Badge>
                      ) : (
                        <span className="text-xs text-muted-foreground/60">—</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {tenant ? (
                        <Badge variant="outline">{PLAN_LABELS[tenant.plan]}</Badge>
                      ) : (
                        <span className="text-xs text-muted-foreground/60">-</span>
                      )}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatDate(c.created_at)}
                    </TableCell>
                    <TableCell>
                      {c.is_active && !tenantInactive ? (
                        <Badge variant="success">Activo</Badge>
                      ) : c.is_active && tenantInactive ? (
                        <Badge variant="warning">Tenant inactivo</Badge>
                      ) : (
                        <Badge variant="destructive">Inactivo</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button asChild variant="ghost" size="icon" title="Configurar bot">
                          <Link href={`/dashboard/bots/${c.id}`}>
                            <Bot className="size-4" />
                          </Link>
                        </Button>
                        <EditCustomerDialog customer={c} tenantInactive={tenantInactive} />
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        )}
      </div>

      <p className="text-xs text-muted-foreground/70">
        Al crear un cliente se le asigna una contraseña temporal y recibe un correo de bienvenida
        con un enlace para configurar su contraseña vía <em>¿Olvidaste tu contraseña?</em>
      </p>
    </div>
  )
}
