"use client"

import type { ComponentProps } from "react"
import { useTransition } from "react"
import { LogOut } from "lucide-react"
import { logoutAction } from "@/app/actions/auth"
import { cn } from "@/lib/utils"

type LogoutButtonProps = ComponentProps<"button">

export function LogoutButton({ className, ...props }: LogoutButtonProps) {
  const [isPending, start] = useTransition()

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={() => start(() => logoutAction())}
      className={cn(
        "flex w-full items-center gap-2 text-muted-foreground transition-colors disabled:opacity-50",
        className
      )}
      {...props}
    >
      <LogOut className="size-4" />
      <span>{isPending ? "Cerrando..." : "Cerrar sesion"}</span>
    </button>
  )
}
