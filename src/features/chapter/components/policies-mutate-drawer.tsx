import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { useCreatePolicy, useUpdatePolicy } from '@/hooks/use-policies'
import { Button } from '@/components/ui/button'
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
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Textarea } from '@/components/ui/textarea'
import { type Policy } from '../data/schema'

type PolicyMutateDrawerProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow?: Policy
  chapterId: string | undefined
}

const formSchema = z.object({
  title: z
    .string()
    .min(2, 'Policy name must be at least 2 characters.')
    .max(60, 'Policy name must not be longer than 60 characters.'),
  status: z
    .enum(['Active', 'Inactive'])
    .refine((val) => !!val, { message: 'Please select a valid status.' }),
  description: z
    .string()
    .max(255, 'Description must not exceed 160 characters.')
    .optional(),
  document: z
    .any()
    .optional()
    .refine(
      (file) => !file || (file instanceof File && file.size > 0),
      'Please select a valid document.'
    ),
})
type PolicyType = z.infer<typeof formSchema>

export function PoliciesMutateDrawer({
  open,
  onOpenChange,
  currentRow,
  chapterId,
}: PolicyMutateDrawerProps) {
  const isUpdate = !!currentRow

  const policy = useForm<PolicyType>({
    resolver: zodResolver(formSchema),
    defaultValues: currentRow ?? {
      title: '',
      description: '',
      status: 'Active',
      document: undefined,
    },
  })

  const createPolicyMutation = useCreatePolicy()
  const updatePolicyMutation = useUpdatePolicy()

  const onSubmit = (data: PolicyType) => {
    const formData = new FormData()
    formData.append('title', data.title)
    formData.append('description', data.description || '')
    formData.append('status', data.status)
    formData.append('chapterId', chapterId || '')

    if (data.document instanceof File) {
      formData.append('document', data.document)
      formData.append('documentName', data.document.name)
    }

    if (isUpdate) {
      updatePolicyMutation.mutate({
        id: currentRow?.id,
        payload: formData,
      })
    } else {
      createPolicyMutation.mutate(formData)
    }

    onOpenChange(false)
    policy.reset()
  }

  return (
    <Sheet
      open={open}
      onOpenChange={(v) => {
        onOpenChange(v)
        policy.reset()
      }}
    >
      <SheetContent className='flex flex-col'>
        <SheetHeader className='text-start'>
          <SheetTitle>{isUpdate ? 'Update' : 'Create'} Policy</SheetTitle>
        </SheetHeader>
        <Form {...policy}>
          <form
            id='forms-policy'
            onSubmit={policy.handleSubmit(onSubmit)}
            className='flex-1 space-y-6 overflow-y-auto px-4'
          >
            <FormField
              control={policy.control}
              name='title'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder='Enter a title' />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={policy.control}
              name='description'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder='Enter description...'
                      className='resize-none'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={policy.control}
              name='status'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
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
                      <SelectItem value='Active'>Active</SelectItem>
                      <SelectItem value='Inactive'>Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={policy.control}
              name='document'
              render={({ field }) => {
                const fileName =
                  field.value instanceof File
                    ? field.value.name
                    : currentRow?.documentName || 'Choose a file…'

                return (
                  <FormItem>
                    <FormLabel>Document</FormLabel>
                    <FormControl>
                      <label className='flex cursor-pointer items-center space-x-4 rounded-md border border-gray-300 bg-gray-50 px-4 py-2 text-sm transition hover:bg-gray-100'>
                        <span>{fileName}</span>
                        <input
                          type='file'
                          accept='.doc,.docx,.pdf'
                          className='hidden'
                          onChange={(e) => {
                            const file = e.target.files?.[0] ?? null
                            field.onChange(file)
                          }}
                        />
                      </label>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )
              }}
            />
          </form>
        </Form>
        <SheetFooter className='gap-2'>
          <SheetClose asChild>
            <Button variant='outline'>Close</Button>
          </SheetClose>
          <Button
            form='forms-policy'
            type='submit'
            disabled={
              createPolicyMutation.isPending || updatePolicyMutation.isPending
            }
          >
            {(createPolicyMutation.isPending ||
              updatePolicyMutation.isPending) && (
              <Loader2 className='mr-2 h-4 w-4 animate-spin' />
            )}
            Save changes
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
