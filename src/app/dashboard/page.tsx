import { redirect } from "next/navigation"
import { Sparkles } from "lucide-react"
import { getSessionUser } from "@/lib/session"

export default async function DashboardPage() {
  const user = await getSessionUser()
  if (!user || user.role !== "owner") redirect("/login")

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6 p-8">
      <div className="flex flex-col items-center gap-3 text-center max-w-md">
        <span className="grid size-12 place-items-center rounded-2xl bg-primary/10">
          <Sparkles className="size-6 text-primary" />
        </span>
        <h1 className="text-2xl font-bold text-foreground">Panel de Owner</h1>
        <p className="text-muted-foreground">
          Bienvenido, {user.name}. Tu dashboard se construirá aquí.
        </p>
      </div>
    </div>
  )
}
