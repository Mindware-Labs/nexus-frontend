import { redirect } from "next/navigation"
import { AlertCircle, CheckCircle2, KeyRound, XCircle } from "lucide-react"
import { getSessionUser } from "@/lib/session"
import { listApiProviders } from "@/app/actions/api-keys"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { AddApiProviderDialog, EditApiProviderDialog, DeleteApiProviderButton } from "./api-key-dialogs"

export const metadata = {
  title: "API Keys — Mindware Nexus",
}

const PROVIDER_LABELS: Record<string, string> = {
  gemini: "Google Gemini",
  openai: "OpenAI",
  anthropic: "Anthropic",
}

function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("es-MX", { dateStyle: "medium" }).format(new Date(iso))
}

function getErrorMessage(reason: unknown): string | null {
  return reason instanceof Error ? reason.message : null
}

function isRedirectError(err: unknown): boolean {
  if (!(err instanceof Error)) return false
  const e = err as Error & { digest?: string }
  return e.message === "NEXT_REDIRECT" || (e.digest?.startsWith("NEXT_REDIRECT") ?? false)
}

export default async function ApiKeysPage() {
  const user = await getSessionUser()
  if (!user || user.role !== "owner") redirect("/login")

  const [providersResult] = await Promise.allSettled([listApiProviders()])

  const error =
    providersResult.status === "rejected" && !isRedirectError(providersResult.reason)
      ? getErrorMessage(providersResult.reason)
      : null

  const providers = providersResult.status === "fulfilled" ? providersResult.value : []

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <h1 className="text-xl font-semibold flex items-center gap-2">
            <KeyRound className="size-5 text-muted-foreground" />
            API Keys de IA
          </h1>
          <p className="text-sm text-muted-foreground">
            Gestiona las claves de acceso a los modelos de IA. Las keys se almacenan cifradas con AES-256-GCM.
          </p>
        </div>
        <AddApiProviderDialog />
      </div>

      <Separator />

      {error && (
        <div className="flex items-start gap-2.5 rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          <AlertCircle className="mt-0.5 size-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {providers.length === 0 && !error && (
        <div className="rounded-xl border border-dashed p-10 text-center text-muted-foreground">
          <KeyRound className="mx-auto size-8 mb-3 opacity-30" />
          <p className="text-sm font-medium">No hay proveedores configurados</p>
          <p className="text-xs mt-1">Agrega tu primera API key para que los bots puedan responder.</p>
        </div>
      )}

      <div className="space-y-4">
        {providers.map((p) => (
          <div
            key={p.id}
            className="rounded-xl border bg-card p-4 space-y-3"
          >
            {/* Cabecera de la tarjeta */}
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{p.label}</span>
                  <Badge variant="outline" className="text-xs">
                    {PROVIDER_LABELS[p.provider] ?? p.provider}
                  </Badge>
                  {p.is_active ? (
                    <Badge variant="success" className="gap-1 text-xs">
                      <CheckCircle2 className="size-3" />
                      Activo
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="gap-1 text-xs text-muted-foreground">
                      <XCircle className="size-3" />
                      Inactivo
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  Actualizado {formatDate(p.updated_at)}
                </p>
              </div>

              <div className="flex gap-1 shrink-0">
                <EditApiProviderDialog provider={p} />
                <DeleteApiProviderButton provider={p} />
              </div>
            </div>

            {/* API key (siempre oculta) */}
            <div className="flex items-center gap-2 rounded-lg bg-muted/40 px-3 py-2">
              <KeyRound className="size-3.5 text-muted-foreground shrink-0" />
              <code className="text-xs text-muted-foreground tracking-widest">
                ••••••••••••••••••••••••••••••••
              </code>
            </div>

            {/* Modelos disponibles */}
            {p.models.length > 0 && (
              <div>
                <p className="text-xs text-muted-foreground mb-1.5">Modelos disponibles</p>
                <div className="flex flex-wrap gap-1.5">
                  {p.models.map((m) => (
                    <Badge key={m} variant="secondary" className="font-mono text-xs">
                      {m}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Nota de seguridad */}
      <div className="rounded-xl border border-amber-200 bg-amber-50 dark:border-amber-900/40 dark:bg-amber-950/20 p-4 text-sm text-amber-800 dark:text-amber-300 space-y-1">
        <p className="font-medium">🔒 Seguridad</p>
        <p className="text-xs">
          Las API keys se cifran con AES-256-GCM antes de guardarse. Nunca se muestran en texto claro
          después de ser almacenadas. La clave de cifrado vive solo en las variables de entorno del servidor.
        </p>
      </div>
    </div>
  )
}
