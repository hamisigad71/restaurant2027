import { StatsCards } from "@/components/dashboard/stats-cards"
import { SalesChart } from "@/components/dashboard/sales-chart"
import { TopProducts } from "@/components/dashboard/top-products"
import { RecentOrders } from "@/components/dashboard/recent-orders"
import { LowStockAlerts } from "@/components/dashboard/low-stock-alerts"

export default function DashboardPage() {
  return (
    <div className="flex flex-col min-h-screen">
      
      <div className="flex-1 py-4 px-0 space-y-6">
        {/* Stats Cards */}
        <StatsCards />

        {/* Charts Row */}
        <div className="grid gap-6 lg:grid-cols-2">
          <SalesChart />
          <TopProducts />
        </div>

        {/* Orders and Alerts Row */}
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <RecentOrders />
          </div>
          <LowStockAlerts />
        </div>
      </div>
    </div>
  )
}
