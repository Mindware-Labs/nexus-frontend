import { z } from 'zod'

export const TENANT_PLANS = ['trial', 'starter', 'pro', 'enterprise'] as const
export type TenantPlan = (typeof TENANT_PLANS)[number]

export const PLAN_LABELS: Record<TenantPlan, string> = {
  trial: 'Trial',
  starter: 'Starter',
  pro: 'Pro',
  enterprise: 'Enterprise',
}

export const CreateTenantSchema = z.object({
  name: z
    .string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(100, 'El nombre no puede superar los 100 caracteres')
    .trim(),
  plan: z.enum(TENANT_PLANS, { error: 'Selecciona un plan válido' }),
})

export type CreateTenantInput = z.infer<typeof CreateTenantSchema>

export const UpdateTenantSchema = z.object({
  name: z
    .string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(100)
    .trim()
    .optional(),
  plan: z.enum(TENANT_PLANS).optional(),
  is_active: z.boolean().optional(),
})

export type UpdateTenantInput = z.infer<typeof UpdateTenantSchema>
