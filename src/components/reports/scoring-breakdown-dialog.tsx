'use client'
import { useState } from 'react'
import { BarChart3, CheckCircle2, XCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import type { ScoringBreakdownItem } from '@/app/actions/reports'

interface ScoringBreakdownDialogProps {
  breakdown: ScoringBreakdownItem[]
  score: number
  classification: string | null
  leadName?: string | null
}

const CLASS_STYLES: Record<string, { bar: string; badge: string; text: string }> = {
  Alta:  { bar: 'bg-green-500',  badge: 'bg-green-50 border-green-200 text-green-700 dark:bg-green-950/30 dark:border-green-800 dark:text-green-400',  text: 'text-green-700 dark:text-green-400' },
  Media: { bar: 'bg-amber-400',  badge: 'bg-amber-50 border-amber-200 text-amber-700 dark:bg-amber-950/30 dark:border-amber-800 dark:text-amber-400',  text: 'text-amber-700 dark:text-amber-400' },
  Baja:  { bar: 'bg-red-400',    badge: 'bg-red-50 border-red-200 text-red-700 dark:bg-red-950/30 dark:border-red-800 dark:text-red-400',              text: 'text-red-700 dark:text-red-400' },
}

export function ScoringBreakdownDialog({
  breakdown,
  score,
  classification,
  leadName,
}: ScoringBreakdownDialogProps) {
  const [open, setOpen] = useState(false)
  const total = breakdown.reduce((s, i) => s + i.maxScore, 0)
  const style = classification ? CLASS_STYLES[classification] ?? CLASS_STYLES['Baja'] : CLASS_STYLES['Baja']
  const metCount = breakdown.filter((i) => i.met).length

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-7 gap-1.5 text-xs text-nexus-purple hover:text-nexus-purple hover:bg-nexus-lilac"
        >
          <BarChart3 className="size-3" />
          Ver rúbrica
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-base">
            Calificación{leadName ? ` — ${leadName}` : ''}
          </DialogTitle>
        </DialogHeader>

        {/* Score header */}
        <div className="flex items-center justify-between rounded-xl border bg-muted/30 px-4 py-3">
          <div>
            <p className="text-xs text-muted-foreground">Score total</p>
            <p className="text-3xl font-bold tracking-tight text-foreground">
              {score}
              <span className="text-base font-normal text-muted-foreground">/{total}</span>
            </p>
          </div>
          <div className="text-right">
            <span className={`inline-flex items-center rounded-full border px-3 py-1 text-sm font-semibold ${style.badge}`}>
              {classification ?? '—'}
            </span>
            <p className="mt-1 text-xs text-muted-foreground">
              {metCount}/{breakdown.length} criterios cumplidos
            </p>
          </div>
        </div>

        {/* Score bar */}
        <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
          <div
            className={`h-full rounded-full transition-all ${style.bar}`}
            style={{ width: `${total > 0 ? Math.round((score / total) * 100) : 0}%` }}
          />
        </div>

        {/* Criteria list */}
        <div className="space-y-3 pt-1">
          {breakdown.map((item, i) => {
            const pct = item.maxScore > 0 ? Math.round((item.earned / item.maxScore) * 100) : 0
            return (
              <div key={i} className="space-y-1.5">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    {item.met
                      ? <CheckCircle2 className="size-4 shrink-0 text-green-500" />
                      : <XCircle className="size-4 shrink-0 text-red-400" />
                    }
                    <span className="text-sm font-medium text-foreground truncate">{item.criterion}</span>
                  </div>
                  <span className={`shrink-0 text-sm font-semibold tabular-nums ${item.met ? 'text-green-600 dark:text-green-400' : 'text-muted-foreground'}`}>
                    {item.earned}/{item.maxScore}
                  </span>
                </div>
                {/* Progress bar per criterion */}
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className={`h-full rounded-full ${item.met ? 'bg-green-500' : 'bg-muted-foreground/30'}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
                {/* Evidence */}
                <p className="pl-6 text-xs text-muted-foreground leading-relaxed">{item.evidence}</p>
              </div>
            )
          })}
        </div>
      </DialogContent>
    </Dialog>
  )
}
