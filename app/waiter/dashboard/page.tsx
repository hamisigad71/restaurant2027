"use client"

import { useState, useEffect, useRef } from "react"
import { supabase } from "@/lib/supabase"
import { toast } from "sonner"
import Link from "next/link"
import {
  BellIcon,
  ShoppingCartIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  ArrowTrendingUpIcon,
  CheckBadgeIcon,
  ArrowRightIcon as ArrowRight,
  ChevronRightIcon,
  BoltIcon as Crown,
  FireIcon,
  HomeIcon,
  BuildingStorefrontIcon,
  ChartBarIcon,
  XMarkIcon,
  BoltIcon,
  PlusIcon,
  CameraIcon,
} from "@heroicons/react/24/outline"
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
  { icon: CheckCircleIcon,    color: "text-[oklch(0.7_0.15_150)]",  bg: "bg-[oklch(0.7_0.15_150)]/10",  text: "Table 6 payment processed",   sub: "KES 2,100 · 4m ago",  dot: "oklch(0.7 0.15 150)" },
  { icon: "/shopping-cart.png" as any,    color: "text-[#3F3D8F]", bg: "bg-[#3F3D8F]/10", text: "New order placed — Table 3",   sub: "6 items · 8m ago",    dot: "#3F3D8F" },
  { icon: ExclamationCircleIcon,     color: "text-[oklch(0.75_0.15_75)]",  bg: "bg-[oklch(0.75_0.15_75)]/10",  text: "Table 9 — guests arrived",     sub: "Reserved · 12m ago",  dot: "oklch(0.75 0.15 75)" },
  { icon: BuildingStorefrontIcon, color: "text-[oklch(0.45_0.12_285)]", bg: "bg-[oklch(0.45_0.12_285)]/10", text: "Table 2 order updated",        sub: "+2 items · 18m ago",  dot: "#3F3D8F" },
]

const quickActions = [
  { href: "/waiter/service-floor",   icon: "/service-floor-nav.png", label: "New Order",      primary: true  },
  { href: "/waiter/service-floor",   icon: "/service-floor-nav.png", label: "Floor Plan",     primary: false },
  { href: "/waiter/order-tracking",  icon: "/order-tracking-nav.png",       label: "Order Status",   primary: false },
  { href: "/waiter/checkout",        icon: "/checkout-nav.png", label: "Settlements",    primary: false },
]

// ─── Sub-components ──────────────────────────────────────────────────────────

function StatCard({
  icon: Icon,
  value,
  label,
  accentColor,
  badge,
}: {
  icon: React.ComponentType<{ className?: string; color?: string; style?: React.CSSProperties }> | string
  value: string
  label: string
  accentColor: string
  badge?: string
}) {
  return (
    <Card
      className="relative overflow-hidden border-0 bg-white shadow-md hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group rounded-[22px]"
      style={{ 
        boxShadow: "0 10px 30px -10px rgba(0,0,0,0.08)",
      }}
    >
      {/* Subtle background glow */}
      <div 
        className="absolute -right-4 -top-4 w-24 h-24 rounded-full opacity-0 group-hover:opacity-10 transition-opacity duration-700 blur-2xl"
        style={{ background: accentColor }}
      />

      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div
            className="flex items-center justify-center w-12 h-12 rounded-[14px] shadow-inner transition-all duration-500 group-hover:scale-110 group-hover:rotate-3"
            style={{ 
              background: `linear-gradient(135deg, color-mix(in oklch, ${accentColor} 15%, transparent) 0%, color-mix(in oklch, ${accentColor} 5%, transparent) 100%)`,
            }}
          >
            {typeof Icon === 'string' ? (
              <div 
                className="h-8 w-8" 
                style={{ 
                  backgroundColor: accentColor,
                  maskImage: `url(${Icon})`,
                  maskSize: 'contain',
                  maskRepeat: 'no-repeat',
                  maskPosition: 'center',
                  WebkitMaskImage: `url(${Icon})`,
                  WebkitMaskSize: 'contain',
                  WebkitMaskRepeat: 'no-repeat',
                  WebkitMaskPosition: 'center'
                }} 
              />
            ) : (
              <Icon className="h-8 w-8" style={{ color: accentColor }} />
            )}
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
              <BoltIcon className="h-2.5 w-2.5 mr-1" />
              {badge}
            </Badge>
          )}
        </div>
        <div className="space-y-1">
          <p
            className="text-3xl lg:text-[2.2rem] leading-none"
            style={{ color: "#0D031B" }}
          >
            {value}
          </p>
          <p
            className="text-[10px] uppercase opacity-50"
            style={{ color: "#736C83" }}
          >
            {label}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function WaiterDashboard() {
  const [orders, setOrders] = useState<LiveOrder[]>([])
  const [customerCalls, setCustomerCalls] = useState<{ id: string; tableId: string; createdAt: string }[]>([])
  const [dismissed, setDismissed] = useState<string[]>([])
  const [avatarImage, setAvatarImage] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setAvatarImage(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const triggerUpload = () => {
    fileInputRef.current?.click()
  }

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

        {/* ── Professional Command Header ────────────────────────────────── */}
        <div className="flex flex-col items-start justify-between gap-4 py-4 px-3">
          <div className="flex flex-row items-center gap-4 w-full">
            {/* Premium Avatar with Depth and Upload Capability */}
            <div className="relative group cursor-pointer shrink-0" onClick={triggerUpload}>
              <div className="absolute inset-0 bg-[#3F3D8F] blur-3xl opacity-20 group-hover:opacity-30 transition-opacity duration-700" />
              <div className="relative h-20 w-20 sm:h-32 sm:w-32 rounded-3xl sm:rounded-[42px] p-1 bg-gradient-to-tr from-[#3F3D8F] via-white to-oklch(0.45 0.12 285 / 0.1) shadow-2xl transition-transform duration-500 group-hover:scale-105">
                <Avatar className="h-full w-full rounded-[20px] sm:rounded-[36px] border-0 overflow-hidden shadow-inner bg-white">
                  {avatarImage ? (
                    <img src={avatarImage} alt="User" className="h-full w-full object-cover" />
                  ) : (
                    <AvatarFallback 
                      className="text-sm sm:text-2xl font-medium text-white"
                      style={{ background: "linear-gradient(135deg, #3F3D8F 0%, oklch(0.35 0.15 275) 100%)" }}
                    >
                      WA
                    </AvatarFallback>
                  )}
                </Avatar>
                
                {/* Edit Overlay */}
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-[20px] sm:rounded-[36px] m-1">
                  <CameraIcon className="h-4 w-4 sm:h-9 sm:w-9 text-white" />
                </div>
              </div>

              {/* Hidden File Input */}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/*"
                className="hidden"
              />

            </div>

            <div className="flex flex-col items-start text-left">
              <div className="flex flex-col gap-1">
                <h1 className="text-xl sm:text-4xl text-[#0D031B] font-light">
                  Welcome back, <span className="font-medium" style={{ color: "#3F3D8F" }}>Waiter</span>
                </h1>
                <div className="flex items-center gap-2">
                  <Badge 
                    variant="outline" 
                    className="h-5 px-2 rounded-full border-[#10B981]/20 bg-[#10B981]/5 text-[#10B981] text-[8px] uppercase"
                  >
                    <span className="relative flex h-1.5 w-1.5 mr-1.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10B981] opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#10B981]"></span>
                    </span>
                    Shift Active
                  </Badge>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <p className="text-[10px] uppercase text-[#736C83] opacity-50">
                  {new Date().toLocaleDateString("en-KE", { weekday: "short", day: "numeric", month: "short" })}
                </p>
                <div className="h-1 w-1 rounded-full bg-[#736C83] opacity-20" />
                <p className="text-[10px] uppercase text-[#736C83] opacity-50">
                  Alpha Station
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="h-12 w-12 sm:h-14 sm:w-14 rounded-xl sm:rounded-2xl border-0 bg-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 group"
                >
                  <ChartBarIcon className="h-4.5 w-4.5 sm:h-5 sm:w-5 text-oklch(0.45 0.12 285 / 0.6) group-hover:text-[#3F3D8F] transition-colors" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Performance Insights</TooltipContent>
            </Tooltip>

            <Button
              asChild
              className="h-12 sm:h-14 px-5 sm:px-8 rounded-xl sm:rounded-2xl gap-3 sm:gap-4 text-[10px] sm:text-[11px] uppercase text-white border-0 shadow-2xl transition-all duration-500 hover:-translate-y-2 active:translate-y-0 group overflow-hidden relative"
              style={{
                background: "linear-gradient(135deg, #3F3D8F 0%, oklch(0.35 0.15 275) 100%)",
              }}
            >
              <Link href="/waiter/service-floor">
                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="h-7 w-7 rounded-lg bg-white/20 flex items-center justify-center backdrop-blur-md transition-transform group-hover:rotate-12">
                  <PlusIcon className="h-4 w-4 text-white" />
                </div>
                <span>New Order Ticket</span>
              </Link>
            </Button>
          </div>
        </div>

        {/* ── Stat Row ─────────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
          <StatCard
            icon="/rebell.png"
            value={combinedAlerts.length.toString()}
            label="Service Alerts"
            accentColor="oklch(0.75 0.15 75)"
            badge={combinedAlerts.length > 0 ? "Action" : undefined}
          />
          <StatCard
            icon="/shopping-cart.png"
            value={activeTablesCount.toString()}
            label="Active Tables"
            accentColor="#3F3D8F"
          />
          <StatCard
            icon={ArrowTrendingUpIcon}
            value="KES 4,250"
            label="Today's Sales"
            accentColor="oklch(0.7 0.15 150)"
          />
          <StatCard
            icon="/time.png"
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
              className="overflow-hidden border-0 bg-white/80 backdrop-blur-xl shadow-2xl relative"
              style={{ 
                boxShadow: "0 10px 40px -10px oklch(0.45 0.12 285 / 0.1)",
                border: "1px solid oklch(0.45 0.12 285 / 0.08)" 
              }}
            >
              <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-oklch(0.75 0.15 75) to-transparent opacity-40" />
              
              <CardHeader
                className="px-6 py-5"
                style={{ borderBottom: "1px solid oklch(0.45 0.12 285 / 0.05)" }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div
                      className="w-11 h-11 rounded-[14px] flex items-center justify-center shadow-inner"
                      style={{ background: "oklch(0.75 0.15 75 / 0.1)" }}
                    >
                      <div 
                        className="h-5 w-5" 
                        style={{ 
                          backgroundColor: "oklch(0.75 0.15 75)",
                          maskImage: 'url(/rebell.png)',
                          maskSize: 'contain',
                          maskRepeat: 'no-repeat',
                          maskPosition: 'center',
                          WebkitMaskImage: 'url(/rebell.png)',
                          WebkitMaskSize: 'contain',
                          WebkitMaskRepeat: 'no-repeat',
                          WebkitMaskPosition: 'center'
                        }} 
                      />
                    </div>
                    <div>
                      <CardTitle
                        className="text-[13px] uppercase"
                        style={{ color: "#0D031B" }}
                      >
                        Service Alerts
                      </CardTitle>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="w-1 h-1 rounded-full bg-oklch(0.75 0.15 75)" />
                        <p
                          className="text-[10px] uppercase opacity-60"
                          style={{ color: "#736C83" }}
                        >
                          Kitchen ready · Pick up now
                        </p>
                      </div>
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
                    <FireIcon className="h-2.5 w-2.5 animate-pulse" />
                    Live
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="p-0">
                {combinedAlerts.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 gap-5">
                    <div className="relative">
                      <div className="absolute inset-0 bg-oklch(0.7 0.15 150) blur-2xl opacity-20 animate-pulse" />
                      <div
                        className="relative w-20 h-20 rounded-[28px] flex items-center justify-center border-4 border-white shadow-xl"
                        style={{ background: "linear-gradient(135deg, oklch(0.7 0.15 150 / 0.1) 0%, oklch(0.7 0.15 150 / 0.05) 100%)" }}
                      >
                        <CheckCircleIcon className="h-10 w-10" style={{ color: "oklch(0.7 0.15 150)" }} />
                      </div>
                    </div>
                    <div className="text-center space-y-1">
                      <p className="text-sm uppercase" style={{ color: "#0D031B" }}>All caught up!</p>
                      <p className="text-[10px] uppercase opacity-40" style={{ color: "#736C83" }}>No pending alerts right now</p>
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
                              background: isOrder ? "#3F3D8F" : "oklch(0.75 0.15 75)",
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
                                  color: isOrder ? "oklch(0.75 0.15 75)" : "#3F3D8F",
                                }}
                              >
                                {isOrder ? <FireIcon className="h-2.5 w-2.5" /> : (
                                  <div 
                                    className="h-2.5 w-2.5" 
                                    style={{ 
                                      backgroundColor: "oklch(0.45 0.12 285)",
                                      maskImage: 'url(/rebell.png)',
                                      maskSize: 'contain',
                                      maskRepeat: 'no-repeat',
                                      maskPosition: 'center',
                                      WebkitMaskImage: 'url(/rebell.png)',
                                      WebkitMaskSize: 'contain',
                                      WebkitMaskRepeat: 'no-repeat',
                                      WebkitMaskPosition: 'center'
                                    }} 
                                  />
                                )}
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
                              style={{ background: isOrder ? "#3F3D8F" : "oklch(0.7 0.15 150)" }}
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
                              <XMarkIcon className="h-3.5 w-3.5" />
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
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#3F3D8F] to-oklch(0.55 0.15 275) opacity-40" />
              
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
                      <CheckBadgeIcon className="h-5 w-5" style={{ color: "#3F3D8F" }} />
                    </div>
                    <div>
                      <CardTitle
                        className="text-[13px] font-bold uppercase"
                        style={{ color: "#0D031B" }}
                      >
                        My Service Floor
                      </CardTitle>
                      <p
                        className="text-[10px] font-semibold uppercase mt-1 opacity-60"
                        style={{ color: "#736C83" }}
                      >
                        8 ACTIVE SECTIONS
                      </p>
                    </div>
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-[10px] font-bold uppercase gap-2 hover:bg-black/5 transition-all h-9 px-4 rounded-xl"
                    style={{ color: "#3F3D8F" }}
                    asChild
                  >
                    <Link href="/waiter/service-floor">
                      Map View <ChevronRightIcon className="h-3.5 w-3.5" />
                    </Link>
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="p-5">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                  {activeOrders.length === 0 ? (
                    <div className="col-span-full py-12 text-center flex flex-col items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-black/5 flex items-center justify-center">
                        <CheckBadgeIcon className="h-6 w-6 opacity-20" />
                      </div>
                      <p className="text-[11px] font-bold uppercase opacity-40">No active assignments</p>
                    </div>
                  ) : activeOrders.map((t) => {
                    const tableNum    = parseInt(t.tableId) || 0
                    const status      = t.status || "pending"
                    const imgSrc      = tableImages[tableNum % tableImages.length]
                    
                    // Status color logic (Professional palette)
                    const statusColors = {
                      pending:   { bg: "#3F3D8F", text: "Violet", hex: "#6366f1" },
                      ready:     { bg: "oklch(0.7 0.15 150)",  text: "Ready",  hex: "#10b981" },
                      occupied:  { bg: "oklch(0.6 0.16 285)",  text: "Live",   hex: "#8b5cf6" },
                      served:    { bg: "#3F3D8F", text: "Served", hex: "#6366f1" },
                      cancelled: { bg: "oklch(0.65 0.18 25)",  text: "Void",   hex: "#ef4444" },
                    }
                    const currentStatus = statusColors[status as keyof typeof statusColors] || statusColors.pending

                    return (
                      <HoverCard key={t.id} openDelay={200}>
                        <HoverCardTrigger asChild>
                          <div
                            className="group relative flex flex-col rounded-[22px] border-0 bg-white shadow-md transition-all duration-500 cursor-pointer hover:-translate-y-2 hover:shadow-2xl overflow-hidden"
                            style={{ 
                              boxShadow: "0 10px 25px -5px rgba(0,0,0,0.05)"
                            }}
                          >
                            {/* Image Header with sophisticated overlay */}
                            <div className="relative h-28 w-full overflow-hidden shrink-0">
                              <img 
                                src={imgSrc} 
                                alt={`Table ${tableNum}`}
                                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                              
                              {/* Glowing Status Dot */}
                              <div className="absolute top-3 left-3 flex items-center gap-2 px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/10">
                                <div 
                                  className="w-1.5 h-1.5 rounded-full animate-pulse shadow-[0_0_10px_rgba(255,255,255,1)]" 
                                  style={{ background: currentStatus.hex }}
                                />
                                <span className="text-[9px] text-white uppercase">
                                  SEC-A
                                </span>
                              </div>

                              {/* Capacity Badge */}
                              <div className="absolute bottom-3 right-3 flex items-center gap-1.5 px-2 py-1 rounded-lg bg-white/10 backdrop-blur-md border border-white/5">
                                <Crown className="h-3 w-3 text-white/60" />
                                <span className="text-[10px] text-white">4</span>
                              </div>
                            </div>
                            
                            {/* Card Body with floating table number */}
                            <div className="p-4 pt-8 flex flex-col items-center justify-center bg-white relative">
                              <div 
                                className="absolute -top-7 w-14 h-14 rounded-2xl bg-white shadow-2xl flex items-center justify-center border-[5px] border-[#EBE6F8] transition-all duration-500 group-hover:scale-110 group-hover:-rotate-3"
                                style={{ zIndex: 10 }}
                              >
                                <span className="text-2xl tabular-nums" style={{ color: "#3F3D8F" }}>
                                  {tableNum}
                                </span>
                              </div>

                              <div className="text-center space-y-1.5">
                                <p
                                  className="text-[11px] uppercase"
                                  style={{ color: currentStatus.bg }}
                                >
                                  {status}
                                </p>
                                <div className="flex items-center justify-center gap-2">
                                  <div className="w-1 h-1 rounded-full bg-slate-300" />
                                  <span className="text-[9px] uppercase text-slate-400">18 min elapsed</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </HoverCardTrigger>
                        <HoverCardContent
                          className="w-72 p-0 border-0 bg-white/95 backdrop-blur-2xl rounded-[28px] shadow-2xl overflow-hidden"
                          sideOffset={15}
                        >
                          <div className="p-6 space-y-5">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4">
                                <div
                                  className="w-12 h-12 rounded-2xl flex items-center justify-center text-lg font-black text-white shadow-2xl rotate-3"
                                  style={{ background: "linear-gradient(135deg, #3F3D8F 0%, oklch(0.35 0.15 275) 100%)" }}
                                >
                                  {tableNum}
                                </div>
                                <div className="space-y-0.5">
                                  <p className="text-sm uppercase" style={{ color: "#0D031B" }}>Table {tableNum}</p>
                                  <div className="flex items-center gap-1.5">
                                    <div className="w-1.5 h-1.5 rounded-full" style={{ background: currentStatus.hex }} />
                                    <p className="text-[10px] uppercase opacity-40">Section Alpha</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-3">
                              <div className="p-3 rounded-[18px] bg-black/5 space-y-1">
                                <span className="text-[9px] uppercase opacity-40">Order ID</span>
                                <p className="text-xs tabular-nums" style={{ color: "#0D031B" }}>#{t.id.slice(-6).toUpperCase()}</p>
                              </div>
                              <div className="p-3 rounded-[18px] bg-black/5 space-y-1">
                                <span className="text-[9px] uppercase opacity-40">Active Items</span>
                                <p className="text-xs" style={{ color: "#0D031B" }}>{t.items.length} Units</p>
                              </div>
                            </div>

                            <Button 
                              className="w-full h-11 rounded-xl text-[10px] uppercase gap-2 text-white border-0"
                              style={{ background: "#3F3D8F" }}
                            >
                              Manage Table <ArrowRight className="h-3.5 w-3.5" />
                            </Button>
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
                {/* Primary CTA with rich gradient */}
                <Button
                  asChild
                  className="w-full h-14 rounded-2xl gap-3 text-[11px] uppercase text-white border-0 shadow-xl transition-all duration-300 hover:-translate-y-1 active:translate-y-0 active:scale-95"
                  style={{
                    background: "linear-gradient(135deg, #3F3D8F 0%, oklch(0.35 0.15 275) 100%)",
                    boxShadow: "0 8px 25px -5px oklch(0.45 0.12 285 / 0.4)",
                  }}
                >
                  <Link href="/waiter/service-floor" className="flex items-center justify-center">
                    <img 
                      src="/service-floor-nav.png" 
                      className="h-5 w-5 brightness-0 invert object-contain" 
                      alt="New Order" 
                    />
                    <span className="ml-1">Initiate New Order</span>
                  </Link>
                </Button>

                {/* Secondary actions grid */}
                <div className="grid grid-cols-3 gap-2.5">
                  {[
                    { href: "/waiter/service-floor", label: "Floor Plan", icon: "/service-floor-nav.png" },
                    { href: "/waiter/order-tracking", label: "Tracker", icon: "/order-tracking-nav.png" },
                    { href: "/waiter/checkout", label: "Cashier", icon: "/checkout-nav.png" },
                  ].map((action) => (
                    <Button
                      key={action.href}
                      asChild
                      variant="ghost"
                      className="h-20 flex-col gap-2 text-[9px] uppercase transition-all duration-300 hover:bg-[#EBE6F8] hover:shadow-lg rounded-2xl border"
                      style={{
                        borderColor: "oklch(0.45 0.12 285 / 0.1)",
                        background: "rgba(235, 230, 248, 0.4)",
                        color: "#3D374C",
                      }}
                    >
                      <Link href={action.href} className="flex flex-col items-center justify-center">
                        <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-white shadow-sm border border-black/5 group-hover:scale-110 transition-transform">
                          <img 
                            src={action.icon} 
                            className="h-4 w-4 object-contain" 
                            alt={action.label} 
                            style={{ filter: "invert(31%) sepia(68%) saturate(1116%) hue-rotate(221deg) brightness(91%) contrast(89%)" }} 
                          />
                        </div>
                        {action.label}
                      </Link>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Shift Progress */}
            <Card
              className="overflow-hidden border-0 bg-white shadow-xl rounded-[28px] relative"
              style={{ border: "1px solid oklch(0.45 0.12 285 / 0.08)" }}
            >
              <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-[#3F3D8F] to-transparent opacity-40" />
              
              <CardHeader className="px-6 py-5" style={{ borderBottom: "1px solid oklch(0.45 0.12 285 / 0.05)" }}>
                <div className="flex items-center gap-4">
                  <div
                    className="w-11 h-11 rounded-[14px] flex items-center justify-center shadow-inner"
                    style={{ background: "oklch(0.45 0.12 285 / 0.1)" }}
                  >
                    <div
                        className="h-5 w-5"
                        style={{
                          backgroundColor: "#3F3D8F",
                          maskImage: "url(/shift.png)",
                          maskSize: "contain",
                          maskRepeat: "no-repeat",
                          maskPosition: "center",
                          WebkitMaskImage: "url(/shift.png)",
                          WebkitMaskSize: "contain",
                          WebkitMaskRepeat: "no-repeat",
                          WebkitMaskPosition: "center",
                        }}
                      />
                  </div>
                  <div>
                    <CardTitle className="text-[13px] uppercase" style={{ color: "#0D031B" }}>
                      Shift Progress
                    </CardTitle>
                    <p className="text-[10px] uppercase mt-1 opacity-60" style={{ color: "#736C83" }}>
                      14 COVERS TO TARGET
                    </p>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-6 space-y-6">
                <div className="flex items-end justify-between px-2">
                  <div className="space-y-1">
                    <p className="text-[2.8rem] leading-none" style={{ color: "#0D031B" }}>
                      75%
                    </p>
                    <p className="text-[10px] uppercase opacity-40" style={{ color: "#736C83" }}>
                      Quota Met
                    </p>
                  </div>
                  <div className="text-right space-y-1">
                    <p className="text-3xl tabular-nums" style={{ color: "#3F3D8F" }}>
                      42
                    </p>
                    <p className="text-[10px] uppercase opacity-40" style={{ color: "#736C83" }}>
                      Served Today
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden p-0.5 shadow-inner">
                    <div 
                      className="h-full rounded-full transition-all duration-1000 shadow-[0_0_10px_oklch(0.45_0.12_285_/_0.3)]"
                      style={{ 
                        width: "75%",
                        background: "linear-gradient(90deg, #3F3D8F 0%, oklch(0.55 0.15 275) 100%)" 
                      }}
                    />
                  </div>
                  <div className="flex items-center gap-2 px-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-oklch(0.7 0.15 150) animate-pulse" />
                    <p className="text-[10px] uppercase text-slate-500">
                      Excellent pace <span className="opacity-40">· 14 to hit daily target of 56</span>
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  {[
                    { value: "4.8",     label: "Rating",    color: "oklch(0.7 0.15 150)", bg: "oklch(0.7 0.15 150 / 0.08)" },
                    { value: "3.5m",    label: "Wait",      color: "#3F3D8F", bg: "oklch(0.45 0.12 285 / 0.08)" },
                    { value: "KES 850", label: "PPC",       color: "oklch(0.75 0.15 75)", bg: "oklch(0.75 0.15 75 / 0.08)" },
                  ].map((m) => (
                    <div
                      key={m.label}
                      className="rounded-2xl p-4 transition-all hover:scale-105 border flex flex-col items-center justify-center gap-1"
                      style={{ 
                        background: m.bg,
                        borderColor: "oklch(0.45 0.12 285 / 0.05)"
                      }}
                    >
                      <p className="text-sm tabular-nums" style={{ color: m.color }}>{m.value}</p>
                      <p className="text-[8px] uppercase opacity-40">{m.label}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card
              className="overflow-hidden border-0 bg-white/70 backdrop-blur-xl shadow-2xl relative"
              style={{ 
                boxShadow: "0 10px 40px -10px oklch(0.45 0.12 285 / 0.1)",
                border: "1px solid oklch(0.45 0.12 285 / 0.08)" 
              }}
            >
              <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-oklch(0.45 0.12 285 / 0.4) to-transparent opacity-20" />
              
              <CardHeader
                className="px-6 py-5"
                style={{ borderBottom: "1px solid oklch(0.45 0.12 285 / 0.05)" }}
              >
                <CardTitle
                  className="text-[13px] uppercase"
                  style={{ color: "#0D031B" }}
                >
                  Activity Stream
                </CardTitle>
              </CardHeader>
              <ScrollArea className="h-[260px]">
                <CardContent className="p-0">
                  <div className="divide-y" style={{ borderColor: "oklch(0.45 0.12 285 / 0.05)" }}>
                    {recentActivity.map((item, i) => {
                      const Icon = item.icon
                      return (
                        <div
                          key={i}
                          className="flex items-center gap-4 px-6 py-4 transition-all duration-300 hover:bg-white cursor-pointer group"
                        >
                          {/* Icon Container */}
                          <div
                            className={cn("w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 transition-all duration-500 group-hover:scale-110 shadow-sm", item.bg)}
                          >
                            {typeof Icon === 'string' ? (
                              <div 
                                className="h-4.5 w-4.5" 
                                style={{ 
                                  backgroundColor: item.dot, // Use the dot color which is the hex/oklch string
                                  maskImage: `url(${Icon})`,
                                  maskSize: 'contain',
                                  maskRepeat: 'no-repeat',
                                  maskPosition: 'center',
                                  WebkitMaskImage: `url(${Icon})`,
                                  WebkitMaskSize: 'contain',
                                  WebkitMaskRepeat: 'no-repeat',
                                  WebkitMaskPosition: 'center'
                                }} 
                              />
                            ) : (
                              <Icon className={cn("h-4.5 w-4.5", item.color)} />
                            )}
                          </div>
 
                          <div className="flex-1 min-w-0">
                            <p
                              className="text-[13px] truncate transition-colors group-hover:text-[#3F3D8F]"
                              style={{ color: "#3D374C" }}
                            >
                              {item.text}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                               <div className="w-1 h-1 rounded-full bg-slate-300" />
                               <p className="text-[10px] uppercase opacity-40" style={{ color: "#736C83" }}>
                                  {item.sub}
                               </p>
                            </div>
                          </div>
 
                          <ArrowRight
                            className="h-4 w-4 shrink-0 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300"
                            style={{ color: "#3F3D8F" }}
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