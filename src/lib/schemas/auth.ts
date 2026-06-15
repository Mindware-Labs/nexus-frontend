import { z } from "zod";

const oneTimeCodeSchema = z
  .string()
  .transform((value) => value.replace(/[\s\-\u200B-\u200D\uFEFF]+/g, ""))
  .pipe(
    z
      .string()
      .length(6, "El codigo debe tener 6 digitos")
      .regex(/^\d{6}$/, "Solo se permiten digitos"),
  );

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
  code: oneTimeCodeSchema,
});

export type LoginInput = z.infer<typeof LoginSchema>;

export const ForgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, "El correo electrónico es requerido")
    .email("Correo electrónico inválido")
    .max(255),
});

export const VerifyResetCodeSchema = z.object({
  email: z.string().email(),
  code: oneTimeCodeSchema,
});

export const ResetPasswordSchema = z
  .object({
    resetToken: z.string().min(1),
    password: z
      .string()
      .min(1, "La contraseña es requerida")
      .min(8, "La contraseña debe tener al menos 8 caracteres")
      .max(255),
    confirm: z.string().min(1, "Confirma tu contraseña"),
  })
  .refine((d) => d.password === d.confirm, {
    message: "Las contraseñas no coinciden",
    path: ["confirm"],
  });
