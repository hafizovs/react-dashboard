import { apiFetch } from '@/shared/api'

import { MetricsSchema, type Metrics } from './model'

export const metricsKeys = {
  all: ['metrics'] as const,
  range: (from: string, to: string) =>
    [...metricsKeys.all, from, to] as const,
}

export type MetricsQueryParams = {
  from: string
  to: string
}

export async function fetchMetrics(
  params: MetricsQueryParams,
): Promise<Metrics> {
  const search = new URLSearchParams({
    from: params.from,
    to: params.to,
  })
  const data = await apiFetch<Metrics>(`/api/metrics?${search.toString()}`)
  return MetricsSchema.parse(data)
}
