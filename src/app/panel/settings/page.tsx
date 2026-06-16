import { redirect } from 'next/navigation'
import { AlertCircle, Bell, KeyRound } from 'lucide-react'
import { getSessionUser } from '@/lib/session'
import { getBotConfig, type CustomerBotConfig } from '@/app/actions/customer'
import { NotificationsForm } from '@/components/panel/notifications-form'
import { PasswordForm } from '@/components/panel/password-form'

export const metadata = { title: 'Notificaciones y cuenta — Mindware Nexus' }

export default async function SettingsPage() {
  const user = await getSessionUser()
  if (!user || user.role !== 'customer') redirect('/login')

  let config: CustomerBotConfig | null = null
  let loadError: string | null = null
  try {
    config = await getBotConfig()
  } catch (e) {
    if (e instanceof Error && (e.message === 'NEXT_REDIRECT' || 'digest' in e)) throw e
    loadError = e instanceof Error ? e.message : 'No se pudo cargar la configuración'
  }

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <div>
        <h1 className="flex items-center gap-2 text-xl font-semibold text-foreground">
          <Bell className="size-5 text-nexus-purple" />
          Notificaciones y cuenta
        </h1>
        <p className="mt-0.5 text-sm text-muted-foreground">Preferencias de email y seguridad</p>
      </div>

      {loadError && (
        <div className="flex items-start gap-2.5 rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          <AlertCircle className="mt-0.5 size-4 shrink-0" />
          {loadError}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        {config && (
          <div className="rounded-xl border bg-card">
            <div className="border-b px-5 py-4">
              <h2 className="flex items-center gap-2 text-sm font-semibold">
                <Bell className="size-4 text-nexus-purple" /> Notificaciones
              </h2>
            </div>
            <div className="p-5">
              <NotificationsForm config={config} />
            </div>
          </div>
        )}

        <div className="rounded-xl border bg-card">
          <div className="border-b px-5 py-4">
            <h2 className="flex items-center gap-2 text-sm font-semibold">
              <KeyRound className="size-4 text-nexus-purple" /> Cambiar contraseña
            </h2>
          </div>
          <div className="p-5">
            <PasswordForm />
          </div>
        </div>
      </div>
    </div>
  )
}
