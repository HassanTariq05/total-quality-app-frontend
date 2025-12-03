import { z } from 'zod'

export const FormSubmissionsSchema = z.object({
  id: z.string(),
  name: z.string().nullable(),
  description: z.string().nullable(),
})

export type SubmissionsSchema = z.infer<typeof FormSubmissionsSchema>
