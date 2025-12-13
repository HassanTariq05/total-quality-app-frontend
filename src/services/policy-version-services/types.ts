export interface PolicyVersion {
  id: string
  number: number
  title: string
  description?: string | null
  status:
    | 'DRAFT'
    | 'SENT_FOR_APPROVAL'
    | 'REJECTED'
    | 'SENT_FOR_REVISION'
    | 'APPROVED'
    | 'ARCHIVED'
  policyId: string
  documentName: string | null
}
