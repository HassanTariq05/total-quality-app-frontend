import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { ThemeSwitch } from '@/components/theme-switch'
import { ContentSection } from '@/features/settings/components/content-section'
import { CreateAccreditationForm } from './form'

export function CreateAccreditations() {
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
        <ContentSection title='Create Accreditation' desc=''>
          <CreateAccreditationForm />
        </ContentSection>
      </Main>
    </>
  )
}
