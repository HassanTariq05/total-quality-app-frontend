import z from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import { Organizations } from '@/features/organizations'

const organizationsSearchSchema = z.object({
  page: z.number().optional().catch(1),
  pageSize: z.number().optional().catch(10),
  // Facet filters
  status: z
    .array(
      z.union([
        z.literal('active'),
        z.literal('inactive'),
        z.literal('invited'),
        z.literal('suspended'),
      ])
    )
    .optional()
    .catch([]),
})

export const Route = createFileRoute('/_authenticated/organizations')({
  validateSearch: organizationsSearchSchema,
  component: Organizations,
})
