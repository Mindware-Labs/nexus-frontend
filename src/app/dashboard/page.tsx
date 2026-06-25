import { redirect } from "next/navigation"
import {
  ArrowUpRight,
  ArrowDownRight,
  Bot,
  MessageSquare,
  MoreVertical,
  Users,
  TrendingUp,
  Zap,
  CreditCard,
  ChevronRight,
  CheckCircle2,
  Clock,
  XCircle,
  Sparkles,
} from "lucide-react"
import { getSessionUser } from "@/lib/session"
import { cn } from "@/lib/utils"

const FONT = "'Hanken Grotesk', system-ui, sans-serif"

/* ── Types ── */
type MetricCard = {
  title: string
  value: string
  change: number
  changeLabel: string
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>
  iconBg: string
  iconColor: string
  accent: string
  bars: number[]
}

type Lead = {
  name: string
  company: string
  score: number
  status: "Alta" | "Media" | "Baja" | "Nuevo"
  date: string
}

/* ── Static data ── */
const metrics: MetricCard[] = [
  {
    title: "Leads capturados",
    value: "302",
    change: 12.5,
    changeLabel: "vs mes pasado",
    icon: Users,
    iconBg: "#F0E6F8",
    iconColor: "#522566",
    accent: "#AD74C3",
    bars: [40, 55, 45, 70, 60, 80, 65, 90, 75, 95, 85, 100],
  },
  {
    title: "Conversaciones",
    value: "1,248",
    change: 8.3,
    changeLabel: "vs mes pasado",
    icon: MessageSquare,
    iconBg: "#EAF6FF",
    iconColor: "#2563EB",
    accent: "#60A5FA",
    bars: [50, 60, 55, 75, 65, 85, 70, 88, 72, 92, 80, 98],
  },
  {
    title: "Tasa de conversión",
    value: "30.6%",
    change: 4.1,
    changeLabel: "vs mes pasado",
    icon: TrendingUp,
    iconBg: "#ECFDF5",
    iconColor: "#059669",
    accent: "#34D399",
    bars: [30, 40, 35, 55, 45, 60, 50, 65, 55, 70, 60, 75],
  },
  {
    title: "Leads calificados",
    value: "86",
    change: -3.2,
    changeLabel: "vs mes pasado",
    icon: Zap,
    iconBg: "#FFF7ED",
    iconColor: "#D97706",
    accent: "#FBBF24",
    bars: [60, 50, 65, 45, 70, 55, 68, 50, 72, 48, 65, 58],
  },
  {
    title: "Consumo del plan",
    value: "64%",
    change: 9.0,
    changeLabel: "del límite mensual",
    icon: CreditCard,
    iconBg: "#FFF1F2",
    iconColor: "#BE123C",
    accent: "#FB7185",
    bars: [20, 30, 35, 40, 45, 50, 52, 55, 58, 60, 62, 64],
  },
  {
    title: "Chatbot activo",
    value: "Online",
    change: 99.8,
    changeLabel: "uptime este mes",
    icon: Bot,
    iconBg: "#ECFDF5",
    iconColor: "#059669",
    accent: "#34D399",
    bars: [95, 98, 97, 99, 98, 100, 99, 100, 98, 99, 100, 100],
  },
]

const recentLeads: Lead[] = [
  { name: "Carlos Méndez",   company: "TechCorp SA",        score: 92, status: "Alta",  date: "24 jun 2026" },
  { name: "Laura Jiménez",   company: "Innovatek",          score: 78, status: "Media", date: "23 jun 2026" },
  { name: "Roberto Silva",   company: "Soluciones XYZ",     score: 45, status: "Baja",  date: "23 jun 2026" },
  { name: "Ana García",      company: "Digital Pro",        score: 88, status: "Alta",  date: "22 jun 2026" },
  { name: "Miguel Torres",   company: "StartupHub",         score: 60, status: "Nuevo", date: "22 jun 2026" },
  { name: "Sofía Ramírez",   company: "Nexus Partners",     score: 71, status: "Media", date: "21 jun 2026" },
]

/* ── Mini bar chart ── */
function MiniBarChart({ bars, accent }: { bars: number[]; accent: string }) {
  const max = Math.max(...bars)
  return (
    <div className="flex items-end gap-0.5 h-10">
      {bars.map((v, i) => (
        <div
          key={i}
          className="w-1.5 rounded-sm transition-all"
          style={{
            height: `${(v / max) * 100}%`,
            background: i === bars.length - 1 ? accent : `${accent}55`,
          }}
        />
      ))}
    </div>
  )
}

/* ── Status badge ── */
const statusStyles: Record<Lead["status"], string> = {
  Alta:  "bg-[#ECFDF5] text-[#059669] border border-[#6EE7B7]",
  Media: "bg-[#F0E6F8] text-[#7C3AED] border border-[#C4B5FD]",
  Baja:  "bg-[#FFF1F2] text-[#BE123C] border border-[#FECDD3]",
  Nuevo: "bg-[#F8EDFB] text-[#522566] border border-[#E9D5F5]",
}

const statusIcons: Record<Lead["status"], React.ComponentType<{ className?: string }>> = {
  Alta:  CheckCircle2,
  Media: Clock,
  Baja:  XCircle,
  Nuevo: Sparkles,
}

/* ── Metric card ── */
function MetricCardUI({ m }: { m: MetricCard }) {
  const positive = m.change >= 0
  return (
    <div
      className="rounded-2xl border border-[#EADCF3] bg-white p-5 shadow-[0_2px_12px_rgba(61,26,78,0.06)] flex flex-col gap-4"
      style={{ fontFamily: FONT }}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div
            className="flex size-10 items-center justify-center rounded-xl"
            style={{ background: m.iconBg }}
          >
            <m.icon className="size-5" style={{ color: m.iconColor }} />
          </div>
          <span className="text-sm font-semibold text-[#374151]">{m.title}</span>
        </div>
        <button className="rounded-lg p-1 text-[#A18AAF] hover:bg-[#F8EDFB] hover:text-[#522566]">
          <MoreVertical className="size-4" />
        </button>
      </div>

      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-3xl font-bold tracking-tight text-[#111827]">{m.value}</p>
          <div className={cn("mt-1 flex items-center gap-1 text-xs font-medium", positive ? "text-[#059669]" : "text-[#DC2626]")}>
            {positive
              ? <ArrowUpRight className="size-3.5" />
              : <ArrowDownRight className="size-3.5" />}
            <span>{positive ? "+" : ""}{m.change}%</span>
            <span className="font-normal text-[#9CA3AF]">{m.changeLabel}</span>
          </div>
        </div>
        <MiniBarChart bars={m.bars} accent={m.accent} />
      </div>
    </div>
  )
}

/* ── Page ── */
export default async function DashboardPage() {
  const user = await getSessionUser()
  if (!user || user.role !== "owner") redirect("/login")

  return (
    <div className="flex flex-col gap-6 p-6" style={{ fontFamily: FONT }}>

      {/* ── Welcome banner ── */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#3D1A4E] via-[#522566] to-[#7B3FA0] p-6 shadow-[0_8px_32px_rgba(61,26,78,0.22)]">
        {/* Decorative blobs */}
        <div className="pointer-events-none absolute -top-12 -right-12 h-48 w-48 rounded-full bg-[#AD74C3]/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-8 left-1/3 h-32 w-32 rounded-full bg-[#34D399]/15 blur-2xl" />

        <div className="relative z-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="max-w-lg">
            <p className="mb-1 text-[13px] font-semibold text-[#E9D5F5]/70 uppercase tracking-widest">
              Bienvenido, {user.name.split(" ")[0]} 👋
            </p>
            <h1 className="text-2xl font-bold text-white sm:text-3xl">
              Explora Mindware Nexus
            </h1>
            <p className="mt-2 text-[14px] text-[#D8B4FE]/80 leading-relaxed">
              Convierte conversaciones en oportunidades listas para cerrar.
            </p>
            <button className="mt-4 inline-flex items-center gap-2 rounded-xl bg-white/15 px-5 py-2.5 text-[13px] font-semibold text-white backdrop-blur-sm hover:bg-white/25 transition-colors border border-white/20">
              Configurar chatbot
              <ChevronRight className="size-4" />
            </button>
          </div>

          {/* Illustration placeholder */}
          <div className="hidden sm:flex flex-col items-center justify-center shrink-0">
            <div className="relative flex h-28 w-28 items-center justify-center rounded-3xl bg-white/10 border border-white/20 shadow-xl backdrop-blur-sm">
              <Bot className="size-14 text-white/80" />
              <span className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-[#34D399] shadow-md">
                <Zap className="size-3.5 text-white" />
              </span>
            </div>
            <p className="mt-2 text-[11px] text-white/50 text-center">AI Sales Agent</p>
          </div>
        </div>

        {/* Stats strip */}
        <div className="relative z-10 mt-5 grid grid-cols-3 gap-4 rounded-xl border border-white/10 bg-white/8 p-4">
          {[
            { label: "Leads hoy",      value: "14" },
            { label: "Chats activos",  value: "3"  },
            { label: "Score promedio", value: "74" },
          ].map(({ label, value }) => (
            <div key={label} className="text-center">
              <p className="text-xl font-bold text-white">{value}</p>
              <p className="text-[11px] text-white/55 mt-0.5">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Metric cards ── */}
      <div>
        <h2 className="mb-3 text-[13px] font-semibold uppercase tracking-wider text-[#8A7397]">
          Métricas generales
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {metrics.map((m) => (
            <MetricCardUI key={m.title} m={m} />
          ))}
        </div>
      </div>

      {/* ── Recent leads table ── */}
      <div className="rounded-2xl border border-[#EADCF3] bg-white shadow-[0_2px_12px_rgba(61,26,78,0.06)]">
        <div className="flex items-center justify-between border-b border-[#EADCF3] px-6 py-4">
          <div>
            <h2 className="text-[15px] font-bold text-[#111827]">Leads recientes</h2>
            <p className="text-[12px] text-[#8A7397]">Últimas conversaciones capturadas</p>
          </div>
          <button className="rounded-xl border border-[#EADCF3] bg-[#F8EDFB] px-4 py-2 text-[13px] font-semibold text-[#522566] hover:bg-[#F0E6F8] transition-colors">
            Ver todos
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#F3EAF8]">
                {["Nombre", "Empresa", "Score", "Estado", "Fecha", "Acción"].map((h) => (
                  <th
                    key={h}
                    className="px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-[#A18AAF]"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recentLeads.map((lead, i) => {
                const Icon = statusIcons[lead.status]
                return (
                  <tr
                    key={i}
                    className="border-b border-[#F9F5FF] transition-colors hover:bg-[#FDFAFF]"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#522566]/20 to-[#AD74C3]/30 text-[11px] font-bold text-[#522566]">
                          {lead.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                        </div>
                        <span className="text-[13px] font-semibold text-[#111827]">{lead.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-[13px] text-[#6B7280]">{lead.company}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-16 rounded-full bg-[#F0E6F8] overflow-hidden">
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${lead.score}%`,
                              background: lead.score >= 80 ? "#34D399" : lead.score >= 60 ? "#AD74C3" : "#FB7185",
                            }}
                          />
                        </div>
                        <span className="text-[13px] font-semibold text-[#374151]">{lead.score}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold", statusStyles[lead.status])}>
                        <Icon className="size-3" />
                        {lead.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-[13px] text-[#9CA3AF]">{lead.date}</td>
                    <td className="px-6 py-4">
                      <button className="rounded-lg border border-[#EADCF3] px-3 py-1.5 text-[11px] font-semibold text-[#522566] hover:bg-[#F8EDFB] transition-colors">
                        Ver
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between border-t border-[#F3EAF8] px-6 py-3">
          <p className="text-[12px] text-[#A18AAF]">Mostrando 6 de 302 leads</p>
          <div className="flex items-center gap-2">
            {[1, 2, 3].map((n) => (
              <button
                key={n}
                className={cn(
                  "flex h-7 w-7 items-center justify-center rounded-lg text-[12px] font-semibold transition-colors",
                  n === 1
                    ? "bg-[#522566] text-white"
                    : "border border-[#EADCF3] text-[#8A7397] hover:bg-[#F8EDFB]"
                )}
              >
                {n}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
