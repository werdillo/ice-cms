import { z } from 'zod'
import { imageSchema } from '../base'

export const GALLERY_SECTION_ID = '__gallery-section' as const

export const gallerySectionSchema = z.object({
  title: z.string().default(''),
  description: z.string().default(''),
  images: z.array(imageSchema).default([]),
})
export type GallerySection = z.infer<typeof gallerySectionSchema>

export const gallerySectionMeta = {
  id: GALLERY_SECTION_ID,
  type: 'gallery-section',
  label: 'Gallery Section',
  description: 'A section displaying a grid of images.',
  icon: 'image',
  schema: gallerySectionSchema,
  defaultData: (): GallerySection => ({
    title: '',
    description: '',
    images: [
      { src: '', alt: '' },
    ],
  }),
} as const
