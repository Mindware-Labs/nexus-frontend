'use client'

import { useState } from 'react'
import { Check, Copy } from 'lucide-react'

export function CopySnippet({ snippet }: { snippet: string }) {
  const [copied, setCopied] = useState(false)

  async function copy() {
    try {
      await navigator.clipboard.writeText(snippet)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      /* noop */
    }
  }

  return (
    <div className="space-y-3">
      <div className="relative">
        <pre className="max-h-56 overflow-auto rounded-lg border bg-muted/50 p-3 pr-12 text-xs leading-relaxed text-foreground">
          <code>{snippet}</code>
        </pre>
        <button
          type="button"
          onClick={copy}
          className="absolute right-2 top-2 inline-flex items-center gap-1.5 rounded-lg border bg-background px-2.5 py-1.5 text-xs font-medium shadow-sm hover:bg-muted"
        >
          {copied ? <Check className="size-3.5 text-emerald-600" /> : <Copy className="size-3.5" />}
          {copied ? 'Copiado' : 'Copiar'}
        </button>
      </div>
    </div>
  )
}

// CUS-12: instrucciones paso a paso por plataforma.
const PLATFORMS = [
  {
    name: 'HTML / sitio propio',
    steps: ['Abre el archivo HTML de tu sitio.', 'Pega el código justo antes de la etiqueta </body>.', 'Guarda y publica los cambios.'],
  },
  {
    name: 'WordPress',
    steps: ['Ve a Apariencia → Editor de tema o usa un plugin como "Insert Headers and Footers".', 'Pega el código en la sección del footer.', 'Guarda los cambios.'],
  },
  {
    name: 'Shopify',
    steps: ['Entra a Tienda online → Temas → Editar código.', 'Abre theme.liquid y pega el código antes de </body>.', 'Guarda.'],
  },
  {
    name: 'Wix / Squarespace',
    steps: ['Busca la opción de "Código personalizado" o "Embed HTML" en la configuración del sitio.', 'Pega el código en el footer del sitio.', 'Publica.'],
  },
]

export function InstallInstructions() {
  const [active, setActive] = useState(0)
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {PLATFORMS.map((p, i) => (
          <button
            key={p.name}
            onClick={() => setActive(i)}
            className={[
              'rounded-lg px-3 py-1.5 text-xs font-medium transition-colors',
              active === i ? 'bg-nexus-purple text-white' : 'border bg-background text-muted-foreground hover:text-foreground',
            ].join(' ')}
          >
            {p.name}
          </button>
        ))}
      </div>
      <ol className="list-decimal space-y-1.5 pl-5 text-sm text-muted-foreground">
        {PLATFORMS[active].steps.map((s, i) => (
          <li key={i}>{s}</li>
        ))}
      </ol>
    </div>
  )
}
