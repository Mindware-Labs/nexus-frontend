'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { backendFetch } from '@/lib/api'
import type {
  BusinessRuleItem,
  ContactFieldConfig,
  DiagnosticQuestionItem,
  OwnerBotConfig,
  PricingRuleItem,
  ProductServiceItem,
} from '@/lib/schemas/chatbot'

type BackendError = { message: string | string[] }

function extractMessage(body: BackendError, fallback: string): string {
  const msg = body?.message
  if (Array.isArray(msg)) return msg[0] ?? fallback
  return msg ?? fallback
}

function parseJsonField<T>(value: FormDataEntryValue | null, fallback: T): T {
  if (typeof value !== 'string' || value.trim().length === 0) return fallback
  try {
    return JSON.parse(value) as T
  } catch {
    return fallback
  }
}

function parseNotificationEmails(value: FormDataEntryValue | null): string[] {
  if (typeof value !== 'string') return []
  return value
    .split(/[\n,;]+/)
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean)
}

export async function getBotConfig(customerId: number): Promise<OwnerBotConfig> {
  let res: Response
  try {
    res = await backendFetch(`/bot/customers/${customerId}/config`)
  } catch {
    throw new Error('No se pudo conectar con el servidor para cargar la configuración del chatbot')
  }

  if (res.status === 401) redirect('/login')

  if (!res.ok) {
    const body: BackendError = await res.json().catch(() => ({}))
    throw new Error(extractMessage(body, 'No se pudo cargar la configuración del chatbot'))
  }

  return (await res.json()) as OwnerBotConfig
}

export async function saveBotConfigAction(customerId: number, formData: FormData): Promise<void> {
  const payload = {
    assistantName: String(formData.get('assistantName') ?? '').trim(),
    avatarMode: String(formData.get('avatarMode') ?? 'icon'),
    avatarValue: String(formData.get('avatarValue') ?? '').trim(),
    supportedLanguages: formData.getAll('supportedLanguages').map(String).filter(Boolean),
    tone: String(formData.get('tone') ?? 'amigable'),
    llmModel: String(formData.get('llmModel') ?? 'gemini-3.1-flash-lite'),
    temperature: Number(formData.get('temperature') ?? 0.7),
    maxTokens: Number(formData.get('maxTokens') ?? 512),
    systemPromptHtml: String(formData.get('systemPromptHtml') ?? ''),
    productsServices: parseJsonField<ProductServiceItem[]>(formData.get('productsServicesJson'), []),
    businessRules: parseJsonField<BusinessRuleItem[]>(formData.get('businessRulesJson'), []),
    pricingRules: parseJsonField<PricingRuleItem[]>(formData.get('pricingRulesJson'), []),
    diagnosticQuestions: parseJsonField<DiagnosticQuestionItem[]>(
      formData.get('diagnosticQuestionsJson'),
      [],
    ),
    leadCaptureMoment: String(formData.get('leadCaptureMoment') ?? 'after_interest'),
    contactFields: parseJsonField<ContactFieldConfig[]>(formData.get('contactFieldsJson'), []),
    notificationEmails: parseNotificationEmails(formData.get('notificationEmails')),
    closingMessage: String(formData.get('closingMessage') ?? '').trim(),
    widgetPrimaryColor: String(formData.get('widgetPrimaryColor') ?? '#6D28D9').trim(),
    widgetPosition: String(formData.get('widgetPosition') ?? 'right'),
    launcherText: String(formData.get('launcherText') ?? '').trim(),
  }

  const res = await backendFetch(`/bot/customers/${customerId}/config`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  })

  if (res.status === 401) redirect('/login')

  if (!res.ok) {
    const body: BackendError = await res.json().catch(() => ({}))
    throw new Error(extractMessage(body, 'No se pudo guardar la configuración del chatbot'))
  }

  revalidatePath('/dashboard/chatbot')
  redirect(`/dashboard/chatbot?customerId=${customerId}&saved=1`)
}
