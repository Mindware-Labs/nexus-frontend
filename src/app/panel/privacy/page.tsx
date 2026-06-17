import { redirect } from 'next/navigation'
import { AlertCircle, ExternalLink, Shield } from 'lucide-react'
import { getSessionUser } from '@/lib/session'
import { getCustomerPrivacySettings } from '@/app/actions/privacy'

export const metadata = { title: 'Política de Privacidad — Mindware Nexus' }

export default async function CustomerPrivacyPage() {
  const user = await getSessionUser()
  if (!user || user.role !== 'customer') redirect('/login')

  let settings = null
  let loadError: string | null = null
  try {
    settings = await getCustomerPrivacySettings()
  } catch (e) {
    if (e instanceof Error && (e.message === 'NEXT_REDIRECT' || 'digest' in e)) throw e
    loadError = e instanceof Error ? e.message : 'No se pudo cargar la política'
  }

  return (
    <div className="p-6 pb-12">
      <div className="max-w-3xl mx-auto flex flex-col gap-6">
        <div>
          <h1 className="flex items-center gap-2 text-xl font-semibold text-foreground">
            <Shield className="size-5 text-nexus-purple" />
            Política de Privacidad
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Configuración de privacidad aplicada a tu chatbot. Gestionada por el equipo de Mindware.
          </p>
        </div>

        {loadError && (
          <div className="flex items-start gap-2.5 rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
            <AlertCircle className="mt-0.5 size-4 shrink-0" />
            {loadError}
          </div>
        )}

        {settings && (
          <>
            {/* Aviso de consentimiento */}
            <section className="rounded-xl border bg-card p-5 space-y-3">
              <div>
                <h2 className="text-sm font-semibold">Aviso de consentimiento en el widget</h2>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  Texto que se muestra a tus usuarios antes de solicitar sus datos de contacto.
                </p>
              </div>
              {settings.consentText ? (
                <div className="rounded-lg border bg-muted/30 p-4 text-sm text-foreground whitespace-pre-wrap leading-relaxed">
                  {settings.consentText}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground italic">Sin texto de consentimiento configurado.</p>
              )}
              {settings.privacyPolicyUrl && (
                <a
                  href={settings.privacyPolicyUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm text-nexus-purple hover:underline"
                >
                  <ExternalLink className="size-3.5" />
                  Ver política de privacidad completa
                </a>
              )}
            </section>

            {/* Texto completo */}
            {settings.policyText && (
              <section className="rounded-xl border bg-card p-5 space-y-3">
                <div>
                  <h2 className="text-sm font-semibold">Texto completo de la política</h2>
                </div>
                <div className="rounded-lg border bg-muted/20 p-4 text-sm text-foreground whitespace-pre-wrap leading-relaxed max-h-[600px] overflow-y-auto">
                  {settings.policyText}
                </div>
              </section>
            )}

            {/* Retención */}
            <section className="rounded-xl border bg-card p-5 space-y-3">
              <div>
                <h2 className="text-sm font-semibold">Retención de datos</h2>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  Períodos máximos de conservación de datos en la plataforma.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-lg border bg-muted/20 px-4 py-3">
                  <p className="text-xs text-muted-foreground">Conversaciones</p>
                  <p className="mt-0.5 text-lg font-semibold text-foreground">
                    {settings.retentionMonthsConversations}
                    <span className="ml-1 text-sm font-normal text-muted-foreground">meses</span>
                  </p>
                </div>
                <div className="rounded-lg border bg-muted/20 px-4 py-3">
                  <p className="text-xs text-muted-foreground">Leads / Contactos</p>
                  <p className="mt-0.5 text-lg font-semibold text-foreground">
                    {settings.retentionMonthsLeads}
                    <span className="ml-1 text-sm font-normal text-muted-foreground">meses</span>
                  </p>
                </div>
              </div>
            </section>

            {settings.updatedAt && (
              <p className="text-xs text-muted-foreground">
                Última actualización por Mindware:{' '}
                {new Date(settings.updatedAt).toLocaleString('es', { dateStyle: 'medium', timeStyle: 'short' })}
              </p>
            )}
          </>
        )}
      </div>
    </div>
  )
}
