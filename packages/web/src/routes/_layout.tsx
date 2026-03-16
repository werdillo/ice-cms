import { createFileRoute, Outlet } from '@tanstack/solid-router'

export const Route = createFileRoute('/_layout')({
  component: Layout,
})

function Header() {
  return (
    <header class="w-full border-b border-neutral-800 bg-neutral-950 px-6 py-4">
      <div class="mx-auto flex max-w-5xl items-center justify-between">
        <span class="text-lg font-semibold tracking-tight text-white">
          ❄️ Ice CMS
        </span>
        <nav class="flex gap-6 text-sm text-neutral-400">
          <a href="/" class="transition hover:text-white">
            Home
          </a>
        </nav>
      </div>
    </header>
  )
}

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

function Layout() {
  return (
    <div class="flex min-h-screen flex-col bg-neutral-900 text-white">
      <Header />
      <main class="mx-auto w-full max-w-5xl flex-1 px-6 py-8">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
