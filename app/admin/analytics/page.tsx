"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from "recharts"
import { TrendingUp, TrendingDown, DollarSign, ShoppingBag, Users, Clock } from "lucide-react"
import { mockDailySales, mockMenuItems } from "@/lib/mock-data"

// Extended mock data for analytics
const weeklyData = mockDailySales.map(item => ({
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
  { name: "Food", value: 65, color: "hsl(var(--chart-1))" },
  { name: "Drinks", value: 20, color: "hsl(var(--chart-2))" },
  { name: "Snacks", value: 10, color: "hsl(var(--chart-4))" },
  { name: "Desserts", value: 5, color: "hsl(var(--chart-5))" },
]

const topProducts = [
  { name: "Nyama Choma", sold: 145, revenue: 123250, profit: 45000 },
  { name: "Chicken Biryani", sold: 98, revenue: 53900, profit: 18000 },
  { name: "Pilau", sold: 87, revenue: 39150, profit: 12500 },
  { name: "Fish & Chips", sold: 76, revenue: 49400, profit: 15400 },
  { name: "Tusker Lager", sold: 156, revenue: 39000, profit: 11000 },
]

export default function AnalyticsPage() {
  const [period, setPeriod] = useState("week")

  const stats = {
    revenue: { value: 402000, change: 12.5, trend: "up" },
    orders: { value: 280, change: 8.2, trend: "up" },
    avgOrder: { value: 1436, change: 3.8, trend: "up" },
    customers: { value: 185, change: -2.1, trend: "down" },
  }

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-1 py-4 px-0 space-y-6">
        {/* Period Selector */}
        <div className="flex justify-end">
          <Tabs value={period} onValueChange={setPeriod}>
            <TabsList className="bg-secondary/50 p-1">
              <TabsTrigger value="day" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                Today
              </TabsTrigger>
              <TabsTrigger value="week" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                This Week
              </TabsTrigger>
              <TabsTrigger value="month" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                This Month
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
          <Card className="bg-card border-border/50 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-1 h-full bg-primary opacity-50" />
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                  <DollarSign className="h-5 w-5 text-primary" />
                </div>
                <div className={`flex items-center text-[10px] font-medium px-2 py-0.5 rounded-full ${stats.revenue.trend === "up" ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"}`}>
                  {stats.revenue.trend === "up" ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                  {stats.revenue.change}%
                </div>
              </div>
              <p className="text-2xl font-heading text-foreground">KSh {stats.revenue.value.toLocaleString()}</p>
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-medium">Total Revenue</p>
            </CardContent>
          </Card>
          <Card className="bg-card border-border/50 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-1 h-full bg-chart-2 opacity-50" />
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 rounded-lg bg-chart-2/10 group-hover:bg-chart-2/20 transition-colors">
                  <ShoppingBag className="h-5 w-5 text-chart-2" />
                </div>
                <div className={`flex items-center text-[10px] font-medium px-2 py-0.5 rounded-full ${stats.orders.trend === "up" ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"}`}>
                  {stats.orders.trend === "up" ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                  {stats.orders.change}%
                </div>
              </div>
              <p className="text-2xl font-heading text-foreground">{stats.orders.value}</p>
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-medium">Total Orders</p>
            </CardContent>
          </Card>
          <Card className="bg-card border-border/50 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-1 h-full bg-chart-4 opacity-50" />
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 rounded-lg bg-chart-4/10 group-hover:bg-chart-4/20 transition-colors">
                  <Clock className="h-5 w-5 text-chart-4" />
                </div>
                <div className={`flex items-center text-[10px] font-medium px-2 py-0.5 rounded-full ${stats.avgOrder.trend === "up" ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"}`}>
                  {stats.avgOrder.trend === "up" ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                  {stats.avgOrder.change}%
                </div>
              </div>
              <p className="text-2xl font-heading text-foreground">KSh {stats.avgOrder.value.toLocaleString()}</p>
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-medium">Avg Order Value</p>
            </CardContent>
          </Card>
          <Card className="bg-card border-border/50 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-1 h-full bg-chart-5 opacity-50" />
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 rounded-lg bg-chart-5/10 group-hover:bg-chart-5/20 transition-colors">
                  <Users className="h-5 w-5 text-chart-5" />
                </div>
                <div className={`flex items-center text-[10px] font-medium px-2 py-0.5 rounded-full ${stats.customers.trend === "up" ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"}`}>
                  {stats.customers.trend === "up" ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                  {Math.abs(stats.customers.change)}%
                </div>
              </div>
              <p className="text-2xl font-heading text-foreground">{stats.customers.value}</p>
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-medium">Unique Customers</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row 1 */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Revenue Chart */}
          <Card className="bg-card border-border/50 shadow-sm overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-primary/20" />
            <CardHeader className="pb-6">
              <CardTitle className="text-lg font-heading text-foreground">Revenue Trend</CardTitle>
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-medium">Daily performance overview</p>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={weeklyData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                    <XAxis dataKey="date" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} axisLine={{ stroke: "hsl(var(--border))" }} tickLine={false} />
                    <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={(value) => `${value / 1000}K`} />
                    <Tooltip
                      contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px" }}
                      labelStyle={{ color: "hsl(var(--foreground))" }}
                      formatter={(value: number) => [`KES ${value.toLocaleString()}`, "Revenue"]}
                    />
                    <Area type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" strokeWidth={2} fill="url(#colorRevenue)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Peak Hours */}
          <Card className="bg-card border-border/50 shadow-sm overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-chart-1/20" />
            <CardHeader className="pb-6">
              <CardTitle className="text-lg font-heading text-foreground">Peak Service Hours</CardTitle>
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-medium">Order volume by hour</p>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={hourlyData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                    <XAxis dataKey="hour" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }} axisLine={{ stroke: "hsl(var(--border))" }} tickLine={false} />
                    <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} axisLine={false} tickLine={false} />
                    <Tooltip
                      contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px" }}
                      labelStyle={{ color: "hsl(var(--foreground))" }}
                    />
                    <Bar dataKey="orders" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row 2 */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Category Distribution */}
          <Card className="bg-card border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium">Sales by Category</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px" }}
                      formatter={(value: number) => [`${value}%`, "Share"]}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Top Products */}
          <Card className="bg-card border-border lg:col-span-2">
            <CardHeader className="pb-6">
              <CardTitle className="text-lg font-heading text-foreground">Top Performing Items</CardTitle>
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-medium">Revenue vs Profitability</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {topProducts.map((product, index) => (
                  <div key={product.name} className="flex items-center gap-4">
                    <span className="text-sm font-medium text-muted-foreground w-5">{index + 1}</span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-heading text-foreground">{product.name}</p>
                        <div className="text-right">
                          <p className="text-xs text-primary">KSh {product.revenue.toLocaleString()}</p>
                          <p className="text-[10px] text-success font-medium">Profit: KSh {product.profit.toLocaleString()}</p>
                        </div>
                      </div>
                      <div className="h-1.5 bg-secondary/50 rounded-full overflow-hidden flex">
                        <div
                          className="h-full bg-primary"
                          style={{ width: `${(product.revenue / topProducts[0].revenue) * 100}%` }}
                        />
                        <div
                          className="h-full bg-success/40"
                          style={{ width: `${(product.profit / product.revenue) * 100}%` }}
                        />
                      </div>
                      <p className="text-[9px] uppercase tracking-tighter text-muted-foreground mt-1.5 font-medium">
                        {product.sold} units sold • {Math.round((product.profit / product.revenue) * 100)}% Margin
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
