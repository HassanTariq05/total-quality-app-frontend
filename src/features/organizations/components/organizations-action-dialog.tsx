'use client'

import { useEffect, useMemo } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Check, ChevronsUpDown, Loader2 } from 'lucide-react'
import { useAuthStore } from '@/stores/auth-store'
import { cn } from '@/lib/utils'
import { useAccreditations } from '@/hooks/use-accreditations'
import {
  useCreateOrganization,
  useUpdateOrganization,
} from '@/hooks/use-organizations'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
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
  accreditations: z.array(z.string()).min(0).optional(),
})

type OrganizationForm = z.infer<typeof formSchema>

type OrganizationActionDialogProps = {
  currentRow?: Organization & { accreditations?: string[] }
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
      accreditations: [],
    },
  })

  const createOrganizationMutation = useCreateOrganization()
  const updateOrganizationMutation = useUpdateOrganization()

  const user = useAuthStore()

  const isSuperAdmin = user?.auth?.user?.role?.name === 'Super Admin'
  const orgId = user?.auth?.user?.organisation?.id

  const { data: accreditations, isLoading: isLoadingAccreditations } =
    useAccreditations(isSuperAdmin, orgId) as any

  const originalAccreditationIds = useMemo(() => {
    if (isEdit && currentRow?.accreditations) {
      return currentRow.accreditations.map((acc: any) => acc.id).filter(Boolean)
    }
    return []
  }, [isEdit, currentRow])

  useEffect(() => {
    if (currentRow) {
      form.reset({
        name: currentRow.name ?? '',
        description: currentRow.description ?? '',
        email: currentRow.email ?? '',
        phoneNumber: currentRow.phoneNumber ?? '',
        status: currentRow.status ?? 'active',
        accreditations: originalAccreditationIds,
      })
    } else {
      form.reset({
        name: '',
        description: '',
        email: '',
        phoneNumber: '',
        status: 'active',
        accreditations: [],
      })
    }
  }, [currentRow, form])

  const onSubmit = (values: OrganizationForm) => {
    console.log('first', values)
    if (isEdit) {
      let payload = {
        name: values?.name,
        description: values?.description,
        email: values?.email,
        phoneNumber: values?.phoneNumber,
        status: values?.status,
        accreditationIds: isSuperAdmin
          ? values.accreditations?.length
            ? values.accreditations
            : undefined
          : originalAccreditationIds,
      }

      updateOrganizationMutation.mutate({ id: currentRow?.id, payload })
    } else {
      createOrganizationMutation.mutate({
        name: values?.name,
        description: values?.description,
        email: values?.email,
        phoneNumber: values?.phoneNumber,
        status: values?.status,
        accreditationIds: isSuperAdmin
          ? values.accreditations?.length
            ? values.accreditations
            : undefined
          : originalAccreditationIds,
      })
    }

    form.reset()
    onOpenChange(false)
  }

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

              {(isSuperAdmin || !isEdit) && (
                <FormField
                  control={form.control}
                  name='accreditations'
                  render={({ field }: any) => (
                    <FormItem className='grid grid-cols-6 items-start space-y-0 gap-x-4 gap-y-1'>
                      <FormLabel className='col-span-2 pt-2 text-end'>
                        Accreditations
                      </FormLabel>

                      <div className='col-span-4 space-y-2'>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant='outline'
                                role='combobox'
                                disabled={isLoadingAccreditations}
                                className={cn(
                                  'w-full justify-between text-left font-normal',
                                  !field.value?.length &&
                                    'text-muted-foreground'
                                )}
                              >
                                {isLoadingAccreditations ? (
                                  <>
                                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                                    Loading...
                                  </>
                                ) : field.value?.length > 0 ? (
                                  `${field.value.length} selected`
                                ) : (
                                  'Select accreditations...'
                                )}
                                <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>

                          <PopoverContent className='w-full p-0' align='start'>
                            <Command>
                              <CommandInput placeholder='Search accreditation...' />
                              <CommandList>
                                {isLoadingAccreditations ? (
                                  <CommandEmpty>
                                    Loading accreditations...
                                  </CommandEmpty>
                                ) : accreditations.length === 0 ? (
                                  <CommandEmpty>
                                    No accreditations found.
                                  </CommandEmpty>
                                ) : null}

                                <CommandGroup>
                                  {accreditations.map((acc: any) => (
                                    <CommandItem
                                      key={acc.id}
                                      value={acc.name}
                                      onSelect={() => {
                                        const current = field.value ?? []
                                        const isSelected = current.includes(
                                          acc.id
                                        )
                                        const newValue = isSelected
                                          ? current.filter(
                                              (v: any) => v !== acc.id
                                            )
                                          : [...current, acc.id]

                                        field.onChange(newValue)
                                      }}
                                    >
                                      <Check
                                        className={cn(
                                          'mr-2 h-4 w-4',
                                          field.value?.includes(acc.id)
                                            ? 'opacity-100'
                                            : 'opacity-0'
                                        )}
                                      />
                                      {acc.name}
                                    </CommandItem>
                                  ))}
                                </CommandGroup>
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>

                        {/* Selected badges */}
                        {field.value?.length > 0 && (
                          <div className='flex flex-wrap gap-1.5'>
                            {field.value.map((selectedId: any) => {
                              const acc = accreditations.find(
                                (a: any) => a.id === selectedId
                              )
                              return acc ? (
                                <div
                                  key={acc.id}
                                  className='bg-secondary text-secondary-foreground flex items-center gap-1 rounded-full px-2.5 py-1 text-xs'
                                >
                                  {acc.name}
                                  <button
                                    type='button'
                                    onClick={() =>
                                      field.onChange(
                                        field.value?.filter(
                                          (v: any) => v !== acc.id
                                        )
                                      )
                                    }
                                    className='text-muted-foreground hover:text-foreground ml-1'
                                  >
                                    ×
                                  </button>
                                </div>
                              ) : null
                            })}
                          </div>
                        )}

                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />
              )}

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
