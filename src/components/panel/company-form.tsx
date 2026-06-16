'use client'

import { useState } from 'react'
import { useFormStatus } from 'react-dom'
import { Loader2, Upload } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { saveCompanyAction, uploadLogoAction, type CustomerBotConfig } from '@/app/actions/customer'

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" disabled={pending}>
      {pending ? <Loader2 className="size-4 animate-spin" /> : 'Guardar empresa'}
    </Button>
  )
}

export function CompanyForm({ config }: { config: CustomerBotConfig }) {
  const [logoUrl, setLogoUrl] = useState(config.tenantLogoUrl)
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
    <form action={saveCompanyAction} className="space-y-5">
      <input type="hidden" name="logoUrl" value={logoUrl} />

      <label className="block">
        <span className="mb-1.5 block text-sm font-medium">Nombre de la empresa</span>
        <input
          name="name"
          defaultValue={config.tenantName ?? ''}
          required
          maxLength={120}
          className="w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:border-nexus-purple sm:max-w-md"
        />
      </label>

      <label className="block">
        <span className="mb-1.5 block text-sm font-medium">Sector</span>
        <input
          name="sector"
          defaultValue={config.tenantSector}
          maxLength={120}
          placeholder="Ej. Tecnología, Salud, Retail…"
          className="w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:border-nexus-purple sm:max-w-md"
        />
      </label>

      <div>
        <span className="mb-1.5 block text-sm font-medium">Logotipo</span>
        <div className="flex items-center gap-3">
          {logoUrl ? (
            <img src={logoUrl} alt="logo" className="size-12 rounded-lg border object-contain" />
          ) : (
            <div className="grid size-12 place-items-center rounded-lg border bg-muted text-xs text-muted-foreground">Logo</div>
          )}
          <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border bg-background px-3 py-1.5 text-xs font-medium hover:bg-muted">
            {uploading ? <Loader2 className="size-3.5 animate-spin" /> : <Upload className="size-3.5" />}
            Subir logotipo
            <input type="file" accept="image/*" onChange={onFile} className="hidden" />
          </label>
        </div>
        {uploadError && <p className="mt-1 text-xs text-destructive">{uploadError}</p>}
      </div>

      <div className="flex justify-end">
        <SubmitButton />
      </div>
    </form>
  )
}
