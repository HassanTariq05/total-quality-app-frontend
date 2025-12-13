export const NoDocumentPlaceholder = () => {
  return (
    <div className='flex h-screen flex-col items-center justify-center'>
      <div className='bg-primary/10 mb-4 rounded-full p-6'>
        <svg
          xmlns='http://www.w3.org/2000/svg'
          className='text-muted-foreground h-10 w-10'
          fill='none'
          viewBox='0 0 24 24'
          stroke='currentColor'
          strokeWidth={1.5}
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            d='M9 13h6m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h6l6 6v10a2 2 0 01-2 2z'
          />
        </svg>
      </div>
      <h2 className='text-xl font-semibold'>No Document Found</h2>
      <p className='text-muted-foreground mt-2 text-sm'>
        Please upload a policy document.
      </p>
    </div>
  )
}

export default NoDocumentPlaceholder
