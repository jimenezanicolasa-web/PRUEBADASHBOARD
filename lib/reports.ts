import { createLocalStore } from './local-store'

export const FABRICAS = ['Fábrica WET', 'Fábrica DRY'] as const

export const TIPOS_FALLA = [
  'Mecánica',
  'Eléctrica',
  'Neumática',
  'Hidráulica',
  'PLC / Control',
  'Térmica',
  'Operación',
  'Lubricación',
] as const

export const SEVERIDADES = [
  { value: 'baja', label: 'Baja - Menor / Ajuste rápido sin detener línea', tone: 'run' },
  { value: 'media', label: 'Media - Paro parcial / Velocidad reducida', tone: 'change' },
  { value: 'alta', label: 'Alta - Reemplazo de componente mayor', tone: 'orange' },
  { value: 'critica', label: 'Paro total / Crítico', tone: 'stop' },
] as const

export const RESULTADOS = [
  { value: 'operativo', label: 'Operativo 100% - En marcha y entregado', tone: 'run' },
  { value: 'observacion', label: 'En observación / Operativo con restricciones', tone: 'change' },
  { value: 'parado', label: 'Parado / Crítico - En espera de refacción', tone: 'stop' },
] as const

export type Severidad = (typeof SEVERIDADES)[number]['value']
export type Resultado = (typeof RESULTADOS)[number]['value']

export type FaultReport = {
  id: string
  folio: number
  createdAt: string
  updatedAt: string
  fabrica: string
  horaParo: string
  horaEntrega: string
  minutosParo: number | null
  tecnico: string
  equipo: string
  codigoAlarma: string
  titulo: string
  sintomas: string
  tipos: string[]
  solucion: string
  refaccion: string
  severidad: Severidad | ''
  resultado: Resultado | ''
}

export type FaultReportDraft = Omit<FaultReport, 'id' | 'folio' | 'createdAt' | 'updatedAt'>

export const EMPTY_DRAFT: FaultReportDraft = {
  fabrica: '',
  horaParo: '',
  horaEntrega: '',
  minutosParo: null,
  tecnico: '',
  equipo: '',
  codigoAlarma: '',
  titulo: '',
  sintomas: '',
  tipos: [],
  solucion: '',
  refaccion: '',
  severidad: '',
  resultado: '',
}

export const reportStore = createLocalStore<FaultReport[]>('planta.reportes-fallas.v1', [])

export function severidadLabel(value: string) {
  return SEVERIDADES.find((s) => s.value === value)?.label ?? '—'
}

export function resultadoLabel(value: string) {
  return RESULTADOS.find((r) => r.value === value)?.label ?? '—'
}

export const TONE_CLASS: Record<string, string> = {
  run: 'bg-run/15 text-run border-run/30',
  change: 'bg-change/15 text-change border-change/30',
  orange: 'bg-orange-400/15 text-orange-300 border-orange-400/30',
  stop: 'bg-stop/15 text-stop border-stop/30',
}

export function minutesBetween(start: string, end: string) {
  if (!start || !end) return null
  const diff = (new Date(end).getTime() - new Date(start).getTime()) / 60000
  return Number.isFinite(diff) && diff >= 0 ? Math.round(diff) : null
}

export function formatLocalDateTime(value: string) {
  if (!value) return '—'
  return new Date(value).toLocaleString('es-MX', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function reportToText(r: FaultReportDraft & { folio?: number }) {
  const lines = [
    `*REPORTE DE FALLA${r.folio ? ` #${String(r.folio).padStart(4, '0')}` : ''}*`,
    '',
    `*Fábrica:* ${r.fabrica || '—'}`,
    `*Equipo:* ${r.equipo || '—'}`,
    `*Técnico:* ${r.tecnico || '—'}`,
    '',
    `*Hora de paro:* ${formatLocalDateTime(r.horaParo)}`,
    `*Hora de entrega:* ${formatLocalDateTime(r.horaEntrega)}`,
    `*Minutos de paro:* ${r.minutosParo ?? '—'}`,
    '',
    `*Código de alarma:* ${r.codigoAlarma || '—'}`,
    `*Falla:* ${r.titulo || '—'}`,
    `*Síntomas:* ${r.sintomas || '—'}`,
    `*Tipo de falla:* ${r.tipos.length ? r.tipos.join(', ') : '—'}`,
    '',
    `*Solución:* ${r.solucion || '—'}`,
    `*Refacción utilizada:* ${r.refaccion || '—'}`,
    `*Severidad:* ${severidadLabel(r.severidad)}`,
    `*Estado final:* ${resultadoLabel(r.resultado)}`,
  ]
  return lines.join('\n')
}

export function shareOnWhatsApp(r: FaultReportDraft & { folio?: number }) {
  const url = `https://wa.me/?text=${encodeURIComponent(reportToText(r))}`
  window.open(url, '_blank', 'noopener,noreferrer')
}

export async function exportReportsPdf(reports: FaultReport[]) {
  const [{ jsPDF }, { default: autoTable }] = await Promise.all([
    import('jspdf'),
    import('jspdf-autotable'),
  ])
  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' })
  const generated = new Date().toLocaleString('es-MX')

  doc.setFontSize(16)
  doc.text('Historial de reportes de fallas', 14, 16)
  doc.setFontSize(9)
  doc.setTextColor(110)
  doc.text(`Generado: ${generated}  ·  Total de reportes: ${reports.length}`, 14, 22)

  autoTable(doc, {
    startY: 27,
    head: [
      [
        'Folio',
        'Fábrica',
        'Equipo',
        'Técnico',
        'Paro / Entrega',
        'Min',
        'Alarma',
        'Falla y síntomas',
        'Tipo',
        'Solución / Refacción',
        'Severidad',
        'Estado final',
      ],
    ],
    body: reports.map((r) => [
      String(r.folio).padStart(4, '0'),
      r.fabrica,
      r.equipo,
      r.tecnico,
      `${formatLocalDateTime(r.horaParo)}\n${formatLocalDateTime(r.horaEntrega)}`,
      r.minutosParo ?? '—',
      r.codigoAlarma || '—',
      `${r.titulo}${r.sintomas ? `\n${r.sintomas}` : ''}`,
      r.tipos.join(', ') || '—',
      `${r.solucion || '—'}${r.refaccion ? `\nRef: ${r.refaccion}` : ''}`,
      severidadLabel(r.severidad),
      resultadoLabel(r.resultado),
    ]),
    styles: { fontSize: 7, cellPadding: 1.8, valign: 'top' },
    headStyles: { fillColor: [24, 32, 44], textColor: 255, fontStyle: 'bold' },
    alternateRowStyles: { fillColor: [244, 246, 249] },
    columnStyles: {
      0: { cellWidth: 12 },
      5: { cellWidth: 10, halign: 'right' },
      7: { cellWidth: 45 },
      9: { cellWidth: 45 },
    },
  })

  doc.save(`reportes-fallas-${new Date().toISOString().slice(0, 10)}.pdf`)
}
