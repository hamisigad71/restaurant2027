"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  MagnifyingGlassIcon, 
  FunnelIcon, 
  EllipsisHorizontalIcon, 
  EyeIcon, 
  CheckCircleIcon,
  XMarkIcon,
  ClockIcon
} from "@heroicons/react/24/outline"
import { Input } from "@/components/ui/input"
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

const mockOrders = [
  { id: "ORD-001", table: "4", waiter: "Peter", total: 4250, status: "pending", time: "12:30 PM" },
  { id: "ORD-002", table: "2", waiter: "Mary", total: 2100, status: "completed", time: "12:15 PM" },
  { id: "ORD-003", table: "7", waiter: "Peter", total: 8500, status: "pending", time: "12:45 PM" },
  { id: "ORD-004", table: "1", waiter: "John", total: 1200, status: "cancelled", time: "11:50 AM" },
]

export default function ManagerOrdersPage() {
  return (
    <div className="flex flex-col">
      
      <div className="flex-1 py-4 px-0 space-y-6">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative w-full sm:w-96">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search by Order ID or Table..." className="pl-9 bg-card border-border/50" />
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <Button variant="outline" className="flex-1 sm:flex-none gap-2 border-border/50">
              <FunnelIcon className="h-4 w-4" />
              Filter
            </Button>
          <Button className="flex-1 sm:flex-none gap-2 bg-primary text-white hover:bg-primary/95 hover:scale-[1.05] hover:-translate-y-0.5 active:scale-[0.95] transition-all duration-300 shadow-md hover:shadow-lg hover:shadow-primary/20">
            Export CSV
          </Button>
          </div>
        </div>

        <Card className="border-border/50 bg-card overflow-hidden">
          <CardHeader className="pb-3 border-b border-border/50">
            <CardTitle className="text-lg font-heading uppercase">Active & Recent Orders</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-muted/30 text-[10px] uppercase text-muted-foreground">
                  <tr>
                    <th className="px-6 py-4">Order ID</th>
                    <th className="px-6 py-4">Table</th>
                    <th className="px-6 py-4">Waiter</th>
                    <th className="px-6 py-4">Total</th>
                    <th className="px-6 py-4">Time</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {mockOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-muted/20 transition-colors">
                      <td className="px-6 py-4 font-medium">{order.id}</td>
                      <td className="px-6 py-4 flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-[10px] text-primary">
                          {order.table}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-muted-foreground">{order.waiter}</td>
                      <td className="px-6 py-4">KES {order.total.toLocaleString()}</td>
                      <td className="px-6 py-4 text-muted-foreground">{order.time}</td>
                      <td className="px-6 py-4">
                        <Badge 
                          variant="secondary" 
                          className={cn(
                            "text-[10px] uppercase px-2 py-0.5",
                            order.status === "completed" && "bg-success/10 text-success border-success/20",
                            order.status === "pending" && "bg-warning/10 text-warning border-warning/20",
                            order.status === "cancelled" && "bg-destructive/10 text-destructive border-destructive/20"
                          )}
                        >
                          {order.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-primary/10">
                              <EllipsisHorizontalIcon className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-40">
                            <DropdownMenuItem className="gap-2 cursor-pointer">
                               <EyeIcon className="h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem className="gap-2 cursor-pointer text-success">
                               <CheckCircleIcon className="h-4 w-4" />
                              Approve
                            </DropdownMenuItem>
                            <DropdownMenuItem className="gap-2 cursor-pointer text-destructive">
                               <XMarkIcon className="h-4 w-4" />
                              Cancel Order
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
