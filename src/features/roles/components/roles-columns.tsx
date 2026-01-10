import { type ColumnDef } from '@tanstack/react-table'
import moment from 'moment'
import { DataTableColumnHeader } from '@/components/data-table'
import { LongText } from '@/components/long-text'
import { type Role } from '../data/schema'
import { DataTableRowActions } from './data-table-row-actions'

export const rolesColumns: ColumnDef<Role>[] = [
  {
    id: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Name' />
    ),
    cell: ({ row }) => {
      return <LongText className='max-w-36'>{row.original.name}</LongText>
    },
    meta: { className: 'w-36' },
  },
  {
    id: 'description',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Description' />
    ),
    cell: ({ row }) => {
      return (
        <LongText className='max-w-66'>{row.original.description}</LongText>
      )
    },
    meta: { className: 'w-66' },
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Created At' />
    ),
    cell: ({ row }) => {
      const value = row.getValue('createdAt')
      return <div>{value ? moment(value).format('DD MMM YYYY') : '-'}</div>
    },
    enableSorting: true,
  },
  {
    accessorKey: 'updatedAt',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Updated At' />
    ),
    cell: ({ row }) => {
      const value = row.getValue('updatedAt')
      return <div>{value ? moment(value).format('DD MMM YYYY') : '-'}</div>
    },
    enableSorting: true,
  },
  {
    id: 'actions',
    cell: DataTableRowActions,
  },
]
