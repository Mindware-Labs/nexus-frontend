"use client";

import { AnimatePresence, motion } from "motion/react";
import { CheckCheck, RotateCcw, Send, Sparkles, Zap } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { SectionHeading } from "./section-heading";
import { ScoreMeter } from "./score-meter";
import { Reveal } from "./reveal";

/**
 * Demo guionizada que reproduce la máquina de estados del widget real:
 * conversando → solicitando_datos → confirmando → despedida.
 */
type Stage = "conversando" | "solicitando_datos" | "confirmando" | "despedida";

type Message = {
  id: number;
  role: "bot" | "user";
  text: string;
  streaming?: boolean;
};

const GREETING =
  "¡Hola! 👋 Soy Nexus, el asistente de Café Aurora. Puedo contarte sobre nuestros granos de especialidad, suscripciones y envíos. ¿En qué te ayudo?";

const ANSWERS: { match: RegExp; reply: string }[] = [
  {
    match: /precio|coste|costo|cu[aá]nto|plan|suscripci[oó]n/i,
    reply:
      "Nuestra suscripción de café de especialidad parte de $14.990/mes: 1 kg de grano fresco tostado la misma semana, con envío incluido. También tenemos bolsas individuales desde $7.990. ☕",
  },
  {
    match: /env[ií]o|despacho|entrega|domicilio|lleg/i,
    reply:
      "Hacemos envíos a todo el país en 24–48 horas. Si pides antes de las 14:00, tu café se despacha el mismo día con tueste de la semana. 🚚",
  },
  {
    match: /grano|caf[eé]|origen|tueste|variedad|producto/i,
    reply:
      "Trabajamos con granos de origen único de Colombia, Etiopía y Brasil, tostados artesanalmente cada semana. ¿Prefieres perfiles frutales, achocolatados o intensos?",
  },
  {
    match: /horario|tienda|local|d[oó]nde|direcci[oó]n/i,
    reply:
      "Nuestra cafetería insignia está en Av. Providencia 1234 y abre de lunes a sábado, 8:00 a 20:00. ¡Pero la tienda online nunca cierra! 😉",
  },
];

const FALLBACK =
  "¡Buena pregunta! Un especialista de Café Aurora puede darte el detalle exacto. ¿Te parece si te contacto con el equipo?";

const ASK_DATA =
  "¡Perfecto! Para que el equipo te contacte, ¿me compartes tu nombre y tu correo electrónico?";

const CONFIRM_TPL = (name: string, email: string) =>
  `Genial, ${name}. Confirmo tus datos: 📧 ${email}. ¿Está todo correcto?`;

const GOODBYE =
  "¡Listo! ✅ Tu solicitud quedó registrada y calificada con Score NEX 87/100 — prioridad alta. El equipo de Café Aurora te escribirá muy pronto. ¡Gracias por conversar conmigo! ☕✨";

const QUICK_REPLIES: Record<Stage, string[]> = {
  conversando: [
    "¿Cuánto cuesta la suscripción?",
    "¿Hacen envíos a regiones?",
    "Quiero que me contacten",
  ],
  solicitando_datos: ["Ana Pérez — ana@empresa.com"],
  confirmando: ["Sí, todo correcto", "No, corregir datos"],
  despedida: [],
};

const STAGE_ORDER: Stage[] = [
  "conversando",
  "solicitando_datos",
  "confirmando",
  "despedida",
];

const STAGE_LABELS: Record<Stage, string> = {
  conversando: "Conversando",
  solicitando_datos: "Capturando datos",
  confirmando: "Confirmando",
  despedida: "Lead capturado",
};

/* Hoisted: se evalúan en cada mensaje del usuario */
const CONTACT_INTENT_RE = /contact|llamen|escriban|asesor|hablar|interesa/i;
const EMAIL_RE = /[\w.+-]+@[\w-]+\.[\w.]+/;
const NAME_NOISE_RE = /[—\-–,]|correo|email|mi nombre es|soy/gi;
const REJECT_RE = /no|corregir|cambiar|mal/i;

let nextId = 1;

export function DemoChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [stage, setStage] = useState<Stage>("conversando");
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [lead, setLead] = useState({ name: "", email: "" });
  const scrollRef = useRef<HTMLDivElement>(null);
  const startedRef = useRef(false);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    const timers = timersRef.current;
    return () => timers.forEach(clearTimeout);
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, typing]);

  function schedule(fn: () => void, ms: number) {
    timersRef.current.push(setTimeout(fn, ms));
  }

  /* Streaming tipo SSE: ráfagas de 1–3 caracteres con cadencia orgánica —
     pausas largas tras puntuación fuerte, medias tras comas y micro-jitter
     entre caracteres, como una red y un modelo reales. */
  function streamBotMessage(text: string, after?: () => void) {
    setTyping(true);
    schedule(() => {
      setTyping(false);
      const id = nextId++;
      setMessages((m) => [...m, { id, role: "bot", text: "", streaming: true }]);
      let cursor = 0;
      const tick = () => {
        cursor = Math.min(text.length, cursor + 1 + Math.floor(Math.random() * 3));
        const done = cursor >= text.length;
        setMessages((m) =>
          m.map((msg) =>
            msg.id === id
              ? { ...msg, text: text.slice(0, cursor), streaming: !done }
              : msg,
          ),
        );
        if (done) {
          after?.();
          return;
        }
        const lastChar = text[cursor - 1];
        const delay = /[.!?…]/.test(lastChar)
          ? 220 + Math.random() * 180
          : /[,;:]/.test(lastChar)
            ? 90 + Math.random() * 80
            : lastChar === " "
              ? 24 + Math.random() * 40
              : 14 + Math.random() * 26;
        schedule(tick, delay);
      };
      /* Arranque con jitter: simula la latencia variable del primer chunk */
      schedule(tick, 90 + Math.random() * 320);
    }, 650);
  }

  function start() {
    if (startedRef.current) return;
    startedRef.current = true;
    streamBotMessage(GREETING);
  }

  function handleSend(raw?: string) {
    const text = (raw ?? input).trim();
    if (!text || typing) return;
    setInput("");
    setMessages((m) => [...m, { id: nextId++, role: "user", text }]);

    if (stage === "conversando") {
      if (CONTACT_INTENT_RE.test(text)) {
        setStage("solicitando_datos");
        streamBotMessage(ASK_DATA);
        return;
      }
      const hit = ANSWERS.find((a) => a.match.test(text));
      if (hit) {
        streamBotMessage(hit.reply);
      } else {
        streamBotMessage(FALLBACK, () => setStage("solicitando_datos"));
      }
      return;
    }

    if (stage === "solicitando_datos") {
      const email = text.match(EMAIL_RE)?.[0];
      if (!email) {
        streamBotMessage(
          "Creo que falta tu correo 🙈 ¿Me lo compartes junto a tu nombre? Por ejemplo: «Ana Pérez — ana@empresa.com»",
        );
        return;
      }
      const name =
        text
          .replace(email, "")
          .replace(NAME_NOISE_RE, " ")
          .trim()
          .split(/\s+/)
          .slice(0, 3)
          .join(" ") || "amig@";
      setLead({ name, email });
      setStage("confirmando");
      streamBotMessage(CONFIRM_TPL(name, email));
      return;
    }

    if (stage === "confirmando") {
      if (REJECT_RE.test(text)) {
        setStage("solicitando_datos");
        streamBotMessage(
          "Sin problema, volvamos a intentarlo. ¿Me compartes tu nombre y correo correctos?",
        );
        return;
      }
      setStage("despedida");
      streamBotMessage(GOODBYE);
    }
  }

  function reset() {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
    setMessages([]);
    setStage("conversando");
    setLead({ name: "", email: "" });
    setTyping(false);
    startedRef.current = false;
    schedule(() => {
      startedRef.current = true;
      streamBotMessage(GREETING);
    }, 250);
  }

  return (
    <section
      id="demo"
      className="relative overflow-hidden bg-nexus-deep py-28 sm:py-36"
    >
      {/* Fondo animado: auroras + grid enmascarado, como en el hero */}
      <div aria-hidden className="absolute inset-0 overflow-hidden">
        <div className="absolute -right-48 top-10 size-[34rem] rounded-full bg-nexus-purple/50 blur-[140px] motion-safe:animate-drift-2" />
        <div className="absolute -left-48 bottom-0 size-[30rem] rounded-full bg-nexus-lavender/15 blur-[140px] motion-safe:animate-drift-1" />
        <div
          className="absolute inset-0 opacity-[0.1]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(173,116,195,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(173,116,195,0.5) 1px, transparent 1px)",
            backgroundSize: "72px 72px",
            maskImage:
              "radial-gradient(ellipse 70% 70% at 70% 50%, black, transparent)",
          }}
        />
      </div>

      <div className="relative mx-auto grid max-w-7xl items-center gap-16 px-5 sm:px-8 lg:grid-cols-2">
        <div>
          <SectionHeading
            dark
            className="text-left [&>*]:text-left mx-0"
            eyebrow="Demo en vivo"
            title="Pruébalo tú mismo, ahora"
            subtitle="Este es un bot de ejemplo de una cafetería ficticia. Conversa con él y mira cómo captura un lead de principio a fin: responde, pide datos, confirma y se despide."
          />
          <Reveal delay={0.2} className="relative mt-10 space-y-5">
            {/* Conector vertical: se llena conforme avanza el flujo.
                scaleY (transform) en lugar de height: cero reflow. */}
            <div
              aria-hidden
              className="absolute bottom-3.5 left-3.5 top-3.5 w-px -translate-x-1/2 bg-white/10"
            />
            <motion.div
              aria-hidden
              animate={{
                scaleY: STAGE_ORDER.indexOf(stage) / (STAGE_ORDER.length - 1),
              }}
              transition={{ type: "spring", stiffness: 130, damping: 22, mass: 0.9 }}
              style={{ x: "-50%", originY: 0 }}
              className="absolute bottom-3.5 left-3.5 top-3.5 w-px bg-gradient-to-b from-nexus-lavender to-nexus-mint"
            />
            {STAGE_ORDER.map((s, i) => {
              const reached = STAGE_ORDER.indexOf(stage) >= i;
              return (
                <div key={s} className="relative flex items-center gap-3">
                  <motion.span
                    animate={
                      reached
                        ? { scale: [1, 1.18, 1] }
                        : { scale: 1 }
                    }
                    transition={{ duration: 0.45, ease: "easeOut" }}
                    className={cn(
                      "z-10 grid size-7 place-items-center rounded-full border bg-nexus-deep text-xs font-medium transition-colors duration-500",
                      reached
                        ? "border-nexus-mint text-nexus-mint shadow-[0_0_12px_rgba(52,211,153,0.35),inset_0_0_0_999px_rgba(52,211,153,0.12)]"
                        : "border-white/15 text-white/35",
                    )}
                  >
                    {i + 1}
                  </motion.span>
                  <span
                    className={cn(
                      "text-sm transition-colors duration-500",
                      reached ? "text-white" : "text-white/35",
                    )}
                  >
                    {STAGE_LABELS[s]}
                  </span>
                  {s === "despedida" && stage === "despedida" && (
                    <motion.span
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
                      className="inline-flex items-center gap-1 rounded-full bg-nexus-mint/15 px-2.5 py-0.5 text-xs font-medium text-nexus-mint"
                    >
                      <CheckCheck aria-hidden className="size-3.5" /> Score
                      listo
                    </motion.span>
                  )}
                </div>
              );
            })}
            {/* Calificación del lead en vivo: aparece al capturar el email
                y el Score NEX sube a su valor final al cerrar el flujo */}
            {lead.email && (
              <motion.div
                initial={{ opacity: 0, y: 16, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ type: "spring", stiffness: 260, damping: 26, mass: 0.9 }}
                className="ml-10 rounded-[1.35rem] bg-gradient-to-r from-nexus-mint/50 via-white/15 to-nexus-lavender/40 p-px shadow-[0_24px_60px_-30px_rgba(0,0,0,0.8)]"
              >
                <div className="relative overflow-hidden rounded-[calc(1.35rem-1px)] bg-nexus-deep/95 p-4 backdrop-blur-xl">
                  <span
                    aria-hidden
                    className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-nexus-mint/70 to-transparent"
                  />
                  <div className="flex items-center justify-between gap-3">
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-white/60">
                      <Zap aria-hidden className="size-3 text-nexus-mint" />
                      Score NEX
                    </span>
                    <motion.span
                      key={stage === "despedida" ? "calificado" : "analisis"}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ type: "spring", stiffness: 260, damping: 22, mass: 0.9 }}
                      className={cn(
                        "rounded-full px-2 py-0.5 text-[11px] font-medium ring-1",
                        stage === "despedida"
                          ? "bg-nexus-mint/15 text-nexus-mint ring-nexus-mint/25"
                          : "bg-nexus-lavender/15 text-nexus-lavender ring-nexus-lavender/25",
                      )}
                    >
                      {stage === "despedida" ? "Calificado" : "En análisis"}
                    </motion.span>
                  </div>
                  <p className="mt-2 truncate text-sm font-semibold text-white">
                    {lead.name} · {lead.email}
                  </p>
                  <ScoreMeter
                    score={stage === "despedida" ? 87 : 62}
                    className="mt-3"
                  />
                  {stage === "despedida" && (
                    <motion.div
                      initial="hidden"
                      animate="visible"
                      variants={{
                        visible: { transition: { staggerChildren: 0.07 } },
                      }}
                      className="mt-3 grid grid-cols-3 gap-1.5"
                    >
                      {["Alta intención", "Email válido", "Hoy"].map((chip) => (
                        <motion.span
                          key={chip}
                          variants={{
                            hidden: { opacity: 0, y: 8 },
                            visible: {
                              opacity: 1,
                              y: 0,
                              transition: {
                                type: "spring",
                                stiffness: 260,
                                damping: 26,
                                mass: 0.9,
                              },
                            },
                          }}
                          className="truncate rounded-full border border-white/8 bg-white/[0.055] px-2 py-1 text-center text-[10px] font-medium text-white/55"
                        >
                          {chip}
                        </motion.span>
                      ))}
                    </motion.div>
                  )}
                </div>
              </motion.div>
            )}
          </Reveal>
        </div>

        {/* Widget */}
        <Reveal delay={0.15}>
          <motion.div
            onViewportEnter={start}
            viewport={{ amount: 0.4, once: true }}
            whileHover={{ y: -4 }}
            transition={{ type: "spring", stiffness: 200, damping: 22 }}
            className="mx-auto w-full max-w-md rounded-[28px] bg-gradient-to-r from-white/35 via-nexus-lavender/35 to-nexus-mint/45 p-px shadow-[0_34px_80px_-34px_rgba(0,0,0,0.82),0_0_70px_-30px_rgba(173,116,195,0.9)]"
          >
            <div
              aria-hidden
              className="absolute -inset-px rounded-[28px] bg-gradient-to-r from-transparent via-white/25 to-transparent opacity-70 blur-sm motion-safe:animate-shimmer"
            />
            <div className="relative overflow-hidden rounded-[27px] bg-white">
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 z-20 bg-[linear-gradient(120deg,transparent_0%,rgba(255,255,255,0.22)_18%,transparent_35%)] opacity-45 motion-safe:animate-shimmer"
              />
              {/* Header del widget */}
              <div className="relative z-30 flex items-center gap-3 overflow-hidden bg-[radial-gradient(circle_at_22%_0%,rgba(173,116,195,0.35),transparent_36%),linear-gradient(180deg,#522566_0%,#3D1A4E_100%)] px-5 py-3.5">
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
                  <p className="text-[13px] font-semibold text-white">Café Aurora</p>
                  <p className="text-[11px] text-nexus-lavender">
                  Asistente Nexus · en línea
                </p>
              </div>
              <button
                onClick={reset}
                aria-label="Reiniciar demo"
                className="grid size-8 place-items-center rounded-full text-white/50 transition-[color,background-color,transform] duration-150 ease-out hover:bg-white/10 hover:text-white active:scale-90 focus-visible:outline-2 focus-visible:outline-nexus-lavender"
              >
                <RotateCcw aria-hidden className="size-4" />
              </button>
            </div>

            {/* Mensajes */}
              <div
              ref={scrollRef}
              role="log"
              aria-live="polite"
              aria-label="Conversación de demostración"
              className="nexus-chat-scroll relative z-10 flex h-96 flex-col gap-3 overflow-y-auto overscroll-contain bg-[radial-gradient(circle_at_12%_16%,rgba(173,116,195,0.14),transparent_30%),linear-gradient(180deg,rgba(248,237,251,0.98),rgba(255,255,255,0.84))] px-4 py-5"
            >
              <div
                aria-hidden
                className="absolute inset-0 opacity-[0.24] pointer-events-none"
                style={{
                  backgroundImage:
                    "linear-gradient(rgba(82,37,102,0.16) 1px, transparent 1px), linear-gradient(90deg, rgba(82,37,102,0.14) 1px, transparent 1px)",
                  backgroundSize: "34px 34px",
                }}
              />
              <AnimatePresence initial={false}>
                {messages.map((m) =>
                  m.role === "bot" ? (
                    <motion.div
                      key={m.id}
                      initial={{ opacity: 0, y: 12, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ type: "spring", stiffness: 260, damping: 26, mass: 0.9 }}
                      className="flex max-w-[88%] shrink-0 items-end gap-2 self-start"
                    >
                      <span className="grid size-6 shrink-0 place-items-center rounded-full bg-gradient-to-br from-nexus-purple to-nexus-lavender shadow-sm">
                        <Sparkles aria-hidden className="size-3 text-white" />
                      </span>
                      <div className="relative z-10 overflow-hidden rounded-[18px] rounded-bl-[5px] border border-white bg-white/95 px-4 py-2.5 text-[13px] leading-relaxed text-nexus-ink shadow-[0_12px_32px_-18px_rgba(61,26,78,0.45),0_2px_8px_rgba(61,26,78,0.08)] backdrop-blur">
                        <span aria-hidden className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-nexus-lavender/45 to-transparent" />
                        {m.text}
                        {m.streaming && (
                          <span className="ml-0.5 inline-block h-3.5 w-0.5 animate-pulse bg-nexus-lavender align-middle" />
                        )}
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key={m.id}
                      initial={{ opacity: 0, y: 12, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ type: "spring", stiffness: 260, damping: 26, mass: 0.9 }}
                      className="relative z-10 max-w-[85%] shrink-0 overflow-hidden self-end rounded-[18px] rounded-br-[5px] bg-gradient-to-br from-[#522566] via-[#522566] to-[#3D1A4E] px-4 py-2.5 text-[13px] leading-relaxed text-white shadow-[0_16px_36px_-18px_rgba(61,26,78,0.8),0_4px_14px_rgba(61,26,78,0.28)] ring-1 ring-white/10"
                    >
                      <span aria-hidden className="absolute inset-0 bg-[radial-gradient(circle_at_18%_0%,rgba(173,116,195,0.38),transparent_55%)]" />
                      <span aria-hidden className="absolute inset-y-0 -left-16 w-14 bg-white/20 blur-xl motion-safe:animate-shimmer" />
                      <span className="relative z-10">{m.text}</span>
                      <span className="ml-2 inline-flex translate-y-0.5">
                        <CheckCheck
                          aria-hidden
                          className="size-3.5 text-nexus-lavender"
                        />
                      </span>
                    </motion.div>
                  ),
                )}
              </AnimatePresence>

              {typing && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex shrink-0 items-end gap-2 self-start"
                >
                  <span className="grid size-6 shrink-0 place-items-center rounded-full bg-gradient-to-br from-nexus-purple to-nexus-lavender shadow-sm">
                    <Sparkles aria-hidden className="size-3 text-white" />
                  </span>
                  <div className="flex gap-1.5 rounded-2xl rounded-bl-md border border-nexus-purple/8 bg-white px-4 py-3.5 shadow-[0_2px_8px_rgba(61,26,78,0.07)]">
                    {[0, 1, 2].map((d) => (
                      <span
                        key={d}
                        className="size-1.5 rounded-full bg-nexus-lavender motion-safe:animate-typing-dot"
                        style={{ animationDelay: `${d * 0.15}s` }}
                      />
                    ))}
                  </div>
                </motion.div>
              )}
            </div>

            {/* Quick replies */}
            <AnimatePresence>
              {QUICK_REPLIES[stage].length > 0 && !typing && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{
                    opacity: 0,
                    height: 0,
                    transition: { duration: 0.18, ease: "easeOut" },
                  }}
                  className="flex flex-wrap gap-2 overflow-hidden bg-nexus-lilac/60 px-4 pb-3"
                >
                  {QUICK_REPLIES[stage].map((q) => (
                    <button
                      key={q}
                      onClick={() => handleSend(q)}
                      className="rounded-full border border-nexus-purple/25 bg-white px-3.5 py-1.5 text-xs font-medium text-nexus-purple transition-[transform,background-color,border-color,color] duration-200 ease-out hover:scale-[1.03] hover:border-nexus-purple hover:bg-nexus-purple hover:text-white active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-nexus-purple"
                    >
                      {q}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Input + footer púrpura profundo */}
            <div className="relative z-30 bg-[linear-gradient(180deg,#3D1A4E_0%,#111827_160%)] px-4 pb-2.5 pt-3">
              <div
                aria-hidden
                className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/22 to-transparent"
              />
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
                className="flex items-center gap-2 rounded-full bg-white/10 py-1.5 pl-4 pr-1.5 ring-1 ring-white/12 transition-[box-shadow] duration-300 focus-within:ring-nexus-lavender/60 focus-within:shadow-[0_0_0_4px_rgba(173,116,195,0.14),0_0_30px_-6px_rgba(173,116,195,0.65)]"
              >
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  name="mensaje-demo"
                  autoComplete="off"
                  enterKeyHint="send"
                  aria-label="Escribe un mensaje para el bot de demostración"
                  placeholder={
                    stage === "despedida"
                      ? "Conversación finalizada"
                      : "Escribe un mensaje…"
                  }
                  disabled={stage === "despedida"}
                  className="flex-1 bg-transparent text-[13px] text-white outline-none placeholder:text-white/42 disabled:cursor-not-allowed"
                />
                <button
                  type="submit"
                  disabled={stage === "despedida" || !input.trim()}
                  aria-label="Enviar mensaje"
                  className="grid size-8 place-items-center rounded-full bg-gradient-to-br from-nexus-lavender to-nexus-purple text-white shadow-[0_8px_22px_-10px_rgba(173,116,195,0.9)] transition-[transform,opacity] duration-200 ease-out hover:scale-105 active:scale-95 disabled:opacity-40 disabled:hover:scale-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-nexus-lavender"
                >
                  <Send aria-hidden className="size-3.5" />
                </button>
              </form>
              <p className="mt-2 text-center text-[10px] text-white/35">
                Impulsado por <span className="text-nexus-lavender">Mindware Nexus</span>
              </p>
            </div>
            </div>
          </motion.div>
        </Reveal>
      </div>
    </section>
  );
}
