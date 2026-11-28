"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { AnimatePresence, motion } from "motion/react"
import { FAST_TRANSITION, SPRING_SNAPPY } from "@/lib/motion"
import { defaultPortalPath, portalAllowedRoles, useAuth } from "@/lib/auth-context"
import { TableService } from "@/lib/restaurant-store"
import { mockTables } from "@/lib/mock-data"
import type { Table } from "@/lib/types"
import { SummonsListener } from "@/components/layout/summons-listener"
import {
  ShieldCheckIcon as ShieldCheck,
  ViewfinderCircleIcon as Crosshair,
  UserGroupIcon as Users,
  ChartBarIcon as Activity,
  ExclamationCircleIcon as AlertCircle,
  VideoCameraIcon as Camera,
  EyeIcon as Eye,
  BellIcon as Bell,
  CheckCircleIcon as CircleDot,
  ClockIcon as Clock,
  XMarkIcon as X,
} from "@heroicons/react/24/outline"
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
import { Progress } from "@/components/ui/progress"
import { Spinner } from "@/components/ui/spinner"
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
  ItemTitle,
} from "@/components/ui/item"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

// ─── Mock data ────────────────────────────────────────────────────────────────
const CAMERAS = [
  { id: "CAM-01", label: "Main Entrance", status: "online", zone: "Entry" },
  { id: "CAM-02", label: "Dining Hall A", status: "online", zone: "Dining" },
  { id: "CAM-03", label: "Dining Hall B", status: "online", zone: "Dining" },
  { id: "CAM-04", label: "Bar Area", status: "online", zone: "Bar" },
  { id: "CAM-05", label: "Kitchen Entry", status: "online", zone: "Kitchen" },
  { id: "CAM-06", label: "Main Gate", status: "offline", zone: "Entry" },
  { id: "CAM-07", label: "Terrace", status: "online", zone: "Outdoor" },
  { id: "CAM-08", label: "VIP Lounge", status: "online", zone: "VIP" },
  { id: "CAM-09", label: "Parking Lot", status: "online", zone: "Entry" },
  { id: "CAM-10", label: "Staff Room", status: "online", zone: "Staff" },
  { id: "CAM-11", label: "Restrooms Hall", status: "online", zone: "Facility" },
  { id: "CAM-12", label: "Storage", status: "online", zone: "Staff" },
]

const INITIAL_ALERTS = [
  {
    id: 1,
    type: "system",
    severity: "warning",
    title: "Camera Offline: Main Gate",
    desc: "CAM-06 lost connection. Check network cable.",
    time: "2m ago",
  },
  {
    id: 2,
    type: "capacity",
    severity: "info",
    title: "Capacity reaching 90%",
    desc: "142 of 160 seats occupied. Consider waitlist.",
    time: "5m ago",
  },
]

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function SecurityPage() {
  const { user, isAuthenticated, isAuthReady } = useAuth()
  const router = useRouter()
  const [alerts, setAlerts] = useState(INITIAL_ALERTS)
  const [liveTime, setLiveTime] = useState("")
  const [activeCamera, setActiveCamera] = useState("CAM-02")
  const [floorTables, setFloorTables] = useState<Table[]>(mockTables)

  const isAuthorized = !!user && portalAllowedRoles.security.includes(user.role)

  useEffect(() => {
    if (!isAuthReady) return
    if (!isAuthenticated || !user) {
      router.replace("/login")
      return
    }
    if (!portalAllowedRoles.security.includes(user.role)) {
      router.replace(defaultPortalPath[user.role])
    }
  }, [isAuthReady, isAuthenticated, user, router])

  useEffect(() => {
    const tick = () =>
      setLiveTime(
        new Date().toLocaleTimeString("en-KE", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }),
      )
    tick()
    const id = setInterval(tick, 1000)
    const unsubTables = TableService.subscribe(setFloorTables)
    return () => {
      clearInterval(id)
      unsubTables()
    }
  }, [])

  if (!isAuthReady || !isAuthenticated || !user || !isAuthorized) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="flex items-center gap-2 text-xs uppercase text-muted-foreground font-heading">
          <Spinner className="size-4" />
          <span>TableTap Loading...</span>
        </div>
      </div>
    )
  }

  const onlineCams = CAMERAS.filter((c) => c.status === "online").length
  const offlineCams = CAMERAS.filter((c) => c.status === "offline").length
  const totalSeats = floorTables.reduce((sum, t) => sum + t.seats, 0) || 48
  const occupiedSeats = floorTables
    .filter((t) => t.status === "occupied")
    .reduce((sum, t) => sum + t.seats, 0)
  const capacity = Math.round((occupiedSeats / totalSeats) * 100)
  const totalGuests = occupiedSeats

  const dismissAlert = (id: number) =>
    setAlerts((prev) => prev.filter((a) => a.id !== id))

  return (
    <TooltipProvider>
      <SummonsListener />
      <div className="min-h-screen flex flex-col bg-background">
        {/* ── Header ─────────────────────────────────────────────── */}
        <header className="px-5 py-4 border-b border-border bg-background/95 backdrop-blur sticky top-0 z-20 flex items-center gap-4 shrink-0">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary text-primary-foreground shadow-sm shrink-0">
            <ShieldCheck className="h-5 w-5" strokeWidth={2} />
          </div>

          <div className="min-w-0 flex-1">
            <h1 className="text-sm font-semibold leading-none text-foreground">
              SecOps Center
            </h1>
            <p className="text-[11px] font-medium uppercase tracking-wide mt-1 text-muted-foreground">
              Resto HQ · {liveTime}
            </p>
          </div>

          <Badge
            variant={offlineCams > 0 ? "destructive" : "secondary"}
            className="gap-1.5 shrink-0"
          >
            <span
              className={cn(
                "w-1.5 h-1.5 rounded-full shrink-0",
                offlineCams > 0 ? "bg-current" : "bg-emerald-500",
              )}
            />
            {offlineCams > 0 ? `${offlineCams} Camera Offline` : "System Normal"}
          </Badge>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="icon" className="relative shrink-0" aria-label="Security notifications">
                <Bell className="size-4" />
                {alerts.length > 0 && (
                  <span className="absolute -top-1 -right-1 flex items-center justify-center rounded-full text-[9px] font-bold bg-destructive text-destructive-foreground min-w-4 h-4 px-1">
                    {alerts.length}
                  </span>
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              {alerts.length} active alert{alerts.length !== 1 ? "s" : ""}
            </TooltipContent>
          </Tooltip>
        </header>

        <div className="flex-1 p-4 lg:p-6 max-w-5xl mx-auto w-full space-y-5">
          {/* ── KPI row ──────────────────────────────────────────── */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              {
                label: "Total Guests",
                val: totalGuests,
                icon: Users,
                iconBg: "bg-primary/10 text-primary",
                sub: `Of ${totalSeats} capacity`,
              },
              {
                label: "Capacity",
                val: `${capacity}%`,
                icon: Crosshair,
                iconBg: "bg-destructive/10 text-destructive",
                sub: `${Math.max(0, totalSeats - occupiedSeats)} seats remaining`,
              },
              {
                label: "Live Cameras",
                val: `${onlineCams}/12`,
                icon: Camera,
                iconBg: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
                sub: `${offlineCams} offline`,
              },
              {
                label: "Incidents",
                val: "0",
                icon: Activity,
                iconBg: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
                sub: "All clear",
              },
            ].map((k) => (
              <Card key={k.label} size="sm" className="transition-shadow duration-150 ease-(--ease-out) hover:shadow-md">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <div className={cn("flex items-center justify-center size-8 rounded-lg", k.iconBg)}>
                      <k.icon className="size-4" />
                    </div>
                    <CardDescription className="text-xs font-medium">
                      {k.label}
                    </CardDescription>
                  </div>
                  {k.label === "Capacity" && (
                    <CardAction>
                      <Badge variant="destructive" className="text-[10px]">High</Badge>
                    </CardAction>
                  )}
                </CardHeader>
                <CardContent className="space-y-1.5">
                  <p className="text-2xl font-bold leading-none tabular-nums text-foreground">
                    {k.val}
                  </p>
                  {k.label === "Capacity" && (
                    <Progress value={capacity} className="h-1.5 mt-2" />
                  )}
                  <p className="text-xs text-muted-foreground">{k.sub}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* ── Main layout: Feed + Alerts + Camera Grid ─────────── */}
          <div className="grid md:grid-cols-3 gap-5 items-start">
            <div className="md:col-span-2 space-y-4">
              {/* Live feed */}
              <Card>
                <CardHeader className="border-b border-border">
                  <div className="flex items-center gap-2.5">
                    <div className="flex items-center justify-center size-8 rounded-lg bg-primary/10 text-primary">
                      <Eye className="size-4" />
                    </div>
                    <div>
                      <CardTitle className="text-sm">Live Monitor</CardTitle>
                      <CardDescription className="text-xs">
                        {CAMERAS.find((c) => c.id === activeCamera)?.label}
                      </CardDescription>
                    </div>
                  </div>
                  <CardAction>
                    <Badge variant="secondary" className="gap-1 text-emerald-700 dark:text-emerald-300">
                      <CircleDot className="size-3 animate-pulse" />
                      Recording
                    </Badge>
                  </CardAction>
                </CardHeader>
                <CardContent>
                  <div
                    className="relative w-full aspect-video rounded-xl overflow-hidden border border-border flex flex-col items-center justify-center bg-[#082420]"
                  >
                    <div
                      className="absolute inset-0 opacity-[0.04]"
                      style={{
                        backgroundImage:
                          "repeating-linear-gradient(45deg,#fff 0,#fff 1px,transparent 1px,transparent 20px)," +
                          "repeating-linear-gradient(-45deg,#fff 0,#fff 1px,transparent 1px,transparent 20px)",
                      }}
                    />
                    {["top-3 left-3", "top-3 right-3", "bottom-3 left-3", "bottom-3 right-3"].map((pos) => (
                      <div
                        key={pos}
                        className={cn(
                          "absolute w-4 h-4 border-2 border-white/20 rounded-[2px]",
                          pos,
                          pos.includes("right") ? "border-l-0" : "border-r-0",
                          pos.includes("bottom") ? "border-t-0" : "border-b-0",
                        )}
                      />
                    ))}
                    <Crosshair className="h-10 w-10 mb-3 text-white/20" />
                    <p className="text-[11px] font-bold uppercase text-white/40">
                      Encrypted Stream Active
                    </p>
                    <AnimatePresence mode="wait">
                      <motion.p
                        key={activeCamera}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={FAST_TRANSITION}
                        className="text-[10px] mt-1 font-mono text-white/30"
                      >
                        {activeCamera} · {liveTime}
                      </motion.p>
                    </AnimatePresence>
                  </div>
                </CardContent>
              </Card>

              {/* Camera grid */}
              <Card>
                <CardHeader className="border-b border-border">
                  <div className="flex items-center gap-2.5">
                    <div className="flex items-center justify-center size-8 rounded-lg bg-primary/10 text-primary">
                      <Camera className="size-4" />
                    </div>
                    <CardTitle className="text-sm">Camera Matrix</CardTitle>
                  </div>
                  <CardAction>
                    <div className="flex items-center gap-2 text-xs font-medium">
                      <Badge variant="outline" className="gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-500" />
                        {onlineCams} Online
                      </Badge>
                      {offlineCams > 0 && (
                        <Badge variant="destructive" className="gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-current" />
                          {offlineCams} Offline
                        </Badge>
                      )}
                    </div>
                  </CardAction>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {CAMERAS.map((cam) => {
                      const isActive = activeCamera === cam.id
                      const isOnline = cam.status === "online"
                      return (
                        <Button
                          key={cam.id}
                          type="button"
                          variant={isActive ? "secondary" : "outline"}
                          onClick={() => isOnline && setActiveCamera(cam.id)}
                          disabled={!isOnline}
                          className={cn(
                            "h-auto flex-col items-start justify-start p-3 text-left gap-1",
                            isActive && "border-primary/50 ring-1 ring-primary/20",
                          )}
                        >
                          <span
                            className={cn(
                              "w-1.5 h-1.5 rounded-full mb-1",
                              isOnline ? "bg-emerald-500" : "bg-destructive",
                            )}
                          />
                          <p className="text-xs font-semibold leading-tight text-foreground">
                            {cam.id}
                          </p>
                          <p className="text-[11px] truncate w-full text-muted-foreground font-normal">
                            {cam.label}
                          </p>
                          <Badge variant="outline" className="mt-1 text-[9px] uppercase px-1.5 py-0">
                            {cam.zone}
                          </Badge>
                        </Button>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Alerts panel */}
            <div>
              <Card className="sticky top-24">
                <CardHeader className="border-b border-border">
                  <div className="flex items-center gap-2.5">
                    <div className="flex items-center justify-center size-8 rounded-lg bg-destructive/10 text-destructive">
                      <AlertCircle className="size-4" />
                    </div>
                    <CardTitle className="text-sm">Recent Alerts</CardTitle>
                  </div>
                  {alerts.length > 0 && (
                    <CardAction>
                      <Badge variant="destructive">{alerts.length}</Badge>
                    </CardAction>
                  )}
                </CardHeader>

                <CardContent>
                  {alerts.length === 0 ? (
                    <Empty className="py-10">
                      <EmptyHeader>
                        <EmptyMedia variant="icon">
                          <ShieldCheck className="size-5 text-emerald-600 dark:text-emerald-400" />
                        </EmptyMedia>
                        <EmptyTitle className="text-sm">All clear</EmptyTitle>
                        <EmptyDescription className="text-xs">
                          No active alerts
                        </EmptyDescription>
                      </EmptyHeader>
                    </Empty>
                  ) : (
                    <div className="space-y-3">
                      <ItemGroup>
                        <AnimatePresence mode="popLayout" initial={false}>
                          {alerts.map((a) => (
                            <motion.div
                              key={a.id}
                              layout="position"
                              initial={{ opacity: 0, y: 6 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, x: 14, scale: 0.96 }}
                              transition={SPRING_SNAPPY}
                            >
                              <Item variant="outline" size="sm" className="group items-start">
                                <ItemMedia className="pt-1.5">
                                  <span
                                    className={cn(
                                      "w-2 h-2 rounded-full",
                                      a.severity === "warning" ? "bg-destructive" : "bg-primary",
                                    )}
                                  />
                                </ItemMedia>
                                <ItemContent>
                                  <ItemTitle className="text-xs font-semibold">{a.title}</ItemTitle>
                                  <ItemDescription className="text-xs leading-relaxed">
                                    {a.desc}
                                  </ItemDescription>
                                  <p className="text-[11px] mt-1 flex items-center gap-1 text-muted-foreground">
                                    <Clock className="size-3" />
                                    {a.time}
                                  </p>
                                </ItemContent>
                                <ItemActions>
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon-xs"
                                    onClick={() => dismissAlert(a.id)}
                                    aria-label="Dismiss"
                                    className="opacity-70 md:opacity-0 md:group-hover:opacity-100 focus:opacity-100 transition-opacity duration-150"
                                  >
                                    <X className="size-3" />
                                  </Button>
                                </ItemActions>
                              </Item>
                            </motion.div>
                          ))}
                        </AnimatePresence>
                      </ItemGroup>

                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setAlerts([])}
                        className="w-full text-xs uppercase tracking-wide text-muted-foreground"
                      >
                        Dismiss all
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  )
}
