'use server'
import { randomBytes } from 'crypto'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { CreateCustomerSchema, UpdateCustomerSchema } from '@/lib/schemas/customers'
import type { TenantPlan } from '@/lib/schemas/tenants'
import { backendFetch } from '@/lib/api'

export type CustomerActionState =
  | { status: 'idle' }
  | { status: 'error'; message: string }
  | { status: 'success'; customerName: string }

export interface Customer {
  id: number
  name: string
  email: string
  tenant_id: number | null
  is_active: boolean
  created_at: string
}

export interface CustomerListFilters {
  name?: string
  tenantId?: number
  plan?: TenantPlan
  isActive?: boolean
}

type BackendError = { message: string | string[] }

function extractMessage(body: BackendError, fallback: string): string {
  const msg = body?.message
  if (Array.isArray(msg)) return msg[0] ?? fallback
  return msg ?? fallback
}

function generatePassword(): string {
  return randomBytes(12).toString('base64url')
}

function toCustomer(value: unknown): Customer | null {
  if (!value || typeof value !== 'object') return null

  const row = value as Record<string, unknown>
  const id = Number(row.id)
  const tenantId = row.tenant_id === null || row.tenant_id === undefined ? null : Number(row.tenant_id)

  if (!Number.isFinite(id)) return null
  if (tenantId !== null && !Number.isFinite(tenantId)) return null

  return {
    id,
    name: String(row.name ?? ''),
    email: String(row.email ?? ''),
    tenant_id: tenantId,
    is_active: row.is_active === true,
    created_at: String(row.created_at ?? ''),
  }
}

export async function createCustomerAction(
  _prev: CustomerActionState,
  formData: FormData,
): Promise<CustomerActionState> {
  const parsed = CreateCustomerSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    tenantId: formData.get('tenantId'),
  })

  if (!parsed.success) {
    return { status: 'error', message: parsed.error.issues[0]?.message ?? 'Datos inválidos' }
  }

  const password = generatePassword()

  let res: Response
  try {
    res = await backendFetch('/auth/customers', {
      method: 'POST',
      body: JSON.stringify({
        name: parsed.data.name,
        email: parsed.data.email,
        password,
        tenantId: parsed.data.tenantId,
      }),
    })
  } catch {
    return { status: 'error', message: 'No se pudo conectar con el servidor' }
  }

  if (!res.ok) {
    const body: BackendError = await res.json().catch(() => ({}))
    return {
      status: 'error',
      message: extractMessage(body, 'Error al crear el cliente'),
    }
  }

  revalidatePath('/dashboard/customers')
  return { status: 'success', customerName: parsed.data.name }
}

export async function updateCustomerAction(
  id: number,
  _prev: CustomerActionState,
  formData: FormData,
): Promise<CustomerActionState> {
  const parsed = UpdateCustomerSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    isActive: formData.get('isActive'),
  })

  if (!parsed.success) {
    return { status: 'error', message: parsed.error.issues[0]?.message ?? 'Datos inválidos' }
  }

  let res: Response
  try {
    res = await backendFetch(`/auth/customers/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({
        name: parsed.data.name,
        email: parsed.data.email,
        isActive: parsed.data.isActive,
      }),
    })
  } catch {
    return { status: 'error', message: 'No se pudo conectar con el servidor' }
  }

  if (!res.ok) {
    const body: BackendError = await res.json().catch(() => ({}))
    return {
      status: 'error',
      message: extractMessage(body, 'Error al actualizar el cliente'),
    }
  }

  revalidatePath('/dashboard/customers')
  return { status: 'success', customerName: parsed.data.name }
}

export async function listCustomers(filters: CustomerListFilters = {}): Promise<Customer[]> {
  const params = new URLSearchParams()
  if (filters.name) params.set('name', filters.name)
  if (filters.tenantId !== undefined) params.set('tenantId', String(filters.tenantId))
  if (filters.plan) params.set('plan', filters.plan)
  if (filters.isActive !== undefined) params.set('isActive', String(filters.isActive))

  const path = params.size > 0 ? `/auth/customers?${params.toString()}` : '/auth/customers'
  let res: Response
  try {
    res = await backendFetch(path)
  } catch {
    throw new Error('No se pudo conectar con el servidor para cargar los clientes')
  }

  if (res.status === 401) redirect('/login')

  if (!res.ok) {
    const body: BackendError = await res.json().catch(() => ({}))
    throw new Error(extractMessage(body, 'No se pudieron cargar los clientes'))
  }

  const data: unknown = await res.json().catch(() => null)
  if (!Array.isArray(data)) {
    throw new Error('El servidor devolvio un formato invalido al cargar los clientes')
  }

  return data.flatMap((row) => {
    const customer = toCustomer(row)
    return customer ? [customer] : []
  })
}
