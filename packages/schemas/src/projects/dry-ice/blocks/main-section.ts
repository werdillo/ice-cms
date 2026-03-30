import { z } from 'zod'
import { imageSchema } from '../base'

export const MAIN_SECTION_ID = '__main-section' as const

export const mainSectionSchema = z.object({
  title1: z.string().default(''),
  title2: z.string().default(''),
  subtitle: z.string().default(''),
  description: z.string().default(''),
  buttonText: z.string().default(''),
  buttonHref: z.string().default(''),
  image1: imageSchema.default({ src: '', alt: '' }),
  image2: imageSchema.default({ src: '', alt: '' }),
})
export type MainSection = z.infer<typeof mainSectionSchema>

export const mainSectionMeta = {
  id: MAIN_SECTION_ID,
  type: 'main-section',
  label: 'Main Section',
  description: 'Hero section with two titles, subtitle, description, CTA button and two images.',
  icon: 'layout-template',
  schema: mainSectionSchema,
  defaultData: (): MainSection => ({
    title1: '',
    title2: '',
    subtitle: '',
    description: '',
    buttonText: '',
    buttonHref: '',
    image1: { src: '', alt: '' },
    image2: { src: '', alt: '' },
  }),
} as const
