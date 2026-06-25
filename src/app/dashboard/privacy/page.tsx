import { redirect } from 'next/navigation'
import { ArrowRight, Shield, Sparkles } from 'lucide-react'
import { getSessionUser } from '@/lib/session'
import { getPrivacySettings } from '@/app/actions/privacy'
import { PrivacyForm } from './_form'

export const metadata = { title: 'Politica de Privacidad - Mindware Nexus' }

const FONT = "'Hanken Grotesk', system-ui, sans-serif"

export default async function PrivacyPage() {
  const user = await getSessionUser()
  if (!user || user.role !== 'owner') redirect('/login')

  let settings = null
  let loadError: string | null = null
  try {
    settings = await getPrivacySettings()
  } catch (e) {
    if (e instanceof Error && (e.message === 'NEXT_REDIRECT' || 'digest' in e)) throw e
    loadError = e instanceof Error ? e.message : 'No se pudo cargar la configuracion'
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] px-3 py-3 sm:px-4 sm:py-4" style={{ fontFamily: FONT }}>
      <div className="flex min-h-[calc(100vh-6rem)] flex-col gap-4">
        <section className="relative overflow-hidden rounded-[2rem] border border-[#D7C2E4] bg-[linear-gradient(135deg,#3D1A4E_0%,#522566_58%,#6B3486_100%)] px-6 py-6 text-white shadow-[0_30px_80px_rgba(61,26,78,0.22)] sm:px-8 sm:py-7">
          <div aria-hidden className="absolute inset-y-0 right-[-10%] w-[40%] rounded-full bg-white/10 blur-3xl" />
          <div aria-hidden className="absolute bottom-[-25%] left-[12%] size-52 rounded-full bg-[#AD74C3]/20 blur-3xl" />

          <div className="relative grid gap-5 xl:grid-cols-[minmax(0,1.45fr)_minmax(320px,0.95fr)] xl:items-end">
            <div className="max-w-4xl">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] font-semibold tracking-[0.18em] uppercase text-white/85 backdrop-blur-sm">
                <Sparkles className="size-3.5" />
                Centro de privacidad Nexus
              </div>
              <h1 className="flex items-center gap-3 text-3xl font-bold tracking-tight sm:text-4xl xl:text-[2.65rem]">
                <span className="flex size-12 items-center justify-center rounded-2xl border border-white/15 bg-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.16)]">
                  <Shield className="size-6 text-[#F8EDFB]" />
                </span>
                Politica de privacidad global
              </h1>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-white/80 sm:text-[15px]">
                Esta configuracion se propaga a <strong>todos los chatbots</strong> de la plataforma.
                El consentimiento alimenta el widget y el prompt base; la politica completa queda disponible
                para consulta y cumplimiento operativo.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3 xl:grid-cols-1">
              <HeroChip title="Cobertura" value="Global" copy="Unifica todos los bots activos." />
              <HeroChip title="Modulos" value="DAT-01 / DAT-02" copy="Retencion y consentimiento." />
              <HeroChip title="Resultado" value="Cumplimiento" copy="Texto visible y trazable." />
            </div>
          </div>
        </section>

        {loadError && (
          <div className="rounded-2xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
            {loadError}
          </div>
        )}

        {settings && <PrivacyForm settings={settings} />}
      </div>
    </div>
  )
}

function HeroChip({
  title,
  value,
  copy,
}: {
  title: string
  value: string
  copy: string
}) {
  return (
    <div className="rounded-2xl border border-white/12 bg-white/10 px-4 py-3 backdrop-blur-sm xl:min-h-[94px]">
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/58">{title}</p>
      <div className="mt-2 flex items-center gap-2">
        <p className="text-sm font-semibold text-white">{value}</p>
        <ArrowRight className="size-3.5 text-white/40" />
      </div>
      <p className="mt-1 text-xs leading-5 text-white/68">{copy}</p>
    </div>
  )
}
