'use client'

import { useEffect } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Organization } from '@/services/organization-services/types'
import { useAuthStore } from '@/stores/auth-store'
import { useCreateRole, useUpdateRole } from '@/hooks/use-roles'
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
import { SelectDropdown } from '@/components/select-dropdown'

const RESERVED_ROLE_NAMES = ['Super Admin', 'Administrator'] as const

const getRoleFormSchema = (isSuperAdmin: boolean) =>
  z.object({
    name: z
      .string()
      .min(2, 'Name must be at least 2 characters.')
      .refine(
        (val) => {
          if (isSuperAdmin) return true
          const normalized = val.trim().toLowerCase()
          return !RESERVED_ROLE_NAMES.some(
            (reserved) => reserved.toLowerCase() === normalized
          )
        },
        {
          message: 'Role name is reserved, use any other name.',
        }
      ),
    description: z.string().optional(),
    organization: isSuperAdmin
      ? z.string().min(1, 'Organization is required.')
      : z.string().optional(),
  })

type RoleForm = z.infer<ReturnType<typeof getRoleFormSchema>>

type RoleActionDialogProps = {
  currentRow?: any
  open: boolean
  onOpenChange: (open: boolean) => void
  organizations: any
}

export function RolesActionDialog({
  currentRow,
  open,
  onOpenChange,
  organizations,
}: RoleActionDialogProps) {
  const isEdit = !!currentRow

  const user = useAuthStore()
  const isSuperAdmin = user?.auth?.user?.role?.name === 'Super Admin'
  const orgId = user?.auth?.user?.organisation?.id

  const formSchema = getRoleFormSchema(isSuperAdmin)

  const form = useForm<RoleForm>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
      organization: '',
    },
  })

  useEffect(() => {
    if (currentRow) {
      form.reset({
        name: currentRow.name ?? '',
        description: currentRow.description ?? '',
        organization: currentRow?.organisation?.id ?? '',
      })
    } else {
      form.reset({
        name: '',
        description: '',
        organization: '',
      })
    }
  }, [currentRow, form])

  const createRoleMutation = useCreateRole()
  const updateRoleMutation = useUpdateRole()

  const onSubmit = (values: RoleForm) => {
    const payload = {
      name: values.name,
      description: values.description || undefined,
      organisationId: isSuperAdmin ? values.organization : orgId,
    }

    if (isEdit) {
      updateRoleMutation.mutate({ id: currentRow.id, payload })
    } else {
      createRoleMutation.mutate(payload)
    }

    form.reset()
    onOpenChange(false)
  }

  useEffect(() => {
    if (currentRow) {
      form.reset({
        name: currentRow.name ?? '',
        description: currentRow.description ?? '',
        organization: currentRow?.organisation?.id ?? '',
      })
    } else {
      form.reset({
        name: '',
        description: '',
        organization: '',
      })
    }
  }, [currentRow, form])

  return (
    <Dialog
      open={open}
      onOpenChange={(state) => {
        form.reset()
        onOpenChange(state)
      }}
    >
      <DialogContent className=''>
        <DialogHeader className='text-start'>
          <DialogTitle>{isEdit ? 'Edit Role' : 'Add New Role'}</DialogTitle>
          <DialogDescription>
            {isEdit ? 'Update the role here. ' : 'Create new role here. '}
            Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <div className='max-h-[70vh] overflow-y-auto py-1 pe-3'>
          <Form {...form}>
            <form
              id='role-form'
              onSubmit={form.handleSubmit(onSubmit)}
              className='space-y-4 px-0.5'
            >
              <FormField
                control={form.control}
                name='name'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-end'>Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Role'
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
                name='description'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-end'>
                      Description
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Description'
                        className='col-span-4'
                        autoComplete='off'
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
                    <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                      <FormLabel className='col-span-2 text-end'>
                        Organization
                      </FormLabel>
                      <SelectDropdown
                        defaultValue={field.value}
                        onValueChange={field.onChange}
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
            </form>
          </Form>
        </div>
        <DialogFooter>
          <Button type='submit' form='role-form'>
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
