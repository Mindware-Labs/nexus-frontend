"use client";

import { AnimatePresence, motion } from "motion/react";
import { CheckCircle2, Loader2, Send, Sparkles } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { SectionHeading } from "./section-heading";
import { Reveal } from "./reveal";
import { OPEN_WIDGET_EVENT } from "./nexus-widget";

type Status = "idle" | "sending" | "success" | "error";

/* Sin bordes toscos: superficie de cristal con ring sutil; al foco se
   despliega un aura lavanda difuminada (#AD74C3) solo con box-shadow. */
const inputClass =
  "w-full rounded-2xl bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/40 outline-none ring-1 ring-white/10 transition-[box-shadow,background-color] duration-300 focus:bg-white/10 focus:ring-[#AD74C3]/70 focus:shadow-[0_0_0_4px_rgba(173,116,195,0.16),0_0_36px_-8px_rgba(173,116,195,0.6)]";

export function Contact() {
  const [status, setStatus] = useState<Status>("idle");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "sending") return;
    setStatus("sending");

    const data = Object.fromEntries(new FormData(e.currentTarget));
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    try {
      if (apiUrl) {
        const res = await fetch(`${apiUrl}/public/access-requests`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
      } else {
        await new Promise((r) => setTimeout(r, 1200));
      }
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  return (
    <section id="contacto" className="relative overflow-hidden bg-[#3D1A4E] py-28 sm:py-36">
      <div
        aria-hidden
        className="absolute left-1/2 top-0 -z-10 h-px w-2/3 -translate-x-1/2 bg-gradient-to-r from-transparent via-[#AD74C3]/40 to-transparent"
      />

      <div className="mx-auto max-w-3xl px-5 sm:px-8 relative z-10">
        <SectionHeading
          dark
          eyebrow="Acceso anticipado"
          title="Sé de los primeros en activar Nexus"
          subtitle="Déjanos tus datos y el equipo de Mindware Labs te contactará para configurar tu bot y acompañarte en el lanzamiento."
        />

        {/* Registro conversacional */}
        <Reveal delay={0.1} className="mt-10">
          <div className="flex flex-col items-center justify-between gap-4 rounded-3xl bg-gradient-to-r from-[#111827]/40 to-[#522566]/40 border border-white/5 p-6 text-center shadow-lg sm:flex-row sm:px-8 sm:text-left backdrop-blur-md">
            <div className="flex items-center gap-4">
              <span className="relative grid size-11 shrink-0 place-items-center rounded-full bg-gradient-to-br from-[#522566] to-[#AD74C3] ring-2 ring-white/15">
                <Sparkles aria-hidden className="size-5 text-white" />
                <span className="absolute -bottom-0.5 -right-0.5 size-3 rounded-full border-2 border-[#3D1A4E] bg-[#34D399]" />
              </span>
              <div>
                <p className="text-sm font-semibold text-white">
                  ¿Prefieres no llenar formularios?
                </p>
                <p className="text-sm text-white/60">
                  Regístrate conversando con nuestro bot — así se siente Nexus.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() =>
                window.dispatchEvent(
                  new CustomEvent(OPEN_WIDGET_EVENT, {
                    detail: { intent: "register" },
                  }),
                )
              }
              className="shrink-0 rounded-full bg-white px-5 py-2.5 text-sm font-medium text-[#3D1A4E] transition-[transform,background-color] duration-200 ease-out hover:scale-[1.04] hover:bg-[#F8EDFB] active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#AD74C3]"
            >
              Registrarme conversando
            </button>
          </div>
          <div className="mt-8 flex items-center gap-4" aria-hidden>
            <span className="h-px flex-1 bg-white/10" />
            <span className="text-xs font-medium uppercase tracking-widest text-white/40">
              o con el formulario
            </span>
            <span className="h-px flex-1 bg-white/10" />
          </div>
        </Reveal>

        <Reveal delay={0.15} className="mt-8">
          <AnimatePresence mode="wait">
            {status === "success" ? (
              <motion.div
                key="success"
                role="status"
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 130, damping: 22, mass: 0.9 }}
                className="flex flex-col items-center rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl px-8 py-16 text-center shadow-2xl"
              >
                <motion.span
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", duration: 0.6, bounce: 0.25, delay: 0.15 }}
                  className="grid size-16 place-items-center rounded-full bg-[#34D399]/15"
                >
                  <CheckCircle2 className="size-8 text-[#34D399]" />
                </motion.span>
                <h3 className="mt-6 text-2xl font-semibold tracking-tight text-white">
                  ¡Solicitud recibida!
                </h3>
                <p className="mt-2 max-w-md text-[15px] leading-relaxed text-white/60">
                  El equipo owner ya fue notificado. Te escribiremos muy pronto
                  para darte acceso y configurar tu primer bot.
                </p>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                onSubmit={handleSubmit}
                exit={{ opacity: 0, y: -12 }}
                className="grid gap-5 rounded-[2.5rem] border border-white/10 bg-white/5 backdrop-blur-xl p-8 sm:grid-cols-2 sm:p-10 shadow-2xl"
              >
                <div className="flex flex-col gap-2">
                  <label htmlFor="nombre" className="text-sm font-medium text-white/90">
                    Nombre
                  </label>
                  <input
                    id="nombre"
                    name="nombre"
                    required
                    autoComplete="name"
                    placeholder="Ana Pérez"
                    className={inputClass}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="empresa" className="text-sm font-medium text-white/90">
                    Empresa
                  </label>
                  <input
                    id="empresa"
                    name="empresa"
                    required
                    autoComplete="organization"
                    placeholder="Mi Empresa S.A."
                    className={inputClass}
                  />
                </div>
                <div className="flex flex-col gap-2 sm:col-span-2">
                  <label htmlFor="email" className="text-sm font-medium text-white/90">
                    Email corporativo
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    spellCheck={false}
                    placeholder="ana@miempresa.com"
                    className={inputClass}
                  />
                </div>
                <div className="flex flex-col gap-2 sm:col-span-2">
                  <label htmlFor="mensaje" className="text-sm font-medium text-white/90">
                    ¿Qué te gustaría lograr con Nexus?{" "}
                    <span className="font-normal text-white/40">(opcional)</span>
                  </label>
                  <textarea
                    id="mensaje"
                    name="mensaje"
                    rows={4}
                    placeholder="Cuéntanos sobre tu negocio y el tipo de leads que buscas…"
                    className={cn(inputClass, "resize-none")}
                  />
                </div>

                {status === "error" && (
                  <p
                    role="alert"
                    className="text-sm font-medium text-[#FB7185] sm:col-span-2"
                  >
                    No pudimos enviar tu solicitud. Inténtalo de nuevo en unos
                    minutos.
                  </p>
                )}

                <motion.button
                  type="submit"
                  disabled={status === "sending"}
                  whileTap={{ scale: 0.95 }}
                  className="group mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-[#522566] px-8 py-3.5 text-sm font-medium text-white shadow-lg shadow-[#522566]/25 transition-[transform,background-color] duration-200 ease-out hover:scale-[1.02] hover:bg-[#AD74C3] disabled:opacity-70 sm:col-span-2 sm:justify-self-center focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#AD74C3]"
                >
                  {status === "sending" ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      Enviando…
                    </>
                  ) : (
                    <>
                      Solicitar acceso anticipado
                      <Send className="size-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-0.5" />
                    </>
                  )}
                </motion.button>
              </motion.form>
            )}
          </AnimatePresence>
        </Reveal>
      </div>
    </section>
  );
}
