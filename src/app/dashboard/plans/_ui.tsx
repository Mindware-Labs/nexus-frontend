'use client'

import { useEffect, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import {
  AlertCircle, CheckCircle2, ChevronDown, ChevronUp,
  CreditCard, Edit2, Infinity, Plus, Trash2, X,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  type Plan,
  createPlanAction, updatePlanAction, deletePlanAction,
} from '@/app/actions/plans'

// ── helpers ───────────────────────────────────────────────────────────────────
function fmt(n: number | null, unit = '') {
  if (n === null) return '∞'
  return n.toLocaleString('es') + (unit ? ' ' + unit : '')
}

function pctColor(p: number) {
  if (p >= 100) return 'text-destructive'
  if (p >= 80) return 'text-amber-500'
  return 'text-green-600 dark:text-green-400'
}

// ── Limit field ───────────────────────────────────────────────────────────────
function LimitField({
  label, value, onChange,
}: { label: string; value: number | null; onChange: (v: number | null) => void }) {
  const unlimited = value === null
  return (
    <div className="space-y-1">
      <Label className="text-xs text-muted-foreground">{label}</Label>
      <div className="flex items-center gap-2">
        <Input
          type="number"
          min={1}
          disabled={unlimited}
          value={unlimited ? '' : value ?? ''}
          onChange={(e) => onChange(e.target.value === '' ? null : Number(e.target.value))}
          placeholder="ej. 1000"
          className="flex-1"
        />
        <button
          type="button"
          title={unlimited ? 'Ilimitado (clic para poner límite)' : 'Poner como ilimitado'}
          onClick={() => onChange(unlimited ? 1000 : null)}
          className={`flex items-center gap-1 rounded-md border px-2.5 py-1.5 text-xs transition-colors ${unlimited ? 'border-nexus-purple bg-nexus-purple/10 text-nexus-purple' : 'border-input text-muted-foreground hover:border-nexus-purple/50'}`}
        >
          <Infinity className="size-3.5" />
          {unlimited ? 'Ilimitado' : 'Sin límite'}
        </button>
      </div>
    </div>
  )
}

// ── Plan form (create / edit) ─────────────────────────────────────────────────
const EMPTY: Omit<Plan, 'id' | 'createdAt' | 'updatedAt'> = {
  name: '', description: '', priceMonthly: 0,
  maxConversationsPerMonth: 1000, maxTokensPerMonth: 2000000, maxLeadsPerMonth: 100,
  allowedModels: [], isActive: true, sortOrder: 0,
}

function PlanForm({
  initial, onSave, onCancel, isPending,
}: {
  initial: Omit<Plan, 'id' | 'createdAt' | 'updatedAt'>
  onSave: (p: typeof initial) => void
  onCancel: () => void
  isPending: boolean
}) {
  const [form, setForm] = useState(initial)
  const set = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) =>
    setForm((f) => ({ ...f, [k]: v }))

  return (
    <div className="rounded-xl border bg-card p-5 space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground">Nombre del plan *</Label>
          <Input value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="Pro" />
        </div>
        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground">Precio mensual (USD)</Label>
          <Input type="number" min={0} step={0.01} value={form.priceMonthly}
            onChange={(e) => set('priceMonthly', Number(e.target.value))} />
        </div>
      </div>

      <div className="space-y-1">
        <Label className="text-xs text-muted-foreground">Descripción</Label>
        <Input value={form.description} onChange={(e) => set('description', e.target.value)}
          placeholder="Plan para equipos en crecimiento" />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <LimitField label="Conversaciones/mes"
          value={form.maxConversationsPerMonth}
          onChange={(v) => set('maxConversationsPerMonth', v)} />
        <LimitField label="Tokens/mes"
          value={form.maxTokensPerMonth}
          onChange={(v) => set('maxTokensPerMonth', v)} />
        <LimitField label="Leads/mes"
          value={form.maxLeadsPerMonth}
          onChange={(v) => set('maxLeadsPerMonth', v)} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground">Orden (menor = primero)</Label>
          <Input type="number" min={0} value={form.sortOrder}
            onChange={(e) => set('sortOrder', Number(e.target.value))} />
        </div>
        <div className="flex items-end gap-2 pb-0.5">
          <label className="flex items-center gap-2 text-sm cursor-pointer select-none">
            <input type="checkbox" checked={form.isActive}
              onChange={(e) => set('isActive', e.target.checked)}
              className="accent-nexus-purple size-4 rounded" />
            Plan activo (visible para asignar)
          </label>
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-1">
        <Button variant="outline" type="button" onClick={onCancel} disabled={isPending}>
          Cancelar
        </Button>
        <Button type="button" disabled={isPending || !form.name.trim()}
          className="bg-nexus-purple text-white hover:bg-nexus-purple/85"
          onClick={() => onSave(form)}>
          {isPending ? 'Guardando…' : 'Guardar plan'}
        </Button>
      </div>
    </div>
  )
}

// ── Plan card ─────────────────────────────────────────────────────────────────
function PlanCard({ plan, onEdit, onDelete }: { plan: Plan; onEdit: () => void; onDelete: () => void }) {
  return (
    <div className={`rounded-xl border bg-card p-5 space-y-3 transition-opacity ${plan.isActive ? '' : 'opacity-60'}`}>
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-foreground">{plan.name}</h3>
            {!plan.isActive && (
              <span className="rounded-full border px-2 py-0.5 text-[10px] text-muted-foreground">Inactivo</span>
            )}
          </div>
          {plan.description && <p className="text-xs text-muted-foreground mt-0.5">{plan.description}</p>}
        </div>
        <div className="text-right shrink-0">
          <p className="text-lg font-bold text-foreground">${plan.priceMonthly.toFixed(2)}</p>
          <p className="text-xs text-muted-foreground">/mes</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {[
          { label: 'Conversaciones', val: plan.maxConversationsPerMonth },
          { label: 'Tokens', val: plan.maxTokensPerMonth },
          { label: 'Leads', val: plan.maxLeadsPerMonth },
        ].map(({ label, val }) => (
          <div key={label} className="rounded-lg bg-muted/40 px-3 py-2 text-center">
            <p className="text-xs text-muted-foreground">{label}</p>
            <p className="text-sm font-semibold mt-0.5">{fmt(val)}</p>
          </div>
        ))}
      </div>

      <div className="flex justify-end gap-2 pt-1">
        <Button size="sm" variant="outline" onClick={onEdit}>
          <Edit2 className="size-3.5 mr-1.5" /> Editar
        </Button>
        <Button size="sm" variant="outline"
          className="border-destructive/40 text-destructive hover:bg-destructive/10"
          onClick={onDelete}>
          <Trash2 className="size-3.5 mr-1.5" /> Eliminar
        </Button>
      </div>
    </div>
  )
}

// ── Main UI ───────────────────────────────────────────────────────────────────
export function PlansUI({ plans: initialPlans }: { plans: Plan[] }) {
  const router = useRouter()
  const [plans, setPlans] = useState(initialPlans)

  useEffect(() => { setPlans(initialPlans) }, [initialPlans])
  const [creating, setCreating] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [isPending, startTransition] = useTransition()
  const [feedback, setFeedback] = useState<{ ok: boolean; msg: string } | null>(null)

  function flash(ok: boolean, msg: string) {
    setFeedback({ ok, msg })
    if (ok) setTimeout(() => setFeedback(null), 3000)
  }

  function handleCreate(form: typeof EMPTY) {
    startTransition(async () => {
      const res = await createPlanAction({ status: 'idle' }, form)
      if (res.status === 'success') {
        setCreating(false)
        flash(true, 'Plan creado')
        router.refresh()
      } else if (res.status === 'error') {
        flash(false, res.message)
      }
    })
  }

  function handleUpdate(form: Omit<Plan, 'id' | 'createdAt' | 'updatedAt'>) {
    if (!editingId) return
    const plan = plans.find((p) => p.id === editingId)
    if (!plan) return
    startTransition(async () => {
      const res = await updatePlanAction({ status: 'idle' }, { ...plan, ...form })
      if (res.status === 'success') {
        setEditingId(null)
        flash(true, 'Plan actualizado')
        router.refresh()
      } else if (res.status === 'error') {
        flash(false, res.message)
      }
    })
  }

  function handleDelete(id: number) {
    if (!confirm('¿Eliminar este plan? Los tenants asignados quedarán sin plan.')) return
    startTransition(async () => {
      const res = await deletePlanAction(id)
      if (res.status === 'success') {
        setPlans((p) => p.filter((x) => x.id !== id))
        flash(true, 'Plan eliminado')
      } else if (res.status === 'error') {
        flash(false, res.message)
      }
    })
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-xl font-semibold">
            <CreditCard className="size-5 text-nexus-purple" />
            Planes de suscripción
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Define los planes y sus límites. Los cambios se aplican inmediatamente a todos los tenants asignados.
          </p>
        </div>
        {!creating && (
          <Button className="bg-nexus-purple text-white hover:bg-nexus-purple/85"
            onClick={() => { setCreating(true); setEditingId(null) }}>
            <Plus className="size-4 mr-1.5" /> Nuevo plan
          </Button>
        )}
      </div>

      {/* Feedback */}
      {feedback && (
        <div className={`flex items-center gap-2 rounded-xl border px-4 py-3 text-sm ${feedback.ok ? 'border-green-500/30 bg-green-500/5 text-green-700 dark:text-green-400' : 'border-destructive/30 bg-destructive/5 text-destructive'}`}>
          {feedback.ok ? <CheckCircle2 className="size-4 shrink-0" /> : <AlertCircle className="size-4 shrink-0" />}
          {feedback.msg}
        </div>
      )}

      {/* Create form */}
      {creating && (
        <PlanForm initial={EMPTY} isPending={isPending}
          onSave={handleCreate}
          onCancel={() => setCreating(false)} />
      )}

      {/* Plan list */}
      {plans.length === 0 && !creating ? (
        <div className="rounded-xl border bg-muted/20 py-16 text-center text-sm text-muted-foreground">
          No hay planes configurados.{' '}
          <button className="text-nexus-purple hover:underline" onClick={() => setCreating(true)}>
            Crea el primero
          </button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {plans.map((plan) =>
            editingId === plan.id ? (
              <div key={plan.id} className="sm:col-span-2">
                <PlanForm
                  initial={{
                    name: plan.name, description: plan.description,
                    priceMonthly: plan.priceMonthly,
                    maxConversationsPerMonth: plan.maxConversationsPerMonth,
                    maxTokensPerMonth: plan.maxTokensPerMonth,
                    maxLeadsPerMonth: plan.maxLeadsPerMonth,
                    allowedModels: plan.allowedModels, isActive: plan.isActive,
                    sortOrder: plan.sortOrder,
                  }}
                  isPending={isPending}
                  onSave={handleUpdate}
                  onCancel={() => setEditingId(null)}
                />
              </div>
            ) : (
              <PlanCard key={plan.id} plan={plan}
                onEdit={() => { setEditingId(plan.id); setCreating(false) }}
                onDelete={() => handleDelete(plan.id)} />
            )
          )}
        </div>
      )}
    </div>
  )
}
