"use client";

import { AnimatePresence, m } from "motion/react";
import { CheckCheck, MessageCircle, Send, Sparkles, X, Zap } from "lucide-react";
import { useEffect, useRef, useState } from "react";

/**
 * Widget flotante de Mindware Nexus: la landing usa su propio producto.
 * Simulación del bot real — responde sobre el producto, registra leads
 * conversando (alternativa al formulario) y transmite las respuestas
 * con streaming carácter a carácter, como el SSE del producto real.
 */

export const OPEN_WIDGET_EVENT = "nexus:open-widget";

type Flow =
  | "menu"
  | "reg_nombre"
  | "reg_empresa"
  | "reg_email"
  | "reg_confirm"
  | "done";

type Message = {
  id: number;
  role: "bot" | "user";
  text: string;
  streaming?: boolean;
  /* "lead": tarjeta de registro confirmado dentro del chat */
  kind?: "lead";
};

const EMAIL_RE = /[\w.+-]+@[\w-]+\.[\w.]+/;
const YES_RE = /s[ií]|correcto|dale|ok|claro|perfecto/i;
const REGISTER_RE = /registr|acceso|empezar|probar|cuenta|unir/i;
const PRICE_RE = /precio|costo|coste|cu[aá]nto|plan/i;
const HOW_RE = /c[oó]mo|funciona|instal|integr/i;

const GREETING =
  "¡Hola! 👋 Soy el asistente de Mindware Nexus — y sí, soy el producto. Puedo contarte cómo funciono o registrarte para el acceso anticipado, aquí mismo.";

const ANSWER_PRICE =
  "Los planes parten en $29 USD/mes (Plan X) y escalan según conversaciones y bots activos. El Plan Y, el favorito, cuesta $79 USD/mes. Con pago anual ahorras 20%. 💜";

const ANSWER_HOW =
  "Muy simple: subes tus documentos, me entreno con ellos, copias una línea de código en tu web y empiezo a atender visitantes, capturar sus datos y calificar cada lead con un score de 0 a 100.";

const FALLBACK =
  "Buena pregunta — el equipo puede darte el detalle exacto. ¿Quieres que te registre para el acceso anticipado y te contacten?";

const QUICK: Record<Flow, string[]> = {
  menu: ["Quiero registrarme", "¿Cuánto cuesta?", "¿Cómo funciona?"],
  reg_nombre: [],
  reg_empresa: [],
  reg_email: [],
  reg_confirm: ["Sí, todo correcto", "Corregir mis datos"],
  done: ["Volver al inicio"],
};

let nextId = 1;

function initialsOf(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function NexusWidget() {
  const [open, setOpen] = useState(false);
  const [teaser, setTeaser] = useState(false);
  const [unread, setUnread] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [flow, setFlow] = useState<Flow>("menu");
  const [typing, setTyping] = useState(false);
  const [input, setInput] = useState("");
  const [lead, setLead] = useState({ nombre: "", empresa: "", email: "" });

  const scrollRef = useRef<HTMLDivElement>(null);
  const startedRef = useRef(false);
  const openedOnceRef = useRef(false);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const streamingNow = messages.some((msg) => msg.streaming);

  useEffect(() => {
    const timers = timersRef.current;
    return () => timers.forEach(clearTimeout);
  }, []);

  /* Teaser + badge de no leído tras unos segundos si nunca se abrió */
  useEffect(() => {
    const t = setTimeout(() => {
      if (!openedOnceRef.current) {
        setTeaser(true);
        setUnread(true);
      }
    }, 6000);
    return () => clearTimeout(t);
  }, []);

  /* El formulario de contacto puede abrir el widget en modo registro */
  useEffect(() => {
    function onOpen(e: Event) {
      const intent = (e as CustomEvent<{ intent?: string }>).detail?.intent;
      /* Capturar ANTES de openWidget(): este pone startedRef en true, y
         leerlo después agendaba el registro con el delay corto, haciendo
         que apareciera antes que el saludo de bienvenida. */
      const alreadyStarted = startedRef.current;
      openWidget();
      /* El saludo ahora se transmite por streaming (~3.5s): el registro
         espera a que termine para no pisarlo. */
      if (intent === "register") {
        schedule(() => startRegistration(), alreadyStarted ? 300 : 4600);
      }
    }
    window.addEventListener(OPEN_WIDGET_EVENT, onOpen);
    return () => window.removeEventListener(OPEN_WIDGET_EVENT, onOpen);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* Cerrar con Escape */
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

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
     entre caracteres, igual que el widget real contra el backend. */
  function botSay(text: string, after?: () => void) {
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
          ? 200 + Math.random() * 160
          : /[,;:]/.test(lastChar)
            ? 80 + Math.random() * 70
            : lastChar === " "
              ? 22 + Math.random() * 36
              : 12 + Math.random() * 24;
        schedule(tick, delay);
      };
      /* Arranque con jitter: simula la latencia variable del primer chunk */
      schedule(tick, 80 + Math.random() * 280);
    }, 650);
  }

  function openWidget() {
    setOpen(true);
    setTeaser(false);
    setUnread(false);
    openedOnceRef.current = true;
    if (!startedRef.current) {
      startedRef.current = true;
      schedule(() => botSay(GREETING), 400);
    }
  }

  function startRegistration() {
    setFlow("reg_nombre");
    botSay("¡Genial! Vamos a registrarte. ¿Cuál es tu nombre?");
  }

  function handleSend(raw?: string) {
    const text = (raw ?? input).trim();
    if (!text || typing || streamingNow) return;
    setInput("");
    setMessages((m) => [...m, { id: nextId++, role: "user", text }]);

    switch (flow) {
      case "menu": {
        if (REGISTER_RE.test(text)) {
          startRegistration();
        } else if (PRICE_RE.test(text)) {
          botSay(ANSWER_PRICE);
        } else if (HOW_RE.test(text)) {
          botSay(ANSWER_HOW);
        } else {
          botSay(FALLBACK);
        }
        return;
      }
      case "reg_nombre": {
        setLead((l) => ({ ...l, nombre: text }));
        setFlow("reg_empresa");
        botSay(`Un gusto, ${text}. ¿De qué empresa nos escribes?`);
        return;
      }
      case "reg_empresa": {
        setLead((l) => ({ ...l, empresa: text }));
        setFlow("reg_email");
        botSay("Perfecto. ¿A qué correo te contactamos?");
        return;
      }
      case "reg_email": {
        const email = text.match(EMAIL_RE)?.[0];
        if (!email) {
          botSay(
            "Mmm, ese correo no me cuadra 🙈 ¿Me lo escribes de nuevo? Por ejemplo: ana@empresa.com",
          );
          return;
        }
        setLead((l) => ({ ...l, email }));
        setFlow("reg_confirm");
        botSay(
          `Confirmo tus datos: ${lead.nombre} · ${lead.empresa} · 📧 ${email}. ¿Está todo correcto?`,
        );
        return;
      }
      case "reg_confirm": {
        if (YES_RE.test(text)) {
          setFlow("done");
          botSay(
            "¡Listo! ✅ Tu solicitud de acceso quedó registrada y el equipo de Mindware Labs te escribirá muy pronto. Esto mismo haré con los visitantes de tu web. 😉",
            () => {
              /* La tarjeta de lead aparece en el chat, como en el panel real */
              setMessages((m) => [
                ...m,
                { id: nextId++, role: "bot", kind: "lead", text: "" },
              ]);
            },
          );
        } else {
          setFlow("reg_nombre");
          botSay("Sin problema, empecemos de nuevo. ¿Cuál es tu nombre?");
        }
        return;
      }
      case "done": {
        setFlow("menu");
        botSay("¿En qué más te puedo ayudar?");
        return;
      }
    }
  }

  const placeholder =
    flow === "reg_nombre"
      ? "Tu nombre…"
      : flow === "reg_empresa"
        ? "Tu empresa…"
        : flow === "reg_email"
          ? "tu@empresa.com"
          : "Escribe un mensaje…";

  return (
    <>
      {/* Panel */}
      <AnimatePresence>
        {open && (
          <m.div
            key="panel"
            role="dialog"
            aria-label="Chat con el asistente de Mindware Nexus"
            initial={{ opacity: 0, scale: 0.95, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{
              opacity: 0,
              scale: 0.96,
              y: 8,
              transition: { duration: 0.15, ease: "easeOut" },
            }}
            transition={{ type: "spring", stiffness: 280, damping: 26, mass: 0.9 }}
            style={{ transformOrigin: "bottom right" }}
            className="fixed bottom-24 right-4 z-50 w-[min(calc(100vw-2rem),24rem)] rounded-[26px] bg-gradient-to-b from-white/40 via-nexus-lavender/30 to-nexus-mint/35 p-px shadow-[0_34px_80px_-30px_rgba(0,0,0,0.8),0_0_60px_-24px_rgba(173,116,195,0.7)] sm:right-6"
          >
            <div className="flex max-h-[min(34rem,calc(100svh-9rem))] flex-col overflow-hidden rounded-[25px]">
              {/* Header */}
              <div className="relative flex items-center gap-3 overflow-hidden bg-[radial-gradient(circle_at_22%_0%,rgba(173,116,195,0.35),transparent_36%),linear-gradient(180deg,#522566_0%,#3D1A4E_100%)] px-5 py-4">
                <span
                  aria-hidden
                  className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/55 to-transparent"
                />
                <span className="relative grid size-10 shrink-0 place-items-center rounded-full bg-gradient-to-br from-nexus-lavender via-nexus-purple to-nexus-purple shadow-[0_10px_28px_-12px_rgba(173,116,195,0.9)] ring-2 ring-white/15">
                  <span
                    aria-hidden
                    className="absolute -inset-1 rounded-full border border-white/10 motion-safe:animate-spin-slow"
                  />
                  <Sparkles className="relative size-5 text-white" />
                  <span className="absolute -bottom-0.5 -right-0.5 size-3 rounded-full border-2 border-nexus-deep bg-nexus-mint" />
                </span>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-white">
                    Mindware Nexus
                  </p>
                  <p className="text-xs text-nexus-lavender">
                    Nuestro propio bot · en línea
                  </p>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  aria-label="Cerrar chat"
                  className="relative grid size-8 place-items-center rounded-full text-white/50 transition-[color,background-color,transform] duration-150 ease-out hover:bg-white/10 hover:text-white active:scale-90 focus-visible:outline-2 focus-visible:outline-nexus-lavender"
                >
                  <X aria-hidden className="size-4" />
                </button>
              </div>

              {/* Mensajes */}
              <div
                ref={scrollRef}
                role="log"
                aria-live="polite"
                className="nexus-chat-scroll relative flex min-h-72 flex-1 flex-col gap-2.5 overflow-y-auto overscroll-contain bg-[radial-gradient(circle_at_12%_16%,rgba(173,116,195,0.14),transparent_30%),linear-gradient(180deg,rgba(248,237,251,0.98),rgba(255,255,255,0.86))] px-4 py-4"
              >
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 opacity-[0.22]"
                  style={{
                    backgroundImage:
                      "linear-gradient(rgba(82,37,102,0.16) 1px, transparent 1px), linear-gradient(90deg, rgba(82,37,102,0.14) 1px, transparent 1px)",
                    backgroundSize: "34px 34px",
                  }}
                />
                {messages.length > 0 && (
                  <div className="relative z-10 mx-auto shrink-0 rounded-full bg-nexus-purple/10 px-3 py-1 text-[10px] font-medium text-nexus-purple/70">
                    Hoy
                  </div>
                )}
                <AnimatePresence initial={false}>
                  {messages.map((msg) =>
                    msg.kind === "lead" ? (
                      <m.div
                        key={msg.id}
                        initial={{ opacity: 0, y: 14, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ type: "spring", stiffness: 260, damping: 26, mass: 0.9 }}
                        className="relative z-10 shrink-0 px-1 pt-1"
                      >
                        <div className="rounded-2xl bg-gradient-to-r from-nexus-mint/50 via-white/20 to-nexus-lavender/45 p-px shadow-[0_18px_44px_-22px_rgba(61,26,78,0.6)]">
                          <div className="relative overflow-hidden rounded-[calc(1rem-1px)] bg-nexus-deep p-3.5">
                            <span
                              aria-hidden
                              className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-nexus-mint/70 to-transparent"
                            />
                            <div className="flex items-center justify-between gap-3">
                              <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-white/60">
                                <Zap aria-hidden className="size-3 text-nexus-mint" />
                                Registro confirmado
                              </span>
                              <span className="rounded-full bg-nexus-mint/15 px-2 py-0.5 text-[11px] font-medium text-nexus-mint ring-1 ring-nexus-mint/25">
                                Acceso anticipado
                              </span>
                            </div>
                            <div className="mt-2.5 flex items-center gap-2.5">
                              <span
                                aria-hidden
                                className="grid size-8 shrink-0 place-items-center rounded-full bg-gradient-to-br from-nexus-lavender to-nexus-purple text-[10px] font-semibold text-white ring-1 ring-white/20"
                              >
                                {initialsOf(lead.nombre || "Nexus")}
                              </span>
                              <div className="min-w-0">
                                <p className="truncate text-[13px] font-semibold leading-tight text-white">
                                  {lead.nombre}
                                </p>
                                <p className="truncate text-[11px] text-white/50">
                                  {lead.empresa} · {lead.email}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </m.div>
                    ) : msg.role === "bot" ? (
                      <m.div
                        key={msg.id}
                        initial={{ opacity: 0, y: 12, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ type: "spring", stiffness: 260, damping: 26, mass: 0.9 }}
                        className="relative z-10 flex max-w-[88%] shrink-0 items-end gap-2 self-start"
                      >
                        <span className="grid size-6 shrink-0 place-items-center rounded-full bg-gradient-to-br from-nexus-purple to-nexus-lavender shadow-sm">
                          <Sparkles aria-hidden className="size-3 text-white" />
                        </span>
                        <div className="relative overflow-hidden rounded-[18px] rounded-bl-[5px] border border-white bg-white/95 px-4 py-2.5 text-sm leading-relaxed text-nexus-ink shadow-[0_12px_32px_-18px_rgba(61,26,78,0.45),0_2px_8px_rgba(61,26,78,0.08)] backdrop-blur">
                          <span
                            aria-hidden
                            className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-nexus-lavender/45 to-transparent"
                          />
                          {msg.text}
                          {msg.streaming && (
                            <span className="ml-0.5 inline-block h-3.5 w-0.5 animate-pulse bg-nexus-lavender align-middle" />
                          )}
                        </div>
                      </m.div>
                    ) : (
                      <m.div
                        key={msg.id}
                        initial={{ opacity: 0, y: 12, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ type: "spring", stiffness: 260, damping: 26, mass: 0.9 }}
                        className="relative z-10 max-w-[85%] shrink-0 self-end overflow-hidden rounded-[18px] rounded-br-[5px] bg-gradient-to-br from-nexus-purple via-nexus-purple to-nexus-deep px-4 py-2.5 text-sm leading-relaxed text-white shadow-[0_16px_36px_-18px_rgba(61,26,78,0.8),0_4px_14px_rgba(61,26,78,0.28)] ring-1 ring-white/10"
                      >
                        <span
                          aria-hidden
                          className="absolute inset-0 bg-[radial-gradient(circle_at_18%_0%,rgba(173,116,195,0.38),transparent_55%)]"
                        />
                        <span className="relative z-10">{msg.text}</span>
                        <span className="ml-2 inline-flex translate-y-0.5">
                          <CheckCheck
                            aria-hidden
                            className="size-3.5 text-nexus-lavender"
                          />
                        </span>
                      </m.div>
                    ),
                  )}
                </AnimatePresence>

                {typing && (
                  <m.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative z-10 flex shrink-0 items-end gap-2 self-start"
                  >
                    <span className="grid size-6 shrink-0 place-items-center rounded-full bg-gradient-to-br from-nexus-purple to-nexus-lavender shadow-sm">
                      <Sparkles aria-hidden className="size-3 text-white" />
                    </span>
                    <div className="flex gap-1.5 rounded-[18px] rounded-bl-[5px] border border-white bg-white/95 px-4 py-3 shadow-[0_2px_8px_rgba(61,26,78,0.07)]">
                      {[0, 1, 2].map((d) => (
                        <span
                          key={d}
                          className="size-1.5 rounded-full bg-nexus-lavender motion-safe:animate-typing-dot"
                          style={{ animationDelay: `${d * 0.15}s` }}
                        />
                      ))}
                    </div>
                  </m.div>
                )}
              </div>

              {/* Quick replies */}
              <AnimatePresence>
                {QUICK[flow].length > 0 && !typing && !streamingNow && (
                  <m.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{
                      opacity: 0,
                      height: 0,
                      transition: { duration: 0.18, ease: "easeOut" },
                    }}
                    className="flex flex-wrap gap-2 overflow-hidden bg-white/80 px-4 pb-3"
                  >
                    {QUICK[flow].map((q) => (
                      <button
                        key={q}
                        onClick={() => handleSend(q)}
                        className="rounded-full border border-nexus-purple/25 bg-white px-3.5 py-1.5 text-xs font-medium text-nexus-purple transition-[transform,background-color,border-color,color] duration-200 ease-out hover:scale-[1.03] hover:border-nexus-purple hover:bg-nexus-purple hover:text-white active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-nexus-purple"
                      >
                        {q}
                      </button>
                    ))}
                  </m.div>
                )}
              </AnimatePresence>

              {/* Input + footer púrpura profundo */}
              <div className="relative bg-[linear-gradient(180deg,#3D1A4E_0%,#111827_160%)] px-4 pb-3 pt-3">
                <span
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
                    name="mensaje-widget"
                    autoComplete="off"
                    enterKeyHint="send"
                    aria-label="Escribe un mensaje para el asistente"
                    placeholder={placeholder}
                    className="flex-1 bg-transparent text-sm text-white outline-none placeholder:text-white/40"
                  />
                  <button
                    type="submit"
                    disabled={!input.trim()}
                    aria-label="Enviar mensaje"
                    className="grid size-9 place-items-center rounded-full bg-gradient-to-br from-nexus-lavender to-nexus-purple text-white shadow-[0_8px_22px_-10px_rgba(173,116,195,0.9)] transition-[transform,opacity] duration-200 ease-out hover:scale-105 active:scale-95 disabled:opacity-40 disabled:hover:scale-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-nexus-lavender"
                  >
                    <Send aria-hidden className="size-4" />
                  </button>
                </form>
                <p className="mt-2 text-center text-[10px] text-white/35">
                  Impulsado por{" "}
                  <span className="text-nexus-lavender">Mindware Nexus</span> —
                  este widget es el producto
                </p>
              </div>
            </div>
          </m.div>
        )}
      </AnimatePresence>

      {/* Teaser: mini burbuja del bot, con su avatar */}
      <AnimatePresence>
        {teaser && !open && (
          <m.button
            key="teaser"
            onClick={openWidget}
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{
              opacity: 0,
              scale: 0.95,
              transition: { duration: 0.15 },
            }}
            transition={{ type: "spring", stiffness: 260, damping: 24, mass: 0.9 }}
            style={{ transformOrigin: "bottom right" }}
            className="fixed bottom-24 right-4 z-50 flex max-w-64 items-start gap-2.5 rounded-2xl rounded-br-md bg-white p-3.5 text-left shadow-xl shadow-black/25 ring-1 ring-nexus-purple/10 transition-transform duration-200 ease-out hover:scale-[1.03] active:scale-[0.98] sm:right-6"
          >
            <span
              aria-hidden
              className="grid size-7 shrink-0 place-items-center rounded-full bg-gradient-to-br from-nexus-purple to-nexus-lavender shadow-sm"
            >
              <Sparkles className="size-3.5 text-white" />
            </span>
            <span>
              <span className="block text-xs font-semibold text-nexus-ink">
                Asistente Nexus
              </span>
              <span className="mt-0.5 block text-[13px] leading-snug text-nexus-ink/70">
                ¿Te ayudo a empezar? Pregúntame lo que quieras 👋
              </span>
            </span>
          </m.button>
        )}
      </AnimatePresence>

      {/* Launcher */}
      <m.button
        onClick={() => (open ? setOpen(false) : openWidget())}
        aria-label={open ? "Cerrar el chat" : "Abrir el chat con nuestro bot"}
        aria-expanded={open}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 22, mass: 0.9, delay: 1.2 }}
        className="group fixed bottom-5 right-4 z-50 grid size-14 place-items-center rounded-full bg-gradient-to-br from-nexus-purple to-nexus-lavender text-white shadow-xl shadow-nexus-purple/40 transition-transform duration-200 ease-out hover:scale-110 active:scale-95 sm:right-6 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-nexus-lavender"
      >
        <span
          aria-hidden
          className="absolute inset-0 -z-10 rounded-full bg-nexus-lavender/40 blur-md motion-safe:animate-pulse-glow"
        />
        <AnimatePresence>
          {unread && !open && (
            <m.span
              key="badge"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0, transition: { duration: 0.15 } }}
              transition={{ type: "spring", stiffness: 380, damping: 20 }}
              className="absolute -right-0.5 -top-0.5 grid size-5 place-items-center rounded-full bg-nexus-coral text-[10px] font-bold text-white shadow-md ring-2 ring-white"
            >
              1
            </m.span>
          )}
        </AnimatePresence>
        <AnimatePresence mode="wait" initial={false}>
          {open ? (
            <m.span
              key="close"
              initial={{ opacity: 0, rotate: -45, scale: 0.8 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              exit={{ opacity: 0, rotate: 45, scale: 0.8 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
            >
              <X aria-hidden className="size-6" />
            </m.span>
          ) : (
            <m.span
              key="chat"
              initial={{ opacity: 0, rotate: 45, scale: 0.8 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              exit={{ opacity: 0, rotate: -45, scale: 0.8 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
            >
              <MessageCircle aria-hidden className="size-6" />
            </m.span>
          )}
        </AnimatePresence>
      </m.button>
    </>
  );
}
