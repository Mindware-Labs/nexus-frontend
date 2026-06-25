import { redirect } from 'next/navigation'
import { AlertCircle, Bell, KeyRound, Mail, Shield } from 'lucide-react'
import { getSessionUser } from '@/lib/session'
import { getBotConfig, type CustomerBotConfig } from '@/app/actions/customer'
import { NotificationsForm } from '@/components/panel/notifications-form'
import { PasswordForm } from '@/components/panel/password-form'

export const metadata = { title: 'Notificaciones — Mindware Nexus' }

const FONT = "'Hanken Grotesk', system-ui, sans-serif"

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
    <div className="flex flex-1 flex-col gap-6 p-6" style={{ fontFamily: FONT }}>

      {/* Header */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-[#F0E6F8]">
            <Bell className="size-5 text-[#522566]" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-[#111827]">Notificaciones y cuenta</h1>
            <p className="text-[13px] text-[#8A7397]">Gestiona tus preferencias de email y seguridad</p>
          </div>
        </div>
      </div>

      {loadError && (
        <div className="flex items-start gap-2.5 rounded-2xl border border-[#FB7185]/30 bg-[#FFF1F2] px-4 py-3 text-sm text-[#BE123C]">
          <AlertCircle className="mt-0.5 size-4 shrink-0" />
          {loadError}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Notifications card */}
        {config && (
          <div className="rounded-2xl border border-[#EADCF3] bg-white shadow-[0_2px_12px_rgba(61,26,78,0.06)]">
            <div className="flex items-center gap-3 border-b border-[#F3EAF8] px-6 py-4">
              <div className="flex size-8 items-center justify-center rounded-xl bg-[#F0E6F8]">
                <Mail className="size-4 text-[#522566]" />
              </div>
              <div>
                <h2 className="text-[14px] font-bold text-[#111827]">Notificaciones por email</h2>
                <p className="text-[12px] text-[#8A7397]">Elige cuándo y cómo recibirás alertas</p>
              </div>
            </div>
            <div className="p-6">
              <NotificationsForm config={config} />
            </div>
          </div>
        )}

        {/* Password card */}
        <div className="rounded-2xl border border-[#EADCF3] bg-white shadow-[0_2px_12px_rgba(61,26,78,0.06)]">
          <div className="flex items-center gap-3 border-b border-[#F3EAF8] px-6 py-4">
            <div className="flex size-8 items-center justify-center rounded-xl bg-[#F0E6F8]">
              <Shield className="size-4 text-[#522566]" />
            </div>
            <div>
              <h2 className="text-[14px] font-bold text-[#111827]">Seguridad de cuenta</h2>
              <p className="text-[12px] text-[#8A7397]">Actualiza tu contraseña periódicamente</p>
            </div>
          </div>
          <div className="p-6">
            <PasswordForm />
          </div>
        </div>
      </div>

      {/* Info strip */}
      <div className="rounded-2xl border border-[#EADCF3] bg-[#FDFAFF] px-6 py-4">
        <div className="flex items-start gap-3">
          <KeyRound className="mt-0.5 size-4 shrink-0 text-[#AD74C3]" />
          <p className="text-[13px] text-[#7C6589]">
            Las notificaciones se envían al correo registrado en tu cuenta.
            Si deseas enviarlas a otros emails, agrégalos en el campo de notificaciones.
          </p>
        </div>
      </div>
    </div>
  )
}
