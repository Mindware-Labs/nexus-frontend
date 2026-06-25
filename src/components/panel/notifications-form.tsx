'use client'

import { useState } from 'react'
import { useFormStatus } from 'react-dom'
import { Loader2, Mail, Zap, CalendarClock } from 'lucide-react'
import { saveNotificationsAction, type CustomerBotConfig } from '@/app/actions/customer'
import { cn } from '@/lib/utils'

const FONT = "'Hanken Grotesk', system-ui, sans-serif"
const PURPLE = '#522566'
const LAVENDER = '#AD74C3'
const MINT = '#34D399'

function Toggle({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={onChange}
      className={cn(
        'relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors duration-200',
        checked ? 'bg-[#34D399]' : 'bg-[#D1D5DB]'
      )}
    >
      <span
        className={cn(
          'inline-block size-5 transform rounded-full bg-white shadow-md transition-transform duration-200',
          checked ? 'translate-x-5' : 'translate-x-0.5'
        )}
      />
    </button>
  )
}

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
      {pending ? <Loader2 className="size-4 animate-spin" /> : 'Guardar preferencias'}
    </button>
  )
}

const FREQ_OPTIONS = [
  { value: 'none',   label: 'No enviar',  desc: 'Sin resúmenes automáticos' },
  { value: 'daily',  label: 'Diario',     desc: 'Un resumen cada día'       },
  { value: 'weekly', label: 'Semanal',    desc: 'Un resumen cada semana'    },
]

export function NotificationsForm({ config }: { config: CustomerBotConfig }) {
  const [notifyOnLead, setNotifyOnLead] = useState(config.notifyOnLead)
  const [freq, setFreq] = useState(config.summaryFrequency)

  return (
    <form action={saveNotificationsAction} className="space-y-6" style={{ fontFamily: FONT }}>
      <input type="hidden" name="notifyOnLead" value={notifyOnLead ? 'true' : 'false'} />
      <input type="hidden" name="summaryFrequency" value={freq} />

      {/* Lead notification toggle */}
      <div className="flex items-start justify-between gap-4 rounded-2xl border border-[#EADCF3] bg-[#FDFAFF] p-4">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-xl bg-[#F0E6F8]">
            <Zap className="size-4 text-[#522566]" />
          </div>
          <div>
            <p className="text-[13px] font-semibold text-[#111827]">
              Alerta de lead capturado
            </p>
            <p className="mt-0.5 text-[12px] text-[#8A7397]">
              Recibe un email al instante cuando tu chatbot capture un nuevo lead.
            </p>
          </div>
        </div>
        <Toggle checked={notifyOnLead} onChange={() => setNotifyOnLead((v) => !v)} />
      </div>

      {/* Summary frequency */}
      <div>
        <div className="mb-3 flex items-center gap-2">
          <CalendarClock className="size-4 text-[#AD74C3]" />
          <span className="text-[13px] font-semibold text-[#374151]">Resumen de actividad</span>
        </div>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
          {FREQ_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setFreq(opt.value as typeof freq)}
              className={cn(
                'rounded-xl border p-3 text-left transition-all duration-150',
                freq === opt.value
                  ? 'border-[#AD74C3] bg-[#F8EDFB] shadow-[0_0_0_1px_rgba(173,116,195,0.3)]'
                  : 'border-[#EADCF3] bg-white hover:border-[#D4B8E8] hover:bg-[#FDFAFF]'
              )}
            >
              <p className={cn('text-[13px] font-semibold', freq === opt.value ? 'text-[#522566]' : 'text-[#374151]')}>
                {opt.label}
              </p>
              <p className="mt-0.5 text-[11px] text-[#9CA3AF]">{opt.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Notification emails */}
      <div>
        <div className="mb-2 flex items-center gap-2">
          <Mail className="size-4 text-[#AD74C3]" />
          <label className="text-[13px] font-semibold text-[#374151]">
            Emails adicionales de notificación
          </label>
        </div>
        <textarea
          name="notificationEmails"
          defaultValue={config.notificationEmails.join('\n')}
          rows={3}
          placeholder={"ventas@empresa.com\nmarketing@empresa.com"}
          className={cn(
            'w-full rounded-xl border-2 border-[#E5D5F0] bg-[#FDFAFF] p-3 text-[13px] text-[#111827]',
            'placeholder:text-[#C3AECD] outline-none resize-none transition-all',
            'focus:border-[#AD74C3] focus:shadow-[0_0_0_3px_rgba(173,116,195,0.10)]'
          )}
        />
        <p className="mt-1.5 text-[11px] text-[#A18AAF]">
          Uno por línea o separados por coma. Si está vacío se usa tu correo de cuenta.
        </p>
      </div>

      <div className="flex justify-end pt-1">
        <SubmitButton />
      </div>
    </form>
  )
}
