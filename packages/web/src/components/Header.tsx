import { Link, useNavigate } from '@tanstack/solid-router'
import { createSignal, onMount, Show } from 'solid-js'
import { authStore } from '../features/auth/auth.store'

type Theme = 'light' | 'dark'

function getInitialTheme(): Theme {
  if (typeof window === 'undefined') return 'dark'
  return (localStorage.getItem('theme') as Theme) ?? 'dark'
}

export default function Header() {
  const navigate = useNavigate()
  const [theme, setTheme] = createSignal<Theme>('dark')

  const handleLogout = () => {
    authStore.logout()
    navigate({ to: '/login' })
  }

  onMount(() => {
    const saved = getInitialTheme()
    setTheme(saved)
    document.documentElement.setAttribute('data-theme', saved)
  })

  const toggleTheme = () => {
    const next: Theme = theme() === 'dark' ? 'light' : 'dark'
    setTheme(next)
    document.documentElement.setAttribute('data-theme', next)
    localStorage.setItem('theme', next)
  }

  return (
    <header class="sticky top-0 z-30 w-full border-b border-base-content/10 bg-base-100/80 backdrop-blur-md">
      <div class="mx-auto flex max-w-5xl items-center gap-4 px-6 py-3">
        {/* Logo */}
        <Link to="/" class="flex items-center gap-2 text-sm font-bold tracking-tight">
          <span class="text-lg">❄️</span>
          <span>Ice CMS</span>
        </Link>

        {/* Nav */}
        <nav class="ml-4 flex items-center gap-1">
          <Link
            to="/"
            class="rounded-lg px-3 py-1.5 text-sm font-medium opacity-60 transition hover:opacity-100 hover:bg-base-content/5"
            activeProps={{ class: 'rounded-lg px-3 py-1.5 text-sm font-medium bg-base-content/10 opacity-100' }}
          >
            Pages
          </Link>
        </nav>

        {/* Spacer */}
        <div class="flex-1" />

        {/* Logout */}
        <Show when={authStore.isAuthenticated()}>
          <button
            type="button"
            class="btn btn-ghost btn-sm opacity-60 hover:opacity-100"
            onClick={handleLogout}
          >
            Sign out
          </button>
        </Show>

        {/* Theme toggle */}
        <button
          type="button"
          class="btn btn-ghost btn-sm btn-circle"
          onClick={toggleTheme}
          title={`Switch to ${theme() === 'dark' ? 'light' : 'dark'} mode`}
        >
          {theme() === 'dark' ? (
            /* Sun */
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="4"/>
              <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>
            </svg>
          ) : (
            /* Moon */
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>
            </svg>
          )}
        </button>
      </div>
    </header>
  )
}
