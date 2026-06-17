'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { backendFetch } from '@/lib/api'

export interface Plan {
  id: number
  name: string
  description: string
  priceMonthly: number
  maxConversationsPerMonth: number | null
  maxTokensPerMonth: number | null
  maxLeadsPerMonth: number | null
  allowedModels: string[]
  isActive: boolean
  sortOrder: number
  createdAt: string
  updatedAt: string
}

export interface UsageSummary {
  conversationsCount: number
  tokensCount: number
  leadsCount: number
  year: number
  month: number
  maxConversations: number | null
  maxTokens: number | null
  maxLeads: number | null
  planName: string
  planId: number | null
  conversationsPercent: number
  tokensPercent: number
  leadsPercent: number
}

export type PlanActionState =
  | { status: 'idle' }
  | { status: 'error'; message: string }
  | { status: 'success' }

type BackendError = { message: string | string[] }
function extractMsg(b: BackendError, fallback: string) {
  const m = b?.message
  if (Array.isArray(m)) return m[0] ?? fallback
  return m ?? fallback
}

export async function getPlans(): Promise<Plan[]> {
  let res: Response
  try { res = await backendFetch('/plans') } catch { throw new Error('Sin conexión') }
  if (res.status === 401) redirect('/login')
  if (!res.ok) { const b: BackendError = await res.json().catch(() => ({})); throw new Error(extractMsg(b, 'Error al cargar planes')) }
  return res.json() as Promise<Plan[]>
}

function toPlanBody(p: Omit<Plan, 'id' | 'createdAt' | 'updatedAt'>) {
  return {
    name: p.name,
    description: p.description,
    priceMonthly: p.priceMonthly,
    maxConversationsPerMonth: p.maxConversationsPerMonth,
    maxTokensPerMonth: p.maxTokensPerMonth,
    maxLeadsPerMonth: p.maxLeadsPerMonth,
    allowedModels: p.allowedModels,
    isActive: p.isActive,
    sortOrder: p.sortOrder,
  }
}

export async function createPlanAction(_prev: PlanActionState, payload: Omit<Plan, 'id' | 'createdAt' | 'updatedAt'>): Promise<PlanActionState> {
  let res: Response
  try { res = await backendFetch('/plans', { method: 'POST', body: JSON.stringify(toPlanBody(payload)) }) } catch { return { status: 'error', message: 'Sin conexión' } }
  if (res.status === 401) redirect('/login')
  if (!res.ok) { const b: BackendError = await res.json().catch(() => ({})); return { status: 'error', message: extractMsg(b, 'Error al crear plan') } }
  revalidatePath('/dashboard/plans')
  return { status: 'success' }
}

export async function updatePlanAction(_prev: PlanActionState, payload: Plan): Promise<PlanActionState> {
  let res: Response
  try { res = await backendFetch(`/plans/${payload.id}`, { method: 'PUT', body: JSON.stringify(toPlanBody(payload)) }) } catch { return { status: 'error', message: 'Sin conexión' } }
  if (res.status === 401) redirect('/login')
  if (!res.ok) { const b: BackendError = await res.json().catch(() => ({})); return { status: 'error', message: extractMsg(b, 'Error al actualizar plan') } }
  revalidatePath('/dashboard/plans')
  revalidatePath('/dashboard/tenants')
  revalidatePath('/dashboard/customers')
  revalidatePath('/panel/plan')
  return { status: 'success' }
}

export async function deletePlanAction(id: number): Promise<PlanActionState> {
  let res: Response
  try { res = await backendFetch(`/plans/${id}`, { method: 'DELETE' }) } catch { return { status: 'error', message: 'Sin conexión' } }
  if (res.status === 401) redirect('/login')
  if (!res.ok) { const b: BackendError = await res.json().catch(() => ({})); return { status: 'error', message: extractMsg(b, 'Error al eliminar plan') } }
  revalidatePath('/dashboard/plans')
  return { status: 'success' }
}

export async function getTenantUsage(tenantId: number): Promise<UsageSummary> {
  let res: Response
  try { res = await backendFetch(`/tenants/${tenantId}/usage`) } catch { throw new Error('Sin conexión') }
  if (res.status === 401) redirect('/login')
  if (!res.ok) throw new Error('Error al cargar uso')
  return res.json() as Promise<UsageSummary>
}

export async function assignPlanAction(tenantId: number, planId: number | null): Promise<PlanActionState> {
  let res: Response
  try { res = await backendFetch(`/tenants/${tenantId}`, { method: 'PATCH', body: JSON.stringify({ planId }) }) } catch { return { status: 'error', message: 'Sin conexión' } }
  if (res.status === 401) redirect('/login')
  if (!res.ok) { const b: BackendError = await res.json().catch(() => ({})); return { status: 'error', message: extractMsg(b, 'Error al asignar plan') } }
  revalidatePath('/dashboard/tenants')
  revalidatePath('/dashboard/plans')
  revalidatePath('/panel/plan')
  return { status: 'success' }
}
