import { z } from 'zod'

export const headerPropsSchema = z.object({
  lang: z.string().default('en'),
  buttonText: z.string().default(''),
  buttonHref: z.string().default(''),
})

export type HeaderProps = z.infer<typeof headerPropsSchema>
