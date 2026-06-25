const SANS = "var(--font-hanken, 'Hanken Grotesk', system-ui, sans-serif)"
const MONO = "var(--font-geist-mono, ui-monospace, monospace)"

const AREA_DATA = [2,3,1,4,2,5,3,4,6,4,3,5,4,7,5,6,4,5,7,6,8,5,7,6,9,7,5,8,6,9]

function areaPaths(data: number[], w: number, h: number) {
  const max = Math.max(...data)
  const min = Math.min(...data)
  const range = max - min || 1
  const pts = data.map((v, i) => ({
    x: (i / (data.length - 1)) * w,
    y: 8 + ((max - v) / range) * (h - 16),
  }))
  const line = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ')
  const area = `${line} L ${w} ${h} L 0 ${h} Z`
  return { line, area, pts }
}

export function AreaChartCard() {
  const W = 540; const H = 90
  const { line, area, pts } = areaPaths(AREA_DATA, W, H)
  const xLabels = ['hace 30 d', 'hace 20 d', 'hace 10 d', 'hoy']
  const xPos    = [0, W / 3, (W * 2) / 3, W]

  return (
    <div className="nx-card p-5 flex flex-col gap-4" style={{ fontFamily: SANS }}>
      {/* Header */}
      <div className="flex items-center justify-between gap-2">
        <div>
          <p className="text-[14px] font-bold" style={{ color: 'var(--nx-text)' }}>
            Actividad de conversaciones
          </p>
          <p className="mt-0.5 text-[11px]" style={{ color: 'var(--nx-text-3)', fontFamily: MONO }}>
            Últimos 30 días
          </p>
        </div>
        <span
          className="flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold"
          style={{ background: 'var(--nx-accent-soft)', color: 'var(--nx-accent)' }}
        >
          <span className="size-1.5 rounded-full" style={{ background: 'var(--nx-accent)' }} />
          Conversaciones
        </span>
      </div>

      {/* Chart */}
      <svg
        viewBox={`0 0 ${W} ${H + 22}`}
        className="w-full"
        style={{ display: 'block', overflow: 'visible' }}
      >
        <defs>
          <linearGradient id="ag" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#522566" stopOpacity="0.14" />
            <stop offset="100%" stopColor="#522566" stopOpacity="0"    />
          </linearGradient>
          <clipPath id="ar">
            <rect x="0" y="0" width={W} height={H + 22}>
              <animate attributeName="width" from="0" to={W} dur="1.3s" fill="freeze" />
            </rect>
          </clipPath>
        </defs>

        {/* Grid lines */}
        {[0.33, 0.66, 1].map((t, i) => (
          <line key={i}
            x1="0"  y1={8 + (1 - t) * (H - 16)}
            x2={W}  y2={8 + (1 - t) * (H - 16)}
            stroke="var(--nx-border)" strokeWidth="1" strokeDasharray="4 4"
          />
        ))}

        <g clipPath="url(#ar)">
          <path d={area} fill="url(#ag)" />
          <path d={line} fill="none" stroke="#522566" strokeWidth="2"
            strokeLinecap="round" strokeLinejoin="round" />
          {pts.slice(-1).map((p, i) => (
            <circle key={i} cx={p.x} cy={p.y} r="3.5" fill="#522566" stroke="white" strokeWidth="2" />
          ))}
        </g>

        {xLabels.map((lbl, i) => (
          <text key={i} x={xPos[i]} y={H + 18}
            textAnchor={i === 0 ? 'start' : i === xLabels.length - 1 ? 'end' : 'middle'}
            fontSize="10" fill="var(--nx-text-3)" fontFamily={MONO}
          >
            {lbl}
          </text>
        ))}
      </svg>
    </div>
  )
}
