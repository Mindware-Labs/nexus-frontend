"use client"

import { useTransition } from "react"
import { LogOut } from "lucide-react"
import { logoutAction } from "@/app/actions/auth"

export function LogoutButton() {
  const [isPending, start] = useTransition()

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={() => start(() => logoutAction())}
      className="flex w-full items-center gap-2 text-muted-foreground hover:text-destructive transition-colors disabled:opacity-50"
    >
      <LogOut className="size-4" />
      <span>{isPending ? "Cerrando…" : "Cerrar sesión"}</span>
    </button>
  )
}
