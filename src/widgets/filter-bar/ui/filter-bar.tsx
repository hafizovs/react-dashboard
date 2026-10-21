import { format, parseISO } from 'date-fns'

import { useDashboardFilters } from '@/features/dashboard-filters'
import { Button, Input } from '@/shared/ui'

export function FilterBar() {
  const [filters, setFilters] = useDashboardFilters()

  return (
    <section className="flex flex-col gap-4 rounded-lg border border-[var(--border)] bg-[var(--bg)] p-4 shadow-sm sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-lg font-semibold text-[var(--text-h)]">
          Sales dashboard
        </h1>
        <p className="text-sm text-[var(--muted-foreground)]">
          Filter by date range — synced to the URL for shareable views.
        </p>
      </div>
      <div className="flex flex-wrap items-end gap-3">
        <label className="flex flex-col gap-1 text-xs font-medium text-[var(--text-h)]">
          From
          <Input
            type="date"
            value={filters.from}
            max={filters.to}
            onChange={(event) => {
              void setFilters({ from: event.target.value, page: 1 })
            }}
          />
        </label>
        <label className="flex flex-col gap-1 text-xs font-medium text-[var(--text-h)]">
          To
          <Input
            type="date"
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
