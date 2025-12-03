export function InfoSkeleton() {
  return (
    <div className='flex flex-row justify-between'>
      <div>
        <div className='bg-muted h-3 w-40 animate-pulse rounded' />
        <div className='bg-muted mt-10 h-5 w-40 animate-pulse rounded' />
        <div className='bg-muted mt-2 h-5 w-80 animate-pulse rounded' />
      </div>
      <div>
        <div className='bg-muted mt-15 h-10 w-35 animate-pulse rounded' />
      </div>
    </div>
  )
}
