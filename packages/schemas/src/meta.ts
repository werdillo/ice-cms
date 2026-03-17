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
})
export type Meta = z.infer<typeof metaSchema>

// --- Page Meta (for meta-editor) ---
export const pageMetaSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(10, 'Description should be at least 10 characters'),
  keywords: z.array(z.string()).min(1, 'At least one keyword is required'),
  ogTitle: z.string().optional(),
  ogDescription: z.string().optional(),
  ogImage: z.string().url().optional(),
  canonicalUrl: z.string().url().optional(),
  robots: z.string().optional(),
})
export type PageMeta = z.infer<typeof pageMetaSchema>

// --- Meta per lang ---
export const metaByLangSchema = z.record(langSchema, metaSchema)
export type MetaByLang = z.infer<typeof metaByLangSchema>

// --- Default empty meta ---
export const emptyMeta = (): Meta => ({
  title: '',
  description: '',
  keywords: '',
  ogTitle: '',
  ogDescription: '',
  ogImage: '',
  canonicalUrl: '',
})
