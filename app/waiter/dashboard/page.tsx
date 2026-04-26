"use client"

import { useState, useEffect, useRef } from "react"
import { supabase } from "@/lib/supabase"
import { toast } from "sonner"
import Link from "next/link"
import {
  BellIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  ArrowTrendingUpIcon,
  CheckBadgeIcon,
  ArrowRightIcon as ArrowRight,
  ChevronRightIcon,
  BoltIcon as Crown,
  FireIcon,
  BuildingStorefrontIcon,
  XMarkIcon,
  BoltIcon,
  PlusIcon,
  CameraIcon,
  ClipboardDocumentListIcon,
  CalendarDaysIcon,
  ChartBarIcon,
  EllipsisHorizontalIcon,
} from "@heroicons/react/24/outline"
import { Badge }   from "@/components/ui/badge"
import { Button }  from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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

const sparklinePoints = "M0,40 C10,38 20,32 30,28 C40,24 50,30 60,26 C70,22 80,18 90,16 C100,14 110,20 120,15 C130,10 140,8 150,5"

const recentActivity = [
  { icon: CheckCircleIcon,        color: "text-emerald-400", bg: "bg-emerald-500/10",  text: "Table 6 payment processed",  sub: "KES 2,100 · 4m ago",  dot: "#10b981" },
  { icon: "/shopping-cart.png" as any, color: "text-violet-400", bg: "bg-violet-500/10", text: "New order placed — Table 3",  sub: "6 items · 8m ago",   dot: "#7C3AED" },
  { icon: ExclamationCircleIcon,  color: "text-amber-400",   bg: "bg-amber-500/10",    text: "Table 9 — guests arrived",   sub: "Reserved · 12m ago", dot: "#f59e0b" },
  { icon: BuildingStorefrontIcon, color: "text-violet-400",   bg: "bg-violet-500/10",  text: "Table 2 order updated",      sub: "+2 items · 18m ago", dot: "#7C3AED" },
]

// ─── Mini Sparkline SVG ───────────────────────────────────────────────────────
function Sparkline() {
  return (
    <svg viewBox="0 0 150 50" className="w-full h-10" preserveAspectRatio="none">
      <defs>
        <linearGradient id="sparkGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#7C3AED" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#7C3AED" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={`${sparklinePoints} L150,50 L0,50 Z`} fill="url(#sparkGrad)" />
      <path d={sparklinePoints} fill="none" stroke="#7C3AED" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

// ─── Section Header ───────────────────────────────────────────────────────────
function SectionHeader({
  icon,
  iconBg = "bg-violet-500/15",
  accentColor = "#7C3AED",
  title,
  subtitle,
  badge,
  action,
}: {
  icon: React.ReactNode
  iconBg?: string
  accentColor?: string
  title: string
  subtitle: string
  badge?: React.ReactNode
  action?: React.ReactNode
}) {
  return (
    <div
      className="px-6 py-4 flex items-center justify-between"
      style={{ borderBottom: "1px solid rgba(63, 61, 143, 0.05)" }}
    >
      <div className="flex items-center gap-3.5">
        <div className={cn("w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-sm", iconBg)}>
          {icon}
        </div>
        <div>
          <p className="text-[12px] tracking-widest uppercase font-bold text-[#0D031B]">{title}</p>
          <p className="text-[10px] tracking-wider uppercase text-[#736C83] mt-0.5">{subtitle}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        {badge}
        {action}
      </div>
    </div>
  )
}

// ─── Glass Card wrapper ───────────────────────────────────────────────────────
function GlassCard({
  children,
  className,
  accentColor,
}: {
  children: React.ReactNode
  className?: string
  accentColor?: string
}) {
  return (
    <div
      className={cn("overflow-hidden rounded-[20px] relative transition-all duration-300", className)}
      style={{
        background: "white",
        border: "1px solid rgba(63, 61, 143, 0.08)",
        boxShadow: "0 10px 30px -5px rgba(63, 61, 143, 0.04)",
      }}
    >
      {accentColor && (
        <div
          className="absolute top-0 left-0 right-0 h-[1.5px]"
          style={{ background: `linear-gradient(90deg, ${accentColor} 0%, transparent 60%)`, opacity: 0.7 }}
        />
      )}
      {children}
    </div>
  )
}

// ─── Stat Cards ───────────────────────────────────────────────────────────────

function RevenueCard() {
  return (
    <div
      className="rounded-[20px] p-5 flex flex-col gap-2.5 relative overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #3F3D8F 0%, #302e70 100%)",
        boxShadow: "0 12px 24px -8px rgba(63, 61, 143, 0.4)",
      }}
    >
      {/* Subtle noise texture */}
      <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")" }} />
      <div className="flex items-center justify-between">
        <p className="text-[10px] tracking-widest uppercase text-white/60 font-medium">Today's Revenue</p>
        <div className="w-7 h-7 rounded-xl bg-white/10 flex items-center justify-center">
          <ArrowTrendingUpIcon className="h-3.5 w-3.5 text-white/80" />
        </div>
      </div>
      <p className="text-[2rem] font-bold text-white leading-none tracking-tight">KSh 245,650</p>
      <Sparkline />
      <div className="flex items-center gap-1.5 pt-0.5">
        <div className="flex items-center gap-1 bg-emerald-400/20 rounded-full px-2 py-0.5">
          <span className="text-emerald-300 text-[10px] font-bold">▲ 18.5%</span>
        </div>
        <span className="text-white/40 text-[10px] tracking-wide">vs yesterday</span>
      </div>
    </div>
  )
}

function MetricCard({
  label,
  value,
  sub,
  subDot,
  icon: Icon,
}: {
  label: string
  value: React.ReactNode
  sub: React.ReactNode
  subDot?: string
  icon: React.ElementType
}) {
  return (
    <div
      className="rounded-[20px] p-5 flex flex-col gap-3 relative overflow-hidden group hover:shadow-2xl transition-all duration-500 bg-white border border-[#3F3D8F]/10 shadow-sm"
    >
      <div className="flex items-start justify-between">
        <p className="text-[10px] tracking-widest uppercase text-[#736C83] font-bold">{label}</p>
        <div className="w-10 h-10 rounded-xl bg-[#3F3D8F]/5 border border-[#3F3D8F]/5 flex items-center justify-center transition-transform group-hover:scale-110">
          <Icon className="h-4.5 w-4.5" style={{ color: "#3F3D8F" }} />
        </div>
      </div>
      <p className="text-3xl font-bold text-[#0D031B] leading-none tracking-tight">{value}</p>
      <div className="flex items-center gap-1.5 mt-auto">
        {subDot && <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: subDot }} />}
        <span className="text-[#9A94AA] text-[10px] tracking-wide font-medium">{sub}</span>
      </div>
    </div>
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
      reader.onloadend = () => setAvatarImage(reader.result as string)
      reader.readAsDataURL(file)
    }
  }

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
        const newReady = allOrders.filter(o =>
          o.status === "ready" && !prev.some(p => p.id === o.id && p.status === "ready")
        )
        if (newReady.length > 0) {
          new Audio('/mixkit-bike-notification-bell-590.wav').play().catch(() => {})
          toast.success(`Order for Table ${newReady[0].tableId} is ready!`)
        }
        return allOrders
      })
    })
    return unsubscribe
  }, [])

  useEffect(() => {
    const channelName = `summons-realtime-${Date.now()}`
    const channel = supabase
      .channel(channelName)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'summons' }, (payload) => {
        const rawName = payload.new?.staff_name || "Staff Member"
        const staffId = payload.new?.staff_id
        const isZeroId = String(staffId) === "0"
        const isTableIdentifier = /table/i.test(String(rawName))
        const hasTableId = payload.new?.table_id !== undefined && payload.new?.table_id !== null
        const isCustomerCall = isZeroId || isTableIdentifier || hasTableId
        const name = rawName.trim()

        try {
          new Audio(isCustomerCall ? "/mixkit-bike-notification-bell-590.wav" : "/universfield-new-notification-022-370046.mp3").play().catch(() => {})
        } catch {}

        if (isCustomerCall) {
          setCustomerCalls(prev => [{ id: payload.new.id || `${Date.now()}`, tableId: name.replace(/table /i, "").trim(), createdAt: new Date().toISOString() }, ...prev])
          toast.warning("Table Assistance", { description: `${name} is requesting a waiter now.`, duration: 10000 })
        } else {
          toast.error("STAFF ALERT: Manager Request", { description: `${name}, please report to the manager's office immediately.`, duration: 12000 })
        }
      })
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [])

  const today = new Date().toLocaleDateString("en-KE", { weekday: "long", day: "numeric", month: "long" })

  return (
    <TooltipProvider>
      <div className="min-h-screen" style={{ background: "#EBE6F8" }}>

        {/* ── Ambient background glow ─────────────────────────────────── */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full opacity-[0.12]"
            style={{ background: "radial-gradient(circle, #7C3AED 0%, transparent 70%)", filter: "blur(60px)" }} />
          <div className="absolute top-[30%] right-[-10%] w-[400px] h-[400px] rounded-full opacity-[0.08]"
            style={{ background: "radial-gradient(circle, #4338CA 0%, transparent 70%)", filter: "blur(80px)" }} />
          <div className="absolute bottom-[10%] left-[20%] w-[350px] h-[350px] rounded-full opacity-[0.07]"
            style={{ background: "radial-gradient(circle, #6C63FF 0%, transparent 70%)", filter: "blur(80px)" }} />
        </div>

        <div className="relative z-10 max-w-screen-xl mx-auto px-4 py-6 space-y-6">

          {/* ── Header ──────────────────────────────────────────────────── */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-2">

            {/* Left: Avatar + greeting */}
            <div className="flex items-center gap-4">
              <div className="relative group cursor-pointer shrink-0" onClick={() => fileInputRef.current?.click()}>
                <div className="absolute inset-0 rounded-[24px] blur-xl opacity-40 group-hover:opacity-60 transition-opacity duration-500"
                  style={{ background: "linear-gradient(135deg, #7C3AED, #4338CA)" }} />
                <div className="relative h-[72px] w-[72px] rounded-2xl p-[2.5px] shadow-2xl"
                  style={{ background: "linear-gradient(135deg, #7C3AED, #4338CA)" }}>
                  <div className="h-full w-full rounded-[14px] overflow-hidden bg-white shadow-inner">
                    {avatarImage
                      ? <img src={avatarImage} alt="User" className="h-full w-full object-cover" />
                      : <div className="h-full w-full flex items-center justify-center text-xl font-bold text-white"
                          style={{ background: "linear-gradient(135deg, #3F3D8F 0%, #4338CA 100%)" }}>WA</div>
                      }
                  </div>
                  <div className="absolute inset-[2.5px] flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-[14px]">
                    <CameraIcon className="h-5 w-5 text-white" />
                  </div>
                </div>
                {/* Online dot */}
                <div className="absolute bottom-1 right-1 w-3 h-3 rounded-full bg-emerald-400 border-2 border-[#EBE6F8]">
                  <span className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-75" />
                </div>
                <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-[10px] tracking-[0.3em] uppercase text-[#736C83] font-bold mb-1 opacity-70">{today}</p>
                <h1 className="text-2xl md:text-3xl font-light text-[#0D031B] leading-none">
                  Welcome back, <span className="font-bold whitespace-nowrap" style={{ color: "#3F3D8F" }}>Waiter</span>
                </h1>
                <div className="flex items-center gap-2 mt-1.5">
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border"
                    style={{ background: "rgba(16,185,129,0.08)", borderColor: "rgba(16,185,129,0.2)" }}>
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400" />
                    </span>
                    <span className="text-[9px] tracking-widest uppercase text-emerald-500 font-bold">Shift Active</span>
                  </div>
                  <div className="h-4 w-[1px] bg-[#3F3D8F]/10 mx-1" />
                  <span className="text-[9px] tracking-[0.15em] uppercase text-[#3F3D8F]/50 font-bold">Alpha Station</span>
                </div>
              </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-3 shrink-0">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-10 w-10 md:h-12 md:w-12 rounded-2xl border-[#3F3D8F]/10 bg-white text-[#3F3D8F]/50 hover:text-[#3F3D8F] hover:bg-[#3F3D8F]/05 transition-all shadow-sm"
                  >
                    <ChartBarIcon className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Performance Insights</TooltipContent>
              </Tooltip>
 
              <Button
                asChild
                className="h-10 md:h-12 px-5 md:px-7 rounded-2xl gap-2.5 text-[10px] tracking-widest uppercase text-white border-0 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl group relative overflow-hidden"
                style={{
                  background: "linear-gradient(135deg, #3F3D8F 0%, #302e70 100%)",
                  boxShadow: "0 8px 24px -6px rgba(63, 61, 143, 0.4)",
                }}
              >
                <Link href="/waiter/service-floor">
                  <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <PlusIcon className="h-4 w-4" />
                  <span className="font-bold">New Order</span>
                </Link>
              </Button>
            </div>
          </div>

          {/* ── Stat Cards Grid ──────────────────────────────────────────── */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <RevenueCard />
            <MetricCard
              label="Total Orders"
              value="128"
              sub={<><span className="text-emerald-400 font-semibold">▲ 12.3%</span> vs yesterday</>}
              icon={() => (
                <div className="h-4.5 w-4.5" style={{ 
                  backgroundColor: "#3F3D8F",
                  maskImage: "url('/waiter.png')", maskSize: 'contain', maskRepeat: 'no-repeat', maskPosition: 'center',
                  WebkitMaskImage: "url('/waiter.png')", WebkitMaskSize: 'contain', WebkitMaskRepeat: 'no-repeat', WebkitMaskPosition: 'center'
                }} />
              )}
            />
            <MetricCard
              label="Active Tables"
              value={<>{activeTablesCount || 18} <span className="text-xl text-[#9A94AA] font-bold">/ 32</span></>}
              sub={`${Math.round(((activeTablesCount || 18) / 32) * 100)}% occupied`}
              subDot="#10b981"
              icon={() => (
                <div className="h-4.5 w-4.5" style={{ 
                  backgroundColor: "#3F3D8F",
                  maskImage: "url('/dining-table (1).png')", maskSize: 'contain', maskRepeat: 'no-repeat', maskPosition: 'center',
                  WebkitMaskImage: "url('/dining-table (1).png')", WebkitMaskSize: 'contain', WebkitMaskRepeat: 'no-repeat', WebkitMaskPosition: 'center'
                }} />
              )}
            />
            <MetricCard
              label="New Reservations"
              value="12"
              sub="Today"
              subDot="#10b981"
              icon={() => (
                <div className="h-4.5 w-4.5" style={{ 
                  backgroundColor: "#3F3D8F",
                  maskImage: "url('/calendar.png')", maskSize: 'contain', maskRepeat: 'no-repeat', maskPosition: 'center',
                  WebkitMaskImage: "url('/calendar.png')", WebkitMaskSize: 'contain', WebkitMaskRepeat: 'no-repeat', WebkitMaskPosition: 'center'
                }} />
              )}
            />
          </div>

          {/* ── Main Content Grid ────────────────────────────────────────── */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-5">

            {/* ── LEFT column ─────────────────────────────────────────── */}
            <div className="space-y-5">

              {/* Service Alerts */}
              <GlassCard accentColor="#f59e0b">
                <SectionHeader
                  icon={
                    <div className="h-4.5 w-4.5" style={{
                      backgroundColor: "#f59e0b",
                      maskImage: "url(/rebell.png)", maskSize: "contain", maskRepeat: "no-repeat", maskPosition: "center",
                      WebkitMaskImage: "url(/rebell.png)", WebkitMaskSize: "contain", WebkitMaskRepeat: "no-repeat", WebkitMaskPosition: "center",
                    }} />
                  }
                  iconBg="bg-amber-500/10"
                  title="Service Alerts"
                  subtitle="Kitchen ready · Pickup now"
                  badge={
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-amber-500/20 bg-amber-500/10">
                      <FireIcon className="h-2.5 w-2.5 text-amber-400 animate-pulse" />
                      <span className="text-[9px] tracking-widest uppercase text-amber-400 font-semibold">Live</span>
                    </div>
                  }
                />

                {combinedAlerts.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-14 gap-3">
                    <div className="w-14 h-14 rounded-[18px] flex items-center justify-center bg-emerald-500/10 border border-emerald-500/15">
                      <CheckCircleIcon className="h-7 w-7 text-emerald-400" />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-bold text-[#0D031B]">All caught up!</p>
                      <p className="text-[10px] tracking-widest uppercase text-[#9A94AA] mt-1 font-medium">No pending alerts</p>
                    </div>
                  </div>
                ) : (
                  <div>
                    {combinedAlerts.map((alert, idx) => {
                      const isOrder = alert.alertType === 'order'
                      return (
                        <div
                          key={alert.id}
                          className="group flex items-center gap-4 px-5 py-3.5 hover:bg-white/[0.03] transition-colors"
                          style={{ borderTop: idx > 0 ? "1px solid rgba(255,255,255,0.05)" : undefined }}
                        >
                          {/* Table number badge */}
                          <div
                            className="w-11 h-11 rounded-2xl flex items-center justify-center text-base font-bold text-white shrink-0"
                            style={{
                              background: isOrder
                                ? "linear-gradient(135deg, #7C3AED, #4338CA)"
                                : "linear-gradient(135deg, #d97706, #b45309)",
                              boxShadow: `0 4px 12px ${isOrder ? "rgba(124,58,237,0.35)" : "rgba(245,158,11,0.35)"}`,
                            }}
                          >
                            {alert.tableId}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-semibold text-white">Table {alert.tableId}</p>
                              <span className="px-1.5 py-0.5 rounded-md text-[9px] tracking-wider uppercase font-medium"
                                style={{
                                  background: isOrder ? "rgba(124,58,237,0.15)" : "rgba(245,158,11,0.15)",
                                  color: isOrder ? "#a78bfa" : "#fbbf24",
                                }}>
                                {isOrder ? "Ready" : "Assist"}
                              </span>
                            </div>
                            <p className="text-[11px] text-white/40 truncate mt-0.5">
                              {isOrder
                                ? `${(alert as any).items.length} items · ${(alert as any).items[0].name}`
                                : "Customer is requesting assistance"
                              }
                            </p>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0">
                            <Button
                              size="sm"
                              className="h-8 px-3.5 text-[10px] tracking-wider uppercase text-white font-semibold border-0 rounded-xl shadow-sm transition-all hover:-translate-y-0.5"
                              style={{
                                background: isOrder
                                  ? "linear-gradient(135deg, #7C3AED, #4338CA)"
                                  : "linear-gradient(135deg, #059669, #047857)",
                                boxShadow: isOrder ? "0 4px 12px rgba(124,58,237,0.4)" : "0 4px 12px rgba(5,150,105,0.4)",
                              }}
                              onClick={() => {
                                if (isOrder) OrderService.updateOrderStatus(alert.id, "served")
                                else setDismissed(d => [...d, alert.id])
                              }}
                            >
                              {isOrder ? "Serve" : "Resolve"}
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-8 w-8 rounded-xl opacity-0 group-hover:opacity-100 transition-all text-white/30 hover:text-white hover:bg-white/10"
                              onClick={() => setDismissed(d => [...d, alert.id])}
                            >
                              <XMarkIcon className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </GlassCard>

              {/* My Service Floor */}
              <GlassCard accentColor="#7C3AED">
                <SectionHeader
                  icon={<CheckBadgeIcon className="h-4.5 w-4.5 text-violet-400" />}
                  title="My Service Floor"
                  subtitle="Active assignments"
                  action={
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-[10px] tracking-widest font-semibold uppercase gap-1 text-violet-400 hover:bg-white/5 h-8 px-3 rounded-xl"
                      asChild
                    >
                      <Link href="/waiter/service-floor">
                        Map <ChevronRightIcon className="h-3 w-3" />
                      </Link>
                    </Button>
                  }
                />

                <div className="p-4">
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {activeOrders.length === 0 ? (
                      <div className="col-span-full py-12 text-center flex flex-col items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center">
                          <CheckBadgeIcon className="h-6 w-6 text-white/20" />
                        </div>
                        <p className="text-[10px] tracking-widest uppercase text-white/25 font-semibold">No active assignments</p>
                      </div>
                    ) : activeOrders.map((t) => {
                      const tableNum = parseInt(t.tableId) || 0
                      const status   = t.status || "pending"
                      const imgSrc   = tableImages[tableNum % tableImages.length]
                      const statusConfig = {
                        pending:   { color: "#6366f1", label: "Pending" },
                        ready:     { color: "#10b981", label: "Ready" },
                        occupied:  { color: "#8b5cf6", label: "Occupied" },
                        served:    { color: "#6366f1", label: "Served" },
                        cancelled: { color: "#ef4444", label: "Cancelled" },
                      }
                      const cfg = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending

                      return (
                        <HoverCard key={t.id} openDelay={200}>
                          <HoverCardTrigger asChild>
                            <div
                              className="group relative flex flex-col rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl"
                              style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.09)" }}
                            >
                              <div className="relative h-24 w-full overflow-hidden">
                                <img src={imgSrc} alt={`Table ${tableNum}`} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                                <div className="absolute top-2.5 left-2.5 flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/50 backdrop-blur-sm border border-white/10">
                                  <div className="w-1 h-1 rounded-full" style={{ background: cfg.color }} />
                                  <span className="text-[8px] tracking-widest uppercase text-white/80">{cfg.label}</span>
                                </div>
                              </div>
                              <div className="px-3 pb-3 pt-6 flex flex-col items-center relative">
                                <div className="absolute -top-5 w-10 h-10 rounded-xl flex items-center justify-center border-2 border-[#0f0a1e] shadow-xl"
                                  style={{ background: "linear-gradient(135deg, #7C3AED, #4338CA)" }}>
                                  <span className="text-base font-bold text-white">{tableNum}</span>
                                </div>
                                <p className="text-[9px] tracking-widest uppercase text-white/35 font-medium">{t.items?.length || 0} items</p>
                              </div>
                            </div>
                          </HoverCardTrigger>
                          <HoverCardContent
                            className="w-68 p-0 border-0 rounded-[20px] shadow-2xl overflow-hidden"
                            style={{ background: "#1a0f3a", border: "1px solid rgba(255,255,255,0.12)" }}
                            sideOffset={12}
                          >
                            <div className="p-4 space-y-3">
                              <div className="flex items-center gap-3">
                                <div className="w-11 h-11 rounded-2xl flex items-center justify-center text-lg font-black text-white shadow-lg"
                                  style={{ background: "linear-gradient(135deg, #7C3AED, #4338CA)" }}>
                                  {tableNum}
                                </div>
                                <div>
                                  <p className="text-sm font-semibold text-[#0D031B]">Table {tableNum}</p>
                                  <div className="flex items-center gap-1.5 mt-0.5">
                                    <div className="w-1.5 h-1.5 rounded-full" style={{ background: cfg.color }} />
                                    <p className="text-[9px] tracking-wider uppercase text-[#736C83]">{cfg.label} · Section Alpha</p>
                                  </div>
                                </div>
                              </div>
                              <div className="grid grid-cols-2 gap-2.5">
                                {[
                                  { label: "Order ID", value: `#${t.id.slice(-6).toUpperCase()}` },
                                  { label: "Items", value: `${t.items.length} Units` },
                                ].map(item => (
                                  <div key={item.label} className="p-2.5 rounded-[14px] space-y-0.5" style={{ background: "rgba(63, 61, 143, 0.05)" }}>
                                    <p className="text-[8px] tracking-widest uppercase text-[#9A94AA] font-bold">{item.label}</p>
                                    <p className="text-xs font-semibold text-[#3F3D8F]">{item.value}</p>
                                  </div>
                                ))}
                              </div>
                              <Button className="w-full h-9 rounded-xl text-[10px] tracking-widest uppercase gap-1.5 text-white border-0"
                                style={{ background: "linear-gradient(135deg, #7C3AED, #4338CA)" }}>
                                Manage Table <ArrowRight className="h-3 w-3" />
                              </Button>
                            </div>
                          </HoverCardContent>
                        </HoverCard>
                      )
                    })}
                  </div>
                </div>
              </GlassCard>
            </div>

            {/* ── RIGHT column ────────────────────────────────────────── */}
            <div className="space-y-4">

              {/* Quick Actions */}
              <GlassCard>
                <div className="px-5 py-4" style={{ borderBottom: "1px solid rgba(63, 61, 143, 0.05)" }}>
                  <p className="text-[11px] tracking-widest uppercase font-bold text-[#0D031B]">Quick Actions</p>
                </div>
                <div className="p-4 space-y-2.5">
                  <Button
                    asChild
                    className="w-full h-12 rounded-2xl gap-2.5 text-[10px] tracking-widest uppercase text-white border-0 transition-all duration-300 hover:-translate-y-0.5 group relative overflow-hidden"
                    style={{ background: "linear-gradient(135deg, #7C3AED 0%, #4338CA 100%)", boxShadow: "0 6px 20px -4px rgba(124,58,237,0.5)" }}
                  >
                    <Link href="/waiter/service-floor" className="flex items-center justify-center">
                      <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div 
                        className="h-4 w-4 bg-white" 
                        style={{ 
                          maskImage: "url(/service-floor-nav.png)", maskSize: 'contain', maskRepeat: 'no-repeat', maskPosition: 'center',
                          WebkitMaskImage: "url(/service-floor-nav.png)", WebkitMaskSize: 'contain', WebkitMaskRepeat: 'no-repeat', WebkitMaskPosition: 'center'
                        }} 
                      />
                      <span>New Order</span>
                    </Link>
                  </Button>

                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { href: "/waiter/service-floor",  label: "Floor",   icon: "/service-floor-nav.png" },
                      { href: "/waiter/order-tracking", label: "Tracker", icon: "/order-tracking-nav.png" },
                      { href: "/waiter/checkout",       label: "Cashier", icon: "/checkout-nav.png" },
                    ].map((action) => (
                      <Button
                        key={action.href}
                        asChild
                        variant="ghost"
                        className="h-[72px] flex-col gap-1.5 text-[9px] tracking-widest uppercase rounded-2xl border border-white/08 bg-white/04 hover:bg-white/08 text-white/40 hover:text-white/70 transition-all"
                      >
                        <Link href={action.href} className="flex flex-col items-center justify-center">
                          <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-[#3F3D8F]/05 border border-[#3F3D8F]/10 mb-1">
                            <div 
                              className="h-4 w-4 bg-[#3F3D8F]" 
                              style={{ 
                                maskImage: `url(${action.icon})`, maskSize: 'contain', maskRepeat: 'no-repeat', maskPosition: 'center',
                                WebkitMaskImage: `url(${action.icon})`, WebkitMaskSize: 'contain', WebkitMaskRepeat: 'no-repeat', WebkitMaskPosition: 'center'
                              }} 
                            />
                          </div>
                          <span className="text-[#3F3D8F] font-bold">{action.label}</span>
                        </Link>
                      </Button>
                    ))}
                  </div>
                </div>
              </GlassCard>

              {/* Shift Progress */}
              <GlassCard accentColor="#7C3AED">
                <SectionHeader
                  icon={
                    <div className="h-4.5 w-4.5" style={{
                      backgroundColor: "#3F3D8F",
                      maskImage: "url(/shift.png)", maskSize: "contain", maskRepeat: "no-repeat", maskPosition: "center",
                      WebkitMaskImage: "url(/shift.png)", WebkitMaskSize: "contain", WebkitMaskRepeat: "no-repeat", WebkitMaskPosition: "center",
                    }} />
                  }
                  title="Shift Progress"
                  subtitle="14 covers to target"
                />

                <div className="p-5 space-y-5">
                  {/* Main numbers */}
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-[2.4rem] leading-none font-bold text-[#0D031B] tracking-tight">75<span className="text-xl text-[#9A94AA]">%</span></p>
                      <p className="text-[9px] tracking-widest uppercase text-[#9A94AA] mt-1 font-bold">Quota Met</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold tabular-nums text-[#3F3D8F]">42</p>
                      <p className="text-[9px] tracking-widest uppercase text-[#9A94AA] mt-1 font-bold">Served Today</p>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="space-y-2">
                    <div className="h-2.5 w-full rounded-full overflow-hidden bg-[#3F3D8F]/05 border border-[#3F3D8F]/10">
                      <div
                        className="h-full rounded-full relative overflow-hidden"
                        style={{ width: "75%", background: "linear-gradient(90deg, #7C3AED, #6d28d9)" }}
                      >
                        <div className="absolute inset-0 bg-white/20 animate-pulse" style={{ borderRadius: "inherit" }} />
                      </div>
                    </div>
                    <p className="text-[9px] tracking-wide text-[#9A94AA] font-medium">Excellent pace · 14 to target of 56</p>
                  </div>

                  {/* Micro stats */}
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { value: "4.8",     label: "Rating",  color: "#34d399", bg: "rgba(52,211,153,0.07)" },
                      { value: "3.5m",    label: "Wait",    color: "#a78bfa", bg: "rgba(167,139,250,0.07)" },
                      { value: "KES 850", label: "Avg",     color: "#fb923c", bg: "rgba(251,146,60,0.07)" },
                    ].map((m) => (
                      <div
                        key={m.label}
                        className="rounded-2xl p-3 flex flex-col items-center gap-1 border border-white/05"
                        style={{ background: m.bg }}
                      >
                        <p className="text-sm tabular-nums font-bold" style={{ color: m.color }}>{m.value}</p>
                        <p className="text-[8px] tracking-widest uppercase text-[#9A94AA] font-bold">{m.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </GlassCard>

              {/* Activity Stream */}
              <GlassCard>
                <div className="px-5 py-4" style={{ borderBottom: "1px solid rgba(63, 61, 143, 0.05)" }}>
                  <p className="text-[11px] tracking-widest uppercase font-bold text-[#0D031B]">Activity Stream</p>
                </div>
                <ScrollArea className="h-[240px]">
                  <div>
                    {recentActivity.map((item, i) => {
                      const Icon = item.icon
                      return (
                        <div
                          key={i}
                          className="flex items-center gap-3.5 px-5 py-3 hover:bg-[#3F3D8F]/05 transition-all cursor-pointer group"
                          style={{ borderTop: i > 0 ? "1px solid rgba(63, 61, 143, 0.05)" : undefined }}
                        >
                          <div className={cn("w-9 h-9 rounded-2xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-105 shadow-sm", item.bg)}>
                            {typeof Icon === 'string'
                              ? <div className="h-4 w-4" style={{ backgroundColor: item.dot, maskImage: `url(${Icon})`, maskSize: 'contain', maskRepeat: 'no-repeat', maskPosition: 'center', WebkitMaskImage: `url(${Icon})`, WebkitMaskSize: 'contain', WebkitMaskRepeat: 'no-repeat', WebkitMaskPosition: 'center' }} />
                              : <Icon className={cn("h-4 w-4", item.color)} />
                            }
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-[12px] text-[#0D031B] truncate group-hover:text-[#3F3D8F] transition-colors font-bold">{item.text}</p>
                            <p className="text-[9px] tracking-wide uppercase text-[#9A94AA] mt-0.5 font-bold">{item.sub}</p>
                          </div>
                          <ArrowRight className="h-3.5 w-3.5 shrink-0 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 text-[#3F3D8F]" />
                        </div>
                      )
                    })}
                  </div>
                </ScrollArea>
              </GlassCard>

            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  )
}