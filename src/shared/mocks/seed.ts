import { addDays, format, subDays } from 'date-fns'

import type { Channel, Order, OrderStatus } from '@/entities/order'

const CUSTOMERS = [
  'Acme Corp',
  'Globex',
  'Initech',
  'Umbrella LLC',
  'Stark Industries',
  'Wayne Enterprises',
  'Oscorp',
  'Cyberdyne',
  'Soylent Co',
  'Massive Dynamic',
] as const

const CHANNELS: Channel[] = ['web', 'mobile', 'marketplace', 'retail']
const STATUSES: OrderStatus[] = ['pending', 'paid', 'shipped', 'cancelled']

function pick<T>(items: readonly T[], index: number): T {
  return items[index % items.length]!
}

export function seedOrders(referenceDate = new Date()): Order[] {
  const orders: Order[] = []
  const start = subDays(referenceDate, 89)

  for (let index = 0; index < 240; index += 1) {
    const dayOffset = index % 90
    const date = format(addDays(start, dayOffset), 'yyyy-MM-dd')
    const channel = pick(CHANNELS, index)
    const status = pick(STATUSES, index * 3)
    const amount = Math.round((40 + (index * 17) % 460) * 100) / 100

    orders.push({
      id: `ord-${String(index + 1).padStart(4, '0')}`,
      date,
      customer: pick(CUSTOMERS, index * 2),
      channel,
      amount,
      status,
    })
  }

  return orders
}
