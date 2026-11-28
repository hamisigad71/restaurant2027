"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Item, ItemActions, ItemContent, ItemGroup, ItemTitle } from "@/components/ui/item"
import { mockMenuItems } from "@/lib/mock-data"

const topProducts = [
  { item: mockMenuItems[0], quantity: 45, revenue: 38250 },
  { item: mockMenuItems[4], quantity: 38, revenue: 20900 },
  { item: mockMenuItems[1], quantity: 32, revenue: 14400 },
  { item: mockMenuItems[2], quantity: 28, revenue: 18200 },
  { item: mockMenuItems[8], quantity: 52, revenue: 13000 },
]

const maxQuantity = Math.max(...topProducts.map((p) => p.quantity))

export function TopProducts() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Top Performing Selection</CardTitle>
        <CardDescription>Best sellers this period</CardDescription>
      </CardHeader>
      <CardContent>
        <ItemGroup className="gap-4">
          {topProducts.map((product, index) => (
            <Item key={product.item.id} size="sm" className="p-0 gap-3 flex-nowrap">
              <span className="text-xs font-medium text-muted-foreground w-4 tabular-nums">
                {index + 1}
              </span>
              <ItemContent className="min-w-0 gap-1.5">
                <div className="flex items-center justify-between gap-2">
                  <ItemTitle className="truncate">{product.item.name}</ItemTitle>
                  <span className="text-xs text-muted-foreground shrink-0">
                    {product.quantity} units
                  </span>
                </div>
                <Progress value={(product.quantity / maxQuantity) * 100} className="h-1.5" />
              </ItemContent>
              <ItemActions className="shrink-0">
                <span className="text-sm font-semibold tabular-nums text-primary whitespace-nowrap">
                  KSh {product.revenue.toLocaleString()}
                </span>
              </ItemActions>
            </Item>
          ))}
        </ItemGroup>
      </CardContent>
    </Card>
  )
}
