import { z } from 'zod'
import { langSchema } from './base'

// --- Meta (SEO) ---
export const metaSchema = z.object({
  title: z.string().default(''),
  description: z.string().default(''),
  keywords: z.string().default(''),
  ogTitle: z.string().default(''),
  ogDescription: z.string().default(''),
  ogImage: z.string().default(''),
  canonicalUrl: z.string().default(''),
  robots: z.string().default(''),
})
export type Meta = z.infer<typeof metaSchema>

// --- Meta per lang ---
export const metaByLangSchema = z.record(langSchema, metaSchema)
export type MetaByLang = z.infer<typeof metaByLangSchema>
