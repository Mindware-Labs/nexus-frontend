'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence, useInView } from 'motion/react'
import { Zap, Target, Clock, DollarSign, User, TrendingUp, Bot, Flame } from 'lucide-react'

// ─── Static data ──────────────────────────────────────────────────────────────

const MESSAGES = [
  { id: 0, role: 'user', text: 'Hola, buscamos automatizar la captación de leads. Nuestro sitio tiene tráfico pero la conversión es muy baja.' },
  { id: 1, role: 'bot',  text: 'Entendido. ¿Cuál es el mayor cuello de botella en tu proceso de ventas hoy?' },
  { id: 2, role: 'user', text: 'Tardamos mucho en responder. Somos 6 vendedores y el follow-up es completamente manual.' },
  { id: 3, role: 'bot',  text: '¿Qué presupuesto mensual manejan para herramientas de ventas y captación?' },
  { id: 4, role: 'user', text: 'Tenemos aprobado hasta $2,000/mes. Yo soy el Director Comercial, la decisión la tomo yo.' },
  { id: 5, role: 'bot',  text: '¿Cuándo necesitarían tener algo funcionando?' },
  { id: 6, role: 'user', text: 'Antes del 15 de julio. Tenemos una campaña grande que arranca ese día y necesitamos estar listos.' },
]

const CRITERIA = [
  { id: 'pain',      icon: Target,     label: 'Dolor de negocio',         weight: 25 },
  { id: 'budget',    icon: DollarSign, label: 'Presupuesto confirmado',    weight: 25 },
  { id: 'authority', icon: User,       label: 'Autoridad de decisión',     weight: 20 },
  { id: 'urgency',   icon: Clock,      label: 'Urgencia de compra',        weight: 20 },
  { id: 'fit',       icon: TrendingUp, label: 'Fit con el producto',       weight: 10 },
]

const TIMELINE = [
  { at: 0,     action: 'show',   idx: 0 },
  { at: 1000,  action: 'typing' },
  { at: 2200,  action: 'show',   idx: 1 },
  { at: 3800,  action: 'show',   idx: 2, score: 35, unlock: ['pain', 'fit'] },
  { at: 5000,  action: 'typing' },
  { at: 6000,  action: 'show',   idx: 3 },
  { at: 7600,  action: 'show',   idx: 4, score: 80, unlock: ['budget', 'authority'] },
  { at: 8800,  action: 'typing' },
  { at: 9800,  action: 'show',   idx: 5 },
  { at: 11400, action: 'show',   idx: 6, score: 95, unlock: ['urgency'] },
] as const

// ─── Score count-up hook ───────────────────────────────────────────────────────

function useCountUp(target: number, duration = 700) {
  const [display, setDisplay] = useState(0)
  const raf = useRef<number | null>(null)
  const startRef = useRef<number | null>(null)
  const fromRef = useRef(0)

  useEffect(() => {
    fromRef.current = display
    startRef.current = null
    if (raf.current) cancelAnimationFrame(raf.current)
    const from = fromRef.current
    function step(ts: number) {
      if (!startRef.current) startRef.current = ts
      const t = Math.min((ts - startRef.current) / duration, 1)
      const ease = 1 - Math.pow(1 - t, 3)
      setDisplay(Math.round(from + (target - from) * ease))
      if (t < 1) raf.current = requestAnimationFrame(step)
    }
    raf.current = requestAnimationFrame(step)
    return () => { if (raf.current) cancelAnimationFrame(raf.current) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target])

  return display
}

// ─── Main component ───────────────────────────────────────────────────────────

export function LeadScoringSection() {
  const sectionRef    = useRef<HTMLDivElement>(null)
  const chatScrollRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' })

  const [visibleMessages,  setVisibleMessages]  = useState<number[]>([])
  const [isTyping,         setIsTyping]          = useState(false)
  const [unlockedCriteria, setUnlockedCriteria]  = useState<string[]>([])
  const [score,            setScore]             = useState(0)

  const displayScore = useCountUp(score, 900)
  const isDone       = score >= 95

  const scoreColor =
    score === 0   ? 'text-white/25'
    : score < 50  ? 'text-white'
    : score < 85  ? 'text-amber-400'
    :               'text-nexus-mint'

  // Scroll chat container internally — never the page
  useEffect(() => {
    const el = chatScrollRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [visibleMessages, isTyping])

  // Run / re-run the timeline
  useEffect(() => {
    if (!isInView) return
    setVisibleMessages([])
    setIsTyping(false)
    setUnlockedCriteria([])
    setScore(0)

    const timers: ReturnType<typeof setTimeout>[] = []
    for (const event of TIMELINE) {
      if (event.action === 'show') {
        const e = event as typeof event & { idx: number; score?: number; unlock?: readonly string[] }
        timers.push(setTimeout(() => {
          setIsTyping(false)
          setVisibleMessages(prev => [...prev, e.idx])
          if (e.score   !== undefined) setScore(e.score)
          if (e.unlock)                setUnlockedCriteria(prev => [...prev, ...(e.unlock as string[])])
        }, e.at))
      } else if (event.action === 'typing') {
        timers.push(setTimeout(() => setIsTyping(true), event.at))
      }
    }
    return () => timers.forEach(clearTimeout)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isInView])

  return (
    <section
      id="lead-scoring"
      ref={sectionRef}
      className="relative overflow-hidden border-t border-white/5 bg-[#030303] py-16 md:py-20"
    >
      {/* Grid */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.018)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.018)_1px,transparent_1px)] bg-[size:44px_44px] [mask-image:radial-gradient(ellipse_70%_70%_at_50%_50%,#000_30%,transparent_100%)]" />

      {/* Ambient glows */}
      <div className="pointer-events-none absolute left-[-5%] top-[20%] h-[500px] w-[500px] rounded-full bg-nexus-purple/10 blur-[130px]" />
      <div className="pointer-events-none absolute bottom-[10%] right-[-5%] h-[450px] w-[450px] rounded-full bg-nexus-mint/6 blur-[120px]" />

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">

        {/* Header */}
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <motion.p
            initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.5 }}
            className="mb-4 flex items-center justify-center gap-2 text-xs font-semibold tracking-[0.22em] text-nexus-lavender uppercase"
          >
            <Zap className="size-3.5" /> Lead Scoring Inteligente
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.08 }}
            className="text-3xl font-semibold leading-[1.05] tracking-tighter text-white md:text-4xl lg:text-5xl"
          >
            Cada conversación se{' '}
            <span className="bg-gradient-to-r from-nexus-lavender via-white to-nexus-mint bg-clip-text text-transparent">
              califica sola.
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.16 }}
            className="mt-5 text-base leading-7 text-white/50"
          >
            La IA analiza el contexto en tiempo real y evalúa al prospecto con tu rúbrica propia.
            Tu equipo recibe el lead ya calificado, listo para cerrar.
          </motion.p>
        </div>

        {/* Live demo */}
        <motion.div
          initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
          className="mx-auto grid max-w-5xl items-start gap-4 lg:grid-cols-[1fr_360px]"
        >

          {/* ── LEFT: chat ───────────────────────────────────── */}
          <div className="flex h-[420px] flex-col overflow-hidden rounded-2xl border border-white/8 bg-white/[0.025] backdrop-blur-sm">
            {/* Header */}
            <div className="flex shrink-0 items-center gap-3 border-b border-white/6 bg-nexus-purple/20 px-4 py-3">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-nexus-purple">
                <Bot className="size-4 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-white">Asistente Nexus</p>
                <p className="text-[11px] text-white/40">Widget en vivo · nexus.ai</p>
              </div>
              <span className="flex items-center gap-1.5 text-xs text-nexus-mint">
                <span className="size-1.5 animate-pulse rounded-full bg-nexus-mint" /> En línea
              </span>
            </div>

            {/* Messages */}
            <div ref={chatScrollRef} className="flex flex-1 flex-col gap-2.5 overflow-y-auto px-4 py-3">
              <AnimatePresence initial={false}>
                {visibleMessages.map(idx => {
                  const msg    = MESSAGES[idx]
                  const isUser = msg.role === 'user'
                  return (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ duration: 0.28, ease: [0.23, 1, 0.32, 1] }}
                      className={`flex items-end gap-2 ${isUser ? 'justify-end' : 'justify-start'}`}
                    >
                      {!isUser && (
                        <div className="mb-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-nexus-purple">
                          <Bot className="size-3.5 text-white" />
                        </div>
                      )}
                      <div className={`max-w-[78%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                        isUser ? 'rounded-br-sm bg-nexus-purple text-white' : 'rounded-bl-sm bg-white/8 text-white/85'
                      }`}>
                        {msg.text}
                      </div>
                    </motion.div>
                  )
                })}
              </AnimatePresence>

              <AnimatePresence>
                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0, y: 6, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="flex items-end gap-2"
                  >
                    <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-nexus-purple">
                      <Bot className="size-3.5 text-white" />
                    </div>
                    <div className="rounded-2xl rounded-bl-sm bg-white/8 px-3.5 py-3">
                      <span className="flex gap-1">
                        {[0, 1, 2].map(i => (
                          <span
                            key={i}
                            className="inline-block size-1.5 rounded-full bg-white/40 animate-[typing-dot_1.2s_ease-in-out_infinite]"
                            style={{ animationDelay: `${i * 0.2}s` }}
                          />
                        ))}
                      </span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="h-px shrink-0" />
            </div>

            {/* Fake input */}
            <div className="shrink-0 border-t border-white/6 px-4 py-3">
              <div className="flex items-center gap-2 rounded-xl bg-white/5 px-3 py-2">
                <p className="flex-1 select-none text-sm text-white/20">Escribe un mensaje…</p>
                <div className="flex size-6 items-center justify-center rounded-lg bg-nexus-purple/50">
                  <svg viewBox="0 0 16 16" className="size-3.5 fill-white/50"><path d="M14 8L2 2l2.5 6L2 14z" /></svg>
                </div>
              </div>
            </div>
          </div>

          {/* ── RIGHT: rubric ────────────────────────────────── */}
          <div className={`relative flex h-[420px] flex-col overflow-hidden rounded-2xl border bg-white/[0.025] backdrop-blur-sm transition-all duration-700 ${
            isDone ? 'border-nexus-mint/35 shadow-[0_0_60px_rgba(52,211,153,0.14)]' : 'border-white/8'
          }`}>

            {/* Header */}
            <div className="shrink-0 border-b border-white/6 px-4 py-3">
              <div className="flex items-center gap-2">
                <Zap className="size-4 text-nexus-lavender" />
                <p className="text-sm font-semibold text-white">Rúbrica de Calificación</p>
                <span className="ml-auto rounded-full border border-nexus-lavender/20 bg-nexus-lavender/10 px-2 py-0.5 text-[10px] font-medium text-nexus-lavender">
                  IA · Tiempo real
                </span>
              </div>
            </div>

            {/* Criteria — fixed height, no scroll */}
            <div className="flex shrink-0 flex-col gap-1.5 px-3 pt-3 pb-2">
              {CRITERIA.map(c => {
                const isUnlocked = unlockedCriteria.includes(c.id)
                return (
                  <div
                    key={c.id}
                    className={`rounded-lg border px-2.5 py-2 transition-all duration-500 ${
                      isUnlocked
                        ? 'border-nexus-lavender/25 bg-nexus-lavender/[0.07]'
                        : 'border-white/5 bg-white/[0.018]'
                    }`}
                  >
                    <div className="mb-1.5 flex items-center gap-2">
                      <div className={`flex size-5 shrink-0 items-center justify-center rounded-md transition-colors duration-500 ${isUnlocked ? 'bg-nexus-lavender/25' : 'bg-white/5'}`}>
                        <c.icon className={`size-3 transition-colors duration-500 ${isUnlocked ? 'text-nexus-lavender' : 'text-white/20'}`} />
                      </div>
                      <span className={`flex-1 text-xs transition-colors duration-300 ${isUnlocked ? 'font-medium text-white' : 'text-white/30'}`}>
                        {c.label}
                      </span>
                      <AnimatePresence mode="wait">
                        {isUnlocked ? (
                          <motion.span
                            key="v"
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ type: 'spring', stiffness: 500, damping: 22 }}
                            className="text-[11px] font-bold text-nexus-lavender"
                          >
                            +{c.weight}pts
                          </motion.span>
                        ) : (
                          <span key="e" className="text-xs text-white/12">—</span>
                        )}
                      </AnimatePresence>
                    </div>
                    {/* Progress bar */}
                    <div className="h-[3px] overflow-hidden rounded-full bg-white/5">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-nexus-lavender to-nexus-purple"
                        style={{
                          width: isUnlocked ? '100%' : '0%',
                          transition: 'width 650ms cubic-bezier(0.23, 1, 0.32, 1)',
                        }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Separator */}
            <div className="mx-3 shrink-0 h-px bg-white/5" />

            {/* Score area — flex-1, shows in-progress state */}
            <div className="flex flex-1 items-center justify-center overflow-hidden">
              <AnimatePresence>
                {!isDone && (
                  <motion.div
                    key="scoring"
                    exit={{ opacity: 0, scale: 0.88, filter: 'blur(4px)' }}
                    transition={{ duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
                    className="flex flex-col items-center gap-1.5"
                  >
                    <div className="flex items-baseline gap-1">
                      <span className={`text-5xl font-light tabular-nums leading-none tracking-tighter transition-colors duration-500 ${scoreColor}`}>
                        {displayScore === 0 ? '—' : displayScore}
                      </span>
                      {displayScore > 0 && <span className="text-sm text-white/20">/100</span>}
                    </div>
                    <p className="text-[11px] text-white/25">
                      {score === 0 ? 'Esperando conversación…' : 'Analizando en tiempo real…'}
                    </p>
                    {score > 0 && (
                      <div className="mt-1 h-[3px] w-24 overflow-hidden rounded-full bg-white/6">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-amber-400 to-nexus-lavender"
                          style={{ width: `${score}%`, transition: 'width 700ms cubic-bezier(0.23, 1, 0.32, 1)' }}
                        />
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* ★ HOT LEAD REVEAL — covers the FULL panel (absolute inset-0 on relative parent) ★ */}
            <AnimatePresence>
              {isDone && (
                <motion.div
                  key="done"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 overflow-hidden rounded-2xl"
                >
                  {/* Solid dark bg covers header + criteria + everything */}
                  <div className="absolute inset-0 bg-[#07070c]" />

                  {/* Radial mint glow */}
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_55%_at_50%_55%,rgba(52,211,153,0.1),transparent)]" />

                  {/* Pulse rings */}
                  {[0, 1, 2].map(i => (
                    <motion.div
                      key={i}
                      className="absolute rounded-full border border-nexus-mint/20"
                      style={{ width: 64, height: 64 }}
                      animate={{ scale: [1, 4], opacity: [0.5, 0] }}
                      transition={{ duration: 2.8, delay: i * 0.88, repeat: Infinity, ease: 'easeOut' }}
                    />
                  ))}

                  {/* Score number */}
                  <motion.div
                    initial={{ scale: 0.3, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 220, damping: 16 }}
                    className="relative z-10 flex items-end gap-2 leading-none"
                  >
                    <span
                      className="text-[96px] font-extralight tracking-tighter text-nexus-mint tabular-nums"
                      style={{ textShadow: '0 0 50px rgba(52,211,153,0.65), 0 0 100px rgba(52,211,153,0.3)' }}
                    >
                      {displayScore}
                    </span>
                    <span className="mb-4 text-xl text-white/25">/100</span>
                  </motion.div>

                  {/* Hot Lead badge */}
                  <motion.div
                    initial={{ opacity: 0, y: 18, scale: 0.72 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ type: 'spring', stiffness: 280, damping: 17, delay: 0.3 }}
                    className="relative z-10 flex items-center gap-2 rounded-full border border-nexus-mint/40 bg-nexus-mint/[0.13] px-5 py-2"
                  >
                    <Flame className="size-4 text-nexus-mint" />
                    <span className="text-sm font-bold tracking-[0.2em] text-nexus-mint uppercase">Hot Lead</span>
                  </motion.div>

                  {/* Next action */}
                  <motion.p
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.56, duration: 0.45 }}
                    className="relative z-10 text-xs text-white/35"
                  >
                    Agendar demo técnica · Fondos confirmados
                  </motion.p>
                </motion.div>
              )}
            </AnimatePresence>

          </div>

        </motion.div>

        {/* Footnote */}
        <motion.p
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
          viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-8 text-center text-sm text-white/22"
        >
          La rúbrica, los criterios y los pesos los defines tú. Nexus los aprende y los aplica en cada conversación.
        </motion.p>
      </div>
    </section>
  )
}
