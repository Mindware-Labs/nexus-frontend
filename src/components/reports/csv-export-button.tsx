'use client'
import { Download } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface CsvExportButtonProps {
  filename: string
  rows: Record<string, string | number | null | undefined>[]
  label?: string
}

function toCSV(rows: Record<string, string | number | null | undefined>[]): string {
  if (!rows.length) return ''
  const headers = Object.keys(rows[0])
  const escape = (v: string | number | null | undefined) => {
    const s = String(v ?? '')
    return s.includes(',') || s.includes('"') || s.includes('\n')
      ? `"${s.replace(/"/g, '""')}"`
      : s
  }
  return [
    headers.join(','),
    ...rows.map((r) => headers.map((h) => escape(r[h])).join(',')),
  ].join('\n')
}

export function CsvExportButton({ filename, rows, label = 'Exportar CSV' }: CsvExportButtonProps) {
  function download() {
    const csv = toCSV(rows)
    const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <Button variant="outline" size="sm" onClick={download}>
      <Download className="size-4" />
      {label}
    </Button>
  )
}
