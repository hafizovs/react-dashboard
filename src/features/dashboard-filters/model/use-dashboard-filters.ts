import { parseAsInteger, parseAsString, useQueryStates } from 'nuqs'

import type { OrderSort } from '@/entities/order'

import { getDefaultDateRange } from '../lib/default-range'

const defaults = getDefaultDateRange()

export function useDashboardFilters() {
  return useQueryStates(
    {
      from: parseAsString.withDefault(defaults.from),
      to: parseAsString.withDefault(defaults.to),
      page: parseAsInteger.withDefault(1),
      pageSize: parseAsInteger.withDefault(25),
      sort: parseAsString.withDefault('date:desc'),
    },
    { history: 'push' },
  )
}

export type DashboardFilters = {
  from: string
  to: string
  page: number
  pageSize: number
  sort: OrderSort
}

export function toDashboardFilters(
  state: Awaited<ReturnType<typeof useDashboardFilters>>[0],
): DashboardFilters {
  return {
    from: state.from,
    to: state.to,
    page: state.page,
    pageSize: state.pageSize,
    sort: state.sort as OrderSort,
  }
}
