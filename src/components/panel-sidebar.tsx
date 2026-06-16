"use client"

import {
  Bell,
  Building2,
  LayoutDashboard,
  LogOut,
  MessageSquare,
  MessagesSquare,
  Sparkles,
  Users,
  BarChart2,
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

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
} from "@/components/ui/sidebar"
import { logoutAction } from "@/app/actions/auth"

const navItems = [
  {
    group: "General",
    items: [{ title: "Inicio", url: "/panel", icon: LayoutDashboard }],
  },
  {
    group: "Operación",
    items: [
      { title: "Mi Chatbot", url: "/panel/chatbot", icon: MessageSquare },
      { title: "Leads", url: "/panel/leads", icon: Users },
      { title: "Conversaciones", url: "/panel/conversations", icon: MessagesSquare },
    ],
  },
  {
    group: "Analítica",
    items: [{ title: "Analítica", url: "/panel/analytics", icon: BarChart2 }],
  },
  {
    group: "Cuenta",
    items: [
      { title: "Notificaciones", url: "/panel/settings", icon: Bell },
      { title: "Mi Empresa", url: "/panel/company", icon: Building2 },
    ],
  },
]

export function PanelSidebar({ userName, userEmail }: { userName: string; userEmail: string }) {
  const pathname = usePathname()

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/panel">
                <div className="grid size-8 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-nexus-purple to-nexus-lavender shadow-lg">
                  <Sparkles className="size-4 text-white" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none min-w-0">
                  <span className="truncate font-semibold">Mindware Nexus</span>
                  <span className="truncate text-xs text-sidebar-foreground/60">Panel Customer</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        {navItems.map((group) => (
          <SidebarGroup key={group.group}>
            <SidebarGroupLabel>{group.group}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={
                        pathname === item.url ||
                        (item.url !== "/panel" && pathname.startsWith(item.url))
                      }
                      tooltip={item.title}
                    >
                      <Link href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" tooltip="Cuenta" className="h-auto py-2">
              <div className="grid size-8 shrink-0 place-items-center rounded-lg bg-nexus-purple/10 text-nexus-purple font-semibold text-sm">
                {userName.charAt(0).toUpperCase()}
              </div>
              <div className="flex flex-col gap-0.5 leading-none min-w-0">
                <span className="truncate text-sm font-medium">{userName}</span>
                <span className="truncate text-xs text-sidebar-foreground/60">{userEmail}</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Cerrar sesión">
              <form action={logoutAction}>
                <button
                  type="submit"
                  className="flex w-full items-center gap-2 text-muted-foreground hover:text-destructive transition-colors"
                >
                  <LogOut className="size-4" />
                  <span>Cerrar sesión</span>
                </button>
              </form>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}
