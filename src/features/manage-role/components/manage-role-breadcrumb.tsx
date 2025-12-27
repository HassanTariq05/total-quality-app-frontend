import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'

type ManageRoleBreadcrumbProps = {
  roleId: string
  roleName: string
}

export const ManageRoleBreadcrumb = ({
  roleId,
  roleName,
}: ManageRoleBreadcrumbProps) => {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href={`/roles`}>Roles</BreadcrumbLink>
          <BreadcrumbSeparator />
          <BreadcrumbLink href={`/manage-role/${roleId}`}>
            {roleName}
          </BreadcrumbLink>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  )
}
