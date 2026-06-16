import Link from 'next/link'
import { redirect } from 'next/navigation'
import { ArrowLeft, Mail, Phone, Building2, Sparkles } from 'lucide-react'
import { getSessionUser } from '@/lib/session'
import { getLead, type LeadDetail, type LeadStatus } from '@/app/actions/customer'
import { LeadStatusSelect } from '@/components/panel/lead-status-select'
import { LeadNotes } from '@/components/panel/lead-notes'

export const metadata = { title: 'Detalle de lead — Mindware Nexus' }

function Field({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-2.5">
      <span className="mt-0.5 text-muted-foreground">{icon}</span>
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-medium text-foreground">{value || '—'}</p>
      </div>
    </div>
  )
}

export default async function LeadDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const user = await getSessionUser()
  if (!user || user.role !== 'customer') redirect('/login')

  const { id } = await params

  let lead: LeadDetail
  try {
    lead = await getLead(id)
  } catch (e) {
    if (e instanceof Error && (e.message === 'NEXT_REDIRECT' || 'digest' in e)) throw e
    return (
      <div className="p-6">
        <Link href="/panel/leads" className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="size-4" /> Volver a leads
        </Link>
        <p className="text-sm text-destructive">{e instanceof Error ? e.message : 'No se pudo cargar el lead'}</p>
      </div>
    )
  }

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <div>
        <Link href="/panel/leads" className="mb-3 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="size-4" /> Volver a leads
        </Link>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-semibold text-foreground">{lead.name || 'Lead sin nombre'}</h1>
            <p className="mt-0.5 text-sm text-muted-foreground">
              Capturado el {new Date(lead.created_at).toLocaleString('es-MX')}
            </p>
          </div>
          <div className="flex items-center gap-3">
            {lead.score != null && (
              <span className="rounded-full border border-nexus-lavender/40 bg-nexus-lavender/10 px-3 py-1 text-xs font-semibold text-nexus-purple">
                Score {lead.score}/100 · {lead.classification ?? 'Sin clasificar'}
              </span>
            )}
            <LeadStatusSelect id={lead.id} status={lead.status as LeadStatus} />
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          {/* Resumen */}
          <div className="rounded-xl border bg-card p-5">
            <h2 className="mb-3 text-sm font-semibold">Resumen ejecutivo</h2>
            <p className="text-sm leading-relaxed text-muted-foreground whitespace-pre-wrap">
              {lead.summary || 'No disponible.'}
            </p>
            {lead.next_action && (
              <div className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 p-3">
                <p className="text-xs font-semibold text-emerald-700">Siguiente acción recomendada</p>
                <p className="mt-0.5 text-sm text-emerald-900">{lead.next_action}</p>
              </div>
            )}
          </div>

          {/* Scoring breakdown */}
          {lead.scoring_breakdown && lead.scoring_breakdown.length > 0 && (
            <div className="rounded-xl border bg-card p-5">
              <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold">
                <Sparkles className="size-4 text-nexus-purple" /> Calificación por criterio
              </h2>
              <ul className="space-y-3">
                {lead.scoring_breakdown.map((c, i) => (
                  <li key={i}>
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">{c.criterion}</span>
                      <span className={c.met ? 'text-emerald-600' : 'text-muted-foreground'}>
                        {c.earned}/{c.maxScore}
                      </span>
                    </div>
                    <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-nexus-purple"
                        style={{ width: `${c.maxScore ? (c.earned / c.maxScore) * 100 : 0}%` }}
                      />
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">{c.evidence}</p>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* CUS-15 — transcripción completa */}
          <div className="rounded-xl border bg-card p-5">
            <h2 className="mb-4 text-sm font-semibold">Conversación origen</h2>
            <div className="space-y-3">
              {lead.transcript.length === 0 ? (
                <p className="text-sm text-muted-foreground">Sin transcripción.</p>
              ) : (
                lead.transcript.map((m, i) => {
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

        <div className="space-y-6">
          {/* Datos de contacto */}
          <div className="rounded-xl border bg-card p-5">
            <h2 className="mb-4 text-sm font-semibold">Datos de contacto</h2>
            <div className="space-y-3">
              <Field icon={<Mail className="size-4" />} label="Email" value={lead.email ?? ''} />
              <Field icon={<Phone className="size-4" />} label="Teléfono" value={lead.phone ?? ''} />
              <Field icon={<Building2 className="size-4" />} label="Empresa" value={lead.company ?? ''} />
            </div>
            {(lead.qualified_needs || lead.budget || lead.urgency || lead.timeline) && (
              <div className="mt-4 space-y-2 border-t pt-4 text-sm">
                {lead.qualified_needs && <p><span className="text-muted-foreground">Necesidad: </span>{lead.qualified_needs}</p>}
                {lead.budget && <p><span className="text-muted-foreground">Presupuesto: </span>{lead.budget}</p>}
                {lead.urgency && <p><span className="text-muted-foreground">Urgencia: </span>{lead.urgency}</p>}
                {lead.timeline && <p><span className="text-muted-foreground">Plazo: </span>{lead.timeline}</p>}
              </div>
            )}
          </div>

          {/* CUS-17 — notas internas */}
          <div className="rounded-xl border bg-card p-5">
            <h2 className="mb-3 text-sm font-semibold">Notas internas</h2>
            <LeadNotes id={lead.id} initialNotes={lead.notes} />
          </div>
        </div>
      </div>
    </div>
  )
}
