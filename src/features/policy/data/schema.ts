import { z } from 'zod'

export const PolicyVersionsSchema = z.object({
  id: z.string(),
  title: z.string().nullable(),
  description: z.string().nullable(),
})

export type VersionsSchema = z.infer<typeof PolicyVersionsSchema>
