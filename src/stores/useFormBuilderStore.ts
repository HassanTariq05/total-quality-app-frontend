import { FormSchema, FormField } from '@/types/form'
import { v4 as uuid } from 'uuid'
import { create } from 'zustand'

interface FormBuilderState {
  form: any
  addField: (type: FormField['type']) => void
  updateField: (id: string, updates: Partial<FormField>) => void
  removeField: (id: string) => void
  setForm: (form: FormSchema) => void
  updateFormWidth: (width: number | null) => void
}

export const useFormBuilderStore = create<FormBuilderState>((set) => ({
  form: {
    id: 'form-1',
    title: 'Untitled Form',
    fields: [],
    elements: [],
    formWidth: null,
  },

  addField(type) {
    const base: any = {
      id: uuid(),
      type,
      label: 'Untitled Question',
      required: false,
    }

    if (type === 'table') {
      base.columns = ['Column 1']
      base.rows = []
    }

    set((s) => ({ form: { ...s.form, fields: [...s.form.fields, base] } }))
  },

  updateField(id, updates) {
    set((s) => ({
      form: {
        ...s.form,
        fields: s.form.fields.map((f: any) =>
          f.id === id ? { ...f, ...updates } : f
        ),
      },
    }))
  },

  removeField(id) {
    set((s) => ({
      form: {
        ...s.form,
        fields: s.form.fields.filter((f: any) => f.id !== id),
      },
    }))
  },

  setForm(form) {
    set({ form })
  },

  updateFormWidth(width) {
    set((state) => ({
      form: {
        ...state.form,
        formWidth: width,
      },
    }))
  },
}))
