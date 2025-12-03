import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { useCreateChecklist, useUpdateChecklist } from '@/hooks/use-checklists'
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

type ChecklistMutateDrawerProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow?: Chapter
  chapterId: string | undefined
}

const formSchema = z.object({
  title: z
    .string()
    .min(2, 'Chater name must be at least 2 characters.')
    .max(60, 'Checklist name must not be longer than 60 characters.'),
  status: z
    .enum(['Active', 'Inactive'])
    .refine((val) => !!val, { message: 'Please select a valid status.' }),
  description: z
    .string()
    .max(255, 'Description must not exceed 160 characters.')
    .optional(),
})
type ChecklistChecklist = z.infer<typeof formSchema>

export function ChecklistsMutateDrawer({
  open,
  onOpenChange,
  currentRow,
  chapterId,
}: ChecklistMutateDrawerProps) {
  const isUpdate = !!currentRow

  const checklist = useForm<ChecklistChecklist>({
    resolver: zodResolver(formSchema),
    defaultValues: currentRow ?? {
      title: '',
      description: '',
      status: 'Active',
    },
  })

  const createChecklistMutation = useCreateChecklist()
  const updateChecklistMutation = useUpdateChecklist()

  const onSubmit = (data: ChecklistChecklist) => {
    if (isUpdate) {
      updateChecklistMutation.mutate({ id: currentRow?.id, payload: data })
    } else {
      createChecklistMutation.mutate({
        title: data?.title,
        description: data?.description,
        status: data?.status,
        chapterId: chapterId || '',
      })
    }

    onOpenChange(false)
    checklist.reset()
  }

  return (
    <Sheet
      open={open}
      onOpenChange={(v) => {
        onOpenChange(v)
        checklist.reset()
      }}
    >
      <SheetContent className='flex flex-col'>
        <SheetHeader className='text-start'>
          <SheetTitle>{isUpdate ? 'Update' : 'Create'} Checklist</SheetTitle>
        </SheetHeader>
        <Form {...checklist}>
          <form
            id='forms-checklist'
            onSubmit={checklist.handleSubmit(onSubmit)}
            className='flex-1 space-y-6 overflow-y-auto px-4'
          >
            <FormField
              control={checklist.control}
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
              control={checklist.control}
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
              control={checklist.control}
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
          <Button
            form='forms-checklist'
            type='submit'
            disabled={
              createChecklistMutation.isPending ||
              updateChecklistMutation.isPending
            }
          >
            {(createChecklistMutation.isPending ||
              updateChecklistMutation.isPending) && (
              <Loader2 className='mr-2 h-4 w-4 animate-spin' />
            )}
            Save changes
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
