import { z } from 'zod'
import { linkSchema } from '../base'

export const FAQ_SECTION_ID = '__faq-section' as const

export const faqItemSchema = z.object({
  question: z.string().default(''),
  answer: z.string().default(''),
})
export type FaqItem = z.infer<typeof faqItemSchema>

export const faqCategorySchema = z.object({
  title: z.string().default(''),
  ariaLabel: z.string().default(''),
  items: z.array(faqItemSchema).default([]),
})
export type FaqCategory = z.infer<typeof faqCategorySchema>

export const faqSectionSchema = z.object({
  tagline: z.string().default(''),
  heading: z.string().default(''),
  description: z.string().default(''),
  contactLink: linkSchema,
  ariaLabelledBy: z.string().default('faq-heading'),
  categories: z.array(faqCategorySchema).default([]),
})
export type FaqSection = z.infer<typeof faqSectionSchema>

export const faqSectionMeta = {
  id: FAQ_SECTION_ID,
  type: 'faq-section',
  label: 'FAQ Section',
  description: 'Frequently asked questions grouped by category.',
  icon: 'circle-help',
  schema: faqSectionSchema,
  defaultData: (): FaqSection => ({
    tagline: '',
    heading: '',
    description: '',
    contactLink: { label: '', href: '', target: '_self' },
    ariaLabelledBy: 'faq-heading',
    categories: [
      {
        title: '',
        ariaLabel: '',
        items: [
          {
            question: '',
            answer: '',
          },
        ],
      },
    ],
  }),
} as const
