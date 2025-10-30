import { createFileRoute } from '@tanstack/react-router'
import { ChapterView } from '@/features/chapter'

export const Route = createFileRoute('/_authenticated/chapter/$chapterId')({
  component: ChapterView,
})
