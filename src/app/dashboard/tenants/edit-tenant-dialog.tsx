"use client"

import { startTransition, useActionState, useEffect, useState } from "react"
import { AlertCircle, Loader2, Pencil } from "lucide-react"
import { updateTenantAction, type Tenant, type TenantActionState } from "@/app/actions/tenants"
import { PLAN_LABELS, TENANT_PLANS } from "@/lib/schemas/tenants"
import type { Plan } from "@/app/actions/plans"
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

export function EditTenantDialog({ tenant, plans = [] }: { tenant: Tenant; plans?: Plan[] }) {
  const [open, setOpen] = useState(false)

  const boundAction = updateTenantAction.bind(null, tenant.tenant_id)
  const [state, formAction, isPending] = useActionState<TenantActionState, FormData>(
    boundAction,
    { status: "idle" },
  )

  const [selectedPlan, setSelectedPlan] = useState(tenant.plan)
  const [selectedPlanId, setSelectedPlanId] = useState<string>(tenant.plan_id ? String(tenant.plan_id) : 'none')
  const [selectedActive, setSelectedActive] = useState(String(tenant.is_active))
  const [nameError, setNameError] = useState<string | undefined>()

  useEffect(() => {
    if (state.status === "success") {
      const timer = setTimeout(() => setOpen(false), 1200)
      return () => clearTimeout(timer)
    }
  }, [state])

  useEffect(() => {
    if (open) {
      setSelectedPlan(tenant.plan)
      setSelectedPlanId(tenant.plan_id ? String(tenant.plan_id) : 'none')
      setSelectedActive(String(tenant.is_active))
      setNameError(undefined)
    }
  }, [open, tenant])

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    const name = (fd.get("name") as string).trim()
    if (name.length < 2) {
      setNameError("El nombre debe tener al menos 2 caracteres")
      return
    }
    setNameError(undefined)
    fd.set("plan", selectedPlan)
    fd.set("planId", selectedPlanId === 'none' ? 'null' : selectedPlanId)
    fd.set("is_active", selectedActive)
    startTransition(() => formAction(fd))
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon-sm" className="text-muted-foreground hover:text-foreground">
          <Pencil className="size-3.5" />
          <span className="sr-only">Editar {tenant.name}</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Editar tenant</DialogTitle>
          <DialogDescription>
            Modifica el nombre, plan o estado de <span className="font-medium text-foreground">{tenant.name}</span>.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {state.status === "error" && (
            <div className="flex items-start gap-2.5 rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
              <AlertCircle className="mt-0.5 size-4 shrink-0" />
              <span>{state.message}</span>
            </div>
          )}

          {state.status === "success" && (
            <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 px-4 py-3 text-sm text-emerald-600 dark:text-emerald-400">
              Cambios guardados correctamente.
            </div>
          )}

          <div className="space-y-1.5">
            <Label htmlFor={`edit-name-${tenant.tenant_id}`}>Nombre</Label>
            <Input
              id={`edit-name-${tenant.tenant_id}`}
              name="name"
              defaultValue={tenant.name}
              aria-invalid={!!nameError}
              disabled={isPending}
            />
            {nameError && <p className="text-xs text-destructive">{nameError}</p>}
          </div>

          {plans.length > 0 && (
            <div className="space-y-1.5">
              <Label>Plan configurado</Label>
              <Select value={selectedPlanId} onValueChange={setSelectedPlanId} disabled={isPending}>
                <SelectTrigger>
                  <SelectValue placeholder="Sin plan asignado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Sin plan</SelectItem>
                  {plans.filter((p) => p.isActive).map((p) => (
                    <SelectItem key={p.id} value={String(p.id)}>
                      {p.name}
                      {p.priceMonthly > 0 ? ` — $${p.priceMonthly}/mes` : ' — Gratis'}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Determina los límites de conversaciones, tokens y leads por mes.
              </p>
            </div>
          )}

          <div className="space-y-1.5">
            <Label>Estado</Label>
            <Select value={selectedActive} onValueChange={setSelectedActive} disabled={isPending}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="true">Activo</SelectItem>
                <SelectItem value="false">Inactivo</SelectItem>
              </SelectContent>
            </Select>
          </div>

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
              {isPending ? "Guardando…" : "Guardar cambios"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
