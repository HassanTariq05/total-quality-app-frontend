import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import {
  useCreatePolicyVersion,
  useUpdatePolicyVersion,
} from '@/hooks/use-policy-versions'
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

type PolicyMutateDrawerProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow?: any
  policyId: string | undefined
}

const policyVersionSchema = z.object({
  title: z
    .string()
    .min(2, 'Policy Version name must be at least 2 characters.')
    .max(60, 'Policy Version name must not be longer than 60 characters.'),
  description: z
    .string()
    .max(255, 'Description must not exceed 255 characters.')
    .optional(),
})
type PolicyVersionFormData = z.infer<typeof policyVersionSchema>

export function PolicyVersionsMutateDrawer({
  open,
  onOpenChange,
  currentRow,
  policyId,
}: PolicyMutateDrawerProps) {
  const isUpdate = !!currentRow

  const form = useForm<PolicyVersionFormData>({
    resolver: zodResolver(policyVersionSchema),
    defaultValues: currentRow ?? {
      title: '',
      description: '',
    },
  })

  const createPolicyVersionMutation = useCreatePolicyVersion()
  const updatePolicyVersionMutation = useUpdatePolicyVersion()
  const onSubmit = (data: PolicyVersionFormData) => {
    const formData = new FormData()

    formData.append('title', data.title)
    if (data.description) {
      formData.append('description', data.description)
    }

    if (isUpdate && currentRow?.id) {
      updatePolicyVersionMutation.mutate({
        versionId: currentRow.id,
        payload: formData,
      })
    } else {
      if (!policyId) {
        console.error('policyId is required for creating version')
        return
      }
      createPolicyVersionMutation.mutate({
        policyId,
        payload: formData,
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
            {isUpdate ? 'Update' : 'Create'} Policy Version
          </SheetTitle>
        </SheetHeader>
        <Form {...form}>
          <form
            id='policy-versions'
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
          </form>
        </Form>
        <SheetFooter className='gap-2'>
          <SheetClose asChild>
            <Button variant='outline'>Close</Button>
          </SheetClose>
          <Button
            form='policy-versions'
            type='submit'
            disabled={
              createPolicyVersionMutation.isPending ||
              updatePolicyVersionMutation.isPending
            }
          >
            {(createPolicyVersionMutation.isPending ||
              updatePolicyVersionMutation.isPending) && (
              <Loader2 className='mr-2 h-4 w-4 animate-spin' />
            )}
            Save changes
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
