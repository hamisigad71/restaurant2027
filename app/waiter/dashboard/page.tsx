"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { toast } from "sonner"
import Link from "next/link"
import {
  Bell,
  ShoppingCart,
  Clock,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  UserCheck,
  ArrowRight,
  ChevronRight,
  Crown,
  Flame,
  Coffee,
  UtensilsCrossed,
  CircleDot,
  Activity,
  X,
  Zap,
} from "lucide-react"
import { Badge }   from "@/components/ui/badge"
import { Button }  from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { OrderService, LiveOrder } from "@/lib/order-service"

// ─── Static mock data ────────────────────────────────────────────────────────

const tableImages = [
  "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=300&h=200&fit=crop",
  "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?w=300&h=200&fit=crop",
  "https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?w=300&h=200&fit=crop",
  "https://images.unsplash.com/photo-1525610553991-2bede1a236e2?w=300&h=200&fit=crop",
  "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=300&h=200&fit=crop",
  "https://images.unsplash.com/photo-1424847651672-bf20a4b0982b?w=300&h=200&fit=crop",
  "https://images.unsplash.com/photo-1522792043064-2db24c3a6479?w=300&h=200&fit=crop",
]

const serviceAlerts = [
  {
    table: "Table 4",
    tableNum: "4",
    items: "Grilled Sea Bass · Filet Mignon",
    time: "2m ago",
    urgency: "hot",
    orderValue: "KES 3,200",
  },
  {
    table: "Table 12",
    tableNum: "12",
    items: "2× Cappuccino · Croissant",
    time: "5m ago",
    urgency: "warm",
    orderValue: "KES 850",
  },
  {
    table: "Table 7",
    tableNum: "7",
    items: "Lobster Thermidor",
    time: "Just now",
    urgency: "hot",
    orderValue: "KES 5,400",
  },
]

const myTables = [
  { num: 2,  guests: 3, status: "occupied",  order: "ORD-001", elapsed: "15m" },
  { num: 3,  guests: 4, status: "occupied",  order: "ORD-002", elapsed: "25m" },
  { num: 7,  guests: 6, status: "occupied",  order: "ORD-003", elapsed: "40m" },
  { num: 11, guests: 2, status: "occupied",  order: "ORD-004", elapsed: "10m" },
  { num: 5,  guests: 0, status: "available", order: null,      elapsed: null  },
  { num: 8,  guests: 0, status: "available", order: null,      elapsed: null  },
  { num: 1,  guests: 0, status: "reserved",  order: null,      elapsed: null  },
  { num: 9,  guests: 0, status: "reserved",  order: null,      elapsed: null  },
]

const recentActivity = [
  { icon: CheckCircle2,    color: "text-[oklch(0.7_0.15_150)]",  bg: "bg-[oklch(0.7_0.15_150)]/10",  text: "Table 6 payment processed",   sub: "KES 2,100 · 4m ago",  dot: "oklch(0.7 0.15 150)" },
  { icon: ShoppingCart,    color: "text-[oklch(0.45_0.12_285)]", bg: "bg-[oklch(0.45_0.12_285)]/10", text: "New order placed — Table 3",   sub: "6 items · 8m ago",    dot: "oklch(0.45 0.12 285)" },
  { icon: AlertCircle,     color: "text-[oklch(0.75_0.15_75)]",  bg: "bg-[oklch(0.75_0.15_75)]/10",  text: "Table 9 — guests arrived",     sub: "Reserved · 12m ago",  dot: "oklch(0.75 0.15 75)" },
  { icon: UtensilsCrossed, color: "text-[oklch(0.45_0.12_285)]", bg: "bg-[oklch(0.45_0.12_285)]/10", text: "Table 2 order updated",        sub: "+2 items · 18m ago",  dot: "oklch(0.45 0.12 285)" },
]

const quickActions = [
  { href: "/waiter/service-floor",   icon: ShoppingCart, label: "New Order",      primary: true  },
  { href: "/waiter/service-floor",   icon: UserCheck,    label: "Floor Plan",     primary: false },
  { href: "/waiter/order-tracking",  icon: Coffee,       label: "Order Status",   primary: false },
  { href: "/waiter/checkout",        icon: CheckCircle2, label: "Settlements",    primary: false },
]

// ─── Sub-components ──────────────────────────────────────────────────────────

function StatCard({
  icon: Icon,
  value,
  label,
  accentColor,
  badge,
}: {
  icon: React.ComponentType<{ className?: string; color?: string; style?: React.CSSProperties }>
  value: string
  label: string
  accentColor: string
  badge?: string
}) {
  return (
    <Card
      className="relative overflow-hidden border bg-white/75 backdrop-blur-md shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group"
      style={{ borderColor: "oklch(0.45 0.12 285 / 0.12)" }}
    >
      {/* Subtle top gradient strip */}
      <div
        className="absolute top-0 left-0 right-0 h-[2px] rounded-t-xl"
        style={{ background: accentColor }}
      />

      <CardContent className="p-5 pt-6">
        <div className="flex items-start justify-between mb-4">
          <div
            className="flex items-center justify-center w-10 h-10 rounded-xl transition-transform group-hover:scale-105"
            style={{ background: `color-mix(in oklch, ${accentColor} 12%, transparent)` }}
          >
            <Icon className="h-5 w-5" color={accentColor} />
          </div>
          {badge && (
            <Badge
              className="text-[9px] uppercase  rounded-full border px-2 py-0.5"
              style={{
                background: "oklch(0.75 0.15 75 / 0.12)",
                color: "oklch(0.75 0.15 75)",
                borderColor: "oklch(0.75 0.15 75 / 0.3)",
              }}
            >
              <Zap className="h-2.5 w-2.5 mr-1" />
              {badge}
            </Badge>
          )}
        </div>
        <p
          className="text-3xl lg:text-[2rem] leading-none  truncate"
          style={{ color: "#0D031B" }}
        >
          {value}
        </p>
        <p
          className="text-[10px] uppercase  mt-1.5"
          style={{ color: "#736C83" }}
        >
          {label}
        </p>
      </CardContent>
    </Card>
  )
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function WaiterDashboard() {
  const [orders, setOrders] = useState<LiveOrder[]>([])
  const [customerCalls, setCustomerCalls] = useState<{ id: string; tableId: string; createdAt: string }[]>([])
  const [dismissed, setDismissed] = useState<string[]>([])

  // Derived data
  const readyOrders = orders.filter(o => o.status === "ready" && !dismissed.includes(o.id))
  const activeCalls = customerCalls.filter(c => !dismissed.includes(c.id))
  
  const combinedAlerts = [
    ...readyOrders.map(o => ({ ...o, alertType: 'order' as const })),
    ...activeCalls.map(c => ({ ...c, alertType: 'call' as const }))
  ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  const activeOrders = orders.filter(o => o.status !== "served" && o.status !== "cancelled")
  const activeTablesCount = Array.from(new Set(activeOrders.map(o => o.tableId))).length

  useEffect(() => {
    const unsubscribe = OrderService.subscribe((allOrders) => {
      setOrders(prev => {
        // Check if any new orders have become "ready"
        const newReady = allOrders.filter(o => 
          o.status === "ready" && 
          !prev.some(p => p.id === o.id && p.status === "ready")
        )
        
        if (newReady.length > 0) {
          const audio = new Audio('/mixkit-bike-notification-bell-590.wav')
          audio.play().catch(() => {})
          toast.success(`Order for Table ${newReady[0].tableId} is ready!`)
        }
        
        return allOrders
      })
    })
    return unsubscribe
  }, [])

  useEffect(() => {
    // console.log("Setting up Supabase real-time listener...")
    // Existing summons listener code remains here...
    
    const channelName = `summons-realtime-${Date.now()}`
    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'summons',
        },
        (payload) => {
          console.log("🔔 SUMMONS PAYLOAD:", payload)
          
          const rawName = payload.new?.staff_name || "Staff Member"
          const staffId = payload.new?.staff_id
          
          // Ultra-robust check using regex and type-agnostic ID check
          const isTableIdentifier = /table/i.test(String(rawName))
          const isZeroId = String(staffId) === "0"
          const hasTableId = payload.new?.table_id !== undefined && payload.new?.table_id !== null
          
          const isCustomerCall = isZeroId || isTableIdentifier || hasTableId
          const name = rawName.trim()

          console.log("➡️ IS CUSTOMER CALL?", { isCustomerCall, name, staffId, isTableIdentifier, isZeroId })

          // Play appropriate notification sound
          try {
            const soundFile = isCustomerCall 
              ? "/mixkit-bike-notification-bell-590.wav" 
              : "/universfield-new-notification-022-370046.mp3"
            const audio = new Audio(soundFile)
            audio.play().catch((err) => {
              console.error("Audio playback was blocked by the browser:", err)
            })
          } catch (err) {
            console.error("Failed to initialize Audio:", err)
          }

          if (isCustomerCall) {
            // Add to persistent list
            setCustomerCalls(prev => [
              { 
                id: payload.new.id || `${Date.now()}`, 
                tableId: name.replace(/table /i, "").trim(),
                createdAt: new Date().toISOString() 
              }, 
              ...prev
            ])

            toast.warning("Table Assistance", {
              description: `${name} is requesting a waiter now.`,
              duration: 10000,
            })
          } else {
            toast.error("STAFF ALERT: Manager Request", {
              description: `${name}, please report to the manager's office immediately.`,
              duration: 12000,
            })
          }
        }
      )
      .subscribe((status) => {
        console.log("Realtime subscription status:", status)
      })

    return () => {
      console.log("Cleaning up Supabase real-time listener...")
      supabase.removeChannel(channel)
    }
  }, [])

  return (
    <TooltipProvider>
      <div
        className="min-h-screen py-5 px-0 space-y-6"
        style={{ background: "#EBE6F8" }}
      >

        {/* ── Page Header ──────────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            {/* Avatar */}
            <Avatar className="h-11 w-11 border-2" style={{ borderColor: "oklch(0.45 0.12 285 / 0.25)" }}>
              <AvatarFallback
                className="text-sm"
                style={{ background: "oklch(0.45 0.12 285 / 0.12)", color: "oklch(0.45 0.12 285)" }}
              >
                WA
              </AvatarFallback>
            </Avatar>

            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <div
                  className="w-1.5 h-1.5 rounded-full animate-pulse"
                  style={{ background: "oklch(0.7 0.15 150)" }}
                />
                <span
                  className="text-[10px] uppercase "
                  style={{ color: "oklch(0.7 0.15 150)" }}
                >
                  Live · Shift Active
                </span>
              </div>
              <h1
                className="text-2xl  leading-none"
                style={{ color: "#0D031B" }}
              >
                Good afternoon, Waiter
              </h1>
              <p className="text-sm mt-0.5" style={{ color: "#736C83" }}>
                {new Date().toLocaleDateString("en-KE", { weekday: "long", day: "numeric", month: "long" })}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1.5 text-[11px] uppercase hover:bg-white/80 transition-colors"
                  style={{
                    borderColor: "oklch(0.45 0.12 285 / 0.3)",
                    background: "white/60",
                    color: "#3D374C",
                  }}
                >
                  <Activity className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Live View</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>View full floor activity</TooltipContent>
            </Tooltip>

            <Button
              size="sm"
              className="gap-1.5 text-[11px] uppercase text-white hover:opacity-90 shadow-md transition-all hover:-translate-y-0.5"
              style={{
                background: "oklch(0.45 0.12 285)",
                boxShadow: "0 4px 16px oklch(0.45 0.12 285 / 0.35)",
              }}
              asChild
            >
              <Link href="/waiter/service-floor">
                <ShoppingCart className="h-3.5 w-3.5" />
                New Order
              </Link>
            </Button>
          </div>
        </div>

        {/* ── Stat Row ─────────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
          <StatCard
            icon={Bell}
            value={combinedAlerts.length.toString()}
            label="Service Alerts"
            accentColor="oklch(0.75 0.15 75)"
            badge={combinedAlerts.length > 0 ? "Action" : undefined}
          />
          <StatCard
            icon={ShoppingCart}
            value={activeTablesCount.toString()}
            label="Active Tables"
            accentColor="oklch(0.45 0.12 285)"
          />
          <StatCard
            icon={TrendingUp}
            value="KES 4,250"
            label="Today's Sales"
            accentColor="oklch(0.7 0.15 150)"
          />
          <StatCard
            icon={Clock}
            value="3.5m"
            label="Avg Speed"
            accentColor="#AEA6BF"
          />
        </div>

        {/* ── Main Grid ────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-5">

          {/* ── LEFT ───────────────────────────────────────────────────── */}
          <div className="space-y-5">

            {/* Service Alerts */}
            <Card
              className="overflow-hidden border bg-white/75 backdrop-blur-md shadow-sm"
              style={{ borderColor: "oklch(0.45 0.12 285 / 0.12)" }}
            >
              <CardHeader
                className="px-5 py-4"
                style={{ borderBottom: "1px solid oklch(0.45 0.12 285 / 0.08)" }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center"
                      style={{ background: "oklch(0.75 0.15 75 / 0.12)" }}
                    >
                      <Bell className="h-4 w-4" style={{ color: "oklch(0.75 0.15 75)" }} />
                    </div>
                    <div>
                      <CardTitle
                        className="text-sm uppercase "
                        style={{ color: "#0D031B" }}
                      >
                        Service Alerts
                      </CardTitle>
                      <p
                        className="text-[10px] uppercase font-medium"
                        style={{ color: "#736C83" }}
                      >
                        Kitchen ready · Pick up now
                      </p>
                    </div>
                  </div>

                  <Badge
                    className="flex items-center gap-1.5 text-[10px] uppercase  rounded-full px-3 py-1 border"
                    style={{
                      background: "oklch(0.75 0.15 75 / 0.1)",
                      color: "oklch(0.75 0.15 75)",
                      borderColor: "oklch(0.75 0.15 75 / 0.25)",
                    }}
                  >
                    <CircleDot className="h-2.5 w-2.5 animate-pulse" />
                    Live
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="p-0">
                {combinedAlerts.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-14 gap-3">
                    <div
                      className="w-14 h-14 rounded-2xl flex items-center justify-center"
                      style={{ background: "oklch(0.7 0.15 150 / 0.1)" }}
                    >
                      <CheckCircle2 className="h-7 w-7" style={{ color: "oklch(0.7 0.15 150)" }} />
                    </div>
                    <div className="text-center">
                      <p className="text-sm" style={{ color: "#3D374C" }}>All caught up!</p>
                      <p className="text-xs mt-0.5" style={{ color: "#736C83" }}>No pending alerts right now.</p>
                    </div>
                  </div>
                ) : (
                  <div className="divide-y" style={{ borderColor: "oklch(0.45 0.12 285 / 0.06)" }}>
                    {combinedAlerts.map((alert) => {
                      const isOrder = alert.alertType === 'order'
                      
                      return (
                        <div
                          key={alert.id}
                          className="group flex items-center gap-4 px-5 py-4 transition-colors hover:bg-[#EBE6F8]/50"
                        >
                          {/* Table number circle */}
                          <div
                            className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl text-white shrink-0 shadow-sm"
                            style={{
                              background: isOrder ? "oklch(0.45 0.12 285)" : "oklch(0.75 0.15 75)",
                              boxShadow: `0 4px 12px ${isOrder ? "oklch(0.45 0.12 285 / 0.3)" : "oklch(0.75 0.15 75 / 0.3)"}`,
                            }}
                          >
                            {alert.tableId}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-0.5">
                              <p className="text-sm font-bold" style={{ color: "#0D031B" }}>
                                Table {alert.tableId}
                              </p>
                              <span
                                className="inline-flex items-center gap-1 text-[9px] uppercase font-bold  px-2 py-0.5 rounded-full"
                                style={{
                                  background: isOrder ? "oklch(0.75 0.15 75 / 0.12)" : "oklch(0.45 0.12 285 / 0.12)",
                                  color: isOrder ? "oklch(0.75 0.15 75)" : "oklch(0.45 0.12 285)",
                                }}
                              >
                                {isOrder ? <Flame className="h-2.5 w-2.5" /> : <Bell className="h-2.5 w-2.5" />}
                                {isOrder ? "Ready" : "Assistance"}
                              </span>
                            </div>
                            <p className="text-xs truncate" style={{ color: "#736C83" }}>
                              {isOrder 
                                ? `${(alert as any).items.length} items · ${(alert as any).items[0].name}`
                                : "Customer is requesting assistance"
                              }
                            </p>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0">
                            <Button
                              size="sm"
                              className="h-8 px-3 text-[10px] uppercase  text-white hover:opacity-90 shadow-sm transition-all hover:-translate-y-0.5"
                              style={{ background: isOrder ? "oklch(0.45 0.12 285)" : "oklch(0.7 0.15 150)" }}
                              onClick={() => {
                                if (isOrder) {
                                  OrderService.updateOrderStatus(alert.id, "served")
                                } else {
                                  setDismissed((d) => [...d, alert.id])
                                }
                              }}
                            >
                              {isOrder ? "Serve" : "Resolve"}
                            </Button>

                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                              style={{ color: "#AEA6BF" }}
                              onClick={() => setDismissed((d) => [...d, alert.id])}
                            >
                              <X className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* My Tables Overview */}
            <Card
              className="overflow-hidden border-0 bg-white/80 backdrop-blur-xl shadow-2xl relative"
              style={{ 
                boxShadow: "0 10px 40px -10px oklch(0.45 0.12 285 / 0.15)",
                border: "1px solid oklch(0.45 0.12 285 / 0.08)" 
              }}
            >
              {/* Subtle accent line */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-oklch(0.45 0.12 285) to-oklch(0.55 0.15 275) opacity-40" />
              
              <CardHeader
                className="px-6 py-5"
                style={{ borderBottom: "1px solid oklch(0.45 0.12 285 / 0.05)" }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div
                      className="w-11 h-11 rounded-[14px] flex items-center justify-center shadow-inner"
                      style={{ 
                        background: "linear-gradient(135deg, oklch(0.45 0.12 285 / 0.1) 0%, oklch(0.45 0.12 285 / 0.05) 100%)",
                      }}
                    >
                      <UserCheck className="h-5 w-5" style={{ color: "oklch(0.45 0.12 285)" }} />
                    </div>
                    <div>
                      <CardTitle
                        className="text-[13px] font-bold uppercase tracking-[0.1em]"
                        style={{ color: "#0D031B" }}
                      >
                        My Service Floor
                      </CardTitle>
                      <p
                        className="text-[10px] font-semibold uppercase tracking-wider mt-1 opacity-60"
                        style={{ color: "#736C83" }}
                      >
                        8 ACTIVE SECTIONS
                      </p>
                    </div>
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-[10px] font-bold uppercase tracking-widest gap-2 hover:bg-black/5 transition-all h-9 px-4 rounded-xl"
                    style={{ color: "oklch(0.45 0.12 285)" }}
                    asChild
                  >
                    <Link href="/waiter/service-floor">
                      Map View <ChevronRight className="h-3.5 w-3.5" />
                    </Link>
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="p-5">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                  {activeOrders.length === 0 ? (
                    <div className="col-span-full py-12 text-center flex flex-col items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-black/5 flex items-center justify-center">
                        <UserCheck className="h-6 w-6 opacity-20" />
                      </div>
                      <p className="text-[11px] font-bold uppercase tracking-widest opacity-40">No active assignments</p>
                    </div>
                  ) : activeOrders.map((t) => {
                    const tableNum    = parseInt(t.tableId) || 0
                    const status      = t.status || "pending"
                    const imgSrc      = tableImages[tableNum % tableImages.length]
                    
                    // Status color logic (Professional palette)
                    const statusColors = {
                      pending:   { bg: "oklch(0.45 0.12 285)", text: "Violet", hex: "#6366f1" },
                      ready:     { bg: "oklch(0.7 0.15 150)",  text: "Ready",  hex: "#10b981" },
                      occupied:  { bg: "oklch(0.6 0.16 285)",  text: "Live",   hex: "#8b5cf6" },
                      served:    { bg: "oklch(0.45 0.12 285)", text: "Served", hex: "#6366f1" },
                      cancelled: { bg: "oklch(0.65 0.18 25)",  text: "Void",   hex: "#ef4444" },
                    }
                    const currentStatus = statusColors[status as keyof typeof statusColors] || statusColors.pending

                    return (
                      <HoverCard key={t.id} openDelay={200}>
                        <HoverCardTrigger asChild>
                          <div
                            className="group relative flex flex-col rounded-[22px] border-0 bg-white shadow-md transition-all duration-500 cursor-pointer hover:-translate-y-2 hover:shadow-2xl overflow-hidden"
                            style={{ 
                              boxShadow: "0 4px 20px -5px rgba(0,0,0,0.08)"
                            }}
                          >
                            {/* Image Header */}
                            <div className="relative h-24 w-full overflow-hidden shrink-0">
                              <img 
                                src={imgSrc} 
                                alt={`Table ${tableNum}`}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                              
                              {/* Glowing Status Dot */}
                              <div className="absolute top-3 left-3 flex items-center gap-2 px-2 py-1 rounded-full bg-black/30 backdrop-blur-md border border-white/10">
                                <div 
                                  className="w-1.5 h-1.5 rounded-full animate-pulse shadow-[0_0_8px_rgba(255,255,255,0.8)]" 
                                  style={{ background: "white" }}
                                />
                                <span className="text-[8px] font-black text-white uppercase tracking-[0.15em]">
                                  T-{tableNum}
                                </span>
                              </div>
                            </div>
                            
                            {/* Card Body */}
                            <div className="p-4 flex flex-col items-center justify-center bg-white relative">
                              <div className="absolute -top-6 w-12 h-12 rounded-2xl bg-white shadow-xl flex items-center justify-center border-4 border-[#F8F6FC] z-10">
                                <span className="text-xl font-black tabular-nums" style={{ color: "oklch(0.45 0.12 285)" }}>
                                  {tableNum}
                                </span>
                              </div>

                              <div className="mt-6 text-center space-y-1">
                                <p
                                  className="text-[10px] font-black uppercase tracking-[0.2em]"
                                  style={{ color: currentStatus.bg }}
                                >
                                  {status}
                                </p>
                                <div className="flex items-center justify-center gap-1 opacity-40">
                                  <Clock className="h-2.5 w-2.5" />
                                  <span className="text-[9px] font-bold uppercase tracking-wider">Live</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </HoverCardTrigger>
                        <HoverCardContent
                          className="w-64 p-0 border-0 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden"
                          sideOffset={15}
                        >
                          <div className="p-4 space-y-4">
                            <div className="flex items-center gap-3">
                              <div
                                className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-black text-white shadow-lg"
                                style={{ background: "oklch(0.45 0.12 285)" }}
                              >
                                {tableNum}
                              </div>
                              <div>
                                <p className="text-xs font-black uppercase tracking-wider" style={{ color: "#0D031B" }}>Table {tableNum}</p>
                                <p className="text-[10px] font-bold uppercase tracking-widest opacity-40">Section Alpha</p>
                              </div>
                            </div>
                            
                            <div className="space-y-2.5">
                              <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wide px-3 py-2 rounded-lg bg-black/5">
                                <span className="opacity-50">Order ID</span>
                                <span className="tabular-nums" style={{ color: "#3D374C" }}>{t.id.slice(-6)}</span>
                              </div>
                              <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wide px-3 py-2 rounded-lg bg-black/5">
                                <span className="opacity-50">Items</span>
                                <span style={{ color: "#3D374C" }}>{t.items.length} Units</span>
                              </div>
                              <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wide px-3 py-2 rounded-lg bg-black/5">
                                <span className="opacity-50">Status</span>
                                <Badge className="text-[8px] h-4 rounded-md capitalize border-0 shadow-none" style={{ background: currentStatus.bg, color: 'white' }}>
                                  {t.status}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </HoverCardContent>
                      </HoverCard>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

          </div>

          {/* ── RIGHT ──────────────────────────────────────────────────── */}
          <div className="space-y-5">

            {/* Quick Actions */}
            <Card
              className="overflow-hidden border bg-white/75 backdrop-blur-md shadow-sm"
              style={{ borderColor: "oklch(0.45 0.12 285 / 0.12)" }}
            >
              <CardHeader
                className="px-5 py-4"
                style={{ borderBottom: "1px solid oklch(0.45 0.12 285 / 0.08)" }}
              >
                <CardTitle
                  className="text-sm uppercase "
                  style={{ color: "#0D031B" }}
                >
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-2.5">
                {/* Primary CTA */}
                <Button
                  asChild
                  className="w-full h-14 gap-2.5 text-[11px] uppercase text-white hover:opacity-90 shadow-md transition-all hover:-translate-y-0.5"
                  style={{
                    background: "oklch(0.45 0.12 285)",
                    boxShadow: "0 4px 16px oklch(0.45 0.12 285 / 0.3)",
                  }}
                >
                  <Link href="/waiter/service-floor" className="flex items-center gap-2.5">
                    <ShoppingCart className="h-5 w-5" />
                    New Order
                  </Link>
                </Button>

                {/* Secondary actions grid */}
                <div className="grid grid-cols-3 gap-2">
                  {quickActions.slice(1).map((action) => {
                    const Icon = action.icon
                    return (
                      <Button
                        key={action.href}
                        asChild
                        variant="outline"
                        className="h-16 flex-col gap-1.5 text-[9px] uppercase transition-all hover:-translate-y-0.5 hover:bg-[#EBE6F8]"
                        style={{
                          borderColor: "oklch(0.45 0.12 285 / 0.2)",
                          background: "#EBE6F8/50",
                          color: "#3D374C",
                        }}
                      >
                        <Link href={action.href} className="flex flex-col items-center gap-1.5">
                          <Icon className="h-4 w-4" style={{ color: "oklch(0.45 0.12 285)" }} />
                          {action.label}
                        </Link>
                      </Button>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Shift Progress */}
            <Card
              className="overflow-hidden border bg-white/75 backdrop-blur-md shadow-sm"
              style={{ borderColor: "oklch(0.45 0.12 285 / 0.12)" }}
            >
              <CardHeader
                className="px-5 py-4"
                style={{ borderBottom: "1px solid oklch(0.45 0.12 285 / 0.08)" }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center"
                    style={{ background: "oklch(0.45 0.12 285 / 0.1)" }}
                  >
                    <Crown className="h-4 w-4" style={{ color: "oklch(0.45 0.12 285)" }} />
                  </div>
                  <div>
                    <CardTitle
                      className="text-sm uppercase "
                      style={{ color: "#0D031B" }}
                    >
                      Shift Progress
                    </CardTitle>
                    <p className="text-[10px] uppercase font-medium" style={{ color: "#736C83" }}>
                      14 covers to target
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-5 space-y-5">
                {/* Big numbers */}
                <div className="flex items-end justify-between">
                  <div>
                    <p
                      className="text-[2.5rem] leading-none "
                      style={{ color: "#0D031B" }}
                    >
                      75%
                    </p>
                    <p
                      className="text-[10px] uppercase  mt-1"
                      style={{ color: "#736C83" }}
                    >
                      Daily Target
                    </p>
                  </div>
                  <div className="text-right">
                    <p
                      className="text-3xl leading-none"
                      style={{ color: "oklch(0.45 0.12 285)" }}
                    >
                      42
                    </p>
                    <p
                      className="text-[10px] uppercase  mt-1"
                      style={{ color: "#736C83" }}
                    >
                      Covers Served
                    </p>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="space-y-2">
                  <Progress
                    value={75}
                    className="h-2.5 rounded-full"
                    style={{ background: "oklch(0.45 0.12 285 / 0.12)" }}
                  />
                  <p className="text-[10px]" style={{ color: "#736C83" }}>
                    Excellent pace · 14 covers to hit your target of 56
                  </p>
                </div>

                <Separator style={{ background: "oklch(0.45 0.12 285 / 0.1)" }} />

                {/* Mini metrics */}
                <div className="grid grid-cols-3 gap-2.5 text-center">
                  {[
                    { value: "4.8",     label: "Rating",    color: "oklch(0.7 0.15 150)"  },
                    { value: "3.5m",    label: "Avg Time",  color: "oklch(0.45 0.12 285)" },
                    { value: "KES 850", label: "Avg Bill",  color: "oklch(0.75 0.15 75)"  },
                  ].map((m) => (
                    <div
                      key={m.label}
                      className="rounded-xl p-3"
                      style={{ background: "#EBE6F8/70", border: "1px solid oklch(0.45 0.12 285 / 0.08)" }}
                    >
                      <p
                        className="text-sm tabular-nums"
                        style={{ color: m.color }}
                      >
                        {m.value}
                      </p>
                      <p
                        className="text-[9px] uppercase  mt-0.5"
                        style={{ color: "#736C83" }}
                      >
                        {m.label}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card
              className="overflow-hidden border bg-white/75 backdrop-blur-md shadow-sm"
              style={{ borderColor: "oklch(0.45 0.12 285 / 0.12)" }}
            >
              <CardHeader
                className="px-5 py-4"
                style={{ borderBottom: "1px solid oklch(0.45 0.12 285 / 0.08)" }}
              >
                <CardTitle
                  className="text-sm uppercase "
                  style={{ color: "#0D031B" }}
                >
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <ScrollArea className="h-[220px]">
                <CardContent className="p-0">
                  <div className="divide-y" style={{ borderColor: "oklch(0.45 0.12 285 / 0.06)" }}>
                    {recentActivity.map((item, i) => {
                      const Icon = item.icon
                      return (
                        <div
                          key={i}
                          className="flex items-center gap-3 px-5 py-3.5 transition-colors hover:bg-[#EBE6F8]/50 cursor-pointer group"
                        >
                          {/* Icon */}
                          <div
                            className={cn("w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-105", item.bg)}
                          >
                            <Icon className={cn("h-3.5 w-3.5", item.color)} />
                          </div>

                          <div className="flex-1 min-w-0">
                            <p
                              className="text-xs truncate"
                              style={{ color: "#3D374C" }}
                            >
                              {item.text}
                            </p>
                            <p className="text-[10px] mt-0.5" style={{ color: "#AEA6BF" }}>
                              {item.sub}
                            </p>
                          </div>

                          <ArrowRight
                            className="h-3.5 w-3.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                            style={{ color: "oklch(0.45 0.12 285)" }}
                          />
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </ScrollArea>
            </Card>

          </div>
        </div>
      </div>
    </TooltipProvider>
  )
}