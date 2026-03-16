import { z } from 'zod'
import { imageSchema } from '../base'

export const FEATURE_SECTION_ID = '__feature-section' as const

export const featureItemSchema = z.object({
  title: z.string().default(''),
  description: z.string().default(''),
  image: imageSchema,
})
export type FeatureItem = z.infer<typeof featureItemSchema>

export const featureSectionSchema = z.object({
  tagline: z.string().default(''),
  title: z.string().default(''),
  description: z.string().default(''),
  features: z.tuple([
    featureItemSchema,
    featureItemSchema,
    featureItemSchema,
  ]),
})
export type FeatureSection = z.infer<typeof featureSectionSchema>

export const featureSectionMeta = {
  id: FEATURE_SECTION_ID,
  type: 'feature-section',
  label: 'Feature Section',
  description: 'A section with exactly 3 features, each with image, title and description.',
  icon: 'layout-panel-top',
  schema: featureSectionSchema,
  defaultData: (): FeatureSection => ({
    tagline: '',
    title: '',
    description: '',
    features: [
      { title: '', description: '', image: { src: '', alt: '' } },
      { title: '', description: '', image: { src: '', alt: '' } },
      { title: '', description: '', image: { src: '', alt: '' } },
    ],
  }),
} as const
