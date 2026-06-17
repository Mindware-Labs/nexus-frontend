"use client"

import { useActionState, useState } from "react"
import { KeyRound, Loader2, Plus, Trash2, PencilLine, Eye, EyeOff, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  createApiProviderAction,
  updateApiProviderAction,
  deleteApiProviderAction,
  type ApiProvider,
  type ApiKeyActionState,
} from "@/app/actions/api-keys"

const PROVIDERS = [
  { value: "gemini", label: "Google Gemini" },
  { value: "openai", label: "OpenAI" },
  { value: "anthropic", label: "Anthropic" },
]

const DEFAULT_MODELS: Record<string, string> = {
  gemini: "gemini-2.0-flash-lite\ngemini-2.0-flash\ngemini-2.5-flash-preview-05-20\ngemini-2.5-pro-preview-06-05",
  openai: "gpt-4o-mini\ngpt-4o\ngpt-4-turbo",
  anthropic: "claude-haiku-4-5-20251001\nclaude-sonnet-4-6\nclaude-opus-4-8",
}

// ── Crear proveedor ──────────────────────────────────────────────────────────

const initialState: ApiKeyActionState = { status: "idle" }

export function AddApiProviderDialog() {
  const [open, setOpen] = useState(false)
  const [showKey, setShowKey] = useState(false)
  const [selectedProvider, setSelectedProvider] = useState("gemini")
  const [models, setModels] = useState(DEFAULT_MODELS.gemini)

  const boundAction = createApiProviderAction.bind(null, initialState)
  const [state, formAction, pending] = useActionState(
    async (_prev: ApiKeyActionState, formData: FormData) => {
      const result = await createApiProviderAction(_prev, formData)
      if (result.status === "success") setOpen(false)
      return result
    },
    initialState,
  )

  function handleProviderChange(val: string) {
    setSelectedProvider(val)
    setModels(DEFAULT_MODELS[val] ?? "")
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-2 bg-nexus-purple hover:bg-nexus-purple/90 text-white">
          <Plus className="size-4" />
          Agregar proveedor
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <KeyRound className="size-4" />
            Nuevo proveedor de IA
          </DialogTitle>
        </DialogHeader>

        <form action={formAction} className="space-y-4 pt-2">
          <input type="hidden" name="provider" value={selectedProvider} />

          <div className="space-y-1.5">
            <Label>Proveedor</Label>
            <Select value={selectedProvider} onValueChange={handleProviderChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PROVIDERS.map((p) => (
                  <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="label">Nombre visible</Label>
            <Input
              id="label"
              name="label"
              placeholder="ej. Gemini producción"
              required
              minLength={1}
              maxLength={80}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="apiKey">API Key</Label>
            <div className="relative">
              <Input
                id="apiKey"
                name="apiKey"
                type={showKey ? "text" : "password"}
                placeholder="Pega tu API key aquí"
                required
                className="pr-10 font-mono text-xs"
              />
              <button
                type="button"
                onClick={() => setShowKey((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showKey ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="models">Modelos disponibles <span className="text-muted-foreground text-xs">(uno por línea)</span></Label>
            <textarea
              id="models"
              name="models"
              value={models}
              onChange={(e) => setModels(e.target.value)}
              rows={4}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-mono resize-y"
              placeholder="gemini-2.0-flash-lite"
            />
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <input
              type="checkbox"
              id="validate"
              name="validate"
              value="true"
              defaultChecked
              className="rounded"
            />
            <label htmlFor="validate">Validar key antes de guardar</label>
          </div>

          {state.status === "error" && (
            <p className="text-sm text-destructive">{state.message}</p>
          )}

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">Cancelar</Button>
            </DialogClose>
            <Button type="submit" disabled={pending} className="gap-2 bg-nexus-purple hover:bg-nexus-purple/90 text-white">
              {pending && <Loader2 className="size-4 animate-spin" />}
              Guardar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

// ── Editar proveedor ─────────────────────────────────────────────────────────

export function EditApiProviderDialog({ provider }: { provider: ApiProvider }) {
  const [open, setOpen] = useState(false)
  const [showKey, setShowKey] = useState(false)
  const [models, setModels] = useState(provider.models.join("\n"))

  const [state, formAction, pending] = useActionState(
    async (_prev: ApiKeyActionState, formData: FormData) => {
      const result = await updateApiProviderAction(provider.id, _prev, formData)
      if (result.status === "success") setOpen(false)
      return result
    },
    initialState,
  )

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-1.5 h-8">
          <PencilLine className="size-3.5" />
          Editar
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <KeyRound className="size-4" />
            Editar — {provider.label}
          </DialogTitle>
        </DialogHeader>

        <form action={formAction} className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <Label htmlFor={`label-${provider.id}`}>Nombre visible</Label>
            <Input
              id={`label-${provider.id}`}
              name="label"
              defaultValue={provider.label}
              required
              maxLength={80}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor={`key-${provider.id}`}>
              Nueva API Key <span className="text-muted-foreground text-xs">(dejar vacío para no cambiarla)</span>
            </Label>
            <div className="relative">
              <Input
                id={`key-${provider.id}`}
                name="apiKey"
                type={showKey ? "text" : "password"}
                placeholder="••••••••••••••••"
                className="pr-10 font-mono text-xs"
              />
              <button
                type="button"
                onClick={() => setShowKey((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showKey ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor={`models-${provider.id}`}>
              Modelos disponibles <span className="text-muted-foreground text-xs">(uno por línea)</span>
            </Label>
            <textarea
              id={`models-${provider.id}`}
              name="models"
              value={models}
              onChange={(e) => setModels(e.target.value)}
              rows={4}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-mono resize-y"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id={`active-${provider.id}`}
              name="isActive"
              value="true"
              defaultChecked={provider.is_active}
              className="rounded"
            />
            <label htmlFor={`active-${provider.id}`} className="text-sm">Proveedor activo</label>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <input
              type="checkbox"
              id={`validate-${provider.id}`}
              name="validate"
              value="true"
              className="rounded"
            />
            <label htmlFor={`validate-${provider.id}`}>Validar key si se cambia</label>
          </div>

          {state.status === "error" && (
            <p className="text-sm text-destructive">{state.message}</p>
          )}

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">Cancelar</Button>
            </DialogClose>
            <Button type="submit" disabled={pending} className="gap-2 bg-nexus-purple hover:bg-nexus-purple/90 text-white">
              {pending && <Loader2 className="size-4 animate-spin" />}
              Guardar cambios
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

// ── Eliminar proveedor ───────────────────────────────────────────────────────

export function DeleteApiProviderButton({ provider }: { provider: ApiProvider }) {
  const [open, setOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pending, setPending] = useState(false)

  async function handleDelete() {
    setPending(true)
    const result = await deleteApiProviderAction(provider.id)
    setPending(false)
    if (result.error) {
      setError(result.error)
    } else {
      setOpen(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-1.5 h-8 text-destructive hover:text-destructive">
          <Trash2 className="size-3.5" />
          Eliminar
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>¿Eliminar proveedor?</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground">
          Se eliminará permanentemente <strong className="text-foreground">{provider.label}</strong> y su API key cifrada.
          Los bots configurados con modelos de este proveedor dejarán de funcionar.
        </p>
        {error && <p className="text-sm text-destructive">{error}</p>}
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancelar</Button>
          </DialogClose>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={pending}
            className="gap-2"
          >
            {pending && <Loader2 className="size-4 animate-spin" />}
            Eliminar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
