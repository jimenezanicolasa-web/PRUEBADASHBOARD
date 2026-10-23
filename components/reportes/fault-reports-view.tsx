'use client'

import { useRef, useState } from 'react'
import { EMPTY_DRAFT, reportStore, type FaultReport, type FaultReportDraft } from '@/lib/reports'
import { FaultReportForm } from './fault-report-form'
import { ReportHistory } from './report-history'

export function FaultReportsView() {
  const [reports, setReports] = reportStore.useStore()
  const [draft, setDraft] = useState<FaultReportDraft>(EMPTY_DRAFT)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)
  const formTop = useRef<HTMLDivElement>(null)

  const editing = reports.find((r) => r.id === editingId) ?? null

  function flash(message: string) {
    setNotice(message)
    window.setTimeout(() => setNotice(null), 3500)
  }

  function save() {
    const now = new Date().toISOString()
    if (editing) {
      setReports((prev) =>
        prev.map((r) => (r.id === editing.id ? { ...r, ...draft, updatedAt: now } : r)),
      )
      flash(`Reporte #${String(editing.folio).padStart(4, '0')} actualizado.`)
    } else {
      const folio = reports.reduce((max, r) => Math.max(max, r.folio), 0) + 1
      const report: FaultReport = {
        ...draft,
        id: crypto.randomUUID(),
        folio,
        createdAt: now,
        updatedAt: now,
      }
      setReports((prev) => [report, ...prev])
      flash(`Reporte #${String(folio).padStart(4, '0')} guardado.`)
    }
    setDraft(EMPTY_DRAFT)
    setEditingId(null)
  }

  function startEdit(report: FaultReport) {
    const { id: _id, folio: _folio, createdAt: _c, updatedAt: _u, ...rest } = report
    setDraft(rest)
    setEditingId(report.id)
    formTop.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  function cancelEdit() {
    setDraft(EMPTY_DRAFT)
    setEditingId(null)
  }

  function remove(report: FaultReport) {
    if (!confirm(`¿Eliminar el reporte #${String(report.folio).padStart(4, '0')}? Esta acción no se puede deshacer.`))
      return
    setReports((prev) => prev.filter((r) => r.id !== report.id))
    if (editingId === report.id) cancelEdit()
    flash('Reporte eliminado.')
  }

  return (
    <div className="flex flex-col gap-8 px-4 py-6 sm:px-6 lg:px-8">
      <div ref={formTop} className="scroll-mt-4">
        <FaultReportForm
          draft={draft}
          onChange={setDraft}
          onSave={save}
          onCancelEdit={cancelEdit}
          editingFolio={editing?.folio ?? null}
          reports={reports}
        />
      </div>

      <ReportHistory reports={reports} onEdit={startEdit} onDelete={remove} />

      <div aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-4 flex justify-center px-4">
        {notice && (
          <p className="pointer-events-auto rounded-lg border border-run/30 bg-card px-4 py-2.5 text-sm font-medium text-run shadow-xl">
            {notice}
          </p>
        )}
      </div>
    </div>
  )
}
