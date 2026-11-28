"use client"

import { useState, useEffect } from "react"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Alert, AlertTitle } from "@/components/ui/alert"
import {
  ClockIcon as Clock,
  BoltIcon as ChefHat,
  CheckCircleIcon as CheckCircle,
  ExclamationTriangleIcon as AlertTriangle,
} from "@heroicons/react/24/outline"
import type { Order, OrderStatus } from "@/lib/types"
import { cn } from "@/lib/utils"

interface KitchenOrderCardProps {
  order: Order
  onUpdateStatus: (orderId: string, status: OrderStatus) => void
}

const statusConfig: Record<OrderStatus, { next: OrderStatus | null; action: string }> = {
  pending: { next: "cooking", action: "Start Cooking" },
  confirmed: { next: "cooking", action: "Start Cooking" },
  cooking: { next: "ready", action: "Mark Ready" },
  ready: { next: "served", action: "Mark Served" },
  served: { next: null, action: "" },
  cancelled: { next: null, action: "" },
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

  const elapsedMs = new Date().getTime() - new Date(order.createdAt).getTime()
  const isUrgent =
    elapsedMs > 15 * 60 * 1000 && order.status !== "ready" && order.status !== "served"

  useEffect(() => {
    const interval = setInterval(() => {
      setElapsed(formatElapsedTime(order.createdAt))
    }, 30000)

    return () => clearInterval(interval)
  }, [order.createdAt])

  const handleAction = () => {
    if (config.next) {
      onUpdateStatus(order.id, config.next)
    }
  }

  return (
    <Card
      size="sm"
      className={cn(
        "overflow-hidden transition-shadow hover:shadow-md",
        isUrgent && order.status !== "ready" && "ring-2 ring-destructive ring-offset-2",
      )}
    >
      {isUrgent && order.status !== "ready" && (
        <div className="px-4">
          <Alert variant="destructive" className="py-2">
            <AlertTriangle />
            <AlertTitle className="text-xs">Urgent attention required</AlertTitle>
          </Alert>
        </div>
      )}

      <CardHeader>
        <CardTitle className="text-lg">Table {order.tableNumber}</CardTitle>
        <CardDescription className="flex items-center gap-2 text-xs">
          <span className="inline-flex items-center gap-1">
            <Clock className="size-3.5" />
            <span className={cn(isUrgent && "text-destructive font-medium")}>{elapsed}</span>
          </span>
          <span>•</span>
          <span>{order.id}</span>
        </CardDescription>
        <CardAction>
          <Badge
            variant="outline"
            className={cn(
              "uppercase text-[10px]",
              order.status === "pending" && "border-warning/30 bg-warning/10 text-warning",
              order.status === "cooking" && "border-primary/30 bg-primary/10 text-primary",
              order.status === "ready" && "border-success/30 bg-success/10 text-success",
            )}
          >
            {order.status === "cooking" && <ChefHat />}
            {order.status === "ready" && <CheckCircle />}
            {order.status}
          </Badge>
        </CardAction>
      </CardHeader>

      <CardContent className="space-y-2">
        {order.items.map((item, index) => (
          <div key={index} className="flex items-start gap-2 text-sm">
            <span className="font-semibold text-primary min-w-[24px] tabular-nums">
              {item.quantity}x
            </span>
            <div className="flex-1">
              <p className="font-medium">{item.menuItem.name}</p>
              {item.notes && (
                <p className="text-xs text-muted-foreground italic mt-0.5">Note: {item.notes}</p>
              )}
            </div>
          </div>
        ))}
      </CardContent>

      {config.next && (
        <CardFooter>
          <Button
            className="w-full"
            size="sm"
            variant={order.status === "cooking" ? "default" : "outline"}
            onClick={handleAction}
          >
            {config.action}
          </Button>
        </CardFooter>
      )}
    </Card>
  )
}
