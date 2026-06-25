'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  BarChart2, Bell, Bot, Building2, ChevronRight,
  CreditCard, HelpCircle, LayoutDashboard,
  MessageSquare, MessagesSquare, Shield,
} from 'lucide-react'
import {
  Sidebar, SidebarContent, SidebarFooter, SidebarGroup,
  SidebarGroupContent, SidebarGroupLabel, SidebarHeader,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem,
} from '@/components/ui/sidebar'
import { BRAND_LOGO_ALT, BRAND_LOGO_SRC } from '@/lib/brand'
import { cn } from '@/lib/utils'

const SANS = "var(--font-hanken, 'Hanken Grotesk', system-ui, sans-serif)"
const MONO = "var(--font-geist-mono, ui-monospace, monospace)"

type NavItem = { title: string; url: string; icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }> }
type NavGroup = { label: string; items: NavItem[] }

const NAV: NavGroup[] = [
  {
    label: 'NAVEGACIÓN',
    items: [
      { title: 'Inicio',          url: '/panel',               icon: LayoutDashboard },
      { title: 'Leads',           url: '/panel/leads',         icon: MessagesSquare  },
      { title: 'Conversaciones',  url: '/panel/conversations', icon: MessageSquare   },
      { title: 'Analítica',       url: '/panel/analytics',     icon: BarChart2       },
    ],
  },
  {
    label: 'WIDGET',
    items: [
      { title: 'Mi Chatbot',    url: '/panel/chatbot',       icon: Bot           },
      { title: 'Sin respuesta', url: '/panel/unanswered',    icon: HelpCircle    },
      { title: 'Chat en vivo',  url: '/panel/conversations', icon: MessageSquare },
    ],
  },
  {
    label: 'CUENTA',
    items: [
      { title: 'Mi Plan',        url: '/panel/plan',     icon: CreditCard },
      { title: 'Notificaciones', url: '/panel/settings', icon: Bell       },
      { title: 'Mi Empresa',     url: '/panel/company',  icon: Building2  },
      { title: 'Privacidad',     url: '/panel/privacy',  icon: Shield     },
    ],
  },
]

export function PanelSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar collapsible="icon" style={{ fontFamily: SANS }}>
      {/* ── Brand ── */}
      <SidebarHeader className="px-3 pt-5 pb-4 border-b" style={{ borderColor: 'var(--nx-border)' }}>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild size="lg" tooltip="Nexus"
              className="h-auto rounded-xl px-2 py-2 hover:bg-transparent active:bg-transparent"
            >
              <Link href="/panel" className="flex items-center gap-3">
                <div
                  className="relative flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-xl"
                  style={{
                    background: 'linear-gradient(135deg, #522566, #3D1A4E)',
                    boxShadow: '0 4px 14px rgba(82,37,102,.30)',
                  }}
                >
                  <Image
                    src={BRAND_LOGO_SRC} alt={BRAND_LOGO_ALT}
                    width={20} height={20}
                    className="h-5 w-5 object-contain"
                    priority
                  />
                </div>
                <div className="min-w-0 group-data-[collapsible=icon]:hidden">
                  <div className="flex items-center gap-2">
                    <span className="text-[15px] font-bold" style={{ color: '#111827' }}>Nexus</span>
                    <span
                      className="rounded-md px-1.5 py-0.5 text-[9px] font-bold tracking-wider"
                      style={{ fontFamily: MONO, background: '#F8EDFB', color: '#522566' }}
                    >
                      AI PRO
                    </span>
                  </div>
                  <p className="text-[11px]" style={{ color: '#AD74C3', fontFamily: MONO }}>
                    Mindware Labs
                  </p>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* ── Nav ── */}
      <SidebarContent className="gap-0 px-2 py-2">
        {NAV.map(({ label, items }) => (
          <SidebarGroup key={label} className="px-1 py-2">
            <SidebarGroupLabel
              className="mb-1 px-2 text-[10px] font-bold tracking-[1px] group-data-[collapsible=icon]:hidden"
              style={{ color: '#AD74C3', fontFamily: MONO }}
            >
              {label}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="gap-0.5">
                {items.map(item => {
                  const active = pathname === item.url
                    || (item.url !== '/panel' && pathname.startsWith(item.url))
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        tooltip={item.title}
                        isActive={active}
                        className={cn(
                          'relative h-10 rounded-xl px-3 text-[13px] font-medium transition-all',
                          'group-data-[collapsible=icon]:px-2',
                        )}
                        style={{
                          background: active ? '#F8EDFB' : 'transparent',
                          color: active ? '#522566' : '#5A3570',
                        }}
                      >
                        <Link href={item.url} className="flex items-center gap-3">
                          {active && (
                            <span
                              className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-[3px] rounded-r-full"
                              style={{ background: '#522566' }}
                            />
                          )}
                          <item.icon
                            className="size-[17px] shrink-0"
                            style={{ color: active ? '#522566' : '#AD74C3' }}
                          />
                          <span className="truncate group-data-[collapsible=icon]:hidden font-semibold">
                            {item.title}
                          </span>
                          {active && (
                            <ChevronRight
                              className="ml-auto size-3.5 group-data-[collapsible=icon]:hidden"
                              style={{ color: '#522566', opacity: 0.5 }}
                            />
                          )}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      {/* ── Footer ── */}
      <SidebarFooter className="px-3 pb-4 pt-2 border-t" style={{ borderColor: 'var(--nx-border)' }}>
        <p
          className="px-2 py-1 text-[11px] truncate group-data-[collapsible=icon]:hidden"
          style={{ color: '#AD74C3', fontFamily: MONO }}
        >
          Mindware Nexus v2.0
        </p>
      </SidebarFooter>
    </Sidebar>
  )
}
