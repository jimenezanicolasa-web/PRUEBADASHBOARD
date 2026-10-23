import { PageHeader } from '@/components/page-header'
import { MonitoreoView } from '@/components/monitoreo/monitoreo-view'

export const metadata = { title: 'Monitoreo de planta | Control de Planta' }

export default function MonitoreoPage() {
  return (
    <>
      <PageHeader
        eyebrow="Menú 1"
        title="Monitoreo de planta"
        description="Estado en tiempo real de los 4 sectores de la fábrica. Verde: en marcha · Amarillo: cambio de formato · Rojo: máquina parada."
      />
      <MonitoreoView />
    </>
  )
}
