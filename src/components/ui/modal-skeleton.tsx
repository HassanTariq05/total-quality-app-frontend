export const ModalSkeleton = () => (
  <div className='animate-pulse space-y-4 p-6'>
    <div className='bg-muted h-8 w-48 rounded' />
    <div className='space-y-3'>
      {[...Array(6)].map((_, i) => (
        <div key={i} className='bg-muted h-10 rounded' />
      ))}
    </div>
    <div className='flex justify-end gap-3'>
      <div className='bg-muted h-10 w-24 rounded' />
      <div className='bg-muted h-10 w-24 rounded' />
    </div>
  </div>
)
