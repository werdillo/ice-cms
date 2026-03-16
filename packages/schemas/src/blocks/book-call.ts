import { z } from 'zod'

export const BOOK_CALL_ID = '__book-call' as const

export const bookCallSchema = z.object({
  heading: z.string().default(''),
  headingHighlight: z.string().default(''),
  placeholder: z.string().default(''),
  buttonText: z.string().default(''),
})
export type BookCall = z.infer<typeof bookCallSchema>

export const bookCallMeta = {
  id: BOOK_CALL_ID,
  type: 'book-call',
  label: 'Book a Call',
  description: 'A section with a phone input and submit button to book a call.',
  icon: 'phone',
  schema: bookCallSchema,
  defaultData: (): BookCall => ({
    heading: '',
    headingHighlight: '',
    placeholder: '',
    buttonText: '',
  }),
} as const
