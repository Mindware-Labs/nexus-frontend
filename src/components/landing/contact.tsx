"use client";

import { Check, MessageCircle, Sparkles } from "lucide-react";
import { SectionHeading } from "./section-heading";
import { Reveal } from "./reveal";
import { SparkleHalo } from "./sparkle-halo";
import { OPEN_WIDGET_EVENT } from "./nexus-widget";

/**
 * Acceso anticipado 100% conversacional: no hay formulario — el propio
 * bot del widget registra al visitante, que es exactamente la promesa
 * del producto. El CTA abre el widget en modo registro.
 */

const TRUST_ITEMS = [
  "Sin formularios ni spam",
  "Menos de 1 minuto",
  "Te contactamos en 24 h",
];

export function Contact() {
  return (
    <section
      id="contacto"
      className="relative isolate overflow-hidden bg-nexus-deep py-20 sm:py-28"
    >
      <div
        aria-hidden
        className="absolute left-1/2 top-0 z-10 h-px w-2/3 -translate-x-1/2 bg-gradient-to-r from-transparent via-nexus-lavender/40 to-transparent"
      />

      {/* Fondo: aurora + orbes de color y halo de partículas dispersas
          que titilan en remolino alrededor de la card */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      >
        <div
          className="absolute inset-[-18%] opacity-50 motion-safe:animate-hero-mesh"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 28%, rgba(173,116,195,0.26), transparent 26%), radial-gradient(circle at 80% 18%, rgba(52,211,153,0.11), transparent 24%), radial-gradient(circle at 50% 86%, rgba(251,113,133,0.09), transparent 27%)",
            backgroundSize: "135% 135%, 128% 128%, 145% 145%",
          }}
        />
        <div className="absolute left-1/2 top-1/2 size-[36rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-nexus-purple/40 blur-[140px] motion-safe:animate-drift-2" />
        <div className="absolute -left-40 top-8 size-[26rem] rounded-full bg-nexus-lavender/12 blur-[130px] motion-safe:animate-drift-1" />
        <div className="absolute -right-44 bottom-0 size-[24rem] rounded-full bg-nexus-mint/8 blur-[130px] motion-safe:animate-drift-3" />
        <SparkleHalo className="absolute inset-0 size-full" />
        <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-nexus-deep to-transparent" />
      </div>

      <div className="relative z-10 mx-auto max-w-3xl px-5 sm:px-8">
        <SectionHeading
          dark
          eyebrow="Acceso anticipado"
          title="Sé de los primeros en activar Nexus"
          subtitle="Aquí no hay formularios: te registras conversando con nuestro bot, exactamente igual que lo harán los visitantes de tu web."
        />

        <Reveal delay={0.1} className="mx-auto mt-10 max-w-xl">
          <div className="rounded-[2rem] bg-gradient-to-b from-nexus-lavender/40 via-white/15 to-nexus-mint/35 p-px shadow-[0_34px_80px_-34px_rgba(0,0,0,0.82),0_0_70px_-30px_rgba(173,116,195,0.7)]">
            <div className="relative flex flex-col items-center overflow-hidden rounded-[calc(2rem-1px)] bg-white/5 px-7 py-9 text-center backdrop-blur-xl sm:px-10">
              <span
                aria-hidden
                className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/45 to-transparent"
              />

              <span className="relative grid size-14 shrink-0 place-items-center rounded-full bg-gradient-to-br from-nexus-lavender via-nexus-purple to-nexus-purple shadow-[0_10px_28px_-12px_rgba(173,116,195,0.9)] ring-2 ring-white/15">
                <span
                  aria-hidden
                  className="absolute -inset-1.5 rounded-full border border-white/10 motion-safe:animate-spin-slow"
                />
                <Sparkles className="relative size-6 text-white" />
                <span className="absolute -bottom-0.5 -right-0.5 size-3.5 rounded-full border-2 border-nexus-deep bg-nexus-mint" />
              </span>
              <p className="mt-4 text-sm font-semibold text-white">
                Asistente Nexus
              </p>
              <p className="text-xs text-nexus-lavender">
                Nuestro propio bot · en línea
              </p>

              {/* Lo que el bot te dirá al abrir el chat */}
              <div className="relative mt-6 max-w-sm rounded-[18px] rounded-bl-[5px] border border-white/90 bg-white/95 px-4 py-3 text-left text-[13px] leading-relaxed text-nexus-ink shadow-[0_12px_32px_-18px_rgba(0,0,0,0.7)]">
                <span
                  aria-hidden
                  className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-nexus-lavender/45 to-transparent"
                />
                ¡Hola! 👋 Yo me encargo de tu registro: tu nombre, tu empresa y
                tu correo. En menos de un minuto quedas en la lista de acceso
                anticipado.
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
                className="group mt-7 inline-flex items-center gap-2.5 rounded-full bg-gradient-to-br from-nexus-lavender to-nexus-purple px-7 py-3.5 text-sm font-medium text-white shadow-[0_14px_36px_-12px_rgba(173,116,195,0.9)] transition-transform duration-200 ease-out hover:scale-[1.04] active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-nexus-lavender"
              >
                <MessageCircle
                  aria-hidden
                  className="size-4 transition-transform duration-300 group-hover:-rotate-12"
                />
                Registrarme conversando
              </button>

              <div className="mt-7 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 border-t border-white/10 pt-5">
                {TRUST_ITEMS.map((item) => (
                  <span
                    key={item}
                    className="inline-flex items-center gap-1.5 text-xs text-white/55"
                  >
                    <Check
                      aria-hidden
                      strokeWidth={3}
                      className="size-3 text-nexus-mint"
                    />
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
