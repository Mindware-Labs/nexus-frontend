import Link from 'next/link'
import { redirect } from 'next/navigation'
import { ArrowLeft, Clock, MessageCircle, CalendarDays } from 'lucide-react'
import { getSessionUser } from '@/lib/session'
import { getConversation, type ConversationDetail } from '@/app/actions/customer'
import { RelevantToggle } from '@/components/panel/relevant-toggle'

export const metadata = { title: 'Conversación — Mindware Nexus' }

function fmtDuration(seconds: number) {
  if (seconds <= 0) return '—'
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return m > 0 ? `${m}m ${s}s` : `${s}s`
}

function Meta({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-2 rounded-lg border bg-card px-3 py-2">
      <span className="text-muted-foreground">{icon}</span>
      <div>
        <p className="text-[11px] text-muted-foreground">{label}</p>
        <p className="text-sm font-medium">{value}</p>
      </div>
    </div>
  )
}

export default async function ConversationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const user = await getSessionUser()
  if (!user || user.role !== 'customer') redirect('/login')

  const { id } = await params

  let convo: ConversationDetail
  try {
    convo = await getConversation(id)
  } catch (e) {
    if (e instanceof Error && (e.message === 'NEXT_REDIRECT' || 'digest' in e)) throw e
    return (
      <div className="p-6">
        <Link href="/panel/conversations" className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="size-4" /> Volver
        </Link>
        <p className="text-sm text-destructive">{e instanceof Error ? e.message : 'No se pudo cargar'}</p>
      </div>
    )
  }

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <div>
        <Link href="/panel/conversations" className="mb-3 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="size-4" /> Volver a conversaciones
        </Link>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-xl font-semibold text-foreground">Detalle de conversación</h1>
          <div className="flex items-center gap-2">
            <RelevantToggle id={convo.id} relevant={convo.isRelevant} withLabel />
            {convo.leadId && (
              <Link
                href={`/panel/leads/${convo.leadId}`}
                className="rounded-lg border border-nexus-purple/30 bg-nexus-purple/5 px-3 py-1.5 text-xs font-medium text-nexus-purple hover:bg-nexus-purple/10"
              >
                Ver lead generado →
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* CUS-22 — metadata */}
      <div className="grid gap-3 sm:grid-cols-3">
        <Meta icon={<CalendarDays className="size-4" />} label="Inicio" value={new Date(convo.startedAt).toLocaleString('es-MX')} />
        <Meta icon={<Clock className="size-4" />} label="Duración" value={fmtDuration(convo.durationSeconds)} />
        <Meta icon={<MessageCircle className="size-4" />} label="Mensajes" value={String(convo.messageCount)} />
      </div>

      <div className="rounded-xl border bg-card p-5">
        <h2 className="mb-4 text-sm font-semibold">Transcripción completa</h2>
        <div className="space-y-3">
          {convo.transcript.length === 0 ? (
            <p className="text-sm text-muted-foreground">Sin mensajes.</p>
          ) : (
            convo.transcript.map((m, i) => {
              const isUser = m.role === 'user'
              return (
                <div key={i} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={[
                      'max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed whitespace-pre-wrap',
                      isUser ? 'bg-nexus-purple text-white rounded-br-sm' : 'bg-muted text-foreground rounded-bl-sm',
                    ].join(' ')}
                  >
                    <p className={`mb-1 text-[10px] font-semibold ${isUser ? 'text-white/60' : 'text-muted-foreground'}`}>
                      {isUser ? 'Visitante' : 'Asistente'}
                    </p>
                    {m.text}
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}
