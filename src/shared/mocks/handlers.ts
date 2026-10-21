import { eachDayOfInterval, format, parseISO } from 'date-fns'
import { http, HttpResponse } from 'msw'

import {
  parseOrderSort,
  type Order,
  type OrderSortField,
} from '@/entities/order'

import { getOrders } from './db'

function parseDateParam(value: string | null, fallback: string): string {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return fallback
  }
  return value
}

function parsePositiveInt(value: string | null, fallback: number): number {
  const parsed = Number(value)
  if (!Number.isFinite(parsed) || parsed < 1) {
    return fallback
  }
  return Math.floor(parsed)
}

function compareOrders(a: Order, b: Order, field: OrderSortField): number {
  switch (field) {
    case 'date':
      return a.date.localeCompare(b.date)
    case 'amount':
      return a.amount - b.amount
    case 'customer':
      return a.customer.localeCompare(b.customer)
    case 'channel':
      return a.channel.localeCompare(b.channel)
    case 'status':
      return a.status.localeCompare(b.status)
    default:
      return 0
  }
}

function filterByRange(orders: Order[], from: string, to: string): Order[] {
  return orders.filter((order) => order.date >= from && order.date <= to)
}

function sortOrders(orders: Order[], sortToken: string): Order[] {
  const sort = parseOrderSort(sortToken)
  const [field, direction] = sort.split(':') as [
    OrderSortField,
    'asc' | 'desc',
  ]
  return [...orders].sort((a, b) => {
    const base = compareOrders(a, b, field)
    return direction === 'asc' ? base : -base
  })
}

export const handlers = [
  http.get('/api/orders', ({ request }) => {
    const url = new URL(request.url)
    const today = format(new Date(), 'yyyy-MM-dd')
    const from = parseDateParam(url.searchParams.get('from'), today)
    const to = parseDateParam(url.searchParams.get('to'), today)
    const page = parsePositiveInt(url.searchParams.get('page'), 1)
    const pageSize = Math.min(
      parsePositiveInt(url.searchParams.get('pageSize'), 25),
      100,
    )
    const sort = url.searchParams.get('sort') ?? 'date:desc'

    const filtered = sortOrders(filterByRange(getOrders(), from, to), sort)
    const total = filtered.length
    const start = (page - 1) * pageSize
    const items = filtered.slice(start, start + pageSize)

    return HttpResponse.json({
      items,
      total,
      page,
      pageSize,
    })
  }),

  http.get('/api/metrics', ({ request }) => {
    const url = new URL(request.url)
    const today = format(new Date(), 'yyyy-MM-dd')
    const from = parseDateParam(url.searchParams.get('from'), today)
    const to = parseDateParam(url.searchParams.get('to'), today)

    const filtered = filterByRange(getOrders(), from, to)

    const revenueByDayMap = new Map<string, number>()
    for (const order of filtered) {
      if (order.status === 'cancelled') {
        continue
      }
      revenueByDayMap.set(
        order.date,
        (revenueByDayMap.get(order.date) ?? 0) + order.amount,
      )
    }

    const interval = eachDayOfInterval({
      start: parseISO(from),
      end: parseISO(to),
    })

    const revenueByDay = interval.map((day) => {
      const date = format(day, 'yyyy-MM-dd')
      return {
        date,
        revenue: Math.round((revenueByDayMap.get(date) ?? 0) * 100) / 100,
      }
    })

    const revenueByChannelMap = new Map<string, number>()
    for (const order of filtered) {
      if (order.status === 'cancelled') {
        continue
      }
      revenueByChannelMap.set(
        order.channel,
        (revenueByChannelMap.get(order.channel) ?? 0) + order.amount,
      )
    }

    const revenueByChannel = [...revenueByChannelMap.entries()].map(
      ([channel, revenue]) => ({
        channel,
        revenue: Math.round(revenue * 100) / 100,
      }),
    )

    return HttpResponse.json({
      revenueByDay,
      revenueByChannel,
    })
  }),
]
