import { createFileRoute, redirect } from '@tanstack/solid-router'
import { AuthPage } from '../features/auth/components/auth-page'
import { authStore } from '../features/auth/auth.store'

export const Route = createFileRoute('/login')({
  beforeLoad: () => {
    if (authStore.isAuthenticated()) {
      throw redirect({ to: '/' })
    }
  },
  component: AuthPage,
})
