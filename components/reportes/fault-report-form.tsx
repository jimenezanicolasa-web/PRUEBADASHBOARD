'use client'

import { useState } from 'react'
import { Check, FileDown, Loader2, MessageCircle, Save, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, Field, Input, Select, Textarea } from '@/components/form-controls'
import { cn } from '@/lib/utils'
import {
  FABRICAS,
  RESULTADOS,
  SEVERIDADES,
  TIPOS_FALLA,
  exportReportsPdf,
  minutesBetween,
  shareOnWhatsApp,
  type FaultReport,
  type FaultReportDraft,
} from '@/lib/reports'

function Section({ step, title, children }: { step: number; title: string; children: React.ReactNode }) {
  return (
    <fieldset className="flex flex-col gap-4 border-t border-border px-4 py-5 first:border-t-0 sm:px-6">
      <legend className="contents">
        <span className="flex items-center gap-2.5 text-sm font-semibold">
          <span className="flex size-6 items-center justify-center rounded-md bg-primary/15 font-mono text-xs text-primary">
            {step}
          </span>
          {title}
        </span>
      </legend>
      {children}
    </fieldset>
  )
}

export function FaultReportForm({
  draft,
  onChange,
  onSave,
  onCancelEdit,
  editingFolio,
  reports,
}: {
  draft: FaultReportDraft
  onChange: (draft: FaultReportDraft) => void
  onSave: () => void
  onCancelEdit: () => void
  editingFolio: number | null
  reports: FaultReport[]
}) {
  const [exporting, setExporting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function update<K extends keyof FaultReportDraft>(key: K, value: FaultReportDraft[K]) {
    const next = { ...draft, [key]: value }
    if (key === 'horaParo' || key === 'horaEntrega') {
      const mins = minutesBetween(next.horaParo, next.horaEntrega)
      if (mins !== null) next.minutosParo = mins
    }
    onChange(next)
  }

  function toggleTipo(tipo: string) {
    update(
      'tipos',
      draft.tipos.includes(tipo) ? draft.tipos.filter((t) => t !== tipo) : [...draft.tipos, tipo],
    )
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    if (draft.tipos.length === 0) {
      setError('Selecciona al menos un origen o tipo de falla.')
      return
    }
    if (draft.horaParo && draft.horaEntrega && minutesBetween(draft.horaParo, draft.horaEntrega) === null) {
      setError('La hora de entrega no puede ser anterior a la hora de paro.')
      return
    }
    setError(null)
    onSave()
  }

  async function handleExport() {
    if (reports.length === 0) {
      setError('No hay reportes guardados para exportar.')
      return
    }
    setError(null)
    setExporting(true)
    try {
      await exportReportsPdf(reports)
    } finally {
      setExporting(false)
    }
  }

  function handleShare() {
    if (!draft.equipo && !draft.titulo) {
      setError('Captura al menos el equipo y el título de la falla para compartir el reporte actual.')
      return
    }
    setError(null)
    shareOnWhatsApp({ ...draft, folio: editingFolio ?? undefined })
  }

  return (
    <Card>
      <form onSubmit={handleSubmit}>
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-4 py-4 sm:px-6">
          <h2 className="text-lg font-semibold">
            {editingFolio
              ? `Editando reporte #${String(editingFolio).padStart(4, '0')}`
              : 'Nuevo reporte de falla'}
          </h2>
          {editingFolio && (
            <Button type="button" variant="ghost" size="sm" onClick={onCancelEdit}>
              <X aria-hidden="true" />
              Cancelar edición
            </Button>
          )}
        </div>

        <Section step={1} title="Planta">
          <Field label="Fábrica" htmlFor="fabrica" required className="sm:max-w-xs">
            <Select
              id="fabrica"
              required
              value={draft.fabrica}
              onChange={(e) => update('fabrica', e.target.value)}
            >
              <option value="" disabled>
                Selecciona una fábrica
              </option>
              {FABRICAS.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </Select>
          </Field>
        </Section>

        <Section step={2} title="Registro de tiempos y duración del paro">
          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="Hora de paro del equipo" htmlFor="hora-paro" required>
              <Input
                id="hora-paro"
                type="datetime-local"
                required
                value={draft.horaParo}
                onChange={(e) => update('horaParo', e.target.value)}
              />
            </Field>
            <Field label="Hora de entrega" htmlFor="hora-entrega">
              <Input
                id="hora-entrega"
                type="datetime-local"
                value={draft.horaEntrega}
                min={draft.horaParo || undefined}
                onChange={(e) => update('horaEntrega', e.target.value)}
              />
            </Field>
            <Field
              label="Minutos de paro"
              htmlFor="minutos"
              hint="Se calcula automáticamente; puedes ajustarlo."
            >
              <Input
                id="minutos"
                type="number"
                inputMode="numeric"
                min={0}
                value={draft.minutosParo ?? ''}
                onChange={(e) =>
                  update('minutosParo', e.target.value === '' ? null : Math.max(0, Number(e.target.value)))
                }
                placeholder="0"
                className="font-mono"
              />
            </Field>
          </div>
        </Section>

        <Section step={3} title="Datos de la falla">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Nombre del técnico" htmlFor="tecnico" required>
              <Input
                id="tecnico"
                required
                autoComplete="name"
                value={draft.tecnico}
                onChange={(e) => update('tecnico', e.target.value)}
                placeholder="Ej. Juan Pérez"
              />
            </Field>
            <Field label="Equipo o maquinaria" htmlFor="equipo" required>
              <Input
                id="equipo"
                required
                value={draft.equipo}
                onChange={(e) => update('equipo', e.target.value)}
                placeholder="Ej. Volpack 3"
              />
            </Field>
            <Field label="Código de alarma" htmlFor="alarma">
              <Input
                id="alarma"
                value={draft.codigoAlarma}
                onChange={(e) => update('codigoAlarma', e.target.value)}
                placeholder="Ej. E-204"
                className="font-mono"
              />
            </Field>
            <Field label="Título de la falla" htmlFor="titulo" required>
              <Input
                id="titulo"
                required
                value={draft.titulo}
                onChange={(e) => update('titulo', e.target.value)}
                placeholder="Ej. Falla en sellado vertical"
              />
            </Field>
            <Field label="Problema que se presentó (síntomas)" htmlFor="sintomas" className="sm:col-span-2">
              <Textarea
                id="sintomas"
                value={draft.sintomas}
                onChange={(e) => update('sintomas', e.target.value)}
                placeholder="Describe lo que se observó: ruidos, alarmas, comportamiento anormal…"
              />
            </Field>
          </div>
        </Section>

        <Section step={4} title="Origen o tipo de falla">
          <div className="flex flex-wrap gap-2" role="group" aria-label="Origen o tipo de falla">
            {TIPOS_FALLA.map((tipo) => {
              const active = draft.tipos.includes(tipo)
              return (
                <button
                  key={tipo}
                  type="button"
                  aria-pressed={active}
                  onClick={() => toggleTipo(tipo)}
                  className={cn(
                    'flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors',
                    active
                      ? 'border-primary bg-primary text-primary-foreground'
                      : 'border-border bg-background/60 text-muted-foreground hover:border-muted-foreground/50 hover:text-foreground',
                  )}
                >
                  {active && <Check className="size-3.5" aria-hidden="true" />}
                  {tipo}
                </button>
              )
            })}
          </div>
        </Section>

        <Section step={5} title="Solución">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Solución realizada" htmlFor="solucion" required>
              <Textarea
                id="solucion"
                required
                value={draft.solucion}
                onChange={(e) => update('solucion', e.target.value)}
                placeholder="Acciones correctivas aplicadas…"
              />
            </Field>
            <Field label="Refacción utilizada" htmlFor="refaccion">
              <Textarea
                id="refaccion"
                value={draft.refaccion}
                onChange={(e) => update('refaccion', e.target.value)}
                placeholder="Ej. Rodamiento 6205-2RS (x2), banda B-42…"
              />
            </Field>
          </div>
        </Section>

        <Section step={6} title="Clasificación y estado final">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Severidad de la falla" htmlFor="severidad" required>
              <Select
                id="severidad"
                required
                value={draft.severidad}
                onChange={(e) => update('severidad', e.target.value as FaultReportDraft['severidad'])}
              >
                <option value="" disabled>
                  Selecciona la severidad
                </option>
                {SEVERIDADES.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Estado en que se dejó la máquina" htmlFor="resultado" required>
              <Select
                id="resultado"
                required
                value={draft.resultado}
                onChange={(e) => update('resultado', e.target.value as FaultReportDraft['resultado'])}
              >
                <option value="" disabled>
                  Selecciona el resultado
                </option>
                {RESULTADOS.map((r) => (
                  <option key={r.value} value={r.value}>
                    {r.label}
                  </option>
                ))}
              </Select>
            </Field>
          </div>
        </Section>

        <div className="flex flex-col gap-3 border-t border-border bg-muted/30 px-4 py-4 sm:px-6">
          {error && (
            <p role="alert" className="text-sm text-stop">
              {error}
            </p>
          )}
          <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
            <Button type="submit" size="lg" className="h-10 px-4">
              <Save aria-hidden="true" />
              {editingFolio ? 'Guardar cambios' : 'Guardar reporte'}
            </Button>
            <Button
              type="button"
              variant="outline"
              size="lg"
              className="h-10 px-4"
              onClick={handleExport}
              disabled={exporting}
            >
              {exporting ? <Loader2 className="animate-spin" aria-hidden="true" /> : <FileDown aria-hidden="true" />}
              Exportar historial PDF
            </Button>
            <Button
              type="button"
              size="lg"
              className="h-10 bg-[#25D366] px-4 text-black hover:bg-[#25D366]/85"
              onClick={handleShare}
            >
              <MessageCircle aria-hidden="true" />
              Compartir por WhatsApp
            </Button>
          </div>
        </div>
      </form>
    </Card>
  )
}
