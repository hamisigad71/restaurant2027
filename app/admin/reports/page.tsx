"use client"

import { useState } from "react"
import { 
  DocumentTextIcon as FileText, 
  ArrowDownTrayIcon as Download, 
  CalendarIcon as Calendar, 
  ArrowTrendingUpIcon as TrendingUp, 
  UserGroupIcon as Users, 
  ShoppingCartIcon as ShoppingCart, 
  CurrencyDollarIcon as DollarSign,
  ChartBarIcon as BarChart3,
  ChartPieIcon as PieChart,
  ClockIcon as Clock
} from "@heroicons/react/24/outline"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface ReportSummary {
  title: string
  value: string
  change: string
  trend: "up" | "down"
  icon: React.ComponentType<{ className?: string }>
}

const summaryData: ReportSummary[] = [
  { title: "Total Revenue", value: "KSh 847,500", change: "+12.5%", trend: "up", icon: DollarSign },
  { title: "Total Orders", value: "1,284", change: "+8.2%", trend: "up", icon: ShoppingCart },
  { title: "Avg. Order Value", value: "KSh 660", change: "+4.1%", trend: "up", icon: TrendingUp },
  { title: "Active Staff", value: "24", change: "+2", trend: "up", icon: Users },
]

const salesByCategory = [
  { category: "Main Dishes", sales: 345600, percentage: 40.8 },
  { category: "Beverages", sales: 212400, percentage: 25.1 },
  { category: "Appetizers", sales: 127800, percentage: 15.1 },
  { category: "Desserts", sales: 98500, percentage: 11.6 },
  { category: "Specials", sales: 63200, percentage: 7.4 },
]

const topProducts = [
  { rank: 1, name: "Nyama Choma", category: "Main Dishes", quantity: 245, revenue: 122500 },
  { rank: 2, name: "Pilau", category: "Main Dishes", quantity: 198, revenue: 69300 },
  { rank: 3, name: "Tusker Lager", category: "Beverages", quantity: 312, revenue: 62400 },
  { rank: 4, name: "Ugali & Sukuma", category: "Main Dishes", quantity: 187, revenue: 46750 },
  { rank: 5, name: "Mandazi", category: "Appetizers", quantity: 234, revenue: 23400 },
]

const staffPerformance = [
  { name: "Peter Ochieng", role: "Waiter", orders: 156, revenue: 124800, rating: 4.8 },
  { name: "Mary Wanjiku", role: "Waiter", orders: 142, revenue: 113600, rating: 4.7 },
  { name: "John Kamau", role: "Waiter", orders: 128, revenue: 102400, rating: 4.5 },
  { name: "Grace Akinyi", role: "Waiter", orders: 119, revenue: 95200, rating: 4.6 },
  { name: "David Mwangi", role: "Waiter", orders: 98, revenue: 78400, rating: 4.4 },
]

const hourlyData = [
  { hour: "10:00", orders: 12, revenue: 8400 },
  { hour: "11:00", orders: 18, revenue: 12600 },
  { hour: "12:00", orders: 45, revenue: 31500 },
  { hour: "13:00", orders: 62, revenue: 43400 },
  { hour: "14:00", orders: 38, revenue: 26600 },
  { hour: "15:00", orders: 22, revenue: 15400 },
  { hour: "16:00", orders: 15, revenue: 10500 },
  { hour: "17:00", orders: 28, revenue: 19600 },
  { hour: "18:00", orders: 52, revenue: 36400 },
  { hour: "19:00", orders: 78, revenue: 54600 },
  { hour: "20:00", orders: 85, revenue: 59500 },
  { hour: "21:00", orders: 56, revenue: 39200 },
]

export default function ReportsPage() {
  const [dateRange, setDateRange] = useState("this-month")

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-40 bg-secondary border-border">
              <Calendar className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="this-week">This Week</SelectItem>
              <SelectItem value="this-month">This Month</SelectItem>
              <SelectItem value="last-month">Last Month</SelectItem>
              <SelectItem value="this-year">This Year</SelectItem>
            </SelectContent>
          </Select>
          <Button>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryData.map((item) => (
          <Card key={item.title} className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="p-2 rounded-lg bg-primary/10">
                  <item.icon className="h-5 w-5 text-primary" />
                </div>
                <Badge 
                  variant="secondary" 
                  className={item.trend === "up" ? "text-green-400" : "text-red-400"}
                >
                  {item.change}
                </Badge>
              </div>
              <div className="mt-3">
                <p className="text-2xl text-foreground">{item.value}</p>
                <p className="text-sm text-muted-foreground">{item.title}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Reports Tabs */}
      <Tabs defaultValue="sales" className="space-y-4">
        <TabsList className="bg-secondary">
          <TabsTrigger value="sales">
            <BarChart3 className="h-4 w-4 mr-2" />
            Sales
          </TabsTrigger>
          <TabsTrigger value="products">
            <PieChart className="h-4 w-4 mr-2" />
            Products
          </TabsTrigger>
          <TabsTrigger value="staff">
            <Users className="h-4 w-4 mr-2" />
            Staff
          </TabsTrigger>
          <TabsTrigger value="hourly">
            <Clock className="h-4 w-4 mr-2" />
            Peak Hours
          </TabsTrigger>
        </TabsList>

        {/* Sales Report */}
        <TabsContent value="sales" className="space-y-4">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle>Sales by Category</CardTitle>
              <CardDescription>Revenue breakdown by product category</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {salesByCategory.map((item) => (
                  <div key={item.category} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">{item.category}</span>
                      <span className="text-muted-foreground">
                        KSh {item.sales.toLocaleString()} ({item.percentage}%)
                      </span>
                    </div>
                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary rounded-full transition-all"
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Products Report */}
        <TabsContent value="products" className="space-y-4">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle>Top Selling Products</CardTitle>
              <CardDescription>Best performing menu items this period</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="border-border hover:bg-transparent">
                    <TableHead className="text-muted-foreground">Rank</TableHead>
                    <TableHead className="text-muted-foreground">Product</TableHead>
                    <TableHead className="text-muted-foreground">Category</TableHead>
                    <TableHead className="text-muted-foreground text-right">Qty Sold</TableHead>
                    <TableHead className="text-muted-foreground text-right">Revenue</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {topProducts.map((product) => (
                    <TableRow key={product.rank} className="border-border">
                      <TableCell>
                        <Badge variant="secondary" className={product.rank <= 3 ? "bg-primary/20 text-primary" : ""}>
                          #{product.rank}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium">{product.name}</TableCell>
                      <TableCell className="text-muted-foreground">{product.category}</TableCell>
                      <TableCell className="text-right">{product.quantity}</TableCell>
                      <TableCell className="text-right font-medium">
                        KSh {product.revenue.toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Staff Report */}
        <TabsContent value="staff" className="space-y-4">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle>Staff Performance</CardTitle>
              <CardDescription>Individual staff metrics and ratings</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="border-border hover:bg-transparent">
                    <TableHead className="text-muted-foreground">Staff Member</TableHead>
                    <TableHead className="text-muted-foreground">Role</TableHead>
                    <TableHead className="text-muted-foreground text-right">Orders</TableHead>
                    <TableHead className="text-muted-foreground text-right">Revenue</TableHead>
                    <TableHead className="text-muted-foreground text-right">Rating</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {staffPerformance.map((staff) => (
                    <TableRow key={staff.name} className="border-border">
                      <TableCell className="font-medium">{staff.name}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{staff.role}</Badge>
                      </TableCell>
                      <TableCell className="text-right">{staff.orders}</TableCell>
                      <TableCell className="text-right">
                        KSh {staff.revenue.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <span className="flex items-center justify-end gap-1">
                          <span className="text-yellow-400">&#9733;</span>
                          {staff.rating}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Peak Hours Report */}
        <TabsContent value="hourly" className="space-y-4">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle>Peak Hours Analysis</CardTitle>
              <CardDescription>Order volume and revenue by hour</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {hourlyData.map((hour) => {
                  const maxOrders = Math.max(...hourlyData.map(h => h.orders))
                  const percentage = (hour.orders / maxOrders) * 100
                  const isPeak = hour.orders >= maxOrders * 0.8
                  
                  return (
                    <div key={hour.hour} className="flex items-center gap-4">
                      <span className="w-14 text-sm text-muted-foreground">{hour.hour}</span>
                      <div className="flex-1 h-8 bg-secondary rounded-lg overflow-hidden relative">
                        <div 
                          className={`h-full rounded-lg transition-all ${isPeak ? "bg-primary" : "bg-primary/50"}`}
                          style={{ width: `${percentage}%` }}
                        />
                        <div className="absolute inset-0 flex items-center px-3">
                          <span className="text-xs font-medium text-foreground">
                            {hour.orders} orders
                          </span>
                        </div>
                      </div>
                      <span className="w-24 text-sm text-right font-medium">
                        KSh {hour.revenue.toLocaleString()}
                      </span>
                      {isPeak && (
                        <Badge className="bg-primary/20 text-primary">Peak</Badge>
                      )}
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Quick Actions */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle>Generate Reports</CardTitle>
          <CardDescription>Download detailed reports in various formats</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { name: "Daily Sales Report", icon: FileText },
              { name: "Inventory Report", icon: FileText },
              { name: "Staff Performance", icon: FileText },
              { name: "Financial Summary", icon: FileText },
            ].map((report) => (
              <Button key={report.name} variant="outline" className="h-auto py-4 flex-col gap-2">
                <report.icon className="h-5 w-5" />
                <span className="text-sm">{report.name}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
