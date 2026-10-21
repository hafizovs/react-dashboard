import { useQuery } from '@tanstack/react-query'
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
  type VisibilityState,
} from '@tanstack/react-table'
import { useVirtualizer } from '@tanstack/react-virtual'
import { useMemo, useRef, useState } from 'react'

import {
  fetchOrders,
  orderKeys,
  type Order,
  type OrderSort,
  type OrderSortField,
} from '@/entities/order'
import {
  toDashboardFilters,
  useDashboardFilters,
} from '@/features/dashboard-filters'
import {
  buildOrdersCsv,
  downloadCsv,
  type CsvColumn,
} from '@/features/export-orders-csv'
import { Button, EmptyState, Skeleton } from '@/shared/ui'

const ROW_HEIGHT = 44

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(value)
}

function nextSort(current: OrderSort, field: OrderSortField): OrderSort {
  const [activeField, direction] = current.split(':') as [
    OrderSortField,
    'asc' | 'desc',
  ]
  if (activeField !== field) {
    return `${field}:asc`
  }
  return direction === 'asc' ? `${field}:desc` : `${field}:asc`
}

function sortIndicator(current: OrderSort, field: OrderSortField): string {
  const [activeField, direction] = current.split(':') as [
    OrderSortField,
    'asc' | 'desc',
  ]
  if (activeField !== field) {
    return ''
  }
  return direction === 'asc' ? ' ↑' : ' ↓'
}

const csvColumns: CsvColumn<Order>[] = [
  { id: 'id', header: 'Order ID' },
  { id: 'date', header: 'Date' },
  { id: 'customer', header: 'Customer' },
  { id: 'channel', header: 'Channel' },
  { id: 'amount', header: 'Amount', format: (value) => String(value) },
  { id: 'status', header: 'Status' },
]

export function OrdersTable() {
  const [filters, setFilters] = useDashboardFilters()
  const range = toDashboardFilters(filters)
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})

  const ordersQuery = useQuery({
    queryKey: orderKeys.list(range),
    queryFn: () => fetchOrders(range),
  })

  const columns = useMemo<ColumnDef<Order>[]>(
    () => [
      {
        accessorKey: 'id',
        header: 'Order',
        enableSorting: true,
      },
      {
        accessorKey: 'date',
        header: 'Date',
        enableSorting: true,
      },
      {
        accessorKey: 'customer',
        header: 'Customer',
        enableSorting: true,
      },
      {
        accessorKey: 'channel',
        header: 'Channel',
        enableSorting: true,
        cell: ({ getValue }) => {
          const value = String(getValue())
          return value.charAt(0).toUpperCase() + value.slice(1)
        },
      },
      {
        accessorKey: 'amount',
        header: 'Amount',
        enableSorting: true,
        cell: ({ getValue }) => formatCurrency(Number(getValue())),
      },
      {
        accessorKey: 'status',
        header: 'Status',
        enableSorting: true,
        cell: ({ getValue }) => {
          const value = String(getValue())
          return value.charAt(0).toUpperCase() + value.slice(1)
        },
      },
    ],
    [],
  )

  const items = ordersQuery.data?.items ?? []
  const total = ordersQuery.data?.total ?? 0
  const pageCount = Math.max(1, Math.ceil(total / range.pageSize))

  const table = useReactTable({
    data: items,
    columns,
    state: { columnVisibility },
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    manualSorting: true,
    pageCount,
  })

  const parentRef = useRef<HTMLDivElement>(null)
  const rows = table.getRowModel().rows

  const virtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => ROW_HEIGHT,
    overscan: 8,
  })

  const visibleCsvColumns = csvColumns.filter(
    (column) => columnVisibility[column.id] !== false,
  )

  function handleExportCsv() {
    const content = buildOrdersCsv(items, visibleCsvColumns)
    downloadCsv(`orders-${range.from}-${range.to}.csv`, content)
  }

  if (ordersQuery.isLoading) {
    return (
      <section className="rounded-lg border border-[var(--border)] bg-[var(--bg)] p-4">
        <Skeleton className="mb-4 h-5 w-32" />
        <Skeleton className="mb-2 h-10 w-full" />
        <Skeleton className="h-64 w-full" />
      </section>
    )
  }

  if (ordersQuery.isError) {
    return (
      <section className="rounded-lg border border-[var(--border)] bg-[var(--bg)] p-4">
        <EmptyState
          title="Could not load orders"
          description={ordersQuery.error.message}
        />
      </section>
    )
  }

  return (
    <section className="rounded-lg border border-[var(--border)] bg-[var(--bg)] p-4 shadow-sm">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold text-[var(--text-h)]">Orders</h2>
          <p className="text-xs text-[var(--muted-foreground)]">
            {total} orders · page {range.page} of {pageCount}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="outline" size="sm" onClick={handleExportCsv}>
            Export CSV
          </Button>
        </div>
      </div>

      <div className="mb-3 flex flex-wrap gap-3 text-xs text-[var(--text-h)]">
        {table.getAllLeafColumns().map((column) => (
          <label key={column.id} className="inline-flex items-center gap-1">
            <input
              type="checkbox"
              checked={column.getIsVisible()}
              onChange={column.getToggleVisibilityHandler()}
            />
            {typeof column.columnDef.header === 'string'
              ? column.columnDef.header
              : column.id}
          </label>
        ))}
      </div>

      {items.length === 0 ? (
        <EmptyState
          title="No orders found"
          description="Adjust the date range or pagination to see seeded demo orders."
        />
      ) : (
        <>
          <div className="overflow-x-auto rounded-md border border-[var(--border)]">
            <table className="w-full min-w-[640px] border-collapse text-sm">
              <thead className="bg-[var(--muted)]">
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      const field = header.column.id as OrderSortField
                      const sortable = header.column.getCanSort()
                      return (
                        <th
                          key={header.id}
                          className="px-3 py-2 text-left font-medium text-[var(--text-h)]"
                        >
                          {sortable ? (
                            <button
                              type="button"
                              className="inline-flex items-center gap-1 hover:text-[var(--accent)]"
                              onClick={() => {
                                void setFilters({
                                  sort: nextSort(range.sort, field),
                                  page: 1,
                                })
                              }}
                            >
                              {flexRender(
                                header.column.columnDef.header,
                                header.getContext(),
                              )}
                              {sortIndicator(range.sort, field)}
                            </button>
                          ) : (
                            flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )
                          )}
                        </th>
                      )
                    })}
                  </tr>
                ))}
              </thead>
            </table>
            <div
              ref={parentRef}
              className="max-h-80 overflow-auto"
              style={{ height: Math.min(rows.length, 8) * ROW_HEIGHT }}
            >
              <table className="w-full min-w-[640px] border-collapse text-sm">
                <tbody
                  style={{
                    height: `${virtualizer.getTotalSize()}px`,
                    position: 'relative',
                  }}
                >
                  {virtualizer.getVirtualItems().map((virtualRow) => {
                    const row = rows[virtualRow.index]
                    if (!row) {
                      return null
                    }
                    return (
                      <tr
                        key={row.id}
                        className="border-t border-[var(--border)]"
                        style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: `${virtualRow.size}px`,
                          transform: `translateY(${virtualRow.start}px)`,
                        }}
                      >
                        {row.getVisibleCells().map((cell) => (
                          <td
                            key={cell.id}
                            className="px-3 py-2 text-[var(--text)]"
                          >
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext(),
                            )}
                          </td>
                        ))}
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
            <label className="flex items-center gap-2 text-xs text-[var(--text-h)]">
              Rows per page
              <select
                className="h-8 rounded-md border border-[var(--border)] bg-[var(--bg)] px-2"
                value={range.pageSize}
                onChange={(event) => {
                  void setFilters({
                    pageSize: Number(event.target.value),
                    page: 1,
                  })
                }}
              >
                {[10, 25, 50, 100].map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </label>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={range.page <= 1}
                onClick={() => {
                  void setFilters({ page: range.page - 1 })
                }}
              >
                Previous
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={range.page >= pageCount}
                onClick={() => {
                  void setFilters({ page: range.page + 1 })
                }}
              >
                Next
              </Button>
            </div>
          </div>
        </>
      )}
    </section>
  )
}
