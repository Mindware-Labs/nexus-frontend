"use client"

import type { ComponentType } from "react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  BarChart3,
  Bot,
  Building2,
  ChevronRight,
  Code2,
  CreditCard,
  Database,
  FileClock,
  KeyRound,
  LayoutDashboard,
  MessageSquare,
  MoreVertical,
  Plug,
  Settings,
  Shield,
  Users,
  UserCog,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
} from "@/components/ui/sidebar"
import { LogoutButton } from "@/components/logout-button"
import { BRAND_LOGO_ALT, BRAND_LOGO_SRC } from "@/lib/brand"
import { cn } from "@/lib/utils"

type NavItem = {
  title: string
  href: string
  icon: ComponentType<{ className?: string }>
  match?: string[]
  badge?: string
  subItems?: { title: string; href: string }[]
}

type NavGroup = {
  label: string
  items: NavItem[]
}

const navGroups: NavGroup[] = [
  {
    label: "Navigation",
    items: [
      {
        title: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
        badge: "2",
        subItems: [
          { title: "Overview", href: "/dashboard" },
          { title: "Analytics", href: "/dashboard/reports" },
          { title: "Finance", href: "/dashboard/plans" },
        ],
      },
      { title: "Leads", href: "/dashboard/customers", icon: Users, match: ["/dashboard/customers", "/dashboard/bots"] },
      { title: "Conversaciones", href: "/dashboard/conversations", icon: MessageSquare },
      { title: "Reportes", href: "/dashboard/reports", icon: BarChart3 },
    ],
  },
  {
    label: "Widget",
    items: [
      { title: "Chatbot", href: "/dashboard/customers", icon: Bot, match: ["/dashboard/bots", "/dashboard/customers"] },
      { title: "Nexus Database", href: "/dashboard/customers", icon: Database },
      { title: "Widget", href: "/dashboard/widget", icon: Code2 },
      { title: "Integraciones", href: "/dashboard/api-keys", icon: KeyRound },
    ],
  },
  {
    label: "Admin Panel",
    items: [
      { title: "Clientes", href: "/dashboard/tenants", icon: Building2 },
      { title: "Usuarios", href: "/dashboard/users", icon: UserCog },
      { title: "Plan y consumo", href: "/dashboard/plans", icon: CreditCard },
      { title: "Seguridad", href: "/dashboard/privacy", icon: Shield },
      { title: "Auditoría", href: "/dashboard/audit", icon: FileClock },
    ],
  },
]

type AppSidebarProps = {
  userName?: string
  userEmail?: string
  userRole?: string
}

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  return parts.slice(0, 2).map((part) => part[0]?.toUpperCase() ?? "").join("") || "MN"
}

function isItemActive(pathname: string, item: NavItem) {
  if (pathname === item.href) return true
  return (item.match ?? [item.href]).some(
    (prefix) => prefix !== "/dashboard" && pathname.startsWith(prefix)
  )
}

export function AppSidebar({
  userName = "Yordy Acosta",
  userEmail = "owner@mindwarenexus.com",
  userRole = "Owner",
}: AppSidebarProps) {
  const pathname = usePathname()
  const initials = getInitials(userName)

  return (
    <Sidebar
      collapsible="icon"
      className="border-r border-[#EADCF3] bg-white"
      style={{ fontFamily: "'Hanken Grotesk', system-ui, sans-serif" }}
    >
      {/* ── Logo ── */}
      <SidebarHeader className="px-4 pb-2 pt-5">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              size="lg"
              tooltip="Mindware Nexus"
              className="h-auto rounded-2xl px-2 py-2 hover:bg-transparent data-[active=true]:bg-transparent"
            >
              <Link href="/dashboard" className="flex items-center gap-3">
                <div className="relative flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[#3D1A4E] shadow-[0_8px_20px_rgba(61,26,78,0.30)]">
                  <Image
                    src={BRAND_LOGO_SRC}
                    alt={BRAND_LOGO_ALT}
                    width={24}
                    height={24}
                    className="h-6 w-6 object-contain"
                    priority
                  />
                </div>
                <div className="min-w-0 group-data-[collapsible=icon]:hidden">
                  <div className="flex items-center gap-2">
                    <span className="text-[15px] font-bold text-[#111827]">Nexus</span>
                    <span className="rounded-md bg-[#F8EDFB] px-1.5 py-0.5 text-[10px] font-semibold text-[#522566]">
                      AI Pro
                    </span>
                  </div>
                  <p className="text-[11px] text-[#8A7397]">Mindware Labs</p>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarSeparator className="mx-4 bg-[#EADCF3]" />

      {/* ── User card ── */}
      <div className="px-4 py-3 group-data-[collapsible=icon]:px-2">
        <div className="flex items-center gap-3 rounded-2xl border border-[#EADCF3] bg-[#FDFAFF] px-3 py-2.5 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-2">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#522566] to-[#AD74C3] text-[13px] font-bold text-white shadow-sm">
            {initials}
          </div>
          <div className="min-w-0 flex-1 group-data-[collapsible=icon]:hidden">
            <p className="truncate text-[13px] font-semibold text-[#111827]">{userName}</p>
            <div className="flex items-center gap-1.5">
              <span className="inline-flex h-1.5 w-1.5 rounded-full bg-[#34D399]" />
              <span className="text-[11px] text-[#7C6589]">{userRole}</span>
            </div>
          </div>
          <button
            className="shrink-0 rounded-lg p-1 text-[#A18AAF] hover:bg-[#F0E6F8] hover:text-[#522566] group-data-[collapsible=icon]:hidden"
            aria-label="Opciones de usuario"
          >
            <MoreVertical className="size-3.5" />
          </button>
        </div>
      </div>

      {/* ── Nav ── */}
      <SidebarContent className="gap-0 px-2 pb-2">
        {navGroups.map((group) => (
          <SidebarGroup key={group.label} className="px-1 py-2">
            <SidebarGroupLabel className="mb-1 px-2 text-[10px] font-bold uppercase tracking-[0.16em] text-[#A18AAF] group-data-[collapsible=icon]:hidden">
              {group.label}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="gap-0.5">
                {group.items.map((item) => {
                  const active = isItemActive(pathname, item)
                  return (
                    <div key={`${group.label}-${item.title}`}>
                      <SidebarMenuItem>
                        <SidebarMenuButton
                          asChild
                          tooltip={item.title}
                          isActive={active}
                          className={cn(
                            "h-10 rounded-xl px-3 text-[13px] font-medium text-[#5F6472]",
                            "hover:bg-[#F8EDFB] hover:text-[#3D1A4E]",
                            "data-[active=true]:bg-[#F0E6F8] data-[active=true]:font-semibold data-[active=true]:text-[#522566]",
                            "group-data-[collapsible=icon]:rounded-xl group-data-[collapsible=icon]:px-2"
                          )}
                        >
                          <Link href={item.href} className="flex items-center gap-3">
                            <item.icon
                              className={cn(
                                "size-[18px] shrink-0 transition-colors",
                                active ? "text-[#522566]" : "text-[#8A7397]"
                              )}
                            />
                            <span className="truncate group-data-[collapsible=icon]:hidden">{item.title}</span>
                            {item.badge ? (
                              <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-[#522566] px-1.5 text-[10px] font-bold text-white group-data-[collapsible=icon]:hidden">
                                {item.badge}
                              </span>
                            ) : (
                              <ChevronRight className="ml-auto size-3.5 text-[#C3AECD] group-data-[collapsible=icon]:hidden" />
                            )}
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>

                      {/* Sub-items */}
                      {active && item.subItems && item.subItems.length > 0 && (
                        <div className="ml-[34px] mt-0.5 mb-1 flex flex-col gap-0.5 group-data-[collapsible=icon]:hidden">
                          {item.subItems.map((sub) => (
                            <Link
                              key={sub.href}
                              href={sub.href}
                              className={cn(
                                "flex items-center gap-2.5 rounded-lg px-2 py-1.5 text-[12px] font-medium",
                                "text-[#7C6589] hover:text-[#522566]",
                                pathname === sub.href && "text-[#522566]"
                              )}
                            >
                              <span
                                className={cn(
                                  "h-1.5 w-1.5 rounded-full",
                                  pathname === sub.href ? "bg-[#522566]" : "bg-[#C3AECD]"
                                )}
                              />
                              {sub.title}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  )
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarSeparator className="mx-4 bg-[#EADCF3]" />

      {/* ── Footer ── */}
      <SidebarFooter className="gap-1 px-3 pb-4 pt-3">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              tooltip="Configuración"
              className="h-10 rounded-xl px-3 text-[13px] font-medium text-[#5F6472] hover:bg-[#F8EDFB] hover:text-[#3D1A4E]"
            >
              <Link href="/dashboard/privacy" className="flex items-center gap-3">
                <Settings className="size-[18px] shrink-0 text-[#8A7397]" />
                <span className="group-data-[collapsible=icon]:hidden">Configuración</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <LogoutButton
              className={cn(
                "h-10 rounded-xl px-3 text-[13px] font-medium text-[#7B5868]",
                "hover:bg-[#FFF1F4] hover:text-[#B42347]"
              )}
              title="Cerrar sesión"
            />
          </SidebarMenuItem>
        </SidebarMenu>
        <p className="mt-1 px-2 text-[11px] text-[#C3AECD] group-data-[collapsible=icon]:hidden">
          {userEmail}
        </p>
      </SidebarFooter>

      <SidebarRail className="after:bg-[#D9C6E5] hover:after:bg-[#AD74C3]" />
    </Sidebar>
  )
}
