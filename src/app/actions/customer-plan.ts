'use server'

import { redirect } from 'next/navigation'
import { backendFetch } from '@/lib/api'

export interface CustomerPlanUsage {
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

export async function getCustomerPlan(): Promise<CustomerPlanUsage> {
  let res: Response
  try {
    res = await backendFetch('/customer/plan')
  } catch {
    throw new Error('No se pudo conectar con el servidor')
  }
  if (res.status === 401) redirect('/login')
  if (!res.ok) throw new Error('No se pudo cargar la información del plan')
  return res.json() as Promise<CustomerPlanUsage>
}
