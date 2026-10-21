import { ChannelChart } from '@/widgets/channel-chart'
import { FilterBar } from '@/widgets/filter-bar'
import { OrdersTable } from '@/widgets/orders-table'
import { RevenueChart } from '@/widgets/revenue-chart'

export function DashboardPage() {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-8">
      <FilterBar />
      <div className="grid gap-6 lg:grid-cols-2">
        <RevenueChart />
        <ChannelChart />
      </div>
      <OrdersTable />
    </div>
  )
}
