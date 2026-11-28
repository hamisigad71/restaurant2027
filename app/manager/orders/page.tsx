"use client"

import { useState, useEffect, useMemo } from "react"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
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
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  EllipsisHorizontalIcon,
  CheckCircleIcon,
  XMarkIcon,
  ClockIcon,
  BanknotesIcon,
  ClipboardDocumentListIcon,
} from "@heroicons/react/24/outline"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { OrderService, LiveOrder } from "@/lib/order-service"
import { calculateBillTotals } from "@/lib/restaurant-store"
import { toast } from "sonner"

const STATUS_FILTERS: Array<"all" | LiveOrder["status"]> = [
  "all",
  "pending",
  "cooking",
  "ready",
  "served",
  "cancelled",
]

export default function ManagerOrdersPage() {
  const [orders, setOrders] = useState<LiveOrder[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<"all" | LiveOrder["status"]>("all")

  useEffect(() => {
    return OrderService.subscribe(setOrders)
  }, [])

  const filteredOrders = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    return orders.filter((order) => {
      const matchStatus = statusFilter === "all" || order.status === statusFilter
      const matchSearch =
        !q ||
        order.id.toLowerCase().includes(q) ||
        order.tableId.toLowerCase().includes(q) ||
        (order.waiter || "").toLowerCase().includes(q)
      return matchStatus && matchSearch
    })
  }, [orders, searchQuery, statusFilter])

  const getOrderTotal = (order: LiveOrder) => {
    if (typeof order.total === "number") return order.total
    const sub = order.items.reduce((s, i) => s + i.price * i.quantity, 0)
    return calculateBillTotals(sub).total
  }

  const cycleFilter = () => {
    const idx = STATUS_FILTERS.indexOf(statusFilter)
    const next = STATUS_FILTERS[(idx + 1) % STATUS_FILTERS.length]
    setStatusFilter(next)
  }

  const handleExportCsv = () => {
    const rows = [
      ["Order ID", "Table", "Waiter", "Status", "Payment", "Total (KES)", "Created At"],
      ...filteredOrders.map((o) => [
        o.id,
        `Table ${o.tableId}`,
        o.waiter || "System",
        o.status,
        o.paymentStatus,
        String(getOrderTotal(o)),
        o.createdAt,
      ]),
    ]
    const csv = rows
      .map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(","))
      .join("\n")
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `tabletap-orders-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
    toast.success("Orders CSV exported", { description: `${filteredOrders.length} orders exported` })
  }

  return (
    <div className="flex flex-col">
      <div className="flex-1 py-4 px-0 space-y-6">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <InputGroup className="w-full sm:w-96 bg-card">
            <InputGroupAddon>
              <MagnifyingGlassIcon />
            </InputGroupAddon>
            <InputGroupInput
              placeholder="Search by Order ID, Table or Waiter..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </InputGroup>
          <div className="flex gap-2 w-full sm:w-auto">
            <Button
              variant="outline"
              onClick={cycleFilter}
              className="flex-1 sm:flex-none gap-2 capitalize"
            >
              <FunnelIcon className="size-4" />
              Filter: {statusFilter}
            </Button>
            <Button onClick={handleExportCsv} className="flex-1 sm:flex-none gap-2">
              Export CSV
            </Button>
          </div>
        </div>

        <Card className="pb-0 overflow-hidden">
          <CardHeader className="border-b">
            <CardTitle className="text-base">
              Active &amp; Recent Orders ({filteredOrders.length})
            </CardTitle>
            <CardDescription>Live operational order ledger</CardDescription>
            <CardAction>
              <Badge variant="secondary">{filteredOrders.length} orders</Badge>
            </CardAction>
          </CardHeader>
          <CardContent className="p-0">
            {filteredOrders.length === 0 ? (
              <Empty className="py-16">
                <EmptyHeader>
                  <EmptyMedia variant="icon">
                    <ClipboardDocumentListIcon />
                  </EmptyMedia>
                  <EmptyTitle>No live orders match</EmptyTitle>
                  <EmptyDescription>Try clearing your filter or search query.</EmptyDescription>
                </EmptyHeader>
              </Empty>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/30">
                    <TableHead className="px-6">Order ID</TableHead>
                    <TableHead className="px-6">Table</TableHead>
                    <TableHead className="px-6">Waiter / Source</TableHead>
                    <TableHead className="px-6">Total</TableHead>
                    <TableHead className="px-6">Time</TableHead>
                    <TableHead className="px-6">Status</TableHead>
                    <TableHead className="px-6">Payment</TableHead>
                    <TableHead className="px-6 text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="px-6 font-medium">{order.id}</TableCell>
                      <TableCell className="px-6">
                        <Badge variant="secondary" className="font-semibold">
                          T{order.tableId}
                        </Badge>
                      </TableCell>
                      <TableCell className="px-6 text-muted-foreground">
                        {order.waiter || "System"}
                      </TableCell>
                      <TableCell className="px-6 font-medium tabular-nums">
                        KES {getOrderTotal(order).toLocaleString()}
                      </TableCell>
                      <TableCell className="px-6 text-muted-foreground">
                        <span className="inline-flex items-center gap-1">
                          <ClockIcon className="size-3.5" />
                          {new Date(order.createdAt).toLocaleTimeString("en-KE", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </TableCell>
                      <TableCell className="px-6">
                        <Badge
                          variant="outline"
                          className={cn(
                            "text-[10px] uppercase",
                            order.status === "served" && "bg-success/10 text-success border-success/20",
                            order.status === "ready" && "bg-success/15 text-success border-success/30",
                            order.status === "cooking" && "bg-primary/10 text-primary border-primary/20",
                            order.status === "pending" && "bg-warning/10 text-warning border-warning/20",
                            order.status === "cancelled" && "bg-destructive/10 text-destructive border-destructive/20",
                          )}
                        >
                          {order.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="px-6">
                        <Badge
                          variant="outline"
                          className={cn(
                            "text-[10px] uppercase",
                            order.paymentStatus === "paid"
                              ? "bg-success/10 text-success border-success/20"
                              : "bg-muted text-muted-foreground border-border",
                          )}
                        >
                          {order.paymentStatus}
                        </Badge>
                      </TableCell>
                      <TableCell className="px-6 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon-sm">
                              <EllipsisHorizontalIcon className="size-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-44">
                            {order.status === "pending" && (
                              <DropdownMenuItem
                                className="gap-2 cursor-pointer"
                                onClick={() => {
                                  OrderService.updateOrderStatus(order.id, "cooking")
                                  toast.info(`${order.id} sent to kitchen`)
                                }}
                              >
                                <CheckCircleIcon className="size-4" />
                                Start Cooking
                              </DropdownMenuItem>
                            )}
                            {order.status !== "served" && order.status !== "cancelled" && (
                              <DropdownMenuItem
                                className="gap-2 cursor-pointer text-success"
                                onClick={() => {
                                  OrderService.updateOrderStatus(order.id, "served")
                                  toast.success(`${order.id} marked Served`)
                                }}
                              >
                                <CheckCircleIcon className="size-4" />
                                Mark Served
                              </DropdownMenuItem>
                            )}
                            {order.paymentStatus !== "paid" && order.status !== "cancelled" && (
                              <DropdownMenuItem
                                className="gap-2 cursor-pointer text-primary"
                                onClick={() => {
                                  OrderService.settleOrder(order.id, "cash")
                                  toast.success(`${order.id} settled & logged`)
                                }}
                              >
                                <BanknotesIcon className="size-4" />
                                Mark Paid (Cash)
                              </DropdownMenuItem>
                            )}
                            {order.status !== "cancelled" && order.paymentStatus !== "paid" && (
                              <DropdownMenuItem
                                className="gap-2 cursor-pointer text-destructive"
                                onClick={() => {
                                  OrderService.updateOrderStatus(order.id, "cancelled")
                                  toast.error(`${order.id} cancelled`)
                                }}
                              >
                                <XMarkIcon className="size-4" />
                                Cancel Order
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
