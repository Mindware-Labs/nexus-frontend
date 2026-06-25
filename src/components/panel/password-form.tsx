'use client'

import { useActionState, useState } from 'react'
import { useFormStatus } from 'react-dom'
import { Check, Eye, EyeOff, Loader2, Lock } from 'lucide-react'
import { changePasswordAction } from '@/app/actions/customer'
import { cn } from '@/lib/utils'

const FONT = "'Hanken Grotesk', system-ui, sans-serif"

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className={cn(
        'flex items-center gap-2 rounded-xl px-5 py-2.5 text-[13px] font-semibold text-white transition-all',
        'bg-gradient-to-r from-[#522566] to-[#AD74C3]',
        'hover:shadow-[0_4px_16px_rgba(82,37,102,0.30)] hover:opacity-90',
        'disabled:opacity-60 disabled:cursor-not-allowed'
      )}
      style={{ fontFamily: FONT }}
    >
      {pending ? <Loader2 className="size-4 animate-spin" /> : 'Cambiar contraseña'}
    </button>
  )
}

function PasswordField({ label, name, hint }: { label: string; name: string; hint?: string }) {
  const [show, setShow] = useState(false)
  return (
    <div>
      <label className="mb-1.5 block text-[13px] font-semibold text-[#374151]">{label}</label>
      <div className="relative">
        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-[#A18AAF]" />
        <input
          type={show ? 'text' : 'password'}
          name={name}
          required
          autoComplete="off"
          className={cn(
            'h-11 w-full rounded-xl border-2 border-[#E5D5F0] bg-[#FDFAFF] pl-10 pr-10 text-[13px] text-[#111827]',
            'placeholder:text-[#C3AECD] outline-none transition-all',
            'focus:border-[#AD74C3] focus:shadow-[0_0_0_3px_rgba(173,116,195,0.10)]'
          )}
        />
        <button
          type="button"
          tabIndex={-1}
          onClick={() => setShow((v) => !v)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A18AAF] hover:text-[#522566] transition-colors"
          aria-label={show ? 'Ocultar' : 'Mostrar'}
        >
          {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
        </button>
      </div>
      {hint && <p className="mt-1 text-[11px] text-[#A18AAF]">{hint}</p>}
    </div>
  )
}

export function PasswordForm() {
  const [state, formAction] = useActionState(changePasswordAction, null)

  return (
    <form action={formAction} className="space-y-4" style={{ fontFamily: FONT }}>
      <PasswordField label="Contraseña actual" name="currentPassword" />
      <PasswordField label="Nueva contraseña" name="newPassword" hint="Mínimo 8 caracteres, usa mayúsculas y símbolos." />
      <PasswordField label="Confirmar nueva contraseña" name="confirmPassword" />

      {state?.error && (
        <div className="rounded-xl border border-[#FB7185]/30 bg-[#FFF1F2] px-4 py-3 text-[13px] text-[#BE123C]">
          {state.error}
        </div>
      )}

      {state?.success && (
        <div className="flex items-center gap-2 rounded-xl border border-[#6EE7B7] bg-[#ECFDF5] px-4 py-3 text-[13px] text-[#059669]">
          <Check className="size-4 shrink-0" />
          Contraseña actualizada correctamente.
        </div>
      )}

      <div className="flex justify-end pt-1">
        <SubmitButton />
      </div>
    </form>
  )
}
