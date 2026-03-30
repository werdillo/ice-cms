import { Hono } from 'hono'
import { createAuthMiddleware } from '../auth'
import { r2S3Put, r2S3Delete, type R2S3Config } from './r2-s3'

export type StorageEnv = {
  STORAGE: R2Bucket
  JWT_SECRET: string
  R2_PUBLIC_BASE_URL: string
  ENVIRONMENT?: string
  R2_ACCOUNT_ID?: string
  R2_ACCESS_KEY_ID?: string
  R2_SECRET_ACCESS_KEY?: string
  R2_BUCKET_NAME?: string
}

const storageRoute = new Hono<{ Bindings: StorageEnv }>()

// Protect upload
storageRoute.use('/upload', async (c, next) =>
  createAuthMiddleware(() => c.env.JWT_SECRET)(c, next)
)

// POST /api/storage/upload
storageRoute.post('/upload', async (c) => {
  console.log('[storage] POST /upload — start')

  // --- Parse multipart ---
  let formData: FormData
  try {
    formData = await c.req.formData()
  } catch (err) {
    console.error('[storage] Failed to parse formData:', err)
    return c.json({ success: false, error: 'Expected multipart/form-data' }, 400)
  }

  const entry = formData.get('file')
  if (typeof entry === 'string' || entry === null) {
    console.error('[storage] No file field in formData')
    return c.json({ success: false, error: 'Missing file field' }, 400)
  }

  // Optional: key of the old object to delete after successful upload
  const oldKeyEntry = formData.get('oldKey')
  const oldKey = typeof oldKeyEntry === 'string' && oldKeyEntry.trim() ? oldKeyEntry.trim() : null
  if (oldKey) console.log(`[storage] oldKey to delete after upload: ${oldKey}`)

  const file = entry as unknown as File
  console.log(`[storage] file: name=${file.name} type=${file.type} size=${file.size}`)

  // --- Build R2 key ---
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_')
  const key = `uploads/${Date.now()}-${safeName}`
  console.log(`[storage] key: ${key}`)

  // --- Read buffer ---
  let buffer: ArrayBuffer
  try {
    buffer = await file.arrayBuffer()
  } catch (err) {
    console.error('[storage] Failed to read file buffer:', err)
    return c.json({ success: false, error: 'Failed to read file' }, 500)
  }

  const contentType = file.type || 'application/octet-stream'

  // --- Check if S3 credentials are available (works in dev and prod) ---
  const s3Config: R2S3Config | null =
    c.env.R2_ACCOUNT_ID && c.env.R2_ACCESS_KEY_ID && c.env.R2_SECRET_ACCESS_KEY
      ? {
          accountId: c.env.R2_ACCOUNT_ID,
          accessKeyId: c.env.R2_ACCESS_KEY_ID,
          secretAccessKey: c.env.R2_SECRET_ACCESS_KEY,
          bucketName: c.env.R2_BUCKET_NAME ?? 'cms-bucket',
        }
      : null

  if (s3Config) {
    // --- Upload via S3 API directly → always writes to the real bucket ---
    console.log('[storage] using S3 API (direct upload to real R2 bucket)')
    try {
      await r2S3Put(s3Config, key, buffer, contentType)
      console.log(`[storage] S3 put OK: ${key}`)
    } catch (err) {
      console.error('[storage] S3 put failed:', err)
      return c.json({
        success: false,
        error: `S3 put failed: ${err instanceof Error ? err.message : String(err)}`,
      }, 500)
    }

    // Always return real public URL when using S3 API
    if (!c.env.R2_PUBLIC_BASE_URL) {
      console.error('[storage] R2_PUBLIC_BASE_URL is not set')
      return c.json({ success: false, error: 'R2_PUBLIC_BASE_URL not configured' }, 500)
    }
    const base = c.env.R2_PUBLIC_BASE_URL.replace(/\/$/, '')
    const url = `${base}/${key}`
    console.log(`[storage] returning public url: ${url}`)

    // --- Delete old object if provided ---
    if (oldKey) {
      try {
        await r2S3Delete(s3Config, oldKey)
        console.log(`[storage] S3 deleted old object: ${oldKey}`)
      } catch (err) {
        // Non-fatal: log but don't fail the request
        console.warn(`[storage] S3 delete old object failed (non-fatal): ${err instanceof Error ? err.message : String(err)}`)
      }
    }

    return c.json({ success: true, url, key })
  }

  // --- Fallback: use R2 binding (local mock in wrangler dev without --remote) ---
  console.log('[storage] S3 credentials not set — falling back to R2 binding (local mock)')

  if (!c.env.STORAGE) {
    console.error('[storage] c.env.STORAGE is undefined — R2 binding missing')
    return c.json({ success: false, error: 'R2 binding not configured' }, 500)
  }

  try {
    await c.env.STORAGE.put(key, buffer, {
      httpMetadata: { contentType },
    })
    console.log(`[storage] R2 binding put OK: ${key}`)
  } catch (err) {
    console.error('[storage] R2 binding put failed:', err)
    return c.json({
      success: false,
      error: `R2 put failed: ${err instanceof Error ? err.message : String(err)}`,
    }, 500)
  }

  // Serve via proxy since the binding uses a local mock in dev
  const reqUrl = new URL(c.req.url)
  const origin = `${reqUrl.protocol}//${reqUrl.host}`
  const url = `${origin}/api/storage/${key}`
  console.log(`[storage] local binding — proxy url: ${url}`)

  // --- Delete old object from local binding if provided ---
  if (oldKey) {
    try {
      await c.env.STORAGE.delete(oldKey)
      console.log(`[storage] binding deleted old object: ${oldKey}`)
    } catch (err) {
      console.warn(`[storage] binding delete old object failed (non-fatal): ${err instanceof Error ? err.message : String(err)}`)
    }
  }

  return c.json({ success: true, url, key })
})

// GET /api/storage/:key — serve from R2 binding (local mock fallback)
storageRoute.get('/:key{.+}', async (c) => {
  const key = c.req.param('key')

  if (!c.env.STORAGE) {
    return c.json({ success: false, error: 'R2 binding not configured' }, 500)
  }

  const object = await c.env.STORAGE.get(key)

  if (!object) {
    return c.json({ success: false, error: 'Not found' }, 404)
  }

  const headers = new Headers()
  object.writeHttpMetadata(headers)
  headers.set('etag', object.httpEtag)
  headers.set('cache-control', 'public, max-age=31536000, immutable')

  return new Response(object.body, { headers })
})

// GET /api/storage/health — diagnose binding and env vars (no auth)
storageRoute.get('/health', async (c) => {
  const hasStorage = !!c.env.STORAGE
  const hasSecret = !!c.env.JWT_SECRET
  const publicUrl = c.env.R2_PUBLIC_BASE_URL ?? '(not set)'
  const environment = c.env.ENVIRONMENT ?? '(not set)'
  const hasS3Creds = !!(c.env.R2_ACCOUNT_ID && c.env.R2_ACCESS_KEY_ID && c.env.R2_SECRET_ACCESS_KEY)

  let writeTest: string
  if (hasStorage) {
    try {
      await c.env.STORAGE.put('__health_check', 'ok', {
        httpMetadata: { contentType: 'text/plain' },
      })
      writeTest = 'ok'
    } catch (err) {
      writeTest = `FAILED: ${err instanceof Error ? err.message : String(err)}`
    }
  } else {
    writeTest = 'skipped — STORAGE binding missing'
  }

  return c.json({
    storage_binding: hasStorage ? 'ok' : 'MISSING',
    s3_credentials: hasS3Creds ? 'ok' : 'MISSING — add R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY to .dev.vars',
    jwt_secret: hasSecret ? 'ok' : 'MISSING',
    r2_public_base_url: publicUrl,
    environment,
    r2_write_test: writeTest,
  })
})

export { storageRoute }
export default storageRoute
