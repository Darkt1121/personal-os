'use client'
import { useState, useTransition } from 'react'
import { X, Plus, Pencil } from 'lucide-react'
import { createIncomeEntry, updateIncomeEntry } from '../actions'
import type { IncomeRaw } from '../types'

type Props = {
  open: boolean
  onClose: () => void
  editId?: string
  editData?: IncomeRaw
}

export function AddIncomeModal({ open, onClose, editId, editData }: Props) {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const isEdit = !!editId && !!editData

  if (!open) return null

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    const formData = new FormData(e.currentTarget)
    startTransition(async () => {
      const result = isEdit
        ? await updateIncomeEntry(editId!, formData)
        : await createIncomeEntry(formData)
      if (result?.error) {
        setError(result.error)
      } else {
        onClose()
      }
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/65 backdrop-blur-sm" onClick={onClose} />
      <div className="card-premium relative z-10 w-full max-w-md rounded-2xl p-6">
        <div className="mb-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border icobox-emerald">
              {isEdit ? <Pencil className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
            </div>
            <div>
              <p className="text-[13.5px] font-semibold text-foreground/90">
                {isEdit ? 'Editar ingreso' : 'Nuevo ingreso'}
              </p>
              <p className="font-mono text-[9.5px] uppercase tracking-[.14em] text-muted-foreground/40">
                {isEdit ? 'modificar registro' : 'registrar pago recibido'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-lg border border-border/40 text-muted-foreground/40 transition-colors hover:text-foreground/60"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>

        {error && (
          <div className="mb-4 rounded-lg border border-rose-500/20 bg-rose-500/[0.08] px-3 py-2 font-mono text-[11px] text-rose-400">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <Field label="Fuente *">
            <input
              name="source"
              required
              defaultValue={editData?.source ?? ''}
              placeholder="YouTube, Consultoría, Facebook…"
              className={inputCls}
            />
          </Field>
          <Field label="Canal / cuenta">
            <input
              name="channel_name"
              defaultValue={editData?.channel_name ?? ''}
              placeholder="nombre del canal o cuenta"
              className={inputCls}
            />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Monto original *">
              <input
                name="amount_original"
                type="text"
                inputMode="decimal"
                required
                defaultValue={editData?.amount_original ?? ''}
                placeholder="312.50 ó 1.500.000"
                className={inputCls}
              />
            </Field>
            <Field label="Moneda *">
              <select name="currency_original" defaultValue={editData?.currency_original ?? 'USD'} className={inputCls}>
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="CLP">CLP</option>
                <option value="MXN">MXN</option>
                <option value="ARS">ARS</option>
              </select>
            </Field>
          </div>
          <Field label="Equivalente en CLP">
            <input
              name="amount_clp"
              type="text"
              inputMode="decimal"
              defaultValue={editData?.amount_clp ?? ''}
              placeholder="si difiere del monto original"
              className={inputCls}
            />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Fecha de pago *">
              <input
                name="payment_date"
                type="date"
                required
                defaultValue={editData?.payment_date ?? new Date().toISOString().slice(0, 10)}
                className={inputCls}
              />
            </Field>
            <Field label="Estado">
              <select name="status" defaultValue={editData?.status ?? 'received'} className={inputCls}>
                <option value="received">Recibido</option>
                <option value="pending">Pendiente</option>
              </select>
            </Field>
          </div>
          <Field label="Notas">
            <textarea
              name="notes"
              rows={2}
              defaultValue={editData?.notes ?? ''}
              placeholder="observaciones opcionales"
              className={`${inputCls} resize-none`}
            />
          </Field>

          <div className="flex gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-lg border border-border/50 bg-transparent px-4 py-2 font-mono text-[11.5px] text-muted-foreground/50 transition-colors hover:text-foreground/60"
            >
              cancelar
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="flex-1 rounded-lg border border-emerald-500/35 px-4 py-2 font-mono text-[11.5px] font-medium text-emerald-400 transition-all disabled:opacity-50"
              style={{ background: 'linear-gradient(180deg, rgba(52,211,153,.16), rgba(52,211,153,.06))', boxShadow: '0 0 22px -10px rgba(52,211,153,.5)' }}
            >
              {isPending ? 'guardando…' : isEdit ? 'actualizar ingreso' : 'guardar ingreso'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 block font-mono text-[9.5px] uppercase tracking-[.16em] text-muted-foreground/40">
        {label}
      </label>
      {children}
    </div>
  )
}

const inputCls =
  'w-full rounded-lg border border-border/50 bg-background/50 px-3 py-2 font-sans text-[13px] text-foreground/80 placeholder:text-muted-foreground/30 outline-none transition-colors focus:border-emerald-500/40'
