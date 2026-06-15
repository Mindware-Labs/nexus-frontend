"use client"

import { startTransition, useActionState, useEffect, useRef, useState } from "react"
import { AlertCircle, Building2, CheckCircle2, Loader2, Plus } from "lucide-react"
import { createTenantAction, type TenantActionState } from "@/app/actions/tenants"
import { CreateTenantSchema, PLAN_LABELS, TENANT_PLANS } from "@/lib/schemas/tenants"
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

type FieldErrors = { name?: string; plan?: string }

export function AddTenantDialog() {
  const [open, setOpen] = useState(false)
  const [state, formAction, isPending] = useActionState<TenantActionState, FormData>(
    createTenantAction,
    { status: "idle" },
  )
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const [selectedPlan, setSelectedPlan] = useState<string>("trial")
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    if (state.status === "success") {
      formRef.current?.reset()
      setFieldErrors({})
      setSelectedPlan("trial")
      const timer = setTimeout(() => setOpen(false), 1800)
      return () => clearTimeout(timer)
    }
  }, [state])

  useEffect(() => {
    if (!open) {
      setFieldErrors({})
      setSelectedPlan("trial")
    }
  }, [open])

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    fd.set("plan", selectedPlan)

    const result = CreateTenantSchema.safeParse({
      name: fd.get("name"),
      plan: fd.get("plan"),
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

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-1.5 bg-nexus-purple text-white hover:bg-nexus-purple/85 shadow-sm shadow-nexus-purple/30">
          <Plus className="size-4" />
          Nuevo tenant
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mb-3 flex size-10 items-center justify-center rounded-xl bg-nexus-purple/10">
            <Building2 className="size-5 text-nexus-purple" />
          </div>
          <DialogTitle>Crear nuevo tenant</DialogTitle>
          <DialogDescription>
            Un tenant representa una organización cliente dentro de la plataforma.
            El slug se genera automáticamente a partir del nombre.
          </DialogDescription>
        </DialogHeader>

        {isSuccess ? (
          <div className="flex flex-col items-center gap-3 py-4 text-center">
            <div className="flex size-12 items-center justify-center rounded-full bg-emerald-500/10">
              <CheckCircle2 className="size-6 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <p className="font-medium text-foreground">¡Tenant creado exitosamente!</p>
              <p className="mt-1 text-sm text-muted-foreground">
                <span className="font-medium text-foreground">
                  {(state as { status: "success"; tenantName: string }).tenantName}
                </span>{" "}
                ya está disponible en la plataforma.
              </p>
            </div>
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
              <Label htmlFor="tenant-name">Nombre de la organización</Label>
              <Input
                id="tenant-name"
                name="name"
                type="text"
                placeholder="Acme Corp"
                autoComplete="off"
                aria-invalid={!!fieldErrors.name}
                disabled={isPending}
              />
              {fieldErrors.name && (
                <p className="text-xs text-destructive">{fieldErrors.name}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="tenant-plan">Plan</Label>
              <Select
                value={selectedPlan}
                onValueChange={setSelectedPlan}
                disabled={isPending}
              >
                <SelectTrigger id="tenant-plan" aria-invalid={!!fieldErrors.plan}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TENANT_PLANS.map((plan) => (
                    <SelectItem key={plan} value={plan}>
                      {PLAN_LABELS[plan]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {fieldErrors.plan && (
                <p className="text-xs text-destructive">{fieldErrors.plan}</p>
              )}
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
                {isPending ? "Creando…" : "Crear tenant"}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
