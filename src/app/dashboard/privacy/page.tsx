import { redirect } from 'next/navigation'
import { Shield } from 'lucide-react'
import { getSessionUser } from '@/lib/session'
import { getPrivacySettings } from '@/app/actions/privacy'
import { PrivacyForm } from './_form'

export const metadata = { title: 'Política de Privacidad — Mindware Nexus' }

export default async function PrivacyPage() {
  const user = await getSessionUser()
  if (!user || user.role !== 'owner') redirect('/login')

  let settings = null
  let loadError: string | null = null
  try {
    settings = await getPrivacySettings()
  } catch (e) {
    if (e instanceof Error && (e.message === 'NEXT_REDIRECT' || 'digest' in e)) throw e
    loadError = e instanceof Error ? e.message : 'No se pudo cargar la configuración'
  }

  return (
    <div className="p-6 pb-12">
      <div className="max-w-3xl mx-auto flex flex-col gap-6">
        <div>
          <h1 className="flex items-center gap-2 text-xl font-semibold text-foreground">
            <Shield className="size-5 text-nexus-purple" />
            Política de Privacidad Global
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Esta configuración se aplica a <strong>todos los chatbots</strong> de la plataforma.
            El texto de consentimiento se inyecta en el prompt de sistema de cada bot (DAT-01 / DAT-02).
          </p>
        </div>

        {loadError && (
          <div className="rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
            {loadError}
          </div>
        )}

        {settings && <PrivacyForm settings={settings} />}
      </div>
    </div>
  )
}
