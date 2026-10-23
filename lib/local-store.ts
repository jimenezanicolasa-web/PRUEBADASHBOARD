import { useSyncExternalStore } from 'react'

type Updater<T> = T | ((prev: T) => T)

export function createLocalStore<T>(key: string, initial: T) {
  const listeners = new Set<() => void>()
  let cachedRaw: string | null | undefined
  let cachedValue: T = initial

  function get(): T {
    if (typeof window === 'undefined') return initial
    const raw = window.localStorage.getItem(key)
    if (raw !== cachedRaw) {
      cachedRaw = raw
      try {
        cachedValue = raw ? (JSON.parse(raw) as T) : initial
      } catch {
        cachedValue = initial
      }
    }
    return cachedValue
  }

  function set(updater: Updater<T>) {
    const next =
      typeof updater === 'function' ? (updater as (prev: T) => T)(get()) : updater
    window.localStorage.setItem(key, JSON.stringify(next))
    listeners.forEach((listener) => listener())
  }

  function subscribe(listener: () => void) {
    listeners.add(listener)
    const onStorage = (event: StorageEvent) => {
      if (event.key === key) listener()
    }
    window.addEventListener('storage', onStorage)
    return () => {
      listeners.delete(listener)
      window.removeEventListener('storage', onStorage)
    }
  }

  function useStore() {
    const value = useSyncExternalStore(subscribe, get, () => initial)
    return [value, set] as const
  }

  return { get, set, useStore }
}
