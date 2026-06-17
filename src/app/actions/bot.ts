'use server'
import { revalidatePath } from 'next/cache'
import { backendFetch } from '@/lib/api'

export type BotActionState =
  | { status: 'idle' }
  | { status: 'error'; message: string }
  | { status: 'success' }

export interface BotConfig {
  customerId: number
  customerName: string
  customerEmail: string
  tenantName: string | null
  tenantSlug: string | null
  isCustomerActive: boolean
  isTenantActive: boolean
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
  productsServices: { name: string; description: string }[]
  businessRules: { title: string; instruction: string }[]
  pricingRules: { label: string; fromPrice: string; toPrice: string; currency: string; notes: string }[]
  diagnosticQuestions: { question: string; purpose: string }[]
  leadCaptureMoment: 'early' | 'after_interest' | 'after_diagnostics' | 'before_closing'
  contactFields: { key: string; label: string; enabled: boolean; required: boolean }[]
  notificationEmails: string[]
  closingMessage: string
  widgetPrimaryColor: string
  widgetPosition: 'left' | 'right'
  launcherText: string
  welcomeMessage: string
  fallbackMessage: string
  isBotActive: boolean
  websiteUrl: string
  scoringThreshold: number
  scoringRubric: { criterion: string; maxScore: number; description: string }[]
  snippet: string
  widgetUrl: string
}

type BackendError = { message: string | string[] }

function extractMessage(err: unknown): string {
  if (err && typeof err === 'object' && 'message' in err) {
    const msg = (err as BackendError).message
    return Array.isArray(msg) ? msg.join(', ') : (msg ?? 'Error desconocido')
  }
  return 'Error desconocido'
}

export async function getBotConfig(customerId: number): Promise<BotConfig> {
  const res = await backendFetch(`/bot/customers/${customerId}/config`)
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(extractMessage(err))
  }
  return res.json() as Promise<BotConfig>
}

export async function updateBotConfigAction(
  customerId: number,
  payload: Omit<BotConfig, 'customerId' | 'customerName' | 'customerEmail' | 'tenantName' | 'tenantSlug' | 'isCustomerActive' | 'isTenantActive' | 'clientId' | 'isBotActive' | 'snippet' | 'widgetUrl'>,
): Promise<BotActionState> {
  const res = await backendFetch(`/bot/customers/${customerId}/config`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    return { status: 'error', message: extractMessage(err) }
  }

  revalidatePath(`/dashboard/bots/${customerId}`)
  return { status: 'success' }
}

export async function previewBotChatAction(
  customerId: number,
  message: string,
  history: { role: 'user' | 'bot'; text: string }[],
): Promise<{ reply: string; assistantName: string } | { error: string }> {
  const res = await backendFetch(`/bot/customers/${customerId}/preview-chat`, {
    method: 'POST',
    body: JSON.stringify({ message, history }),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    return { error: extractMessage(err) }
  }
  return res.json() as Promise<{ reply: string; assistantName: string }>
}

export async function toggleBotActiveAction(
  customerId: number,
  active: boolean,
): Promise<BotActionState> {
  const res = await backendFetch(`/bot/customers/${customerId}/toggle?active=${active}`, {
    method: 'PATCH',
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    return { status: 'error', message: extractMessage(err) }
  }

  revalidatePath(`/dashboard/bots/${customerId}`)
  return { status: 'success' }
}
