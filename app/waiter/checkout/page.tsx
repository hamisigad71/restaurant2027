"use client"

import { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button }    from "@/components/ui/button"
import { Badge }     from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Tooltip, TooltipContent, TooltipProvider, TooltipTrigger,
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
  BoltIcon as Sparkles, 
  CheckCircleIcon as CircleDot, 
  ArrowTrendingUpIcon as TrendingUp, 
  WalletIcon as Wallet, 
  CheckCircleIcon as CheckCircle2
} from "@heroicons/react/24/outline"
import { cn } from "@/lib/utils"
import { OrderService, LiveOrder } from "@/lib/order-service"

// ─── Constants ────────────────────────────────────────────────────────────────
const PAYMENT_METHODS = [
  { id:"cash",  label:"Cash",   icon:Banknote,   desc:"Collected by waiter",   bg:"bg-amber-50",  text:"text-amber-600" },
  { id:"mpesa", label:"M-Pesa", icon:Smartphone, desc:"Mobile money transfer",  bg:"bg-green-50",  text:"text-green-600" },
  { id:"card",  label:"Card",   icon:CreditCard, desc:"Tap or insert your card", bg:"bg-blue-50",  text:"text-blue-600"  },
]

const formatTableId  = (id: string) => id.startsWith("T") ? id : `T${id.padStart(2,"0")}`
const formatLabel    = (id: string) => `Table ${id.replace(/^T/,"").padStart(2,"0")}`

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function CheckoutPage() {
  const [selectedMethod, setSelectedMethod] = useState("mpesa")
  const [selectedTable,  setSelectedTable]  = useState<string | null>(null)
  const [activeOrders,   setActiveOrders]   = useState<LiveOrder[]>([])
  const [settled,        setSettled]        = useState<string[]>([])

  useEffect(() => {
    const unsubscribe = OrderService.subscribe((all) => {
      setActiveOrders(
        all.filter((o) => o.status !== "served" && o.status !== "cancelled"),
      )
    })
    return unsubscribe
  }, [])

  // Derive unique tables from live orders
  const activeTablesList = useMemo(() => {
    const tableIds = Array.from(new Set(activeOrders.map((o) => o.tableId)))
    return tableIds
      .filter((tid) => !settled.includes(tid))
      .map((tid) => {
        const orders      = activeOrders.filter((o) => o.tableId === tid)
        const totalAmount = orders.reduce(
          (sum, o) => sum + o.items.reduce((s, i) => s + i.price * i.quantity, 0),
          0,
        )
        const itemsCount = orders.reduce((sum, o) => sum + o.items.length, 0)
        const isReady    = orders.every((o) => o.status === "ready")
        return {
          id:     formatTableId(tid),
          rawId:  tid,
          label:  formatLabel(tid),
          items:  itemsCount,
          amount: totalAmount,
          guests: 4,
          status: isReady ? "ready" : "pending",
        }
      })
  }, [activeOrders, settled])

  // Auto-select first table when list loads
  useEffect(() => {
    if (!selectedTable && activeTablesList.length > 0) {
      setSelectedTable(activeTablesList[0].id)
    }
  }, [activeTablesList, selectedTable])

  // Current receipt details
  const currentRawId   = selectedTable?.replace("T","").replace(/^0+/,"") ?? ""
  const currentOrders  = activeOrders.filter((o) => o.tableId === currentRawId)
  const receiptItems   = currentOrders.flatMap((o) =>
    o.items.map((i) => ({ name: i.name, qty: i.quantity, unit: i.price, amount: i.price * i.quantity })),
  )
  const subtotal = receiptItems.reduce((s, i) => s + i.amount, 0)
  const service  = Math.round(subtotal * 0.1)
  const total    = subtotal + service

  // Summary stats
  const totalRevenue  = activeTablesList.reduce((s, t) => s + t.amount, 0)
  const readyCount    = activeTablesList.filter((t) => t.status === "ready").length

  const handleSettle = () => {
    if (!currentRawId) return
    setSettled((prev) => [...prev, currentRawId])
    setSelectedTable(null)
  }

  return (
    <TooltipProvider>
      <div className="flex flex-col min-h-screen" style={{ background: "#F0EBF8" }}>
        {/* ── Page Header ────────────────────────────────────────── */}
        <div className="max-w-5xl mx-auto w-full px-4 lg:px-6 pt-6">
          <div className="flex items-center gap-3 mb-6">
            <div
              className="flex items-center justify-center w-11 h-11 rounded-xl p-2"
              style={{ background: "oklch(0.45 0.12 285)", boxShadow: "0 4px 12px oklch(0.45 0.12 285 / 0.35)" }}
            >
              <img src="/checkout-nav.png" className="w-full h-full brightness-0 invert object-contain" alt="Checkout" />
            </div>
            <div>
              <h1 className="text-[19px] font-bold tracking-tight leading-none" style={{ color: "#0D031B" }}>
                Billing & Settlement
              </h1>
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] mt-1" style={{ color: "#9A94AA" }}>
                Manage payments and close tables
              </p>
            </div>
          </div>
        </div>

        {/* ── Summary stat bar ────────────────────────────────────── */}
        <div
          className="px-5 py-3 border-b shrink-0 flex items-center gap-6"
          style={{
            background: "rgba(255,255,255,0.75)",
            backdropFilter: "blur(12px)",
            borderColor: "oklch(0.45 0.12 285 / 0.1)",
          }}
        >
          {[
            { label: "Open Tables",    value: activeTablesList.length, icon: ShoppingBag, accent: "oklch(0.75 0.15 75)"   },
            { label: "Ready to Pay",   value: readyCount,              icon: CircleDot,   accent: "oklch(0.62 0.16 150)"  },
            { label: "Total Pending",  value: `KES ${totalRevenue.toLocaleString()}`, icon: TrendingUp, accent: "oklch(0.45 0.12 285)" },
          ].map((stat) => {
            const Icon = stat.icon
            return (
              <div key={stat.label} className="flex items-center gap-2.5">
                <div
                  className="flex items-center justify-center w-8 h-8 rounded-lg shrink-0"
                  style={{ background: `${stat.accent}18` }}
                >
                  <Icon className="h-3.5 w-3.5" style={{ color: stat.accent }} />
                </div>
                <div>
                  <p className="text-[14px] font-bold leading-none tabular-nums" style={{ color: "#0D031B" }}>
                    {stat.value}
                  </p>
                  <p className="text-[9px] font-bold uppercase  mt-0.5" style={{ color: "#9A94AA" }}>
                    {stat.label}
                  </p>
                </div>
              </div>
            )
          })}
        </div>

        {/* ── Main grid ───────────────────────────────────────────── */}
        <div className="flex-1 p-4 lg:p-6 max-w-5xl mx-auto w-full">
          <div className="grid gap-5 md:grid-cols-3 items-start">

            {/* ── Left column ─────────────────────────────────────── */}
            <div className="md:col-span-2 space-y-5">

              {/* Payment method selector */}
              <Card
                className="overflow-hidden border rounded-3xl shadow-sm"
                style={{ background: "rgba(255,255,255,0.9)", borderColor: "oklch(0.45 0.12 285 / 0.12)" }}
              >
                <div className="h-[3px]" style={{ background: "oklch(0.45 0.12 285)" }} />

                <CardHeader className="px-5 pt-5 pb-3">
                  <div className="flex items-center gap-3">
                    <div
                      className="flex items-center justify-center w-9 h-9 rounded-xl"
                      style={{ background: "oklch(0.45 0.12 285 / 0.1)" }}
                    >
                      <Wallet className="h-4 w-4" style={{ color: "oklch(0.45 0.12 285)" }} />
                    </div>
                    <div>
                      <CardTitle className="text-[15px] font-bold " style={{ color: "#0D031B" }}>
                        Payment Method
                      </CardTitle>
                      <p className="text-[10px] font-medium uppercase  mt-0.5" style={{ color: "#9A94AA" }}>
                        Select how to settle
                      </p>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="px-5 pb-5">
                  <div className="grid grid-cols-3 gap-3">
                    {PAYMENT_METHODS.map((m) => {
                      const Icon   = m.icon
                      const active = selectedMethod === m.id
                      return (
                        <button
                          key={m.id}
                          onClick={() => setSelectedMethod(m.id)}
                          className="relative flex flex-col items-center gap-2.5 py-5 px-3 rounded-2xl border transition-all duration-200 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[oklch(0.45_0.12_285)]"
                          style={
                            active
                              ? { background: "oklch(0.45 0.12 285 / 0.06)", borderColor: "oklch(0.45 0.12 285 / 0.4)", boxShadow: "0 2px 12px oklch(0.45 0.12 285 / 0.15)" }
                              : { background: "#F5F2FB", borderColor: "oklch(0.45 0.12 285 / 0.1)" }
                          }
                        >
                          {/* Active checkmark */}
                          {active && (
                            <span
                              className="absolute top-2.5 right-2.5 flex items-center justify-center w-4 h-4 rounded-full"
                              style={{ background: "oklch(0.45 0.12 285)" }}
                            >
                              <Check className="h-2.5 w-2.5 text-white" strokeWidth={2.5} />
                            </span>
                          )}

                          <div className={cn("flex items-center justify-center w-11 h-11 rounded-xl transition-transform duration-200", m.bg, active && "scale-105")}>
                            <Icon className={cn("h-5 w-5", m.text)} />
                          </div>
                          <div className="text-center">
                            <p className="text-[12px] font-bold" style={{ color: "#0D031B" }}>{m.label}</p>
                            <p className="text-[9px] mt-0.5 leading-tight" style={{ color: "#9A94AA" }}>{m.desc}</p>
                          </div>
                        </button>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Active tables list */}
              <Card
                className="overflow-hidden border rounded-3xl shadow-sm"
                style={{ background: "rgba(255,255,255,0.9)", borderColor: "oklch(0.45 0.12 285 / 0.12)" }}
              >
                <div className="h-[3px]" style={{ background: "oklch(0.75 0.15 75)" }} />

                <CardHeader className="px-5 pt-5 pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className="flex items-center justify-center w-9 h-9 rounded-xl"
                        style={{ background: "oklch(0.75 0.15 75 / 0.1)" }}
                      >
                        <ShoppingBag className="h-4 w-4" style={{ color: "oklch(0.55 0.15 75)" }} />
                      </div>
                      <div>
                        <CardTitle className="text-[15px] font-bold " style={{ color: "#0D031B" }}>
                          Active Billing
                        </CardTitle>
                        <p className="text-[10px] font-medium uppercase  mt-0.5" style={{ color: "#9A94AA" }}>
                          {activeTablesList.length} table{activeTablesList.length !== 1 ? "s" : ""} pending settlement
                        </p>
                      </div>
                    </div>

                    <Badge
                      className="text-[10px] font-bold px-2.5 py-1 rounded-full border"
                      style={{
                        background: "oklch(0.75 0.15 75 / 0.1)",
                        color: "oklch(0.55 0.15 75)",
                        borderColor: "oklch(0.75 0.15 75 / 0.25)",
                      }}
                    >
                      {activeTablesList.length} open
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="px-5 pb-5">
                  {activeTablesList.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 gap-3">
                      <div
                        className="w-12 h-12 rounded-2xl flex items-center justify-center"
                        style={{ background: "oklch(0.62 0.16 150 / 0.1)" }}
                      >
                        <Check className="h-6 w-6" style={{ color: "oklch(0.42 0.14 150)" }} />
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-semibold" style={{ color: "#3D374C" }}>All settled!</p>
                        <p className="text-xs mt-0.5" style={{ color: "#9A94AA" }}>No pending tables right now.</p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2.5">
                      {activeTablesList.map((table) => {
                        const selected = selectedTable === table.id
                        return (
                          <button
                            key={table.id}
                            onClick={() => setSelectedTable(table.id)}
                            className="w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl border transition-all duration-200 text-left hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[oklch(0.45_0.12_285)]"
                            style={
                              selected
                                ? { background: "oklch(0.45 0.12 285 / 0.06)", borderColor: "oklch(0.45 0.12 285 / 0.35)", boxShadow: "0 2px 10px oklch(0.45 0.12 285 / 0.1)" }
                                : { background: "#FAFAF9", borderColor: "oklch(0.45 0.12 285 / 0.1)" }
                            }
                          >
                            {/* Table avatar */}
                            <div
                              className="flex items-center justify-center w-11 h-11 rounded-xl font-bold text-lg shrink-0 text-white transition-all duration-200"
                              style={{
                                background: selected ? "oklch(0.45 0.12 285)" : "#D0CBE4",
                                boxShadow: selected ? "0 2px 10px oklch(0.45 0.12 285 / 0.3)" : "none",
                              }}
                            >
                              {table.id.replace("T","")}
                            </div>

                            <div className="flex-1 min-w-0">
                              <p className="text-[13px] font-bold" style={{ color: "#0D031B" }}>{table.label}</p>
                              <div className="flex items-center gap-2 mt-0.5">
                                <span className="flex items-center gap-1 text-[10px]" style={{ color: "#9A94AA" }}>
                                  <Users className="h-3 w-3" />
                                  {table.guests} guests
                                </span>
                                <span style={{ color: "#D0CBE4" }}>·</span>
                                <span className="text-[10px]" style={{ color: "#9A94AA" }}>
                                  {table.items} item{table.items !== 1 ? "s" : ""}
                                </span>
                              </div>
                            </div>

                            <div className="text-right shrink-0">
                              <p className="text-[14px] font-bold tabular-nums" style={{ color: "oklch(0.45 0.12 285)" }}>
                                KES {table.amount.toLocaleString()}
                              </p>
                              <span
                                className="text-[9px] font-bold uppercase  px-2 py-0.5 rounded-full"
                                style={{
                                  background: table.status === "ready" ? "oklch(0.62 0.16 150 / 0.1)" : "oklch(0.75 0.15 75 / 0.1)",
                                  color:      table.status === "ready" ? "oklch(0.42 0.14 150)"        : "oklch(0.55 0.15 75)",
                                }}
                              >
                                {table.status === "ready" ? "Ready" : "Pending"}
                              </span>
                            </div>

                            <ChevronRight
                              className="h-4 w-4 shrink-0 transition-colors"
                              style={{ color: selected ? "oklch(0.45 0.12 285)" : "#D0CBE4" }}
                            />
                          </button>
                        )
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* ── Receipt panel ─────────────────────────────────────── */}
            <div className="sticky top-6">
              <Card
                className="overflow-hidden border rounded-3xl shadow-sm"
                style={{ background: "rgba(255,255,255,0.92)", borderColor: "oklch(0.45 0.12 285 / 0.12)" }}
              >
                {/* Receipt brand header */}
                <div
                  className="px-5 py-5 text-center relative overflow-hidden"
                  style={{ background: "oklch(0.45 0.12 285)" }}
                >
                  <div className="relative z-10">
                    <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-white/15 mx-auto mb-2.5">
                      <Receipt className="h-5 w-5 text-white" />
                    </div>
                    <p className="text-white font-bold text-xl  uppercase">Resto</p>
                    <p className="text-[9px] uppercase  mt-0.5" style={{ color: "rgba(255,255,255,0.55)" }}>
                      Grande Cuisine · Nairobi
                    </p>
                  </div>
                </div>

                {/* Meta row */}
                <div
                  className="px-5 py-2.5 flex items-center justify-between border-b"
                  style={{ background: "#FAFAF9", borderColor: "oklch(0.45 0.12 285 / 0.08)" }}
                >
                  <span className="text-[10px] font-bold uppercase " style={{ color: "#9A94AA" }}>
                    {selectedTable ? formatLabel(selectedTable) : "No table selected"}
                  </span>
                  <span className="text-[10px] font-bold uppercase " style={{ color: "#9A94AA" }}>
                    {new Date().toLocaleDateString("en-KE", { day: "numeric", month: "short", year: "numeric" })}
                  </span>
                </div>

                <CardContent className="px-5 py-4 space-y-4">

                  {/* Line items */}
                  {receiptItems.length === 0 ? (
                    <div className="py-6 text-center">
                      <p className="text-[11px]" style={{ color: "#AEA6BF" }}>
                        Select a table to preview receipt
                      </p>
                    </div>
                  ) : (
                    <ScrollArea className="max-h-48">
                      <div className="space-y-2.5 pr-1">
                        {receiptItems.map((item, i) => (
                          <div key={i} className="flex items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <span className="text-[12px] block truncate" style={{ color: "#3D374C" }}>
                                {item.name}
                              </span>
                              <span className="text-[10px]" style={{ color: "#AEA6BF" }}>
                                ×{item.qty} · KES {item.unit.toLocaleString()}
                              </span>
                            </div>
                            <span className="text-[12px] font-semibold tabular-nums shrink-0" style={{ color: "#0D031B" }}>
                              KES {item.amount.toLocaleString()}
                            </span>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  )}

                  {/* Dashed separator */}
                  <div
                    className="h-px"
                    style={{ backgroundImage: "repeating-linear-gradient(90deg,#D0CBE4 0,#D0CBE4 6px,transparent 6px,transparent 10px)" }}
                  />

                  {/* Subtotals */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-[12px]" style={{ color: "#736C83" }}>
                      <span>Subtotal</span>
                      <span className="tabular-nums">KES {subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-[12px]" style={{ color: "#736C83" }}>
                      <span>Service (10%)</span>
                      <span className="tabular-nums">KES {service.toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Dashed separator */}
                  <div
                    className="h-px"
                    style={{ backgroundImage: "repeating-linear-gradient(90deg,#D0CBE4 0,#D0CBE4 6px,transparent 6px,transparent 10px)" }}
                  />

                  {/* Grand total */}
                  <div className="flex items-baseline justify-between">
                    <span className="text-[13px] font-bold uppercase " style={{ color: "#0D031B" }}>
                      Total
                    </span>
                    <span className="text-xl font-bold tabular-nums" style={{ color: "oklch(0.45 0.12 285)" }}>
                      KES {total.toLocaleString()}
                    </span>
                  </div>

                  {/* Selected payment chip */}
                  {(() => {
                    const m    = PAYMENT_METHODS.find((x) => x.id === selectedMethod)!
                    const Icon = m.icon
                    return (
                      <div
                        className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl"
                        style={{ background: "oklch(0.45 0.12 285 / 0.05)", border: "1px solid oklch(0.45 0.12 285 / 0.1)" }}
                      >
                        <div className={cn("flex items-center justify-center w-7 h-7 rounded-lg shrink-0", m.bg)}>
                          <Icon className={cn("h-3.5 w-3.5", m.text)} />
                        </div>
                        <span className="text-[11px] font-semibold" style={{ color: "#3D374C" }}>{m.label}</span>
                        <span className="text-[10px] ml-auto truncate" style={{ color: "#9A94AA" }}>{m.desc}</span>
                      </div>
                    )
                  })()}

                  {/* CTA */}
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        onClick={handleSettle}
                        disabled={!selectedTable || receiptItems.length === 0}
                        className="w-full h-12 font-bold text-[12px] uppercase  text-white rounded-2xl border-none transition-all duration-200 hover:opacity-90 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] disabled:opacity-40 disabled:pointer-events-none relative overflow-hidden group"
                        style={{
                          background: "oklch(0.45 0.12 285)",
                          boxShadow: "0 6px 24px oklch(0.45 0.12 285 / 0.35)",
                        }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                        <CheckCircle2 className="h-4 w-4 mr-2 relative z-10" />
                        <span className="relative z-10">Post Settlement</span>
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
                </CardContent>
              </Card>
            </div>

          </div>
        </div>
      </div>
    </TooltipProvider>
  )
}