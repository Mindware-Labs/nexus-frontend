'use client'

import { useState, useTransition } from 'react'
import { Tag, Brain, Loader2, RefreshCw, MessageSquare, TrendingUp, SmilePlus, Minus, Frown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { triggerTopicBatch } from '@/app/actions/reports'
import type { TopicsReport } from '@/app/actions/reports'

interface Props {
  topics: TopicsReport
}

const INTENT_LABELS: Record<string, string> = {
  compra: 'Compra',
  soporte: 'Soporte',
  información: 'Información',
  cotización: 'Cotización',
  queja: 'Queja',
  otro: 'Otro',
}

const INTENT_COLORS: Record<string, string> = {
  compra: 'bg-nexus-mint/15 text-emerald-700 border-nexus-mint/30',
  soporte: 'bg-blue-50 text-blue-700 border-blue-200',
  información: 'bg-nexus-lavender/15 text-nexus-purple border-nexus-lavender/30',
  cotización: 'bg-amber-50 text-amber-700 border-amber-200',
  queja: 'bg-nexus-coral/10 text-red-600 border-nexus-coral/30',
  otro: 'bg-muted text-muted-foreground border-border',
}

function SentimentBar({ positive, neutral, negative }: { positive: number; neutral: number; negative: number }) {
  const total = positive + neutral + negative
  if (total === 0) return <p className="text-xs text-muted-foreground">Sin datos</p>
  const pPct = Math.round((positive / total) * 100)
  const nePct = Math.round((neutral / total) * 100)
  const negPct = 100 - pPct - nePct

  return (
    <div className="space-y-2">
      <div className="flex h-3 w-full overflow-hidden rounded-full">
        {pPct > 0 && <div className="bg-nexus-mint" style={{ width: `${pPct}%` }} />}
        {nePct > 0 && <div className="bg-muted-foreground/30" style={{ width: `${nePct}%` }} />}
        {negPct > 0 && <div className="bg-nexus-coral" style={{ width: `${negPct}%` }} />}
      </div>
      <div className="flex gap-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <SmilePlus className="size-3 text-nexus-mint" /> Positivo {pPct}%
        </span>
        <span className="flex items-center gap-1">
          <Minus className="size-3" /> Neutral {nePct}%
        </span>
        <span className="flex items-center gap-1">
          <Frown className="size-3 text-nexus-coral" /> Negativo {negPct}%
        </span>
      </div>
    </div>
  )
}

export function TopicsPanel({ topics }: Props) {
  const [isPending, startTransition] = useTransition()
  const [batchTriggered, setBatchTriggered] = useState(false)

  function handleRunBatch() {
    startTransition(async () => {
      await triggerTopicBatch()
      setBatchTriggered(true)
    })
  }

  const hasAiData = topics.totalAnalyzed > 0

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* REP-12 — Keyword frequency */}
      <div className="rounded-xl border bg-card p-5">
        <div className="mb-4 flex items-center gap-2">
          <Tag className="size-4 text-nexus-purple" />
          <div>
            <h3 className="text-sm font-semibold text-foreground">Palabras clave frecuentes</h3>
            <p className="text-xs text-muted-foreground">
              Extraídas de los resúmenes de leads · REP-12
            </p>
          </div>
        </div>

        {topics.topKeywords.length === 0 ? (
          <p className="py-6 text-center text-sm text-muted-foreground">
            Sin leads en este período
          </p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {topics.topKeywords.map(({ word, count }) => {
              const maxCount = topics.topKeywords[0]?.count ?? 1
              const weight = count / maxCount
              const size = weight > 0.7 ? 'text-base font-semibold' : weight > 0.4 ? 'text-sm font-medium' : 'text-xs'
              const opacity = weight > 0.6 ? 'opacity-100' : weight > 0.3 ? 'opacity-70' : 'opacity-50'
              return (
                <span
                  key={word}
                  className={`inline-flex items-center gap-1 rounded-full border bg-nexus-purple/5 px-2.5 py-1 text-nexus-purple ${size} ${opacity}`}
                  title={`${count} aparición${count !== 1 ? 'es' : ''}`}
                >
                  {word}
                  <span className="text-[10px] text-nexus-lavender">{count}</span>
                </span>
              )
            })}
          </div>
        )}
      </div>

      {/* REP-14 — AI topics + sentiment */}
      <div className="rounded-xl border bg-card p-5 flex flex-col gap-5">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <Brain className="size-4 text-nexus-purple" />
            <div>
              <h3 className="text-sm font-semibold text-foreground">Análisis IA de temas</h3>
              <p className="text-xs text-muted-foreground">
                {topics.totalAnalyzed} leads analizados
                {topics.pendingAnalysis > 0 && ` · ${topics.pendingAnalysis} pendientes`}
                {' · REP-14'}
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="shrink-0 h-7 text-xs"
            onClick={handleRunBatch}
            disabled={isPending || batchTriggered}
          >
            {isPending ? (
              <Loader2 className="size-3 animate-spin" />
            ) : (
              <RefreshCw className="size-3" />
            )}
            {batchTriggered ? 'Procesando…' : 'Analizar'}
          </Button>
        </div>

        {!hasAiData ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-2 py-4 text-center">
            <Brain className="size-8 text-muted-foreground/30" />
            <p className="text-sm text-muted-foreground">Sin análisis IA todavía</p>
            <p className="text-xs text-muted-foreground/70">
              Haz clic en &ldquo;Analizar&rdquo; para procesar las conversaciones con Gemini
            </p>
          </div>
        ) : (
          <>
            {/* AI topic tags */}
            {topics.aiTopics.length > 0 && (
              <div>
                <p className="mb-2 text-xs font-medium text-muted-foreground flex items-center gap-1">
                  <TrendingUp className="size-3" /> Temas más frecuentes
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {topics.aiTopics.map(({ topic, count }) => (
                    <Badge
                      key={topic}
                      variant="outline"
                      className="text-xs bg-nexus-lavender/10 border-nexus-lavender/30 text-nexus-purple"
                    >
                      {topic}
                      <span className="ml-1 text-[10px] opacity-60">{count}</span>
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Intents */}
            {topics.intents.length > 0 && (
              <div>
                <p className="mb-2 text-xs font-medium text-muted-foreground flex items-center gap-1">
                  <MessageSquare className="size-3" /> Intención del usuario
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {topics.intents.map(({ intent, count }) => (
                    <span
                      key={intent}
                      className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium ${INTENT_COLORS[intent] ?? INTENT_COLORS.otro}`}
                    >
                      {INTENT_LABELS[intent] ?? intent}
                      <span className="opacity-60">{count}</span>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Sentiment bar */}
            <div>
              <p className="mb-2 text-xs font-medium text-muted-foreground">Sentimiento general</p>
              <SentimentBar {...topics.sentiments} />
            </div>
          </>
        )}
      </div>
    </div>
  )
}
