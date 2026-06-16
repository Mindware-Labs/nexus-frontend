'use client'

import { useActionState } from 'react'
import { useFormStatus } from 'react-dom'
import { Check, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { changePasswordAction } from '@/app/actions/customer'

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" disabled={pending}>
      {pending ? <Loader2 className="size-4 animate-spin" /> : 'Cambiar contraseña'}
    </Button>
  )
}

export function PasswordForm() {
  const [state, formAction] = useActionState(changePasswordAction, null)

  return (
    <form action={formAction} className="space-y-4">
      <Field label="Contraseña actual" name="currentPassword" />
      <Field label="Nueva contraseña" name="newPassword" hint="Mínimo 8 caracteres" />
      <Field label="Confirmar nueva contraseña" name="confirmPassword" />

      {state?.error && <p className="text-sm text-destructive">{state.error}</p>}
      {state?.success && (
        <p className="flex items-center gap-1.5 text-sm text-emerald-600">
          <Check className="size-4" /> Contraseña actualizada.
        </p>
      )}

      <div className="flex justify-end">
        <SubmitButton />
      </div>
    </form>
  )
}

function Field({ label, name, hint }: { label: string; name: string; hint?: string }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium">{label}</span>
      <input
        type="password"
        name={name}
        required
        autoComplete="off"
        className="w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:border-nexus-purple sm:max-w-sm"
      />
      {hint && <span className="mt-1 block text-xs text-muted-foreground">{hint}</span>}
    </label>
  )
}
