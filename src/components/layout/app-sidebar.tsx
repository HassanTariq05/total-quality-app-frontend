import { BadgePlus, LucideIcon } from 'lucide-react'
import { useLayout } from '@/context/layout-provider'
import { useAccreditations } from '@/hooks/use-accreditations'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar'
// import { AppTitle } from './app-title'
import { sidebarData } from './data/sidebar-data'
import { NavGroup } from './nav-group'
import { NavUser } from './nav-user'
import { TeamSwitcher } from './team-switcher'

export function AppSidebar() {
  const { collapsible, variant } = useLayout()
  const { data: accreditations } = useAccreditations()

  const accreditationItems: {
    title: string
    url: string
    icon?: LucideIcon
  }[] =
    accreditations?.map((acc) => ({
      title: acc.name,
      url: `/accreditation/${acc.id}`,
    })) || []

  accreditationItems.push({
    title: 'Add Accreditation',
    url: '/accreditation/create',
    icon: BadgePlus,
  })

  const dynamicSidebarData = {
    ...sidebarData,
    navGroups: sidebarData.navGroups.map((group) => {
      if (group.title === 'General') {
        return {
          ...group,
          items: group.items.map((item) => {
            if (item.title === 'Accreditations') {
              return { ...item, items: accreditationItems }
            }
            return item
          }),
        }
      }
      return group
    }),
  }

  return (
    <Sidebar collapsible={collapsible} variant={variant}>
      <SidebarHeader>
        <TeamSwitcher teams={dynamicSidebarData.teams} />
      </SidebarHeader>
      <SidebarContent>
        {dynamicSidebarData.navGroups.map((props) => (
          <NavGroup key={props.title} {...props} />
        ))}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={dynamicSidebarData.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
