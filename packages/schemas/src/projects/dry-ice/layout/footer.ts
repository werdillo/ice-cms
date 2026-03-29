import { z } from 'zod'

export const navLinkSchema = z.object({
  href: z.string().min(1),
  label: z.string().min(1),
})
export type NavLink = z.infer<typeof navLinkSchema>

export const footerLogoSchema = z.object({
  href: z.string().min(1),
  ariaLabel: z.string().min(1),
  className: z.string().optional(),
})
export type FooterLogo = z.infer<typeof footerLogoSchema>

export const footerNavigationSchema = z.object({
  links: z.array(navLinkSchema).default([]),
  ariaLabel: z.string().min(1),
})
export type FooterNavigation = z.infer<typeof footerNavigationSchema>

export const footerNewsletterSchema = z.object({
  enabled: z.boolean().default(false),
  emailInputId: z.string().min(1),
  emailPlaceholder: z.string().min(1),
  buttonText: z.string().min(1),
  ariaLabel: z.string().min(1),
})
export type FooterNewsletter = z.infer<typeof footerNewsletterSchema>

export const footerCopyrightSchema = z.object({
  siteName: z.string().min(1),
  siteUrl: z.string().min(1),
})
export type FooterCopyright = z.infer<typeof footerCopyrightSchema>

export const footerLegalLinksSchema = z.object({
  links: z.array(navLinkSchema).default([]),
  ariaLabel: z.string().min(1),
})
export type FooterLegalLinks = z.infer<typeof footerLegalLinksSchema>

export const footerConfigSchema = z.object({
  logo: footerLogoSchema,
  mainNavigation: footerNavigationSchema,
  newsletter: footerNewsletterSchema,
  copyright: footerCopyrightSchema,
  legalLinks: footerLegalLinksSchema,
  ariaLabel: z.string().min(1),
})
export type FooterConfig = z.infer<typeof footerConfigSchema>
