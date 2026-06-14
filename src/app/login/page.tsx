"use client";

import { AnimatePresence, m } from "motion/react";
import {
  AlertCircle,
  ArrowLeft,
  Clock,
  Eye,
  EyeOff,
  Loader2,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { useActionState, useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { loginAction, verify2FAAction, type ActionState } from "@/app/actions/auth";
import { LoginSchema, TwoFASchema } from "@/lib/schemas/auth";

/* ─── sessionStorage key ────────────────────────────────────────────── */
const RL_KEY = "nx_rl_expires";

/* ─── helpers ───────────────────────────────────────────────────────── */
function ErrorBanner({ message }: { message: string }) {
  return (
    <div className="flex items-start gap-2.5 rounded-xl border border-nexus-coral/30 bg-nexus-coral/10 px-4 py-3 text-sm text-nexus-coral">
      <AlertCircle className="mt-0.5 size-4 shrink-0" />
      <span>{message}</span>
    </div>
  );
}

function RateLimitBanner({ seconds }: { seconds: number }) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  const timeStr =
    mins > 0
      ? `${mins}:${String(secs).padStart(2, "0")}`
      : `${secs}s`;

  return (
    <div className="flex items-center gap-2.5 rounded-xl border border-amber-400/30 bg-amber-400/10 px-4 py-3 text-sm text-amber-300">
      <Clock className="size-4 shrink-0" />
      <span>
        Demasiados intentos. Vuelve a intentarlo en{" "}
        <span className="font-semibold tabular-nums">{timeStr}</span>
      </span>
    </div>
  );
}

function FieldError({ error }: { error?: string }) {
  if (!error) return null;
  return <p className="mt-1.5 text-xs text-nexus-coral">{error}</p>;
}

function InputField({
  id,
  name,
  type,
  label,
  placeholder,
  autoComplete,
  error,
}: {
  id: string;
  name: string;
  type: "email" | "password" | "text";
  label: string;
  placeholder: string;
  autoComplete?: string;
  error?: string;
}) {
  const [show, setShow] = useState(false);
  const isPassword = type === "password";
  const inputType = isPassword ? (show ? "text" : "password") : type;

  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-white/80">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          name={name}
          type={inputType}
          autoComplete={autoComplete}
          placeholder={placeholder}
          className={cn(
            "w-full rounded-xl border bg-white/[0.07] px-4 py-3 text-sm text-white placeholder:text-white/35",
            "transition-all duration-200 outline-none",
            "focus:bg-white/[0.1] focus:ring-2",
            error
              ? "border-nexus-coral/50 focus:ring-nexus-coral/30"
              : "border-white/15 focus:border-nexus-lavender/50 focus:ring-nexus-lavender/20",
            isPassword && "pr-11",
          )}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShow((v) => !v)}
            tabIndex={-1}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 transition-colors hover:text-white/70"
            aria-label={show ? "Ocultar contraseña" : "Mostrar contraseña"}
          >
            {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </button>
        )}
      </div>
      <FieldError error={error} />
    </div>
  );
}

/* ─── Step 1: Credentials ─────────────────────────────────────────── */
type FieldErrors = { email?: string; password?: string };

function CredentialsForm({
  formAction,
  state,
  isPending,
  isRateLimited,
  rlSeconds,
}: {
  formAction: (payload: FormData) => void;
  state: ActionState;
  isPending: boolean;
  isRateLimited: boolean;
  rlSeconds: number;
}) {
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    if (isRateLimited) { e.preventDefault(); return; }
    const fd = new FormData(e.currentTarget);
    const result = LoginSchema.safeParse({
      email: fd.get("email"),
      password: fd.get("password"),
    });
    if (!result.success) {
      e.preventDefault();
      const fe: FieldErrors = {};
      for (const issue of result.error.issues) {
        const key = issue.path[0] as keyof FieldErrors;
        if (!fe[key]) fe[key] = issue.message;
      }
      setFieldErrors(fe);
    } else {
      setFieldErrors({});
    }
  }

  return (
    <m.div
      key="credentials"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold tracking-tight text-white">Bienvenido de vuelta</h1>
        <p className="mt-1.5 text-sm text-white/50">Inicia sesión en tu cuenta de Nexus</p>
      </div>

      <form action={formAction} onSubmit={handleSubmit} className="space-y-5">
        {isRateLimited
          ? <RateLimitBanner seconds={rlSeconds} />
          : state.status === "error" && <ErrorBanner message={state.message} />}

        <InputField
          id="email"
          name="email"
          type="email"
          label="Correo electrónico"
          placeholder="tu@empresa.com"
          autoComplete="email"
          error={fieldErrors.email}
        />
        <InputField
          id="password"
          name="password"
          type="password"
          label="Contraseña"
          placeholder="••••••••"
          autoComplete="current-password"
          error={fieldErrors.password}
        />

        <button
          type="submit"
          disabled={isPending || isRateLimited}
          className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-nexus-purple px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-nexus-purple/30 transition-all duration-200 hover:bg-nexus-purple/85 hover:shadow-nexus-purple/40 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPending && <Loader2 className="size-4 animate-spin" />}
          Iniciar sesión
        </button>

        <p className="text-center text-sm text-white/45">
          <Link
            href="/forgot-password"
            className="text-nexus-lavender transition-colors hover:text-nexus-lavender/80 focus-visible:outline-none focus-visible:underline"
          >
            ¿Olvidaste tu contraseña?
          </Link>
        </p>
      </form>
    </m.div>
  );
}

/* ─── Step 2: 2FA ─────────────────────────────────────────────────── */
function TwoFactorForm({
  preAuthToken,
  formAction,
  state,
  isPending,
  isRateLimited,
  rlSeconds,
  onBack,
}: {
  preAuthToken: string;
  formAction: (payload: FormData) => void;
  state: ActionState;
  isPending: boolean;
  isRateLimited: boolean;
  rlSeconds: number;
  onBack: () => void;
}) {
  const [fieldError, setFieldError] = useState<string | undefined>();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    if (isRateLimited) { e.preventDefault(); return; }
    const fd = new FormData(e.currentTarget);
    const result = TwoFASchema.safeParse({
      preAuthToken: fd.get("preAuthToken"),
      code: fd.get("code"),
    });
    if (!result.success) {
      e.preventDefault();
      setFieldError(result.error.issues[0]?.message);
    } else {
      setFieldError(undefined);
    }
  }

  return (
    <m.div
      key="two-factor"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl bg-nexus-purple/25 ring-1 ring-nexus-lavender/30">
          <ShieldCheck className="size-7 text-nexus-lavender" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-white">Verificación en dos pasos</h1>
        <p className="mt-1.5 text-sm text-white/50">
          Ingresa el código de 6 dígitos de tu app autenticadora
        </p>
      </div>

      <form action={formAction} onSubmit={handleSubmit} className="space-y-5">
        {isRateLimited
          ? <RateLimitBanner seconds={rlSeconds} />
          : state.status === "error" && <ErrorBanner message={state.message} />}

        <input type="hidden" name="preAuthToken" value={preAuthToken} />

        <div>
          <label htmlFor="code" className="mb-1.5 block text-sm font-medium text-white/80">
            Código de verificación
          </label>
          <input
            id="code"
            name="code"
            type="text"
            inputMode="numeric"
            pattern="\d{6}"
            maxLength={6}
            autoComplete="one-time-code"
            placeholder="000000"
            className={cn(
              "w-full rounded-xl border bg-white/[0.07] px-4 py-3 text-center font-mono",
              "text-2xl tracking-[0.6em] text-white placeholder:text-white/25 placeholder:tracking-normal",
              "transition-all duration-200 outline-none focus:bg-white/[0.1] focus:ring-2",
              fieldError
                ? "border-nexus-coral/50 focus:ring-nexus-coral/30"
                : "border-white/15 focus:border-nexus-lavender/50 focus:ring-nexus-lavender/20",
            )}
          />
          <FieldError error={fieldError} />
        </div>

        <button
          type="submit"
          disabled={isPending || isRateLimited}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-nexus-purple px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-nexus-purple/30 transition-all duration-200 hover:bg-nexus-purple/85 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPending && <Loader2 className="size-4 animate-spin" />}
          Verificar código
        </button>

        <button
          type="button"
          onClick={onBack}
          className="flex w-full items-center justify-center gap-1.5 text-sm text-white/45 transition-colors hover:text-white/70"
        >
          <ArrowLeft className="size-3.5" />
          Volver al inicio de sesión
        </button>
      </form>
    </m.div>
  );
}

/* ─── Page ────────────────────────────────────────────────────────── */
export default function LoginPage() {
  const [loginState, loginFormAction, isLoginPending] = useActionState<ActionState, FormData>(
    loginAction,
    { status: "idle" },
  );
  const [twoFAState, twoFAFormAction, is2FAPending] = useActionState<ActionState, FormData>(
    verify2FAAction,
    { status: "idle" },
  );

  /* ── rate-limit countdown (persiste en sessionStorage) ─────────── */
  const [rlSeconds, setRlSeconds] = useState(0);
  const isRateLimited = rlSeconds > 0;

  /* Restaurar al montar (p.ej. el usuario salió a la landing y volvió) */
  useEffect(() => {
    const stored = sessionStorage.getItem(RL_KEY);
    if (!stored) return;
    const remaining = Math.ceil((Number(stored) - Date.now()) / 1000);
    if (remaining > 0) setRlSeconds(remaining);
    else sessionStorage.removeItem(RL_KEY);
  }, []);

  /* Sincronizar cuando el servidor devuelve 429 */
  useEffect(() => {
    const rl =
      loginState.status === "rate_limited" ? loginState
      : twoFAState.status === "rate_limited" ? twoFAState
      : null;
    if (!rl) return;
    const expiresAt = Date.now() + rl.retryAfterSeconds * 1000;
    sessionStorage.setItem(RL_KEY, String(expiresAt));
    setRlSeconds(rl.retryAfterSeconds);
  }, [loginState, twoFAState]);

  /* Ticker de cuenta regresiva */
  useEffect(() => {
    if (!isRateLimited) return;
    const id = setInterval(() => {
      setRlSeconds((prev) => {
        if (prev <= 1) {
          sessionStorage.removeItem(RL_KEY);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [isRateLimited]);

  const showTwoFA = loginState.status === "two_factor";

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-nexus-deep px-4 py-12">
      {/* Ambient glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-48 -top-48 size-[500px] rounded-full bg-nexus-purple/15 blur-[100px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-40 -right-40 size-96 rounded-full bg-nexus-lavender/10 blur-3xl"
      />

      {/* Back to landing */}
      <Link
        href="/"
        className="mb-6 flex items-center gap-1.5 text-sm text-white/45 transition-colors hover:text-white/80 focus-visible:outline-none focus-visible:underline"
      >
        <ArrowLeft className="size-3.5" />
        Volver al inicio
      </Link>

      {/* Logo */}
      <Link href="/" className="group mb-8 flex items-center gap-2.5">
        <span className="relative grid size-9 place-items-center rounded-xl bg-gradient-to-br from-nexus-purple to-nexus-lavender shadow-lg shadow-nexus-lavender/30 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
          <Sparkles className="size-4 text-white" />
        </span>
        <span className="text-[15px] font-semibold tracking-tight text-white">
          Mindware <span className="text-nexus-lavender">Nexus</span>
        </span>
      </Link>

      {/* Card */}
      <div className="w-full max-w-md overflow-hidden rounded-2xl border border-white/10 bg-white/[0.05] p-8 shadow-2xl shadow-black/50 backdrop-blur-xl sm:p-10">
        <AnimatePresence mode="wait" initial={false}>
          {showTwoFA ? (
            <TwoFactorForm
              key="2fa"
              preAuthToken={
                (loginState as { status: "two_factor"; preAuthToken: string }).preAuthToken
              }
              formAction={twoFAFormAction}
              state={twoFAState}
              isPending={is2FAPending}
              isRateLimited={isRateLimited}
              rlSeconds={rlSeconds}
              onBack={() => window.location.reload()}
            />
          ) : (
            <CredentialsForm
              key="creds"
              formAction={loginFormAction}
              state={loginState}
              isPending={isLoginPending}
              isRateLimited={isRateLimited}
              rlSeconds={rlSeconds}
            />
          )}
        </AnimatePresence>
      </div>

      <p className="mt-6 text-center text-xs text-white/25">
        © {new Date().getFullYear()} Mindware Labs · Todos los derechos reservados
      </p>
    </div>
  );
}
