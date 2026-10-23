import { cn } from '@/lib/utils'
import { STATUS_META, type MachineStatus } from '@/lib/plant'

const LIGHTS: { status: MachineStatus; on: string; glow: string }[] = [
  { status: 'parada', on: 'bg-stop', glow: 'shadow-[0_0_14px_2px_var(--stop)]' },
  { status: 'formato', on: 'bg-change', glow: 'shadow-[0_0_14px_2px_var(--change)]' },
  { status: 'marcha', on: 'bg-run', glow: 'shadow-[0_0_14px_2px_var(--run)]' },
]

export function TrafficLight({
  status,
  size = 'md',
}: {
  status: MachineStatus
  size?: 'sm' | 'md'
}) {
  const light = size === 'sm' ? 'size-3' : 'size-5'
  return (
    <div
      role="img"
      aria-label={`Semáforo: ${STATUS_META[status].label}`}
      className={cn(
        'flex shrink-0 flex-col items-center rounded-full border border-border bg-background',
        size === 'sm' ? 'gap-1 p-1' : 'gap-1.5 p-1.5',
      )}
    >
      {LIGHTS.map((l) => {
        const active = l.status === status
        return (
          <span
            key={l.status}
            className={cn(
              'rounded-full transition-all',
              light,
              active ? cn(l.on, l.glow, status === 'parada' && 'animate-pulse') : 'bg-muted',
            )}
          />
        )
      })}
    </div>
  )
}
