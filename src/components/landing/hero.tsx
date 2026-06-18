'use client'

import { useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'

const VIDEO_SRC =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260328_065045_c44942da-53c6-4804-b734-f9e07fc22e08.mp4'

/* Duración (en segundos) de cada fundido de entrada/salida del vídeo. */
const FADE = 0.5

const NAV_ITEMS = [
  { label: 'Cómo funciona', href: '#como-funciona' },
  { label: 'Plataforma', href: '#plataforma' },
  { label: 'Planes', href: '#planes' },
  { label: 'Historias', href: '#historias' },
]

const BRANDS = ['Vortex', 'Nimbus', 'Prysma', 'Cirrus', 'Kynder', 'Halcyn']

/* Hero a pantalla completa con vídeo de fondo en bucle, navbar, titular,
   subtítulo, CTA y marquee de logos. El tema oscuro (fondo/foreground) se
   define localmente vía CSS vars para no alterar el tema global de la app. */
export function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null)

  /* Bucle de fundido controlado por JS: 0.5s de fade-in al empezar, 0.5s de
     fade-out al terminar, calculado por requestAnimationFrame. Al acabar el
     vídeo, opacity vuelve a 0, espera 100ms y rearranca desde el inicio. */
  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    let raf = 0
    let replayTimer: ReturnType<typeof setTimeout> | undefined

    const tick = () => {
      const { duration, currentTime } = video
      if (duration && Number.isFinite(duration)) {
        let opacity = 1
        if (currentTime < FADE) {
          opacity = currentTime / FADE
        } else if (currentTime > duration - FADE) {
          opacity = Math.max(0, (duration - currentTime) / FADE)
        }
        video.style.opacity = String(opacity)
      }
      raf = requestAnimationFrame(tick)
    }

    const handleEnded = () => {
      video.style.opacity = '0'
      replayTimer = setTimeout(() => {
        video.currentTime = 0
        void video.play().catch(() => {})
      }, 100)
    }

    video.addEventListener('ended', handleEnded)
    void video.play().catch(() => {})
    raf = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(raf)
      if (replayTimer) clearTimeout(replayTimer)
      video.removeEventListener('ended', handleEnded)
    }
  }, [])

  return (
    <div
      className="relative min-h-screen overflow-hidden bg-background font-[family-name:var(--font-geist-sans)] text-foreground"
      style={
        {
          '--background': 'hsl(260 87% 3%)',
          '--foreground': 'hsl(40 6% 95%)',
        } as React.CSSProperties
      }
    >
      {/* Vídeo de fondo: detrás de todo el contenido, sin overlays de degradado. */}
      <video
        ref={videoRef}
        className="absolute inset-0 h-full w-full object-cover opacity-0"
        src={VIDEO_SRC}
        muted
        playsInline
        autoPlay
        preload="auto"
      />

      {/* Contenido del hero, por encima del vídeo. */}
      <div className="relative z-10">
        <section className="relative flex min-h-screen flex-col overflow-visible">
          {/* Forma borrosa centrada que oscurece el centro tras el contenido. */}
          <div
            aria-hidden
            className="pointer-events-none absolute top-1/2 left-1/2 h-[527px] w-[984px] -translate-x-1/2 -translate-y-1/2 bg-gray-950 opacity-90 blur-[82px]"
          />

          {/* Navbar */}
          <header className="relative z-10">
            <nav className="flex items-center justify-between px-8 py-5">
              <a href="/" className="flex items-center">
                {/* logo.png en la spec; aquí servimos un wordmark SVG. */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/logo.svg" alt="Mindware Nexus" className="h-8 w-auto" />
              </a>

              <div className="hidden items-center gap-8 md:flex">
                {NAV_ITEMS.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    className="text-sm text-foreground/90 transition-colors duration-200 hover:text-foreground"
                  >
                    {item.label}
                  </a>
                ))}
              </div>

              <Button asChild variant="heroSecondary" className="h-auto px-4 py-2">
                <a href="/login">Iniciar sesión</a>
              </Button>
            </nav>

            {/* Línea divisoria con degradado, desplazada 3px bajo el navbar. */}
            <div className="mt-[3px] h-px w-full bg-gradient-to-r from-transparent via-foreground/20 to-transparent" />
          </header>

          {/* Contenido central */}
          <div className="relative z-10 flex flex-1 items-center justify-center px-8">
            <div className="flex flex-col items-center text-center">
              <h1 className="font-[family-name:var(--font-general-sans)] text-[clamp(3.25rem,13vw,220px)] leading-[1.02] font-normal tracking-[-0.024em] text-foreground">
                Vende con{' '}
                <span
                  className="bg-clip-text text-transparent"
                  style={{
                    backgroundImage:
                      'linear-gradient(to left, #6366f1, #a855f7, #fcd34d)',
                  }}
                >
                  IA
                </span>
              </h1>

              <p className="mt-[9px] max-w-md text-lg leading-8 text-hero-sub opacity-80">
                El chatbot con IA que conversa, califica y convierte a tus
                visitantes en clientes. Activo 24/7, entrenado en tu negocio.
              </p>

              <Button
                asChild
                variant="heroSecondary"
                className="mt-[25px] h-auto px-[29px] py-[24px]"
              >
                <a href="/login">Empieza gratis</a>
              </Button>
            </div>
          </div>

          {/* Marquee de logos, anclado al fondo del hero */}
          <div className="relative z-10 pb-10">
            <div className="mx-auto flex max-w-5xl items-center gap-12 px-8">
              <p className="shrink-0 text-sm text-foreground/50">
                La eligen marcas
                <br />
                de todo el mundo
              </p>

              <div className="relative flex-1 overflow-hidden">
                <div className="flex w-max animate-marquee-hero">
                  {[0, 1].map((copy) => (
                    <ul
                      key={copy}
                      aria-hidden={copy === 1}
                      className="flex shrink-0 items-center gap-16 pr-16"
                    >
                      {BRANDS.map((brand) => (
                        <li
                          key={brand}
                          className="flex shrink-0 items-center gap-3"
                        >
                          <span className="liquid-glass grid size-6 place-items-center rounded-lg text-xs font-semibold text-foreground">
                            {brand[0]}
                          </span>
                          <span className="text-base font-semibold text-foreground">
                            {brand}
                          </span>
                        </li>
                      ))}
                    </ul>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
