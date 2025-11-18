import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { CreateAccreditationPayload } from '@/services/accreditation-services/accreditation-services'
import { useCreateAccreditation } from '@/hooks/use-accreditations'
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
import { Textarea } from '@/components/ui/textarea'

const profileFormSchema = z.object({
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

type FormValues = z.infer<typeof profileFormSchema>

// This can come from your database or API.
const defaultValues: Partial<FormValues> = {
  name: '',
  status: 'Active',
  description: '',
}

export function CreateAccreditationForm() {
  const form = useForm<FormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues,
    mode: 'onChange',
  })

  const createMutation = useCreateAccreditation()

  const handleFormSubmit = (data: CreateAccreditationPayload) => {
    console.log('Data: ', data)
    createMutation.mutate({
      name: data?.name,
      description: data?.description,
      status: data?.status,
    })
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((data) => handleFormSubmit(data))}
        className='space-y-8'
      >
        <FormField
          control={form.control}
          name='name'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder='Enter name' {...field} />
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
              <Select onValueChange={field.onChange} defaultValue={field.value}>
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
        <Button type='submit'>Submit</Button>
      </form>
    </Form>
  )
}
