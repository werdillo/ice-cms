import { z } from 'zod'
import { imageSchema } from '../base'

export const SOLUTION_SECTION_ID = '__solution-section' as const

export const solutionItemSchema = z.object({
  title: z.string().default(''),
  description: z.string().default(''),
  image: imageSchema,
})
export type SolutionItem = z.infer<typeof solutionItemSchema>

export const solutionSectionSchema = z.object({
  title: z.string().default(''),
  description: z.string().default(''),
  solutions: z.array(solutionItemSchema).default([]),
})
export type SolutionSection = z.infer<typeof solutionSectionSchema>

// --- Block meta (used by CMS to render the editor UI) ---
export const solutionSectionMeta = {
  id: SOLUTION_SECTION_ID,
  type: 'solution-section',
  label: 'Solution Section',
  description: 'A section showcasing multiple solutions with image, title and description.',
  icon: 'layout-grid',
  schema: solutionSectionSchema,
  defaultData: (): SolutionSection => ({
    title: '',
    description: '',
    solutions: [
      {
        title: '',
        description: '',
        image: { src: '', alt: '' },
      },
    ],
  }),
} as const
