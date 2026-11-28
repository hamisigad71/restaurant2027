"use client"

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import {
  ChartBarIcon,
  ArrowTrendingUpIcon,
  CloudArrowDownIcon,
  CalendarIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid } from "recharts"

const chartData = [
  { time: "8am", sales: 1200 },
  { time: "10am", sales: 2500 },
  { time: "12pm", sales: 8500 },
  { time: "2pm", sales: 4200 },
  { time: "4pm", sales: 2800 },
  { time: "6pm", sales: 9800 },
  { time: "8pm", sales: 12500 },
]

const chartConfig = {
  sales: { label: "Sales (KSh)", color: "var(--chart-1)" },
} satisfies ChartConfig

export default function ManagerReportsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-1 py-4 px-0 space-y-6">
        <Card size="sm">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <CalendarIcon className="size-5" />
              </div>
              <div>
                <CardDescription className="text-xs uppercase">Reporting Period</CardDescription>
                <CardTitle className="text-lg">
                  Today,{" "}
                  {new Date().toLocaleDateString("en-KE", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </CardTitle>
              </div>
            </div>
            <CardAction>
              <Button variant="outline" className="gap-2">
                <CloudArrowDownIcon className="size-4" />
                Download Summary
              </Button>
            </CardAction>
          </CardHeader>
        </Card>

        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Hourly Sales Volume</CardTitle>
              <CardDescription>Intraday revenue progression</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[300px] w-full">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="managerSales" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--chart-2)" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="var(--chart-1)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="time" tickLine={false} axisLine={false} />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `KSh ${value}`}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Area
                    type="monotone"
                    dataKey="sales"
                    stroke="var(--color-sales)"
                    fill="url(#managerSales)"
                    strokeWidth={2.5}
                  />
                </AreaChart>
              </ChartContainer>
            </CardContent>
          </Card>

          <Card className="flex flex-col">
            <CardHeader>
              <CardTitle>Key Metrics</CardTitle>
              <CardDescription>Daily operational highlights</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase text-muted-foreground">Average Order Value</p>
                  <p className="text-2xl font-semibold tabular-nums">KSh 3,840</p>
                </div>
                <Badge variant="outline" className="gap-1 bg-success/10 text-success border-success/20">
                  <ArrowTrendingUpIcon className="size-3" />
                  +4%
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase text-muted-foreground">Table Turnover Rate</p>
                  <p className="text-2xl font-semibold tabular-nums">1.5h</p>
                </div>
                <Badge variant="outline" className="gap-1 bg-success/10 text-success border-success/20">
                  <ArrowTrendingUpIcon className="size-3" />
                  -8m
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase text-muted-foreground">Top Performer</p>
                  <p className="text-2xl font-semibold">Peter O.</p>
                </div>
                <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <ChartBarIcon className="size-5" />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full justify-between group">
                Full Report Details
                <ChevronRightIcon className="size-4 group-hover:translate-x-0.5 transition-transform" />
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}
