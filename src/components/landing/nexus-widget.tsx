"use client";

import { AnimatePresence, motion } from "motion/react";
import { MessageCircle, Send, Sparkles, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

/**
 * Widget flotante de Mindware Nexus: la landing usa su propio producto.
 * Simulación del bot real — responde sobre el producto y permite
 * registrarse conversando (alternativa al formulario de contacto).
 */

export const OPEN_WIDGET_EVENT = "nexus:open-widget";

type Flow =
  | "menu"
  | "reg_nombre"
  | "reg_empresa"
  | "reg_email"
  | "reg_confirm"
  | "done";

type Message = { id: number; role: "bot" | "user"; text: string };

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

function StreamText({ text }: { text: string }) {
  return (
    <motion.span
      initial="hidden"
      animate="visible"
      variants={{ visible: { transition: { staggerChildren: 0.045 } } }}
    >
      {text.split(" ").map((word, i) => (
        <motion.span
          key={i}
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { duration: 0.15 } },
          }}
        >
          {word}{" "}
        </motion.span>
      ))}
    </motion.span>
  );
}

export function NexusWidget() {
  const [open, setOpen] = useState(false);
  const [teaser, setTeaser] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [flow, setFlow] = useState<Flow>("menu");
  const [typing, setTyping] = useState(false);
  const [input, setInput] = useState("");
  const [lead, setLead] = useState({ nombre: "", empresa: "", email: "" });

  const scrollRef = useRef<HTMLDivElement>(null);
  const startedRef = useRef(false);
  const openedOnceRef = useRef(false);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    const timers = timersRef.current;
    return () => timers.forEach(clearTimeout);
  }, []);

  /* Teaser tras unos segundos si nunca se abrió */
  useEffect(() => {
    const t = setTimeout(() => {
      if (!openedOnceRef.current) setTeaser(true);
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
      if (intent === "register") {
        schedule(() => startRegistration(), alreadyStarted ? 300 : 2100);
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

  function botSay(text: string, after?: () => void) {
    setTyping(true);
    schedule(() => {
      setTyping(false);
      setMessages((m) => [...m, { id: nextId++, role: "bot", text }]);
      after?.();
    }, 750);
  }

  function openWidget() {
    setOpen(true);
    setTeaser(false);
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
    if (!text || typing) return;
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
          <motion.div
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
            className="fixed bottom-24 right-4 z-50 w-[min(calc(100vw-2rem),24rem)] rounded-[26px] bg-gradient-to-b from-white/30 via-white/10 to-white/5 p-px shadow-2xl shadow-black/50 sm:right-6"
          >
            <div className="flex max-h-[min(34rem,calc(100svh-9rem))] flex-col overflow-hidden rounded-[25px]">
              {/* Header */}
              <div className="flex items-center gap-3 bg-gradient-to-b from-nexus-purple to-nexus-deep px-5 py-4">
                <span className="relative grid size-10 shrink-0 place-items-center rounded-full bg-gradient-to-br from-nexus-purple to-nexus-lavender ring-2 ring-white/15">
                  <Sparkles className="size-5 text-white" />
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
                  className="grid size-8 place-items-center rounded-full text-white/50 transition-[color,background-color,transform] duration-150 ease-out hover:bg-white/10 hover:text-white active:scale-90 focus-visible:outline-2 focus-visible:outline-nexus-lavender"
                >
                  <X aria-hidden className="size-4" />
                </button>
              </div>

              {/* Mensajes */}
              <div
                ref={scrollRef}
                role="log"
                aria-live="polite"
                className="nexus-chat-scroll flex min-h-72 flex-1 flex-col gap-2.5 overflow-y-auto overscroll-contain bg-gradient-to-b from-nexus-lilac/90 to-nexus-lilac/60 px-4 py-4"
              >
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
                        <div className="rounded-2xl rounded-bl-md border border-nexus-purple/8 bg-white px-4 py-2.5 text-sm leading-relaxed text-nexus-ink shadow-[0_2px_8px_rgba(61,26,78,0.07)]">
                          <StreamText text={m.text} />
                        </div>
                      </motion.div>
                    ) : (
                      <motion.div
                        key={m.id}
                        initial={{ opacity: 0, y: 12, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ type: "spring", stiffness: 260, damping: 26, mass: 0.9 }}
                        className="max-w-[85%] shrink-0 self-end rounded-2xl rounded-br-md bg-gradient-to-br from-nexus-purple to-nexus-deep px-4 py-2.5 text-sm leading-relaxed text-white shadow-[0_4px_12px_rgba(61,26,78,0.25)]"
                      >
                        {m.text}
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
                    <div className="flex gap-1.5 rounded-2xl rounded-bl-md border border-nexus-purple/8 bg-white px-4 py-3 shadow-[0_2px_8px_rgba(61,26,78,0.07)]">
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
              {QUICK[flow].length > 0 && !typing && (
                <div className="flex flex-wrap gap-2 bg-nexus-lilac/60 px-4 pb-3">
                  {QUICK[flow].map((q) => (
                    <button
                      key={q}
                      onClick={() => handleSend(q)}
                      className="rounded-full border border-nexus-purple/25 bg-white px-3.5 py-1.5 text-xs font-medium text-nexus-purple transition-[transform,background-color,border-color,color] duration-200 ease-out hover:scale-[1.03] hover:border-nexus-purple hover:bg-nexus-purple hover:text-white active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-nexus-purple"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              )}

              {/* Input */}
              <div className="bg-nexus-deep px-4 pb-3 pt-3">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSend();
                  }}
                  className="flex items-center gap-2 rounded-full bg-white/10 py-1.5 pl-4 pr-1.5 ring-1 ring-white/10 transition-[box-shadow] duration-300 focus-within:ring-nexus-lavender/60 focus-within:shadow-[0_0_0_4px_rgba(173,116,195,0.14),0_0_30px_-6px_rgba(173,116,195,0.65)]"
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
                    className="grid size-9 place-items-center rounded-full bg-nexus-purple text-white transition-[transform,background-color] duration-200 ease-out hover:scale-105 hover:bg-nexus-lavender active:scale-95 disabled:opacity-40 disabled:hover:scale-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-nexus-lavender"
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
          </motion.div>
        )}
      </AnimatePresence>

      {/* Teaser */}
      <AnimatePresence>
        {teaser && !open && (
          <motion.button
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
            className="fixed bottom-24 right-4 z-50 max-w-56 rounded-2xl rounded-br-md bg-white px-4 py-3 text-left text-[13px] leading-snug text-nexus-ink shadow-xl shadow-black/25 ring-1 ring-nexus-purple/10 transition-transform duration-200 ease-out hover:scale-[1.03] active:scale-[0.98] sm:right-6"
          >
            ¿Te ayudo a empezar? Pregúntame lo que quieras 👋
          </motion.button>
        )}
      </AnimatePresence>

      {/* Launcher */}
      <motion.button
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
        <AnimatePresence mode="wait" initial={false}>
          {open ? (
            <motion.span
              key="close"
              initial={{ opacity: 0, rotate: -45, scale: 0.8 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              exit={{ opacity: 0, rotate: 45, scale: 0.8 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
            >
              <X aria-hidden className="size-6" />
            </motion.span>
          ) : (
            <motion.span
              key="chat"
              initial={{ opacity: 0, rotate: 45, scale: 0.8 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              exit={{ opacity: 0, rotate: -45, scale: 0.8 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
            >
              <MessageCircle aria-hidden className="size-6" />
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>
    </>
  );
}
