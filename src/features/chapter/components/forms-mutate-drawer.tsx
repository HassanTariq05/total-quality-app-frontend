import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useCreateForm, useUpdateForm } from '@/hooks/use-forms'
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
import { type Chapter } from '../data/schema'

type FormMutateDrawerProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow?: Chapter
  chapterId: string | undefined
}

const formSchema = z.object({
  title: z
    .string()
    .min(2, 'Form name must be at least 2 characters.')
    .max(60, 'Form name must not be longer than 60 characters.'),
  status: z
    .enum(['Active', 'Inactive'])
    .refine((val) => !!val, { message: 'Please select a valid status.' }),
  description: z
    .string()
    .max(160, 'Description must not exceed 160 characters.')
    .optional(),
})
type FormForm = z.infer<typeof formSchema>

export function FormsMutateDrawer({
  open,
  onOpenChange,
  currentRow,
  chapterId,
}: FormMutateDrawerProps) {
  const isUpdate = !!currentRow

  const form = useForm<FormForm>({
    resolver: zodResolver(formSchema),
    defaultValues: currentRow ?? {
      title: '',
      description: '',
      status: 'Active',
    },
  })

  const createFormMutation = useCreateForm()
  const updateFormMutation = useUpdateForm()

  const onSubmit = (data: FormForm) => {
    if (isUpdate) {
      updateFormMutation.mutate({ id: currentRow?.id, payload: data })
    } else {
      createFormMutation.mutate({
        title: data?.title,
        description: data?.description,
        status: data?.status,
        chapterId: chapterId || '',
      })
    }

    onOpenChange(false)
    form.reset()
  }

  return (
    <Sheet
      open={open}
      onOpenChange={(v) => {
        onOpenChange(v)
        form.reset()
      }}
    >
      <SheetContent className='flex flex-col'>
        <SheetHeader className='text-start'>
          <SheetTitle>{isUpdate ? 'Update' : 'Create'} Form</SheetTitle>
        </SheetHeader>
        <Form {...form}>
          <form
            id='forms-form'
            onSubmit={form.handleSubmit(onSubmit)}
            className='flex-1 space-y-6 overflow-y-auto px-4'
          >
            <FormField
              control={form.control}
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
              control={form.control}
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
              control={form.control}
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
                      <SelectItem value='Inactive'>InActive</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
        <SheetFooter className='gap-2'>
          <SheetClose asChild>
            <Button variant='outline'>Close</Button>
          </SheetClose>
          <Button form='forms-form' type='submit'>
            Save changes
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
