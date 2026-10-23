'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { SESSION_COOKIE, createSessionToken, verifyCredentials } from '@/lib/auth'

export type LoginState = { error?: string }

export async function login(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const user = String(formData.get('usuario') ?? '').trim()
  const password = String(formData.get('contrasena') ?? '')

  if (!user || !password) {
    return { error: 'Ingresa usuario y contraseña.' }
  }

  if (!verifyCredentials(user, password)) {
    return { error: 'Usuario o contraseña incorrectos.' }
  }

  const { token, expires } = createSessionToken(user)
  const store = await cookies()
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    path: '/',
    expires,
  })

  redirect('/monitoreo')
}

export async function logout() {
  const store = await cookies()
  store.delete(SESSION_COOKIE)
  redirect('/login')
}
