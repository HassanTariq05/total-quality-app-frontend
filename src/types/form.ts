export type FieldType = 'text' | 'number' | 'checkbox' | 'table' | 'label'

export interface BaseField {
  id: string
  type: FieldType
  label: string
  required?: boolean
}

export interface TableField extends BaseField {
  type: 'table'
  columns: string[]
  rows: string[][]
}

export type FormField = BaseField | TableField

export interface FormSchema {
  id: string
  title: string
  fields: FormField[]
  rows: TableCell[][]
}

export interface TableCell {
  type: 'label' | 'field' | 'checkbox' | 'date'
  value: string
  bg?: string
  placeholder?: string
  alignment?: string
  cellFlex?: number
}

export interface TableElement {
  id: string
  type: 'table'
  label: string
  columns: string[]
  rows: TableCell[][]
}

export interface FormElement {
  id: string
  type: Exclude<FieldType, 'table'>
  label: string
  placeholder?: string
}

export interface FormSchema {
  id: string
  title: string
  elements: (FormElement | TableElement)[]
}
