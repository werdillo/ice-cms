import { z } from 'zod'
import type { PageData } from '@ice-cms/schemas'

export const publishContentSchema = z.object({
  slug: z
    .string()
    .min(1)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  content: z.custom<PageData>(),
  commitMessage: z.string().min(1).max(200).optional(),
  targetPath: z.string().min(1).optional(),
})

export type PublishContentInput = z.infer<typeof publishContentSchema>
