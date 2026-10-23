import Image from 'next/image'
import { redirect } from 'next/navigation'
import { Factory } from 'lucide-react'
import { getSession } from '@/lib/auth'
import { LoginForm } from '@/components/login-form'

export default async function LoginPage() {
  if (await getSession()) redirect('/monitoreo')

  return (
    <main className="grid min-h-dvh lg:grid-cols-2">
      <div className="relative hidden lg:block">
        <Image
          src="/images/planta.png"
          alt="Planta industrial con líneas de producción y autoclaves"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 flex flex-col gap-3 p-10">
          <p className="font-mono text-xs uppercase tracking-widest text-primary">
            Mantenimiento industrial
          </p>
          <p className="max-w-md text-3xl font-semibold leading-tight text-balance">
            Estado de la planta, fallas y refacciones en un solo lugar.
          </p>
        </div>
      </div>

      <div className="flex items-center justify-center px-6 py-12">
        <div className="flex w-full max-w-sm flex-col gap-8">
          <div className="flex flex-col gap-4">
            <div className="flex size-11 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Factory className="size-6" aria-hidden="true" />
            </div>
            <div className="flex flex-col gap-1">
              <h1 className="text-2xl font-semibold">Control de Planta</h1>
              <p className="text-sm text-muted-foreground">
                Inicia sesión con tu usuario administrador para continuar.
              </p>
            </div>
          </div>
          <LoginForm />
        </div>
      </div>
    </main>
  )
}
