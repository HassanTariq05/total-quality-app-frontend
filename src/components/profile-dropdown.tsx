import { useAuthStore } from '@/stores/auth-store'
import useDialogState from '@/hooks/use-dialog-state'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { SignOutDialog } from '@/components/sign-out-dialog'
import { Badge } from './ui/badge'

export function ProfileDropdown() {
  const [open, setOpen] = useDialogState()
  const { auth } = useAuthStore()

  const getUserNameInitials = () => {
    const name = auth?.user?.name
    if (!name) return '?'

    const parts = name.trim().split(' ')

    if (parts?.length === 1) {
      return parts[0][0].toUpperCase()
    }

    return `${parts[0][0]}${parts[parts?.length - 1][0]}`.toUpperCase()
  }

  return (
    <>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant='ghost' className='relative h-8 w-8 rounded-full'>
            <Avatar className='h-8 w-8'>
              <AvatarImage src='/avatars/01.png' alt={auth?.user?.name} />
              <AvatarFallback>{getUserNameInitials()}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className='w-56' align='end'>
          <DropdownMenuLabel className='border-border/50 border-b p-3 font-normal'>
            <div className='flex items-start gap-2'>
              <div className='flex min-w-0 flex-col gap-1'>
                <div className='flex flex-wrap items-center gap-2'>
                  <p className='truncate text-sm leading-none font-semibold'>
                    {auth?.user?.name || 'Unknown User'}
                  </p>
                  <Badge variant='secondary' className='px-2 py-0.5 text-xs'>
                    {auth?.user?.role?.name || 'User'}
                  </Badge>
                </div>

                <p className='text-muted-foreground truncate text-xs leading-none'>
                  {auth?.user?.email || 'No email'}
                </p>
              </div>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuItem onClick={() => setOpen(true)}>
            Sign out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <SignOutDialog open={!!open} onOpenChange={setOpen} />
    </>
  )
}
