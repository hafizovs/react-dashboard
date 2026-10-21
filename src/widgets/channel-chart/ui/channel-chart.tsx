import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

import { fetchMetrics, metricsKeys } from '@/entities/metrics'
import { toDashboardFilters, useDashboardFilters } from '@/features/dashboard-filters'
import { Button, EmptyState, Skeleton } from '@/shared/ui'

const COLORS = ['#2563eb', '#7c3aed', '#059669', '#d97706']

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value)
}

type ChartMode = 'pie' | 'bar'

export function ChannelChart() {
  const [mode, setMode] = useState<ChartMode>('pie')
  const [filters] = useDashboardFilters()
  const range = toDashboardFilters(filters)

  const metricsQuery = useQuery({
    queryKey: metricsKeys.range(range.from, range.to),
    queryFn: () => fetchMetrics({ from: range.from, to: range.to }),
  })

  if (metricsQuery.isLoading) {
    return (
      <section className="rounded-lg border border-[var(--border)] bg-[var(--bg)] p-4">
        <Skeleton className="mb-4 h-5 w-48" />
        <Skeleton className="h-64 w-full" />
      </section>
    )
  }

  if (metricsQuery.isError) {
    return (
      <section className="rounded-lg border border-[var(--border)] bg-[var(--bg)] p-4">
        <EmptyState
          title="Could not load channels"
          description={metricsQuery.error.message}
        />
      </section>
    )
  }

  if (!metricsQuery.data) {
    return null
  }

  const data = metricsQuery.data.revenueByChannel.map((entry) => ({
    ...entry,
    label: entry.channel.charAt(0).toUpperCase() + entry.channel.slice(1),
  }))

  const total = data.reduce((sum, entry) => sum + entry.revenue, 0)

  return (
    <section className="rounded-lg border border-[var(--border)] bg-[var(--bg)] p-4 shadow-sm">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="text-sm font-semibold text-[var(--text-h)]">
            Revenue by channel
          </h2>
          <p className="text-xs text-[var(--muted-foreground)]">
            Toggle pie or bar view
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            type="button"
            size="sm"
            variant={mode === 'pie' ? 'default' : 'outline'}
            onClick={() => setMode('pie')}
          >
            Pie
          </Button>
          <Button
            type="button"
            size="sm"
            variant={mode === 'bar' ? 'default' : 'outline'}
            onClick={() => setMode('bar')}
          >
            Bar
          </Button>
        </div>
      </div>
      {total === 0 ? (
        <EmptyState
          title="No channel data"
          description="No non-cancelled orders in the selected date range."
        />
      ) : (
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            {mode === 'pie' ? (
              <PieChart>
                <Pie
                  data={data}
                  dataKey="revenue"
                  nameKey="label"
                  innerRadius={48}
                  outerRadius={88}
                  paddingAngle={2}
                >
                  {data.map((entry, index) => (
                    <Cell
                      key={entry.channel}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatCurrency(Number(value))} />
              </PieChart>
            ) : (
              <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis
                  dataKey="label"
                  tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }}
                />
                <YAxis
                  tickFormatter={(value) => formatCurrency(Number(value))}
                  tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }}
                  width={72}
                />
                <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                <Bar dataKey="revenue" fill="var(--accent)" radius={[4, 4, 0, 0]} />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>
      )}
    </section>
  )
}
