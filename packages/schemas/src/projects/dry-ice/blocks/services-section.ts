import { z } from 'zod'
import { imageSchema } from '../base'

export const SERVICES_SECTION_ID = '__services-section' as const

export const serviceItemSchema = z.object({
  number: z.string().default(''),
  title: z.string().default(''),
  description: z.string().default(''),
  image: imageSchema,
})
export type ServiceItem = z.infer<typeof serviceItemSchema>

export const servicesSectionSchema = z.object({
  heading: z.string().default(''),
  sectionLabel: z.string().default(''),
  buttonText: z.string().default(''),
  buttonHref: z.string().default(''),
  services: z.array(serviceItemSchema).min(3).max(10).default([
    { number: '01', title: '', description: '', image: { src: '', alt: '' } },
    { number: '02', title: '', description: '', image: { src: '', alt: '' } },
    { number: '03', title: '', description: '', image: { src: '', alt: '' } },
  ]),
})
export type ServicesSection = z.infer<typeof servicesSectionSchema>

export const servicesSectionMeta = {
  id: SERVICES_SECTION_ID,
  type: 'services-section',
  label: 'Services Section',
  description: 'A section listing 3 to 10 services with a number, title, description, and image.',
  icon: 'briefcase',
  schema: servicesSectionSchema,
  defaultData: (): ServicesSection => ({
    heading: '',
    sectionLabel: '',
    buttonText: '',
    buttonHref: '',
    services: [
      { number: '01', title: '', description: '', image: { src: '', alt: '' } },
      { number: '02', title: '', description: '', image: { src: '', alt: '' } },
      { number: '03', title: '', description: '', image: { src: '', alt: '' } },
    ],
  }),
} as const
