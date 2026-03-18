import { z } from 'zod'
import { langSchema } from '../base'
import { headerPropsSchema } from './header'
import { footerConfigSchema, footerPropsSchema } from './footer'
import { sidebarConfigSchema, sidebarPropsSchema } from './sidebar'

export const layoutSchema = z.object({
  header: headerPropsSchema,
  footer: footerConfigSchema,
  sidebar: sidebarConfigSchema,
})

export type Layout = z.infer<typeof layoutSchema>

export const layoutPropsSchema = z.object({
  footer: footerPropsSchema.optional(),
  sidebar: sidebarPropsSchema.optional(),
})

export type LayoutProps = z.infer<typeof layoutPropsSchema>

export const layoutSectionByLangSchema = <T extends z.ZodTypeAny>(schema: T) =>
  z.record(langSchema, schema)

export const layoutBySectionSchema = z.object({
  header: layoutSectionByLangSchema(headerPropsSchema),
  footer: layoutSectionByLangSchema(footerConfigSchema),
  sidebar: layoutSectionByLangSchema(sidebarConfigSchema),
})

export type LayoutBySection = z.infer<typeof layoutBySectionSchema>
