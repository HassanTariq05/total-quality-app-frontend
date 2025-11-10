// import { Logo } from '@/assets/logo'
import DarkModeLogo from '@/assets/total-quality-app-logo-dark.png'
import LightModeLogo from '@/assets/total-quality-app-logo-light.png'
import { useTheme } from '@/context/theme-provider'

type AuthLayoutProps = {
  children: React.ReactNode
}

export function AuthLayout({ children }: AuthLayoutProps) {
  const { theme } = useTheme()

  return (
    <div className='container grid h-svh max-w-none items-center justify-center'>
      <div className='mx-auto flex w-full flex-col justify-center space-y-2 py-8 sm:w-[480px] sm:p-8'>
        <div className='mb-4 flex items-center justify-center'>
          {/* <Logo className='me-2' />
          <h1 className='text-xl font-medium'>Shadcn Admin</h1> */}

          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-start',
            }}
          >
            <img
              src={theme === 'dark' ? DarkModeLogo : LightModeLogo}
              alt='Total Quality App Logo'
              style={{ height: '52px', width: 'auto' }}
            />
          </div>
        </div>
        {children}
      </div>
    </div>
  )
}
