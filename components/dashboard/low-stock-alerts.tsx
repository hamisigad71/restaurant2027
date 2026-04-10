"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, AlertCircle, XCircle } from "lucide-react"
import { mockInventory } from "@/lib/mock-data"
import type { StockStatus } from "@/lib/types"
import { cn } from "@/lib/utils"

const lowStockItems = mockInventory.filter(
  item => item.status === "low" || item.status === "critical" || item.status === "out"
)

const statusConfig: Record<Exclude<StockStatus, "good">, { icon: typeof AlertTriangle; color: string; bg: string }> = {
  low: { icon: AlertTriangle, color: "text-warning", bg: "bg-warning/5 border-warning/10" },
  critical: { icon: AlertCircle, color: "text-destructive", bg: "bg-destructive/5 border-destructive/10" },
  out: { icon: XCircle, color: "text-destructive", bg: "bg-destructive/5 border-destructive/10" },
}

export function LowStockAlerts() {
  return (
    <Card className="bg-card border-border/50 shadow-sm relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-1 h-full bg-destructive opacity-30" />
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between mb-1">
          <CardTitle className="text-xl font-heading text-foreground">Stock Alerts</CardTitle>
          <Badge variant="destructive" className="text-[10px] px-2 h-5">
            {lowStockItems.length}
          </Badge>
        </div>
        <p className="text-[10px] uppercase text-muted-foreground font-medium">Critical inventory thresholds</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {lowStockItems.map((item) => {
            const config = statusConfig[item.status as Exclude<StockStatus, "good">]
            const Icon = config.icon
            return (
              <div
                key={item.id}
                className={cn(
                  "flex items-center gap-4 p-4 rounded-xl border transition-colors",
                  config.bg
                )}
              >
                <div className={cn("p-2 rounded-lg bg-card shadow-sm border border-border/50")}>
                  <Icon className={cn("h-4 w-4", config.color)} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-heading text-foreground truncate">{item.name}</p>
                  <p className="text-[10px] uppercase text-muted-foreground font-medium">
                    {item.quantity} {item.unit} Left
                  </p>
                </div>
                <Badge
                  variant="outline"
                  className={cn(
                    "text-[8px] uppercase  px-1.5 h-4 border-current/20 bg-card",
                    item.status === "out" || item.status === "critical" ? "text-destructive" : "text-warning"
                  )}
                >
                  {item.status}
                </Badge>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
