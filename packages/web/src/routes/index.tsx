import { createFileRoute } from '@tanstack/solid-router'

export const Route = createFileRoute('/')({
  component: Home,
})

function Home() {
  return (
    <div class="flex flex-col gap-6">
      <div>
        <h1 class="text-3xl font-bold tracking-tight text-white">
          Welcome to Ice CMS
        </h1>
        <p class="mt-2 text-neutral-400">
          A modern, fast content management system built with SolidJS and Hono.
        </p>
      </div>
    </div>
  )
}
