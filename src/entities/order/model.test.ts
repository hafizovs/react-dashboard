import { describe, expect, it } from 'vitest'

import { OrderSchema, parseOrderSort } from './model'

const validOrder = {
  id: 'ord-1',
  date: '2026-10-01',
  customer: 'Acme Corp',
  channel: 'web' as const,
  amount: 199.5,
  status: 'paid' as const,
}

describe('OrderSchema', () => {
  it('parses a valid order', () => {
    expect(OrderSchema.parse(validOrder)).toEqual(validOrder)
  })

  it('rejects invalid channels', () => {
    expect(() =>
      OrderSchema.parse({ ...validOrder, channel: 'email' }),
    ).toThrow()
  })

  it('rejects negative amounts', () => {
    expect(() => OrderSchema.parse({ ...validOrder, amount: -1 })).toThrow()
  })
})

describe('parseOrderSort', () => {
  it('accepts supported sort tokens', () => {
    expect(parseOrderSort('amount:desc')).toBe('amount:desc')
  })

  it('rejects malformed sort tokens', () => {
    expect(() => parseOrderSort('amount')).toThrow()
  })
})
