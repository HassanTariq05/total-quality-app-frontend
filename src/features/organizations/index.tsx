import { getRouteApi } from '@tanstack/react-router'
import { useOrganizations } from '@/hooks/use-organizations'
import { InfoSkeleton } from '@/components/ui/info-skeleton'
import { ConfigDrawer } from '@/components/config-drawer'
import { DataTableSkeleton } from '@/components/data-table/data-table-skeleton'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { ThemeSwitch } from '@/components/theme-switch'
import { OrgsBreadcrumb } from './components/breadcrumb'
import { OrganizationsDialogs } from './components/organizations-dialogs'
import { OrganizationsPrimaryButtons } from './components/organizations-primary-buttons'
import { OrganizationsProvider } from './components/organizations-provider'
import { OrganizationsTable } from './components/organizations-table'

const route = getRouteApi('/_authenticated/organizations')

export function Organizations() {
  const search = route.useSearch()
  const navigate = route.useNavigate()

  const { data: organizations, isPending: isLoadingOrganizations } =
    useOrganizations()

  return (
    <OrganizationsProvider>
      <Header fixed>
        <div className='ms-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ConfigDrawer />
          <ProfileDropdown />
        </div>
      </Header>

      <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
        {isLoadingOrganizations ? (
          <>
            <InfoSkeleton />
            <DataTableSkeleton />
          </>
        ) : (
          <>
            <OrgsBreadcrumb />
            <div className='flex flex-wrap items-end justify-between gap-2'>
              <div>
                <h2 className='text-2xl font-bold tracking-tight'>
                  Organization List
                </h2>
                <p className='text-muted-foreground'>
                  Manage your organizations here.
                </p>
              </div>
              <OrganizationsPrimaryButtons />
            </div>
            <OrganizationsTable
              data={organizations || []}
              search={search}
              navigate={navigate}
            />
          </>
        )}
      </Main>

      <OrganizationsDialogs />
    </OrganizationsProvider>
  )
}
