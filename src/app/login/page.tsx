'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeft, Clock, Loader2, ShieldCheck } from 'lucide-react'
import Link from 'next/link'
import { startTransition, useActionState, useEffect, useState } from 'react'
import { loginAction, verify2FAAction, type ActionState } from '@/app/actions/auth'
import { LoginSchema, TwoFASchema } from '@/lib/schemas/auth'
import { SignInCard2 } from '@/components/ui/sign-in-card-2'
import { cn } from '@/lib/utils'

const FONT = "'Hanken Grotesk', system-ui, sans-serif"
const RL_KEY      = 'nx_rl_expires'
const BLOCKED_KEY = 'nx_acc_blocked'

/* ── Background: white limpio ───────────────────────────────────────── */
function Background() {
  return <div className="absolute inset-0 bg-white" />
}

/* ── Rate-limit banner ─────────────────────────────────────────────── */
function RateLimitBanner({ seconds }: { seconds: number }) {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  const t = m > 0 ? `${m}:${String(s).padStart(2, '0')}` : `${s}s`
  return (
    <div className="flex items-center gap-2.5 rounded-lg border border-amber-400/40 bg-amber-50 px-3 py-2.5 text-xs text-amber-700" style={{ fontFamily: FONT }}>
      <Clock className="size-3.5 shrink-0" />
      Demasiados intentos. Reintenta en <span className="font-semibold tabular-nums">{t}</span>
    </div>
  )
}

/* ── 2-FA step ─────────────────────────────────────────────────────── */
function TwoFactorStep({
  preAuthToken,
  formAction,
  state,
  isPending,
  isRateLimited,
  rlSeconds,
  onBack,
}: {
  preAuthToken: string
  formAction: (fd: FormData) => void
  state: ActionState
  isPending: boolean
  isRateLimited: boolean
  rlSeconds: number
  onBack: () => void
}) {
  const [code, setCode]       = useState('')
  const [fieldErr, setFieldErr] = useState<string>()

  function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault()
    if (isRateLimited) return
    const fd = new FormData(e.currentTarget)
    const r  = TwoFASchema.safeParse({ preAuthToken: fd.get('preAuthToken'), code: fd.get('code') })
    if (!r.success) { setFieldErr(r.error.issues[0]?.message); return }
    setFieldErr(undefined)
    startTransition(() => formAction(fd))
  }

  return (
    <motion.div
      key="2fa"
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -14 }}
      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
      className="w-full max-w-sm z-10"
    >
      {/* card blanco */}
      <div className="relative bg-white rounded-2xl p-8 border border-[#E8D5F2] shadow-[0_8px_48px_rgba(82,37,102,0.10)]">
        {/* top accent */}
        <div className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl bg-linear-to-r from-[#522566] via-[#AD74C3] to-[#34D399]" />

        <div className="text-center mb-6">
          <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-xl shadow-lg" style={{ background: 'linear-gradient(135deg,#522566,#AD74C3)', boxShadow: '0 6px 20px rgba(173,116,195,0.3)' }}>
            <ShieldCheck className="size-6 text-white" />
          </div>
          <h1 className="text-lg font-bold text-[#111827]" style={{ fontFamily: FONT }}>Verificación en dos pasos</h1>
          <p className="mt-1 text-xs text-[#6B7280]" style={{ fontFamily: FONT }}>Código de 6 dígitos de tu app autenticadora</p>
        </div>

        {isRateLimited && <RateLimitBanner seconds={rlSeconds} />}
        {!isRateLimited && state.status === 'error' && (
          <p className="mb-3 rounded-xl border border-[#FB7185]/30 bg-[#FB7185]/8 px-3 py-2.5 text-xs text-[#FB7185]" style={{ fontFamily: FONT }}>{state.message}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-3 mt-4">
          <input type="hidden" name="preAuthToken" value={preAuthToken} />
          <input
            name="code"
            type="text"
            inputMode="numeric"
            pattern="\d{6}"
            maxLength={6}
            autoComplete="one-time-code"
            placeholder="000000"
            value={code}
            onChange={e => setCode(e.target.value)}
            disabled={isPending || isRateLimited}
            className={cn(
              'w-full h-12 rounded-xl border-2 border-[#E5D5F0] bg-[#FDFAFF] text-center font-mono',
              'text-2xl tracking-[0.5em] text-[#111827] placeholder:text-[#9CA3AF] placeholder:tracking-normal',
              'outline-none focus:border-[#AD74C3] focus:shadow-[0_0_0_4px_rgba(173,116,195,0.12)] transition-all duration-200',
              'disabled:opacity-50',
              fieldErr && 'border-[#FB7185]',
            )}
          />
          {fieldErr && <p className="text-xs text-[#FB7185]" style={{ fontFamily: FONT }}>{fieldErr}</p>}

          <motion.button
            whileHover={{ scale: 1.02, opacity: 0.92 }}
            whileTap={{ scale: 0.97 }}
            type="submit"
            disabled={isPending || isRateLimited}
            className="w-full h-11 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-2 disabled:opacity-50 transition-all duration-200"
            style={{ fontFamily: FONT, background: 'linear-gradient(135deg,#522566,#AD74C3)' }}
          >
            {isPending ? <Loader2 className="size-4 animate-spin" /> : 'Verificar código'}
          </motion.button>

          <button
            type="button"
            onClick={onBack}
            className="flex w-full items-center justify-center gap-1.5 text-xs text-[#9CA3AF] hover:text-[#522566] transition-colors pt-1"
            style={{ fontFamily: FONT }}
          >
            <ArrowLeft className="size-3" />
            Volver al inicio de sesión
          </button>
        </form>
      </div>
    </motion.div>
  )
}

/* ── Page ──────────────────────────────────────────────────────────── */
export default function LoginPage() {
  const [loginState, loginFormAction, isLoginPending] = useActionState<ActionState, FormData>(loginAction, { status: 'idle' })
  const [twoFAState, twoFAFormAction, is2FAPending]   = useActionState<ActionState, FormData>(verify2FAAction, { status: 'idle' })

  /* rate-limit countdown */
  const [rlSeconds, setRlSeconds] = useState(0)
  const isRateLimited = rlSeconds > 0

  useEffect(() => {
    const stored = sessionStorage.getItem(RL_KEY)
    if (!stored) return
    const rem = Math.ceil((Number(stored) - Date.now()) / 1000)
    if (rem > 0) startTransition(() => setRlSeconds(rem))
    else sessionStorage.removeItem(RL_KEY)
  }, [])

  useEffect(() => {
    const rl = loginState.status === 'rate_limited' ? loginState
             : twoFAState.status === 'rate_limited' ? twoFAState
             : null
    if (!rl) return
    const exp = Date.now() + rl.retryAfterSeconds * 1000
    sessionStorage.setItem(RL_KEY, String(exp))
    startTransition(() => setRlSeconds(rl.retryAfterSeconds))
  }, [loginState, twoFAState])

  useEffect(() => {
    if (!isRateLimited) return
    const id = setInterval(() => {
      setRlSeconds(prev => {
        if (prev <= 1) { sessionStorage.removeItem(RL_KEY); return 0 }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(id)
  }, [isRateLimited])

  /* blocked state */
  const [blockedMsg, setBlockedMsg] = useState<string>()

  useEffect(() => {
    try {
      const s = sessionStorage.getItem(BLOCKED_KEY)
      if (s) startTransition(() => setBlockedMsg((JSON.parse(s) as { message: string }).message))
    } catch {}
  }, [])

  useEffect(() => {
    if (loginState.status === 'blocked') {
      try { sessionStorage.setItem(BLOCKED_KEY, JSON.stringify({ message: loginState.message })) } catch {}
      startTransition(() => setBlockedMsg(loginState.message))
    }
  }, [loginState])

  const isBlocked = !!blockedMsg
  const show2FA   = loginState.status === 'two_factor'

  /* error message for SignInCard2 */
  const cardError = blockedMsg
    ?? (loginState.status === 'error' ? loginState.message : undefined)

  /* adapter: SignInCard2 calls onSubmit(email, password) */
  async function handleCardSubmit(email: string, password: string) {
    if (isBlocked || isRateLimited) return
    const fd = new FormData()
    fd.set('email', email)
    fd.set('password', password)

    const r = LoginSchema.safeParse({ email, password })
    if (!r.success) return   // card's native HTML validation already catches this

    startTransition(() => loginFormAction(fd))
  }

  return (
    <div className="min-h-screen w-screen bg-black relative overflow-hidden flex flex-col items-center justify-center">
      <Background />

      {/* Rate-limit overlay */}
      {isRateLimited && (
        <div className="absolute top-6 z-20 w-full max-w-md px-4">
          <RateLimitBanner seconds={rlSeconds} />
        </div>
      )}

      <AnimatePresence mode="wait" initial={false}>
        {show2FA ? (
          <TwoFactorStep
            key="2fa"
            preAuthToken={(loginState as { status: 'two_factor'; preAuthToken: string }).preAuthToken}
            formAction={twoFAFormAction}
            state={twoFAState}
            isPending={is2FAPending}
            isRateLimited={isRateLimited}
            rlSeconds={rlSeconds}
            onBack={() => window.location.reload()}
          />
        ) : (
          <motion.div
            key="card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="relative z-10 w-full flex justify-center px-4"
          >
            <SignInCard2
              onSubmit={handleCardSubmit}
              error={isBlocked ? blockedMsg : cardError}
              isLoading={isLoginPending}
              forgotPasswordHref="/forgot-password"
            />
          </motion.div>
        )}
      </AnimatePresence>

      <Link
        href="/"
        className="absolute bottom-5 left-6 z-10 flex items-center gap-1.5 text-xs text-[#9CA3AF] hover:text-[#522566] transition-colors duration-200"
        style={{ fontFamily: FONT }}
      >
        <ArrowLeft className="size-3.5" />
        Volver al sitio
      </Link>

      <p className="absolute bottom-5 text-xs text-[#9CA3AF] z-10" style={{ fontFamily: FONT }}>
        © {new Date().getFullYear()} Mindware Labs · Todos los derechos reservados
      </p>
    </div>
  )
}
