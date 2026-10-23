'use client'

import { useMemo, useState } from 'react'
import { Eye, MessageCircle, Pencil, Search, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, Input } from '@/components/form-controls'
import { Modal } from '@/components/modal'
import { cn } from '@/lib/utils'
import {
  RESULTADOS,
  SEVERIDADES,
  TONE_CLASS,
  formatLocalDateTime,
  resultadoLabel,
  severidadLabel,
  shareOnWhatsApp,
  type FaultReport,
} from '@/lib/reports'

function Badge({ tone, children }: { tone?: string; children: React.ReactNode }) {
  return (
    <span
      className={cn(
        'inline-flex rounded-full border px-2 py-0.5 text-xs font-medium',
        tone ? TONE_CLASS[tone] : 'border-border text-muted-foreground',
      )}
    >
      {children}
    </span>
  )
}

const shortSeveridad = (v: string) => SEVERIDADES.find((s) => s.value === v)
const shortResultado = (v: string) => RESULTADOS.find((r) => r.value === v)

export function ReportHistory({
  reports,
  onEdit,
  onDelete,
}: {
  reports: FaultReport[]
  onEdit: (r: FaultReport) => void
  onDelete: (r: FaultReport) => void
}) {
  const [query, setQuery] = useState('')
  const [viewing, setViewing] = useState<FaultReport | null>(null)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return reports
    return reports.filter((r) =>
      [r.equipo, r.tecnico, r.titulo, r.codigoAlarma, r.fabrica, String(r.folio)]
        .join(' ')
        .toLowerCase()
        .includes(q),
    )
  }, [reports, query])

  return (
    <Card>
      <div className="flex flex-col gap-3 border-b border-border px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div>
          <h2 className="text-lg font-semibold">Historial de reportes</h2>
          <p className="text-sm text-muted-foreground">{reports.length} reportes registrados</p>
        </div>
        <div className="relative sm:w-72">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            type="search"
            aria-label="Buscar en el historial"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar equipo, técnico, folio…"
            className="pl-9"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="px-6 py-12 text-center text-sm text-muted-foreground">
          {reports.length === 0 ? 'Aún no hay reportes guardados.' : 'Sin resultados para tu búsqueda.'}
        </p>
      ) : (
        <ul className="divide-y divide-border">
          {filtered.map((r) => {
            const sev = shortSeveridad(r.severidad)
            const res = shortResultado(r.resultado)
            return (
              <li key={r.id} className="flex flex-col gap-3 px-4 py-4 sm:px-6 lg:flex-row lg:items-center">
                <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs text-primary">
                      #{String(r.folio).padStart(4, '0')}
                    </span>
                    <span className="font-semibold">{r.titulo}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {r.equipo} · {r.fabrica} · {r.tecnico} · {formatLocalDateTime(r.horaParo)}
                    {r.minutosParo !== null && ` · ${r.minutosParo} min`}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {sev && <Badge tone={sev.tone}>{sev.label.split(' - ')[0]}</Badge>}
                    {res && <Badge tone={res.tone}>{res.label.split(' - ')[0].split(' / ')[0]}</Badge>}
                    {r.tipos.map((t) => (
                      <Badge key={t}>{t}</Badge>
                    ))}
                  </div>
                </div>
                <div className="flex shrink-0 gap-1">
                  <Button variant="ghost" size="icon" onClick={() => setViewing(r)}>
                    <Eye aria-hidden="true" />
                    <span className="sr-only">Ver reporte {r.folio}</span>
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => onEdit(r)}>
                    <Pencil aria-hidden="true" />
                    <span className="sr-only">Editar reporte {r.folio}</span>
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => shareOnWhatsApp(r)}>
                    <MessageCircle className="text-[#25D366]" aria-hidden="true" />
                    <span className="sr-only">Compartir reporte {r.folio} por WhatsApp</span>
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => onDelete(r)}>
                    <Trash2 className="text-stop" aria-hidden="true" />
                    <span className="sr-only">Eliminar reporte {r.folio}</span>
                  </Button>
                </div>
              </li>
            )
          })}
        </ul>
      )}

      <Modal
        open={viewing !== null}
        onClose={() => setViewing(null)}
        title={viewing ? `Reporte #${String(viewing.folio).padStart(4, '0')}` : ''}
        description={viewing?.titulo}
        className="max-w-2xl"
      >
        {viewing && (
          <div className="flex flex-col gap-5">
            <dl className="grid gap-x-6 gap-y-4 sm:grid-cols-2">
              {[
                ['Fábrica', viewing.fabrica],
                ['Equipo', viewing.equipo],
                ['Técnico', viewing.tecnico],
                ['Código de alarma', viewing.codigoAlarma || '—'],
                ['Hora de paro', formatLocalDateTime(viewing.horaParo)],
                ['Hora de entrega', formatLocalDateTime(viewing.horaEntrega)],
                ['Minutos de paro', viewing.minutosParo ?? '—'],
                ['Tipo de falla', viewing.tipos.join(', ') || '—'],
                ['Severidad', severidadLabel(viewing.severidad)],
                ['Estado final', resultadoLabel(viewing.resultado)],
                ['Síntomas', viewing.sintomas || '—', true],
                ['Solución realizada', viewing.solucion || '—', true],
                ['Refacción utilizada', viewing.refaccion || '—', true],
              ].map(([label, value, wide]) => (
                <div key={String(label)} className={cn('flex flex-col gap-0.5', wide && 'sm:col-span-2')}>
                  <dt className="text-xs uppercase tracking-wide text-muted-foreground">{label}</dt>
                  <dd className="whitespace-pre-line text-sm">{value}</dd>
                </div>
              ))}
            </dl>
            <p className="font-mono text-xs text-muted-foreground">
              Creado {formatLocalDateTime(viewing.createdAt)} · Actualizado{' '}
              {formatLocalDateTime(viewing.updatedAt)}
            </p>
            <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <Button
                variant="outline"
                size="lg"
                className="h-10"
                onClick={() => {
                  onEdit(viewing)
                  setViewing(null)
                }}
              >
                <Pencil aria-hidden="true" />
                Editar
              </Button>
              <Button
                size="lg"
                className="h-10 bg-[#25D366] text-black hover:bg-[#25D366]/85"
                onClick={() => shareOnWhatsApp(viewing)}
              >
                <MessageCircle aria-hidden="true" />
                Compartir por WhatsApp
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </Card>
  )
}
