import { Sparkles } from "lucide-react";
import Link from "next/link";

const columns = [
  {
    title: "Producto",
    links: [
      { label: "Cómo funciona", href: "#como-funciona" },
      { label: "Casos de uso", href: "#casos-de-uso" },
      { label: "Demo en vivo", href: "#demo" },
      { label: "Planes y precios", href: "#precios" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Términos de uso", href: "/terminos" },
      { label: "Política de privacidad", href: "/privacidad" },
    ],
  },
  {
    title: "Contacto",
    links: [
      { label: "labsmindware@gmail.com", href: "mailto:labsmindware@gmail.com" },
      { label: "Solicitar acceso", href: "#contacto" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="relative isolate overflow-hidden bg-nexus-deep">
      {/* Hairline superior + resplandor púrpura desde la base */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 h-px w-2/3 -translate-x-1/2 bg-gradient-to-r from-transparent via-nexus-lavender/40 to-transparent" />
        <div className="absolute -bottom-44 left-1/2 size-[32rem] -translate-x-1/2 rounded-full bg-nexus-purple/35 blur-[130px]" />
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(173,116,195,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(173,116,195,0.5) 1px, transparent 1px)",
            backgroundSize: "72px 72px",
            maskImage:
              "radial-gradient(ellipse 70% 90% at 50% 100%, black, transparent)",
          }}
        />
      </div>

      <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div>
            <Link href="#" className="inline-flex items-center gap-2.5">
              <span className="grid size-8 place-items-center rounded-xl bg-gradient-to-br from-nexus-purple to-nexus-lavender shadow-lg shadow-nexus-purple/30">
                <Sparkles className="size-4 text-white" />
              </span>
              <span className="text-[15px] font-semibold tracking-tight text-white">
                Mindware <span className="text-nexus-lavender">Nexus</span>
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/50">
              La plataforma de chatbots con IA que convierte las visitas de tu
              web en leads calificados, 24 horas al día.
            </p>
            <p className="mt-5 inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1.5 text-xs text-white/55 ring-1 ring-white/10">
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full rounded-full bg-nexus-mint/50 motion-safe:animate-ping" />
                <span className="relative inline-flex size-2 rounded-full bg-nexus-mint" />
              </span>
              Todos los sistemas operativos
            </p>
          </div>

          {columns.map((col) => (
            <nav key={col.title} aria-label={col.title}>
              <h4 className="text-xs font-medium uppercase tracking-[0.18em] text-nexus-lavender">
                {col.title}
              </h4>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="group inline-flex items-center gap-1.5 text-sm text-white/60 transition-colors duration-200 hover:text-white"
                    >
                      <span
                        aria-hidden
                        className="h-px w-0 bg-nexus-lavender transition-all duration-300 group-hover:w-3"
                      />
                      <span className="-translate-x-0 transition-transform duration-300 group-hover:translate-x-0.5">
                        {link.label}
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-7 sm:flex-row">
          <p className="text-xs text-white/40">
            © {new Date().getFullYear()} Mindware Labs. Todos los derechos
            reservados.
          </p>
          <p className="text-xs text-white/40">
            Hecho con{" "}
            <span className="font-medium text-nexus-lavender">Nexus</span> — IA
            conversacional multi-tenant.
          </p>
        </div>
      </div>
    </footer>
  );
}
