'use client'

import React, { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, Lock, Eye, EyeOff, ArrowRight, TriangleAlert } from 'lucide-react'
import { cn } from '@/lib/utils'

const FONT     = "'Hanken Grotesk', system-ui, sans-serif"
const PURPLE   = '#522566'
const LAVENDER = '#AD74C3'
const CORAL    = '#FB7185'
const INK      = '#111827'
const LILAC    = '#F8EDFB'

type BorderBeam = {
  axis: 'left' | 'top' | 'right' | 'bottom'
  from: string
  to: string
  top?: number
  right?: number
  bottom?: number
  left?: number
  height: number | string
  width: number | string
  delay: number
}

/* ── Field input ────────────────────────────────────────────────────── */
function FieldInput({ className, ...props }: React.ComponentProps<'input'>) {
  return (
    <input
      className={cn(
        'flex h-11 w-full rounded-xl border-2 border-[#E5D5F0] bg-[#FDFAFF] px-3 text-sm text-[#111827]',
        'placeholder:text-[#9CA3AF] outline-none transition-all duration-200',
        'focus:border-[#AD74C3] focus:bg-white focus:shadow-[0_0_0_4px_rgba(173,116,195,0.12)]',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        className,
      )}
      style={{ fontFamily: FONT }}
      {...props}
    />
  )
}

/* ── Purple border beams ────────────────────────────────────────────── */
function BorderBeams() {
  const beams: BorderBeam[] = [
    { axis: 'left'   as const, from: '-50%', to: '100%', top: 0,    height: 3,    width: '50%', delay: 0   },
    { axis: 'top'    as const, from: '-50%', to: '100%', right: 0,  width: 3,    height: '50%', delay: 0.7 },
    { axis: 'right'  as const, from: '-50%', to: '100%', bottom: 0, height: 3,   width: '50%',  delay: 1.4 },
    { axis: 'bottom' as const, from: '-50%', to: '100%', left: 0,   width: 3,    height: '50%', delay: 2.1 },
  ]

  return (
    <div className="absolute -inset-[1px] rounded-2xl overflow-hidden pointer-events-none">
      {beams.map((b, i) => {
        const isH = b.axis === 'left' || b.axis === 'right'
        return (
          <motion.div
            key={i}
            className="absolute"
            style={{
              top: b.top, right: b.right,
              bottom: b.bottom, left: b.left,
              height: b.height, width: b.width,
              background: isH
                ? `linear-gradient(to right, transparent, ${LAVENDER}, transparent)`
                : `linear-gradient(to bottom, transparent, ${LAVENDER}, transparent)`,
              filter: 'blur(1.5px)',
            }}
            animate={{ [b.axis]: [b.from, b.to], opacity: [0, 0.9, 0] }}
            transition={{
              [b.axis]: { duration: 2.5, ease: 'easeInOut', repeat: Infinity, repeatDelay: 1.2, delay: b.delay },
              opacity:   { duration: 2.5, ease: 'easeInOut', repeat: Infinity, repeatDelay: 1.2, delay: b.delay },
            }}
          />
        )
      })}
      {[{ top: 0, left: 0 }, { top: 0, right: 0 }, { bottom: 0, right: 0 }, { bottom: 0, left: 0 }].map((pos, i) => (
        <motion.div
          key={i}
          className="absolute size-1.5 rounded-full"
          style={{ ...pos, background: LAVENDER }}
          animate={{ opacity: [0.2, 0.7, 0.2] }}
          transition={{ duration: 2 + i * 0.3, repeat: Infinity, repeatType: 'mirror', delay: i * 0.5 }}
        />
      ))}
    </div>
  )
}

/* ── Purple mouse spotlight ─────────────────────────────────────────── */
function PurpleSpotlight({ containerRef }: { containerRef: React.RefObject<HTMLDivElement | null> }) {
  const [pos,  setPos]  = useState({ x: 0, y: 0 })
  const [show, setShow] = useState(false)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const onMove  = (e: MouseEvent) => { const r = el.getBoundingClientRect(); setPos({ x: e.clientX - r.left, y: e.clientY - r.top }); setShow(true) }
    const onLeave = () => setShow(false)
    el.addEventListener('mousemove', onMove)
    el.addEventListener('mouseleave', onLeave)
    return () => { el.removeEventListener('mousemove', onMove); el.removeEventListener('mouseleave', onLeave) }
  }, [containerRef])

  return (
    <motion.div
      className="pointer-events-none absolute rounded-full"
      style={{
        width: 440, height: 440,
        left: pos.x - 220, top: pos.y - 220,
        background: 'radial-gradient(circle, rgba(173,116,195,0.13) 0%, rgba(82,37,102,0.06) 45%, transparent 70%)',
      }}
      animate={{ opacity: show ? 1 : 0 }}
      transition={{ duration: 0.18 }}
    />
  )
}

/* ── Caps-lock hook ─────────────────────────────────────────────────── */
function useCapsLock() {
  const [on, setOn] = useState(false)
  useEffect(() => {
    const check = (e: KeyboardEvent) => { if (e.getModifierState) setOn(e.getModifierState('CapsLock')) }
    window.addEventListener('keydown', check)
    window.addEventListener('keyup',   check)
    return () => { window.removeEventListener('keydown', check); window.removeEventListener('keyup', check) }
  }, [])
  return on
}

/* ── Public props ───────────────────────────────────────────────────── */
export interface SignInCard2Props {
  onSubmit: (email: string, password: string, rememberMe: boolean) => Promise<void> | void
  error?: string
  isLoading?: boolean
  forgotPasswordHref?: string
  signUpHref?: string
}

export function SignInCard2({
  onSubmit,
  error,
  isLoading = false,
  forgotPasswordHref = '/forgot-password',
  signUpHref,
}: SignInCard2Props) {
  const [showPassword, setShowPassword] = useState(false)
  const [email,        setEmail]        = useState('')
  const [password,     setPassword]     = useState('')
  const [rememberMe,   setRememberMe]   = useState(false)
  const [focused,      setFocused]      = useState<string | null>(null)
  const cardRef = useRef<HTMLDivElement>(null)
  const capsOn  = useCapsLock()

  async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault()
    await onSubmit(email, password, rememberMe)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className="w-full max-w-[460px] relative z-10"
    >
      <div className="relative group">
        <BorderBeams />

        {/* Outer glow pulse */}
        <motion.div
          className="absolute -inset-1 rounded-2xl"
          animate={{ boxShadow: ['0 0 0px 0px rgba(173,116,195,0)', '0 8px 40px 4px rgba(173,116,195,0.18)', '0 0 0px 0px rgba(173,116,195,0)'] }}
          transition={{ duration: 4, repeat: Infinity, repeatType: 'mirror' }}
        />

        {/* Card */}
        <div
          ref={cardRef}
          className="relative overflow-hidden rounded-2xl bg-white border border-[#E8D5F2] shadow-[0_8px_48px_rgba(82,37,102,0.10)]"
        >
          <PurpleSpotlight containerRef={cardRef} />

          <div className="relative z-10 px-10 py-8">
            {/* Header */}
            <div className="text-center mb-7">
              {/* Logo — grande para colocar imagen luego */}
              <motion.div
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', duration: 0.7 }}
                className="mx-auto mb-5 flex h-[72px] w-full max-w-[260px] items-center justify-center"
              >
                <Image
                  src="/LogosMWL/dark_logo_transparent_background.png"
                  alt="Logo de Mindware Nexus"
                  width={260}
                  height={72}
                  priority
                  className="h-full w-full object-contain"
                />
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="text-2xl font-bold"
                style={{ fontFamily: FONT, color: INK }}
              >
                Bienvenido de vuelta
              </motion.h1>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.22 }}
                className="mt-1 text-sm"
                style={{ fontFamily: FONT, color: '#6B7280' }}
              >
                Inicia sesión en{' '}
                <span style={{ color: LAVENDER, fontWeight: 600 }}>Mindware Nexus</span>
              </motion.p>
            </div>

            {/* Error banner */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -8, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: 'auto' }}
                  exit={{ opacity: 0, y: -8, height: 0 }}
                  transition={{ duration: 0.22 }}
                  className="mb-5 flex items-start gap-2.5 rounded-xl border px-3.5 py-3 text-sm"
                  style={{ borderColor: `${CORAL}40`, background: `${CORAL}12`, color: CORAL, fontFamily: FONT }}
                >
                  <TriangleAlert className="mt-0.5 size-4 shrink-0" />
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email */}
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <label className="mb-1.5 block text-xs font-semibold" style={{ fontFamily: FONT, color: '#374151' }}>
                  Correo electrónico
                </label>
                <div className="relative">
                  <Mail
                    className="absolute left-3 top-1/2 -translate-y-1/2 size-4 transition-colors duration-200"
                    style={{ color: focused === 'email' ? LAVENDER : '#9CA3AF' }}
                  />
                  <FieldInput
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    onFocus={() => setFocused('email')}
                    onBlur={() => setFocused(null)}
                    className="pl-10"
                    required
                    disabled={isLoading}
                    autoComplete="email"
                  />
                </div>
              </motion.div>

              {/* Password */}
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.27 }}
              >
                <label className="mb-1.5 block text-xs font-semibold" style={{ fontFamily: FONT, color: '#374151' }}>
                  Contraseña
                </label>
                <div className="relative">
                  <Lock
                    className="absolute left-3 top-1/2 -translate-y-1/2 size-4 transition-colors duration-200"
                    style={{ color: focused === 'password' ? LAVENDER : '#9CA3AF' }}
                  />
                  <FieldInput
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    onFocus={() => setFocused('password')}
                    onBlur={() => setFocused(null)}
                    className="pl-10 pr-10"
                    required
                    disabled={isLoading}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    tabIndex={-1}
                    onClick={() => setShowPassword(v => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors duration-200"
                    style={{ color: '#9CA3AF' }}
                    aria-label={showPassword ? 'Ocultar' : 'Mostrar'}
                  >
                    {showPassword
                      ? <EyeOff className="size-4 hover:text-[#522566] transition-colors" />
                      : <Eye    className="size-4 hover:text-[#522566] transition-colors" />}
                  </button>
                </div>

                {/* Caps lock aviso — bajo el campo */}
                <AnimatePresence>
                  {capsOn && (
                    <motion.p
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      transition={{ duration: 0.18 }}
                      className="mt-1.5 flex items-center gap-1.5 text-xs"
                      style={{ fontFamily: FONT, color: '#D97706' }}
                    >
                      <span className="inline-block size-3.5 rounded-sm border border-amber-400 bg-amber-50 text-center text-[9px] font-bold leading-3.5" style={{ color: '#D97706' }}>⇪</span>
                      Mayúsculas activadas
                    </motion.p>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Remember me + forgot */}
              <motion.div
                className="flex items-center justify-between pt-0.5"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.33 }}
              >
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <div className="relative size-4">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={() => setRememberMe(v => !v)}
                      className="appearance-none size-4 rounded border-2 border-[#D1B8E8] bg-white transition-all duration-200 cursor-pointer focus:outline-none"
                      style={rememberMe ? { background: PURPLE, borderColor: PURPLE } : {}}
                    />
                    <AnimatePresence>
                      {rememberMe && (
                        <motion.svg
                          initial={{ opacity: 0, scale: 0.4 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.4 }}
                          transition={{ duration: 0.14 }}
                          className="absolute inset-0 m-auto pointer-events-none"
                          xmlns="http://www.w3.org/2000/svg"
                          width="10" height="10" viewBox="0 0 24 24"
                          fill="none" stroke="white" strokeWidth="3.5"
                          strokeLinecap="round" strokeLinejoin="round"
                        >
                          <polyline points="20 6 9 17 4 12" />
                        </motion.svg>
                      )}
                    </AnimatePresence>
                  </div>
                  <span className="text-xs font-medium" style={{ fontFamily: FONT, color: '#6B7280' }}>Recordarme</span>
                </label>

                <Link
                  href={forgotPasswordHref}
                  className="text-xs font-semibold hover:underline underline-offset-2 transition-colors"
                  style={{ fontFamily: FONT, color: LAVENDER }}
                >
                  ¿Olvidaste tu contraseña?
                </Link>
              </motion.div>

              {/* Submit */}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.38 }}
              >
                <motion.button
                  whileHover={{ scale: 1.015 }}
                  whileTap={{ scale: 0.975 }}
                  type="submit"
                  disabled={isLoading}
                  className="relative w-full h-11 rounded-xl overflow-hidden font-semibold text-sm text-white mt-1 disabled:opacity-60 disabled:cursor-not-allowed group/btn"
                  style={{ fontFamily: FONT, background: `linear-gradient(135deg, ${PURPLE}, ${LAVENDER})` }}
                >
                  {/* Hover overlay */}
                  <div className="absolute inset-0 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"
                    style={{ background: `linear-gradient(135deg, ${LAVENDER}, ${PURPLE})` }} />
                  {/* Shine sweep */}
                  <div className="absolute inset-0 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-700 skew-x-[-12deg]"
                    style={{ background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.18), transparent)' }} />

                  <span className="relative z-10 flex items-center justify-center gap-2">
                    <AnimatePresence mode="wait">
                      {isLoading ? (
                        <motion.div key="spin" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                          <div className="size-4 border-2 border-white/50 border-t-white rounded-full animate-spin" />
                        </motion.div>
                      ) : (
                        <motion.span key="text" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-1.5">
                          Iniciar sesión
                          <ArrowRight className="size-4 group-hover/btn:translate-x-0.5 transition-transform duration-200" />
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </span>
                </motion.button>
              </motion.div>

              {/* Divider */}
              <div className="relative flex items-center gap-3 py-0.5">
                <div className="flex-1 h-px" style={{ background: '#E8D5F2' }} />
                <span className="text-xs" style={{ fontFamily: FONT, color: '#9CA3AF' }}>o continúa con</span>
                <div className="flex-1 h-px" style={{ background: '#E8D5F2' }} />
              </div>

              {/* Google */}
              <motion.button
                whileHover={{ scale: 1.01, backgroundColor: LILAC }}
                whileTap={{ scale: 0.98 }}
                type="button"
                className="w-full h-11 rounded-xl border-2 flex items-center justify-center gap-2.5 text-sm font-medium transition-all duration-200"
                style={{ fontFamily: FONT, borderColor: '#E8D5F2', color: INK, backgroundColor: 'white' }}
              >
                <svg width="17" height="17" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continuar con Google
              </motion.button>

              {signUpHref && (
                <p className="pt-1 text-center text-xs" style={{ fontFamily: FONT, color: '#6B7280' }}>
                  ¿No tienes cuenta?{' '}
                  <Link href={signUpHref} className="font-semibold hover:underline underline-offset-2 transition-colors" style={{ color: LAVENDER }}>
                    Crear cuenta
                  </Link>
                </p>
              )}
            </form>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
