'use client'

import Link from 'next/link'

export function SiteFooter() {
  return (
    <footer className="relative overflow-hidden border-t border-white/5 bg-[#020202] pt-20 pb-12">
      
      {/* Background ambient */}
      <div className="absolute inset-0 z-0 pointer-events-none flex justify-center">
        <div className="absolute bottom-[-20%] h-[300px] w-[800px] rounded-full bg-nexus-lavender/5 blur-[120px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 md:px-12">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          
          {/* Brand Col */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-block text-xl font-bold tracking-[0.2em] text-white uppercase transition-opacity hover:opacity-80">
              MINDWARE <span className="text-nexus-lavender">NEXUS</span>
            </Link>
            <p className="mt-6 max-w-sm text-sm leading-relaxed text-white/50">
              Plataforma conversacional autónoma para captar, calificar y organizar oportunidades comerciales sin fricción.
            </p>
            <div className="mt-8 flex items-center gap-3">
               <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/5 border border-white/10 shadow-inner">
                 <div className="h-2 w-2 rounded-full bg-nexus-mint shadow-[0_0_8px_#10b981] animate-pulse" />
               </div>
               <span className="text-[11px] font-medium text-white/60 tracking-[0.2em] uppercase">Sistemas Operativos</span>
            </div>
          </div>

          {/* Links Col 1 */}
          <div>
            <h4 className="text-[11px] font-bold tracking-[0.25em] text-white uppercase mb-6 opacity-90">Plataforma</h4>
            <ul className="flex flex-col gap-4 text-sm text-white/50">
              <li><Link href="/login" className="hover:text-nexus-lavender transition-colors">Iniciar sesión</Link></li>
              <li><a href="#how-it-works" className="hover:text-nexus-lavender transition-colors">Flujo operativo</a></li>
              <li><a href="#use-cases" className="hover:text-nexus-lavender transition-colors">Casos de uso</a></li>
              <li><a href="#pricing" className="hover:text-nexus-lavender transition-colors">Planes</a></li>
            </ul>
          </div>

          {/* Links Col 2 */}
          <div>
            <h4 className="text-[11px] font-bold tracking-[0.25em] text-white uppercase mb-6 opacity-90">Compañía</h4>
            <ul className="flex flex-col gap-4 text-sm text-white/50">
              <li><Link href="/privacidad" className="hover:text-nexus-lavender transition-colors">Política de Privacidad</Link></li>
              <li><a href="mailto:labsmindware@gmail.com" className="hover:text-nexus-lavender transition-colors">Contacto</a></li>
            </ul>
          </div>
          
        </div>

        {/* Bottom separator */}
        <div className="mt-20 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/40">
            Copyright © {new Date().getFullYear()} Mindware Labs. Todos los derechos reservados.
          </p>
          <div className="text-[10px] font-mono tracking-widest text-white/30 uppercase">
            Sistema En Línea — RD-SDQ-01
          </div>
        </div>

      </div>

      {/* Giant Background Text */}
      <div className="pointer-events-none absolute bottom-[-4rem] md:bottom-[-6rem] left-1/2 -translate-x-1/2 w-full overflow-hidden flex justify-center opacity-[0.015] mix-blend-screen select-none">
        <span className="text-[18vw] font-bold leading-none tracking-tighter whitespace-nowrap text-white">
          NEXUS
        </span>
      </div>
    </footer>
  )
}
