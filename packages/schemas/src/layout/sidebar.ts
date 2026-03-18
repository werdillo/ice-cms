import { z } from 'zod'

export const sidebarLinkSchema = z.object({
  href: z.string().min(1),
  label: z.string().min(1),
  icon: z.string().min(1),
})
export type SidebarLink = z.infer<typeof sidebarLinkSchema>

export const sidebarConfigSchema = z.object({
  links: z.array(sidebarLinkSchema).default([]),
  ariaLabel: z.string().min(1).default('Sidebar navigation'),
})
export type SidebarConfig = z.infer<typeof sidebarConfigSchema>

export const sidebarPropsSchema = z.object({
  config: sidebarConfigSchema.partial().optional(),
})
export type SidebarProps = z.infer<typeof sidebarPropsSchema>

export const sidebarSchema = sidebarConfigSchema
export type Sidebar = z.infer<typeof sidebarSchema>
