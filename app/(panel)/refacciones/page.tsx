import { PageHeader } from '@/components/page-header'
import { RefaccionesSearch } from '@/components/refacciones/refacciones-search'

export const metadata = { title: 'Búsqueda de refacciones | Control de Planta' }

export default function RefaccionesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Menú 3"
        title="Búsqueda de refacciones"
        description="Catálogo de refacciones del almacén de mantenimiento. Este módulo es una versión preliminar con datos de ejemplo y queda pendiente su edición."
      />
      <RefaccionesSearch />
    </>
  )
}
