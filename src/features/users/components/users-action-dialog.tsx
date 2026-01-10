'use client'

import { useEffect, useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Organization } from '@/services/organization-services/types'
import {
  CreateUserPayload,
  UpdateUserPayload,
} from '@/services/user-services/user-services'
import { Loader2 } from 'lucide-react'
import { useAuthStore } from '@/stores/auth-store'
import { useRolesByOrg } from '@/hooks/use-roles'
import { useCreateUser, useUpdateUser } from '@/hooks/use-users'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { PasswordInput } from '@/components/password-input'
import { SelectDropdown } from '@/components/select-dropdown'

export const getUserFormSchema = (isSuperAdmin: boolean) =>
  z
    .object({
      name: z.string().min(1, 'Name is required.'),
      phoneNumber: z.string().min(1, 'Phone number is required.'),
      email: z
        .string()
        .min(1, 'Email is required.')
        .email('Invalid email address.'),

      role: z.string().min(1, 'Role is required.'),

      organization: isSuperAdmin
        ? z.string().min(1, 'Organization is required.')
        : z.string().optional(),

      status: z.string().min(1, 'Status is required.'),

      password: z.string().trim().optional(),

      confirmPassword: z.string().trim().optional(),

      isEdit: z.boolean(),
    })
    .superRefine((data, ctx) => {
      const { isEdit, password, confirmPassword } = data

      // Password is optional ONLY in edit mode
      if (!isEdit && !password) {
        ctx.addIssue({
          path: ['password'],
          message: 'Password is required.',
          code: z.ZodIssueCode.custom,
        })
        return
      }

      if (!password) return

      if (password.length < 8) {
        ctx.addIssue({
          path: ['password'],
          message: 'Password must be at least 8 characters long.',
          code: z.ZodIssueCode.custom,
        })
      }

      if (!/[a-z]/.test(password)) {
        ctx.addIssue({
          path: ['password'],
          message: 'Password must contain at least one lowercase letter.',
          code: z.ZodIssueCode.custom,
        })
      }

      if (!/\d/.test(password)) {
        ctx.addIssue({
          path: ['password'],
          message: 'Password must contain at least one number.',
          code: z.ZodIssueCode.custom,
        })
      }

      if (password !== confirmPassword) {
        ctx.addIssue({
          path: ['confirmPassword'],
          message: "Passwords don't match.",
          code: z.ZodIssueCode.custom,
        })
      }
    })
type UserForm = z.infer<ReturnType<typeof getUserFormSchema>>

type UserActionDialogProps = {
  currentRow?: any
  open: boolean
  onOpenChange: (open: boolean) => void
  organizations: any
}

export function UsersActionDialog({
  currentRow,
  open,
  onOpenChange,
  organizations,
}: UserActionDialogProps) {
  const user = useAuthStore()

  const isSuperAdmin = user?.auth?.user?.role?.name === 'Super Admin'

  const isEdit = !!currentRow

  const form = useForm<UserForm>({
    resolver: zodResolver(getUserFormSchema(isSuperAdmin)),
    defaultValues: isEdit
      ? {
          name: currentRow?.name ?? '',
          email: currentRow?.email ?? '',
          phoneNumber: currentRow?.phoneNumber ?? '',
          role: currentRow?.role?.id ?? '',
          organization: isSuperAdmin
            ? (currentRow?.organisation?.id ?? '')
            : undefined,
          status: currentRow?.status ?? '',
          password: '',
          confirmPassword: '',
          isEdit: true,
        }
      : {
          name: '',
          email: '',
          phoneNumber: '',
          role: '',
          organization: isSuperAdmin ? '' : undefined,
          status: '',
          password: '',
          confirmPassword: '',
          isEdit: false,
        },
  })

  const orgId = user?.auth?.user?.organisation.id

  const [selectedOrgId, setSelectedOrgId] = useState<string | undefined>(
    isSuperAdmin ? undefined : orgId
  )

  const effectiveOrgId = isSuperAdmin ? selectedOrgId : orgId

  const { data: roles = [], isPending: isLoadingRoles } = useRolesByOrg(
    effectiveOrgId!,
    {
      enabled: !!effectiveOrgId,
    }
  )

  const createUserMutation = useCreateUser()
  const updateUserMutation = useUpdateUser()

  const onSubmit = (values: UserForm) => {
    if (isEdit) {
      const organizationId = isSuperAdmin ? values.organization : orgId

      let payload: UpdateUserPayload = {
        name: values.name,
        email: values.email,
        phoneNumber: values.phoneNumber,
        password: values.password,
        roleId: values.role,
        organizationId,
        status: values.status,
      }

      updateUserMutation.mutate({ id: currentRow.id, payload })
    } else {
      const organizationId = isSuperAdmin ? values.organization : orgId

      let payload: CreateUserPayload = {
        name: values.name,
        email: values.email,
        phoneNumber: values.phoneNumber,
        password: values.password,
        roleId: values.role,
        organizationId,
        status: values.status,
      }
      createUserMutation.mutate(payload)
    }

    form.reset()
    // showSubmittedData(values)
    onOpenChange(false)
  }

  const isPasswordTouched = !!form.formState.dirtyFields.password

  const isRoleDisabled = (isSuperAdmin && !selectedOrgId) || isLoadingRoles

  const isSubmitting =
    createUserMutation.isPending || updateUserMutation.isPending

  useEffect(() => {
    if (isEdit && isSuperAdmin && currentRow?.organisation?.id) {
      setSelectedOrgId(currentRow.organisation.id)
    }
  }, [isEdit, isSuperAdmin, currentRow])

  useEffect(() => {
    if (!isSuperAdmin) {
      form.setValue('organization', undefined)
    }
  }, [isSuperAdmin])

  return (
    <Dialog
      open={open}
      onOpenChange={(state) => {
        form.reset()
        onOpenChange(state)
      }}
    >
      <DialogContent className='flex max-h-[90vh] flex-col sm:max-w-lg'>
        <DialogHeader className='shrink-0 text-start'>
          <DialogTitle>{isEdit ? 'Edit User' : 'Add New User'}</DialogTitle>
          <DialogDescription>
            {isEdit ? 'Update the user here.' : 'Create new user here.'}
            Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>

        <div className='flex-1 overflow-y-auto py-2 pe-3'>
          <Form {...form}>
            <form
              id='user-form'
              onSubmit={form.handleSubmit(onSubmit)}
              className='space-y-4 px-0.5'
            >
              <FormField
                control={form.control}
                name='name'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-end'>
                      Full Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder='John Doe'
                        className='col-span-4'
                        autoComplete='off'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='email'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-end'>Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='john.doe@gmail.com'
                        className='col-span-4'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='phoneNumber'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-end'>
                      Phone Number
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder='+123456789'
                        className='col-span-4'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />

              {isSuperAdmin && (
                <FormField
                  control={form.control}
                  name='organization'
                  render={({ field }) => (
                    <FormItem className='grid grid-cols-6 items-center gap-x-4'>
                      <FormLabel className='col-span-2 text-end'>
                        Organization
                      </FormLabel>

                      <SelectDropdown
                        defaultValue={field.value}
                        onValueChange={(value) => {
                          field.onChange(value)
                          setSelectedOrgId(value)
                          form.setValue('role', '')
                        }}
                        placeholder='Select an organization'
                        className='col-span-4'
                        items={organizations.map((org: Organization) => ({
                          label: org.name,
                          value: org.id,
                        }))}
                      />

                      <FormMessage className='col-span-4 col-start-3' />
                    </FormItem>
                  )}
                />
              )}

              <FormField
                control={form.control}
                name='role'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center gap-x-4'>
                    <FormLabel className='col-span-2 text-end'>Role</FormLabel>

                    <SelectDropdown
                      defaultValue={field.value}
                      onValueChange={field.onChange}
                      className='col-span-4'
                      disabled={isRoleDisabled}
                      placeholder={
                        isLoadingRoles
                          ? 'Loading roles...'
                          : isSuperAdmin && !selectedOrgId
                            ? 'Select organization first'
                            : 'Select a role'
                      }
                      items={roles.map((role: any) => ({
                        label: role.name,
                        value: role.id,
                      }))}
                    />

                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='status'
                render={({ field }) => (
                  <FormItem className='flex items-center gap-4'>
                    <FormLabel className='w-34 text-right'>Status</FormLabel>

                    <div className='flex-1'>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder='Select Status' />
                          </SelectTrigger>
                        </FormControl>

                        <SelectContent>
                          <SelectItem value='active'>Active</SelectItem>
                          <SelectItem value='inactive'>Inactive</SelectItem>
                        </SelectContent>
                      </Select>

                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='password'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-end'>
                      Password
                    </FormLabel>
                    <FormControl>
                      <PasswordInput
                        placeholder='e.g., S3cur3P@ssw0rd'
                        className='col-span-4'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='confirmPassword'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-end'>
                      Confirm Password
                    </FormLabel>
                    <FormControl>
                      <PasswordInput
                        disabled={!isPasswordTouched}
                        placeholder='e.g., S3cur3P@ssw0rd'
                        className='col-span-4'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </div>
        <DialogFooter>
          <Button type='submit' form='user-form' disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                {isEdit ? 'Updating...' : 'Creating...'}
              </>
            ) : isEdit ? (
              'Update User'
            ) : (
              'Create User'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
