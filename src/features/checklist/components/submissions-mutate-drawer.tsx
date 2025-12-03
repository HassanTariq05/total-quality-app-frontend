import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { useAuthStore } from '@/stores/auth-store'
import {
  useCreateChecklistSubmission,
  useUpdateChecklistSubmission,
} from '@/hooks/use-checklist-submissions'
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
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Textarea } from '@/components/ui/textarea'

type FormMutateDrawerProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow?: any
  formId: string | undefined
}

const formSchema = z.object({
  name: z
    .string()
    .min(2, 'Checklist Submission name must be at least 2 characters.')
    .max(
      60,
      'Checklist Submission name must not be longer than 60 characters.'
    ),
  description: z
    .string()
    .max(255, 'Description must not exceed 255 characters.')
    .optional(),
})
type FormForm = z.infer<typeof formSchema>

export function FormsMutateDrawer({
  open,
  onOpenChange,
  currentRow,
  formId,
}: FormMutateDrawerProps) {
  const isUpdate = !!currentRow

  const form = useForm<FormForm>({
    resolver: zodResolver(formSchema),
    defaultValues: currentRow ?? {
      name: '',
      description: '',
    },
  })

  const { auth } = useAuthStore()

  const createChecklistSubmissionMutation = useCreateChecklistSubmission()
  const updateChecklistSubmissionMutation = useUpdateChecklistSubmission()
  const onSubmit = (data: FormForm) => {
    if (isUpdate) {
      updateChecklistSubmissionMutation.mutate({
        id: currentRow?.id,
        payload: {
          ...data,
          organisationId:
            currentRow?.organisation?.id || auth?.user?.organisation?.id || '',
          checklistId: formId || '',
        },
      })
    } else {
      createChecklistSubmissionMutation.mutate({
        name: data?.name,
        description: data?.description || '',
        checklistId: formId || '',
        organisationId: auth?.user?.organisation?.id || '',
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
          <SheetTitle>
            {isUpdate ? 'Update' : 'Create'} Form Submission
          </SheetTitle>
        </SheetHeader>
        <Form {...form}>
          <form
            id='forms-submission'
            onSubmit={form.handleSubmit(onSubmit)}
            className='flex-1 space-y-6 overflow-y-auto px-4'
          >
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder='Enter a name' />
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
          </form>
        </Form>
        <SheetFooter className='gap-2'>
          <SheetClose asChild>
            <Button variant='outline'>Close</Button>
          </SheetClose>
          <Button
            form='forms-submission'
            type='submit'
            disabled={
              createChecklistSubmissionMutation.isPending ||
              updateChecklistSubmissionMutation.isPending
            }
          >
            {(createChecklistSubmissionMutation.isPending ||
              updateChecklistSubmissionMutation.isPending) && (
              <Loader2 className='mr-2 h-4 w-4 animate-spin' />
            )}
            Save changes
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
