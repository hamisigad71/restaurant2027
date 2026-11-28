"use client"

import { useState, useEffect, useMemo } from "react"
import { motion } from "motion/react"
import { EASE_OUT } from "@/lib/motion"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline"
import { Badge } from "@/components/ui/badge"
import { mockDashboardStats, mockPayments } from "@/lib/mock-data"
import { OrderService, LiveOrder } from "@/lib/order-service"
import { PaymentService } from "@/lib/restaurant-store"
import type { Payment } from "@/lib/types"

export function StatsCards() {
  const [liveOrders, setLiveOrders] = useState<LiveOrder[]>([])
  const [payments, setPayments] = useState<Payment[]>(mockPayments)

  useEffect(() => {
    const unsubOrders = OrderService.subscribe(setLiveOrders)
    const unsubPayments = PaymentService.subscribe(setPayments)
    return () => {
      unsubOrders()
      unsubPayments()
    }
  }, [])

  const stats = useMemo(() => {
    const extraPaidRevenue = payments
      .filter((p) => p.status === "completed" && !mockPayments.some((m) => m.id === p.id))
      .reduce((s, p) => s + p.amount, 0)
    const livePendingCount = liveOrders.filter(
      (o) => o.paymentStatus !== "paid" && o.status !== "cancelled" && o.status !== "served",
    ).length
    const todayRevenue = mockDashboardStats.todayRevenue + extraPaidRevenue
    const weeklyRevenue = mockDashboardStats.weeklyRevenue + extraPaidRevenue
    const todayOrders = mockDashboardStats.todayOrders + liveOrders.length
    const pendingOrders = mockDashboardStats.pendingOrders + livePendingCount

    return [
      {
        title: "Today's Revenue",
        value: `KES\u00A0${todayRevenue.toLocaleString()}`,
        change: "+12.5%",
        trend: "up" as const,
        icon: "/wallet.png" as string | typeof ExclamationTriangleIcon,
      },
      {
        title: "Weekly Revenue",
        value: `KES\u00A0${weeklyRevenue.toLocaleString()}`,
        change: "+8.2%",
        trend: "up" as const,
        icon: "/wallet.png" as string | typeof ExclamationTriangleIcon,
      },
      {
        title: "Today's Orders",
        value: todayOrders.toString(),
        change: liveOrders.length > 0 ? `+${liveOrders.length} live` : "+5",
        trend: "up" as const,
        icon: "/food-delivery.png" as string | typeof ExclamationTriangleIcon,
      },
      {
        title: "Active Staff",
        value: mockDashboardStats.activeStaff.toString(),
        change: "on duty",
        trend: "neutral" as const,
        icon: "/staff.png" as string | typeof ExclamationTriangleIcon,
      },
      {
        title: "Pending Orders",
        value: pendingOrders.toString(),
        change: "in queue",
        trend: "neutral" as const,
        icon: "/food-delivery.png" as string | typeof ExclamationTriangleIcon,
      },
      {
        title: "Low Stock Items",
        value: mockDashboardStats.lowStockItems.toString(),
        change: "need attention",
        trend: "down" as const,
        icon: ExclamationTriangleIcon,
      },
    ]
  }, [liveOrders, payments])

  const staggerDelays = [0, 0.03, 0.055, 0.075, 0.09, 0.1]

  return (
    <div className="grid gap-4 grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      {stats.map((stat, idx) => {
        const IconComp = typeof stat.icon === "string" ? null : stat.icon
        return (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.2,
              ease: EASE_OUT,
              delay: staggerDelays[idx] ?? 0.1,
            }}
          >
            <Card
              size="sm"
              className="h-full transition-colors duration-150 hover:border-primary/30"
            >
            <CardHeader>
              <CardDescription className="text-xs font-medium">
                {stat.title}
              </CardDescription>
              <CardAction>
                <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  {typeof stat.icon === "string" ? (
                    <div
                      className="size-4 bg-primary"
                      style={{
                        WebkitMaskImage: `url(${stat.icon})`,
                        WebkitMaskSize: "contain",
                        WebkitMaskRepeat: "no-repeat",
                        WebkitMaskPosition: "center",
                        maskImage: `url(${stat.icon})`,
                        maskSize: "contain",
                        maskRepeat: "no-repeat",
                        maskPosition: "center",
                      }}
                    />
                  ) : IconComp ? (
                    <IconComp className="size-4" />
                  ) : null}
                </div>
              </CardAction>
            </CardHeader>
            <CardContent className="flex items-end justify-between gap-2">
              <CardTitle className="text-xl md:text-2xl font-semibold tabular-nums whitespace-nowrap">
                {stat.value}
              </CardTitle>
              {stat.trend === "up" && (
                <Badge
                  variant="outline"
                  className="border-success/30 bg-success/10 text-success text-[10px]"
                >
                  <ArrowTrendingUpIcon />
                  {stat.change}
                </Badge>
              )}
              {stat.trend === "down" && (
                <Badge
                  variant="outline"
                  className="border-destructive/30 bg-destructive/10 text-destructive text-[10px]"
                >
                  <ArrowTrendingDownIcon />
                  {stat.change}
                </Badge>
              )}
              {stat.trend === "neutral" && (
                <Badge variant="secondary" className="text-[10px]">
                  {stat.change}
                </Badge>
              )}
            </CardContent>
          </Card>
          </motion.div>
        )
      })}
    </div>
  )
}
