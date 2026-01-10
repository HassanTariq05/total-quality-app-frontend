import { type ColumnDef } from '@tanstack/react-table'
import { DataTableColumnHeader } from '@/components/data-table'
import { LongText } from '@/components/long-text'
import { type SubmissionsSchema } from '../data/schema'
import { DataTableRowActions } from './data-table-row-actions-submissions'

export const formColumns: ColumnDef<SubmissionsSchema>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Name' />
    ),
    cell: ({ row }) => (
      <LongText className='max-w-36'>{row.getValue('name')}</LongText>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'description',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Description' />
    ),
    meta: { className: 'ps-1', tdClassName: 'ps-4' },
    cell: ({ row }) => {
      return (
        <div className='flex space-x-2'>
          <LongText className='max-w-36'>
            {row.getValue('description')}
          </LongText>
        </div>
      )
    },
  },
  // {
  //   accessorKey: 'status',
  //   header: ({ column }) => (
  //     <DataTableColumnHeader column={column} title='Status' />
  //   ),
  //   meta: { className: 'ps-1', tdClassName: 'ps-4' },
  //   cell: ({ row }) => {
  //     return (
  //       <div className='flex w-[100px] items-center'>
  //         <span>{row?.getValue('status')}</span>
  //       </div>
  //     )
  //   },
  //   filterFn: (row, id, value) => {
  //     return value.includes(row.getValue(id))
  //   },
  // },
  {
    id: 'actions',
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
]
