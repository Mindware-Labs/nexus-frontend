'use client'

import { useState } from 'react'
import { useFormStatus } from 'react-dom'
import { Building2, ImagePlus, Loader2, Tag, X } from 'lucide-react'
import { saveCompanyAction, uploadLogoAction, type CustomerBotConfig } from '@/app/actions/customer'
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
      {pending ? <Loader2 className="size-4 animate-spin" /> : 'Guardar empresa'}
    </button>
  )
}

function FieldInput({
  label,
  icon: Icon,
  hint,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
  label: string
  icon?: React.ComponentType<{ className?: string }>
  hint?: string
}) {
  return (
    <div>
      <label className="mb-1.5 block text-[13px] font-semibold text-[#374151]">{label}</label>
      <div className="relative">
        {Icon && (
          <Icon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-[#A18AAF]" />
        )}
        <input
          className={cn(
            'h-11 w-full rounded-xl border-2 border-[#E5D5F0] bg-[#FDFAFF] text-[13px] text-[#111827]',
            'placeholder:text-[#C3AECD] outline-none transition-all',
            'focus:border-[#AD74C3] focus:shadow-[0_0_0_3px_rgba(173,116,195,0.10)]',
            Icon ? 'pl-10 pr-4' : 'px-4',
          )}
          style={{ fontFamily: FONT }}
          {...props}
        />
      </div>
      {hint && <p className="mt-1 text-[11px] text-[#A18AAF]">{hint}</p>}
    </div>
  )
}

export function CompanyForm({ config }: { config: CustomerBotConfig }) {
  const [logoUrl, setLogoUrl]     = useState<string | null | undefined>(config.tenantLogoUrl)
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    setUploadError(null)
    try {
      const fd = new FormData()
      fd.append('file', file)
      const { avatarUrl } = await uploadLogoAction(fd)
      setLogoUrl(avatarUrl)
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : 'Error al subir el logotipo')
    }
    setUploading(false)
  }

  return (
    <form action={saveCompanyAction} className="space-y-5" style={{ fontFamily: FONT }}>
      <input type="hidden" name="logoUrl" value={logoUrl ?? ''} />

      {/* Logo upload */}
      <div>
        <span className="mb-2 block text-[13px] font-semibold text-[#374151]">Logotipo de la empresa</span>
        <div className="flex items-center gap-4">
          {/* Preview */}
          <div className="relative flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl border-2 border-[#E5D5F0] bg-[#F8EDFB]">
            {logoUrl ? (
              <>
                <img src={logoUrl} alt="logo" className="size-full object-contain p-1" />
                <button
                  type="button"
                  onClick={() => setLogoUrl(null)}
                  className="absolute right-0.5 top-0.5 flex size-5 items-center justify-center rounded-full bg-[#FB7185] text-white shadow hover:bg-[#E11D48]"
                  aria-label="Quitar logo"
                >
                  <X className="size-3" />
                </button>
              </>
            ) : (
              <Building2 className="size-7 text-[#C3AECD]" />
            )}
          </div>

          {/* Upload btn */}
          <label
            className={cn(
              'inline-flex cursor-pointer items-center gap-2 rounded-xl border-2 border-dashed border-[#D4B8E8] bg-[#FDFAFF] px-5 py-3 text-[13px] font-semibold text-[#7C6589] transition-all',
              'hover:border-[#AD74C3] hover:bg-[#F8EDFB] hover:text-[#522566]',
              uploading && 'pointer-events-none opacity-60'
            )}
          >
            {uploading
              ? <Loader2 className="size-4 animate-spin text-[#AD74C3]" />
              : <ImagePlus className="size-4" />}
            {uploading ? 'Subiendo…' : 'Subir logotipo'}
            <input type="file" accept="image/*" onChange={onFile} className="hidden" />
          </label>
        </div>
        {uploadError && (
          <p className="mt-2 flex items-center gap-1.5 text-[12px] text-[#BE123C]">
            <span className="h-1 w-1 rounded-full bg-[#FB7185]" />
            {uploadError}
          </p>
        )}
        <p className="mt-1.5 text-[11px] text-[#A18AAF]">PNG, JPG o SVG. Máximo 2 MB.</p>
      </div>

      <FieldInput
        label="Nombre de la empresa"
        name="name"
        defaultValue={config.tenantName ?? ''}
        required
        maxLength={120}
        placeholder="Ej. Acme Corp"
        icon={Building2}
      />

      <FieldInput
        label="Sector"
        name="sector"
        defaultValue={config.tenantSector ?? ''}
        maxLength={120}
        placeholder="Ej. Tecnología, Salud, Retail…"
        icon={Tag}
      />

      <div className="flex justify-end pt-1">
        <SubmitButton />
      </div>
    </form>
  )
}
