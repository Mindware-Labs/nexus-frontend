import { redirect } from "next/navigation"
import { getSessionUser } from "@/lib/session"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { AppSidebar } from "@/components/app-sidebar"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getSessionUser()
  if (!user || user.role !== "owner") redirect("/login")

  return (
    <SidebarProvider>
      <AppSidebar userName={user.name} />
      <SidebarInset>
        <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4 bg-background">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <span className="text-sm text-muted-foreground">{user.email}</span>
        </header>
        <div className="flex flex-1 flex-col bg-background">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  )
}
