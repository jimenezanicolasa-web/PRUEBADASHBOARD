import { createLocalStore } from './local-store'

export type MachineStatus = 'marcha' | 'formato' | 'parada'

export const STATUS_META: Record<
  MachineStatus,
  { label: string; short: string; dot: string; text: string; soft: string }
> = {
  marcha: {
    label: 'En marcha',
    short: 'Marcha',
    dot: 'bg-run',
    text: 'text-run',
    soft: 'bg-run/15 text-run border-run/30',
  },
  formato: {
    label: 'Cambio de formato',
    short: 'Formato',
    dot: 'bg-change',
    text: 'text-change',
    soft: 'bg-change/15 text-change border-change/30',
  },
  parada: {
    label: 'Máquina parada',
    short: 'Parada',
    dot: 'bg-stop',
    text: 'text-stop',
    soft: 'bg-stop/15 text-stop border-stop/30',
  },
}

export const STATUS_ORDER: MachineStatus[] = ['marcha', 'formato', 'parada']

export type Machine = { id: string; name: string }
export type Sector = { id: string; number: number; name: string; machines: Machine[] }

function buildMachines(prefix: string, label: string, count: number): Machine[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `${prefix}-${i + 1}`,
    name: `${label} ${i + 1}`,
  }))
}

export const SECTORS: Sector[] = [
  { id: 'procesos', number: 1, name: 'Procesos', machines: buildMachines('linea', 'Línea', 3) },
  { id: 'volpacks', number: 2, name: 'Volpacks', machines: buildMachines('volpack', 'Volpack', 6) },
  { id: 'autoclaves', number: 3, name: 'Autoclaves', machines: buildMachines('autoclave', 'Autoclave', 7) },
  { id: 'camas', number: 4, name: 'Camas', machines: buildMachines('cama', 'Cama', 6) },
]

export type MachineState = { status: MachineStatus; pendiente: string; updatedAt: string | null }

export type ActivityEntry = {
  id: string
  sectorId: string
  machineId: string
  machineName: string
  status: MachineStatus
  pendiente: string
  createdAt: string
}

export const DEFAULT_MACHINE_STATE: MachineState = {
  status: 'marcha',
  pendiente: '',
  updatedAt: null,
}

export const machineStore = createLocalStore<Record<string, MachineState>>(
  'planta.maquinas.v1',
  {},
)
export const activityStore = createLocalStore<ActivityEntry[]>('planta.actividades.v1', [])

export function formatDateTime(iso: string | null) {
  if (!iso) return '—'
  return new Date(iso).toLocaleString('es-MX', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  })
}
