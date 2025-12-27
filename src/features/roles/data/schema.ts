import { z } from 'zod'

const roleSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
})
export type Role = z.infer<typeof roleSchema>

export const roleListSchema = z.array(roleSchema)
