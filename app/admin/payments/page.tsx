"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  MagnifyingGlassIcon as Search, 
  CreditCardIcon as CreditCard, 
  DevicePhoneMobileIcon as Smartphone, 
  BanknotesIcon as Banknote, 
  CurrencyDollarIcon as DollarSign, 
  CheckCircleIcon as CheckCircle, 
  ClockIcon as Clock, 
  DocumentTextIcon as Receipt 
} from "@heroicons/react/24/outline"
import { mockOrders, mockPayments } from "@/lib/mock-data"
import type { Payment, PaymentMethod, PaymentStatus, OrderItem } from "@/lib/types"

const methodConfig: Record<PaymentMethod, { label: string; icon: typeof CreditCard; color: string }> = {
  cash: { label: "Cash", icon: Banknote, color: "bg-success/10 text-success" },
  mpesa: { label: "M-Pesa", icon: Smartphone, color: "bg-chart-4/10 text-chart-4" },
  card: { label: "Card", icon: CreditCard, color: "bg-primary/10 text-primary" },
}

const statusConfig: Record<PaymentStatus, { label: string; color: string }> = {
  pending: { label: "Pending", color: "bg-warning/10 text-warning border-warning/30" },
  completed: { label: "Completed", color: "bg-success/10 text-success border-success/30" },
  failed: { label: "Failed", color: "bg-destructive/10 text-destructive border-destructive/30" },
  refunded: { label: "Refunded", color: "bg-muted text-muted-foreground border-border" },
}

export default function PaymentsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeFilter, setActiveFilter] = useState("all")
  const [selectedOrder, setSelectedOrder] = useState<typeof mockOrders[0] | null>(null)
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cash")

  // Orders ready for payment
  const pendingPaymentOrders = mockOrders.filter(o => o.status === "served" || o.status === "ready")

  const allPayments: Payment[] = [
    ...mockPayments,
    // Add more mock payments
    { id: "PAY-003", orderId: "ORD-005", amount: 3500, method: "card", status: "completed", createdAt: new Date(Date.now() - 2 * 60 * 60000).toISOString() },
    { id: "PAY-004", orderId: "ORD-006", amount: 1800, method: "mpesa", status: "completed", createdAt: new Date(Date.now() - 3 * 60 * 60000).toISOString() },
    { id: "PAY-005", orderId: "ORD-007", amount: 2200, method: "cash", status: "completed", createdAt: new Date(Date.now() - 4 * 60 * 60000).toISOString() },
  ]

  const filteredPayments = allPayments.filter(payment => {
    const matchesSearch = payment.orderId.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = activeFilter === "all" || payment.status === activeFilter
    return matchesSearch && matchesFilter
  })

  const stats = {
    todayTotal: allPayments.filter(p => p.status === "completed").reduce((sum, p) => sum + p.amount, 0),
    pending: allPayments.filter(p => p.status === "pending").length,
    completed: allPayments.filter(p => p.status === "completed").length,
  }

  const handleProcessPayment = () => {
    alert(`Processing ${paymentMethod} payment for ${selectedOrder?.id}`)
    setSelectedOrder(null)
  }

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-1 py-4 px-0 space-y-6">
        {/* Stats Cards */}
        <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <DollarSign className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl">KES {stats.todayTotal.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">Today&apos;s Revenue</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-warning/10">
                  <Clock className="h-5 w-5 text-warning" />
                </div>
                <div>
                  <p className="text-2xl">{stats.pending}</p>
                  <p className="text-sm text-muted-foreground">Pending</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-success/10">
                  <CheckCircle className="h-5 w-5 text-success" />
                </div>
                <div>
                  <p className="text-2xl">{stats.completed}</p>
                  <p className="text-sm text-muted-foreground">Completed</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-chart-4/10">
                  <Receipt className="h-5 w-5 text-chart-4" />
                </div>
                <div>
                  <p className="text-2xl">{pendingPaymentOrders.length}</p>
                  <p className="text-sm text-muted-foreground">Awaiting Payment</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Pending Orders for Payment */}
          <Card className="bg-card border-border">
            <CardHeader className="pb-4">
              <CardTitle className="text-base font-medium">Orders Awaiting Payment</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {pendingPaymentOrders.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">No pending orders</p>
              ) : (
                pendingPaymentOrders.map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 cursor-pointer transition-colors"
                    onClick={() => setSelectedOrder(order)}
                  >
                    <div>
                      <p className="font-medium">{order.id}</p>
                      <p className="text-sm text-muted-foreground">Table {order.tableNumber}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-primary">KES {order.total.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">{order.items.length} items</p>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Payment History */}
          <Card className="bg-card border-border lg:col-span-2">
            <CardHeader className="pb-4">
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <CardTitle className="text-base font-medium">Payment History</CardTitle>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <div className="relative flex-1 sm:flex-initial">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9 w-full sm:w-48 bg-secondary border-0"
                    />
                  </div>
                </div>
              </div>
              <Tabs value={activeFilter} onValueChange={setActiveFilter} className="mt-4">
                <TabsList className="bg-secondary/50 p-1">
                  <TabsTrigger value="all" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                    All
                  </TabsTrigger>
                  <TabsTrigger value="completed" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                    Completed
                  </TabsTrigger>
                  <TabsTrigger value="pending" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                    Pending
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="border-border hover:bg-transparent">
                    <TableHead className="text-muted-foreground">Payment ID</TableHead>
                    <TableHead className="text-muted-foreground">Order</TableHead>
                    <TableHead className="text-muted-foreground">Method</TableHead>
                    <TableHead className="text-muted-foreground">Status</TableHead>
                    <TableHead className="text-muted-foreground text-right">Amount</TableHead>
                    <TableHead className="text-muted-foreground text-right">Time</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPayments.map((payment) => {
                    const method = methodConfig[payment.method]
                    const status = statusConfig[payment.status]
                    const Icon = method.icon
                    return (
                      <TableRow key={payment.id} className="border-border">
                        <TableCell className="font-medium">{payment.id}</TableCell>
                        <TableCell>{payment.orderId}</TableCell>
                        <TableCell>
                          <div className={`inline-flex items-center gap-2 px-2 py-1 rounded-md ${method.color}`}>
                            <Icon className="h-4 w-4" />
                            <span className="text-sm">{method.label}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={status.color}>
                            {status.label}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          KES {payment.amount.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-right text-muted-foreground">
                          {formatTime(payment.createdAt)}
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Payment Dialog */}
      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Process Payment</DialogTitle>
            <DialogDescription>
              {selectedOrder?.id} - Table {selectedOrder?.tableNumber}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Order Summary */}
            <div className="p-4 rounded-lg bg-secondary/30 space-y-2">
              {selectedOrder?.items.map((item: OrderItem, index: number) => (
                <div key={index} className="flex justify-between text-sm">
                  <span>{item.quantity}x {item.menuItem.name}</span>
                  <span>KES {(item.menuItem.price * item.quantity).toLocaleString()}</span>
                </div>
              ))}
              <div className="border-t border-border pt-2 mt-2 flex justify-between">
                <span>Total</span>
                <span className="text-primary">KES {selectedOrder?.total.toLocaleString()}</span>
              </div>
            </div>

            {/* Payment Method Selection */}
            <div className="space-y-2">
              <p className="text-sm font-medium">Payment Method</p>
              <div className="grid grid-cols-3 gap-2">
                {(Object.keys(methodConfig) as PaymentMethod[]).map((method) => {
                  const config = methodConfig[method]
                  const Icon = config.icon
                  return (
                    <Button
                      key={method}
                      variant={paymentMethod === method ? "default" : "outline"}
                      className="flex flex-col items-center gap-1 h-auto py-3"
                      onClick={() => setPaymentMethod(method)}
                    >
                      <Icon className="h-5 w-5" />
                      <span className="text-xs">{config.label}</span>
                    </Button>
                  )
                })}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedOrder(null)}>
              Cancel
            </Button>
            <Button onClick={handleProcessPayment}>
              Confirm Payment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
