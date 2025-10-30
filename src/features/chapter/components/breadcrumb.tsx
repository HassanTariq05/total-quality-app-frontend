import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'

type ChapterBreadcrumbProps = {
  accreditationId: string
  accreditationName: string
  chapterId: string
  chapterName: string
}

export const ChapterBreadcrumb = ({
  accreditationId,
  accreditationName,
  chapterId,
  chapterName,
}: ChapterBreadcrumbProps) => {
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
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  )
}
