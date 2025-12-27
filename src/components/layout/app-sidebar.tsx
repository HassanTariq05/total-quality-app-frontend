import {
  BadgePlus,
  Building2,
  Cog,
  LucideIcon,
  ShieldCheck,
  Users,
} from 'lucide-react'
import DarkModeLogoCollapsed from '@/assets/total-quality-app-logo-dark-collapsed.png'
// Adjust path
import DarkModeLogo from '@/assets/total-quality-app-logo-dark.png'
import LightModeLogoCollapsed from '@/assets/total-quality-app-logo-light-collapsed.png'
import LightModeLogo from '@/assets/total-quality-app-logo-light.png'
import { useAuthStore } from '@/stores/auth-store'
import { useLayout } from '@/context/layout-provider'
import { useTheme } from '@/context/theme-provider'
import { useAccreditations } from '@/hooks/use-accreditations'
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
  useSidebar,
} from '@/components/ui/sidebar'
// import { AppTitle } from './app-title'
import { sidebarData } from './data/sidebar-data'
import { NavGroup } from './nav-group'
import { SidebarData } from './types'

export function AppSidebar() {
  const { collapsible, variant } = useLayout()
  const { data: accreditations } = useAccreditations()

  const user = useAuthStore()

  const isSuperAdmin = user?.auth?.user?.role?.name === 'Super Admin'

  const { theme } = useTheme()

  const { state } = useSidebar()
  const accreditationItems: {
    title: string
    url: string
    icon?: LucideIcon
  }[] =
    accreditations?.map((acc) => ({
      title: acc.name,
      url: `/accreditation/${acc.id}`,
    })) || []

  isSuperAdmin
    ? accreditationItems.push({
        title: 'Add Accreditation',
        url: '/accreditation/create',
        icon: BadgePlus,
      })
    : []

  const administrationItem = {
    title: 'Administration',
    icon: Cog,
    items: [
      { title: 'Organizations', url: '/organizations', icon: Building2 },
      { title: 'Roles', url: '/roles', icon: ShieldCheck },
      { title: 'Users', url: '/users', icon: Users },
    ],
  }

  const othersNavGroup = {
    title: 'Others',
    items: [administrationItem],
  }

  const dynamicSidebarData: SidebarData = {
    ...sidebarData,
    navGroups: [
      ...sidebarData.navGroups.map((group) => {
        if (group.title !== 'General') return group

        return {
          ...group,
          items: group.items.map((item) => {
            if (item.title === 'Accreditations') {
              return { ...item, items: accreditationItems }
            }
            return item
          }),
        }
      }),
      ...(isSuperAdmin ? [othersNavGroup] : []),
    ] as any,
  }

  return (
    <Sidebar collapsible={collapsible} variant={variant}>
      {state === 'expanded' && (
        <SidebarHeader>
          {/* <TeamSwitcher teams={dynamicSidebarData.teams} /> */}

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
        </SidebarHeader>
      )}

      {state === 'collapsed' && (
        <SidebarHeader>
          {/* <TeamSwitcher teams={dynamicSidebarData.teams} /> */}

          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-start',
            }}
          >
            <img
              src={
                theme === 'dark'
                  ? DarkModeLogoCollapsed
                  : LightModeLogoCollapsed
              }
              alt='Total Quality App Logo'
              style={{ height: '32px', width: 'auto' }}
            />
          </div>
        </SidebarHeader>
      )}

      <SidebarContent>
        {dynamicSidebarData.navGroups.map((props) => (
          <NavGroup key={props.title} {...props} />
        ))}
      </SidebarContent>
      {/* <SidebarFooter>
        <NavUser user={dynamicSidebarData.user} />
      </SidebarFooter> */}
      <SidebarRail />
    </Sidebar>
  )
}
