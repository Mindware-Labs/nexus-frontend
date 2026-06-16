// Shared types and constants for bot-config-form

export type ProductItem    = { name: string; description: string }
export type RuleItem       = { title: string; instruction: string }
export type PricingItem    = { label: string; fromPrice: string; toPrice: string; currency: string; notes: string }
export type QuestionItem   = { question: string; purpose: string }
export type ContactField   = { key: string; label: string; enabled: boolean; required: boolean }
export type ScoringCriterion = { criterion: string; maxScore: number; description: string }

export const COLOR_PRESETS = [
  { label: 'Nexus',   hex: '#522566' },
  { label: 'Violeta', hex: '#7C3AED' },
  { label: 'Añil',    hex: '#4F46E5' },
  { label: 'Azul',    hex: '#2563EB' },
  { label: 'Cian',    hex: '#0891B2' },
  { label: 'Teal',    hex: '#0D9488' },
  { label: 'Verde',   hex: '#16A34A' },
  { label: 'Lima',    hex: '#65A30D' },
  { label: 'Ámbar',   hex: '#D97706' },
  { label: 'Naranja', hex: '#EA580C' },
  { label: 'Rosa',    hex: '#DB2777' },
  { label: 'Rojo',    hex: '#DC2626' },
  { label: 'Pizarra', hex: '#475569' },
  { label: 'Negro',   hex: '#18181B' },
] as const

export const SUPPORTED_LANGUAGES = [
  { value: 'Español',   label: 'Español',   flag: '🇪🇸' },
  { value: 'Inglés',    label: 'Inglés',    flag: '🇺🇸' },
  { value: 'Portugués', label: 'Portugués', flag: '🇧🇷' },
  { value: 'Francés',   label: 'Francés',   flag: '🇫🇷' },
  { value: 'Alemán',    label: 'Alemán',    flag: '🇩🇪' },
  { value: 'Italiano',  label: 'Italiano',  flag: '🇮🇹' },
  { value: 'Chino',     label: 'Chino',     flag: '🇨🇳' },
  { value: 'Japonés',   label: 'Japonés',   flag: '🇯🇵' },
  { value: 'Árabe',     label: 'Árabe',     flag: '🇸🇦' },
  { value: 'Ruso',      label: 'Ruso',      flag: '🇷🇺' },
  { value: 'Coreano',   label: 'Coreano',   flag: '🇰🇷' },
  { value: 'Holandés',  label: 'Holandés',  flag: '🇳🇱' },
] as const

export const TEMPERATURE_OPTIONS = [
  { value: 0,   label: 'Preciso',      description: 'Respuestas exactas y consistentes' },
  { value: 0.4, label: 'Equilibrado',  description: 'Mezcla de precisión y naturalidad' },
  { value: 0.8, label: 'Creativo',     description: 'Respuestas variadas y más naturales' },
  { value: 1.3, label: 'Muy creativo', description: 'Alta variedad, puede ser impredecible' },
] as const
