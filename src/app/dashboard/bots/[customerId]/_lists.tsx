'use client'

import { Minus, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import type { ProductItem, RuleItem, PricingItem, QuestionItem } from './_shared'

// ── Products ──────────────────────────────────────────────────────────────────

export function ProductsList({
  items, onChange,
}: {
  items: ProductItem[]
  onChange: (v: ProductItem[]) => void
}) {
  const add    = () => onChange([...items, { name: '', description: '' }])
  const remove = (i: number) => onChange(items.filter((_, j) => j !== i))
  const update = (i: number, f: keyof ProductItem, v: string) =>
    onChange(items.map((item, j) => j === i ? { ...item, [f]: v } : item))

  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <div key={i} className="grid grid-cols-[1fr_2fr_auto] gap-2 items-start rounded-lg border bg-muted/20 p-3">
          <Input value={item.name} onChange={(e) => update(i, 'name', e.target.value)} placeholder="Nombre del producto" maxLength={120} />
          <Input value={item.description} onChange={(e) => update(i, 'description', e.target.value)} placeholder="Descripción breve" maxLength={600} />
          <Button type="button" variant="ghost" size="icon" onClick={() => remove(i)} className="text-muted-foreground hover:text-destructive">
            <Minus className="size-4" />
          </Button>
        </div>
      ))}
      <Button type="button" variant="outline" size="sm" onClick={add} className="w-full">
        <Plus className="mr-1.5 size-3.5" /> Agregar producto / servicio
      </Button>
    </div>
  )
}

// ── Rules ─────────────────────────────────────────────────────────────────────

export function RulesList({
  items, onChange, addLabel, namePlaceholder, valuePlaceholder,
}: {
  items: RuleItem[]
  onChange: (v: RuleItem[]) => void
  addLabel: string
  namePlaceholder: string
  valuePlaceholder: string
}) {
  const add    = () => onChange([...items, { title: '', instruction: '' }])
  const remove = (i: number) => onChange(items.filter((_, j) => j !== i))
  const update = (i: number, f: keyof RuleItem, v: string) =>
    onChange(items.map((item, j) => j === i ? { ...item, [f]: v } : item))

  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <div key={i} className="grid grid-cols-[1fr_2fr_auto] gap-2 items-start rounded-lg border bg-muted/20 p-3">
          <Input value={item.title} onChange={(e) => update(i, 'title', e.target.value)} placeholder={namePlaceholder} maxLength={120} />
          <Input value={item.instruction} onChange={(e) => update(i, 'instruction', e.target.value)} placeholder={valuePlaceholder} maxLength={600} />
          <Button type="button" variant="ghost" size="icon" onClick={() => remove(i)} className="text-muted-foreground hover:text-destructive">
            <Minus className="size-4" />
          </Button>
        </div>
      ))}
      <Button type="button" variant="outline" size="sm" onClick={add} className="w-full">
        <Plus className="mr-1.5 size-3.5" /> {addLabel}
      </Button>
    </div>
  )
}

// ── Pricing ───────────────────────────────────────────────────────────────────

export function PricingList({
  items, onChange,
}: {
  items: PricingItem[]
  onChange: (v: PricingItem[]) => void
}) {
  const add    = () => onChange([...items, { label: '', fromPrice: '', toPrice: '', currency: 'MXN', notes: '' }])
  const remove = (i: number) => onChange(items.filter((_, j) => j !== i))
  const update = (i: number, f: keyof PricingItem, v: string) =>
    onChange(items.map((item, j) => j === i ? { ...item, [f]: v } : item))

  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <div key={i} className="rounded-lg border bg-muted/20 p-3 space-y-2">
          <div className="grid grid-cols-[2fr_1fr_1fr_1fr_auto] gap-2 items-center">
            <Input value={item.label} onChange={(e) => update(i, 'label', e.target.value)} placeholder="Tipo de solución" maxLength={120} />
            <Input value={item.fromPrice} onChange={(e) => update(i, 'fromPrice', e.target.value)} placeholder="Desde" maxLength={40} />
            <Input value={item.toPrice} onChange={(e) => update(i, 'toPrice', e.target.value)} placeholder="Hasta" maxLength={40} />
            <Input value={item.currency} onChange={(e) => update(i, 'currency', e.target.value)} placeholder="MXN" maxLength={12} />
            <Button type="button" variant="ghost" size="icon" onClick={() => remove(i)} className="text-muted-foreground hover:text-destructive">
              <Minus className="size-4" />
            </Button>
          </div>
          <Input value={item.notes} onChange={(e) => update(i, 'notes', e.target.value)} placeholder="Notas adicionales (opcional)" maxLength={400} />
        </div>
      ))}
      <Button type="button" variant="outline" size="sm" onClick={add} className="w-full">
        <Plus className="mr-1.5 size-3.5" /> Agregar rango de precio
      </Button>
    </div>
  )
}

// ── Questions ─────────────────────────────────────────────────────────────────

export function QuestionsList({
  items, onChange,
}: {
  items: QuestionItem[]
  onChange: (v: QuestionItem[]) => void
}) {
  const add    = () => onChange([...items, { question: '', purpose: '' }])
  const remove = (i: number) => onChange(items.filter((_, j) => j !== i))
  const update = (i: number, f: keyof QuestionItem, v: string) =>
    onChange(items.map((item, j) => j === i ? { ...item, [f]: v } : item))

  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <div key={i} className="grid grid-cols-[2fr_1fr_auto] gap-2 items-start rounded-lg border bg-muted/20 p-3">
          <Input value={item.question} onChange={(e) => update(i, 'question', e.target.value)} placeholder="¿Pregunta diagnóstica?" maxLength={280} />
          <Input value={item.purpose} onChange={(e) => update(i, 'purpose', e.target.value)} placeholder="Objetivo" maxLength={300} />
          <Button type="button" variant="ghost" size="icon" onClick={() => remove(i)} className="text-muted-foreground hover:text-destructive">
            <Minus className="size-4" />
          </Button>
        </div>
      ))}
      <Button type="button" variant="outline" size="sm" onClick={add} className="w-full">
        <Plus className="mr-1.5 size-3.5" /> Agregar pregunta diagnóstica
      </Button>
    </div>
  )
}
