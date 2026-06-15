'use server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
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
const TENANT_PLAN_VALUES = ['trial', 'starter', 'pro', 'enterprise'] as const

function extractMessage(body: BackendError, fallback: string): string {
  const msg = body?.message
  if (Array.isArray(msg)) return msg[0] ?? fallback
  return msg ?? fallback
}

function toTenantPlan(value: unknown): Tenant['plan'] {
  return TENANT_PLAN_VALUES.includes(value as Tenant['plan']) ? value as Tenant['plan'] : 'trial'
}

function toTenant(value: unknown): Tenant | null {
  if (!value || typeof value !== 'object') return null

  const row = value as Record<string, unknown>
  const tenantId = Number(row.tenant_id)

  if (!Number.isFinite(tenantId)) return null

  return {
    tenant_id: tenantId,
    name: String(row.name ?? ''),
    slug: String(row.slug ?? ''),
    plan: toTenantPlan(row.plan),
    is_active: row.is_active === true,
    created_at: String(row.created_at ?? ''),
    updated_at: String(row.updated_at ?? ''),
  }
}

function toTenantOption(value: unknown): TenantOption | null {
  if (!value || typeof value !== 'object') return null

  const row = value as Record<string, unknown>
  const tenantId = Number(row.tenant_id)

  if (!Number.isFinite(tenantId)) return null

  return {
    tenant_id: tenantId,
    name: String(row.name ?? ''),
    plan: toTenantPlan(row.plan),
    is_active: row.is_active === true,
  }
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
  let res: Response
  try {
    res = await backendFetch('/tenants')
  } catch {
    throw new Error('No se pudo conectar con el servidor para cargar los tenants')
  }

  if (res.status === 401) redirect('/login')

  if (!res.ok) {
    const body: BackendError = await res.json().catch(() => ({}))
    throw new Error(extractMessage(body, 'No se pudieron cargar los tenants'))
  }

  const data: unknown = await res.json().catch(() => null)
  if (!Array.isArray(data)) {
    throw new Error('El servidor devolvio un formato invalido al cargar los tenants')
  }

  return data.flatMap((row) => {
    const tenant = toTenant(row)
    return tenant ? [tenant] : []
  })
}

export async function listActiveTenants(): Promise<TenantOption[]> {
  let res: Response
  try {
    res = await backendFetch('/tenants/active')
  } catch {
    throw new Error('No se pudo conectar con el servidor para cargar los tenants activos')
  }

  if (res.status === 401) redirect('/login')

  if (!res.ok) {
    const body: BackendError = await res.json().catch(() => ({}))
    throw new Error(extractMessage(body, 'No se pudieron cargar los tenants activos'))
  }

  const data: unknown = await res.json().catch(() => null)
  if (!Array.isArray(data)) {
    throw new Error('El servidor devolvio un formato invalido al cargar los tenants activos')
  }

  return data.flatMap((row) => {
    const tenant = toTenantOption(row)
    return tenant ? [tenant] : []
  })
}
