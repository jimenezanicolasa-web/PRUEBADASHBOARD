'use client'

import { useActionState } from 'react'
import { LogIn, Loader2 } from 'lucide-react'
import { login, type LoginState } from '@/app/actions/auth'
import { Button } from '@/components/ui/button'
import { Field, Input } from '@/components/form-controls'

export function LoginForm() {
  const [state, action, pending] = useActionState<LoginState, FormData>(login, {})

  return (
    <form action={action} className="flex flex-col gap-5">
      <Field label="Usuario" htmlFor="usuario">
        <Input id="usuario" name="usuario" autoComplete="username" placeholder="admin" required />
      </Field>
      <Field label="Contraseña" htmlFor="contrasena">
        <Input
          id="contrasena"
          name="contrasena"
          type="password"
          autoComplete="current-password"
          placeholder="••••••"
          required
        />
      </Field>

      {state.error && (
        <p role="alert" className="rounded-lg border border-stop/30 bg-stop/10 px-3 py-2 text-sm text-stop">
          {state.error}
        </p>
      )}

      <Button type="submit" size="lg" disabled={pending} className="h-10">
        {pending ? (
          <Loader2 className="animate-spin" aria-hidden="true" />
        ) : (
          <LogIn aria-hidden="true" />
        )}
        {pending ? 'Ingresando…' : 'Iniciar sesión'}
      </Button>
    </form>
  )
}
