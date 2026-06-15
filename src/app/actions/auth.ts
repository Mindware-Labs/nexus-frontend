'use server';
import { redirect } from 'next/navigation';
import { LoginSchema, TwoFASchema, ForgotPasswordSchema, VerifyResetCodeSchema, ResetPasswordSchema } from '@/lib/schemas/auth';
import { createSession, deleteSession, getRefreshToken } from '@/lib/session';
import type { LoginApiResponse, TokenPair } from '@/types/auth';

const BACKEND = process.env.BACKEND_URL!;

export type ActionState =
  | { status: 'idle' }
  | { status: 'error'; message: string }
  | { status: 'rate_limited'; retryAfterSeconds: number }
  | { status: 'two_factor'; preAuthToken: string }
  | { status: 'success' };

type BackendError = { message: string | string[]; statusCode?: number };

function extractMessage(body: BackendError, fallback: string): string {
  const msg = body?.message;
  if (Array.isArray(msg)) return msg[0] ?? fallback;
  return msg ?? fallback;
}

function rateLimited(res: Response): ActionState {
  const retryAfter = Number(res.headers.get('Retry-After') ?? 60);
  return { status: 'rate_limited', retryAfterSeconds: retryAfter };
}

export async function loginAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = LoginSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  });

  if (!parsed.success) {
    return { status: 'error', message: parsed.error.issues[0]?.message ?? 'Datos inválidos' };
  }

  let res: Response;
  try {
    res = await fetch(`${BACKEND}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(parsed.data),
      cache: 'no-store',
    });
  } catch {
    return { status: 'error', message: 'No se pudo conectar con el servidor' };
  }

  const body: (LoginApiResponse & BackendError) = await res.json();

  if (res.status === 429) return rateLimited(res);

  if (!res.ok) {
    return { status: 'error', message: extractMessage(body, 'Error al iniciar sesión') };
  }

  if ('twoFactorRequired' in body) {
    return { status: 'two_factor', preAuthToken: body.preAuthToken };
  }

  await createSession(body as TokenPair);
  redirect((body as TokenPair).role === 'owner' ? '/dashboard' : '/panel');
}

export async function verify2FAAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = TwoFASchema.safeParse({
    preAuthToken: formData.get('preAuthToken'),
    code: formData.get('code'),
  });

  if (!parsed.success) {
    return { status: 'error', message: parsed.error.issues[0]?.message ?? 'Código inválido' };
  }

  let res: Response;
  try {
    res = await fetch(`${BACKEND}/auth/2fa/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(parsed.data),
      cache: 'no-store',
    });
  } catch {
    return { status: 'error', message: 'No se pudo conectar con el servidor' };
  }

  const body: TokenPair & BackendError = await res.json();

  if (res.status === 429) return rateLimited(res);

  if (!res.ok) {
    return { status: 'error', message: extractMessage(body, 'Código 2FA inválido') };
  }

  await createSession(body);
  redirect(body.role === 'owner' ? '/dashboard' : '/panel');
}

export async function forgotPasswordAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = ForgotPasswordSchema.safeParse({ email: formData.get('email') });
  if (!parsed.success) {
    return { status: 'error', message: parsed.error.issues[0]?.message ?? 'Datos inválidos' };
  }

  let res: Response;
  try {
    res = await fetch(`${BACKEND}/auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(parsed.data),
      cache: 'no-store',
    });
  } catch {
    return { status: 'error', message: 'No se pudo conectar con el servidor' };
  }

  if (res.status === 429) return rateLimited(res);

  // Backend returns {} when email not found, { message: '...' } when found and email sent.
  // Show a vague error either way to avoid confirming whether an account exists.
  const body = await res.json().catch(() => ({}));
  if (!res.ok || !body.message) {
    return { status: 'error', message: 'Credenciales inválidas' };
  }

  return { status: 'success' };
}

export async function verifyResetCodeAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = VerifyResetCodeSchema.safeParse({
    email: formData.get('email'),
    code: formData.get('code'),
  });
  if (!parsed.success) {
    return { status: 'error', message: parsed.error.issues[0]?.message ?? 'Código inválido' };
  }

  let res: Response;
  try {
    res = await fetch(`${BACKEND}/auth/verify-reset-code`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(parsed.data),
      cache: 'no-store',
    });
  } catch {
    return { status: 'error', message: 'No se pudo conectar con el servidor' };
  }

  if (res.status === 429) return rateLimited(res);

  if (!res.ok) {
    const body: BackendError = await res.json().catch(() => ({}));
    return { status: 'error', message: extractMessage(body, 'Código de recuperación inválido') };
  }

  const { resetToken } = await res.json().catch(() => ({ resetToken: undefined }));
  if (typeof resetToken !== 'string' || resetToken.length === 0) {
    return { status: 'error', message: 'No se pudo generar el enlace de recuperacion' };
  }

  redirect(`/reset-password?token=${encodeURIComponent(resetToken)}`);
}

export async function resetPasswordAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = ResetPasswordSchema.safeParse({
    resetToken: formData.get('resetToken'),
    password: formData.get('password'),
    confirm: formData.get('confirm'),
  });
  if (!parsed.success) {
    return { status: 'error', message: parsed.error.issues[0]?.message ?? 'Datos inválidos' };
  }

  let res: Response;
  try {
    res = await fetch(`${BACKEND}/auth/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: parsed.data.resetToken, password: parsed.data.password }),
      cache: 'no-store',
    });
  } catch {
    return { status: 'error', message: 'No se pudo conectar con el servidor' };
  }

  if (!res.ok) {
    const body: BackendError = await res.json().catch(() => ({}));
    const message =
      res.status === 401
        ? 'El enlace de recuperación es inválido o ha expirado'
        : extractMessage(body, 'No se pudo restablecer la contraseña');
    return { status: 'error', message };
  }

  return { status: 'success' };
}

export async function logoutAction(): Promise<void> {
  const refreshToken = await getRefreshToken();

  if (refreshToken) {
    try {
      const refreshRes = await fetch(`${BACKEND}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
        cache: 'no-store',
      });

      if (refreshRes.ok) {
        const { accessToken } = await refreshRes.json();
        await fetch(`${BACKEND}/auth/logout`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${accessToken}` },
          cache: 'no-store',
        });
      }
    } catch {}
  }

  await deleteSession();
  redirect('/login');
}
