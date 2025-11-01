export interface Checklist {
  id: string
  number?: number
  name: string
  status: 'Active' | 'Inactive'
  description?: string
}
