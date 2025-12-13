export function PolicyEditorSkeleton() {
  return (
    <div className='mt-2 flex flex-1 animate-pulse flex-col rounded-xl border-2 border-solid p-6'>
      <div className='mb-6 flex flex-row justify-between'>
        <div className='bg-muted h-8 w-19/20 animate-pulse rounded' />
        <div className='bg-muted h-8 w-1/30 animate-pulse rounded-4xl' />
      </div>

      <div className='flex flex-1 flex-row justify-between'>
        <div className='bg-muted h-full w-full animate-pulse rounded' />
      </div>
    </div>
  )
}
