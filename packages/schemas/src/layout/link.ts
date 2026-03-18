import { z } from 'zod'

export const navLinkSchema = z.object({
  href: z.string().min(1),
  label: z.string().min(1),
})

export type NavLink = z.infer<typeof navLinkSchema>

export const sidebarLinkSchema = z.object({
  href: z.string().min(1),
  label: z.string().min(1),
  icon: z.string().min(1),
})

export type SidebarLink = z.infer<typeof sidebarLinkSchema>
