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
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid } from "recharts"
import { mockDailySales } from "@/lib/mock-data"

const chartData = mockDailySales.map((item) => ({
  date: new Date(item.date).toLocaleDateString("en-US", { weekday: "short" }),
  revenue: item.revenue / 1000,
  orders: item.orders,
}))

const chartConfig = {
  revenue: {
    label: "Revenue (KES K)",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig

export function SalesChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Revenue Overview</CardTitle>
        <CardDescription>Daily sales for the last 7 days</CardDescription>
        <CardAction>
          <Badge variant="secondary">Live Records</Badge>
        </CardAction>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[280px] w-full">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--chart-2)" stopOpacity={0.35} />
                <stop offset="95%" stopColor="var(--chart-1)" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tickFormatter={(value) => `${value}K`}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  formatter={(value) => (
                    <span className="font-mono font-medium tabular-nums">
                      KES {(Number(value) * 1000).toLocaleString()}
                    </span>
                  )}
                />
              }
            />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="var(--color-revenue)"
              strokeWidth={2.5}
              fill="url(#colorRevenue)"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
