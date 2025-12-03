export interface Policy {
  id: string
  number?: number
  name: string
  status: 'Active' | 'Inactive'
  description?: string
}
