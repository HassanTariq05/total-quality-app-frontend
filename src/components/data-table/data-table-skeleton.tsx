export function DataTableSkeleton() {
  return (
    <div className='flex flex-1 flex-col gap-4'>
      <div className='bg-muted h-7 w-40 animate-pulse rounded' />
      <div className='bg-muted h-10 w-80 animate-pulse rounded' />
      <div className='overflow-hidden rounded-md border'>
        <div className='bg-muted/40 grid grid-cols-[40px_1.5fr_2fr_1fr_40px] border-b'>
          <div className='bg-muted h-10 animate-pulse' />
          <div className='bg-muted h-10 animate-pulse' />
          <div className='bg-muted h-10 animate-pulse' />
          <div className='bg-muted h-10 animate-pulse' />
          <div className='bg-muted h-10 animate-pulse' />
        </div>

        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className='grid grid-cols-[40px_1.5fr_2fr_1fr_40px] border-b last:border-0'
          >
            <div className='bg-muted/30 h-12 animate-pulse' />

            <div className='bg-muted/30 h-12 animate-pulse' />

            <div className='bg-muted/30 h-12 animate-pulse' />

            <div className='bg-muted/30 h-12 animate-pulse' />

            <div className='bg-muted/30 h-12 animate-pulse' />
          </div>
        ))}
      </div>

      <div className='bg-muted h-10 w-full animate-pulse rounded' />
    </div>
  )
}
