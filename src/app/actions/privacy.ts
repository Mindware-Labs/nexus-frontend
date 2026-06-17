'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { backendFetch } from '@/lib/api'

export interface PrivacySettings {
  consentText: string
  privacyPolicyUrl: string
  policyText: string
  retentionMonthsConversations: number
  retentionMonthsLeads: number
  updatedAt: string | null
}

export type PrivacyActionState =
  | { status: 'idle' }
  | { status: 'error'; message: string }
  | { status: 'success' }

type BackendError = { message: string | string[] }

function extractMessage(body: BackendError, fallback: string): string {
  const msg = body?.message
  if (Array.isArray(msg)) return msg[0] ?? fallback
  return msg ?? fallback
}

export async function getPrivacySettings(): Promise<PrivacySettings> {
  let res: Response
  try {
    res = await backendFetch('/bot/privacy')
  } catch {
    throw new Error('No se pudo conectar con el servidor')
  }
  if (res.status === 401) redirect('/login')
  if (!res.ok) {
    const body: BackendError = await res.json().catch(() => ({}))
    throw new Error(extractMessage(body, 'No se pudo cargar la política de privacidad'))
  }
  return res.json() as Promise<PrivacySettings>
}

export async function savePrivacyAction(
  _prev: PrivacyActionState,
  payload: Omit<PrivacySettings, 'updatedAt'>,
): Promise<PrivacyActionState> {
  let res: Response
  try {
    res = await backendFetch('/bot/privacy', {
      method: 'PUT',
      body: JSON.stringify(payload),
    })
  } catch {
    return { status: 'error', message: 'No se pudo conectar con el servidor' }
  }
  if (res.status === 401) redirect('/login')
  if (!res.ok) {
    const body: BackendError = await res.json().catch(() => ({}))
    return { status: 'error', message: extractMessage(body, 'No se pudo guardar la política') }
  }
  revalidatePath('/dashboard/privacy')
  return { status: 'success' }
}

// Customer: solo lectura
export async function getCustomerPrivacySettings(): Promise<PrivacySettings> {
  let res: Response
  try {
    res = await backendFetch('/customer/privacy')
  } catch {
    throw new Error('No se pudo conectar con el servidor')
  }
  if (res.status === 401) redirect('/login')
  if (!res.ok) {
    const body: BackendError = await res.json().catch(() => ({}))
    throw new Error(extractMessage(body, 'No se pudo cargar la política de privacidad'))
  }
  return res.json() as Promise<PrivacySettings>
}
