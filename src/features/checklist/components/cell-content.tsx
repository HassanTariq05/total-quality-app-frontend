import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/input'

export const CellContent = ({ cell }: any) => {
  const alignmentClass = cn({
    'justify-start text-left':
      cell.alignment === 'left' || cell.alignment == 'Field',
    'justify-center text-center': cell.alignment === 'center',
    'justify-end text-right': cell.alignment === 'right',
  })

  switch (cell.type) {
    case 'label':
      return (
        <div className={cn('flex w-full', alignmentClass)}>
          <span
            className={cn(
              'text-foreground text-sm',
              cell.noWrap ? '' : 'break-words whitespace-normal'
            )}
          >
            {cell.value}
          </span>
        </div>
      )

    case 'field':
      return (
        <div className={cn('flex w-full', alignmentClass)}>
          <Input
            disabled
            className='bg-muted text-muted-foreground w-full text-sm'
            placeholder={cell.placeholder}
          />
        </div>
      )

    case 'checkbox':
      return (
        <div className={cn('flex w-full items-center gap-1', alignmentClass)}>
          <input type='checkbox' disabled />
          <span className='text-foreground text-sm break-words whitespace-normal'>
            {cell.value}
          </span>
        </div>
      )

    case 'date':
      return (
        <div className={cn('flex w-full', alignmentClass)}>
          <Input
            type='date'
            disabled
            className='bg-muted text-muted-foreground w-full text-sm'
          />
        </div>
      )

    case 'signature':
      return (
        <div className={cn('flex w-full', alignmentClass)}>
          <div className='border-muted-foreground/50 flex h-[36px] w-full flex-col justify-end border-b border-dashed p-2 text-center'>
            <span className='text-muted-foreground text-xs'>Signature</span>
          </div>
        </div>
      )

    case 'link':
      return (
        <div className={cn('flex w-full', alignmentClass)}>
          <a
            href={cell.linkUrl || '#'}
            target='_blank'
            rel='noopener noreferrer'
            className='pointer-events-none text-sm break-words whitespace-normal text-blue-600 underline opacity-70'
          >
            {cell.linkText || 'Link'}
          </a>
        </div>
      )

    default:
      return null
  }
}
