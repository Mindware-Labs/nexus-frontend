'use server'
import { randomBytes } from 'crypto'
import { revalidatePath } from 'next/cache'
import { CreateCustomerSchema, UpdateCustomerSchema } from '@/lib/schemas/customers'
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

type BackendError = { message: string | string[] }

function extractMessage(body: BackendError, fallback: string): string {
  const msg = body?.message
  if (Array.isArray(msg)) return msg[0] ?? fallback
  return msg ?? fallback
}

function generatePassword(): string {
  return randomBytes(12).toString('base64url')
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

export async function listCustomers(): Promise<Customer[]> {
  try {
    const res = await backendFetch('/auth/customers')
    if (!res.ok) return []
    return res.json()
  } catch {
    return []
  }
}
