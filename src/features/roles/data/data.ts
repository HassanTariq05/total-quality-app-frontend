import { OrganizationStatus } from '@/features/organizations/data/schema'

export const callTypes = new Map<OrganizationStatus, string>([
  ['active', 'bg-teal-100/30 text-teal-900 dark:text-teal-200 border-teal-200'],
  ['inactive', 'bg-neutral-300/40 border-neutral-300'],
])

export const badgeTypes = new Map<any, string>([
  ['active', 'bg-teal-100/30 text-teal-900 dark:text-teal-200 border-teal-200'],
  ['inactive', 'bg-neutral-300/40 border-neutral-300'],
  ['Active', 'bg-teal-100/30 text-teal-900 dark:text-teal-200 border-teal-200'],
  ['Inactive', 'bg-neutral-300/40 border-neutral-300'],
  ['DRAFT', 'bg-slate-100 text-slate-700 border-slate-300'],
  ['SENT_FOR_APPROVAL', 'bg-amber-100 text-amber-800 border-amber-300'],
  ['REJECTED', 'bg-red-100 text-red-800 border-red-300'],
  ['SENT_FOR_REVISION', 'bg-orange-100 text-orange-800 border-orange-300'],
  ['APPROVED', 'bg-green-100 text-green-800 border-green-300'],
  ['ARCHIVED', 'bg-gray-200 text-gray-700 border-gray-400'],
])
