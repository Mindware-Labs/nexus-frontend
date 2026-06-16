'use client'

import { FileSpreadsheet } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { LeadListItem } from '@/app/actions/customer'

const STATUS_LABELS: Record<string, string> = {
  nuevo: 'Nuevo',
  en_proceso: 'En proceso',
  cerrado_ganado: 'Ganado',
  cerrado_perdido: 'Perdido',
}

export function LeadsExportButton({ leads }: { leads: LeadListItem[] }) {
  async function handleExport() {
    const XLSX = await import('xlsx')
    const ws = XLSX.utils.json_to_sheet(
      leads.map((l) => ({
        Nombre: l.name ?? '',
        Email: l.email ?? '',
        Teléfono: l.phone ?? '',
        Empresa: l.company ?? '',
        Estado: STATUS_LABELS[l.status] ?? l.status,
        Score: l.score ?? '',
        Clasificación: l.classification ?? '',
        Resumen: l.summary,
        Fecha: new Date(l.created_at).toLocaleString('es-MX'),
      })),
    )
    ws['!cols'] = [
      { wch: 22 }, { wch: 28 }, { wch: 15 }, { wch: 20 },
      { wch: 12 }, { wch: 8 }, { wch: 12 }, { wch: 40 }, { wch: 20 },
    ]
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Leads')
    XLSX.writeFile(wb, `leads-${new Date().toISOString().split('T')[0]}.xlsx`)
  }

  return (
    <Button variant="outline" size="sm" onClick={handleExport} disabled={leads.length === 0}>
      <FileSpreadsheet className="size-4" />
      Exportar Excel
    </Button>
  )
}
