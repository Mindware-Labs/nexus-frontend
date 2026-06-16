'use server'
import { redirect } from 'next/navigation'
import { backendFetch } from '@/lib/api'

export type Period = '7d' | '30d' | 'month' | '3m' | 'all'

export interface TrendPoint {
  date: string
  conversations: number
  leads: number
}

export interface ClientRankingRow {
  customerId: number
  customerName: string
  conversations: number
  leads: number
  promptTokens: number
  completionTokens: number
  totalTokens: number
  estimatedCostUsd: number
}

export interface GlobalReports {
  period: { from: string; to: string }
  totalConversations: number
  totalLeads: number
  promptTokens: number
  completionTokens: number
  totalTokens: number
  estimatedCostUsd: number
  clientRanking: ClientRankingRow[]
  trend: TrendPoint[]
}

export interface LeadRow {
  id: string
  name: string | null
  email: string | null
  phone: string | null
  company: string | null
  summary: string
  transcript: Array<{ role: 'user' | 'bot'; text: string }>
  created_at: string
}

export interface CustomerReports {
  period: { from: string; to: string }
  customerName: string
  customerEmail: string
  lastActivity: string | null
  conversations: number
  leads: number
  conversionRate: number
  promptTokens: number
  completionTokens: number
  totalTokens: number
  estimatedCostUsd: number
  modelsUsed: Array<{ model: string; count: number; tokens: number }>
  trend: TrendPoint[]
  leadsList: LeadRow[]
}

export function periodToDates(period: Period): { from: string; to: string } {
  const now = new Date()
  const to = now.toISOString().split('T')[0]

  switch (period) {
    case '7d': {
      const from = new Date(now)
      from.setDate(from.getDate() - 6)
      return { from: from.toISOString().split('T')[0], to }
    }
    case '30d': {
      const from = new Date(now)
      from.setDate(from.getDate() - 29)
      return { from: from.toISOString().split('T')[0], to }
    }
    case 'month': {
      const from = new Date(now.getFullYear(), now.getMonth(), 1)
      return { from: from.toISOString().split('T')[0], to }
    }
    case '3m': {
      const from = new Date(now)
      from.setMonth(from.getMonth() - 3)
      return { from: from.toISOString().split('T')[0], to }
    }
    case 'all':
      return { from: '2020-01-01', to }
  }
}

type BackendError = { message: string | string[] }

function extractMessage(body: BackendError, fallback: string): string {
  const msg = body?.message
  if (Array.isArray(msg)) return msg[0] ?? fallback
  return msg ?? fallback
}

export async function getGlobalReports(period: Period): Promise<GlobalReports> {
  const { from, to } = periodToDates(period)
  const params = new URLSearchParams({ from, to })

  let res: Response
  try {
    res = await backendFetch(`/bot/reports/global?${params}`)
  } catch {
    throw new Error('No se pudo conectar con el servidor')
  }

  if (res.status === 401) redirect('/login')
  if (!res.ok) {
    const body: BackendError = await res.json().catch(() => ({}))
    throw new Error(extractMessage(body, 'No se pudieron cargar los reportes'))
  }

  return res.json() as Promise<GlobalReports>
}

export async function getCustomerReports(
  customerId: number,
  period: Period,
): Promise<CustomerReports> {
  const { from, to } = periodToDates(period)
  const params = new URLSearchParams({ from, to })

  let res: Response
  try {
    res = await backendFetch(`/bot/customers/${customerId}/reports?${params}`)
  } catch {
    throw new Error('No se pudo conectar con el servidor')
  }

  if (res.status === 401) redirect('/login')
  if (!res.ok) {
    const body: BackendError = await res.json().catch(() => ({}))
    throw new Error(extractMessage(body, 'No se pudo cargar el reporte del cliente'))
  }

  return res.json() as Promise<CustomerReports>
}
