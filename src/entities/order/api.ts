import { apiFetch } from '@/shared/api'

import {
  PaginatedOrdersSchema,
  type OrderSort,
  type PaginatedOrders,
} from './model'

export const orderKeys = {
  all: ['orders'] as const,
  list: (params: OrdersQueryParams) =>
    [...orderKeys.all, 'list', params] as const,
}

export type OrdersQueryParams = {
  from: string
  to: string
  page: number
  pageSize: number
  sort: OrderSort
}

function buildOrdersSearch(params: OrdersQueryParams): string {
  const search = new URLSearchParams({
    from: params.from,
    to: params.to,
    page: String(params.page),
    pageSize: String(params.pageSize),
    sort: params.sort,
  })
  return search.toString()
}

export async function fetchOrders(
  params: OrdersQueryParams,
): Promise<PaginatedOrders> {
  const data = await apiFetch<PaginatedOrders>(
    `/api/orders?${buildOrdersSearch(params)}`,
  )
  return PaginatedOrdersSchema.parse(data)
}
