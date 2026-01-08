'use client'

import { useState, useEffect } from 'react'
import { useParams } from '@tanstack/react-router'
import { ChevronDown } from 'lucide-react'
import { useRole } from '@/hooks/use-roles'
import { useUpdateRole } from '@/hooks/use-roles'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import { InfoSkeleton } from '@/components/ui/info-skeleton'
import { DataTableSkeleton } from '@/components/data-table/data-table-skeleton'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { ThemeSwitch } from '@/components/theme-switch'
import { ManageRoleBreadcrumb } from './components/manage-role-breadcrumb'
import { ManageRolesProvider } from './components/manage-role-provider'
import { permissionsData } from './data/permission-data'

export function ManageRoles() {
  const params = useParams({ from: '/_authenticated/manage-role/$roleId' })
  const { roleId } = params

  const { data: roleData, isPending } = useRole(roleId) as any
  const updateRoleMutation = useUpdateRole()

  const [selectedPermissions, setSelectedPermissions] = useState<Set<string>>(
    new Set()
  )

  useEffect(() => {
    if (roleData?.permissions) {
      setSelectedPermissions(new Set(roleData.permissions))
    }
  }, [roleData])

  const togglePermission = (permissionValue: string) => {
    setSelectedPermissions((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(permissionValue)) {
        newSet.delete(permissionValue)
      } else {
        newSet.add(permissionValue)
      }
      return newSet
    })
  }

  const handleSave = () => {
    updateRoleMutation.mutate({
      id: roleId,
      payload: {
        ...roleData,
        permissions: Array.from(selectedPermissions),
        organisationId: roleData?.organisation?.id as any,
      },
    })
  }

  return (
    <ManageRolesProvider>
      <Header fixed>
        <div className='ms-auto flex items-center gap-4'>
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>

      <Main className='flex flex-1 flex-col gap-6 p-6'>
        <ManageRoleBreadcrumb
          roleId={roleData?.id || ''}
          roleName={roleData?.name || ''}
        />
        <div className='bg-background/80 top-16 z-10 flex justify-between backdrop-blur'>
          <h2 className='text-2xl font-bold tracking-tight'>
            {roleData?.name}
          </h2>
          <Button
            size='sm'
            onClick={handleSave}
            disabled={updateRoleMutation.isPending}
          >
            Save Changes
          </Button>
        </div>
        {isPending ? (
          <>
            <InfoSkeleton />
            <DataTableSkeleton />
          </>
        ) : (
          <div className='flex flex-wrap items-start gap-6'>
            {permissionsData.map((permission) => (
              <Card
                key={permission.id}
                className='w-full rounded-xl md:w-[calc(50%-0.75rem)]'
              >
                <Collapsible>
                  <CardHeader className='gap-0'>
                    {' '}
                    <CollapsibleTrigger className='group flex w-full items-center justify-between'>
                      <CardTitle className='text-base font-semibold'>
                        {permission.name}
                      </CardTitle>
                      <ChevronDown className='text-muted-foreground h-4 w-4 transition-transform data-[state=open]:rotate-180' />
                    </CollapsibleTrigger>{' '}
                  </CardHeader>

                  <CollapsibleContent>
                    <CardContent className='space-y-2 pt-2'>
                      {permission.actions.map((action) => {
                        const isChecked = selectedPermissions.has(action.value)
                        const checkboxId = `${permission.id}-${action.value}`

                        return (
                          <label
                            key={action.value}
                            htmlFor={checkboxId}
                            onClick={(e) => {
                              e.preventDefault()
                              togglePermission(action.value)
                            }}
                            className='hover:bg-muted/50 active:bg-muted flex cursor-pointer items-center justify-between rounded-lg border px-4 py-2 transition-colors'
                          >
                            <span className='text-sm font-medium'>
                              {action.label}
                            </span>
                            <Checkbox checked={isChecked} id={checkboxId} />
                          </label>
                        )
                      })}
                    </CardContent>
                  </CollapsibleContent>
                </Collapsible>
              </Card>
            ))}
          </div>
        )}
      </Main>
    </ManageRolesProvider>
  )
}
