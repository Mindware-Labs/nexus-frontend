"use client"

import { startTransition, useActionState, useEffect, useRef, useState } from "react"
import { AlertCircle, CheckCircle2, Loader2, Plus, UserPlus } from "lucide-react"
import { createCustomerAction, type CustomerActionState } from "@/app/actions/customers"
import { CreateCustomerSchema } from "@/lib/schemas/customers"
import type { TenantOption } from "@/app/actions/tenants"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

type FieldErrors = { name?: string; email?: string; tenantId?: string }

export function AddCustomerDialog({ tenants }: { tenants: TenantOption[] }) {
  const [open, setOpen] = useState(false)
  const [state, formAction, isPending] = useActionState<CustomerActionState, FormData>(
    createCustomerAction,
    { status: "idle" },
  )
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const [selectedTenant, setSelectedTenant] = useState("")
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    if (state.status === "success") {
      formRef.current?.reset()
      setFieldErrors({})
      setSelectedTenant("")
      const timer = setTimeout(() => setOpen(false), 1800)
      return () => clearTimeout(timer)
    }
  }, [state])

  useEffect(() => {
    if (!open) {
      setFieldErrors({})
      setSelectedTenant("")
    }
  }, [open])

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    fd.set("tenantId", selectedTenant)

    const result = CreateCustomerSchema.safeParse({
      name: fd.get("name"),
      email: fd.get("email"),
      tenantId: fd.get("tenantId"),
    })

    if (!result.success) {
      const fe: FieldErrors = {}
      for (const issue of result.error.issues) {
        const key = issue.path[0] as keyof FieldErrors
        if (key && !fe[key]) fe[key] = issue.message
      }
      setFieldErrors(fe)
      return
    }
    setFieldErrors({})
    startTransition(() => formAction(fd))
  }

  const isSuccess = state.status === "success"
  const noTenants = tenants.length === 0

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-1.5 bg-nexus-purple text-white hover:bg-nexus-purple/85 shadow-sm shadow-nexus-purple/30">
          <Plus className="size-4" />
          Agregar cliente
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mb-3 flex size-10 items-center justify-center rounded-xl bg-nexus-purple/10">
            <UserPlus className="size-5 text-nexus-purple" />
          </div>
          <DialogTitle>Agregar nuevo cliente</DialogTitle>
          <DialogDescription>
            Se creará la cuenta y se enviará un correo de bienvenida con instrucciones para configurar su contraseña.
          </DialogDescription>
        </DialogHeader>

        {isSuccess ? (
          <div className="flex flex-col items-center gap-3 py-4 text-center">
            <div className="flex size-12 items-center justify-center rounded-full bg-emerald-500/10">
              <CheckCircle2 className="size-6 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <p className="font-medium text-foreground">¡Cliente creado exitosamente!</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Se envió el correo de bienvenida a{" "}
                <span className="font-medium text-foreground">
                  {(state as { status: "success"; customerName: string }).customerName}
                </span>
              </p>
            </div>
          </div>
        ) : noTenants ? (
          <div className="flex flex-col items-center gap-3 py-4 text-center">
            <div className="flex size-10 items-center justify-center rounded-full bg-amber-500/10">
              <AlertCircle className="size-5 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <p className="font-medium text-foreground">No hay tenants activos</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Debes crear al menos un tenant antes de agregar clientes.
              </p>
            </div>
            <DialogClose asChild>
              <Button variant="outline" size="sm">Entendido</Button>
            </DialogClose>
          </div>
        ) : (
          <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
            {state.status === "error" && (
              <div className="flex items-start gap-2.5 rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
                <AlertCircle className="mt-0.5 size-4 shrink-0" />
                <span>{state.message}</span>
              </div>
            )}

            <div className="space-y-1.5">
              <Label htmlFor="customer-name">Nombre completo</Label>
              <Input
                id="customer-name"
                name="name"
                type="text"
                placeholder="Empresa S.A. de C.V."
                autoComplete="off"
                aria-invalid={!!fieldErrors.name}
                disabled={isPending}
              />
              {fieldErrors.name && (
                <p className="text-xs text-destructive">{fieldErrors.name}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="customer-email">Correo electrónico</Label>
              <Input
                id="customer-email"
                name="email"
                type="email"
                placeholder="contacto@empresa.com"
                autoComplete="off"
                aria-invalid={!!fieldErrors.email}
                disabled={isPending}
              />
              {fieldErrors.email && (
                <p className="text-xs text-destructive">{fieldErrors.email}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="customer-tenant">Tenant</Label>
              <Select
                value={selectedTenant}
                onValueChange={setSelectedTenant}
                disabled={isPending}
              >
                <SelectTrigger
                  id="customer-tenant"
                  aria-invalid={!!fieldErrors.tenantId}
                >
                  <SelectValue placeholder="Selecciona un tenant…" />
                </SelectTrigger>
                <SelectContent>
                  {tenants.map((t) => (
                    <SelectItem key={t.tenant_id} value={String(t.tenant_id)}>
                      {t.name}
                      <span className="ml-1.5 text-xs text-muted-foreground capitalize">
                        · {t.plan}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {fieldErrors.tenantId && (
                <p className="text-xs text-destructive">{fieldErrors.tenantId}</p>
              )}
            </div>

            <p className="text-xs text-muted-foreground">
              Se asignará una contraseña temporal. El cliente podrá cambiarla desde el correo de bienvenida.
            </p>

            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline" disabled={isPending}>
                  Cancelar
                </Button>
              </DialogClose>
              <Button
                type="submit"
                disabled={isPending}
                className="bg-nexus-purple text-white hover:bg-nexus-purple/85"
              >
                {isPending && <Loader2 className="size-4 animate-spin" />}
                {isPending ? "Creando…" : "Crear cliente"}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
