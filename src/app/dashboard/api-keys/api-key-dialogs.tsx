"use client"

import { useActionState, useState, useTransition } from "react"
import { KeyRound, Loader2, Plus, Trash2, PencilLine, Eye, EyeOff, RefreshCw, CheckSquare, Square } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
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
  fetchModelsFromProvider,
  fetchModelsForExisting,
  type ApiProvider,
  type ApiKeyActionState,
} from "@/app/actions/api-keys"

const PROVIDERS = [
  { value: "gemini", label: "Google Gemini" },
  { value: "openai", label: "OpenAI" },
  { value: "anthropic", label: "Anthropic" },
]

const initialState: ApiKeyActionState = { status: "idle" }

// ── Selector de modelos con fetch al proveedor ────────────────────────────────

function ModelSelector({
  provider,
  apiKey,
  existingId,
  selected,
  onChange,
}: {
  provider: string
  apiKey: string
  existingId?: number
  selected: string[]
  onChange: (models: string[]) => void
}) {
  const [available, setAvailable] = useState<string[]>([])
  const [fetched, setFetched] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  function toggle(model: string) {
    onChange(
      selected.includes(model)
        ? selected.filter((m) => m !== model)
        : [...selected, model],
    )
  }

  function handleFetch() {
    // En edición: si no escribió nueva key, usa la de BD
    const useExisting = existingId !== undefined && !apiKey.trim()
    if (!useExisting && !apiKey.trim()) {
      setError("Ingresa la API key primero")
      return
    }
    setError(null)
    startTransition(async () => {
      const result = useExisting
        ? await fetchModelsForExisting(existingId!)
        : await fetchModelsFromProvider(provider, apiKey.trim())
      if ("error" in result) {
        setError(result.error)
      } else {
        setAvailable(result.models)
        setFetched(true)
        onChange(selected.filter((m) => result.models.includes(m)))
      }
    })
  }

  if (!fetched) {
    return (
      <div className="space-y-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleFetch}
          disabled={isPending}
          className="gap-2 w-full"
        >
          {isPending
            ? <Loader2 className="size-4 animate-spin" />
            : <RefreshCw className="size-4" />}
          {isPending
            ? "Consultando modelos..."
            : existingId !== undefined && !apiKey.trim()
            ? "Obtener modelos (key guardada)"
            : "Obtener modelos del proveedor"}
        </Button>
        {error && <p className="text-xs text-destructive">{error}</p>}
        {selected.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {selected.map((m) => (
              <Badge key={m} variant="secondary" className="font-mono text-xs">{m}</Badge>
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">{available.length} modelos disponibles</span>
        <button
          type="button"
          onClick={handleFetch}
          disabled={isPending}
          className="text-xs text-nexus-purple hover:underline flex items-center gap-1"
        >
          <RefreshCw className="size-3" />
          Actualizar
        </button>
      </div>
      <div className="max-h-48 overflow-y-auto rounded-md border divide-y">
        {available.map((model) => {
          const checked = selected.includes(model)
          return (
            <button
              key={model}
              type="button"
              onClick={() => toggle(model)}
              className="flex w-full items-center gap-2.5 px-3 py-2 text-left text-sm hover:bg-muted/50 transition-colors"
            >
              {checked
                ? <CheckSquare className="size-4 shrink-0 text-nexus-purple" />
                : <Square className="size-4 shrink-0 text-muted-foreground/50" />}
              <span className="font-mono text-xs">{model}</span>
            </button>
          )
        })}
      </div>
      {error && <p className="text-xs text-destructive">{error}</p>}
      {selected.length === 0 && (
        <p className="text-xs text-amber-600">Selecciona al menos un modelo</p>
      )}
    </div>
  )
}

// ── Crear proveedor ───────────────────────────────────────────────────────────

export function AddApiProviderDialog() {
  const [open, setOpen] = useState(false)
  const [showKey, setShowKey] = useState(false)
  const [selectedProvider, setSelectedProvider] = useState("gemini")
  const [apiKey, setApiKey] = useState("")
  const [selectedModels, setSelectedModels] = useState<string[]>([])

  const [state, formAction, pending] = useActionState(
    async (_prev: ApiKeyActionState, formData: FormData) => {
      formData.set("modelsJson", JSON.stringify(selectedModels))
      const result = await createApiProviderAction(_prev, formData)
      if (result.status === "success") {
        setOpen(false)
        setApiKey("")
        setSelectedModels([])
      }
      return result
    },
    initialState,
  )

  function handleOpenChange(v: boolean) {
    setOpen(v)
    if (!v) { setApiKey(""); setSelectedModels([]) }
  }

  function handleProviderChange(val: string) {
    setSelectedProvider(val)
    setSelectedModels([])
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
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
                value={apiKey}
                onChange={(e) => { setApiKey(e.target.value); setSelectedModels([]) }}
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
            <Label>Modelos disponibles</Label>
            <ModelSelector
              provider={selectedProvider}
              apiKey={apiKey}
              selected={selectedModels}
              onChange={setSelectedModels}
            />
          </div>

          {state.status === "error" && (
            <p className="text-sm text-destructive">{state.message}</p>
          )}

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">Cancelar</Button>
            </DialogClose>
            <Button
              type="submit"
              disabled={pending || selectedModels.length === 0}
              className="gap-2 bg-nexus-purple hover:bg-nexus-purple/90 text-white"
            >
              {pending && <Loader2 className="size-4 animate-spin" />}
              Guardar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

// ── Editar proveedor ──────────────────────────────────────────────────────────

export function EditApiProviderDialog({ provider }: { provider: ApiProvider }) {
  const [open, setOpen] = useState(false)
  const [showKey, setShowKey] = useState(false)
  const [apiKey, setApiKey] = useState("")
  const [selectedModels, setSelectedModels] = useState<string[]>(provider.models)

  const [state, formAction, pending] = useActionState(
    async (_prev: ApiKeyActionState, formData: FormData) => {
      formData.set("modelsJson", JSON.stringify(selectedModels))
      const result = await updateApiProviderAction(provider.id, _prev, formData)
      if (result.status === "success") setOpen(false)
      return result
    },
    initialState,
  )

  function handleOpenChange(v: boolean) {
    setOpen(v)
    if (!v) { setApiKey(""); setSelectedModels(provider.models) }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
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
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
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
            <Label>Modelos disponibles</Label>
            <ModelSelector
              provider={provider.provider}
              apiKey={apiKey}
              existingId={provider.id}
              selected={selectedModels}
              onChange={setSelectedModels}
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

          {state.status === "error" && (
            <p className="text-sm text-destructive">{state.message}</p>
          )}

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">Cancelar</Button>
            </DialogClose>
            <Button
              type="submit"
              disabled={pending || selectedModels.length === 0}
              className="gap-2 bg-nexus-purple hover:bg-nexus-purple/90 text-white"
            >
              {pending && <Loader2 className="size-4 animate-spin" />}
              Guardar cambios
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

// ── Eliminar proveedor ────────────────────────────────────────────────────────

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
