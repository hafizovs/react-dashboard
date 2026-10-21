import { z } from 'zod'

import { ChannelSchema } from '@/entities/order'

export const MetricsSchema = z.object({
  revenueByDay: z.array(
    z.object({
      date: z.string(),
      revenue: z.number().nonnegative(),
    }),
  ),
  revenueByChannel: z.array(
    z.object({
      channel: ChannelSchema,
      revenue: z.number().nonnegative(),
    }),
  ),
})

export type Metrics = z.infer<typeof MetricsSchema>
