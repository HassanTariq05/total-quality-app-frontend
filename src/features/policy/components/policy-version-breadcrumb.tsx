import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'

type PolicyBreadcrumbProps = {
  accreditationId: string
  accreditationName: string
  chapterId: string
  chapterName: string
  policyId: string
  policyName: string
}

export const PolicyBreadcrumb = ({
  accreditationId,
  accreditationName,
  chapterId,
  chapterName,
  policyId,
  policyName,
}: PolicyBreadcrumbProps) => {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href={`/accreditation/${accreditationId}`}>
            {accreditationName}
          </BreadcrumbLink>
          <BreadcrumbSeparator />
          <BreadcrumbLink href={`/chapter/${chapterId}`}>
            {chapterName}
          </BreadcrumbLink>
          <BreadcrumbSeparator />
          <BreadcrumbLink href={`/policy/${policyId}`}>
            {policyName}
          </BreadcrumbLink>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  )
}
