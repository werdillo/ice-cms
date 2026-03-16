import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { createDb } from './db'

export type Env = {
  DB: D1Database
  ENVIRONMENT: string
  DEPLOY_HOOK_URL: string
}

const app = new Hono<{ Bindings: Env }>()

// --- Middleware ---
app.use('*', logger())
app.use(
  '*',
  cors({
    origin: ['http://localhost:3000', 'https://ice-cms.pages.dev'],
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
)

// --- Health check ---
app.get('/api/health', (c) => {
  return c.json({ status: 'ok', timestamp: new Date().toISOString() })
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

// --- Pages ---
app.get('/api/pages', async (c) => {
  const db = createDb(c.env.DB)
  const pages = await db.query.pages.findMany()
  return c.json({ data: pages })
})

app.get('/api/pages/:slug', async (c) => {
  const slug = c.req.param('slug')
  const db = createDb(c.env.DB)

  const page = await db.query.pages.findFirst({
    where: (pages, { eq }) => eq(pages.slug, slug),
  })

  if (!page) {
    return c.json({ error: 'Page not found' }, 404)
  }

  const [meta, layout, blocks] = await Promise.all([
    db.query.pageMeta.findMany({
      where: (m, { eq }) => eq(m.pageId, page.id),
    }),
    db.query.pageLayout.findMany({
      where: (l, { eq }) => eq(l.pageId, page.id),
    }),
    db.query.blocks.findMany({
      where: (b, { eq }) => eq(b.pageId, page.id),
      orderBy: (b, { asc }) => [asc(b.order)],
    }),
  ])

  const blockIds = blocks.map((b) => b.id)
  const translations =
    blockIds.length > 0
      ? await db.query.blockTranslations.findMany({
          where: (t, { inArray }) => inArray(t.blockId, blockIds),
        })
      : []

  // Shape into final JSON for Astro
  const metaByLang = Object.fromEntries(
    meta.map((m) => [m.lang, { ...m, id: undefined, pageId: undefined, lang: undefined }])
  )

  const layoutByLang = Object.fromEntries(
    layout.map((l) => [
      l.lang,
      {
        header: JSON.parse(l.header),
        footer: JSON.parse(l.footer),
        sidebar: JSON.parse(l.sidebar),
      },
    ])
  )

  const blocksFormatted = blocks.map((block) => {
    const blockTranslations = translations.filter((t) => t.blockId === block.id)
    const data = Object.fromEntries(
      blockTranslations.map((t) => [t.lang, JSON.parse(t.data)])
    )
    return {
      id: block.id,
      type: block.type,
      order: block.order,
      enabled: block.enabled,
      data,
    }
  })

  return c.json({
    data: {
      meta: metaByLang,
      layout: layoutByLang,
      blocks: blocksFormatted,
    },
  })
})

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
