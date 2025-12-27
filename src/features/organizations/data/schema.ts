import { z } from 'zod'

const organizationStatusSchema = z.union([
  z.literal('active'),
  z.literal('inactive'),
])
export type OrganizationStatus = z.infer<typeof organizationStatusSchema>

const organizationSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  email: z.string(),
  phoneNumber: z.string(),
  status: organizationStatusSchema,
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
})
export type Organization = z.infer<typeof organizationSchema>

export const organizationListSchema = z.array(organizationSchema)
