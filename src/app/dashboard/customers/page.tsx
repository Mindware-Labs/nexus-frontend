import { redirect } from "next/navigation"
import { AlertCircle, Users } from "lucide-react"
import { getSessionUser } from "@/lib/session"
import { listCustomers } from "@/app/actions/customers"
import { listActiveTenants, listTenants } from "@/app/actions/tenants"
import { PLAN_LABELS } from "@/lib/schemas/tenants"
import { AddCustomerDialog } from "./add-customer-dialog"
import { EditCustomerDialog } from "./edit-customer-dialog"
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
  title: "Clientes — Mindware Nexus",
}

function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("es-MX", { dateStyle: "medium" }).format(new Date(iso))
}

export default async function CustomersPage() {
  const user = await getSessionUser()
  if (!user || user.role !== "owner") redirect("/login")

  const [customers, activeTenants, tenants] = await Promise.all([
    listCustomers(),
    listActiveTenants(),
    listTenants(),
  ])

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
        <AddCustomerDialog tenants={activeTenants} />
      </div>

      <div className="flex items-center gap-3 rounded-xl border bg-muted/30 px-4 py-3">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-nexus-purple/10">
          <Users className="size-4 text-nexus-purple" />
        </div>
        <div>
          <p className="text-sm font-medium text-foreground">{customers.length}</p>
          <p className="text-xs text-muted-foreground">
            cliente{customers.length !== 1 ? "s" : ""} registrado{customers.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      <div className="rounded-xl border bg-card">
        {customers.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
            <div className="flex size-12 items-center justify-center rounded-full bg-muted">
              <AlertCircle className="size-5 text-muted-foreground" />
            </div>
            <div>
              <p className="font-medium text-foreground">Sin clientes todavía</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Usa el botón <span className="font-medium">Agregar cliente</span> para crear el primero.
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
                    <TableCell>
                      <EditCustomerDialog customer={c} tenantInactive={tenantInactive} />
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        )}
      </div>

      <p className="text-xs text-muted-foreground/70">
        Al crear un cliente se le asigna una contraseña temporal y recibe un correo de bienvenida con un enlace para configurar su contraseña vía <em>¿Olvidaste tu contraseña?</em>
      </p>
    </div>
  )
}
