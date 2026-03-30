import { z } from 'zod'

// --- Languages ---
export const LANGS = ['en', 'lv'] as const
export type Lang = (typeof LANGS)[number]

export const langSchema = z.enum(LANGS)

// --- Image ---
// .describe('image') is used by the schema-form to render an ImageInput
export const imageSchema = z.object({
  src: z.string().default(''),
  alt: z.string().default(''),
}).describe('image')
export type Image = z.infer<typeof imageSchema>

// --- Link ---
export const linkSchema = z.object({
  label: z.string().min(1),
  href: z.string().min(1),
  target: z.enum(['_self', '_blank']).default('_self'),
})
export type Link = z.infer<typeof linkSchema>

// --- Button ---
export const buttonSchema = z.object({
  label: z.string().min(1),
  href: z.string().min(1),
  variant: z.enum(['primary', 'secondary', 'outline', 'ghost']).default('primary'),
  target: z.enum(['_self', '_blank']).default('_self'),
})
export type Button = z.infer<typeof buttonSchema>
