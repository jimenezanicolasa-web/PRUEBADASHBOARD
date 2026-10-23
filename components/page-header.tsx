import type { ReactNode } from 'react'

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow: string
  title: string
  description: string
  actions?: ReactNode
}) {
  return (
    <header className="flex flex-col gap-4 border-b border-border px-4 py-6 sm:px-6 lg:flex-row lg:items-end lg:justify-between lg:px-8">
      <div className="flex flex-col gap-1.5">
        <p className="font-mono text-xs uppercase tracking-widest text-primary">{eyebrow}</p>
        <h1 className="text-2xl font-semibold text-balance">{title}</h1>
        <p className="max-w-2xl text-sm text-muted-foreground text-pretty">{description}</p>
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </header>
  )
}
