'use client'

import { useState } from 'react'
import { ClipboardPen, ListTodo, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/form-controls'
import { cn } from '@/lib/utils'
import {
  DEFAULT_MACHINE_STATE,
  STATUS_META,
  activityStore,
  formatDateTime,
  machineStore,
  type Sector,
} from '@/lib/plant'
import { TrafficLight } from './traffic-light'
import { ReportStatusDialog } from './report-status-dialog'

export function SectorDashboard({ sector }: { sector: Sector }) {
  const [machines] = machineStore.useStore()
  const [activities, setActivities] = activityStore.useStore()
  const [dialogMachine, setDialogMachine] = useState<string | null>(null)

  const sectorActivities = activities.filter((a) => a.sectorId === sector.id).slice(0, 30)
  const withPending = sector.machines.filter((m) => machines[m.id]?.pendiente?.trim())

  function clearHistory() {
    if (!confirm(`¿Borrar el historial de actividades del sector ${sector.name}?`)) return
    setActivities((prev) => prev.filter((a) => a.sectorId !== sector.id))
  }

  return (
    <div id={`panel-${sector.id}`} role="tabpanel" className="flex flex-col gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold">
            Sector {sector.number} · {sector.name}
          </h2>
          <p className="text-sm text-muted-foreground">
            Selecciona un equipo o usa el botón para reportar su estado.
          </p>
        </div>
        <Button size="lg" className="h-10 px-4" onClick={() => setDialogMachine(sector.machines[0].id)}>
          <ClipboardPen aria-hidden="true" />
          Reportar estado y pendiente
        </Button>
      </div>

      <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
        {sector.machines.map((machine) => {
          const state = machines[machine.id] ?? DEFAULT_MACHINE_STATE
          const meta = STATUS_META[state.status]
          return (
            <li key={machine.id}>
              <button
                type="button"
                onClick={() => setDialogMachine(machine.id)}
                className="flex h-full w-full gap-4 rounded-xl border border-border bg-card p-4 text-left transition-colors hover:border-muted-foreground/40"
              >
                <TrafficLight status={state.status} />
                <div className="flex min-w-0 flex-1 flex-col gap-2">
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-semibold">{machine.name}</span>
                    <span
                      className={cn(
                        'shrink-0 rounded-full border px-2 py-0.5 text-xs font-medium',
                        meta.soft,
                      )}
                    >
                      {meta.label}
                    </span>
                  </div>
                  <p
                    className={cn(
                      'line-clamp-3 text-sm',
                      state.pendiente ? 'text-foreground/90' : 'text-muted-foreground italic',
                    )}
                  >
                    {state.pendiente || 'Sin pendientes registrados'}
                  </p>
                  <span className="mt-auto font-mono text-xs text-muted-foreground">
                    Actualizado: {formatDateTime(state.updatedAt)}
                  </span>
                </div>
              </button>
            </li>
          )
        })}
      </ul>

      <div className="grid gap-4 lg:grid-cols-5">
        <Card className="flex flex-col lg:col-span-2">
          <div className="flex items-center gap-2 border-b border-border px-4 py-3">
            <ListTodo className="size-4 text-primary" aria-hidden="true" />
            <h3 className="font-semibold">Pendientes actuales</h3>
            <span className="ml-auto font-mono text-xs text-muted-foreground">
              {withPending.length}
            </span>
          </div>
          {withPending.length === 0 ? (
            <p className="px-4 py-8 text-center text-sm text-muted-foreground">
              No hay pendientes en este sector.
            </p>
          ) : (
            <ul className="divide-y divide-border">
              {withPending.map((m) => {
                const state = machines[m.id]
                return (
                  <li key={m.id} className="flex gap-3 px-4 py-3">
                    <span
                      className={cn('mt-1.5 size-2.5 shrink-0 rounded-full', STATUS_META[state.status].dot)}
                      aria-hidden="true"
                    />
                    <div className="flex min-w-0 flex-col gap-0.5">
                      <span className="text-sm font-medium">{m.name}</span>
                      <p className="whitespace-pre-line text-sm text-muted-foreground">{state.pendiente}</p>
                    </div>
                  </li>
                )
              })}
            </ul>
          )}
        </Card>

        <Card className="flex flex-col lg:col-span-3">
          <div className="flex items-center gap-2 border-b border-border px-4 py-3">
            <h3 className="font-semibold">Actividades y pendientes</h3>
            <span className="font-mono text-xs text-muted-foreground">
              ({sectorActivities.length})
            </span>
            {sectorActivities.length > 0 && (
              <Button variant="ghost" size="sm" className="ml-auto" onClick={clearHistory}>
                <Trash2 aria-hidden="true" />
                Limpiar
              </Button>
            )}
          </div>
          {sectorActivities.length === 0 ? (
            <p className="px-4 py-8 text-center text-sm text-muted-foreground">
              Aún no hay reportes. Usa &quot;Reportar estado y pendiente&quot; para registrar el primero.
            </p>
          ) : (
            <ol className="max-h-[420px] divide-y divide-border overflow-y-auto">
              {sectorActivities.map((a) => {
                const meta = STATUS_META[a.status]
                return (
                  <li key={a.id} className="flex flex-col gap-1.5 px-4 py-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-medium">{a.machineName}</span>
                      <span className={cn('rounded-full border px-2 py-0.5 text-xs', meta.soft)}>
                        {meta.label}
                      </span>
                      <time
                        dateTime={a.createdAt}
                        className="ml-auto font-mono text-xs text-muted-foreground"
                      >
                        {formatDateTime(a.createdAt)}
                      </time>
                    </div>
                    {a.pendiente && (
                      <p className="whitespace-pre-line text-sm text-muted-foreground">{a.pendiente}</p>
                    )}
                  </li>
                )
              })}
            </ol>
          )}
        </Card>
      </div>

      <ReportStatusDialog
        sector={sector}
        machineId={dialogMachine}
        onClose={() => setDialogMachine(null)}
      />
    </div>
  )
}
