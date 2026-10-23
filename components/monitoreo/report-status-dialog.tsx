'use client'

import { useState } from 'react'
import { Save } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Modal } from '@/components/modal'
import { Field, Select, Textarea } from '@/components/form-controls'
import { cn } from '@/lib/utils'
import {
  DEFAULT_MACHINE_STATE,
  STATUS_META,
  STATUS_ORDER,
  activityStore,
  machineStore,
  type MachineStatus,
  type Sector,
} from '@/lib/plant'

export function ReportStatusDialog({
  sector,
  machineId,
  onClose,
}: {
  sector: Sector
  machineId: string | null
  onClose: () => void
}) {
  return (
    <Modal
      open={machineId !== null}
      onClose={onClose}
      title="Reportar estado y pendiente"
      description={`Sector ${sector.number} · ${sector.name}`}
    >
      {machineId && (
        <StatusForm key={machineId} sector={sector} initialMachineId={machineId} onDone={onClose} />
      )}
    </Modal>
  )
}

function StatusForm({
  sector,
  initialMachineId,
  onDone,
}: {
  sector: Sector
  initialMachineId: string
  onDone: () => void
}) {
  const current = machineStore.get()
  const [machineId, setMachineId] = useState(initialMachineId)
  const [status, setStatus] = useState<MachineStatus>(
    (current[initialMachineId] ?? DEFAULT_MACHINE_STATE).status,
  )
  const [pendiente, setPendiente] = useState(
    (current[initialMachineId] ?? DEFAULT_MACHINE_STATE).pendiente,
  )

  function changeMachine(id: string) {
    const state = machineStore.get()[id] ?? DEFAULT_MACHINE_STATE
    setMachineId(id)
    setStatus(state.status)
    setPendiente(state.pendiente)
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    const machine = sector.machines.find((m) => m.id === machineId)
    if (!machine) return
    const now = new Date().toISOString()
    const text = pendiente.trim()

    machineStore.set((prev) => ({
      ...prev,
      [machine.id]: { status, pendiente: text, updatedAt: now },
    }))
    activityStore.set((prev) => [
      {
        id: crypto.randomUUID(),
        sectorId: sector.id,
        machineId: machine.id,
        machineName: machine.name,
        status,
        pendiente: text,
        createdAt: now,
      },
      ...prev,
    ])
    onDone()
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <Field label="Equipo / máquina" htmlFor="equipo-estado">
        <Select id="equipo-estado" value={machineId} onChange={(e) => changeMachine(e.target.value)}>
          {sector.machines.map((m) => (
            <option key={m.id} value={m.id}>
              {m.name}
            </option>
          ))}
        </Select>
      </Field>

      <fieldset className="flex flex-col gap-2">
        <legend className="mb-1.5 text-sm font-medium">Estado de la maquinaria</legend>
        <div className="grid gap-2 sm:grid-cols-3">
          {STATUS_ORDER.map((s) => {
            const meta = STATUS_META[s]
            const checked = status === s
            return (
              <label
                key={s}
                className={cn(
                  'flex cursor-pointer items-center gap-2.5 rounded-lg border px-3 py-2.5 text-sm transition-colors has-focus-visible:ring-3 has-focus-visible:ring-ring/40',
                  checked ? meta.soft : 'border-border hover:bg-muted',
                )}
              >
                <input
                  type="radio"
                  name="estado"
                  value={s}
                  checked={checked}
                  onChange={() => setStatus(s)}
                  className="sr-only"
                />
                <span className={cn('size-3.5 shrink-0 rounded-full', meta.dot)} aria-hidden="true" />
                <span className={cn('font-medium', checked ? meta.text : 'text-foreground')}>
                  {meta.label}
                </span>
              </label>
            )
          })}
        </div>
      </fieldset>

      <Field
        label="Actividades y pendientes"
        htmlFor="pendientes"
        hint="Deja vacío si el equipo no tiene pendientes."
      >
        <Textarea
          id="pendientes"
          value={pendiente}
          onChange={(e) => setPendiente(e.target.value)}
          placeholder="Ej. Cambio de formato a 500 ml, pendiente ajuste de sensor de nivel…"
          rows={5}
        />
      </Field>

      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <Button type="button" variant="outline" size="lg" className="h-10" onClick={onDone}>
          Cancelar
        </Button>
        <Button type="submit" size="lg" className="h-10 px-4">
          <Save aria-hidden="true" />
          Guardar
        </Button>
      </div>
    </form>
  )
}
