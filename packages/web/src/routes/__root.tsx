import { Outlet, createRootRoute } from '@tanstack/solid-router'
import { TanStackRouterDevtools } from '@tanstack/solid-router-devtools'
import Header from '../components/Header'

import '../styles.css'

export const Route = createRootRoute({
  component: RootComponent,
})

function Footer() {
  return (
    <footer class="w-full border-t border-neutral-800 bg-neutral-950 px-6 py-4">
      <div class="mx-auto flex max-w-5xl items-center justify-between text-xs text-neutral-500">
        <span>© {new Date().getFullYear()} Ice CMS</span>
        <span>Built with SolidJS + Hono</span>
      </div>
    </footer>
  )
}

function RootComponent() {
  return (
    <div class="flex min-h-screen flex-col">
      <Header />
      <main class="flex-1">
        <Outlet />
      </main>
      <Footer />
      <TanStackRouterDevtools position="bottom-right" />
    </div>
  )
}
