import { getRouteApi } from '@tanstack/react-router'
import { useOrganizations } from '@/hooks/use-organizations'
import { useRoles } from '@/hooks/use-roles'
import { useUsers } from '@/hooks/use-users'
import { InfoSkeleton } from '@/components/ui/info-skeleton'
import { ConfigDrawer } from '@/components/config-drawer'
import { DataTableSkeleton } from '@/components/data-table/data-table-skeleton'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { ThemeSwitch } from '@/components/theme-switch'
import { UsersBreadcrumb } from './components/breadcrumb'
import { UsersDialogs } from './components/users-dialogs'
import { UsersPrimaryButtons } from './components/users-primary-buttons'
import { UsersProvider } from './components/users-provider'
import { UsersTable } from './components/users-table'

const route = getRouteApi('/_authenticated/users/')

export function Users() {
  const search = route.useSearch()
  const navigate = route.useNavigate()

  const { data: users, isPending: isLoadingUsers } = useUsers()

  const { data: roles, isPending: isLoadingRoles } = useRoles()
  const { data: organizations, isPending: isLoadingOrganizations } =
    useOrganizations()

  return (
    <UsersProvider>
      <Header fixed>
        <div className='ms-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ConfigDrawer />
          <ProfileDropdown />
        </div>
      </Header>

      <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
        {isLoadingUsers || isLoadingRoles || isLoadingOrganizations ? (
          <>
            <InfoSkeleton />
            <DataTableSkeleton />
          </>
        ) : (
          <>
            <UsersBreadcrumb />
            <div className='flex flex-wrap items-end justify-between gap-2'>
              <div>
                <h2 className='text-2xl font-bold tracking-tight'>
                  Users List
                </h2>
                <p className='text-muted-foreground'>Manage your users here.</p>
              </div>
              <UsersPrimaryButtons />
            </div>
            <UsersTable
              data={users || []}
              search={search}
              navigate={navigate}
            />
          </>
        )}
      </Main>

      <UsersDialogs roles={roles} organizations={organizations} />
    </UsersProvider>
  )
}
