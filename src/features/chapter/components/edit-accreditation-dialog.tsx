import { useEffect } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Accreditation } from '@/services/accreditation-services/types'
import { useUpdateAccreditation } from '@/hooks/use-accreditations'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
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
import { Textarea } from '@/components/ui/textarea'

const formSchema = z.object({
  name: z
    .string()
    .min(2, 'Accreditation name must be at least 2 characters.')
    .max(60, 'Accreditation name must not be longer than 60 characters.'),
  status: z
    .enum(['Active', 'Inactive'])
    .refine((val) => !!val, { message: 'Please select a valid status.' }),
  description: z
    .string()
    .max(160, 'Description must not exceed 160 characters.')
    .optional(),
})

type TaskImportDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  accreditation?: Accreditation
}

type FormValues = z.infer<typeof formSchema>

const defaultValues: Partial<FormValues> = {
  name: '',
  status: 'Active',
  description: '',
}

export function EditAccreditationDialog({
  open,
  onOpenChange,
  accreditation,
}: TaskImportDialogProps) {
  const form = useForm<any>({
    resolver: zodResolver(formSchema),
    defaultValues,
    mode: 'onChange',
  })

  useEffect(() => {
    if (open && accreditation) {
      form.reset({
        name: accreditation.name || '',
        status: accreditation.status || 'Active',
        description: accreditation.description || '',
      })
    }
  }, [open, accreditation])

  const updateAccreditation = useUpdateAccreditation()

  const onSubmit = (data: FormValues) => {
    if (!accreditation?.id) return

    updateAccreditation.mutate({ id: accreditation.id, payload: data })
    onOpenChange(false)
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(val) => {
        onOpenChange(val)
        form.reset()
      }}
    >
      <DialogContent className='gap-2 sm:max-w-sm'>
        <DialogHeader className='mb-4 text-start'>
          <DialogTitle>Edit Accreditation</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            id='edit-accriditation-form'
            onSubmit={form.handleSubmit(onSubmit)}
            className='space-y-4'
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
        <DialogFooter className='gap-2'>
          <DialogClose asChild>
            <Button variant='outline'>Close</Button>
          </DialogClose>
          <Button type='submit' form='edit-accriditation-form'>
            Update
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
