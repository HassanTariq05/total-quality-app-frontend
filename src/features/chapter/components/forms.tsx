import { useEffect, useState } from 'react'
import { getRouteApi } from '@tanstack/react-router'
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { cn } from '@/lib/utils'
import { useTableUrlState } from '@/hooks/use-table-url-state'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { DataTablePagination } from '@/components/data-table'
import { DataTableBulkActions } from './data-table-bulk-actions'
import { DataTableToolbarWithDebounce } from './data-table-toolbar-debounced'
import { formColumns as columns } from './forms-columns'

const route = getRouteApi('/_authenticated/chapter/$chapterId')

type DataTableProps = {
  data: any[]
  page: number
  pageSize: number
  totalPages: number
  onPageChange: (pageIndex: number) => void
  onPageSizeChange: (size: number) => void
  loading?: boolean
  setSearchKeyword: (searchKeyword: string) => void
}

export function Forms({
  data,
  page,
  pageSize,
  totalPages,
  onPageChange,
  onPageSizeChange,
  loading = false,
  setSearchKeyword,
}: DataTableProps) {
  const [isPaginating, setIsPaginating] = useState(false)

  const { ensurePageInRange } = useTableUrlState({
    search: route.useSearch(),
    navigate: route.useNavigate(),
    pagination: { defaultPage: 1, defaultPageSize: 10 },
    globalFilter: { enabled: true, key: 'filter' },
    columnFilters: [{ columnId: 'status', searchKey: 'status', type: 'array' }],
  })

  const table = useReactTable({
    data,
    columns,
    state: {
      pagination: {
        pageIndex: page,
        pageSize,
      },
    },
    manualPagination: true,
    pageCount: totalPages,

    onPaginationChange: (updater) => {
      const newState =
        typeof updater === 'function'
          ? updater({ pageIndex: page, pageSize })
          : updater

      setIsPaginating(true)

      onPageChange(newState.pageIndex)
      onPageSizeChange(newState.pageSize)
    },

    getCoreRowModel: getCoreRowModel(),
  })

  useEffect(() => {
    if (!loading) {
      setIsPaginating(false)
    }
  }, [loading, data])

  useEffect(() => {
    ensurePageInRange(totalPages)
  }, [totalPages, ensurePageInRange])

  const isLoading = loading || isPaginating

  return (
    <div className={cn('flex flex-1 flex-col gap-4')}>
      <h4 className='text-2xl font-bold tracking-tight'>Forms</h4>

      <DataTableToolbarWithDebounce
        searchPlaceholder='Filter by title...'
        onSearchChange={setSearchKeyword}
      />

      <div className='relative overflow-hidden rounded-md border'>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    colSpan={header.colSpan}
                    className={cn(
                      header.column.columnDef.meta?.className,
                      header.column.columnDef.meta?.thClassName
                    )}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={`skeleton-${index}`}>
                  {columns.map((column, colIndex) => (
                    <TableCell
                      key={colIndex}
                      className={cn(
                        'h-13',
                        column.meta?.className,
                        column.meta?.tdClassName
                      )}
                    >
                      <div
                        className={cn(
                          'bg-muted/70 h-6 w-full animate-pulse rounded-md',
                          colIndex === 0 && 'w-3/4',
                          colIndex === 1 && 'w-1/2',
                          colIndex === columns.length - 1 && 'mx-auto w-24'
                        )}
                      />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className={cn(
                        cell.column.columnDef.meta?.className,
                        cell.column.columnDef.meta?.tdClassName
                      )}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className='h-24 text-center'
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <DataTablePagination
        table={table}
        onPageSizeChange={onPageSizeChange}
        className='mt-auto'
      />

      <DataTableBulkActions table={table} />
    </div>
  )
}
