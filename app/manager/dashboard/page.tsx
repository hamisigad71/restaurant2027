import { StatsCards } from "@/components/dashboard/stats-cards"
import { ActiveOrders } from "@/components/manager/active-orders"
import { StaffOnDuty } from "@/components/manager/staff-on-duty"
import { LowStockAlerts } from "@/components/dashboard/low-stock-alerts"

export default function ManagerDashboard() {
  return (
    <div className="flex flex-col">
      
      <div className="flex-1 py-4 px-0 space-y-6">
        {/* Stats Row */}
        <StatsCards />

        {/* Operations Row */}
        <div className="grid gap-6 lg:grid-cols-2">
          <ActiveOrders />
          <div className="space-y-6">
            <StaffOnDuty />
            <LowStockAlerts />
          </div>
        </div>
      </div>
    </div>
  )
}
