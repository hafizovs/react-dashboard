import { useQuery } from '@tanstack/react-query'
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

import { fetchMetrics, metricsKeys } from '@/entities/metrics'
import { toDashboardFilters, useDashboardFilters } from '@/features/dashboard-filters'
import { EmptyState, Skeleton } from '@/shared/ui'

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value)
}

export function RevenueChart() {
  const [filters] = useDashboardFilters()
  const range = toDashboardFilters(filters)

  const metricsQuery = useQuery({
    queryKey: metricsKeys.range(range.from, range.to),
    queryFn: () => fetchMetrics({ from: range.from, to: range.to }),
  })

  if (metricsQuery.isLoading) {
    return (
      <section className="rounded-lg border border-[var(--border)] bg-[var(--bg)] p-4">
        <Skeleton className="mb-4 h-5 w-40" />
        <Skeleton className="h-64 w-full" />
      </section>
    )
  }

  if (metricsQuery.isError) {
    return (
      <section className="rounded-lg border border-[var(--border)] bg-[var(--bg)] p-4">
        <EmptyState
          title="Could not load revenue"
          description={metricsQuery.error.message}
        />
      </section>
    )
  }

  if (!metricsQuery.data) {
    return null
  }

  const data = metricsQuery.data.revenueByDay
  const total = data.reduce((sum, point) => sum + point.revenue, 0)

  return (
    <section className="rounded-lg border border-[var(--border)] bg-[var(--bg)] p-4 shadow-sm">
      <div className="mb-4 flex items-baseline justify-between gap-2">
        <div>
          <h2 className="text-sm font-semibold text-[var(--text-h)]">
            Revenue over time
          </h2>
          <p className="text-xs text-[var(--muted-foreground)]">
            Paid and shipped orders in range
          </p>
        </div>
        <p className="text-sm font-medium text-[var(--text-h)]">
          {formatCurrency(total)}
        </p>
      </div>
      {total === 0 ? (
        <EmptyState
          title="No revenue in this range"
          description="Try widening the date filter to see the line chart."
        />
      ) : (
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }}
                tickMargin={8}
              />
              <YAxis
                tickFormatter={(value) => formatCurrency(Number(value))}
                tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }}
                width={72}
              />
              <Tooltip
                formatter={(value) => formatCurrency(Number(value))}
                labelFormatter={(label) => `Date: ${label}`}
              />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="var(--accent)"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </section>
  )
}
