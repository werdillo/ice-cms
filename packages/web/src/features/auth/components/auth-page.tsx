import { type Component, createSignal } from 'solid-js'
import { useNavigate } from '@tanstack/solid-router'
import { authStore } from '../auth.store'

const API_BASE = `${import.meta.env.VITE_API_URL ?? 'http://localhost:8000'}/api`

export const AuthPage: Component = () => {
  const navigate = useNavigate()
  const [username, setUsername] = createSignal('')
  const [password, setPassword] = createSignal('')
  const [error, setError] = createSignal('')
  const [loading, setLoading] = createSignal(false)

  const handleSubmit = async (e: SubmitEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username(), password: password() }),
      })

      const data = await res.json() as { success: boolean; token?: string; error?: string }

      if (!res.ok || !data.success || !data.token) {
        setError(data.error ?? 'Invalid credentials')
        return
      }

      authStore.login(data.token)
      navigate({ to: '/' })
    } catch {
      setError('Could not connect to the server')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div class="min-h-screen flex items-center justify-center bg-base-200">
      <div class="card w-full max-w-sm bg-base-100 shadow-lg">
        <div class="card-body gap-4">
          <div class="text-center">
            <h1 class="text-2xl font-bold">Ice CMS</h1>
            <p class="text-sm opacity-50 mt-1">Sign in to continue</p>
          </div>

          <form onSubmit={handleSubmit} class="flex flex-col gap-3">
            <label class="form-control">
              <div class="label">
                <span class="label-text">Username</span>
              </div>
              <input
                type="text"
                class="input input-bordered w-full"
                placeholder="admin"
                value={username()}
                onInput={(e) => setUsername(e.currentTarget.value)}
                autocomplete="username"
                required
              />
            </label>

            <label class="form-control">
              <div class="label">
                <span class="label-text">Password</span>
              </div>
              <input
                type="password"
                class="input input-bordered w-full"
                placeholder="••••••••"
                value={password()}
                onInput={(e) => setPassword(e.currentTarget.value)}
                autocomplete="current-password"
                required
              />
            </label>

            {error() && (
              <div class="alert alert-error text-sm py-2">
                {error()}
              </div>
            )}

            <button
              type="submit"
              class="btn btn-primary w-full mt-1"
              disabled={loading()}
            >
              {loading() ? <span class="loading loading-spinner loading-sm" /> : 'Sign in'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default AuthPage
