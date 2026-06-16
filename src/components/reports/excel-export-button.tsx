'use client'

import { FileSpreadsheet } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { CustomerReports } from '@/app/actions/reports'

interface Props {
  reports: CustomerReports
  periodLabel: string
  filename: string
}

export function ExcelExportButton({ reports, periodLabel, filename }: Props) {
  async function handleExport() {
    const XLSX = await import('xlsx')
    const wb = XLSX.utils.book_new()

    // Sheet 1 — Resumen
    const wsResumen = XLSX.utils.aoa_to_sheet([
      ['Métrica', 'Valor'],
      ['Cliente', reports.customerName],
      ['Email', reports.customerEmail],
      ['Período', periodLabel],
      ['Último acceso', reports.lastActivity ? new Date(reports.lastActivity).toLocaleString('es-MX') : '—'],
      [],
      ['Conversaciones', reports.conversations],
      ['Leads capturados', reports.leads],
      ['Tasa de conversión', `${reports.conversionRate}%`],
      ['Tokens totales', reports.totalTokens],
      ['Tokens entrada (prompt)', reports.promptTokens],
      ['Tokens salida (completion)', reports.completionTokens],
      ['Costo estimado USD', reports.estimatedCostUsd],
    ])
    wsResumen['!cols'] = [{ wch: 30 }, { wch: 30 }]
    XLSX.utils.book_append_sheet(wb, wsResumen, 'Resumen')

    // Sheet 2 — Tendencia
    if (reports.trend.length > 0) {
      const wsTrend = XLSX.utils.json_to_sheet(
        reports.trend.map((t) => ({
          Fecha: t.date,
          Conversaciones: t.conversations,
          Leads: t.leads,
        })),
      )
      wsTrend['!cols'] = [{ wch: 14 }, { wch: 16 }, { wch: 10 }]
      XLSX.utils.book_append_sheet(wb, wsTrend, 'Tendencia')
    }

    // Sheet 3 — Modelos
    if (reports.modelsUsed.length > 0) {
      const wsModels = XLSX.utils.json_to_sheet(
        reports.modelsUsed.map((m) => ({
          Modelo: m.model,
          Turnos: m.count,
          Tokens: m.tokens,
        })),
      )
      wsModels['!cols'] = [{ wch: 30 }, { wch: 10 }, { wch: 12 }]
      XLSX.utils.book_append_sheet(wb, wsModels, 'Modelos')
    }

    // Sheet 4 — Leads
    if (reports.leadsList.length > 0) {
      const wsLeads = XLSX.utils.json_to_sheet(
        reports.leadsList.map((l) => ({
          Nombre: l.name ?? '',
          Email: l.email ?? '',
          Teléfono: l.phone ?? '',
          Empresa: l.company ?? '',
          Resumen: l.summary,
          Fecha: new Date(l.created_at).toLocaleString('es-MX'),
        })),
      )
      wsLeads['!cols'] = [
        { wch: 22 },
        { wch: 28 },
        { wch: 15 },
        { wch: 20 },
        { wch: 40 },
        { wch: 20 },
      ]
      XLSX.utils.book_append_sheet(wb, wsLeads, 'Leads')
    }

    XLSX.writeFile(wb, filename)
  }

  return (
    <Button variant="outline" size="sm" onClick={handleExport}>
      <FileSpreadsheet className="size-4" />
      Excel
    </Button>
  )
}
