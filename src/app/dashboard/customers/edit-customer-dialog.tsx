"use client"

import { startTransition, useActionState, useEffect, useState } from "react"
import { AlertCircle, Loader2, Pencil } from "lucide-react"
import { updateCustomerAction, type Customer, type CustomerActionState } from "@/app/actions/customers"
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

interface Props {
  customer: Customer
  tenantInactive?: boolean
}

export function EditCustomerDialog({ customer, tenantInactive = false }: Props) {
  const [open, setOpen] = useState(false)

  const boundAction = updateCustomerAction.bind(null, customer.id)
  const [state, formAction, isPending] = useActionState<CustomerActionState, FormData>(
    boundAction,
    { status: "idle" },
  )

  const [selectedActive, setSelectedActive] = useState(String(customer.is_active))
  const [nameError, setNameError] = useState<string | undefined>()
  const [emailError, setEmailError] = useState<string | undefined>()

  useEffect(() => {
    if (state.status === "success") {
      const timer = setTimeout(() => setOpen(false), 1200)
      return () => clearTimeout(timer)
    }
  }, [state])

  useEffect(() => {
    if (open) {
      setSelectedActive(String(customer.is_active))
      setNameError(undefined)
      setEmailError(undefined)
    }
  }, [open, customer])

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    const name = (fd.get("name") as string).trim()
    const email = (fd.get("email") as string).trim()

    let valid = true
    if (name.length < 2) {
      setNameError("El nombre debe tener al menos 2 caracteres")
      valid = false
    } else {
      setNameError(undefined)
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError("Correo electrónico inválido")
      valid = false
    } else {
      setEmailError(undefined)
    }
    if (!valid) return

    fd.set("isActive", selectedActive)
    startTransition(() => formAction(fd))
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon-sm" className="text-muted-foreground hover:text-foreground">
          <Pencil className="size-3.5" />
          <span className="sr-only">Editar {customer.name}</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Editar cliente</DialogTitle>
          <DialogDescription>
            Modifica los datos de <span className="font-medium text-foreground">{customer.name}</span>.
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

          {tenantInactive && (
            <div className="flex items-start gap-2.5 rounded-lg border border-amber-500/30 bg-amber-500/5 px-4 py-3 text-sm text-amber-700 dark:text-amber-400">
              <AlertCircle className="mt-0.5 size-4 shrink-0" />
              <span>
                El tenant de este cliente está inactivo. Aunque lo actives, no podrá iniciar sesión hasta que el tenant sea reactivado.
              </span>
            </div>
          )}

          <div className="space-y-1.5">
            <Label htmlFor={`edit-customer-name-${customer.id}`}>Nombre</Label>
            <Input
              id={`edit-customer-name-${customer.id}`}
              name="name"
              defaultValue={customer.name}
              aria-invalid={!!nameError}
              disabled={isPending}
            />
            {nameError && <p className="text-xs text-destructive">{nameError}</p>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor={`edit-customer-email-${customer.id}`}>Correo electrónico</Label>
            <Input
              id={`edit-customer-email-${customer.id}`}
              name="email"
              type="email"
              defaultValue={customer.email}
              aria-invalid={!!emailError}
              disabled={isPending}
            />
            {emailError && <p className="text-xs text-destructive">{emailError}</p>}
          </div>

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
