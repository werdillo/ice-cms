import { authStore } from '../features/auth/auth.store'

export async function apiFetch(input: string, init?: RequestInit): Promise<Response> {
  const token = authStore.token()
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(init?.headers as Record<string, string> | undefined),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }
  return fetch(input, { ...init, headers })
}
