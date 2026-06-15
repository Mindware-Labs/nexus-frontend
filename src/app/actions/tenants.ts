'use server'
import { revalidatePath } from 'next/cache'
import { CreateTenantSchema, UpdateTenantSchema } from '@/lib/schemas/tenants'
import { backendFetch } from '@/lib/api'

export type TenantActionState =
  | { status: 'idle' }
  | { status: 'error'; message: string }
  | { status: 'success'; tenantName: string }

export interface Tenant {
  tenant_id: number
  name: string
  slug: string
  plan: 'trial' | 'starter' | 'pro' | 'enterprise'
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface TenantOption {
  tenant_id: number
  name: string
  plan: 'trial' | 'starter' | 'pro' | 'enterprise'
  is_active: boolean
}

type BackendError = { message: string | string[] }

function extractMessage(body: BackendError, fallback: string): string {
  const msg = body?.message
  if (Array.isArray(msg)) return msg[0] ?? fallback
  return msg ?? fallback
}

export async function createTenantAction(
  _prev: TenantActionState,
  formData: FormData,
): Promise<TenantActionState> {
  const parsed = CreateTenantSchema.safeParse({
    name: formData.get('name'),
    plan: formData.get('plan'),
  })

  if (!parsed.success) {
    return { status: 'error', message: parsed.error.issues[0]?.message ?? 'Datos inválidos' }
  }

  let res: Response
  try {
    res = await backendFetch('/tenants', {
      method: 'POST',
      body: JSON.stringify(parsed.data),
    })
  } catch {
    return { status: 'error', message: 'No se pudo conectar con el servidor' }
  }

  if (!res.ok) {
    const body: BackendError = await res.json().catch(() => ({}))
    return { status: 'error', message: extractMessage(body, 'Error al crear el tenant') }
  }

  revalidatePath('/dashboard/tenants')
  revalidatePath('/dashboard/customers')
  return { status: 'success', tenantName: parsed.data.name }
}

export async function updateTenantAction(
  id: number,
  _prev: TenantActionState,
  formData: FormData,
): Promise<TenantActionState> {
  const parsed = UpdateTenantSchema.safeParse({
    name: formData.get('name') || undefined,
    plan: formData.get('plan') || undefined,
    is_active: formData.get('is_active') === 'true' ? true : formData.get('is_active') === 'false' ? false : undefined,
  })

  if (!parsed.success) {
    return { status: 'error', message: parsed.error.issues[0]?.message ?? 'Datos inválidos' }
  }

  let res: Response
  try {
    res = await backendFetch(`/tenants/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(parsed.data),
    })
  } catch {
    return { status: 'error', message: 'No se pudo conectar con el servidor' }
  }

  if (!res.ok) {
    const body: BackendError = await res.json().catch(() => ({}))
    return { status: 'error', message: extractMessage(body, 'Error al actualizar el tenant') }
  }

  revalidatePath('/dashboard/tenants')
  return { status: 'success', tenantName: parsed.data.name ?? '' }
}

export async function listTenants(): Promise<Tenant[]> {
  try {
    const res = await backendFetch('/tenants')
    if (!res.ok) return []
    return res.json()
  } catch {
    return []
  }
}

export async function listActiveTenants(): Promise<TenantOption[]> {
  try {
    const res = await backendFetch('/tenants/active')
    if (!res.ok) return []
    return res.json()
  } catch {
    return []
  }
}
