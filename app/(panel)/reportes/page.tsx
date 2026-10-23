import { PageHeader } from '@/components/page-header'
import { FaultReportsView } from '@/components/reportes/fault-reports-view'

export const metadata = { title: 'Reporte de fallas | Control de Planta' }

export default function ReportesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Menú 2"
        title="Crear reporte de fallas"
        description="Registra paros de equipo, su causa, la solución aplicada y el estado en que se entrega la máquina. Los reportes se guardan en la base de datos local de este dispositivo."
      />
      <FaultReportsView />
    </>
  )
}
