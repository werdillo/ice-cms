import { verify } from 'hono/jwt'
import type { MiddlewareHandler } from 'hono'

export function createAuthMiddleware(getSecret: () => string): MiddlewareHandler {
  return async (c, next) => {
    const authHeader = c.req.header('Authorization')

    if (!authHeader?.startsWith('Bearer ')) {
      return c.json({ success: false, error: 'Unauthorized' }, 401)
    }

    const token = authHeader.slice(7)

    try {
      await verify(token, getSecret(), 'HS256')
      await next()
    } catch {
      return c.json({ success: false, error: 'Invalid or expired token' }, 401)
    }
  }
}
