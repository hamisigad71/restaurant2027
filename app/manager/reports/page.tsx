"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  FileText, 
  BarChart3, 
  TrendingUp, 
  Download,
  Calendar,
  ChevronRight
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from "recharts"

const chartData = [
  { time: "8am", sales: 1200 },
  { time: "10am", sales: 2500 },
  { time: "12pm", sales: 8500 },
  { time: "2pm", sales: 4200 },
  { time: "4pm", sales: 2800 },
  { time: "6pm", sales: 9800 },
  { time: "8pm", sales: 12500 },
]

export default function ManagerReportsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-1 py-4 px-0 space-y-6">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-card p-4 rounded-xl border border-border/50">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              <Calendar className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] uppercase text-muted-foreground">Reporting Period</p>
              <h3 className="font-heading text-lg">Today, {new Date().toLocaleDateString('en-KE', { day: 'numeric', month: 'long', year: 'numeric' })}</h3>
            </div>
          </div>
          <Button variant="outline" className="w-full sm:w-auto gap-2 border-border/50 hover:bg-muted">
            <Download className="h-4 w-4" />
            Download Summary
          </Button>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2 bg-card border-border/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-heading tracking-wide uppercase">Hourly Sales Volume</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px] w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="oklch(0.72 0.12 75)" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="oklch(0.72 0.12 75)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="oklch(0.25 0.02 285 / 0.1)" />
                  <XAxis 
                    dataKey="time" 
                    stroke="oklch(0.65 0.02 285)" 
                    fontSize={10} 
                    tickLine={false} 
                    axisLine={false} 
                    tick={{ dy: 10 }}
                  />
                  <YAxis 
                    stroke="oklch(0.65 0.02 285)" 
                    fontSize={10} 
                    tickLine={false} 
                    axisLine={false} 
                    tickFormatter={(value) => `KSh ${value}`}
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'oklch(0.15 0.01 285)', border: 'none', borderRadius: '8px', color: 'white' }}
                    itemStyle={{ color: 'oklch(0.72 0.12 75)', fontSize: '12px' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="sales" 
                    stroke="oklch(0.72 0.12 75)" 
                    fillOpacity={1} 
                    fill="url(#colorSales)" 
                    strokeWidth={3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="bg-card border-border/50 flex flex-col">
            <CardHeader>
              <CardTitle className="text-lg font-heading tracking-wide uppercase">Key Metrics</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 space-y-6 pt-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] uppercase text-muted-foreground mb-1">Average Order Value</p>
                  <p className="text-2xl font-heading">KSh 3,840</p>
                </div>
                <div className="text-success flex items-center gap-1 text-xs bg-success/10 px-2 py-1 rounded-full">
                  <TrendingUp className="h-3 w-3" />
                  +4%
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] uppercase text-muted-foreground mb-1">Table Turnover Rate</p>
                  <p className="text-2xl font-heading">1.5h</p>
                </div>
                <div className="text-success flex items-center gap-1 text-xs bg-success/10 px-2 py-1 rounded-full">
                  <TrendingUp className="h-3 w-3" />
                  -8m
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] uppercase text-muted-foreground mb-1">Top Performer</p>
                  <p className="text-2xl font-heading">Peter O.</p>
                </div>
                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                  <BarChart3 className="h-5 w-5" />
                </div>
              </div>
              
              <Button variant="outline" className="w-full justify-between group border-border/50 hover:bg-muted uppercase text-[10px] h-10 px-4">
                Full Report Details
                <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
