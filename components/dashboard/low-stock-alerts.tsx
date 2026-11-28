"use client"

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
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item"
import {
  ExclamationTriangleIcon,
  ExclamationCircleIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline"
import { mockInventory } from "@/lib/mock-data"
import type { StockStatus } from "@/lib/types"
import { cn } from "@/lib/utils"

const lowStockItems = mockInventory.filter(
  (item) => item.status === "low" || item.status === "critical" || item.status === "out",
)

const statusConfig: Record<
  Exclude<StockStatus, "good">,
  { icon: typeof ExclamationTriangleIcon; color: string; bg: string }
> = {
  low: { icon: ExclamationTriangleIcon, color: "text-warning", bg: "bg-warning/5 border-warning/20" },
  critical: { icon: ExclamationCircleIcon, color: "text-destructive", bg: "bg-destructive/5 border-destructive/20" },
  out: { icon: XCircleIcon, color: "text-destructive", bg: "bg-destructive/5 border-destructive/20" },
}

export function LowStockAlerts() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Stock Alerts</CardTitle>
        <CardDescription>Critical inventory thresholds</CardDescription>
        <CardAction>
          <Badge variant="destructive">{lowStockItems.length}</Badge>
        </CardAction>
      </CardHeader>
      <CardContent>
        <ItemGroup className="gap-2.5">
          {lowStockItems.map((item) => {
            const config = statusConfig[item.status as Exclude<StockStatus, "good">]
            const Icon = config.icon
            return (
              <Item
                key={item.id}
                variant="outline"
                size="sm"
                className={cn("rounded-lg", config.bg)}
              >
                <ItemMedia variant="icon" className="bg-card">
                  <Icon className={cn("size-4", config.color)} />
                </ItemMedia>
                <ItemContent>
                  <ItemTitle className="truncate">{item.name}</ItemTitle>
                  <ItemDescription>
                    {item.quantity} {item.unit} left
                  </ItemDescription>
                </ItemContent>
                <ItemActions>
                  <Badge
                    variant="outline"
                    className={cn(
                      "uppercase text-[10px] bg-card",
                      item.status === "out" || item.status === "critical"
                        ? "border-destructive/30 text-destructive"
                        : "border-warning/30 text-warning",
                    )}
                  >
                    {item.status}
                  </Badge>
                </ItemActions>
              </Item>
            )
          })}
        </ItemGroup>
      </CardContent>
    </Card>
  )
}
