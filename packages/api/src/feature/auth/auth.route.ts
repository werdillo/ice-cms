import { Hono } from 'hono'
import { sign } from 'hono/jwt'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'

export type AuthEnv = {
  ADMIN_USERNAME: string
  ADMIN_PASSWORD: string
  JWT_SECRET: string
}

const loginSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
})

const authRoute = new Hono<{ Bindings: AuthEnv }>()

authRoute.post('/login', zValidator('json', loginSchema), async (c) => {
  const { username, password } = c.req.valid('json')

  if (
    username !== c.env.ADMIN_USERNAME ||
    password !== c.env.ADMIN_PASSWORD
  ) {
    return c.json({ success: false, error: 'Invalid credentials' }, 401)
  }

  const token = await sign(
    {
      sub: username,
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24, // 24 hours
    },
    c.env.JWT_SECRET
  )

  return c.json({ success: true, token })
})

export { authRoute }
export default authRoute
