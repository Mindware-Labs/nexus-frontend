import { z } from 'zod'

export const CreateCustomerSchema = z.object({
  name: z
    .string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(100, 'El nombre no puede superar los 100 caracteres')
    .trim(),
  email: z
    .string()
    .min(1, 'El correo electrónico es requerido')
    .email('Correo electrónico inválido')
    .max(255),
  tenantId: z
    .string()
    .min(1, 'Debes seleccionar un tenant')
    .transform((v) => parseInt(v, 10))
    .pipe(z.number().int().positive('El tenant seleccionado no es válido')),
})

export type CreateCustomerInput = z.infer<typeof CreateCustomerSchema>

export const UpdateCustomerSchema = z.object({
  name: z
    .string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(100, 'El nombre no puede superar los 100 caracteres')
    .trim(),
  email: z
    .string()
    .min(1, 'El correo electrónico es requerido')
    .email('Correo electrónico inválido')
    .max(255),
  isActive: z.enum(['true', 'false']).transform((v) => v === 'true'),
})

export type UpdateCustomerInput = z.infer<typeof UpdateCustomerSchema>
