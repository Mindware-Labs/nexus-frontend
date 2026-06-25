"use client"

import { Bell, Globe, Moon, Search, Settings } from "lucide-react"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

const FONT = "'Hanken Grotesk', system-ui, sans-serif"

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  return parts.slice(0, 2).map((p) => p[0]?.toUpperCase() ?? "").join("") || "MN"
}

export function DashboardHeader({
  userName = "Yordy Acosta",
  userEmail = "",
}: {
  userName?: string
  userEmail?: string
}) {
  const initials = getInitials(userName)

  return (
    <header
      className="sticky top-0 z-20 flex h-16 shrink-0 items-center gap-3 border-b border-[#EADCF3] bg-white/90 px-4 backdrop-blur-sm"
      style={{ fontFamily: FONT }}
    >
      {/* Left: trigger */}
      <SidebarTrigger className="-ml-1 rounded-xl border border-[#EADCF3] bg-white text-[#522566] shadow-sm hover:bg-[#F8EDFB] hover:text-[#3D1A4E]" />
      <Separator orientation="vertical" className="h-5 bg-[#EADCF3]" />

      {/* Search */}
      <div className="flex flex-1 items-center">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-[#A18AAF]" />
          <input
            type="text"
            placeholder="Buscar leads, clientes o conversaciones..."
            className={cn(
              "h-9 w-full rounded-xl border border-[#EADCF3] bg-[#FDFAFF] pl-9 pr-4 text-[13px] text-[#111827]",
              "placeholder:text-[#A18AAF] outline-none transition-all",
              "focus:border-[#AD74C3] focus:shadow-[0_0_0_3px_rgba(173,116,195,0.10)]",
              "hidden sm:block"
            )}
          />
        </div>
        {/* Ctrl+K hint — only on larger screens */}
        <div className="hidden xl:flex ml-2 items-center gap-1 rounded-lg border border-[#EADCF3] bg-[#F8EDFB] px-2 py-1">
          <kbd className="text-[10px] font-semibold text-[#8A7397]">Ctrl</kbd>
          <span className="text-[10px] text-[#A18AAF]">+</span>
          <kbd className="text-[10px] font-semibold text-[#8A7397]">K</kbd>
        </div>
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-1">
        <ActionBtn label="Idioma">
          <Globe className="size-4" />
        </ActionBtn>
        <ActionBtn label="Modo oscuro">
          <Moon className="size-4" />
        </ActionBtn>
        <ActionBtn label="Configuración">
          <Settings className="size-4" />
        </ActionBtn>

        {/* Notifications */}
        <div className="relative">
          <ActionBtn label="Notificaciones">
            <Bell className="size-4" />
          </ActionBtn>
          <span className="absolute right-1.5 top-1.5 flex h-2 w-2 items-center justify-center rounded-full bg-[#34D399] ring-2 ring-white" />
        </div>

        <Separator orientation="vertical" className="mx-1 h-5 bg-[#EADCF3]" />

        {/* Avatar */}
        <button
          className="flex size-8 items-center justify-center rounded-full bg-gradient-to-br from-[#522566] to-[#AD74C3] text-[12px] font-bold text-white shadow-sm hover:shadow-md transition-shadow"
          title={userEmail || userName}
        >
          {initials}
        </button>
      </div>
    </header>
  )
}

function ActionBtn({ children, label }: { children: React.ReactNode; label: string }) {
  return (
    <button
      className="flex h-8 w-8 items-center justify-center rounded-xl text-[#8A7397] hover:bg-[#F8EDFB] hover:text-[#522566] transition-colors"
      title={label}
    >
      {children}
    </button>
  )
}
