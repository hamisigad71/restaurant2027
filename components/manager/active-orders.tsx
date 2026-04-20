"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ShoppingCartIcon, ClockIcon, UserIcon } from "@heroicons/react/24/outline"
import { Progress } from "@/components/ui/progress"
import { OrderService, LiveOrder } from "@/lib/order-service"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"

export function ActiveOrders() {
  const [orders, setOrders] = useState<LiveOrder[]>([])

  useEffect(() => {
    const unsubscribe = OrderService.subscribe((allOrders) => {
      setOrders(allOrders)
    })
    return unsubscribe
  }, [])

  const activeOrders = orders.filter(o => o.status !== "served" && o.status !== "cancelled")

  return (
    <Card className="bg-card border-border/50 shadow-sm relative overflow-hidden">
      <div className="absolute top-0 left-0 w-1 h-full bg-primary opacity-50" />
      <CardHeader>
        <div className="flex items-center justify-between mb-1">
          <CardTitle className="text-xl font-heading text-foreground">Active Orders</CardTitle>
          <Badge variant="outline" className="text-[10px] uppercase text-primary border-primary/20 bg-primary/5">
            {activeOrders.length} Pending
          </Badge>
        </div>
        <p className="text-[10px] uppercase text-muted-foreground font-medium">Real-time floor operations</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activeOrders.map((order) => (
            <div key={order.id} className="flex items-center gap-4 p-4 rounded-xl border border-border/50 bg-muted/20 hover:bg-muted/30 transition-colors">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-heading text-foreground">Table {order.tableId}</span>
                  <Badge variant="outline" className="text-[8px] uppercase  px-1.5 h-4 border-primary/20 text-primary">
                    {order.id}
                  </Badge>
                </div>
                <div className="flex items-center gap-3 text-[10px] font-medium text-muted-foreground">
                  <span className="flex items-center gap-1"><ShoppingCartIcon className="h-3 w-3" /> {order.items.length} items</span>
                  <span className="flex items-center gap-1"><ClockIcon className="h-3 w-3" /> 12m elapsed</span>
                </div>
              </div>
              <div className="text-right">
                <Badge className={cn(
                  "text-[9px] uppercase  px-2 h-5",
                  order.status === "ready" ? "bg-success text-success-foreground" : "bg-primary text-primary-foreground"
                )}>
                  {order.status}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
