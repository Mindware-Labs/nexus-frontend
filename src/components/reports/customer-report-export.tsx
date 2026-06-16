'use client'

import { useState } from 'react'
import Link from 'next/link'
import { FileSpreadsheet, FileText, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { getCustomerReports, type Period, type CustomerReports } from '@/app/actions/reports'

interface Props {
  customerId: number
  customerName: string
  period: Period
  periodLabel: string
}

function slugify(name: string) {
  return name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
}

async function buildExcel(reports: CustomerReports, periodLabel: string, filename: string) {
  const XLSX = await import('xlsx')
  const wb = XLSX.utils.book_new()

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

  if (reports.trend.length > 0) {
    const wsTrend = XLSX.utils.json_to_sheet(
      reports.trend.map((t) => ({ Fecha: t.date, Conversaciones: t.conversations, Leads: t.leads })),
    )
    wsTrend['!cols'] = [{ wch: 14 }, { wch: 16 }, { wch: 10 }]
    XLSX.utils.book_append_sheet(wb, wsTrend, 'Tendencia')
  }

  if (reports.modelsUsed.length > 0) {
    const wsModels = XLSX.utils.json_to_sheet(
      reports.modelsUsed.map((m) => ({ Modelo: m.model, Turnos: m.count, Tokens: m.tokens })),
    )
    wsModels['!cols'] = [{ wch: 30 }, { wch: 10 }, { wch: 12 }]
    XLSX.utils.book_append_sheet(wb, wsModels, 'Modelos')
  }

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
    wsLeads['!cols'] = [{ wch: 22 }, { wch: 28 }, { wch: 15 }, { wch: 20 }, { wch: 40 }, { wch: 20 }]
    XLSX.utils.book_append_sheet(wb, wsLeads, 'Leads')
  }

  XLSX.writeFile(wb, filename)
}

async function buildPdf(reports: CustomerReports, periodLabel: string, filename: string) {
  const { default: jsPDF } = await import('jspdf')
  const { default: autoTable } = await import('jspdf-autotable')

  const PURPLE: [number, number, number] = [82, 37, 102]
  const PURPLE_LIGHT: [number, number, number] = [248, 244, 252]
  const GRAY: [number, number, number] = [100, 100, 100]

  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })

  doc.setFillColor(...PURPLE)
  doc.rect(0, 0, 210, 24, 'F')
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(13)
  doc.setFont('helvetica', 'bold')
  doc.text('Mindware Nexus — Reporte de Cliente', 14, 10)
  doc.setFontSize(8)
  doc.setFont('helvetica', 'normal')
  doc.text(`${reports.customerName}  ·  ${reports.customerEmail}`, 14, 17)
  doc.text(`Generado: ${new Date().toLocaleDateString('es-MX')}`, 196, 17, { align: 'right' })

  let y = 32
  doc.setTextColor(...GRAY)
  doc.setFontSize(8)
  doc.text(`Período: ${periodLabel}`, 14, y)
  if (reports.lastActivity) {
    doc.text(`Último acceso: ${new Date(reports.lastActivity).toLocaleString('es-MX')}`, 80, y)
  }
  y += 10

  const sectionTitle = (label: string) => {
    if (y > 255) { doc.addPage(); y = 14 }
    doc.setTextColor(...PURPLE)
    doc.setFontSize(10)
    doc.setFont('helvetica', 'bold')
    doc.text(label, 14, y)
    y += 3
  }

  sectionTitle('Resumen del período')
  autoTable(doc, {
    startY: y,
    head: [['Métrica', 'Valor']],
    body: [
      ['Conversaciones', reports.conversations.toLocaleString('es-MX')],
      ['Leads capturados', reports.leads.toLocaleString('es-MX')],
      ['Tasa de conversión', `${reports.conversionRate}%`],
      ['Tokens totales', reports.totalTokens.toLocaleString('es-MX')],
      ['  › Entrada (prompt)', reports.promptTokens.toLocaleString('es-MX')],
      ['  › Salida (completion)', reports.completionTokens.toLocaleString('es-MX')],
      ['Costo estimado', `$${reports.estimatedCostUsd.toFixed(4)} USD`],
    ],
    headStyles: { fillColor: PURPLE, fontStyle: 'bold', fontSize: 8 },
    bodyStyles: { fontSize: 8 },
    alternateRowStyles: { fillColor: PURPLE_LIGHT },
    columnStyles: { 0: { fontStyle: 'bold', cellWidth: 65 }, 1: { cellWidth: 45 } },
    margin: { left: 14 },
    tableWidth: 110,
  })
  y = (doc as { lastAutoTable?: { finalY: number } }).lastAutoTable?.finalY ?? y
  y += 10

  if (reports.modelsUsed.length > 0) {
    sectionTitle('Modelos utilizados')
    autoTable(doc, {
      startY: y,
      head: [['Modelo', 'Turnos', 'Tokens']],
      body: reports.modelsUsed.map((m) => [m.model, m.count.toLocaleString('es-MX'), m.tokens.toLocaleString('es-MX')]),
      headStyles: { fillColor: PURPLE, fontStyle: 'bold', fontSize: 8 },
      bodyStyles: { fontSize: 8 },
      alternateRowStyles: { fillColor: PURPLE_LIGHT },
      columnStyles: { 0: { cellWidth: 80 }, 1: { cellWidth: 20 }, 2: { cellWidth: 25 } },
      margin: { left: 14 },
      tableWidth: 125,
    })
    y = (doc as { lastAutoTable?: { finalY: number } }).lastAutoTable?.finalY ?? y
    y += 10
  }

  if (reports.trend.length > 0) {
    sectionTitle('Tendencia de uso')
    autoTable(doc, {
      startY: y,
      head: [['Fecha', 'Conversaciones', 'Leads']],
      body: reports.trend.map((t) => [t.date, t.conversations.toLocaleString('es-MX'), t.leads.toLocaleString('es-MX')]),
      headStyles: { fillColor: PURPLE, fontStyle: 'bold', fontSize: 8 },
      bodyStyles: { fontSize: 8 },
      alternateRowStyles: { fillColor: PURPLE_LIGHT },
      columnStyles: { 0: { cellWidth: 28 }, 1: { cellWidth: 32 }, 2: { cellWidth: 20 } },
      margin: { left: 14 },
      tableWidth: 80,
    })
    y = (doc as { lastAutoTable?: { finalY: number } }).lastAutoTable?.finalY ?? y
    y += 10
  }

  if (reports.leadsList.length > 0) {
    sectionTitle('Leads capturados')
    autoTable(doc, {
      startY: y,
      head: [['Nombre', 'Email', 'Teléfono', 'Empresa', 'Fecha']],
      body: reports.leadsList.map((l) => [
        l.name ?? '—', l.email ?? '—', l.phone ?? '—', l.company ?? '—',
        new Date(l.created_at).toLocaleDateString('es-MX'),
      ]),
      headStyles: { fillColor: PURPLE, fontStyle: 'bold', fontSize: 7 },
      bodyStyles: { fontSize: 7 },
      alternateRowStyles: { fillColor: PURPLE_LIGHT },
      columnStyles: { 0: { cellWidth: 35 }, 1: { cellWidth: 45 }, 2: { cellWidth: 25 }, 3: { cellWidth: 30 }, 4: { cellWidth: 22 } },
      margin: { left: 14, right: 14 },
    })
  }

  const pageCount = doc.getNumberOfPages()
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i)
    doc.setFontSize(7)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(160, 160, 160)
    doc.text(
      `Mindware Nexus  ·  ${reports.customerName}  ·  Página ${i} de ${pageCount}`,
      14,
      doc.internal.pageSize.height - 6,
    )
  }

  doc.save(filename)
}

export function CustomerReportExport({ customerId, customerName, period, periodLabel }: Props) {
  const [loading, setLoading] = useState<'excel' | 'pdf' | null>(null)
  const slug = slugify(customerName)

  async function handleExcel() {
    setLoading('excel')
    try {
      const reports = await getCustomerReports(customerId, period)
      await buildExcel(reports, periodLabel, `reporte-${slug}-${period}.xlsx`)
    } catch {
      // silently ignore — user will retry
    } finally {
      setLoading(null)
    }
  }

  async function handlePdf() {
    setLoading('pdf')
    try {
      const reports = await getCustomerReports(customerId, period)
      await buildPdf(reports, periodLabel, `reporte-${slug}-${period}.pdf`)
    } catch {
      // silently ignore — user will retry
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="flex items-center gap-0.5">
      <Button
        variant="ghost"
        size="icon"
        className="size-7"
        title="Descargar Excel"
        onClick={handleExcel}
        disabled={loading !== null}
      >
        {loading === 'excel' ? (
          <Loader2 className="size-3.5 animate-spin text-muted-foreground" />
        ) : (
          <FileSpreadsheet className="size-3.5 text-emerald-600" />
        )}
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="size-7"
        title="Descargar PDF"
        onClick={handlePdf}
        disabled={loading !== null}
      >
        {loading === 'pdf' ? (
          <Loader2 className="size-3.5 animate-spin text-muted-foreground" />
        ) : (
          <FileText className="size-3.5 text-red-500" />
        )}
      </Button>
      <Link
        href={`/dashboard/customers/${customerId}?period=${period}`}
        className="ml-1 text-xs text-nexus-purple hover:underline"
      >
        Ver
      </Link>
    </div>
  )
}
