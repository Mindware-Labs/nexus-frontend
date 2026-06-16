'use client'

import { FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { CustomerReports } from '@/app/actions/reports'

interface Props {
  reports: CustomerReports
  periodLabel: string
  filename: string
}

const PURPLE: [number, number, number] = [82, 37, 102]
const PURPLE_LIGHT: [number, number, number] = [248, 244, 252]
const GRAY: [number, number, number] = [100, 100, 100]

export function PdfExportButton({ reports, periodLabel, filename }: Props) {
  async function handleExport() {
    const { default: jsPDF } = await import('jspdf')
    const { default: autoTable } = await import('jspdf-autotable')

    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })

    // ── Header bar ──────────────────────────────────────────────────────
    doc.setFillColor(...PURPLE)
    doc.rect(0, 0, 210, 24, 'F')

    doc.setTextColor(255, 255, 255)
    doc.setFontSize(13)
    doc.setFont('helvetica', 'bold')
    doc.text('Mindware Nexus — Reporte de Cliente', 14, 10)
    doc.setFontSize(8)
    doc.setFont('helvetica', 'normal')
    doc.text(`${reports.customerName}  ·  ${reports.customerEmail}`, 14, 17)
    doc.text(
      `Generado: ${new Date().toLocaleDateString('es-MX')}`,
      196,
      17,
      { align: 'right' },
    )

    let y = 32

    // ── Meta info ────────────────────────────────────────────────────────
    doc.setTextColor(...GRAY)
    doc.setFontSize(8)
    doc.text(`Período: ${periodLabel}`, 14, y)
    if (reports.lastActivity) {
      doc.text(
        `Último acceso: ${new Date(reports.lastActivity).toLocaleString('es-MX')}`,
        80,
        y,
      )
    }
    y += 10

    // ── Resumen ──────────────────────────────────────────────────────────
    doc.setTextColor(...PURPLE)
    doc.setFontSize(10)
    doc.setFont('helvetica', 'bold')
    doc.text('Resumen del período', 14, y)
    y += 3

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

    // ── Modelos utilizados ───────────────────────────────────────────────
    if (reports.modelsUsed.length > 0) {
      if (y > 255) { doc.addPage(); y = 14 }

      doc.setTextColor(...PURPLE)
      doc.setFontSize(10)
      doc.setFont('helvetica', 'bold')
      doc.text('Modelos utilizados', 14, y)
      y += 3

      autoTable(doc, {
        startY: y,
        head: [['Modelo', 'Turnos', 'Tokens']],
        body: reports.modelsUsed.map((m) => [
          m.model,
          m.count.toLocaleString('es-MX'),
          m.tokens.toLocaleString('es-MX'),
        ]),
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

    // ── Tendencia ────────────────────────────────────────────────────────
    if (reports.trend.length > 0) {
      if (y > 245) { doc.addPage(); y = 14 }

      doc.setTextColor(...PURPLE)
      doc.setFontSize(10)
      doc.setFont('helvetica', 'bold')
      doc.text('Tendencia de uso', 14, y)
      y += 3

      autoTable(doc, {
        startY: y,
        head: [['Fecha', 'Conversaciones', 'Leads']],
        body: reports.trend.map((t) => [
          t.date,
          t.conversations.toLocaleString('es-MX'),
          t.leads.toLocaleString('es-MX'),
        ]),
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

    // ── Leads ─────────────────────────────────────────────────────────────
    if (reports.leadsList.length > 0) {
      if (y > 245) { doc.addPage(); y = 14 }

      doc.setTextColor(...PURPLE)
      doc.setFontSize(10)
      doc.setFont('helvetica', 'bold')
      doc.text('Leads capturados', 14, y)
      y += 3

      autoTable(doc, {
        startY: y,
        head: [['Nombre', 'Email', 'Teléfono', 'Empresa', 'Fecha']],
        body: reports.leadsList.map((l) => [
          l.name ?? '—',
          l.email ?? '—',
          l.phone ?? '—',
          l.company ?? '—',
          new Date(l.created_at).toLocaleDateString('es-MX'),
        ]),
        headStyles: { fillColor: PURPLE, fontStyle: 'bold', fontSize: 7 },
        bodyStyles: { fontSize: 7 },
        alternateRowStyles: { fillColor: PURPLE_LIGHT },
        columnStyles: {
          0: { cellWidth: 35 },
          1: { cellWidth: 45 },
          2: { cellWidth: 25 },
          3: { cellWidth: 30 },
          4: { cellWidth: 22 },
        },
        margin: { left: 14, right: 14 },
      })
    }

    // ── Footer en todas las páginas ──────────────────────────────────────
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

  return (
    <Button variant="outline" size="sm" onClick={handleExport}>
      <FileText className="size-4" />
      PDF
    </Button>
  )
}
