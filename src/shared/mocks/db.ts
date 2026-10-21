import type { Order } from '@/entities/order'

import { seedOrders } from './seed'

let orders: Order[] = seedOrders()

export function getOrders(): Order[] {
  return orders
}

export function resetMockDb(): void {
  orders = seedOrders()
}
