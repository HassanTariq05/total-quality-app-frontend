'use client'

import { useEffect } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  useCreateOrganization,
  useUpdateOrganization,
} from '@/hooks/use-organizations'
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
import { type Organization } from '../data/schema'

const formSchema = z.object({
  name: z.string().min(2, 'Name is required.'),
  description: z.string().min(2, 'Description is required.').optional(),
  phoneNumber: z.string().min(1, 'Phone number is required.'),
  email: z.email({
    error: (iss) => (iss.input === '' ? 'Email is required.' : undefined),
  }),
  status: z
    .enum(['active', 'inactive'])
    .refine((val) => !!val, { message: 'Please select a valid status.' }),
})

type OrganizationForm = z.infer<typeof formSchema>

type OrganizationActionDialogProps = {
  currentRow?: Organization
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function OrganizationsActionDialog({
  currentRow,
  open,
  onOpenChange,
}: OrganizationActionDialogProps) {
  const isEdit = !!currentRow
  const form = useForm<OrganizationForm>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
      email: '',
      phoneNumber: '',
      status: 'active',
    },
  })

  const createOrganizationMutation = useCreateOrganization()
  const updateOrganizationMutation = useUpdateOrganization()

  const onSubmit = (values: OrganizationForm) => {
    if (isEdit) {
      let payload = {
        name: values?.name,
        description: values?.description,
        email: values?.email,
        phoneNumber: values?.phoneNumber,
        status: values?.status,
      }

      updateOrganizationMutation.mutate({ id: currentRow?.id, payload })
    } else {
      createOrganizationMutation.mutate({
        name: values?.name,
        description: values?.description,
        email: values?.email,
        phoneNumber: values?.phoneNumber,
        status: values?.status,
      })
    }

    form.reset()
    onOpenChange(false)
  }

  useEffect(() => {
    if (currentRow) {
      form.reset({
        name: currentRow.name ?? '',
        description: currentRow.description ?? '',
        email: currentRow.email ?? '',
        phoneNumber: currentRow.phoneNumber ?? '',
        status: currentRow.status ?? 'active',
      })
    } else {
      form.reset({
        name: '',
        description: '',
        email: '',
        phoneNumber: '',
        status: 'active',
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
          <DialogTitle>
            {isEdit ? 'Edit Organization' : 'Add New Organization'}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? 'Update the organization here. '
              : 'Create new organization here. '}
            Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <div className='max-h-[70vh] overflow-y-auto py-1 pe-3'>
          <Form {...form}>
            <form
              id='organization-form'
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
                        placeholder='Org Name'
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
                        placeholder='org.xyz@example.com'
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
            </form>
          </Form>
        </div>
        <DialogFooter>
          <Button type='submit' form='organization-form'>
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
