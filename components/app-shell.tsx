'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Activity, ClipboardList, Factory, LogOut, Search, UserCircle } from 'lucide-react'
import { logout } from '@/app/actions/auth'
import { cn } from '@/lib/utils'

const NAV = [
  { href: '/monitoreo', label: 'Monitoreo de planta', icon: Activity },
  { href: '/reportes', label: 'Reporte de fallas', icon: ClipboardList },
  { href: '/refacciones', label: 'Búsqueda de refacciones', icon: Search },
]

export function AppShell({ user, children }: { user: string; children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <div className="flex min-h-dvh flex-col lg:flex-row">
      <aside className="flex shrink-0 flex-col border-b border-sidebar-border bg-sidebar lg:sticky lg:top-0 lg:h-dvh lg:w-64 lg:border-b-0 lg:border-r">
        <div className="flex items-center justify-between gap-3 px-4 py-4 lg:px-5 lg:py-6">
          <Link href="/monitoreo" className="flex items-center gap-2.5">
            <span className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Factory className="size-5" aria-hidden="true" />
            </span>
            <span className="flex flex-col leading-tight">
              <span className="text-sm font-semibold">Control de Planta</span>
              <span className="text-xs text-muted-foreground">Mantenimiento</span>
            </span>
          </Link>
          <form action={logout} className="lg:hidden">
            <button
              type="submit"
              className="flex items-center gap-1.5 rounded-md px-2 py-1.5 text-sm text-muted-foreground hover:bg-sidebar-accent hover:text-foreground"
            >
              <LogOut className="size-4" aria-hidden="true" />
              Salir
            </button>
          </form>
        </div>

        <nav aria-label="Menú principal" className="px-2 pb-2 lg:flex-1 lg:px-3">
          <ul className="flex gap-1 overflow-x-auto lg:flex-col">
            {NAV.map((item) => {
              const active = pathname.startsWith(item.href)
              const Icon = item.icon
              return (
                <li key={item.href} className="shrink-0">
                  <Link
                    href={item.href}
                    aria-current={active ? 'page' : undefined}
                    className={cn(
                      'flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                      active
                        ? 'bg-sidebar-accent text-foreground'
                        : 'text-muted-foreground hover:bg-sidebar-accent/60 hover:text-foreground',
                    )}
                  >
                    <Icon className={cn('size-4', active && 'text-primary')} aria-hidden="true" />
                    {item.label}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        <div className="hidden border-t border-sidebar-border p-3 lg:block">
          <div className="flex items-center gap-2.5 px-2 py-2">
            <UserCircle className="size-8 text-muted-foreground" aria-hidden="true" />
            <div className="flex min-w-0 flex-col leading-tight">
              <span className="truncate text-sm font-medium capitalize">{user}</span>
              <span className="text-xs text-muted-foreground">Administrador</span>
            </div>
          </div>
          <form action={logout}>
            <button
              type="submit"
              className="mt-1 flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-foreground"
            >
              <LogOut className="size-4" aria-hidden="true" />
              Cerrar sesión
            </button>
          </form>
        </div>
      </aside>

      <main className="min-w-0 flex-1">{children}</main>
    </div>
  )
}
