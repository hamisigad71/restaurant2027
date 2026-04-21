"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  ClockIcon as Clock, 
  BoltIcon as ChefHat, 
  CheckCircleIcon as CheckCircle, 
  ExclamationTriangleIcon as AlertTriangle 
} from "@heroicons/react/24/outline"
import type { Order, OrderStatus } from "@/lib/types"
import { cn } from "@/lib/utils"

interface KitchenOrderCardProps {
  order: Order
  onUpdateStatus: (orderId: string, status: OrderStatus) => void
}

const statusConfig: Record<OrderStatus, { next: OrderStatus | null; action: string; color: string }> = {
  pending: { next: "cooking", action: "Start Cooking", color: "border-warning bg-warning/5" },
  confirmed: { next: "cooking", action: "Start Cooking", color: "border-primary bg-primary/5" },
  cooking: { next: "ready", action: "Mark Ready", color: "border-primary bg-primary/5" },
  ready: { next: "served", action: "Mark Served", color: "border-success bg-success/5" },
  served: { next: null, action: "", color: "border-muted" },
  cancelled: { next: null, action: "", color: "border-destructive" },
}

function formatElapsedTime(dateString: string) {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  
  if (diffMins < 1) return "< 1 min"
  if (diffMins < 60) return `${diffMins} min`
  const diffHours = Math.floor(diffMins / 60)
  return `${diffHours}h ${diffMins % 60}m`
}

export function KitchenOrderCard({ order, onUpdateStatus }: KitchenOrderCardProps) {
  const [elapsed, setElapsed] = useState(formatElapsedTime(order.createdAt))
  const config = statusConfig[order.status]
  
  // Calculate if order is urgent (> 15 minutes)
  const elapsedMs = new Date().getTime() - new Date(order.createdAt).getTime()
  const isUrgent = elapsedMs > 15 * 60 * 1000 && order.status !== "ready" && order.status !== "served"

  useEffect(() => {
    const interval = setInterval(() => {
      setElapsed(formatElapsedTime(order.createdAt))
    }, 30000) // Update every 30 seconds

    return () => clearInterval(interval)
  }, [order.createdAt])

  const handleAction = () => {
    if (config.next) {
      onUpdateStatus(order.id, config.next)
    }
  }

  return (
    <Card
      className={cn(
        "relative overflow-hidden border border-border/50 transition-all bg-card shadow-sm hover:shadow-md",
        isUrgent && order.status !== "ready" && "ring-2 ring-destructive ring-offset-2 ring-offset-background"
      )}
    >
      {/* Urgent indicator */}
      {isUrgent && order.status !== "ready" && (
        <div className="bg-destructive text-destructive-foreground py-1 px-3 flex items-center justify-center gap-2 text-[10px]  uppercase">
          <AlertTriangle className="h-3 w-3" />
          Urgent Attention Required
        </div>
      )}

      <CardHeader className="pb-3 pt-4">
        <div className="flex items-center justify-between mb-1">
          <CardTitle className="text-xl font-heading text-foreground">Table {order.tableNumber}</CardTitle>
          <Badge
            variant="outline"
            className={cn(
              "text-[10px]  uppercase h-6 px-2 border-transparent",
              order.status === "pending" && "bg-warning/10 text-warning",
              order.status === "cooking" && "bg-primary/10 text-primary",
              order.status === "ready" && "bg-success/10 text-success"
            )}
          >
            {order.status === "cooking" && <ChefHat className="h-3 w-3 mr-1" />}
            {order.status === "ready" && <CheckCircle className="h-3 w-3 mr-1" />}
            {order.status}
          </Badge>
        </div>
        <div className="flex items-center gap-2 text-[10px] uppercase  text-muted-foreground font-medium">
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span className={cn(isUrgent ? "text-destructive" : "")}>{elapsed}</span>
          </div>
          <span className="text-muted-foreground/30">•</span>
          <span>{order.id}</span>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {/* Order Items */}
        <div className="space-y-2">
          {order.items.map((item, index) => (
            <div key={index} className="flex items-start gap-2 text-sm">
              <span className="text-primary min-w-[24px]">{item.quantity}x</span>
              <div className="flex-1">
                <p className="font-medium">{item.menuItem.name}</p>
                {item.notes && (
                  <p className="text-xs text-muted-foreground italic mt-0.5">Note: {item.notes}</p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Action Button */}
        {config.next && (
          <Button
            className="w-full mt-4  uppercase text-[10px] h-9"
            variant={order.status === "cooking" ? "default" : "outline"}
            onClick={handleAction}
          >
            {config.action}
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
