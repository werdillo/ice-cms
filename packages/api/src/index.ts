import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'

import { contentApp } from './feature/content'
import { authRoute, createAuthMiddleware } from './feature/auth'
import { storageRoute } from './feature/storage'

export type Env = {
  STORAGE: R2Bucket
  ENVIRONMENT: string
  DEPLOY_HOOK_URL: string
  GITHUB_TOKEN: string
  GITHUB_OWNER: string
  GITHUB_REPO: string
  GITHUB_BRANCH?: string
  FRONTEND_CONTENT_PATH?: string
  ADMIN_USERNAME: string
  ADMIN_PASSWORD: string
  JWT_SECRET: string
  R2_PUBLIC_BASE_URL: string
}

const app = new Hono<{ Bindings: Env }>()

// --- Middleware ---
app.use('*', logger())
app.use(
  '*',
  cors({
    origin: (origin) => {
      if (!origin) return '*'
      if (
        origin.startsWith('http://localhost') ||
        origin.endsWith('.pages.dev') ||
        origin.endsWith('.workers.dev')
      ) {
        return origin
      }
      return null
    },
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
)

// --- Health check (public) ---
app.get('/api/health', (c) => {
  return c.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// --- Auth (public) ---
app.route('/api/auth', authRoute)

// --- Protected middleware ---
app.use('/api/content/*', async (c, next) => {
  return createAuthMiddleware(() => c.env.JWT_SECRET)(c, next)
})
app.use('/api/publish', async (c, next) => {
  return createAuthMiddleware(() => c.env.JWT_SECRET)(c, next)
})


// --- Publish (trigger Astro rebuild) ---
app.post('/api/publish', async (c) => {
  const webhookUrl = c.env.DEPLOY_HOOK_URL

  if (!webhookUrl) {
    return c.json({ error: 'DEPLOY_HOOK_URL is not configured' }, 500)
  }

  const res = await fetch(webhookUrl, { method: 'POST' })

  if (!res.ok) {
    return c.json({ error: 'Deploy hook failed', status: res.status }, 502)
  }

  return c.json({ success: true, message: 'Deploy triggered' })
})

// --- Content ---
app.route('/api/content', contentApp)

// --- Storage ---
app.route('/api/storage', storageRoute)



// --- 404 fallback ---
app.notFound((c) => {
  return c.json({ error: `Route ${c.req.path} not found` }, 404)
})

// --- Error handler ---
app.onError((err, c) => {
  console.error(`[Error] ${err.message}`, err)
  return c.json({ error: 'Internal server error' }, 500)
})

export default {
  fetch: app.fetch,
} satisfies ExportedHandler<Env>
