"use client"

import { useState, useEffect, useRef } from "react"
import { toast } from "sonner"
import Link from "next/link"
import { AnimatePresence, motion } from "motion/react"
import { SPRING_SNAPPY } from "@/lib/motion"
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  ArrowTrendingUpIcon,
  CheckBadgeIcon,
  ArrowRightIcon as ArrowRight,
  ChevronRightIcon,
  FireIcon,
  BuildingStorefrontIcon,
  XMarkIcon,
  PlusIcon,
  CameraIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
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
  ItemMedia,
  ItemSeparator,
  ItemTitle,
} from "@/components/ui/item"
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
import { SummonService } from "@/lib/restaurant-store"

const tableImages = [
  "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=300&h=200&fit=crop",
  "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?w=300&h=200&fit=crop",
  "https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?w=300&h=200&fit=crop",
  "https://images.unsplash.com/photo-1525610553991-2bede1a236e2?w=300&h=200&fit=crop",
  "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=300&h=200&fit=crop",
  "https://images.unsplash.com/photo-1424847651672-bf20a4b0982b?w=300&h=200&fit=crop",
  "https://images.unsplash.com/photo-1522792043064-2db24c3a6479?w=300&h=200&fit=crop",
]

const sparklinePoints =
  "M0,40 C10,38 20,32 30,28 C40,24 50,30 60,26 C70,22 80,18 90,16 C100,14 110,20 120,15 C130,10 140,8 150,5"

const recentActivity = [
  { icon: CheckCircleIcon, tone: "bg-success/10 text-success", text: "Table 6 payment processed", sub: "KES 2,100 · 4m ago" },
  { icon: "/shopping-cart.png" as string | typeof CheckCircleIcon, tone: "bg-primary/10 text-primary", text: "New order placed — Table 3", sub: "6 items · 8m ago" },
  { icon: ExclamationCircleIcon, tone: "bg-warning/10 text-warning", text: "Table 9 — guests arrived", sub: "Reserved · 12m ago" },
  { icon: BuildingStorefrontIcon, tone: "bg-primary/10 text-primary", text: "Table 2 order updated", sub: "+2 items · 18m ago" },
]

function Sparkline() {
  return (
    <svg viewBox="0 0 150 50" className="w-full h-9" preserveAspectRatio="none">
      <defs>
        <linearGradient id="sparkGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.3" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={`${sparklinePoints} L150,50 L0,50 Z`} fill="url(#sparkGrad)" />
      <path
        d={sparklinePoints}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function RevenueCard() {
  return (
    <Card size="sm" className="bg-primary text-primary-foreground border-primary">
      <CardHeader>
        <CardDescription className="text-primary-foreground/75 text-xs uppercase font-medium">
          Today&apos;s Revenue
        </CardDescription>
        <CardAction>
          <div className="flex size-8 items-center justify-center rounded-lg bg-primary-foreground/15">
            <ArrowTrendingUpIcon className="size-4" />
          </div>
        </CardAction>
      </CardHeader>
      <CardContent className="space-y-2">
        <CardTitle className="text-2xl sm:text-3xl font-semibold tabular-nums">
          KSh 245,650
        </CardTitle>
        <div className="text-accent">
          <Sparkline />
        </div>
        <div className="flex items-center gap-2 text-xs">
          <Badge variant="secondary" className="text-[10px]">
            ▲ 18.5%
          </Badge>
          <span className="text-primary-foreground/70">vs yesterday</span>
        </div>
      </CardContent>
    </Card>
  )
}

function MetricCard({
  label,
  value,
  sub,
  iconPath,
}: {
  label: string
  value: React.ReactNode
  sub: React.ReactNode
  iconPath: string
}) {
  return (
    <Card size="sm">
      <CardHeader>
        <CardDescription className="text-xs uppercase font-medium">{label}</CardDescription>
        <CardAction>
          <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <div
              className="size-4 bg-primary"
              style={{
                maskImage: `url('${iconPath}')`,
                maskSize: "contain",
                maskRepeat: "no-repeat",
                maskPosition: "center",
                WebkitMaskImage: `url('${iconPath}')`,
                WebkitMaskSize: "contain",
                WebkitMaskRepeat: "no-repeat",
                WebkitMaskPosition: "center",
              }}
            />
          </div>
        </CardAction>
      </CardHeader>
      <CardContent className="space-y-1.5">
        <CardTitle className="text-2xl sm:text-3xl font-semibold tabular-nums">{value}</CardTitle>
        <p className="text-xs text-muted-foreground">{sub}</p>
      </CardContent>
    </Card>
  )
}

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

  const readyOrders = orders.filter((o) => o.status === "ready" && !dismissed.includes(o.id))
  const activeCalls = customerCalls.filter((c) => !dismissed.includes(c.id))
  const combinedAlerts = [
    ...readyOrders.map((o) => ({ ...o, alertType: "order" as const })),
    ...activeCalls.map((c) => ({ ...c, alertType: "call" as const })),
  ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  const activeOrders = orders.filter((o) => o.paymentStatus !== "paid" && o.status !== "cancelled")
  const activeTablesCount = Array.from(new Set(activeOrders.map((o) => o.tableId))).length

  useEffect(() => {
    const unsubscribe = OrderService.subscribe((allOrders) => {
      setOrders((prev) => {
        const newReady = allOrders.filter(
          (o) => o.status === "ready" && !prev.some((p) => p.id === o.id && p.status === "ready"),
        )
        if (newReady.length > 0) {
          new Audio("/mixkit-bike-notification-bell-590.wav").play().catch(() => {})
          toast.success(`Order for Table ${newReady[0].tableId} is ready!`)
        }
        return allOrders
      })
    })
    return unsubscribe
  }, [])

  useEffect(() => {
    const unsubscribe = SummonService.subscribe((alerts) => {
      setCustomerCalls(
        alerts
          .filter((a) => a.isCustomerCall && a.status === "pending")
          .map((a) => ({
            id: a.id,
            tableId: a.tableId || a.staffName.replace(/table\s*/i, "").trim(),
            createdAt: a.createdAt,
          })),
      )
    })
    return unsubscribe
  }, [])

  const today = new Date().toLocaleDateString("en-KE", {
    weekday: "long",
    day: "numeric",
    month: "long",
  })

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-background">
        <div className="max-w-screen-xl mx-auto px-4 py-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div
                className="relative group cursor-pointer shrink-0"
                onClick={() => fileInputRef.current?.click()}
              >
                <Avatar className="size-16 rounded-2xl border-2 border-primary/20 shadow-sm">
                  {avatarImage && <AvatarImage src={avatarImage} alt="User" className="object-cover" />}
                  <AvatarFallback className="rounded-2xl bg-primary text-primary-foreground text-lg font-bold">
                    WA
                  </AvatarFallback>
                </Avatar>
                <div className="absolute inset-0 flex items-center justify-center bg-black/45 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl">
                  <CameraIcon className="size-5 text-white" />
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 size-3.5 rounded-full bg-success border-2 border-background" />
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  accept="image/*"
                  className="hidden"
                />
              </div>

              <div className="space-y-1">
                <p className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium">
                  {today}
                </p>
                <h1 className="text-2xl md:text-3xl font-semibold text-foreground leading-none">
                  Welcome back, <span className="text-primary">Waiter</span>
                </h1>
                <div className="flex items-center gap-2 pt-1">
                  <Badge variant="outline" className="gap-1.5 border-success/30 bg-success/10 text-success">
                    <span className="size-1.5 rounded-full bg-success" />
                    Shift Active
                  </Badge>
                  <span className="text-xs text-muted-foreground">Alpha Station</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon">
                    <ChartBarIcon className="size-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Performance Insights</TooltipContent>
              </Tooltip>

              <Button asChild className="gap-2">
                <Link href="/waiter/service-floor">
                  <PlusIcon className="size-4" />
                  New Order
                </Link>
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <RevenueCard />
            <MetricCard
              label="Total Orders"
              value="128"
              sub="▲ 12.3% vs yesterday"
              iconPath="/waiter.png"
            />
            <MetricCard
              label="Active Tables"
              value={
                <>
                  {activeTablesCount || 18}{" "}
                  <span className="text-lg text-muted-foreground font-medium">/ 32</span>
                </>
              }
              sub={`${Math.round(((activeTablesCount || 18) / 32) * 100)}% occupied`}
              iconPath="/dining-table (1).png"
            />
            <MetricCard
              label="New Reservations"
              value="12"
              sub="Today"
              iconPath="/calendar.png"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
            <div className="space-y-6">
              <Card>
                <CardHeader className="border-b">
                  <div className="flex items-center gap-3">
                    <div className="flex size-9 items-center justify-center rounded-lg bg-warning/10">
                      <div
                        className="size-4 bg-warning"
                        style={{
                          maskImage: "url(/rebell.png)",
                          maskSize: "contain",
                          maskRepeat: "no-repeat",
                          maskPosition: "center",
                          WebkitMaskImage: "url(/rebell.png)",
                          WebkitMaskSize: "contain",
                          WebkitMaskRepeat: "no-repeat",
                          WebkitMaskPosition: "center",
                        }}
                      />
                    </div>
                    <div className="space-y-0.5">
                      <CardTitle className="text-base">Service Alerts</CardTitle>
                      <CardDescription className="text-xs">
                        Kitchen ready · Pickup now
                      </CardDescription>
                    </div>
                  </div>
                  <CardAction>
                    <Badge variant="outline" className="gap-1 border-warning/30 bg-warning/10 text-warning">
                      <FireIcon className="size-3" />
                      Live
                    </Badge>
                  </CardAction>
                </CardHeader>

                <CardContent className="p-0">
                  {combinedAlerts.length === 0 ? (
                    <Empty className="py-14">
                      <EmptyHeader>
                        <EmptyMedia variant="icon">
                          <CheckCircleIcon className="text-success" />
                        </EmptyMedia>
                        <EmptyTitle>All caught up!</EmptyTitle>
                        <EmptyDescription>No pending alerts</EmptyDescription>
                      </EmptyHeader>
                    </Empty>
                  ) : (
                    <ItemGroup>
                      <AnimatePresence mode="popLayout" initial={false}>
                        {combinedAlerts.map((alert, idx) => {
                          const isOrder = alert.alertType === "order"
                          return (
                            <motion.div
                              key={alert.id}
                              layout="position"
                              initial={{ opacity: 0, y: 6 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, x: 14, scale: 0.96 }}
                              transition={SPRING_SNAPPY}
                            >
                              {idx > 0 && <ItemSeparator />}
                              <Item className="group rounded-none hover:bg-muted/40">
                                <ItemMedia>
                                  <div
                                    className={cn(
                                      "flex size-10 items-center justify-center rounded-xl font-bold text-sm",
                                      isOrder
                                        ? "bg-primary text-primary-foreground"
                                        : "bg-warning text-warning-foreground",
                                    )}
                                  >
                                    {alert.tableId}
                                  </div>
                                </ItemMedia>

                                <ItemContent>
                                  <ItemTitle>
                                    <span>Table {alert.tableId}</span>
                                    <Badge
                                      variant={isOrder ? "default" : "outline"}
                                      className={cn(
                                        "text-[10px] uppercase",
                                        !isOrder && "border-warning/30 bg-warning/10 text-warning",
                                      )}
                                    >
                                      {isOrder ? "Ready" : "Assist"}
                                    </Badge>
                                  </ItemTitle>
                                  <ItemDescription>
                                    {isOrder
                                      ? `${(alert as LiveOrder).items.length} items · ${(alert as LiveOrder).items[0]?.name}`
                                      : "Customer is requesting assistance"}
                                  </ItemDescription>
                                </ItemContent>

                                <ItemActions>
                                  <Button
                                    size="sm"
                                    onClick={() => {
                                      if (isOrder) OrderService.updateOrderStatus(alert.id, "served")
                                      else SummonService.resolveSummon(alert.id)
                                    }}
                                  >
                                    {isOrder ? "Serve" : "Resolve"}
                                  </Button>
                                  <Button
                                    size="icon-sm"
                                    variant="ghost"
                                    className="opacity-70 md:opacity-0 md:group-hover:opacity-100"
                                    onClick={() => setDismissed((d) => [...d, alert.id])}
                                    aria-label="Dismiss alert"
                                  >
                                    <XMarkIcon className="size-4" />
                                  </Button>
                                </ItemActions>
                              </Item>
                            </motion.div>
                          )
                        })}
                      </AnimatePresence>
                    </ItemGroup>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="border-b">
                  <div className="flex items-center gap-3">
                    <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <CheckBadgeIcon className="size-5" />
                    </div>
                    <div className="space-y-0.5">
                      <CardTitle className="text-base">My Service Floor</CardTitle>
                      <CardDescription className="text-xs">Active assignments</CardDescription>
                    </div>
                  </div>
                  <CardAction>
                    <Button variant="ghost" size="sm" asChild>
                      <Link href="/waiter/service-floor" className="gap-1">
                        Map <ChevronRightIcon className="size-3.5" />
                      </Link>
                    </Button>
                  </CardAction>
                </CardHeader>

                <CardContent>
                  {activeOrders.length === 0 ? (
                    <Empty className="py-10">
                      <EmptyHeader>
                        <EmptyMedia variant="icon">
                          <CheckBadgeIcon />
                        </EmptyMedia>
                        <EmptyTitle className="text-base">No active assignments</EmptyTitle>
                        <EmptyDescription>Active table orders will appear here.</EmptyDescription>
                      </EmptyHeader>
                    </Empty>
                  ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                      {activeOrders.map((t) => {
                        const tableNum = parseInt(t.tableId) || 0
                        const status = t.status || "pending"
                        const imgSrc = tableImages[tableNum % tableImages.length]
                        const statusLabel =
                          status.charAt(0).toUpperCase() + status.slice(1)

                        return (
                          <HoverCard key={t.id} openDelay={200}>
                            <HoverCardTrigger asChild>
                              <Card
                                size="sm"
                                className="group gap-0 py-0 overflow-hidden cursor-pointer transition-[border-color,box-shadow] duration-150 ease-(--ease-out) hover:shadow-md"
                              >
                                <div className="relative h-24 w-full overflow-hidden bg-muted">
                                  <img
                                    src={imgSrc}
                                    alt={`Table ${tableNum}`}
                                    className="w-full h-full object-cover transition-transform duration-300 ease-(--ease-out) group-hover:scale-105"
                                  />
                                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent" />
                                  <Badge
                                    variant="secondary"
                                    className="absolute top-2 left-2 text-[10px] uppercase"
                                  >
                                    {statusLabel}
                                  </Badge>
                                </div>
                                <CardContent className="py-3 text-center">
                                  <p className="text-base font-bold text-foreground">
                                    Table {tableNum}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    {t.items?.length || 0} items
                                  </p>
                                </CardContent>
                              </Card>
                            </HoverCardTrigger>
                            <HoverCardContent className="w-64 p-4 space-y-3" sideOffset={10}>
                              <div className="flex items-center gap-3">
                                <div className="flex size-10 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold">
                                  {tableNum}
                                </div>
                                <div>
                                  <p className="text-sm font-semibold">Table {tableNum}</p>
                                  <p className="text-xs text-muted-foreground">
                                    {statusLabel} · Section Alpha
                                  </p>
                                </div>
                              </div>
                              <div className="grid grid-cols-2 gap-2">
                                <div className="p-2 rounded-lg bg-muted/50">
                                  <p className="text-[10px] uppercase text-muted-foreground">Order</p>
                                  <p className="text-xs font-semibold">
                                    #{t.id.slice(-6).toUpperCase()}
                                  </p>
                                </div>
                                <div className="p-2 rounded-lg bg-muted/50">
                                  <p className="text-[10px] uppercase text-muted-foreground">Items</p>
                                  <p className="text-xs font-semibold">{t.items.length} Units</p>
                                </div>
                              </div>
                              <Button size="sm" className="w-full gap-1.5" asChild>
                                <Link href={`/waiter/service-floor?table=${tableNum}`}>
                                  Manage Table <ArrowRight className="size-3.5" />
                                </Link>
                              </Button>
                            </HoverCardContent>
                          </HoverCard>
                        )
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            <div className="space-y-4">
              <Card size="sm">
                <CardHeader className="border-b">
                  <CardTitle className="text-sm uppercase">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2.5">
                  <Button asChild className="w-full gap-2">
                    <Link href="/waiter/service-floor">
                      <PlusIcon className="size-4" />
                      New Order
                    </Link>
                  </Button>

                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { href: "/waiter/service-floor", label: "Floor", icon: "/service-floor-nav.png" },
                      { href: "/waiter/order-tracking", label: "Tracker", icon: "/order-tracking-nav.png" },
                      { href: "/waiter/checkout", label: "Cashier", icon: "/checkout-nav.png" },
                    ].map((action) => (
                      <Button
                        key={action.href}
                        asChild
                        variant="outline"
                        className="h-auto flex-col gap-1.5 py-3 px-2 text-[11px]"
                      >
                        <Link href={action.href}>
                          <div
                            className="size-4 bg-primary"
                            style={{
                              maskImage: `url(${action.icon})`,
                              maskSize: "contain",
                              maskRepeat: "no-repeat",
                              maskPosition: "center",
                              WebkitMaskImage: `url(${action.icon})`,
                              WebkitMaskSize: "contain",
                              WebkitMaskRepeat: "no-repeat",
                              WebkitMaskPosition: "center",
                            }}
                          />
                          <span>{action.label}</span>
                        </Link>
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card size="sm">
                <CardHeader className="border-b">
                  <CardTitle className="text-sm">Shift Progress</CardTitle>
                  <CardDescription className="text-xs">14 covers to target</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-3xl font-bold tabular-nums">75%</p>
                      <p className="text-xs uppercase text-muted-foreground">Quota Met</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold tabular-nums text-primary">42</p>
                      <p className="text-xs uppercase text-muted-foreground">Served Today</p>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Progress value={75} className="h-2" />
                    <p className="text-xs text-muted-foreground">
                      Excellent pace · 14 to target of 56
                    </p>
                  </div>

                  <Separator />

                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { value: "4.8", label: "Rating" },
                      { value: "3.5m", label: "Wait" },
                      { value: "KES 850", label: "Avg" },
                    ].map((m) => (
                      <div key={m.label} className="rounded-lg bg-muted/50 p-2.5 text-center">
                        <p className="text-sm font-semibold tabular-nums">{m.value}</p>
                        <p className="text-[10px] uppercase text-muted-foreground">{m.label}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card size="sm">
                <CardHeader className="border-b">
                  <CardTitle className="text-sm uppercase">Activity Stream</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <ScrollArea className="h-[240px]">
                    <ItemGroup>
                      {recentActivity.map((item, i) => {
                        const Icon = item.icon
                        return (
                          <div key={i}>
                            {i > 0 && <ItemSeparator />}
                            <Item size="sm" className="rounded-none hover:bg-muted/40">
                              <ItemMedia variant="icon" className={item.tone}>
                                {typeof Icon === "string" ? (
                                  <div
                                    className="size-4 bg-current"
                                    style={{
                                      maskImage: `url(${Icon})`,
                                      maskSize: "contain",
                                      maskRepeat: "no-repeat",
                                      maskPosition: "center",
                                      WebkitMaskImage: `url(${Icon})`,
                                      WebkitMaskSize: "contain",
                                      WebkitMaskRepeat: "no-repeat",
                                      WebkitMaskPosition: "center",
                                    }}
                                  />
                                ) : (
                                  <Icon className="size-4" />
                                )}
                              </ItemMedia>
                              <ItemContent>
                                <ItemTitle className="text-xs truncate">{item.text}</ItemTitle>
                                <ItemDescription className="text-[11px]">{item.sub}</ItemDescription>
                              </ItemContent>
                              <ItemActions>
                                <ArrowRight className="size-3.5 text-muted-foreground" />
                              </ItemActions>
                            </Item>
                          </div>
                        )
                      })}
                    </ItemGroup>
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  )
}
