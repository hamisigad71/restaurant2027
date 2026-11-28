"use client"

import { useState, useEffect } from "react"
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
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemTitle,
} from "@/components/ui/item"
import { ShoppingCartIcon, ClockIcon } from "@heroicons/react/24/outline"
import { OrderService, LiveOrder } from "@/lib/order-service"
import { cn } from "@/lib/utils"

function formatElapsed(createdAt: string): string {
  const mins = Math.max(0, Math.floor((Date.now() - new Date(createdAt).getTime()) / 60000))
  if (mins < 1) return "Just now"
  if (mins < 60) return `${mins}m elapsed`
  return `${Math.floor(mins / 60)}h ${mins % 60}m elapsed`
}

export function ActiveOrders() {
  const [orders, setOrders] = useState<LiveOrder[]>([])

  useEffect(() => {
    const unsubscribe = OrderService.subscribe((allOrders) => {
      setOrders(allOrders)
    })
    return unsubscribe
  }, [])

  const activeOrders = orders.filter((o) => o.paymentStatus !== "paid" && o.status !== "cancelled")

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Active Orders</CardTitle>
        <CardDescription>Real-time floor operations</CardDescription>
        <CardAction>
          <Badge variant="outline" className="text-primary border-primary/20 bg-primary/5">
            {activeOrders.length} Pending
          </Badge>
        </CardAction>
      </CardHeader>
      <CardContent>
        {activeOrders.length === 0 ? (
          <Empty className="py-8 border">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <ShoppingCartIcon />
              </EmptyMedia>
              <EmptyTitle className="text-base">No active orders</EmptyTitle>
              <EmptyDescription>New floor orders will appear here in real time.</EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <ItemGroup className="gap-2.5">
            {activeOrders.map((order) => (
              <Item key={order.id} variant="outline" size="sm" className="bg-muted/30">
                <ItemContent>
                  <ItemTitle>
                    <span>Table {order.tableId}</span>
                    <Badge variant="outline" className="text-[10px]">
                      {order.id}
                    </Badge>
                  </ItemTitle>
                  <ItemDescription className="flex items-center gap-3 text-xs">
                    <span className="inline-flex items-center gap-1">
                      <ShoppingCartIcon className="size-3" /> {order.items.length} items
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <ClockIcon className="size-3" /> {formatElapsed(order.createdAt)}
                    </span>
                  </ItemDescription>
                </ItemContent>
                <ItemActions>
                  <Badge
                    className={cn(
                      "uppercase text-[10px]",
                      order.status === "ready"
                        ? "bg-success text-success-foreground"
                        : "bg-primary text-primary-foreground",
                    )}
                  >
                    {order.status}
                  </Badge>
                </ItemActions>
              </Item>
            ))}
          </ItemGroup>
        )}
      </CardContent>
    </Card>
  )
}
