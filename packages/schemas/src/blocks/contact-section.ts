import { z } from 'zod'

export const CONTACT_SECTION_ID = '__contact-section' as const

export const officeSchema = z.object({
  city: z.string().default(''),
  address: z.string().default(''),
})
export type Office = z.infer<typeof officeSchema>

export const emailContactSchema = z.object({
  label: z.string().default(''),
  email: z.string().email().or(z.string().default('')),
})
export type EmailContact = z.infer<typeof emailContactSchema>

export const socialLinkSchema = z.object({
  icon: z.string().default(''),
  href: z.string().default('#'),
  label: z.string().default(''),
})
export type SocialLink = z.infer<typeof socialLinkSchema>

export const contactSectionSchema = z.object({
  title: z.string().default(''),
  description: z.string().default(''),
  officesTitle: z.string().default(''),
  officesDescription: z.string().default(''),
  offices: z.array(officeSchema).default([]),
  emailTitle: z.string().default(''),
  emailDescription: z.string().default(''),
  emails: z.array(emailContactSchema).default([]),
  socialsTitle: z.string().default(''),
  socials: z.array(socialLinkSchema).default([]),
  privacyPolicyLink: z.string().default(''),
})
export type ContactSection = z.infer<typeof contactSectionSchema>

export const contactSectionMeta = {
  id: CONTACT_SECTION_ID,
  type: 'contact-section',
  label: 'Contact Section',
  description: 'Contact section with offices, emails and social links.',
  icon: 'mail',
  schema: contactSectionSchema,
  defaultData: (): ContactSection => ({
    title: '',
    description: '',
    officesTitle: '',
    officesDescription: '',
    offices: [
      {
        city: '',
        address: '',
      },
    ],
    emailTitle: '',
    emailDescription: '',
    emails: [
      {
        label: '',
        email: '',
      },
    ],
    socialsTitle: '',
    socials: [
      {
        icon: 'SiFacebook',
        href: '#',
        label: 'Facebook',
      },
      {
        icon: 'SiInstagram',
        href: '#',
        label: 'Instagram',
      },
      {
        icon: 'Linkedin',
        href: '#',
        label: 'LinkedIn',
      },
    ],
    privacyPolicyLink: '',
  }),
} as const
