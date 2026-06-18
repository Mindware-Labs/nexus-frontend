import Link from 'next/link'

const COLUMNS = [
  {
    title: 'Producto',
    links: [
      { label: 'Cómo funciona', href: '#como-funciona' },
      { label: 'Plataforma', href: '#plataforma' },
      { label: 'Planes', href: '#planes' },
      { label: 'Historias', href: '#historias' },
    ],
  },
  {
    title: 'Empresa',
    links: [
      { label: 'Iniciar sesión', href: '/login' },
      { label: 'Privacidad', href: '/privacidad' },
    ],
  },
]

export function SiteFooter() {
  return (
    <footer className="relative border-t border-foreground/10 px-6 pt-20 pb-10">
      <div className="mx-auto grid max-w-6xl gap-12 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="grid size-7 place-items-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500">
              <span className="text-sm font-semibold text-white">N</span>
            </span>
            <span className="font-[family-name:var(--font-general-sans)] text-lg font-semibold text-foreground">
              Mindware Nexus
            </span>
          </div>
          <p className="mt-5 max-w-xs text-sm leading-7 text-foreground/50">
            Chatbots con IA que conversan, califican y convierten visitantes en
            clientes. Instálalo en tu web en minutos.
          </p>
        </div>

        {COLUMNS.map((col) => (
          <div key={col.title}>
            <h3 className="text-sm font-semibold text-foreground/80">
              {col.title}
            </h3>
            <ul className="mt-5 flex flex-col gap-3">
              {col.links.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-foreground/50 transition-colors duration-200 hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="mx-auto mt-16 flex max-w-6xl flex-col items-center justify-between gap-4 border-t border-foreground/10 pt-8 text-sm text-foreground/40 sm:flex-row">
        <p>© {new Date().getFullYear()} Mindware Labs. Todos los derechos reservados.</p>
        <p>Hecho con IA, para vender más.</p>
      </div>
    </footer>
  )
}
