"use client"

import { useState, useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
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
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
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
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemTitle,
} from "@/components/ui/item"
import { Separator } from "@/components/ui/separator"
import {
  MagnifyingGlassIcon as Search,
  CreditCardIcon as CreditCard,
  DevicePhoneMobileIcon as Smartphone,
  BanknotesIcon as Banknote,
  CurrencyDollarIcon as DollarSign,
  CheckCircleIcon as CheckCircle,
  ClockIcon as Clock,
  DocumentTextIcon as Receipt,
} from "@heroicons/react/24/outline"
import { mockPayments } from "@/lib/mock-data"
import { OrderService, LiveOrder } from "@/lib/order-service"
import { calculateBillTotals, PaymentService } from "@/lib/restaurant-store"
import type { Payment, PaymentMethod, PaymentStatus } from "@/lib/types"
import { toast } from "sonner"

const methodConfig: Record<
  PaymentMethod,
  { label: string; icon: typeof CreditCard; color: string }
> = {
  cash: { label: "Cash", icon: Banknote, color: "bg-success/10 text-success border-success/20" },
  mpesa: { label: "M-Pesa", icon: Smartphone, color: "bg-chart-4/10 text-chart-4 border-chart-4/20" },
  card: { label: "Card", icon: CreditCard, color: "bg-primary/10 text-primary border-primary/20" },
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
  const [liveOrders, setLiveOrders] = useState<LiveOrder[]>([])
  const [livePayments, setLivePayments] = useState<Payment[]>(mockPayments)
  const [selectedOrder, setSelectedOrder] = useState<LiveOrder | null>(null)
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cash")

  useEffect(() => {
    const unsubOrders = OrderService.subscribe(setLiveOrders)
    const unsubPayments = PaymentService.subscribe(setLivePayments)
    return () => {
      unsubOrders()
      unsubPayments()
    }
  }, [])

  const pendingPaymentOrders = useMemo(
    () => liveOrders.filter((o) => o.paymentStatus !== "paid" && o.status !== "cancelled"),
    [liveOrders],
  )

  const getOrderTotal = (order: LiveOrder) => {
    if (typeof order.total === "number") return order.total
    const sub = order.items.reduce((s, i) => s + i.price * i.quantity, 0)
    return calculateBillTotals(sub).total
  }

  const allPayments = livePayments

  const filteredPayments = allPayments.filter((payment) => {
    const matchesSearch =
      payment.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.id.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = activeFilter === "all" || payment.status === activeFilter
    return matchesSearch && matchesFilter
  })

  const stats = [
    {
      label: "Today's Revenue",
      value: `KES ${allPayments
        .filter((p) => p.status === "completed")
        .reduce((sum, p) => sum + p.amount, 0)
        .toLocaleString()}`,
      icon: DollarSign,
      tone: "bg-primary/10 text-primary",
    },
    {
      label: "Pending",
      value: allPayments.filter((p) => p.status === "pending").length + pendingPaymentOrders.length,
      icon: Clock,
      tone: "bg-warning/10 text-warning",
    },
    {
      label: "Completed",
      value: allPayments.filter((p) => p.status === "completed").length,
      icon: CheckCircle,
      tone: "bg-success/10 text-success",
    },
    {
      label: "Awaiting Payment",
      value: pendingPaymentOrders.length,
      icon: Receipt,
      tone: "bg-chart-4/10 text-chart-4",
    },
  ]

  const handleProcessPayment = () => {
    if (!selectedOrder) return
    const payment = OrderService.settleOrder(selectedOrder.id, paymentMethod)
    if (payment) {
      toast.success(`Payment ${payment.id} recorded`, {
        description: `KES ${payment.amount.toLocaleString()} (${paymentMethod.toUpperCase()}) · Table ${selectedOrder.tableId}`,
      })
    }
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
        <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.label} size="sm">
              <CardHeader>
                <CardDescription className="text-xs font-medium">{stat.label}</CardDescription>
                <CardAction>
                  <div className={`flex size-8 items-center justify-center rounded-lg ${stat.tone}`}>
                    <stat.icon className="size-4" />
                  </div>
                </CardAction>
              </CardHeader>
              <CardContent>
                <CardTitle className="text-2xl font-semibold tabular-nums">{stat.value}</CardTitle>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Orders Awaiting Payment</CardTitle>
              <CardDescription>Click an order to settle</CardDescription>
            </CardHeader>
            <CardContent>
              {pendingPaymentOrders.length === 0 ? (
                <Empty className="py-10 border">
                  <EmptyHeader>
                    <EmptyMedia variant="icon">
                      <Receipt />
                    </EmptyMedia>
                    <EmptyTitle className="text-base">No pending orders</EmptyTitle>
                    <EmptyDescription>All active bills are settled.</EmptyDescription>
                  </EmptyHeader>
                </Empty>
              ) : (
                <ItemGroup className="gap-2">
                  {pendingPaymentOrders.map((order) => (
                    <Item
                      key={order.id}
                      variant="muted"
                      size="sm"
                      className="cursor-pointer hover:bg-secondary/60"
                      onClick={() => setSelectedOrder(order)}
                    >
                      <ItemContent>
                        <ItemTitle>{order.id}</ItemTitle>
                        <ItemDescription>Table {order.tableId}</ItemDescription>
                      </ItemContent>
                      <ItemActions className="flex-col items-end gap-0.5">
                        <span className="text-sm font-semibold text-primary tabular-nums">
                          KES {getOrderTotal(order).toLocaleString()}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {order.items.length} items
                        </span>
                      </ItemActions>
                    </Item>
                  ))}
                </ItemGroup>
              )}
            </CardContent>
          </Card>

          <Card className="lg:col-span-2">
            <CardHeader className="border-b">
              <CardTitle className="text-base">Payment History</CardTitle>
              <CardDescription>Completed and pending settlements</CardDescription>
              <CardAction>
                <InputGroup className="w-full sm:w-52">
                  <InputGroupAddon>
                    <Search />
                  </InputGroupAddon>
                  <InputGroupInput
                    type="search"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </InputGroup>
              </CardAction>
            </CardHeader>
            <CardContent className="space-y-4">
              <Tabs value={activeFilter} onValueChange={setActiveFilter}>
                <TabsList>
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="completed">Completed</TabsTrigger>
                  <TabsTrigger value="pending">Pending</TabsTrigger>
                </TabsList>
              </Tabs>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Payment ID</TableHead>
                    <TableHead>Order</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead className="text-right">Time</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPayments.map((payment) => {
                    const method = methodConfig[payment.method]
                    const status = statusConfig[payment.status]
                    const Icon = method.icon
                    return (
                      <TableRow key={payment.id}>
                        <TableCell className="font-medium">{payment.id}</TableCell>
                        <TableCell>{payment.orderId}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className={method.color}>
                            <Icon />
                            {method.label}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={status.color}>
                            {status.label}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right font-medium tabular-nums">
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

      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Process Payment</DialogTitle>
            <DialogDescription>
              {selectedOrder?.id} - Table {selectedOrder?.tableId}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <Card size="sm" className="bg-muted/40">
              <CardContent className="space-y-2">
                {selectedOrder?.items.map((item, index: number) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span>
                      {item.quantity}x {item.name}
                    </span>
                    <span className="tabular-nums">
                      KES {(item.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                ))}
                <Separator />
                <div className="flex justify-between font-medium">
                  <span>Total (incl. 16% VAT)</span>
                  <span className="text-primary tabular-nums">
                    KES {selectedOrder ? getOrderTotal(selectedOrder).toLocaleString() : 0}
                  </span>
                </div>
              </CardContent>
            </Card>

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
                      <Icon className="size-5" />
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
            <Button onClick={handleProcessPayment}>Confirm Payment</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
