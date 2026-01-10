'use client'

import { useState, useEffect } from 'react'
import { useParams } from '@tanstack/react-router'
import { ChevronDown, Loader2 } from 'lucide-react'
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
            {updateRoleMutation.isPending ? (
              <div className='flex items-center gap-2'>
                <Loader2 className='h-4 w-4 animate-spin' />
                Saving...
              </div>
            ) : (
              'Save Changes'
            )}
          </Button>
        </div>
        {isPending ? (
          <>
            <InfoSkeleton />
            <DataTableSkeleton />
          </>
        ) : (
          <div className='flex flex-wrap items-start gap-6'>
            {permissionsData.map((permission) => {
              const allActionValues = permission.actions.map((a) => a.value)
              const allSelected = allActionValues.every((val) =>
                selectedPermissions.has(val)
              )

              const toggleAll = () => {
                setSelectedPermissions((prev) => {
                  const newSet = new Set(prev)
                  if (allSelected) {
                    // remove all
                    allActionValues.forEach((val) => newSet.delete(val))
                  } else {
                    // add all
                    allActionValues.forEach((val) => newSet.add(val))
                  }
                  return newSet
                })
              }

              return (
                <Card
                  key={permission.id}
                  className='w-[calc((100%-1.5rem)/3.1)] rounded-xl'
                >
                  <Collapsible>
                    <CardHeader className='gap-0'>
                      <CollapsibleTrigger className='group flex w-full items-center justify-between'>
                        <CardTitle className='flex w-full items-center justify-between text-base font-semibold'>
                          <span>{permission.name}</span>

                          <div
                            className='mr-2 flex items-center'
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Checkbox
                              checked={allSelected}
                              onCheckedChange={toggleAll}
                              aria-label={`Select all ${permission.name} permissions`}
                            />
                          </div>
                        </CardTitle>

                        <ChevronDown className='text-muted-foreground h-4 w-4 transition-transform data-[state=open]:rotate-180' />
                      </CollapsibleTrigger>
                    </CardHeader>

                    <CollapsibleContent>
                      <CardContent className='space-y-2 pt-2'>
                        {permission.actions.map((action) => {
                          const isChecked = selectedPermissions.has(
                            action.value
                          )
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
              )
            })}
          </div>
        )}
      </Main>
    </ManageRolesProvider>
  )
}
