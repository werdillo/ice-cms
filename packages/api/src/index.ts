import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { prettyJSON } from 'hono/pretty-json'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'

const app = new Hono().basePath('/api')

// --- Middleware ---
app.use('*', logger())
app.use('*', prettyJSON())
app.use(
  '*',
  cors({
    origin: ['http://localhost:3000'],
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
)

// --- Health check ---
app.get('/health', (c) => {
  return c.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// --- Posts (example resource) ---
type Post = {
  id: string
  title: string
  body: string
  createdAt: string
}

// In-memory store for demo purposes
const posts: Post[] = [
  {
    id: '1',
    title: 'Hello Ice CMS',
    body: 'This is the first post from the Ice CMS API.',
    createdAt: new Date().toISOString(),
  },
]

const createPostSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  body: z.string().min(1, 'Body is required'),
})

const postsRouter = new Hono()

postsRouter.get('/', (c) => {
  return c.json({ data: posts, total: posts.length })
})

postsRouter.get('/:id', (c) => {
  const id = c.req.param('id')
  const post = posts.find((p) => p.id === id)

  if (!post) {
    return c.json({ error: 'Post not found' }, 404)
  }

  return c.json({ data: post })
})

postsRouter.post('/', zValidator('json', createPostSchema), (c) => {
  const body = c.req.valid('json')
  const newPost: Post = {
    id: String(posts.length + 1),
    title: body.title,
    body: body.body,
    createdAt: new Date().toISOString(),
  }

  posts.push(newPost)
  return c.json({ data: newPost }, 201)
})

postsRouter.put('/:id', zValidator('json', createPostSchema), (c) => {
  const id = c.req.param('id')
  const body = c.req.valid('json')
  const index = posts.findIndex((p) => p.id === id)

  if (index === -1) {
    return c.json({ error: 'Post not found' }, 404)
  }

  posts[index] = { ...posts[index], ...body }
  return c.json({ data: posts[index] })
})

postsRouter.delete('/:id', (c) => {
  const id = c.req.param('id')
  const index = posts.findIndex((p) => p.id === id)

  if (index === -1) {
    return c.json({ error: 'Post not found' }, 404)
  }

  const deleted = posts.splice(index, 1)[0]
  return c.json({ data: deleted })
})

// --- Mount routers ---
app.route('/posts', postsRouter)

// --- 404 fallback ---
app.notFound((c) => {
  return c.json({ error: `Route ${c.req.path} not found` }, 404)
})

// --- Error handler ---
app.onError((err, c) => {
  console.error(`[Error] ${err.message}`, err)
  return c.json({ error: 'Internal server error' }, 500)
})

const PORT = Number(process.env.PORT ?? 8000)

console.log(`🔥 Ice CMS API running on http://localhost:${PORT}`)

export default {
  port: PORT,
  fetch: app.fetch,
}
