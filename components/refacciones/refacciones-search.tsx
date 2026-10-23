'use client'

import { useMemo, useState } from 'react'
import { Construction, Search } from 'lucide-react'
import { Card, Input } from '@/components/form-controls'
import { cn } from '@/lib/utils'
import { CATEGORIAS, REFACCIONES } from '@/lib/refacciones'

export function RefaccionesSearch() {
  const [query, setQuery] = useState('')
  const [categoria, setCategoria] = useState<string | null>(null)
  const [soloBajo, setSoloBajo] = useState(false)

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    return REFACCIONES.filter((r) => {
      if (categoria && r.categoria !== categoria) return false
      if (soloBajo && r.stock > r.minimo) return false
      if (!q) return true
      return [r.codigo, r.nombre, r.equipo, r.ubicacion].join(' ').toLowerCase().includes(q)
    })
  }, [query, categoria, soloBajo])

  const bajos = REFACCIONES.filter((r) => r.stock <= r.minimo).length

  return (
    <div className="flex flex-col gap-5 px-4 py-6 sm:px-6 lg:px-8">
      <div className="flex items-start gap-3 rounded-xl border border-change/30 bg-change/10 px-4 py-3 text-sm">
        <Construction className="mt-0.5 size-4 shrink-0 text-change" aria-hidden="true" />
        <p className="text-foreground/90">
          Módulo pendiente de edición: el catálogo contiene refacciones de ejemplo para la planta.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <Card className="p-4">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">Refacciones</p>
          <p className="mt-1 font-mono text-2xl font-semibold">{REFACCIONES.length}</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">Categorías</p>
          <p className="mt-1 font-mono text-2xl font-semibold">{CATEGORIAS.length}</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">Bajo stock mínimo</p>
          <p className="mt-1 font-mono text-2xl font-semibold text-stop">{bajos}</p>
        </Card>
      </div>

      <Card>
        <div className="flex flex-col gap-3 border-b border-border p-4 sm:px-6">
          <div className="relative">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
            <Input
              type="search"
              aria-label="Buscar refacción"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar por código, nombre, equipo o ubicación…"
              className="pl-9"
            />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {[null, ...CATEGORIAS].map((c) => (
              <button
                key={c ?? 'todas'}
                type="button"
                aria-pressed={categoria === c}
                onClick={() => setCategoria(c)}
                className={cn(
                  'rounded-full border px-3 py-1 text-xs font-medium transition-colors',
                  categoria === c
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-border text-muted-foreground hover:text-foreground',
                )}
              >
                {c ?? 'Todas'}
              </button>
            ))}
            <label className="ml-auto flex items-center gap-2 text-xs text-muted-foreground">
              <input
                type="checkbox"
                checked={soloBajo}
                onChange={(e) => setSoloBajo(e.target.checked)}
                className="size-4 accent-[var(--primary)]"
              />
              Solo bajo stock
            </label>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                <th scope="col" className="px-4 py-3 font-medium sm:px-6">Código</th>
                <th scope="col" className="px-4 py-3 font-medium">Descripción</th>
                <th scope="col" className="px-4 py-3 font-medium">Categoría</th>
                <th scope="col" className="px-4 py-3 font-medium">Equipo</th>
                <th scope="col" className="px-4 py-3 font-medium">Ubicación</th>
                <th scope="col" className="px-4 py-3 text-right font-medium sm:px-6">Stock</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {results.map((r) => {
                const low = r.stock <= r.minimo
                return (
                  <tr key={r.codigo} className="hover:bg-muted/40">
                    <td className="px-4 py-3 font-mono text-xs text-primary sm:px-6">{r.codigo}</td>
                    <td className="px-4 py-3 font-medium">{r.nombre}</td>
                    <td className="px-4 py-3 text-muted-foreground">{r.categoria}</td>
                    <td className="px-4 py-3 text-muted-foreground">{r.equipo}</td>
                    <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{r.ubicacion}</td>
                    <td className="px-4 py-3 text-right sm:px-6">
                      <span
                        className={cn(
                          'inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 font-mono text-xs',
                          low ? 'border-stop/30 bg-stop/10 text-stop' : 'border-run/30 bg-run/10 text-run',
                        )}
                      >
                        {r.stock} {r.unidad}
                        <span className="text-muted-foreground">/ mín {r.minimo}</span>
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          {results.length === 0 && (
            <p className="px-6 py-12 text-center text-sm text-muted-foreground">
              No se encontraron refacciones.
            </p>
          )}
        </div>
      </Card>
    </div>
  )
}
