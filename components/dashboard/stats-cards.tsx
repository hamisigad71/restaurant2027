"use client"

import { Card, CardContent } from "@/components/ui/card"
import { TrendingUp, TrendingDown, DollarSign, ShoppingBag, Users, AlertTriangle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { mockDashboardStats } from "@/lib/mock-data"

const stats = [
  {
    title: "Today's Revenue",
    value: `KES ${mockDashboardStats.todayRevenue.toLocaleString()}`,
    change: "+12.5%",
    trend: "up" as const,
    icon: DollarSign,
  },
  {
    title: "Weekly Revenue",
    value: `KES ${mockDashboardStats.weeklyRevenue.toLocaleString()}`,
    change: "+8.2%",
    trend: "up" as const,
    icon: DollarSign,
  },
  {
    title: "Today's Orders",
    value: mockDashboardStats.todayOrders.toString(),
    change: "+5",
    trend: "up" as const,
    icon: ShoppingBag,
  },
  {
    title: "Active Staff",
    value: mockDashboardStats.activeStaff.toString(),
    change: "on duty",
    trend: "neutral" as const,
    icon: Users,
  },
  {
    title: "Pending Orders",
    value: mockDashboardStats.pendingOrders.toString(),
    change: "in queue",
    trend: "neutral" as const,
    icon: ShoppingBag,
  },
  {
    title: "Low Stock Items",
    value: mockDashboardStats.lowStockItems.toString(),
    change: "need attention",
    trend: "down" as const,
    icon: AlertTriangle,
  },
]

export function StatsCards() {
  return (
    <div className="grid gap-4 grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      {stats.map((stat) => (
        <Card key={stat.title} className="group relative overflow-hidden bg-card border-border/50 shadow-sm transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1">
          {/* Animated Background Gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          <CardContent className="p-5 relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2.5 rounded-xl bg-primary/10 text-primary group-hover:scale-110 transition-transform duration-300">
                <stat.icon className="h-4 w-4" />
              </div>
              
              {stat.trend === "up" && (
                <Badge variant="outline" className="border-success/20 bg-success/5 text-success text-[9px] px-2 py-0">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  {stat.change}
                </Badge>
              )}
              {stat.trend === "down" && (
                <Badge variant="outline" className="border-destructive/20 bg-destructive/5 text-destructive text-[9px] px-2 py-0">
                  <TrendingDown className="h-3 w-3 mr-1" />
                  {stat.change}
                </Badge>
              )}
              {stat.trend === "neutral" && (
                <span className="text-[9px] font-heading uppercase text-muted-foreground/60">{stat.change}</span>
              )}
            </div>

            <div className="space-y-1">
              <p className="text-3xl font-heading   text-foreground leading-none">
                {stat.value}
              </p>
              <p className="text-[10px] font-heading uppercase  text-muted-foreground/80">
                {stat.title}
              </p>
            </div>
            
            {/* Visual bottom accent */}
            <div className="absolute bottom-0 left-0 w-full h-[2px] bg-primary/20 scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
