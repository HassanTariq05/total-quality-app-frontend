import { PermissionData } from '../types/permission-data'
import { PERMISSIONS } from '../types/permissions'

export const permissionsData: PermissionData = [
  {
    id: 1,
    name: 'Accreditations',
    actions: [
      { label: 'View', value: PERMISSIONS.VIEW_ACCREDITATION },
      { label: 'Create', value: PERMISSIONS.CREATE_ACCREDITATION },
      { label: 'Edit', value: PERMISSIONS.EDIT_ACCREDITATION },
      { label: 'Delete', value: PERMISSIONS.DELETE_ACCREDITATION },
    ],
  },
  {
    id: 2,
    name: 'Chapters',
    actions: [
      { label: 'View', value: PERMISSIONS.VIEW_CHAPTER },
      { label: 'Create', value: PERMISSIONS.CREATE_CHAPTER },
      { label: 'Edit', value: PERMISSIONS.EDIT_CHAPTER },
      { label: 'Delete', value: PERMISSIONS.DELETE_CHAPTER },
    ],
  },
  {
    id: 3,
    name: 'Forms',
    actions: [
      { label: 'View', value: PERMISSIONS.VIEW_FORM },
      { label: 'Create', value: PERMISSIONS.CREATE_FORM },
      { label: 'Edit', value: PERMISSIONS.EDIT_FORM },
      { label: 'Delete', value: PERMISSIONS.DELETE_FORM },
    ],
  },
  {
    id: 4,
    name: 'Form Submissions',
    actions: [
      { label: 'View', value: PERMISSIONS.VIEW_FORM_SUBMISSION },
      { label: 'Create', value: PERMISSIONS.CREATE_FORM_SUBMISSION },
      { label: 'Edit', value: PERMISSIONS.EDIT_FORM_SUBMISSION },
      { label: 'Delete', value: PERMISSIONS.DELETE_FORM_SUBMISSION },
    ],
  },
  {
    id: 5,
    name: 'Checklists',
    actions: [
      { label: 'View', value: PERMISSIONS.VIEW_CHECKLIST },
      { label: 'Create', value: PERMISSIONS.CREATE_CHECKLIST },
      { label: 'Edit', value: PERMISSIONS.EDIT_CHECKLIST },
      { label: 'Delete', value: PERMISSIONS.DELETE_CHECKLIST },
    ],
  },
  {
    id: 6,
    name: 'Checklist Submissions',
    actions: [
      { label: 'View', value: PERMISSIONS.VIEW_CHECKLIST_SUBMISSION },
      { label: 'Create', value: PERMISSIONS.CREATE_CHECKLIST_SUBMISSION },
      { label: 'Edit', value: PERMISSIONS.EDIT_CHECKLIST_SUBMISSION },
      { label: 'Delete', value: PERMISSIONS.DELETE_CHECKLIST_SUBMISSION },
    ],
  },
  {
    id: 7,
    name: 'Policies',
    actions: [
      { label: 'View', value: PERMISSIONS.VIEW_POLICY },
      { label: 'Create', value: PERMISSIONS.CREATE_POLICY },
      { label: 'Edit', value: PERMISSIONS.EDIT_POLICY },
      { label: 'Delete', value: PERMISSIONS.DELETE_POLICY },
    ],
  },
  {
    id: 8,
    name: 'Policy Versions',
    actions: [
      { label: 'View', value: PERMISSIONS.VIEW_POLICY_VERSION },
      { label: 'Clone', value: PERMISSIONS.CLONE_POLICY_VERSION },
      { label: 'Review', value: PERMISSIONS.REVIEW_POLICY_VERSION },
      { label: 'Edit', value: PERMISSIONS.EDIT_POLICY_VERSION },
      { label: 'Delete', value: PERMISSIONS.DELETE_POLICY_VERSION },
    ],
  },
]
