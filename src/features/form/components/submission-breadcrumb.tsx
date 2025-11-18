import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'

type FormBreadcrumbProps = {
  accreditationId: string
  accreditationName: string
  chapterId: string
  chapterName: string
  formId: string
  formName: string
  submissionId: string
  submissionName: string
}

export const SubmissionsBreadcrumb = ({
  accreditationId,
  accreditationName,
  chapterId,
  chapterName,
  formId,
  formName,
  submissionId,
  submissionName,
}: FormBreadcrumbProps) => {
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
          <BreadcrumbLink href={`/form/${formId}`}>{formName}</BreadcrumbLink>
          <BreadcrumbSeparator />
          <BreadcrumbLink href={`/form-submission/${submissionId}`}>
            {submissionName}
          </BreadcrumbLink>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  )
}
