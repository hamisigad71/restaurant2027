"use client"

import { useState, useEffect, useMemo } from "react"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  CreditCardIcon as CreditCard,
  BanknotesIcon as Banknote,
  DevicePhoneMobileIcon as Smartphone,
  DocumentTextIcon as Receipt,
  ChevronRightIcon as ChevronRight,
  CheckIcon as Check,
  UserGroupIcon as Users,
  ShoppingBagIcon as ShoppingBag,
  CheckCircleIcon as CircleDot,
  ArrowTrendingUpIcon as TrendingUp,
  WalletIcon as Wallet,
  CheckCircleIcon as CheckCircle2,
} from "@heroicons/react/24/outline"
import { cn } from "@/lib/utils"
import { OrderService, LiveOrder } from "@/lib/order-service"
import { calculateBillTotals, normalizeTableId } from "@/lib/restaurant-store"
import type { PaymentMethod } from "@/lib/types"
import { toast } from "sonner"

const PAYMENT_METHODS = [
  { id: "cash", label: "Cash", icon: Banknote, desc: "Collected by waiter", tone: "bg-warning/10 text-warning" },
  { id: "mpesa", label: "M-Pesa", icon: Smartphone, desc: "Mobile money transfer", tone: "bg-success/10 text-success" },
  { id: "card", label: "Card", icon: CreditCard, desc: "Tap or insert your card", tone: "bg-primary/10 text-primary" },
]

const formatTableId = (id: string) => (id.startsWith("T") ? id : `T${id.padStart(2, "0")}`)
const formatLabel = (id: string) => `Table ${id.replace(/^T/, "").padStart(2, "0")}`

export default function CheckoutPage() {
  const [selectedMethod, setSelectedMethod] = useState("mpesa")
  const [selectedTable, setSelectedTable] = useState<string | null>(null)
  const [activeOrders, setActiveOrders] = useState<LiveOrder[]>([])

  useEffect(() => {
    const unsubscribe = OrderService.subscribe((all) => {
      setActiveOrders(
        all.filter((o) => o.paymentStatus !== "paid" && o.status !== "cancelled"),
      )
    })
    return unsubscribe
  }, [])

  const activeTablesList = useMemo(() => {
    const tableIds = Array.from(new Set(activeOrders.map((o) => normalizeTableId(o.tableId))))
    return tableIds.map((tid) => {
      const orders = activeOrders.filter((o) => normalizeTableId(o.tableId) === tid)
      const totalAmount = orders.reduce(
        (sum, o) => sum + o.items.reduce((s, i) => s + i.price * i.quantity, 0),
        0,
      )
      const itemsCount = orders.reduce((sum, o) => sum + o.items.length, 0)
      const isReady = orders.every((o) => o.status === "ready" || o.status === "served")
      return {
        id: formatTableId(tid),
        rawId: tid,
        label: formatLabel(tid),
        items: itemsCount,
        amount: totalAmount,
        guests: 4,
        status: isReady ? "ready" : "pending",
      }
    })
  }, [activeOrders])

  useEffect(() => {
    if (!selectedTable && activeTablesList.length > 0) {
      setSelectedTable(activeTablesList[0].id)
    }
  }, [activeTablesList, selectedTable])

  const currentRawId = selectedTable ? normalizeTableId(selectedTable) : ""
  const currentOrders = activeOrders.filter((o) => normalizeTableId(o.tableId) === currentRawId)
  const receiptItems = currentOrders.flatMap((o) =>
    o.items.map((i) => ({
      name: i.name,
      qty: i.quantity,
      unit: i.price,
      amount: i.price * i.quantity,
    })),
  )
  const subtotal = receiptItems.reduce((s, i) => s + i.amount, 0)
  const bill = calculateBillTotals(subtotal)
  const tax = bill.tax
  const total = bill.total

  const totalRevenue = activeTablesList.reduce((s, t) => s + t.amount, 0)
  const readyCount = activeTablesList.filter((t) => t.status === "ready").length

  const handleSettle = () => {
    if (!currentRawId) return
    const result = OrderService.settleTable(currentRawId, selectedMethod as PaymentMethod)
    toast.success(`Table ${currentRawId} settled`, {
      description: `KES ${result.total.toLocaleString()} posted (${selectedMethod.toUpperCase()}) · Sent to Housekeeping`,
    })
    setSelectedTable(null)
  }

  const currentMethod = PAYMENT_METHODS.find((x) => x.id === selectedMethod)!
  const CurrentMethodIcon = currentMethod.icon

  return (
    <TooltipProvider>
      <div className="flex flex-col min-h-screen bg-background">
        <div className="max-w-5xl mx-auto w-full px-4 lg:px-6 pt-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex size-11 items-center justify-center rounded-xl bg-primary p-2 shadow-sm">
              <img
                src="/checkout-nav.png"
                className="w-full h-full brightness-0 invert object-contain"
                alt="Checkout"
              />
            </div>
            <div>
              <h1 className="text-xl font-semibold leading-none text-foreground">
                Billing &amp; Settlement
              </h1>
              <p className="text-xs font-medium uppercase text-muted-foreground mt-1">
                Manage payments and close tables
              </p>
            </div>
          </div>
        </div>

        <div className="px-5 py-3 border-y bg-card/80 backdrop-blur-sm shrink-0 flex items-center gap-6 overflow-x-auto">
          {[
            { label: "Open Tables", value: activeTablesList.length, icon: ShoppingBag, tone: "bg-warning/10 text-warning" },
            { label: "Ready to Pay", value: readyCount, icon: CircleDot, tone: "bg-success/10 text-success" },
            { label: "Total Pending", value: `KES ${totalRevenue.toLocaleString()}`, icon: TrendingUp, tone: "bg-primary/10 text-primary" },
          ].map((stat) => {
            const Icon = stat.icon
            return (
              <div key={stat.label} className="flex items-center gap-2.5 shrink-0">
                <div className={cn("flex size-8 items-center justify-center rounded-lg", stat.tone)}>
                  <Icon className="size-4" />
                </div>
                <div>
                  <p className="text-sm font-semibold leading-none tabular-nums text-foreground">
                    {stat.value}
                  </p>
                  <p className="text-[10px] font-medium uppercase text-muted-foreground mt-0.5">
                    {stat.label}
                  </p>
                </div>
              </div>
            )
          })}
        </div>

        <div className="flex-1 p-4 lg:p-6 max-w-5xl mx-auto w-full">
          <div className="grid gap-5 md:grid-cols-3 items-start">
            <div className="md:col-span-2 space-y-5">
              <Card>
                <CardHeader className="border-b">
                  <div className="flex items-center gap-3">
                    <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Wallet className="size-4" />
                    </div>
                    <div>
                      <CardTitle className="text-base">Payment Method</CardTitle>
                      <CardDescription className="text-xs uppercase">
                        Select how to settle
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="grid grid-cols-3 gap-3">
                    {PAYMENT_METHODS.map((m) => {
                      const Icon = m.icon
                      const active = selectedMethod === m.id
                      return (
                        <Button
                          key={m.id}
                          type="button"
                          variant={active ? "secondary" : "outline"}
                          onClick={() => setSelectedMethod(m.id)}
                          className={cn(
                            "relative h-auto flex-col gap-2 py-4 px-3 rounded-xl",
                            active && "border-primary ring-1 ring-primary/30",
                          )}
                        >
                          {active && (
                            <span className="absolute top-2 right-2 flex size-4 items-center justify-center rounded-full bg-primary text-primary-foreground">
                              <Check className="size-2.5" />
                            </span>
                          )}
                          <div className={cn("flex size-10 items-center justify-center rounded-lg", m.tone)}>
                            <Icon className="size-5" />
                          </div>
                          <div className="text-center">
                            <p className="text-xs font-semibold text-foreground">{m.label}</p>
                            <p className="text-[10px] text-muted-foreground font-normal">{m.desc}</p>
                          </div>
                        </Button>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="border-b">
                  <div className="flex items-center gap-3">
                    <div className="flex size-9 items-center justify-center rounded-lg bg-warning/10 text-warning">
                      <ShoppingBag className="size-4" />
                    </div>
                    <div>
                      <CardTitle className="text-base">Active Billing</CardTitle>
                      <CardDescription className="text-xs uppercase">
                        {activeTablesList.length} table
                        {activeTablesList.length !== 1 ? "s" : ""} pending settlement
                      </CardDescription>
                    </div>
                  </div>
                  <CardAction>
                    <Badge variant="outline" className="text-warning border-warning/30 bg-warning/10">
                      {activeTablesList.length} open
                    </Badge>
                  </CardAction>
                </CardHeader>

                <CardContent>
                  {activeTablesList.length === 0 ? (
                    <Empty className="py-10">
                      <EmptyHeader>
                        <EmptyMedia variant="icon">
                          <Check className="text-success" />
                        </EmptyMedia>
                        <EmptyTitle className="text-base">All settled!</EmptyTitle>
                        <EmptyDescription>No pending tables right now.</EmptyDescription>
                      </EmptyHeader>
                    </Empty>
                  ) : (
                    <div className="space-y-2.5">
                      {activeTablesList.map((table) => {
                        const selected = selectedTable === table.id
                        return (
                          <Button
                            key={table.id}
                            type="button"
                            variant={selected ? "secondary" : "outline"}
                            onClick={() => setSelectedTable(table.id)}
                            className={cn(
                              "w-full h-auto justify-start gap-4 px-4 py-3 rounded-xl text-left",
                              selected && "border-primary ring-1 ring-primary/25",
                            )}
                          >
                            <div
                              className={cn(
                                "flex size-10 items-center justify-center rounded-lg font-bold text-base shrink-0",
                                selected
                                  ? "bg-primary text-primary-foreground"
                                  : "bg-muted text-muted-foreground",
                              )}
                            >
                              {table.id.replace("T", "")}
                            </div>

                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold text-foreground">{table.label}</p>
                              <div className="flex items-center gap-2 text-xs text-muted-foreground font-normal">
                                <span className="inline-flex items-center gap-1">
                                  <Users className="size-3" />
                                  {table.guests} guests
                                </span>
                                <span>·</span>
                                <span>
                                  {table.items} item{table.items !== 1 ? "s" : ""}
                                </span>
                              </div>
                            </div>

                            <div className="text-right shrink-0 space-y-1">
                              <p className="text-sm font-semibold tabular-nums text-primary">
                                KES {table.amount.toLocaleString()}
                              </p>
                              <Badge
                                variant="outline"
                                className={cn(
                                  "text-[10px] uppercase",
                                  table.status === "ready"
                                    ? "bg-success/10 text-success border-success/20"
                                    : "bg-warning/10 text-warning border-warning/20",
                                )}
                              >
                                {table.status === "ready" ? "Ready" : "Pending"}
                              </Badge>
                            </div>

                            <ChevronRight className="size-4 text-muted-foreground shrink-0" />
                          </Button>
                        )
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            <div className="sticky top-6">
              <Card className="py-0 gap-0 overflow-hidden">
                <div className="px-5 py-5 text-center bg-primary text-primary-foreground">
                  <div className="flex size-10 items-center justify-center rounded-lg bg-primary-foreground/15 mx-auto mb-2">
                    <Receipt className="size-5" />
                  </div>
                  <p className="font-bold text-lg uppercase">Resto</p>
                  <p className="text-[10px] uppercase text-primary-foreground/70 mt-0.5">
                    Grande Cuisine · Nairobi
                  </p>
                </div>

                <div className="px-5 py-2.5 flex items-center justify-between border-b bg-muted/30 text-xs text-muted-foreground font-medium">
                  <span>{selectedTable ? formatLabel(selectedTable) : "No table selected"}</span>
                  <span>
                    {new Date().toLocaleDateString("en-KE", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>

                <CardContent className="py-4 space-y-4">
                  {receiptItems.length === 0 ? (
                    <p className="py-6 text-center text-xs text-muted-foreground">
                      Select a table to preview receipt
                    </p>
                  ) : (
                    <ScrollArea className="max-h-48">
                      <div className="space-y-2.5 pr-1">
                        {receiptItems.map((item, i) => (
                          <div key={i} className="flex items-start justify-between gap-2 text-xs">
                            <div className="min-w-0">
                              <p className="font-medium text-foreground truncate">{item.name}</p>
                              <p className="text-muted-foreground">
                                ×{item.qty} · KES {item.unit.toLocaleString()}
                              </p>
                            </div>
                            <span className="font-semibold tabular-nums shrink-0">
                              KES {item.amount.toLocaleString()}
                            </span>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  )}

                  <Separator />

                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between text-muted-foreground">
                      <span>Subtotal</span>
                      <span className="tabular-nums">KES {subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>VAT (16%)</span>
                      <span className="tabular-nums">KES {tax.toLocaleString()}</span>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex items-baseline justify-between">
                    <span className="text-sm font-semibold uppercase">Total</span>
                    <span className="text-xl font-bold tabular-nums text-primary">
                      KES {total.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg border bg-muted/30 text-xs">
                    <div
                      className={cn(
                        "flex size-7 items-center justify-center rounded-md shrink-0",
                        currentMethod.tone,
                      )}
                    >
                      <CurrentMethodIcon className="size-3.5" />
                    </div>
                    <span className="font-semibold">{currentMethod.label}</span>
                    <span className="text-muted-foreground ml-auto truncate">
                      {currentMethod.desc}
                    </span>
                  </div>
                </CardContent>

                <CardFooter className="pb-5 pt-0">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        onClick={handleSettle}
                        disabled={!selectedTable || receiptItems.length === 0}
                        size="lg"
                        className="w-full gap-2"
                      >
                        <CheckCircle2 className="size-4" />
                        Post Settlement
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      {!selectedTable
                        ? "Select a table first"
                        : receiptItems.length === 0
                          ? "No items to settle"
                          : `Settle KES ${total.toLocaleString()} for ${formatLabel(selectedTable)}`}
                    </TooltipContent>
                  </Tooltip>
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  )
}
