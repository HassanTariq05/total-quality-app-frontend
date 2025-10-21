export interface Accreditation {
  id: string
  name: string
  status: 'Active' | 'Inactive'
  description?: string
}
