'use server'
import { redirect } from 'next/navigation'
import { backendFetch } from '@/lib/api'

export interface AuditLog {
  id: string
  actor_id: number
  actor_email: string
  action: string
  entity: string
  entity_id: string | null
  entity_label: string | null
  diff: {
    before: Record<string, unknown>
    after: Record<string, unknown>
  } | null
  metadata: Record<string, unknown>
  created_at: string
}

export interface AuditLogsResponse {
  data: AuditLog[]
  total: number
}

export interface AuditLogsQuery {
  page?: number
  limit?: number
  action?: string
  entity?: string
  from?: string
  to?: string
  search?: string
}

type BackendError = { message: string | string[] }

function toAuditLog(value: unknown): AuditLog | null {
  if (!value || typeof value !== 'object') return null
  const row = value as Record<string, unknown>
  if (!row.id) return null
  return {
    id: String(row.id),
    actor_id: Number(row.actor_id),
    actor_email: String(row.actor_email ?? ''),
    action: String(row.action ?? ''),
    entity: String(row.entity ?? ''),
    entity_id: row.entity_id != null ? String(row.entity_id) : null,
    entity_label: row.entity_label != null ? String(row.entity_label) : null,
    diff: (row.diff as AuditLog['diff']) ?? null,
    metadata: (row.metadata as Record<string, unknown>) ?? {},
    created_at: String(row.created_at ?? ''),
  }
}

export async function getAuditLogs(query: AuditLogsQuery = {}): Promise<AuditLogsResponse> {
  const params = new URLSearchParams()
  if (query.page) params.set('page', String(query.page))
  if (query.limit) params.set('limit', String(query.limit))
  if (query.action) params.set('action', query.action)
  if (query.entity) params.set('entity', query.entity)
  if (query.from) params.set('from', query.from)
  if (query.to) params.set('to', query.to)
  if (query.search) params.set('search', query.search)

  const qs = params.toString()
  let res: Response
  try {
    res = await backendFetch(`/audit/logs${qs ? `?${qs}` : ''}`)
  } catch {
    throw new Error('No se pudo conectar con el servidor')
  }

  if (res.status === 401) redirect('/login')

  if (!res.ok) {
    const body: BackendError = await res.json().catch(() => ({}))
    const msg = body?.message
    throw new Error(Array.isArray(msg) ? (msg[0] ?? 'Error') : (msg ?? 'Error al cargar los logs'))
  }

  const data: unknown = await res.json().catch(() => null)
  if (!data || typeof data !== 'object') throw new Error('Formato de respuesta inválido')

  const { data: rows, total } = data as { data: unknown[]; total: number }
  return {
    data: (Array.isArray(rows) ? rows : []).flatMap((r) => {
      const log = toAuditLog(r)
      return log ? [log] : []
    }),
    total: Number(total ?? 0),
  }
}

export async function getAuditActions(): Promise<string[]> {
  let res: Response
  try {
    res = await backendFetch('/audit/actions')
  } catch {
    return []
  }
  if (!res.ok) return []
  const data: unknown = await res.json().catch(() => null)
  return Array.isArray(data) ? (data as string[]) : []
}
