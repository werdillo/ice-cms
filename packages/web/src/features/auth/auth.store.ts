import { createSignal } from 'solid-js'

const STORAGE_KEY = 'cms_token'

const [token, setToken] = createSignal<string | null>(
  typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null
)

export const authStore = {
  token,
  isAuthenticated: () => !!token(),
  login: (newToken: string) => {
    localStorage.setItem(STORAGE_KEY, newToken)
    setToken(newToken)
  },
  logout: () => {
    localStorage.removeItem(STORAGE_KEY)
    setToken(null)
  },
}
