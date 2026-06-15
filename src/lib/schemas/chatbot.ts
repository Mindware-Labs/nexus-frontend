export type BotTone = 'formal' | 'tecnico' | 'amigable' | 'consultivo' | 'directo'
export type AvatarMode = 'icon' | 'emoji' | 'image'
export type LeadCaptureMoment = 'early' | 'after_interest' | 'after_diagnostics' | 'before_closing'
export type WidgetPosition = 'left' | 'right'

export type ProductServiceItem = {
  name: string
  description: string
}

export type BusinessRuleItem = {
  title: string
  instruction: string
}

export type PricingRuleItem = {
  label: string
  fromPrice: string
  toPrice: string
  currency: string
  notes: string
}

export type DiagnosticQuestionItem = {
  question: string
  purpose: string
}

export type ContactFieldConfig = {
  key: 'name' | 'company' | 'email' | 'phone'
  label: string
  enabled: boolean
  required: boolean
}

export type OwnerBotConfig = {
  customerId: number
  customerName: string
  customerEmail: string
  tenantName: string | null
  tenantSlug: string | null
  isCustomerActive: boolean
  isTenantActive: boolean
  clientId: string
  assistantName: string
  avatarMode: AvatarMode
  avatarValue: string
  supportedLanguages: string[]
  tone: BotTone
  llmModel: string
  temperature: number
  maxTokens: number
  systemPromptHtml: string
  productsServices: ProductServiceItem[]
  businessRules: BusinessRuleItem[]
  pricingRules: PricingRuleItem[]
  diagnosticQuestions: DiagnosticQuestionItem[]
  leadCaptureMoment: LeadCaptureMoment
  contactFields: ContactFieldConfig[]
  notificationEmails: string[]
  closingMessage: string
  widgetPrimaryColor: string
  widgetPosition: WidgetPosition
  launcherText: string
  snippet: string
  widgetUrl: string
}

export type PublicWidgetConfig = {
  clientId: string
  enabled: boolean
  assistantName: string
  avatarMode: AvatarMode
  avatarValue: string
  supportedLanguages: string[]
  widgetPrimaryColor: string
  widgetPosition: WidgetPosition
  launcherText: string
  closingMessage: string
}

export const BOT_LANGUAGE_OPTIONS = [
  { value: 'es', label: 'Español' },
  { value: 'en', label: 'English' },
  { value: 'pt', label: 'Português' },
  { value: 'fr', label: 'Français' },
] as const

export const BOT_TONE_OPTIONS: Array<{ value: BotTone; label: string }> = [
  { value: 'formal', label: 'Formal' },
  { value: 'tecnico', label: 'Técnico' },
  { value: 'amigable', label: 'Amigable' },
  { value: 'consultivo', label: 'Consultivo' },
  { value: 'directo', label: 'Directo' },
]

export const BOT_MODEL_OPTIONS = [
  'gemini-3.1-flash-lite',
  'gemini-3.5-flash',
  'gemini-2.5-flash',
] as const

export const BOT_ICON_OPTIONS = [
  { value: 'sparkles', label: 'Sparkles' },
  { value: 'message-circle', label: 'Message Circle' },
  { value: 'bot', label: 'Bot' },
  { value: 'zap', label: 'Zap' },
] as const

export const BOT_LEAD_CAPTURE_OPTIONS: Array<{ value: LeadCaptureMoment; label: string }> = [
  { value: 'early', label: 'Temprano' },
  { value: 'after_interest', label: 'Después de detectar interés' },
  { value: 'after_diagnostics', label: 'Después del diagnóstico' },
  { value: 'before_closing', label: 'Antes del cierre' },
]

export function createEmptyProductService(): ProductServiceItem {
  return { name: '', description: '' }
}

export function createEmptyBusinessRule(): BusinessRuleItem {
  return { title: '', instruction: '' }
}

export function createEmptyPricingRule(): PricingRuleItem {
  return { label: '', fromPrice: '', toPrice: '', currency: 'USD', notes: '' }
}

export function createEmptyDiagnosticQuestion(): DiagnosticQuestionItem {
  return { question: '', purpose: '' }
}
