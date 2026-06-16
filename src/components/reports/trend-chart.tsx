import type { TrendPoint } from '@/app/actions/reports'

interface TrendChartProps {
  data: TrendPoint[]
  height?: number
}

const W = 600
const H = 160
const PAD = { top: 12, right: 16, bottom: 32, left: 32 }

function formatLabel(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00')
  return d.toLocaleDateString('es-MX', { month: 'short', day: 'numeric' })
}

function points(
  data: TrendPoint[],
  key: 'conversations' | 'leads',
  maxVal: number,
): string {
  if (!data.length) return ''
  const innerW = W - PAD.left - PAD.right
  const innerH = H - PAD.top - PAD.bottom
  return data
    .map((d, i) => {
      const x = PAD.left + (i / Math.max(data.length - 1, 1)) * innerW
      const y = PAD.top + innerH - (maxVal > 0 ? (d[key] / maxVal) * innerH : 0)
      return `${x},${y}`
    })
    .join(' ')
}

function areaPath(
  data: TrendPoint[],
  key: 'conversations' | 'leads',
  maxVal: number,
): string {
  if (!data.length) return ''
  const innerW = W - PAD.left - PAD.right
  const innerH = H - PAD.top - PAD.bottom
  const baseline = PAD.top + innerH

  const pts = data.map((d, i) => {
    const x = PAD.left + (i / Math.max(data.length - 1, 1)) * innerW
    const y = PAD.top + innerH - (maxVal > 0 ? (d[key] / maxVal) * innerH : 0)
    return { x, y }
  })

  const firstX = pts[0]?.x ?? PAD.left
  const lastX = pts[pts.length - 1]?.x ?? PAD.left + innerW

  const lineStr = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ')
  return `${lineStr} L${lastX},${baseline} L${firstX},${baseline} Z`
}

export function TrendChart({ data, height = H }: TrendChartProps) {
  if (!data.length) {
    return (
      <div
        className="flex items-center justify-center rounded-xl border bg-muted/20 text-sm text-muted-foreground"
        style={{ height }}
      >
        Sin datos para el período seleccionado
      </div>
    )
  }

  const maxConv = Math.max(...data.map((d) => d.conversations), 1)
  const maxLeads = Math.max(...data.map((d) => d.leads), 1)
  const maxVal = Math.max(maxConv, maxLeads)

  // Show at most 10 labels to avoid overlap
  const labelStep = Math.ceil(data.length / 10)
  const innerH = H - PAD.top - PAD.bottom

  const gridLines = 4
  const gridValues = Array.from({ length: gridLines + 1 }, (_, i) =>
    Math.round((maxVal / gridLines) * i),
  )

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="w-full"
      style={{ height }}
      role="img"
      aria-label="Gráfica de tendencia de conversaciones y leads"
    >
      {/* Grid lines */}
      {gridValues.map((v, i) => {
        const y = PAD.top + innerH - (maxVal > 0 ? (v / maxVal) * innerH : 0)
        return (
          <g key={i}>
            <line
              x1={PAD.left}
              y1={y}
              x2={W - PAD.right}
              y2={y}
              stroke="currentColor"
              strokeOpacity={0.07}
              strokeWidth={1}
            />
            <text x={PAD.left - 4} y={y + 4} textAnchor="end" fontSize={9} fill="currentColor" opacity={0.4}>
              {v}
            </text>
          </g>
        )
      })}

      {/* Area: conversations */}
      <path
        d={areaPath(data, 'conversations', maxVal)}
        fill="#522566"
        fillOpacity={0.08}
      />

      {/* Area: leads */}
      <path
        d={areaPath(data, 'leads', maxVal)}
        fill="#34d399"
        fillOpacity={0.12}
      />

      {/* Line: conversations */}
      <polyline
        points={points(data, 'conversations', maxVal)}
        fill="none"
        stroke="#522566"
        strokeWidth={2}
        strokeLinejoin="round"
        strokeLinecap="round"
      />

      {/* Line: leads */}
      <polyline
        points={points(data, 'leads', maxVal)}
        fill="none"
        stroke="#34d399"
        strokeWidth={2}
        strokeDasharray="4 2"
        strokeLinejoin="round"
        strokeLinecap="round"
      />

      {/* X axis labels */}
      {data.map((d, i) => {
        if (i % labelStep !== 0 && i !== data.length - 1) return null
        const x = PAD.left + (i / Math.max(data.length - 1, 1)) * (W - PAD.left - PAD.right)
        return (
          <text
            key={i}
            x={x}
            y={H - 6}
            textAnchor="middle"
            fontSize={9}
            fill="currentColor"
            opacity={0.45}
          >
            {formatLabel(d.date)}
          </text>
        )
      })}
    </svg>
  )
}

export function ChartLegend() {
  return (
    <div className="flex items-center gap-4 text-xs text-muted-foreground">
      <span className="flex items-center gap-1.5">
        <span className="inline-block h-0.5 w-5 rounded bg-nexus-purple" />
        Conversaciones
      </span>
      <span className="flex items-center gap-1.5">
        <span className="inline-block h-0.5 w-5 rounded bg-nexus-mint border-dashed" />
        Leads
      </span>
    </div>
  )
}
