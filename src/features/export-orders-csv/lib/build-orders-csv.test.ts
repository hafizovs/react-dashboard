import { describe, expect, it } from 'vitest'

import type { Order } from '@/entities/order'

import { buildOrdersCsv } from './build-orders-csv'

const sampleOrder: Order = {
  id: 'ord-1',
  date: '2026-10-01',
  customer: 'Acme, Inc',
  channel: 'web',
  amount: 120.5,
  status: 'paid',
}

describe('buildOrdersCsv', () => {
  it('escapes commas and quotes in cells', () => {
    const csv = buildOrdersCsv([sampleOrder], [
      { id: 'customer', header: 'Customer' },
      { id: 'amount', header: 'Amount' },
    ])
    expect(csv).toBe('Customer,Amount\n"Acme, Inc",120.5')
  })

  it('returns header only for empty rows', () => {
    const csv = buildOrdersCsv([], [{ id: 'id', header: 'ID' }])
    expect(csv).toBe('ID')
  })
})
