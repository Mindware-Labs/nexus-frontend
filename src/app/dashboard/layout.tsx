import { redirect } from "next/navigation"
import { getSessionUser } from "@/lib/session"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { DashboardHeader } from "@/components/dashboard-header"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getSessionUser()
  if (!user || user.role !== "owner") redirect("/login")

  return (
    <SidebarProvider defaultOpen>
      <AppSidebar userName={user.name} userEmail={user.email} userRole="Owner" />
      <SidebarInset className="bg-[#F7F4FB]">
        <DashboardHeader userName={user.name} userEmail={user.email} />
        <div className="flex flex-1 flex-col">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  )
}
