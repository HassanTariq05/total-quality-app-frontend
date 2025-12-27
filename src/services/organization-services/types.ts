export interface Organization {
  id: string
  number?: number
  name: string
  email: string
  phoneNumber: string
  status: 'Active' | 'Inactive'
  description?: string
}
