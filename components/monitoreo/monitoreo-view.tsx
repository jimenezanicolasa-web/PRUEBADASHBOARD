'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import {
  DEFAULT_MACHINE_STATE,
  SECTORS,
  STATUS_META,
  STATUS_ORDER,
  machineStore,
  type MachineStatus,
} from '@/lib/plant'
import { SectorDashboard } from './sector-dashboard'

export function MonitoreoView() {
  const [activeId, setActiveId] = useState(SECTORS[0].id)
  const [machines] = machineStore.useStore()
  const active = SECTORS.find((s) => s.id === activeId) ?? SECTORS[0]

  return (
    <div className="flex flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
      <div role="tablist" aria-label="Sectores" className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        {SECTORS.map((sector) => {
          const counts: Record<MachineStatus, number> = { marcha: 0, formato: 0, parada: 0 }
          sector.machines.forEach((m) => {
            counts[(machines[m.id] ?? DEFAULT_MACHINE_STATE).status]++
          })
          const selected = sector.id === activeId
          return (
            <button
              key={sector.id}
              role="tab"
              type="button"
              aria-selected={selected}
              aria-controls={`panel-${sector.id}`}
              onClick={() => setActiveId(sector.id)}
              className={cn(
                'flex flex-col gap-3 rounded-xl border p-4 text-left transition-colors',
                selected
                  ? 'border-primary bg-primary/10'
                  : 'border-border bg-card hover:border-muted-foreground/40',
              )}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-xs text-muted-foreground">
                  SECTOR {sector.number}
                </span>
                {counts.parada > 0 && (
                  <span className="size-2 animate-pulse rounded-full bg-stop" aria-hidden="true" />
                )}
              </div>
              <div className="flex items-baseline justify-between gap-2">
                <span className="text-lg font-semibold">{sector.name}</span>
                <span className="text-xs text-muted-foreground">
                  {sector.machines.length} equipos
                </span>
              </div>
              <div className="flex gap-3 text-sm">
                {STATUS_ORDER.map((status) => (
                  <span key={status} className="flex items-center gap-1.5">
                    <span className={cn('size-2.5 rounded-full', STATUS_META[status].dot)} />
                    <span className="font-mono tabular-nums">{counts[status]}</span>
                    <span className="sr-only">{STATUS_META[status].label}</span>
                  </span>
                ))}
              </div>
            </button>
          )
        })}
      </div>

      <SectorDashboard key={active.id} sector={active} />
    </div>
  )
}
