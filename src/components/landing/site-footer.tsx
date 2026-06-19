'use client'

import Link from 'next/link'

export function SiteFooter() {
  return (
    <footer className="relative border-t border-white/10 bg-black py-12">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="text-sm font-semibold tracking-[0.22em] text-nexus-lavender uppercase">
            Nexus
          </div>
          <p className="mt-4 max-w-sm text-sm leading-7 text-white/48">
            Plataforma conversacional de Mindware Labs para captar, calificar y ordenar oportunidades comerciales.
          </p>
        </div>

        <div className="flex flex-col gap-3 text-sm text-white/52 md:items-end">
          <Link href="/privacidad" className="transition-colors hover:text-white">
            Politica de privacidad
          </Link>
          <Link href="/login" className="transition-colors hover:text-white">
            Acceso a la plataforma
          </Link>
          <a href="mailto:labsmindware@gmail.com" className="transition-colors hover:text-white">
            labsmindware@gmail.com
          </a>
          <p className="pt-2 text-xs text-white/28">
            Copyright © {new Date().getFullYear()} Mindware Nexus.
          </p>
        </div>
      </div>
    </footer>
  )
}
