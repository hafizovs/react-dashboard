import { format, parseISO } from 'date-fns'

import { useDashboardFilters } from '@/features/dashboard-filters'
import { Button, Input } from '@/shared/ui'

export function FilterBar() {
  const [filters, setFilters] = useDashboardFilters()

  return (
    <section className="flex min-w-0 flex-col gap-4 rounded-lg border border-[var(--border)] bg-[var(--bg)] p-3 shadow-sm sm:flex-row sm:items-end sm:justify-between sm:p-4">
      <div className="min-w-0">
        <h1 className="text-base font-semibold text-[var(--text-h)] sm:text-lg">
          Sales dashboard
        </h1>
        <p className="text-sm text-[var(--muted-foreground)]">
          Filter by date range — synced to the URL for shareable views.
        </p>
      </div>
      <div className="grid w-full min-w-0 grid-cols-2 gap-3 sm:flex sm:w-auto sm:flex-wrap sm:items-end">
        <label className="flex min-w-0 flex-col gap-1 text-xs font-medium text-[var(--text-h)]">
          From
          <Input
            type="date"
            className="min-w-0"
            value={filters.from}
            max={filters.to}
            onChange={(event) => {
              void setFilters({ from: event.target.value, page: 1 })
            }}
          />
        </label>
        <label className="flex min-w-0 flex-col gap-1 text-xs font-medium text-[var(--text-h)]">
          To
          <Input
            type="date"
            className="min-w-0"
            value={filters.to}
            min={filters.from}
            onChange={(event) => {
              void setFilters({ to: event.target.value, page: 1 })
            }}
          />
        </label>
        <Button
          type="button"
          variant="outline"
          className="col-span-2 w-full sm:col-span-1 sm:w-auto"
          onClick={() => {
            void setFilters({
              from: format(parseISO(filters.to), 'yyyy-MM-dd'),
              to: filters.to,
              page: 1,
            })
          }}
        >
          Last day
        </Button>
      </div>
    </section>
  )
}
