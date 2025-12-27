import { getRouteApi } from '@tanstack/react-router'
import { useRoles } from '@/hooks/use-roles'
import { InfoSkeleton } from '@/components/ui/info-skeleton'
import { ConfigDrawer } from '@/components/config-drawer'
import { DataTableSkeleton } from '@/components/data-table/data-table-skeleton'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { ThemeSwitch } from '@/components/theme-switch'
import { RolesBreadcrumb } from './components/breadcrumb'
import { RolesDialogs } from './components/roles-dialogs'
import { RolesPrimaryButtons } from './components/roles-primary-buttons'
import { RolesProvider } from './components/roles-provider'
import { RolesTable } from './components/roles-table'

const route = getRouteApi('/_authenticated/roles')

export function Roles() {
  const search = route.useSearch()
  const navigate = route.useNavigate()

  const { data: roles, isPending: isLoadingRoles } = useRoles()

  return (
    <RolesProvider>
      <Header fixed>
        <div className='ms-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ConfigDrawer />
          <ProfileDropdown />
        </div>
      </Header>

      <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
        {isLoadingRoles ? (
          <>
            <InfoSkeleton />
            <DataTableSkeleton />
          </>
        ) : (
          <>
            <RolesBreadcrumb />
            <div className='flex flex-wrap items-end justify-between gap-2'>
              <div>
                <h2 className='text-2xl font-bold tracking-tight'>Role List</h2>
                <p className='text-muted-foreground'>Manage your roles here.</p>
              </div>
              <RolesPrimaryButtons />
            </div>
            <RolesTable
              data={roles || []}
              search={search}
              navigate={navigate}
            />
          </>
        )}
      </Main>

      <RolesDialogs />
    </RolesProvider>
  )
}
