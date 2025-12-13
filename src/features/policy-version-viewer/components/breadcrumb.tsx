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
  policyVersionId: string
  policyVersionName: string
}

export const PolicyVersionBreadcrumb = ({
  accreditationId,
  accreditationName,
  chapterId,
  chapterName,
  policyId,
  policyName,
  policyVersionId,
  policyVersionName,
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
          <BreadcrumbSeparator />
          <BreadcrumbLink href={`/policy-version/${policyVersionId}`}>
            {policyVersionName}
          </BreadcrumbLink>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  )
}
