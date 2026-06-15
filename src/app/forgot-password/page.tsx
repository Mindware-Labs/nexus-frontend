"use client";

import {
  AlertCircle,
  ArrowLeft,
  Clock,
  Loader2,
  MailCheck,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { startTransition, useActionState, useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import {
  forgotPasswordAction,
  verifyResetCodeAction,
  type ActionState,
} from "@/app/actions/auth";
import { ForgotPasswordSchema, VerifyResetCodeSchema } from "@/lib/schemas/auth";

const RL_FP_KEY = "nx_rl_fp_expires";
const RL_RC_KEY = "nx_rl_rc_expires";

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
  const timeStr = mins > 0 ? `${mins}:${String(secs).padStart(2, "0")}` : `${secs}s`;
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

function useRateLimit(storageKey: string, state: ActionState) {
  const [seconds, setSeconds] = useState(0);
  const isLimited = seconds > 0;

  useEffect(() => {
    const stored = sessionStorage.getItem(storageKey);
    if (!stored) return;
    const remaining = Math.ceil((Number(stored) - Date.now()) / 1000);
    if (remaining > 0) setSeconds(remaining);
    else sessionStorage.removeItem(storageKey);
  }, [storageKey]);

  useEffect(() => {
    if (state.status !== "rate_limited") return;
    const expiresAt = Date.now() + state.retryAfterSeconds * 1000;
    sessionStorage.setItem(storageKey, String(expiresAt));
    setSeconds(state.retryAfterSeconds);
  }, [state, storageKey]);

  useEffect(() => {
    if (!isLimited) return;
    const id = setInterval(() => {
      setSeconds((prev) => {
        if (prev <= 1) { sessionStorage.removeItem(storageKey); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [isLimited, storageKey]);

  return { seconds, isLimited };
}

export default function ForgotPasswordPage() {
  /* ── Step 1: email ── */
  const [emailState, emailAction, isEmailPending] = useActionState<ActionState, FormData>(
    forgotPasswordAction,
    { status: "idle" },
  );
  const [emailError, setEmailError] = useState<string | undefined>();
  const [submittedEmail, setSubmittedEmail] = useState("");
  const [isEmailSubmitting, setIsEmailSubmitting] = useState(false);
  const fpRL = useRateLimit(RL_FP_KEY, emailState);

  /* ── Step 2: code ── */
  const [codeState, codeAction, isCodePending] = useActionState<ActionState, FormData>(
    verifyResetCodeAction,
    { status: "idle" },
  );
  const [codeError, setCodeError] = useState<string | undefined>();
  const [isCodeSubmitting, setIsCodeSubmitting] = useState(false);
  const rcRL = useRateLimit(RL_RC_KEY, codeState);

  const showCodeStep = emailState.status === "success";

  useEffect(() => {
    if (emailState.status !== "idle") setIsEmailSubmitting(false);
  }, [emailState]);

  useEffect(() => {
    if (codeState.status !== "idle") setIsCodeSubmitting(false);
  }, [codeState]);

  function handleEmailSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (fpRL.isLimited || isEmailSubmitting || isEmailPending) return;
    const fd = new FormData(e.currentTarget);
    const result = ForgotPasswordSchema.safeParse({ email: fd.get("email") });
    if (!result.success) {
      setEmailError(result.error.issues[0]?.message);
    } else {
      setEmailError(undefined);
      setSubmittedEmail(fd.get("email") as string);
      setIsEmailSubmitting(true);
      startTransition(() => emailAction(fd));
    }
  }

  function handleCodeSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (rcRL.isLimited || isCodeSubmitting || isCodePending) return;
    const fd = new FormData(e.currentTarget);
    const result = VerifyResetCodeSchema.safeParse({
      email: fd.get("email"),
      code: fd.get("code"),
    });
    if (!result.success) {
      setCodeError(result.error.issues[0]?.message);
    } else {
      setCodeError(undefined);
      setIsCodeSubmitting(true);
      startTransition(() => codeAction(fd));
    }
  }

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-nexus-deep px-4 py-12">
      {/* Ambient glow */}
      <div aria-hidden className="pointer-events-none absolute -left-48 -top-48 size-[500px] rounded-full bg-nexus-purple/15 blur-[100px]" />
      <div aria-hidden className="pointer-events-none absolute -bottom-40 -right-40 size-96 rounded-full bg-nexus-lavender/10 blur-3xl" />

      {/* Back link */}
      <Link
        href={showCodeStep ? "#" : "/login"}
        onClick={showCodeStep ? () => window.location.reload() : undefined}
        className="mb-6 flex items-center gap-1.5 text-sm text-white/45 transition-colors hover:text-white/80 focus-visible:outline-none focus-visible:underline"
      >
        <ArrowLeft className="size-3.5" />
        {showCodeStep ? "Cambiar correo" : "Volver al inicio de sesión"}
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
        {!showCodeStep ? (
          /* ── Step 1: email ── */
          <>
            <div className="mb-8 text-center">
              <h1 className="text-2xl font-bold tracking-tight text-white">Recuperar contraseña</h1>
              <p className="mt-1.5 text-sm text-white/50">
                Ingresa tu correo y te enviaremos un código de 6 dígitos
              </p>
            </div>

            <form onSubmit={handleEmailSubmit} className="space-y-5">
              {fpRL.isLimited ? (
                <RateLimitBanner seconds={fpRL.seconds} />
              ) : emailState.status === "error" ? (
                <ErrorBanner message={emailState.message} />
              ) : null}

              <div>
                <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-white/80">
                  Correo electrónico
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="tu@empresa.com"
                  className={cn(
                    "w-full rounded-xl border bg-white/[0.07] px-4 py-3 text-sm text-white placeholder:text-white/35",
                    "transition-all duration-200 outline-none focus:bg-white/[0.1] focus:ring-2",
                    emailError
                      ? "border-nexus-coral/50 focus:ring-nexus-coral/30"
                      : "border-white/15 focus:border-nexus-lavender/50 focus:ring-nexus-lavender/20",
                  )}
                />
                {emailError && <p className="mt-1.5 text-xs text-nexus-coral">{emailError}</p>}
              </div>

              <button
                type="submit"
                disabled={isEmailPending || isEmailSubmitting || fpRL.isLimited}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-nexus-purple px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-nexus-purple/30 transition-all duration-200 hover:bg-nexus-purple/85 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {(isEmailPending || isEmailSubmitting) && <Loader2 className="size-4 animate-spin" />}
                Enviar código
              </button>
            </form>
          </>
        ) : (
          /* ── Step 2: code ── */
          <>
            <div className="mb-8 text-center">
              <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl bg-nexus-mint/15 ring-1 ring-nexus-mint/30">
                <MailCheck className="size-7 text-nexus-mint" />
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-white">Ingresa el código</h1>
              <p className="mt-1.5 text-sm text-white/50">
                Enviamos un código a{" "}
                <span className="font-medium text-white/70">{submittedEmail}</span>
                {". "}Válido por 15 minutos.
              </p>
            </div>

            <form onSubmit={handleCodeSubmit} className="space-y-5">
              {rcRL.isLimited ? (
                <RateLimitBanner seconds={rcRL.seconds} />
              ) : codeState.status === "error" ? (
                <ErrorBanner message={codeState.message} />
              ) : null}

              <input type="hidden" name="email" value={submittedEmail} />

              <div>
                <label htmlFor="code" className="mb-1.5 block text-sm font-medium text-white/80">
                  Código de recuperación
                </label>
                <input
                  id="code"
                  name="code"
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={6}
                  autoComplete="one-time-code"
                  autoFocus
                  placeholder="000000"
                  onInput={(event) => {
                    const input = event.currentTarget;
                    const normalized = input.value.replace(/\D/g, "").slice(0, 6);
                    if (input.value !== normalized) input.value = normalized;
                  }}
                  className={cn(
                    "w-full rounded-xl border bg-white/[0.07] px-4 py-3 text-center font-mono",
                    "text-2xl tracking-[0.6em] text-white placeholder:text-white/25 placeholder:tracking-normal",
                    "transition-all duration-200 outline-none focus:bg-white/[0.1] focus:ring-2",
                    codeError
                      ? "border-nexus-coral/50 focus:ring-nexus-coral/30"
                      : "border-white/15 focus:border-nexus-lavender/50 focus:ring-nexus-lavender/20",
                  )}
                />
                {codeError && <p className="mt-1.5 text-xs text-nexus-coral">{codeError}</p>}
              </div>

              <button
                type="submit"
                disabled={isCodePending || isCodeSubmitting || rcRL.isLimited}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-nexus-purple px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-nexus-purple/30 transition-all duration-200 hover:bg-nexus-purple/85 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {(isCodePending || isCodeSubmitting) && <Loader2 className="size-4 animate-spin" />}
                Verificar código
              </button>
            </form>
          </>
        )}
      </div>

      <p className="mt-6 text-center text-xs text-white/25">
        © {new Date().getFullYear()} Mindware Labs · Todos los derechos reservados
      </p>
    </div>
  );
}
