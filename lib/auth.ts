import { createHmac, timingSafeEqual } from 'node:crypto'
import { cookies } from 'next/headers'

export const SESSION_COOKIE = 'planta_session'
const SESSION_DURATION_MS = 1000 * 60 * 60 * 12
const SECRET = process.env.SESSION_SECRET ?? 'control-planta-session-secret'

const ADMIN_USER = 'admin'
const ADMIN_PASSWORD = 'admin'

function sign(payload: string) {
  return createHmac('sha256', SECRET).update(payload).digest('hex')
}

function safeEqual(a: string, b: string) {
  const bufA = Buffer.from(a)
  const bufB = Buffer.from(b)
  return bufA.length === bufB.length && timingSafeEqual(bufA, bufB)
}

export function verifyCredentials(user: string, password: string) {
  return safeEqual(user, ADMIN_USER) && safeEqual(password, ADMIN_PASSWORD)
}

export function createSessionToken(user: string) {
  const expires = Date.now() + SESSION_DURATION_MS
  const payload = `${user}.${expires}`
  return { token: `${payload}.${sign(payload)}`, expires: new Date(expires) }
}

export async function getSession() {
  const store = await cookies()
  const token = store.get(SESSION_COOKIE)?.value
  if (!token) return null
  const parts = token.split('.')
  if (parts.length !== 3) return null
  const [user, expires, signature] = parts
  if (!safeEqual(signature, sign(`${user}.${expires}`))) return null
  if (Number(expires) < Date.now()) return null
  return { user }
}
