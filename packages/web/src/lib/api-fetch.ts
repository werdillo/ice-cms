import { authStore } from '../features/auth/auth.store'

export async function apiFetch(input: string, init?: RequestInit): Promise<Response> {
  const token = authStore.token()
  const isFormData = init?.body instanceof FormData
  const headers: HeadersInit = {
    ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
    ...(init?.headers as Record<string, string> | undefined),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }
  return fetch(input, { ...init, headers })
}
