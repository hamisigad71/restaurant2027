"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
import type { OrderStatus } from "@/lib/types"
import { cn } from "@/lib/utils"

const statusConfig: Record<OrderStatus, { label: string; color: string; bgColor: string }> = {
  pending: { label: "Pending", color: "text-warning", bgColor: "bg-warning/10 border-warning/20" },
  confirmed: { label: "Confirmed", color: "text-primary", bgColor: "bg-primary/10 border-primary/20" },
  cooking: { label: "Cooking", color: "text-primary", bgColor: "bg-primary/10 border-primary/20" },
  ready: { label: "Ready", color: "text-success", bgColor: "bg-success/10 border-success/20" },
  served: { label: "Served", color: "text-muted-foreground", bgColor: "bg-muted/10 border-border" },
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
  return (
    <Card className="bg-card border-border/50 shadow-sm relative overflow-hidden group">
      <div className="absolute top-0 left-0 w-1 h-full bg-primary opacity-50" />
      <CardHeader>
        <CardTitle className="text-xl font-heading text-foreground">Recent Activity</CardTitle>
        <p className="text-[10px] uppercase text-muted-foreground font-medium">Real-time order log</p>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow className="border-border/50 hover:bg-transparent">
              <TableHead className="text-[10px] uppercase text-muted-foreground">Order ID</TableHead>
              <TableHead className="text-[10px] uppercase text-muted-foreground">Location</TableHead>
              <TableHead className="text-[10px] uppercase text-muted-foreground">Quantity</TableHead>
              <TableHead className="text-[10px] uppercase text-muted-foreground">Status</TableHead>
              <TableHead className="text-[10px] uppercase text-muted-foreground text-right">Revenue</TableHead>
              <TableHead className="text-[10px] uppercase text-muted-foreground text-right">Elapsed</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockOrders.map((order) => {
              const config = statusConfig[order.status]
              return (
                <TableRow key={order.id} className="border-border/50 hover:bg-muted/30 transition-colors">
                  <TableCell className="font-heading text-sm text-foreground">{order.id}</TableCell>
                  <TableCell className="font-medium">Table {order.tableNumber}</TableCell>
                  <TableCell className="text-muted-foreground text-xs">{order.items.length} items</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={cn("text-[9px] uppercase  px-2 h-5 border-current/20", config.color, config.bgColor)}
                    >
                      {config.label}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-heading text-sm text-primary">
                    KSh {order.total.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right text-[10px] font-medium text-muted-foreground uppercase">
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
