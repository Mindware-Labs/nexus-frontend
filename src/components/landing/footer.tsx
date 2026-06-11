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
    <footer className="bg-nexus-deep">
      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div>
            <Link href="#" className="flex items-center gap-2.5">
              <span className="grid size-8 place-items-center rounded-xl bg-gradient-to-br from-nexus-purple to-nexus-lavender">
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
                      className="text-sm text-white/60 transition-colors duration-200 hover:text-white"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 sm:flex-row">
          <p className="text-xs text-white/40">
            © {new Date().getFullYear()} Mindware Labs. Todos los derechos
            reservados.
          </p>
          <p className="text-xs text-white/40">
            Hecho con <span className="text-nexus-lavender">Nexus</span> — IA
            conversacional multi-tenant.
          </p>
        </div>
      </div>
    </footer>
  );
}
