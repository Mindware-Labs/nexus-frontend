import { z } from "zod";

export const LoginSchema = z.object({
  email: z
    .string()
    .min(1, "El correo electrónico es requerido")
    .email("Correo electrónico inválido")
    .max(255),
  password: z
    .string()
    .min(1, "La contraseña es requerida")
    .min(8, "Credenciales inválidas")
    .max(255),
});

export const TwoFASchema = z.object({
  preAuthToken: z.string().min(1),
  code: z
    .string()
    .length(6, "El código debe tener 6 dígitos")
    .regex(/^\d{6}$/, "Solo se permiten dígitos"),
});

export type LoginInput = z.infer<typeof LoginSchema>;
