import { redirect } from 'next/navigation'
import { getSessionUser } from '@/lib/session'
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'
import { PanelSidebar } from '@/components/panel-sidebar'
import { NexusPanelHeader } from '@/components/nexus-panel-header'
import { NexusThemeProvider } from '@/components/nexus-theme-provider'

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const user = await getSessionUser()
  if (!user || user.role !== 'customer') redirect('/login')

  return (
    <NexusThemeProvider>
      <SidebarProvider defaultOpen>
        <PanelSidebar />
        <SidebarInset style={{ background: 'var(--nx-bg)' }}>
          <NexusPanelHeader userName={user.name} userEmail={user.email} />
          <div className="flex flex-1 flex-col">{children}</div>
        </SidebarInset>
      </SidebarProvider>
    </NexusThemeProvider>
  )
}
