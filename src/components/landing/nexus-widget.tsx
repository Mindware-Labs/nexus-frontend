"use client";

import { AnimatePresence, m } from "motion/react";
import { MessageCircle, Send, Sparkles, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export const OPEN_WIDGET_EVENT = "nexus:open-widget";

type Message = {
  id: number;
  role: "bot" | "user";
  text: string;
};

const GREETING =
  "Hola. Soy el bot de prueba de Mindware Nexus. Escribeme cualquier cosa y te respondo usando Gemini, sin contexto adicional.";

const QUICK_REPLIES = [
  "Explicame Mindware Nexus en 2 lineas",
  "Escribe un saludo corto para un visitante",
  "Dame una idea de automatizacion para una landing",
];

let nextId = 1;

export function NexusWidget() {
  const [open, setOpen] = useState(false);
  const [teaser, setTeaser] = useState(false);
  const [unread, setUnread] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const startedRef = useRef(false);
  const openedOnceRef = useRef(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!openedOnceRef.current) {
        setTeaser(true);
        setUnread(true);
      }
    }, 6000);

    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    function onOpen(e: Event) {
      const intent = (e as CustomEvent<{ intent?: string }>).detail?.intent;
      openWidget();
      if (intent === "register") {
        void sendMessage("Quiero registrarme para una demo.");
      }
    }

    window.addEventListener(OPEN_WIDGET_EVENT, onOpen);
    return () => window.removeEventListener(OPEN_WIDGET_EVENT, onOpen);
  }, []);

  useEffect(() => {
    if (!open) return;

    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, loading]);

  function appendMessage(role: Message["role"], text: string) {
    setMessages((current) => [...current, { id: nextId++, role, text }]);
  }

  function openWidget() {
    setOpen(true);
    setTeaser(false);
    setUnread(false);
    openedOnceRef.current = true;

    if (!startedRef.current) {
      startedRef.current = true;
      appendMessage("bot", GREETING);
    }
  }

  async function sendMessage(raw?: string) {
    const text = (raw ?? input).trim();
    if (!text || loading) return;

    setInput("");
    appendMessage("user", text);
    setLoading(true);

    try {
      const response = await fetch("/api/landing-chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: text }),
      });

      const data = (await response.json().catch(() => null)) as
        | { reply?: string; message?: string }
        | null;

      if (!response.ok) {
        appendMessage(
          "bot",
          data?.message ?? "No pude responder ahora mismo. Revisa la configuracion del backend.",
        );
        return;
      }

      appendMessage(
        "bot",
        data?.reply ?? "Gemini respondio sin texto util para mostrar.",
      );
    } catch {
      appendMessage(
        "bot",
        "No pude conectar con el endpoint de prueba. Verifica frontend, backend y la API key de Gemini.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
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
                  <p className="text-sm font-semibold text-white">Mindware Nexus</p>
                  <p className="text-xs text-nexus-lavender">
                    Bot de prueba con Gemini
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
                    msg.role === "bot" ? (
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
                      </m.div>
                    ),
                  )}
                </AnimatePresence>

                {loading && (
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

              {!loading && (
                <div className="flex flex-wrap gap-2 overflow-hidden bg-white/80 px-4 pb-3 pt-2">
                  {QUICK_REPLIES.map((reply) => (
                    <button
                      key={reply}
                      onClick={() => void sendMessage(reply)}
                      className="rounded-full border border-nexus-purple/25 bg-white px-3.5 py-1.5 text-xs font-medium text-nexus-purple transition-[transform,background-color,border-color,color] duration-200 ease-out hover:scale-[1.03] hover:border-nexus-purple hover:bg-nexus-purple hover:text-white active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-nexus-purple"
                    >
                      {reply}
                    </button>
                  ))}
                </div>
              )}

              <div className="relative bg-[linear-gradient(180deg,#3D1A4E_0%,#111827_160%)] px-4 pb-3 pt-3">
                <span
                  aria-hidden
                  className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/22 to-transparent"
                />
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    void sendMessage();
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
                    placeholder="Escribe un mensaje..."
                    className="flex-1 bg-transparent text-sm text-white outline-none placeholder:text-white/40"
                  />
                  <button
                    type="submit"
                    disabled={loading || !input.trim()}
                    aria-label="Enviar mensaje"
                    className="grid size-9 place-items-center rounded-full bg-gradient-to-br from-nexus-lavender to-nexus-purple text-white shadow-[0_8px_22px_-10px_rgba(173,116,195,0.9)] transition-[transform,opacity] duration-200 ease-out hover:scale-105 active:scale-95 disabled:opacity-40 disabled:hover:scale-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-nexus-lavender"
                  >
                    <Send aria-hidden className="size-4" />
                  </button>
                </form>
                <p className="mt-2 text-center text-[10px] text-white/35">
                  Impulsado por{" "}
                  <span className="text-nexus-lavender">Mindware Nexus</span>
                </p>
              </div>
            </div>
          </m.div>
        )}
      </AnimatePresence>

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
                Prueba el bot real conectado a Gemini
              </span>
            </span>
          </m.button>
        )}
      </AnimatePresence>

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
