import { z } from 'zod'
import { langSchema, linkSchema, imageSchema, buttonSchema } from './base'

// --- Nav item ---
export const navItemSchema = z.object({
  label: z.string().min(1),
  href: z.string().min(1),
  children: z
    .array(
      z.object({
        label: z.string().min(1),
        href: z.string().min(1),
      })
    )
    .default([]),
})
export type NavItem = z.infer<typeof navItemSchema>

// --- Header ---
export const headerSchema = z.object({
  logo: imageSchema,
  nav: z.array(navItemSchema).default([]),
  cta: buttonSchema.optional(),
})
export type Header = z.infer<typeof headerSchema>

// --- Footer column ---
export const footerColumnSchema = z.object({
  title: z.string().default(''),
  links: z.array(linkSchema).default([]),
})
export type FooterColumn = z.infer<typeof footerColumnSchema>

// --- Footer ---
export const footerSchema = z.object({
  logo: imageSchema.optional(),
  columns: z.array(footerColumnSchema).default([]),
  copyright: z.string().default(''),
  bottomLinks: z.array(linkSchema).default([]),
})
export type Footer = z.infer<typeof footerSchema>

// --- Sidebar ---
export const sidebarSchema = z.object({
  enabled: z.boolean().default(false),
  links: z.array(linkSchema).default([]),
})
export type Sidebar = z.infer<typeof sidebarSchema>

// --- Layout ---
export const layoutSchema = z.object({
  header: headerSchema,
  footer: footerSchema,
  sidebar: sidebarSchema,
})
export type Layout = z.infer<typeof layoutSchema>

// --- Layout per lang ---
export const layoutByLangSchema = z.record(langSchema, layoutSchema)
export type LayoutByLang = z.infer<typeof layoutByLangSchema>
