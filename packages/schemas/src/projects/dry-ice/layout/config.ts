import { z } from 'zod'
import { langSchema } from '../base'
import { headerPropsSchema } from './header'
import { footerConfigSchema } from './footer'
import { sidebarConfigSchema } from './sidebar'

export const layoutSchema = z.object({
  header: headerPropsSchema,
  footer: footerConfigSchema,
  sidebar: sidebarConfigSchema,
})

export type Layout = z.infer<typeof layoutSchema>

const sectionByLang = <T extends z.ZodTypeAny>(schema: T) =>
  z.record(langSchema, schema)

export const layoutBySectionSchema = z.object({
  header: sectionByLang(headerPropsSchema),
  footer: sectionByLang(footerConfigSchema),
  sidebar: sectionByLang(sidebarConfigSchema),
})

export type LayoutBySection = z.infer<typeof layoutBySectionSchema>
