'use server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { backendFetch } from '@/lib/api'

export interface ApiProvider {
  id: number
  provider: string
  label: string
  models: string[]
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface AvailableModel {
  provider: string
  label: string
  models: string[]
}

export type ApiKeyActionState =
  | { status: 'idle' }
  | { status: 'error'; message: string }
  | { status: 'success'; label: string }

type BackendError = { message: string | string[] }

function extractMessage(body: BackendError, fallback: string): string {
  const msg = body?.message
  if (Array.isArray(msg)) return msg[0] ?? fallback
  return msg ?? fallback
}

function toProvider(value: unknown): ApiProvider | null {
  if (!value || typeof value !== 'object') return null
  const row = value as Record<string, unknown>
  if (!row.id) return null
  return {
    id: Number(row.id),
    provider: String(row.provider ?? ''),
    label: String(row.label ?? ''),
    models: Array.isArray(row.models) ? (row.models as string[]) : [],
    is_active: row.is_active === true,
    created_at: String(row.created_at ?? ''),
    updated_at: String(row.updated_at ?? ''),
  }
}

export async function listApiProviders(): Promise<ApiProvider[]> {
  let res: Response
  try {
    res = await backendFetch('/api-keys')
  } catch {
    throw new Error('No se pudo conectar con el servidor')
  }
  if (res.status === 401) redirect('/login')
  if (!res.ok) {
    const body: BackendError = await res.json().catch(() => ({}))
    throw new Error(extractMessage(body, 'Error al cargar los proveedores'))
  }
  const data: unknown = await res.json().catch(() => null)
  if (!Array.isArray(data)) return []
  return data.flatMap((r) => { const p = toProvider(r); return p ? [p] : [] })
}

export async function listAvailableModels(): Promise<AvailableModel[]> {
  let res: Response
  try {
    res = await backendFetch('/api-keys/models')
  } catch {
    return []
  }
  if (!res.ok) return []
  const data: unknown = await res.json().catch(() => null)
  if (!Array.isArray(data)) return []
  return data as AvailableModel[]
}

export async function createApiProviderAction(
  _prev: ApiKeyActionState,
  formData: FormData,
): Promise<ApiKeyActionState> {
  const provider = String(formData.get('provider') ?? '').trim()
  const label = String(formData.get('label') ?? '').trim()
  const apiKey = String(formData.get('apiKey') ?? '').trim()
  const modelsRaw = String(formData.get('models') ?? '').trim()
  const validate = formData.get('validate') === 'true'

  if (!provider || !label || !apiKey) {
    return { status: 'error', message: 'Proveedor, nombre y API key son obligatorios' }
  }

  const models = modelsRaw
    .split('\n')
    .map((m) => m.trim())
    .filter(Boolean)

  let res: Response
  try {
    res = await backendFetch('/api-keys', {
      method: 'POST',
      body: JSON.stringify({ provider, label, apiKey, models, validate }),
    })
  } catch {
    return { status: 'error', message: 'No se pudo conectar con el servidor' }
  }

  if (!res.ok) {
    const body: BackendError = await res.json().catch(() => ({}))
    return { status: 'error', message: extractMessage(body, 'Error al crear el proveedor') }
  }

  revalidatePath('/dashboard/api-keys')
  return { status: 'success', label }
}

export async function updateApiProviderAction(
  id: number,
  _prev: ApiKeyActionState,
  formData: FormData,
): Promise<ApiKeyActionState> {
  const label = String(formData.get('label') ?? '').trim() || undefined
  const apiKey = String(formData.get('apiKey') ?? '').trim() || undefined
  const modelsRaw = String(formData.get('models') ?? '').trim()
  const isActiveRaw = formData.get('isActive')
  const validate = formData.get('validate') === 'true'

  const models = modelsRaw
    ? modelsRaw.split('\n').map((m) => m.trim()).filter(Boolean)
    : undefined

  const isActive =
    isActiveRaw === 'true' ? true : isActiveRaw === 'false' ? false : undefined

  let res: Response
  try {
    res = await backendFetch(`/api-keys/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ label, apiKey, models, isActive, validate }),
    })
  } catch {
    return { status: 'error', message: 'No se pudo conectar con el servidor' }
  }

  if (!res.ok) {
    const body: BackendError = await res.json().catch(() => ({}))
    return { status: 'error', message: extractMessage(body, 'Error al actualizar el proveedor') }
  }

  revalidatePath('/dashboard/api-keys')
  return { status: 'success', label: label ?? '' }
}

export async function deleteApiProviderAction(id: number): Promise<{ error?: string }> {
  let res: Response
  try {
    res = await backendFetch(`/api-keys/${id}`, { method: 'DELETE' })
  } catch {
    return { error: 'No se pudo conectar con el servidor' }
  }

  if (!res.ok) {
    const body: BackendError = await res.json().catch(() => ({}))
    return { error: extractMessage(body, 'Error al eliminar el proveedor') }
  }

  revalidatePath('/dashboard/api-keys')
  return {}
}
