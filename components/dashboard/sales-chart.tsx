"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { mockDailySales } from "@/lib/mock-data"

const chartData = mockDailySales.map(item => ({
  date: new Date(item.date).toLocaleDateString('en-US', { weekday: 'short' }),
  revenue: item.revenue / 1000, // Convert to thousands
  orders: item.orders,
}))

export function SalesChart() {
  return (
    <Card className="bg-card border-border/50 shadow-sm overflow-hidden group relative">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-transparent opacity-20" />
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-heading text-foreground">Revenue Overview</CardTitle>
            <p className="text-[10px] uppercase  text-muted-foreground font-medium">Daily sales for the last 7 days</p>
          </div>
          <div className="px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px]  uppercase">
            Live Records
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="oklch(var(--primary))" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="oklch(var(--primary))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(var(--border))" vertical={false} opacity={0.5} />
              <XAxis
                dataKey="date"
                tick={{ fill: 'oklch(var(--muted-foreground))', fontSize: 10, fontFamily: 'var(--font-sans)' }}
                axisLine={{ stroke: 'oklch(var(--border))' }}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: 'oklch(var(--muted-foreground))', fontSize: 10, fontFamily: 'var(--font-sans)' }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(value) => `${value}K`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'oklch(var(--card))',
                  border: '1px solid oklch(var(--border))',
                  borderRadius: '12px',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                  fontFamily: 'var(--font-sans)',
                }}
                labelStyle={{ color: 'oklch(var(--foreground))', fontWeight: 'bold' }}
                formatter={(value: number) => [`KES ${value * 1000}`, 'Revenue']}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="oklch(var(--primary))"
                strokeWidth={3}
                fill="url(#colorRevenue)"
                animationDuration={1500}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
