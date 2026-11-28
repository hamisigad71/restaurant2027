"use client"

import { useState } from "react"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts"
import {
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  CurrencyDollarIcon,
  ShoppingBagIcon,
  UserGroupIcon,
  ClockIcon,
} from "@heroicons/react/24/outline"
import { mockDailySales } from "@/lib/mock-data"

const weeklyData = mockDailySales.map((item) => ({
  date: new Date(item.date).toLocaleDateString("en-US", { weekday: "short" }),
  revenue: item.revenue,
  orders: item.orders,
}))

const hourlyData = [
  { hour: "8AM", orders: 5 },
  { hour: "9AM", orders: 8 },
  { hour: "10AM", orders: 12 },
  { hour: "11AM", orders: 18 },
  { hour: "12PM", orders: 35 },
  { hour: "1PM", orders: 42 },
  { hour: "2PM", orders: 28 },
  { hour: "3PM", orders: 15 },
  { hour: "4PM", orders: 12 },
  { hour: "5PM", orders: 18 },
  { hour: "6PM", orders: 32 },
  { hour: "7PM", orders: 45 },
  { hour: "8PM", orders: 38 },
  { hour: "9PM", orders: 25 },
]

const categoryData = [
  { name: "food", label: "Food", value: 65, color: "var(--chart-1)" },
  { name: "drinks", label: "Drinks", value: 20, color: "var(--chart-2)" },
  { name: "snacks", label: "Snacks", value: 10, color: "var(--chart-3)" },
  { name: "desserts", label: "Desserts", value: 5, color: "var(--chart-4)" },
]

const topProducts = [
  { name: "Nyama Choma", sold: 145, revenue: 123250, profit: 45000 },
  { name: "Chicken Biryani", sold: 98, revenue: 53900, profit: 18000 },
  { name: "Pilau", sold: 87, revenue: 39150, profit: 12500 },
  { name: "Fish & Chips", sold: 76, revenue: 49400, profit: 15400 },
  { name: "Tusker Lager", sold: 156, revenue: 39000, profit: 11000 },
]

const revenueChartConfig = {
  revenue: { label: "Revenue", color: "var(--chart-1)" },
} satisfies ChartConfig

const hourlyChartConfig = {
  orders: { label: "Orders", color: "var(--chart-2)" },
} satisfies ChartConfig

const categoryChartConfig = {
  food: { label: "Food", color: "var(--chart-1)" },
  drinks: { label: "Drinks", color: "var(--chart-2)" },
  snacks: { label: "Snacks", color: "var(--chart-3)" },
  desserts: { label: "Desserts", color: "var(--chart-4)" },
} satisfies ChartConfig

export default function AnalyticsPage() {
  const [period, setPeriod] = useState("week")

  const kpiCards = [
    {
      label: "Total Revenue",
      value: "KSh 402,000",
      change: "12.5%",
      trend: "up" as const,
      icon: CurrencyDollarIcon,
    },
    {
      label: "Total Orders",
      value: "280",
      change: "8.2%",
      trend: "up" as const,
      icon: ShoppingBagIcon,
    },
    {
      label: "Avg Order Value",
      value: "KSh 1,436",
      change: "3.8%",
      trend: "up" as const,
      icon: ClockIcon,
    },
    {
      label: "Unique Customers",
      value: "185",
      change: "2.1%",
      trend: "down" as const,
      icon: UserGroupIcon,
    },
  ]

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-1 py-4 px-0 space-y-6">
        <div className="flex justify-end">
          <Tabs value={period} onValueChange={setPeriod}>
            <TabsList>
              <TabsTrigger value="day">Today</TabsTrigger>
              <TabsTrigger value="week">This Week</TabsTrigger>
              <TabsTrigger value="month">This Month</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
          {kpiCards.map((kpi) => (
            <Card key={kpi.label} size="sm">
              <CardHeader>
                <CardDescription className="text-xs font-medium">{kpi.label}</CardDescription>
                <CardAction>
                  <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <kpi.icon className="size-4" />
                  </div>
                </CardAction>
              </CardHeader>
              <CardContent className="flex items-end justify-between gap-2">
                <CardTitle className="text-2xl font-semibold tabular-nums">
                  {kpi.value}
                </CardTitle>
                <Badge
                  variant="outline"
                  className={
                    kpi.trend === "up"
                      ? "border-success/30 bg-success/10 text-success text-[10px]"
                      : "border-destructive/30 bg-destructive/10 text-destructive text-[10px]"
                  }
                >
                  {kpi.trend === "up" ? <ArrowTrendingUpIcon /> : <ArrowTrendingDownIcon />}
                  {kpi.change}
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Revenue Trend</CardTitle>
              <CardDescription>Daily performance overview</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={revenueChartConfig} className="h-[300px] w-full">
                <AreaChart data={weeklyData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="analyticsRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--chart-2)" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="var(--chart-1)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="date" tickLine={false} axisLine={false} />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(value) => `${value / 1000}K`}
                  />
                  <ChartTooltip
                    content={
                      <ChartTooltipContent
                        formatter={(value) => (
                          <span className="font-mono font-medium tabular-nums">
                            KES {Number(value).toLocaleString()}
                          </span>
                        )}
                      />
                    }
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="var(--color-revenue)"
                    strokeWidth={2}
                    fill="url(#analyticsRevenue)"
                  />
                </AreaChart>
              </ChartContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Peak Service Hours</CardTitle>
              <CardDescription>Order volume by hour</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={hourlyChartConfig} className="h-[300px] w-full">
                <BarChart data={hourlyData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="hour" tickLine={false} axisLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="orders" fill="var(--color-orders)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Sales by Category</CardTitle>
              <CardDescription>Share of revenue</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={categoryChartConfig} className="h-[250px] w-full">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                    nameKey="name"
                  >
                    {categoryData.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent nameKey="name" />} />
                  <ChartLegend content={<ChartLegendContent nameKey="name" />} />
                </PieChart>
              </ChartContainer>
            </CardContent>
          </Card>

          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-lg">Top Performing Items</CardTitle>
              <CardDescription>Revenue vs profitability</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              {topProducts.map((product, index) => (
                <div key={product.name} className="flex items-center gap-4">
                  <span className="text-sm font-medium text-muted-foreground w-5 tabular-nums">
                    {index + 1}
                  </span>
                  <div className="flex-1 space-y-1.5">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-semibold text-foreground">{product.name}</p>
                      <div className="text-right">
                        <p className="text-xs font-semibold text-primary tabular-nums">
                          KSh {product.revenue.toLocaleString()}
                        </p>
                        <p className="text-[11px] text-success font-medium tabular-nums">
                          Profit: KSh {product.profit.toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <Progress
                      value={(product.revenue / topProducts[0].revenue) * 100}
                      className="h-1.5"
                    />
                    <p className="text-xs text-muted-foreground">
                      {product.sold} units sold •{" "}
                      {Math.round((product.profit / product.revenue) * 100)}% Margin
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
