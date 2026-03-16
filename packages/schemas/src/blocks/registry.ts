import { solutionSectionMeta } from './solution-section'
import { faqSectionMeta } from './faq-section'
import { contactSectionMeta } from './contact-section'
import { z } from 'zod'
import type { Lang } from '../base'

// --- Block registry entry ---
export type BlockMeta<T extends z.ZodTypeAny = z.ZodTypeAny> = {
  id: string
  type: string
  label: string
  description: string
  icon: string
  schema: T
  defaultData: () => z.infer<T>
}

// --- All registered blocks ---
export const blockRegistry = [
  solutionSectionMeta,
  faqSectionMeta,
  contactSectionMeta,
] as const satisfies readonly BlockMeta[]

// --- Lookup by type ---
export type RegisteredBlockType = (typeof blockRegistry)[number]['type']

export function getBlockMeta(type: string): BlockMeta | undefined {
  return blockRegistry.find((b) => b.type === type)
}

// --- Full block (as stored in DB / returned by API) ---
export type Block<T = unknown> = {
  id: string
  type: RegisteredBlockType
  order: number
  enabled: boolean
  data: Partial<Record<Lang, T>>
}

// --- Page shape (full JSON for Astro) ---
export type PageData = {
  meta: Partial<Record<Lang, Record<string, string>>>
  layout: Partial<Record<Lang, Record<string, unknown>>>
  blocks: Block[]
}
