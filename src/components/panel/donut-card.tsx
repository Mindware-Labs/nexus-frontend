const SANS = "var(--font-hanken, 'Hanken Grotesk', system-ui, sans-serif)"
const MONO = "var(--font-geist-mono, ui-monospace, monospace)"

export function DonutCard({
  rate,
  leads,
  conversations,
}: {
  rate: number
  leads: number
  conversations: number
}) {
  const r    = 32
  const sw   = 8
  const circ = 2 * Math.PI * r
  const dash = (rate / 100) * circ

  return (
    <div className="nx-card p-4 flex flex-col gap-3" style={{ fontFamily: SANS }}>
      <p className="text-[13px] font-bold" style={{ color: 'var(--nx-text)' }}>Conversión del mes</p>

      <div className="flex items-center gap-4">
        {/* Ring */}
        <div className="relative shrink-0">
          <svg width="76" height="76" viewBox="0 0 76 76" style={{ overflow: 'visible' }}>
            <circle cx="38" cy="38" r={r} fill="none" stroke="var(--nx-border)" strokeWidth={sw} />
            <circle cx="38" cy="38" r={r} fill="none"
              stroke="#522566" strokeWidth={sw}
              strokeDasharray={`${dash.toFixed(1)} ${(circ - dash).toFixed(1)}`}
              strokeDashoffset={circ}
              strokeLinecap="round"
              transform="rotate(-90 38 38)"
            >
              <animate attributeName="stroke-dashoffset" from={circ} to="0" dur="1.1s" fill="freeze" />
            </circle>
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-[15px] font-bold" style={{ color: 'var(--nx-text)', fontFamily: MONO }}>
              {rate}%
            </span>
          </div>
        </div>

        {/* Stats */}
        <div className="flex flex-col gap-2">
          <div>
            <p className="text-[18px] font-bold leading-none" style={{ color: 'var(--nx-text)' }}>{leads}</p>
            <p className="text-[11px] mt-0.5" style={{ color: '#522566', fontFamily: MONO }}>leads captados</p>
          </div>
          <div>
            <p className="text-[18px] font-bold leading-none" style={{ color: 'var(--nx-text)' }}>{conversations}</p>
            <p className="text-[11px] mt-0.5" style={{ color: 'var(--nx-text-3)', fontFamily: MONO }}>conversaciones</p>
          </div>
        </div>
      </div>
    </div>
  )
}
