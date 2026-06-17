'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { backendFetch, backendFetchFormData } from '@/lib/api'
import type { TopicsReport } from '@/app/actions/reports'

// ── Tipos compartidos con el panel ────────────────────────────────────────
export interface PlanInfo {
  plan: string
  planLabel: string
  monthlyLimit: number | null
  used: number
  remaining: number | null
  percentage: number
  unlimited: boolean
  cycleStart: string
  renewalDate: string
  tenantName: string | null
}

export interface RecentLead {
  name: string | null
  email: string | null
  phone: string | null
  company: string | null
  summary: string
  created_at: string
  score: number | null
  classification: string | null
}

export interface DashboardData {
  customerName: string
  customerEmail: string
  lastActivity: string | null
  recentLeads: RecentLead[]
  conversationsToday: number
  conversationsWeek: number
  conversationsMonth: number
  leadsToday: number
  leadsWeek: number
  leadsMonth: number
  conversionRate: number
  plan: PlanInfo
  isBotActive: boolean
  isBotActiveEffective: boolean
  assistantName: string
}

export type LeadStatus = 'nuevo' | 'en_proceso' | 'cerrado_ganado' | 'cerrado_perdido'

export interface ScoringBreakdownItem {
  criterion: string
  maxScore: number
  earned: number
  met: boolean
  evidence: string
}

export interface LeadListItem {
  id: string
  name: string | null
  email: string | null
  phone: string | null
  company: string | null
  summary: string
  created_at: string
  score: number | null
  classification: string | null
  status: LeadStatus
  next_action: string | null
  scoring_breakdown: ScoringBreakdownItem[] | null
}

export interface LeadDetail extends LeadListItem {
  transcript: Array<{ role: 'user' | 'bot'; text: string }>
  notes: string | null
  qualified_needs: string | null
  budget: string | null
  urgency: string | null
  timeline: string | null
  priority: string | null
  scoring_breakdown: ScoringBreakdownItem[] | null
}

export interface ConversationListItem {
  id: string
  sessionId: string
  messageCount: number
  leadId: string | null
  isRelevant: boolean
  startedAt: string
  lastMessageAt: string
  durationSeconds: number
  preview: string
}

export interface ConversationDetail {
  id: string
  sessionId: string
  transcript: Array<{ role: 'user' | 'bot'; text: string }>
  messageCount: number
  leadId: string | null
  isRelevant: boolean
  startedAt: string
  lastMessageAt: string
  durationSeconds: number
}

export interface AnalyticsData {
  period: { from: string; to: string }
  series: Array<{ date: string; conversations: number; leads: number }>
  avgDurationSeconds: number
  totalConversations: number
  peakHours: Array<{ hour: number; count: number }>
  comparison: {
    current: { conversations: number; leads: number; rate: number }
    previous: { conversations: number; leads: number; rate: number }
  }
}

export interface CustomerBotConfig {
  customerId: number
  clientId: string
  assistantName: string
  avatarMode: 'icon' | 'emoji' | 'image'
  avatarValue: string
  supportedLanguages: string[]
  tone: 'formal' | 'tecnico' | 'amigable' | 'consultivo' | 'directo'
  llmProvider: string
  llmModel: string
  temperature: number
  maxTokens: number
  systemPromptHtml: string
  productsServices: Array<Record<string, unknown>>
  businessRules: Array<Record<string, unknown>>
  pricingRules: Array<Record<string, unknown>>
  diagnosticQuestions: Array<Record<string, unknown>>
  leadCaptureMoment: 'early' | 'after_interest' | 'after_diagnostics' | 'before_closing'
  contactFields: Array<{ key: string; label: string; enabled: boolean; required: boolean }>
  notificationEmails: string[]
  closingMessage: string
  welcomeMessage: string
  fallbackMessage: string
  widgetPrimaryColor: string
  widgetPosition: 'left' | 'right'
  launcherText: string
  websiteUrl: string
  snippet: string
  widgetUrl: string
  isBotActive: boolean
  isBotActiveEffective: boolean
  notifyOnLead: boolean
  summaryFrequency: 'none' | 'daily' | 'weekly'
  tenantId: number | null
  tenantName: string | null
  tenantSector: string
  tenantLogoUrl: string
  scoringThreshold: number
  scoringRubric: Array<{ criterion: string; maxScore: number; description: string }>
}

export type Period = '7d' | '30d' | 'month' | '3m' | 'all'

// ── Helpers ────────────────────────────────────────────────────────────────
type BackendError = { message: string | string[] }

function extractMessage(body: BackendError, fallback: string): string {
  const msg = body?.message
  if (Array.isArray(msg)) return msg[0] ?? fallback
  return msg ?? fallback
}

function periodToDates(period: Period): { from: string; to: string } {
  const now = new Date()
  const to = now.toISOString().split('T')[0]
  switch (period) {
    case '7d': {
      const from = new Date(now); from.setDate(from.getDate() - 6)
      return { from: from.toISOString().split('T')[0], to }
    }
    case '30d': {
      const from = new Date(now); from.setDate(from.getDate() - 29)
      return { from: from.toISOString().split('T')[0], to }
    }
    case 'month': {
      const from = new Date(now.getFullYear(), now.getMonth(), 1)
      return { from: from.toISOString().split('T')[0], to }
    }
    case '3m': {
      const from = new Date(now); from.setMonth(from.getMonth() - 3)
      return { from: from.toISOString().split('T')[0], to }
    }
    case 'all':
      return { from: '2020-01-01', to }
  }
}

async function getJson<T>(path: string, fallback: string): Promise<T> {
  let res: Response
  try {
    res = await backendFetch(path)
  } catch {
    throw new Error('No se pudo conectar con el servidor')
  }
  if (res.status === 401) redirect('/login')
  if (!res.ok) {
    const body: BackendError = await res.json().catch(() => ({}))
    throw new Error(extractMessage(body, fallback))
  }
  return res.json() as Promise<T>
}

async function mutate<T>(path: string, init: RequestInit, fallback: string): Promise<T> {
  let res: Response
  try {
    res = await backendFetch(path, init)
  } catch {
    throw new Error('No se pudo conectar con el servidor')
  }
  if (res.status === 401) redirect('/login')
  if (!res.ok) {
    const body: BackendError = await res.json().catch(() => ({}))
    throw new Error(extractMessage(body, fallback))
  }
  return res.json().catch(() => ({})) as Promise<T>
}

// ── Dashboard (CUS-01..06) ─────────────────────────────────────────────────
export async function getDashboard(): Promise<DashboardData> {
  return getJson<DashboardData>('/customer/dashboard', 'No se pudo cargar el panel')
}

export async function getPlan(): Promise<PlanInfo> {
  return getJson<PlanInfo>('/customer/plan', 'No se pudo cargar el plan')
}

// ── Chatbot (CUS-07..12) ───────────────────────────────────────────────────
export async function getBotConfig(): Promise<CustomerBotConfig> {
  return getJson<CustomerBotConfig>('/customer/bot/config', 'No se pudo cargar la configuración')
}

export async function toggleBotAction(active: boolean): Promise<void> {
  await mutate(`/customer/bot/toggle?active=${active}`, { method: 'PATCH' }, 'No se pudo cambiar el estado del bot')
  revalidatePath('/panel')
  revalidatePath('/panel/chatbot')
}

export async function savePresentationAction(formData: FormData): Promise<void> {
  const payload = {
    assistantName: String(formData.get('assistantName') ?? '').trim(),
    avatarMode: String(formData.get('avatarMode') ?? 'icon'),
    avatarValue: String(formData.get('avatarValue') ?? '').trim(),
    widgetPrimaryColor: String(formData.get('widgetPrimaryColor') ?? '#6D28D9').trim(),
    widgetPosition: String(formData.get('widgetPosition') ?? 'right'),
    launcherText: String(formData.get('launcherText') ?? '').trim(),
    welcomeMessage: String(formData.get('welcomeMessage') ?? '').trim(),
    closingMessage: String(formData.get('closingMessage') ?? '').trim(),
    notificationEmails: String(formData.get('notificationEmails') ?? '')
      .split(/[\n,;]+/)
      .map((e) => e.trim().toLowerCase())
      .filter(Boolean),
  }
  await mutate('/customer/bot/presentation', {
    method: 'PATCH',
    body: JSON.stringify(payload),
  }, 'No se pudo guardar la presentación')
  revalidatePath('/panel/chatbot')
  redirect('/panel/chatbot?saved=1')
}

export async function previewChatAction(
  message: string,
  history: Array<{ role: 'user' | 'bot'; text: string }>,
): Promise<{ reply: string; assistantName: string }> {
  return mutate('/customer/bot/preview-chat', {
    method: 'POST',
    body: JSON.stringify({ message, history }),
  }, 'No se pudo generar la respuesta')
}

export async function uploadAvatarAction(formData: FormData): Promise<{ avatarUrl: string }> {
  const res = await backendFetchFormData('/customer/bot/avatar', formData)
  if (res.status === 401) redirect('/login')
  if (!res.ok) {
    const body: BackendError = await res.json().catch(() => ({}))
    throw new Error(extractMessage(body, 'No se pudo subir el avatar'))
  }
  return res.json() as Promise<{ avatarUrl: string }>
}

// ── Leads (CUS-13..18) ─────────────────────────────────────────────────────
export async function getLeads(filters: {
  status?: string
  search?: string
  from?: string
  to?: string
}): Promise<LeadListItem[]> {
  const params = new URLSearchParams()
  if (filters.status) params.set('status', filters.status)
  if (filters.search) params.set('search', filters.search)
  if (filters.from) params.set('from', filters.from)
  if (filters.to) params.set('to', filters.to)
  const qs = params.toString()
  return getJson<LeadListItem[]>(`/customer/leads${qs ? `?${qs}` : ''}`, 'No se pudieron cargar los leads')
}

export async function getLead(id: string): Promise<LeadDetail> {
  return getJson<LeadDetail>(`/customer/leads/${id}`, 'No se pudo cargar el lead')
}

export async function updateLeadStatusAction(id: string, status: LeadStatus): Promise<void> {
  await mutate(`/customer/leads/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  }, 'No se pudo actualizar el estado')
  revalidatePath('/panel/leads')
  revalidatePath(`/panel/leads/${id}`)
}

export async function updateLeadNotesAction(id: string, notes: string): Promise<void> {
  await mutate(`/customer/leads/${id}/notes`, {
    method: 'PATCH',
    body: JSON.stringify({ notes }),
  }, 'No se pudieron guardar las notas')
  revalidatePath(`/panel/leads/${id}`)
}

// ── Conversaciones (CUS-19..22) ────────────────────────────────────────────
export async function getConversations(filters: {
  search?: string
  from?: string
  to?: string
  hasLead?: boolean
  relevant?: boolean
}): Promise<ConversationListItem[]> {
  const params = new URLSearchParams()
  if (filters.search) params.set('search', filters.search)
  if (filters.from) params.set('from', filters.from)
  if (filters.to) params.set('to', filters.to)
  if (filters.hasLead !== undefined) params.set('hasLead', String(filters.hasLead))
  if (filters.relevant) params.set('relevant', 'true')
  const qs = params.toString()
  return getJson<ConversationListItem[]>(
    `/customer/conversations${qs ? `?${qs}` : ''}`,
    'No se pudieron cargar las conversaciones',
  )
}

export async function getConversation(id: string): Promise<ConversationDetail> {
  return getJson<ConversationDetail>(`/customer/conversations/${id}`, 'No se pudo cargar la conversación')
}

export async function toggleRelevantAction(id: string, value: boolean): Promise<void> {
  await mutate(`/customer/conversations/${id}/relevant?value=${value}`, { method: 'PATCH' }, 'No se pudo actualizar')
  revalidatePath('/panel/conversations')
  revalidatePath(`/panel/conversations/${id}`)
}

// ── Analítica (CUS-23..27) ─────────────────────────────────────────────────
export async function getAnalytics(period: Period): Promise<AnalyticsData> {
  const { from, to } = periodToDates(period)
  return getJson<AnalyticsData>(`/customer/analytics?from=${from}&to=${to}`, 'No se pudo cargar la analítica')
}

export async function getCustomerTopics(period: Period): Promise<TopicsReport> {
  const { from, to } = periodToDates(period)
  return getJson<TopicsReport>(`/customer/topics?from=${from}&to=${to}`, 'No se pudo cargar el análisis de temas')
}

// ── Notificaciones (CUS-28 / CUS-29) ───────────────────────────────────────
export async function saveNotificationsAction(formData: FormData): Promise<void> {
  const payload = {
    notifyOnLead: formData.get('notifyOnLead') === 'on' || formData.get('notifyOnLead') === 'true',
    summaryFrequency: String(formData.get('summaryFrequency') ?? 'none'),
    notificationEmails: String(formData.get('notificationEmails') ?? '')
      .split(/[\n,;]+/)
      .map((e) => e.trim().toLowerCase())
      .filter(Boolean),
  }
  await mutate('/customer/notifications', {
    method: 'PATCH',
    body: JSON.stringify(payload),
  }, 'No se pudieron guardar las notificaciones')
  revalidatePath('/panel/settings')
}

// ── Empresa (CUS-31) ───────────────────────────────────────────────────────
export async function saveCompanyAction(formData: FormData): Promise<void> {
  const payload = {
    name: String(formData.get('name') ?? '').trim(),
    sector: String(formData.get('sector') ?? '').trim() || undefined,
    logoUrl: String(formData.get('logoUrl') ?? '').trim() || undefined,
  }
  await mutate('/customer/company', {
    method: 'PATCH',
    body: JSON.stringify(payload),
  }, 'No se pudieron guardar los datos de la empresa')
  revalidatePath('/panel/settings')
}

export async function uploadLogoAction(formData: FormData): Promise<{ avatarUrl: string }> {
  const res = await backendFetchFormData('/customer/company/logo', formData)
  if (res.status === 401) redirect('/login')
  if (!res.ok) {
    const body: BackendError = await res.json().catch(() => ({}))
    throw new Error(extractMessage(body, 'No se pudo subir el logotipo'))
  }
  return res.json() as Promise<{ avatarUrl: string }>
}

// ── Cuenta (CUS-32) ────────────────────────────────────────────────────────
// ── KB-05: preguntas sin respuesta ───────────────────────────────────────
export interface UnansweredQuestion {
  question: string
  frequency: number
  last_asked_at: string
}

export async function getUnansweredQuestions(days = 30): Promise<UnansweredQuestion[]> {
  let res: Response
  try {
    res = await backendFetch(`/customer/unanswered-questions?days=${days}`)
  } catch {
    throw new Error('No se pudo conectar con el servidor')
  }
  if (res.status === 401) redirect('/login')
  if (!res.ok) throw new Error('Error al cargar las preguntas')
  return res.json()
}

// ── Chatbot completo (CUS-08 expandido) ─────────────────────────────────────
// Misma forma que updateBotConfigAction pero sin campos de IA (llmProvider/llmModel/temperature/maxTokens).
// Retorna BotActionState para compatibilidad con BotConfigForm.
export type BotActionState =
  | { status: 'idle' }
  | { status: 'error'; message: string }
  | { status: 'success' }

export async function saveCustomerBotConfigAction(
  payload: Record<string, unknown>,
): Promise<BotActionState> {
  let res: Response
  try {
    res = await backendFetch('/customer/bot/presentation', {
      method: 'PATCH',
      body: JSON.stringify(payload),
    })
  } catch {
    return { status: 'error', message: 'No se pudo conectar con el servidor' }
  }
  if (res.status === 401) redirect('/login')
  if (!res.ok) {
    const body: BackendError = await res.json().catch(() => ({}))
    return { status: 'error', message: extractMessage(body, 'No se pudo guardar la configuración') }
  }
  revalidatePath('/panel/chatbot')
  return { status: 'success' }
}

export async function changePasswordAction(
  _prev: { error?: string; success?: boolean } | null,
  formData: FormData,
): Promise<{ error?: string; success?: boolean }> {
  const currentPassword = String(formData.get('currentPassword') ?? '')
  const newPassword = String(formData.get('newPassword') ?? '')
  const confirmPassword = String(formData.get('confirmPassword') ?? '')

  if (newPassword.length < 8) return { error: 'La nueva contraseña debe tener al menos 8 caracteres' }
  if (newPassword !== confirmPassword) return { error: 'Las contraseñas no coinciden' }

  let res: Response
  try {
    res = await backendFetch('/auth/change-password', {
      method: 'POST',
      body: JSON.stringify({ currentPassword, newPassword }),
    })
  } catch {
    return { error: 'No se pudo conectar con el servidor' }
  }
  if (res.status === 401) redirect('/login')
  if (!res.ok) {
    const body: BackendError = await res.json().catch(() => ({}))
    return { error: extractMessage(body, 'No se pudo cambiar la contraseña') }
  }
  return { success: true }
}
