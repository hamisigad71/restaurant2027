"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { mockMenuItems } from "@/lib/mock-data"

const topProducts = [
  { item: mockMenuItems[0], quantity: 45, revenue: 38250 },
  { item: mockMenuItems[4], quantity: 38, revenue: 20900 },
  { item: mockMenuItems[1], quantity: 32, revenue: 14400 },
  { item: mockMenuItems[2], quantity: 28, revenue: 18200 },
  { item: mockMenuItems[8], quantity: 52, revenue: 13000 },
]

const maxQuantity = Math.max(...topProducts.map(p => p.quantity))

export function TopProducts() {
  return (
    <Card className="bg-card border-border/50 shadow-sm relative overflow-hidden group">
      <div className="absolute top-0 left-0 w-1 h-full bg-primary opacity-50" />
      <CardHeader className="pb-6">
        <CardTitle className="text-xl font-heading text-foreground">Top Performing Selection</CardTitle>
        <p className="text-[10px] uppercase text-muted-foreground font-medium">Best sellers this period</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {topProducts.map((product, index) => (
            <div key={product.item.id} className="flex items-center gap-4 group/item">
              <span className="text-xs font-heading text-muted-foreground/50 w-4 group-hover/item:text-primary transition-colors">
                {index + 1}
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-heading text-foreground truncate">{product.item.name}</p>
                  <span className="text-[10px] uppercase text-muted-foreground font-medium">{product.quantity} units sold</span>
                </div>
                <Progress
                  value={(product.quantity / maxQuantity) * 100}
                  className="h-1.5 bg-primary/10"
                />
              </div>
              <div className="text-right ml-4">
                <span className="text-sm font-heading text-primary whitespace-nowrap">
                  KSh {product.revenue.toLocaleString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
