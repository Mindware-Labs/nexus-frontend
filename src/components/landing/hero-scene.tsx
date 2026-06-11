"use client";

import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "motion/react";
import {
  Activity,
  BrainCircuit,
  CheckCheck,
  Database,
  MoreHorizontal,
  Send,
  ShieldCheck,
  Sparkles,
  Zap,
} from "lucide-react";
import { Fragment, useEffect, useState } from "react";

/**
 * Escena hero: el producto en acción. Un widget Nexus reproduce en loop el
 * flujo real — pregunta del visitante → respuesta en streaming → captura de
 * datos → lead calificado con score NEX. Profundidad con CSS 3D
 * (perspective + preserve-3d) y tilt que sigue al cursor mediante springs.
 */

const ease = [0.22, 1, 0.36, 1] as const;
const spring = { type: "spring", stiffness: 260, damping: 24 } as const;

/* Pasos: 1 visitante · 2 escribiendo · 3 bot · 4 visitante deja datos ·
   5 bot confirma · 6 lead calificado · reinicio.

   El primer ciclo arranca en el paso 3: la primera conversación viene
   prerenderizada en el HTML (visible desde el primer pintado, sin esperar
   al JS) y este schedule solo la continúa. Los ciclos siguientes
   reproducen el flujo completo con el LOOP_SCHEDULE. */
/* El streaming CSS del primer bot termina ~2.4s; la captura de datos
   entra justo después para mantener el ritmo conversacional. */
const FIRST_SCHEDULE: { step: number; at: number }[] = [
  { step: 4, at: 3000 },
  { step: 5, at: 4200 },
  { step: 6, at: 5600 },
  { step: 0, at: 11600 },
];

const LOOP_SCHEDULE: { step: number; at: number }[] = [
  { step: 1, at: 400 },
  { step: 2, at: 1200 },
  { step: 3, at: 2200 },
  { step: 4, at: 4200 },
  { step: 5, at: 5400 },
  { step: 6, at: 6600 },
  { step: 0, at: 11400 },
];

const SIGNALS = [
  { icon: Activity, label: "SSE", value: "streaming" },
  { icon: BrainCircuit, label: "RAG", value: "contexto" },
  { icon: ShieldCheck, label: "Lead", value: "validado" },
];

const CAPTURE_PARTICLES = [
  { x: -18, y: -26, delay: 0 },
  { x: -2, y: -46, delay: 0.16 },
  { x: 18, y: -30, delay: 0.32 },
];

function StreamText({ text }: { text: string }) {
  return (
    <motion.span
      initial="hidden"
      animate="visible"
      variants={{
        visible: { transition: { staggerChildren: 0.055 } },
      }}
    >
      {/* El espacio va FUERA del span inline-block: dentro se recorta
          por el colapsado de whitespace y las palabras salen pegadas */}
      {text.split(" ").map((word, i) => (
        <Fragment key={i}>
          <motion.span
            variants={{
              hidden: { opacity: 0, y: 3, filter: "blur(2px)" },
              visible: {
                opacity: 1,
                y: 0,
                filter: "blur(0px)",
                transition: { duration: 0.2, ease },
              },
            }}
            className="inline-block"
          >
            {word}
          </motion.span>{" "}
        </Fragment>
      ))}
    </motion.span>
  );
}

/* Streaming palabra a palabra en CSS puro: corre desde el primer pintado
   del HTML, sin esperar la hidratación. Mismo lenguaje visual que
   StreamText, que toma el relevo en los ciclos siguientes. */
function CssStreamText({
  text,
  startDelay,
}: {
  text: string;
  startDelay: number;
}) {
  return (
    <span>
      {/* Espacio fuera del inline-block (ver nota en StreamText) */}
      {text.split(" ").map((word, i) => (
        <Fragment key={i}>
          <span
            style={{ animationDelay: `${startDelay + i * 0.055}s` }}
            className="inline-block motion-safe:animate-word-in"
          >
            {word}
          </span>{" "}
        </Fragment>
      ))}
    </span>
  );
}

function BotAvatar() {
  return (
    <span className="relative grid size-6 shrink-0 place-items-center rounded-full bg-gradient-to-br from-nexus-purple to-nexus-lavender shadow-[0_6px_18px_rgba(82,37,102,0.32)] ring-1 ring-white/55">
      <span className="absolute inset-0 rounded-full bg-white/20 opacity-0 motion-safe:animate-pulse-glow" />
      <Sparkles className="relative size-3 text-white" />
    </span>
  );
}

function Bubble({
  from,
  delay = 0,
  exitDelay = 0,
  children,
}: {
  from: "visitor" | "bot";
  delay?: number;
  exitDelay?: number;
  children: React.ReactNode;
}) {
  /* Entrada en CSS (corre en cada mount, incluso antes de hidratar);
     motion conserva layout y exit. Al reiniciar el ciclo, las burbujas
     se despiden en cascada (exitDelay) en vez de desvanecerse en bloque. */
  const style = delay ? { animationDelay: `${delay}s` } : undefined;
  const exit = {
    opacity: 0,
    y: -8,
    scale: 0.98,
    transition: { duration: 0.2, delay: exitDelay },
  };
  if (from === "bot") {
    return (
      <motion.div
        layout
        initial={false}
        exit={exit}
        transition={spring}
        style={style}
        className="flex max-w-[88%] shrink-0 items-end gap-2 self-start motion-safe:animate-bubble-in"
      >
        <BotAvatar />
        <div className="relative overflow-hidden rounded-2xl rounded-bl-md border border-white bg-white/95 px-4 py-2.5 text-[13px] leading-relaxed text-nexus-ink shadow-[0_12px_32px_-18px_rgba(61,26,78,0.45),0_2px_8px_rgba(61,26,78,0.08)] backdrop-blur">
          <span
            aria-hidden
            className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-nexus-lavender/45 to-transparent"
          />
          {children}
        </div>
      </motion.div>
    );
  }
  return (
    <motion.div
      layout
      initial={false}
      exit={exit}
      transition={spring}
      style={style}
      className="relative max-w-[85%] shrink-0 overflow-hidden rounded-2xl rounded-br-md bg-gradient-to-br from-nexus-purple via-nexus-purple to-nexus-deep px-4 py-2.5 text-[13px] leading-relaxed text-white shadow-[0_16px_36px_-18px_rgba(61,26,78,0.8),0_4px_14px_rgba(61,26,78,0.28)] ring-1 ring-white/10 self-end motion-safe:animate-bubble-in"
    >
      <span
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(circle_at_18%_0%,rgba(173,116,195,0.38),transparent_55%)]"
      />
      <span
        aria-hidden
        className="absolute inset-y-0 -left-16 w-14 bg-white/20 blur-xl motion-safe:animate-shimmer"
      />
      {children}
      <span className="ml-2 inline-flex translate-y-0.5">
        <CheckCheck aria-hidden className="size-3.5 text-nexus-mint" />
      </span>
    </motion.div>
  );
}

function TypingDots() {
  return (
    <motion.div
      layout
      initial={false}
      exit={{ opacity: 0, transition: { duration: 0.15 } }}
      transition={spring}
      className="flex shrink-0 items-end gap-2 self-start motion-safe:animate-bubble-in"
    >
      <BotAvatar />
      <div className="flex gap-1.5 rounded-2xl rounded-bl-md border border-white bg-white/95 px-4 py-3 shadow-[0_12px_32px_-18px_rgba(61,26,78,0.45),0_2px_8px_rgba(61,26,78,0.08)] backdrop-blur">
        {[0, 1, 2].map((d) => (
          <span
            key={d}
            className="size-1.5 rounded-full bg-gradient-to-br from-nexus-lavender to-nexus-mint motion-safe:animate-typing-dot"
            style={{ animationDelay: `${d * 0.15}s` }}
          />
        ))}
      </div>
    </motion.div>
  );
}

function SignalRail({ step }: { step: number }) {
  return (
    <div
      style={{ transform: "translateZ(64px)", transformStyle: "preserve-3d" }}
      className="absolute -right-36 top-24 z-20 hidden w-[8.5rem] flex-col gap-2.5 sm:flex"
    >
      {SIGNALS.map((signal, index) => {
        const Icon = signal.icon;
        const active = step >= index + 1;

        return (
          <motion.div
            key={signal.label}
            initial={{ opacity: 0, x: 24, rotateY: 15, scale: 0.9 }}
            animate={{
              opacity: active ? 1 : 0.45,
              x: active ? 0 : 16,
              scale: active ? 1.04 : 0.94,
              rotateY: active ? 0 : 10,
              filter: active ? "blur(0px)" : "blur(0.5px)",
            }}
            transition={
              active
                ? { type: "spring", stiffness: 400, damping: 22, mass: 0.8 }
                : { type: "spring", stiffness: 200, damping: 24, mass: 1, delay: 0.3 + index * 0.1 }
            }
            className={`relative overflow-hidden rounded-2xl border bg-nexus-deep/80 p-2.5 text-white shadow-[0_16px_40px_-26px_rgba(0,0,0,0.85)] backdrop-blur-xl transition-colors duration-300 ${
              active ? "border-nexus-lavender/40" : "border-white/12"
            }`}
          >
            {active && (
              <span
                aria-hidden
                className="absolute inset-y-0 -left-12 w-12 bg-white/15 blur-xl motion-safe:animate-shimmer"
              />
            )}
            <div className="relative flex items-center gap-2">
              <span className="grid size-7 shrink-0 place-items-center rounded-xl bg-white/8 ring-1 ring-white/10">
                <Icon
                  className={
                    active
                      ? "size-3.5 text-nexus-mint"
                      : "size-3.5 text-white/35"
                  }
                />
              </span>
              <span className="min-w-0">
                <span className="block text-[10px] font-semibold leading-none text-white">
                  {signal.label}
                </span>
                <span className="mt-1 block truncate text-[9px] leading-none text-white/45">
                  {signal.value}
                </span>
              </span>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

function CaptureParticles({ cycle }: { cycle: number }) {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute bottom-10 right-20 z-30 hidden sm:block"
      style={{ transform: "translateZ(95px)" }}
    >
      {CAPTURE_PARTICLES.map((particle, index) => (
        <motion.span
          key={`${cycle}-${index}`}
          initial={{ opacity: 0, x: particle.x, y: particle.y, scale: 0.4 }}
          animate={{
            opacity: [0, 1, 0],
            x: particle.x + 116,
            y: particle.y - 36,
            scale: [0.4, 1, 0.3],
          }}
          transition={{
            duration: 1.1,
            delay: particle.delay,
            ease,
            repeat: 1,
            repeatDelay: 0.2,
          }}
          className="absolute size-1.5 rounded-full bg-nexus-mint shadow-[0_0_18px_rgba(52,211,153,0.95)]"
        />
      ))}
    </div>
  );
}

export function HeroScene() {
  /* Paso inicial 3: la primera pregunta y respuesta existen en el HTML
     del servidor — el chat se ve vivo aunque el JS aún no haya cargado. */
  const [step, setStep] = useState(3);
  const [cycle, setCycle] = useState(0);

  useEffect(() => {
    const schedule = cycle === 0 ? FIRST_SCHEDULE : LOOP_SCHEDULE;
    const timers = schedule.map(({ step: s, at }) =>
      setTimeout(() => {
        setStep(s);
        if (s === 0) setCycle((c) => c + 1);
      }, at),
    );
    return () => timers.forEach(clearTimeout);
  }, [cycle]);

  /* Tilt 3D con springs: el movimiento interpola, nunca salta (emil) */
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const rotateX = useSpring(useTransform(py, [0, 1], [5, -5]), {
    stiffness: 140,
    damping: 18,
  });
  const rotateY = useSpring(useTransform(px, [0, 1], [-8, 8]), {
    stiffness: 140,
    damping: 18,
  });

  function onMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    px.set((e.clientX - rect.left) / rect.width);
    py.set((e.clientY - rect.top) / rect.height);
  }

  function onMouseLeave() {
    px.set(0.5);
    py.set(0.5);
  }

  return (
    <div
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      style={{ perspective: 1200 }}
      className="relative mx-auto w-full max-w-lg"
      aria-hidden
    >
      <div
        aria-hidden
        className="absolute -inset-10 -z-10 rounded-[3rem] bg-[radial-gradient(circle_at_25%_20%,rgba(255,255,255,0.18),transparent_32%),radial-gradient(circle_at_84%_72%,rgba(52,211,153,0.22),transparent_34%),radial-gradient(circle_at_50%_100%,rgba(173,116,195,0.22),transparent_38%)] blur-2xl"
      />
      <motion.div
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="relative motion-safe:animate-float-slow"
      >
        {/* Plano trasero: conocimiento RAG */}
        <div
          style={{ transform: "translateZ(-50px)", animationDelay: "0.25s" }}
          className="absolute -left-4 -top-10 z-0 inline-flex items-center gap-2 overflow-hidden rounded-full border border-white/14 bg-white/[0.07] px-3.5 py-1.5 text-xs font-medium text-white/62 shadow-[0_18px_42px_-30px_rgba(0,0,0,0.7)] backdrop-blur-md sm:-left-12 motion-safe:animate-enter-fade"
        >
          <span
            aria-hidden
            className="absolute inset-y-0 -left-12 w-12 bg-white/18 blur-xl motion-safe:animate-shimmer"
          />
          <Database className="size-3.5 text-nexus-lavender" />
          <span className="relative">Entrenado en tu negocio</span>
        </div>

        <SignalRail step={step} />

        {/* Widget con borde degradado */}
        <div className="relative z-10 rounded-[28px] bg-gradient-to-r from-white/35 via-nexus-lavender/35 to-nexus-mint/45 p-px shadow-[0_34px_80px_-34px_rgba(0,0,0,0.82),0_0_70px_-30px_rgba(173,116,195,0.9)]">
          <div
            aria-hidden
            className="absolute -inset-px rounded-[28px] bg-gradient-to-r from-transparent via-white/25 to-transparent opacity-70 blur-sm motion-safe:animate-shimmer"
          />
          <div className="relative overflow-hidden rounded-[27px] bg-white">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 z-20 bg-[linear-gradient(120deg,transparent_0%,rgba(255,255,255,0.22)_18%,transparent_35%)] opacity-45 motion-safe:animate-shimmer"
            />
            {/* Header */}
            <div className="relative flex items-center gap-3 overflow-hidden bg-[radial-gradient(circle_at_22%_0%,rgba(173,116,195,0.35),transparent_36%),linear-gradient(180deg,#522566_0%,#3D1A4E_100%)] px-5 py-3.5">
              <div
                aria-hidden
                className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/55 to-transparent"
              />
              <span className="relative grid size-9 shrink-0 place-items-center rounded-full bg-gradient-to-br from-nexus-lavender via-nexus-purple to-nexus-purple shadow-[0_10px_28px_-12px_rgba(173,116,195,0.9)] ring-2 ring-white/15">
                <span className="absolute -inset-1 rounded-full border border-white/10 motion-safe:animate-spin-slow" />
                <Sparkles className="relative size-4 text-white" />
                <span className="absolute -bottom-0.5 -right-0.5 size-2.5 rounded-full border-2 border-nexus-deep bg-nexus-mint" />
              </span>
              <div className="flex-1">
                <p className="text-[13px] font-semibold text-white">
                  Tu sitio web
                </p>
                <p className="text-[11px] text-nexus-lavender">
                  Asistente Nexus · responde en segundos
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="size-1.5 rounded-full bg-nexus-mint shadow-[0_0_14px_rgba(52,211,153,0.9)] motion-safe:animate-pulse" />
                <MoreHorizontal className="size-4 text-white/40" />
              </div>
            </div>

            {/* Conversación */}
            <div className="relative flex h-[17rem] flex-col justify-end gap-2.5 overflow-hidden bg-[radial-gradient(circle_at_12%_16%,rgba(173,116,195,0.14),transparent_30%),linear-gradient(180deg,rgba(248,237,251,0.98),rgba(255,255,255,0.84))] px-4 py-4">
              <div
                aria-hidden
                className="absolute inset-0 opacity-[0.24]"
                style={{
                  backgroundImage:
                    "linear-gradient(rgba(82,37,102,0.16) 1px, transparent 1px), linear-gradient(90deg, rgba(82,37,102,0.14) 1px, transparent 1px)",
                  backgroundSize: "34px 34px",
                  maskImage:
                    "linear-gradient(to bottom, transparent, black 18%, black 76%, transparent)",
                }}
              />
              <div
                aria-hidden
                className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-nexus-lavender/16 to-transparent motion-safe:animate-scanline"
              />
              <AnimatePresence mode="popLayout">
                {step >= 1 && (
                  <Bubble
                    key={`v1-${cycle}`}
                    from="visitor"
                    delay={cycle === 0 ? 0.45 : 0}
                    exitDelay={0}
                  >
                    Hola, ¿hacen envíos a regiones?
                  </Bubble>
                )}
                {step === 2 && <TypingDots key={`t-${cycle}`} />}
                {step >= 3 && (
                  <Bubble
                    key={`b1-${cycle}`}
                    from="bot"
                    delay={cycle === 0 ? 0.95 : 0}
                    exitDelay={0.06}
                  >
                    {cycle === 0 ? (
                      /* Primer ciclo: streaming palabra a palabra en CSS,
                         visible en el HTML del servidor sin esperar al JS */
                      <CssStreamText
                        text="¡Sí! Llegamos a todo el país en 24–48 h 🚚 ¿Quieres que un asesor te contacte?"
                        startDelay={1.3}
                      />
                    ) : (
                      <StreamText text="¡Sí! Llegamos a todo el país en 24–48 h 🚚 ¿Quieres que un asesor te contacte?" />
                    )}
                  </Bubble>
                )}
                {step >= 4 && (
                  <Bubble key={`v2-${cycle}`} from="visitor" exitDelay={0.12}>
                    Genial. Soy Ana — ana@empresa.com
                  </Bubble>
                )}
                {step >= 5 && (
                  <Bubble key={`b2-${cycle}`} from="bot" exitDelay={0.18}>
                    <StreamText text="¡Listo, Ana! Te escribimos hoy mismo. ✅" />
                  </Bubble>
                )}
              </AnimatePresence>
            </div>

            {/* Footer del widget: púrpura profundo según diseño */}
            <div className="relative bg-[linear-gradient(180deg,#3D1A4E_0%,#111827_160%)] px-4 pb-2.5 pt-3">
              <div
                aria-hidden
                className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/22 to-transparent"
              />
              <div className="flex items-center gap-2 rounded-full bg-white/10 py-1.5 pl-4 pr-1.5 shadow-inner shadow-black/10 ring-1 ring-white/12">
                <span className="flex-1 text-[13px] text-white/42">
                  Escribe un mensaje…
                </span>
                <span className="grid size-8 place-items-center rounded-full bg-gradient-to-br from-nexus-lavender to-nexus-purple shadow-[0_8px_22px_-10px_rgba(173,116,195,0.9)]">
                  <Send className="size-3.5 text-white" />
                </span>
              </div>
              <p className="mt-1.5 text-center text-[9px] tracking-wide text-white/30">
                Impulsado por{" "}
                <span className="text-nexus-lavender">Mindware Nexus</span>
              </p>
            </div>
          </div>
        </div>

        {/* Plano frontal: el resultado — lead calificado por NEX */}
        {step >= 6 && <CaptureParticles cycle={cycle} />}
        <AnimatePresence>
          {step >= 6 && (
            <motion.div
              key={`lead-${cycle}`}
              style={{ transform: "translateZ(70px)" }}
              initial={{ opacity: 0, y: 28, scale: 0.9, filter: "blur(10px)" }}
              animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
              exit={{
                opacity: 0,
                y: 10,
                scale: 0.96,
                transition: { duration: 0.25, delay: 0.22 },
              }}
              transition={{ type: "spring", stiffness: 230, damping: 20 }}
              className="absolute -bottom-12 -right-2 z-20 w-[17.5rem] rounded-[1.35rem] bg-gradient-to-r from-nexus-mint/55 via-white/20 to-nexus-lavender/35 p-px shadow-[0_28px_70px_-24px_rgba(0,0,0,0.82),0_0_52px_-12px_rgba(52,211,153,0.32)] sm:-right-8"
            >
              <div className="relative overflow-hidden rounded-[1.28rem] bg-nexus-deep/95 p-4 backdrop-blur-xl">
                <span
                  aria-hidden
                  className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-nexus-mint/80 to-transparent"
                />
                <span
                  aria-hidden
                  className="absolute -right-12 -top-16 size-32 rounded-full bg-nexus-mint/15 blur-2xl"
                />
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-white/60">
                    <Zap className="size-3 text-nexus-mint" />
                    Lead capturado
                  </span>
                  <motion.span
                    initial={{ opacity: 0, scale: 0.92 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.22, duration: 0.35, ease }}
                    className="rounded-full bg-nexus-mint/15 px-2 py-0.5 text-[11px] font-medium text-nexus-mint ring-1 ring-nexus-mint/20"
                  >
                    Calificado
                  </motion.span>
                </div>
                <p className="mt-2 truncate text-sm font-semibold text-white">
                  Ana · ana@empresa.com
                </p>
                <div className="mt-3 flex items-center gap-2.5">
                  <div className="relative h-1.5 flex-1 overflow-hidden rounded-full bg-white/10">
                    {/* scaleX en lugar de width: la barra sube sin reflow */}
                    <motion.div
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 0.87 }}
                      transition={{ type: "spring", stiffness: 90, damping: 20, mass: 1, delay: 0.2 }}
                      style={{ originX: 0 }}
                      className="relative h-full w-full overflow-hidden rounded-full bg-gradient-to-r from-nexus-lavender via-white to-nexus-mint"
                    >
                      <span
                        aria-hidden
                        className="absolute inset-y-0 -left-8 w-8 bg-white/55 blur-sm motion-safe:animate-shimmer"
                      />
                    </motion.div>
                  </div>
                  <motion.span
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: 0.45, ease }}
                    className="text-[13px] font-semibold tabular-nums text-white"
                  >
                    87
                    <span className="text-[11px] font-normal text-white/45">
                      /100
                    </span>
                  </motion.span>
                </div>
                <div className="mt-3 grid grid-cols-3 gap-1.5">
                  {["Alta intención", "Dato válido", "Hoy"].map((item, i) => (
                    <motion.span
                      key={item}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.35, delay: 0.55 + i * 0.07, ease }}
                      className="truncate rounded-full border border-white/8 bg-white/[0.055] px-2 py-1 text-center text-[9px] font-medium text-white/48"
                    >
                      {item}
                    </motion.span>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div
          aria-hidden
          style={{ transform: "translateZ(-80px)" }}
          className="absolute -bottom-14 left-7 right-10 -z-10 h-16 opacity-80"
        >
          <div
            style={{ animationDelay: "0.5s" }}
            className="h-full w-full rounded-[100%] bg-black/35 blur-2xl motion-safe:animate-enter-fade"
          />
        </div>
      </motion.div>

      {/* Resplandor de apoyo bajo la escena */}
      <div
        aria-hidden
        className="absolute -inset-10 -z-10 rounded-full bg-nexus-purple/40 blur-[90px] motion-safe:animate-pulse-glow"
      />
    </div>
  );
}
