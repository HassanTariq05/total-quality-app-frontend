import { ChevronDown, Search, SendHorizonal } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { ThemeSwitch } from '@/components/theme-switch'

export function Dashboard() {
  return (
    <>
      <Header>
        <div className='ms-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ConfigDrawer />
          <ProfileDropdown />
        </div>
      </Header>

      <Main>
        <Button variant='outline' className='w justify-between px-4 py-2'>
          TotalAI
          <ChevronDown className='ml-2 h-4 w-4' />
        </Button>

        <div className='from-background/50 to-background/80 flex h-full w-full flex-col items-center justify-center gap-6 bg-gradient-to-br p-6'>
          <Badge
            variant='default'
            className='bg-primary text-primary-foreground rounded-full px-3 py-1 text-sm font-semibold transition-transform duration-300 hover:scale-110 hover:shadow-md'
          >
            Coming Soon
          </Badge>

          {/* Main Content */}
          <div className='mx-auto max-w-3xl text-center'>
            <h1 className='mb-4 text-2xl font-extrabold tracking-tight md:text-3xl'>
              Welcome to TotalAI
            </h1>
            <p className='text-muted-foreground mb-6 text-lg md:text-xl'>
              Experience the next generation AI chat experience.
            </p>

            <div className='relative mx-auto max-w-md'>
              {/* Left Search Icon */}
              <Search
                size={20}
                className='text-muted-foreground pointer-events-none absolute top-1/2 left-5 z-10 -translate-y-1/2'
              />

              {/* Right Send Icon */}
              <SendHorizonal
                size={20}
                className='text-primary hover:text-primary/80 absolute top-1/2 right-5 z-10 -translate-y-1/2 cursor-pointer transition-colors'
              />

              {/* Input */}
              <Input
                placeholder='Ask me anything...'
                className='bg-background/95 supports-[backdrop-filter]:bg-background/60 border-border/50 focus-visible:ring-primary/20 focus-visible:border-primary/50 relative z-0 rounded-full border py-6 pr-14 pl-14 text-lg shadow-lg backdrop-blur transition-all duration-300 hover:shadow-xl focus-visible:shadow-2xl focus-visible:ring-4'
              />
            </div>
          </div>
        </div>
      </Main>
    </>
  )
}
