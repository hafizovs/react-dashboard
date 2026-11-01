import { ChannelChart } from '@/widgets/channel-chart'
import { FilterBar } from '@/widgets/filter-bar'
import { OrdersTable } from '@/widgets/orders-table'
import { RevenueChart } from '@/widgets/revenue-chart'

export function DashboardPage() {
  return (
    <div className="mx-auto flex w-full min-w-0 max-w-6xl flex-col gap-4 px-3 py-6 sm:gap-6 sm:px-4 sm:py-8">
      <FilterBar />
      <div className="grid min-w-0 gap-4 sm:gap-6 md:grid-cols-2">
        <RevenueChart />
        <ChannelChart />
      </div>
      <OrdersTable />
    </div>
  )
}
