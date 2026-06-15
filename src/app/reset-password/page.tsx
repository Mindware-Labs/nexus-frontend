"use client";

import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  Eye,
  EyeOff,
  Loader2,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { startTransition, use, useActionState, useState } from "react";
import { cn } from "@/lib/utils";
import { resetPasswordAction, type ActionState } from "@/app/actions/auth";
import { ResetPasswordSchema } from "@/lib/schemas/auth";

function ErrorBanner({ message }: { message: string }) {
  return (
    <div className="flex items-start gap-2.5 rounded-xl border border-nexus-coral/30 bg-nexus-coral/10 px-4 py-3 text-sm text-nexus-coral">
      <AlertCircle className="mt-0.5 size-4 shrink-0" />
      <span>{message}</span>
    </div>
  );
}

function PasswordInput({
  id,
  name,
  label,
  placeholder,
  autoComplete,
  error,
}: {
  id: string;
  name: string;
  label: string;
  placeholder: string;
  autoComplete?: string;
  error?: string;
}) {
  const [show, setShow] = useState(false);
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-white/80">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          name={name}
          type={show ? "text" : "password"}
          autoComplete={autoComplete}
          placeholder={placeholder}
          className={cn(
            "w-full rounded-xl border bg-white/[0.07] px-4 py-3 pr-11 text-sm text-white placeholder:text-white/35",
            "transition-all duration-200 outline-none focus:bg-white/[0.1] focus:ring-2",
            error
              ? "border-nexus-coral/50 focus:ring-nexus-coral/30"
              : "border-white/15 focus:border-nexus-lavender/50 focus:ring-nexus-lavender/20",
          )}
        />
        <button
          type="button"
          onClick={() => setShow((v) => !v)}
          tabIndex={-1}
          aria-label={show ? "Ocultar contraseña" : "Mostrar contraseña"}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 transition-colors hover:text-white/70"
        >
          {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
        </button>
      </div>
      {error && <p className="mt-1.5 text-xs text-nexus-coral">{error}</p>}
    </div>
  );
}

type FieldErrors = { password?: string; confirm?: string };

export default function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token: resetToken = "" } = use(searchParams);

  const [state, formAction, isPending] = useActionState<ActionState, FormData>(
    resetPasswordAction,
    { status: "idle" },
  );

  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const result = ResetPasswordSchema.safeParse({
      resetToken: fd.get("resetToken"),
      password: fd.get("password"),
      confirm: fd.get("confirm"),
    });
    if (!result.success) {
      const fe: FieldErrors = {};
      for (const issue of result.error.issues) {
        const key = issue.path[0] as keyof FieldErrors;
        if (key && !fe[key]) fe[key] = issue.message;
      }
      setFieldErrors(fe);
    } else {
      setFieldErrors({});
      startTransition(() => formAction(fd));
    }
  }

  const isSuccess = state.status === "success";
  const hasToken = resetToken.length > 0;

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-nexus-deep px-4 py-12">
      {/* Ambient glow */}
      <div aria-hidden className="pointer-events-none absolute -left-48 -top-48 size-[500px] rounded-full bg-nexus-purple/15 blur-[100px]" />
      <div aria-hidden className="pointer-events-none absolute -bottom-40 -right-40 size-96 rounded-full bg-nexus-lavender/10 blur-3xl" />

      {/* Back link */}
      <Link
        href="/forgot-password"
        className="mb-6 flex items-center gap-1.5 text-sm text-white/45 transition-colors hover:text-white/80 focus-visible:outline-none focus-visible:underline"
      >
        <ArrowLeft className="size-3.5" />
        Volver
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
        {!hasToken ? (
          /* ── Token inválido / acceso directo sin token ── */
          <div className="flex flex-col items-center text-center">
            <div className="mb-5 flex size-16 items-center justify-center rounded-2xl bg-nexus-coral/15 ring-1 ring-nexus-coral/30">
              <AlertCircle className="size-8 text-nexus-coral" />
            </div>
            <h1 className="mb-2 text-2xl font-bold tracking-tight text-white">Enlace inválido</h1>
            <p className="mb-8 text-sm text-white/50 leading-relaxed">
              El enlace ha expirado o ya fue utilizado. Solicita un nuevo código.
            </p>
            <Link
              href="/forgot-password"
              className="rounded-xl bg-nexus-purple px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-nexus-purple/30 transition-all hover:bg-nexus-purple/85"
            >
              Solicitar nuevo código
            </Link>
          </div>
        ) : isSuccess ? (
          /* ── Success ── */
          <div className="flex flex-col items-center text-center">
            <div className="mb-5 flex size-16 items-center justify-center rounded-2xl bg-nexus-mint/15 ring-1 ring-nexus-mint/30">
              <CheckCircle2 className="size-8 text-nexus-mint" />
            </div>
            <h1 className="mb-2 text-2xl font-bold tracking-tight text-white">
              ¡Contraseña actualizada!
            </h1>
            <p className="mb-8 text-sm text-white/50 leading-relaxed">
              Tu contraseña ha sido cambiada correctamente. Ya puedes iniciar sesión.
            </p>
            <Link
              href="/login"
              className="rounded-xl bg-nexus-purple px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-nexus-purple/30 transition-all hover:bg-nexus-purple/85"
            >
              Iniciar sesión
            </Link>
          </div>
        ) : (
          /* ── Form ── */
          <>
            <div className="mb-8 text-center">
              <h1 className="text-2xl font-bold tracking-tight text-white">Nueva contraseña</h1>
              <p className="mt-1.5 text-sm text-white/50">Crea una contraseña segura para tu cuenta</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {state.status === "error" && <ErrorBanner message={state.message} />}

              <input type="hidden" name="resetToken" value={resetToken} />

              <PasswordInput
                id="password"
                name="password"
                label="Nueva contraseña"
                placeholder="Mínimo 8 caracteres"
                autoComplete="new-password"
                error={fieldErrors.password}
              />
              <PasswordInput
                id="confirm"
                name="confirm"
                label="Confirmar contraseña"
                placeholder="Repite tu nueva contraseña"
                autoComplete="new-password"
                error={fieldErrors.confirm}
              />

              <button
                type="submit"
                disabled={isPending}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-nexus-purple px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-nexus-purple/30 transition-all duration-200 hover:bg-nexus-purple/85 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isPending && <Loader2 className="size-4 animate-spin" />}
                Guardar contraseña
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
