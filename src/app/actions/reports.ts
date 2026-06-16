'use server'
import { redirect } from 'next/navigation'
import { backendFetch } from '@/lib/api'

export type Period = '7d' | '30d' | 'month' | '3m' | 'all'

// REP-12 + REP-14
export interface TopicsReport {
  topKeywords: Array<{ word: string; count: number }>
  aiTopics: Array<{ topic: string; count: number }>
  intents: Array<{ intent: string; count: number }>
  sentiments: { positive: number; neutral: number; negative: number }
  totalAnalyzed: number
  pendingAnalysis: number
}

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
  score: number | null
  classification: string | null
  next_action: string | null
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

function periodToDates(period: Period): { from: string; to: string } {
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

export async function getTopicsReport(period: Period): Promise<TopicsReport> {
  const { from, to } = periodToDates(period)
  const params = new URLSearchParams({ from, to })

  let res: Response
  try {
    res = await backendFetch(`/bot/reports/topics?${params}`)
  } catch {
    throw new Error('No se pudo conectar con el servidor')
  }

  if (res.status === 401) redirect('/login')
  if (!res.ok) {
    const body: BackendError = await res.json().catch(() => ({}))
    throw new Error(extractMessage(body, 'No se pudo cargar el análisis de temas'))
  }

  return res.json() as Promise<TopicsReport>
}

export async function getCustomerTopicsReport(
  customerId: number,
  period: Period,
): Promise<TopicsReport> {
  const { from, to } = periodToDates(period)
  const params = new URLSearchParams({ from, to })

  let res: Response
  try {
    res = await backendFetch(`/bot/customers/${customerId}/topics?${params}`)
  } catch {
    throw new Error('No se pudo conectar con el servidor')
  }

  if (res.status === 401) redirect('/login')
  if (!res.ok) {
    const body: BackendError = await res.json().catch(() => ({}))
    throw new Error(extractMessage(body, 'No se pudo cargar el análisis de temas del cliente'))
  }

  return res.json() as Promise<TopicsReport>
}

export async function triggerTopicBatch(): Promise<void> {
  let res: Response
  try {
    res = await backendFetch('/bot/reports/topics/run-batch', { method: 'POST' })
  } catch {
    throw new Error('No se pudo conectar con el servidor')
  }
  if (res.status === 401) redirect('/login')
}
