import { z } from 'zod'

export const ChannelSchema = z.enum(['web', 'mobile', 'marketplace', 'retail'])
export type Channel = z.infer<typeof ChannelSchema>

export const OrderStatusSchema = z.enum([
  'pending',
  'paid',
  'shipped',
  'cancelled',
])
export type OrderStatus = z.infer<typeof OrderStatusSchema>

export const OrderSchema = z.object({
  id: z.string(),
  date: z.string(),
  customer: z.string().min(1),
  channel: ChannelSchema,
  amount: z.number().nonnegative(),
  status: OrderStatusSchema,
})

export type Order = z.infer<typeof OrderSchema>

export const PaginatedOrdersSchema = z.object({
  items: z.array(OrderSchema),
  total: z.number().int().nonnegative(),
  page: z.number().int().positive(),
  pageSize: z.number().int().positive(),
})

export type PaginatedOrders = z.infer<typeof PaginatedOrdersSchema>

export const OrderSortFieldSchema = z.enum([
  'date',
  'amount',
  'customer',
  'channel',
  'status',
])
export type OrderSortField = z.infer<typeof OrderSortFieldSchema>

export const SortDirectionSchema = z.enum(['asc', 'desc'])
export type SortDirection = z.infer<typeof SortDirectionSchema>

export const OrderSortSchema = z
  .string()
  .regex(/^(date|amount|customer|channel|status):(asc|desc)$/)

export type OrderSort = `${OrderSortField}:${SortDirection}`

export function parseOrderSort(value: string): OrderSort {
  return OrderSortSchema.parse(value) as OrderSort
}
