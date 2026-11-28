"use client"

import { useState, useEffect, useMemo } from "react"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { mockOrders } from "@/lib/mock-data"
import { OrderService, LiveOrder } from "@/lib/order-service"
import { calculateBillTotals } from "@/lib/restaurant-store"
import type { OrderStatus } from "@/lib/types"
import { cn } from "@/lib/utils"

const statusConfig: Record<OrderStatus, { label: string; color: string; bgColor: string }> = {
  pending: { label: "Pending", color: "text-warning", bgColor: "bg-warning/10 border-warning/20" },
  confirmed: { label: "Confirmed", color: "text-primary", bgColor: "bg-primary/10 border-primary/20" },
  cooking: { label: "Cooking", color: "text-primary", bgColor: "bg-primary/10 border-primary/20" },
  ready: { label: "Ready", color: "text-success", bgColor: "bg-success/10 border-success/20" },
  served: { label: "Served", color: "text-muted-foreground", bgColor: "bg-muted border-border" },
  cancelled: { label: "Cancelled", color: "text-destructive", bgColor: "bg-destructive/10 border-destructive/20" },
}

function formatTimeAgo(dateString: string) {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)

  if (diffMins < 1) return "Just now"
  if (diffMins < 60) return `${diffMins}m ago`
  const diffHours = Math.floor(diffMins / 60)
  if (diffHours < 24) return `${diffHours}h ago`
  return `${Math.floor(diffHours / 24)}d ago`
}

export function RecentOrders() {
  const [liveOrders, setLiveOrders] = useState<LiveOrder[]>([])

  useEffect(() => {
    return OrderService.subscribe(setLiveOrders)
  }, [])

  const rows = useMemo(() => {
    const mappedLive = liveOrders.map((o) => {
      const sub = o.items.reduce((s, i) => s + i.price * i.quantity, 0)
      return {
        id: o.id,
        tableNumber: o.tableId,
        itemCount: o.items.length,
        status: o.status as OrderStatus,
        paymentLabel: o.paymentStatus === "paid" ? "Paid" : "Unpaid",
        total: typeof o.total === "number" ? o.total : calculateBillTotals(sub).total,
        createdAt: o.createdAt,
      }
    })
    const baseline = mockOrders.map((o) => ({
      id: o.id,
      tableNumber: String(o.tableNumber),
      itemCount: o.items.length,
      status: o.status,
      paymentLabel: o.status === "served" ? "Paid" : "Unpaid",
      total: o.total,
      createdAt: o.createdAt,
    }))
    return [...mappedLive, ...baseline].slice(0, 10)
  }, [liveOrders])

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Recent Activity</CardTitle>
        <CardDescription>Real-time order log</CardDescription>
        <CardAction>
          <Badge variant="secondary">{rows.length} orders</Badge>
        </CardAction>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Revenue</TableHead>
              <TableHead className="text-right">Elapsed</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((order) => {
              const config = statusConfig[order.status] ?? statusConfig.pending
              return (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.id}</TableCell>
                  <TableCell>Table {order.tableNumber}</TableCell>
                  <TableCell className="text-muted-foreground text-xs">
                    {order.itemCount} items
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5">
                      <Badge
                        variant="outline"
                        className={cn("text-[10px] uppercase", config.color, config.bgColor)}
                      >
                        {config.label}
                      </Badge>
                      <Badge variant="outline" className="text-[10px] uppercase text-muted-foreground">
                        {order.paymentLabel}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-semibold tabular-nums text-primary">
                    KSh {order.total.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right text-xs text-muted-foreground">
                    {formatTimeAgo(order.createdAt)}
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
