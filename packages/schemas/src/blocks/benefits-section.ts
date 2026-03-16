import { z } from 'zod'

export const BENEFITS_SECTION_ID = '__benefits-section' as const

export const benefitItemSchema = z.object({
  title: z.string().default(''),
  description: z.string().default(''),
  icon: z.string().default(''),
})
export type BenefitItem = z.infer<typeof benefitItemSchema>

export const benefitsSectionSchema = z.object({
  tagline: z.string().default(''),
  title: z.string().default(''),
  description: z.string().default(''),
  benefits: z.array(benefitItemSchema).default([]),
})
export type BenefitsSection = z.infer<typeof benefitsSectionSchema>

export const benefitsSectionMeta = {
  id: BENEFITS_SECTION_ID,
  type: 'benefits-section',
  label: 'Benefits Section',
  description: 'A section showcasing key benefits with icon, title and description.',
  icon: 'star',
  schema: benefitsSectionSchema,
  defaultData: (): BenefitsSection => ({
    tagline: '',
    title: '',
    description: '',
    benefits: [
      {
        title: '',
        description: '',
        icon: '',
      },
    ],
  }),
} as const
