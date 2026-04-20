"use client"

import { useState, useEffect } from "react"
import {
  ShieldCheckIcon as ShieldCheck, 
  ViewfinderCircleIcon as Crosshair, 
  UserGroupIcon as Users, 
  ChartBarIcon as Activity, 
  ExclamationCircleIcon as AlertCircle,
  VideoCameraIcon as Camera, 
  CheckIcon as Check, 
  WifiIcon as Wifi, 
  SignalIcon as WifiOff, 
  BoltIcon as Zap, 
  EyeIcon as Eye, 
  BellIcon as Bell,
  ArrowTrendingUpIcon as TrendingUp, 
  StopIcon as Circle, 
  CheckCircleIcon as CircleDot, 
  ClockIcon as Clock, 
  XMarkIcon as X,
} from "@heroicons/react/24/outline"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge }     from "@/components/ui/badge"
import { Button }    from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Progress }  from "@/components/ui/progress"
import {
  Tooltip, TooltipContent, TooltipProvider, TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

// ─── Mock data ────────────────────────────────────────────────────────────────
const CAMERAS = [
  { id:"CAM-01", label:"Main Entrance",  status:"online",  zone:"Entry"    },
  { id:"CAM-02", label:"Dining Hall A",  status:"online",  zone:"Dining"   },
  { id:"CAM-03", label:"Dining Hall B",  status:"online",  zone:"Dining"   },
  { id:"CAM-04", label:"Bar Area",       status:"online",  zone:"Bar"      },
  { id:"CAM-05", label:"Kitchen Entry",  status:"online",  zone:"Kitchen"  },
  { id:"CAM-06", label:"Main Gate",      status:"offline", zone:"Entry"    },
  { id:"CAM-07", label:"Terrace",        status:"online",  zone:"Outdoor"  },
  { id:"CAM-08", label:"VIP Lounge",     status:"online",  zone:"VIP"      },
  { id:"CAM-09", label:"Parking Lot",    status:"online",  zone:"Entry"    },
  { id:"CAM-10", label:"Staff Room",     status:"online",  zone:"Staff"    },
  { id:"CAM-11", label:"Restrooms Hall", status:"online",  zone:"Facility" },
  { id:"CAM-12", label:"Storage",        status:"online",  zone:"Staff"    },
]

const INITIAL_ALERTS = [
  { id:1, type:"system",   severity:"warning", title:"Camera Offline: Main Gate",    desc:"CAM-06 lost connection. Check network cable.", time:"2m ago" },
  { id:2, type:"capacity", severity:"info",    title:"Capacity reaching 90%",         desc:"142 of 160 seats occupied. Consider waitlist.", time:"5m ago" },
]

const ZONE_COLORS: Record<string,string> = {
  Entry:    "oklch(0.45 0.12 285)",
  Dining:   "oklch(0.62 0.16 150)",
  Bar:      "oklch(0.75 0.15 75)",
  Kitchen:  "oklch(0.65 0.18 25)",
  Outdoor:  "oklch(0.62 0.16 150)",
  VIP:      "oklch(0.45 0.12 285)",
  Staff:    "#9A94AA",
  Facility: "#9A94AA",
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function SecurityPage() {
  const [alerts,       setAlerts]       = useState(INITIAL_ALERTS)
  const [liveTime,     setLiveTime]     = useState("")
  const [activeCamera, setActiveCamera] = useState("CAM-02")

  useEffect(() => {
    const tick = () =>
      setLiveTime(new Date().toLocaleTimeString("en-KE", { hour:"2-digit", minute:"2-digit", second:"2-digit" }))
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  const onlineCams  = CAMERAS.filter(c => c.status === "online").length
  const offlineCams = CAMERAS.filter(c => c.status === "offline").length
  const capacity    = 85
  const totalGuests = 142

  const dismissAlert = (id: number) => setAlerts(prev => prev.filter(a => a.id !== id))

  return (
    <TooltipProvider>
      <div className="min-h-screen flex flex-col" style={{ background:"#F0EBF8" }}>

        {/* ── Header ─────────────────────────────────────────────── */}
        <header
          className="px-5 py-4 border-b sticky top-0 z-20 flex items-center gap-4 shrink-0"
          style={{
            background: "rgba(253,252,255,0.92)",
            backdropFilter: "blur(20px)",
            borderColor: "oklch(0.45 0.12 285 / 0.1)",
            boxShadow: "0 1px 12px oklch(0.45 0.12 285 / 0.06)",
          }}
        >
          <div
            className="flex items-center justify-center w-10 h-10 rounded-xl shrink-0"
            style={{ background:"oklch(0.45 0.12 285)", boxShadow:"0 4px 14px oklch(0.45 0.12 285 / 0.35)" }}
          >
            <ShieldCheck className="h-5 w-5 text-white" strokeWidth={2} />
          </div>

          <div className="min-w-0 flex-1">
            <h1 className="text-[15px] font-bold  leading-none" style={{ color:"#0D031B" }}>
              SecOps Center
            </h1>
            <p className="text-[10px] font-bold uppercase  mt-0.5" style={{ color:"#9A94AA" }}>
              Resto HQ · {liveTime}
            </p>
          </div>

          {/* Status badge */}
          <Badge
            className="flex items-center gap-1.5 text-[10px] font-bold px-3 py-1.5 rounded-full border shrink-0"
            style={{
              background: offlineCams > 0 ? "oklch(0.65 0.18 25 / 0.1)" : "oklch(0.62 0.16 150 / 0.1)",
              color:      offlineCams > 0 ? "oklch(0.55 0.18 25)"        : "oklch(0.42 0.14 150)",
              borderColor:offlineCams > 0 ? "oklch(0.65 0.18 25 / 0.25)" : "oklch(0.62 0.16 150 / 0.25)",
            }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full animate-pulse shrink-0"
              style={{ background: offlineCams > 0 ? "oklch(0.65 0.18 25)" : "oklch(0.62 0.16 150)" }}
            />
            {offlineCams > 0 ? `${offlineCams} Camera Offline` : "System Normal"}
          </Badge>

          {/* Bell */}
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                className="relative flex items-center justify-center w-9 h-9 rounded-xl border transition-all hover:bg-[#EBE6F8]"
                style={{ borderColor:"oklch(0.45 0.12 285 / 0.15)", color:"#736C83" }}
              >
                <Bell className="h-4 w-4" />
                {alerts.length > 0 && (
                  <span
                    className="absolute -top-1 -right-1 flex items-center justify-center rounded-full text-[9px] font-bold text-white"
                    style={{ minWidth:"16px", height:"16px", padding:"0 3px", background:"oklch(0.65 0.18 25)" }}
                  >
                    {alerts.length}
                  </span>
                )}
              </button>
            </TooltipTrigger>
            <TooltipContent>{alerts.length} active alert{alerts.length !== 1 ? "s" : ""}</TooltipContent>
          </Tooltip>
        </header>

        <div className="flex-1 p-4 lg:p-6 max-w-5xl mx-auto w-full space-y-5">

          {/* ── KPI row ──────────────────────────────────────────── */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label:"Total Guests", val:totalGuests,          suffix:"",       icon:Users,      accent:"oklch(0.45 0.12 285)", sub:"Of 160 capacity"        },
              { label:"Capacity",     val:`${capacity}%`,        suffix:"",       icon:Crosshair,  accent:"oklch(0.65 0.18 25)",  sub:"18 seats remaining"     },
              { label:"Live Cameras", val:`${onlineCams}/12`,    suffix:"",       icon:Camera,     accent:"oklch(0.62 0.16 150)", sub:`${offlineCams} offline` },
              { label:"Incidents",    val:"0",                   suffix:"today",  icon:Activity,   accent:"oklch(0.62 0.16 150)", sub:"All clear"              },
            ].map((k) => (
              <Card
                key={k.label}
                className="border rounded-2xl overflow-hidden shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
                style={{ background:"rgba(255,255,255,0.9)", borderColor:"oklch(0.45 0.12 285 / 0.1)" }}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div
                      className="flex items-center justify-center w-8 h-8 rounded-lg"
                      style={{ background:`${k.accent}18` }}
                    >
                      <k.icon className="h-4 w-4" style={{ color:k.accent }} />
                    </div>
                    {k.label === "Capacity" && (
                      <span
                        className="text-[9px] font-bold uppercase  px-1.5 py-0.5 rounded-full"
                        style={{ background:"oklch(0.65 0.18 25 / 0.12)", color:"oklch(0.55 0.18 25)" }}
                      >
                        High
                      </span>
                    )}
                  </div>
                  <p className="text-2xl font-bold leading-none tabular-nums" style={{ color:"#0D031B" }}>{k.val}</p>
                  <p className="text-[10px] font-bold uppercase  mt-1" style={{ color:"#9A94AA" }}>{k.label}</p>
                  {k.label === "Capacity" && (
                    <Progress value={capacity} className="h-1.5 mt-2 rounded-full" style={{ background:"rgba(0,0,0,0.06)" }} />
                  )}
                  <p className="text-[10px] mt-1.5" style={{ color:"#AEA6BF" }}>{k.sub}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* ── Main layout: Feed + Alerts + Camera Grid ─────────── */}
          <div className="grid md:grid-cols-3 gap-5 items-start">

            {/* Feed + camera list */}
            <div className="md:col-span-2 space-y-4">

              {/* Live feed */}
              <Card
                className="border rounded-3xl overflow-hidden shadow-sm"
                style={{ background:"rgba(255,255,255,0.9)", borderColor:"oklch(0.45 0.12 285 / 0.1)" }}
              >
                <CardHeader
                  className="px-5 py-4 border-b flex flex-row items-center justify-between"
                  style={{ borderColor:"oklch(0.45 0.12 285 / 0.08)" }}
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className="flex items-center justify-center w-8 h-8 rounded-lg"
                      style={{ background:"oklch(0.45 0.12 285 / 0.1)" }}
                    >
                      <Eye className="h-3.5 w-3.5" style={{ color:"oklch(0.45 0.12 285)" }} />
                    </div>
                    <div>
                      <CardTitle className="text-[13px] font-bold" style={{ color:"#0D031B" }}>Live Monitor</CardTitle>
                      <p className="text-[10px] uppercase  font-medium mt-0.5" style={{ color:"#9A94AA" }}>
                        {CAMERAS.find(c => c.id === activeCamera)?.label}
                      </p>
                    </div>
                  </div>
                  <Badge
                    className="flex items-center gap-1 text-[9px] font-bold px-2.5 py-1 rounded-full border"
                    style={{
                      background:"oklch(0.62 0.16 150 / 0.1)",
                      color:"oklch(0.42 0.14 150)",
                      borderColor:"oklch(0.62 0.16 150 / 0.2)",
                    }}
                  >
                    <CircleDot className="h-2.5 w-2.5 animate-pulse" />
                    Recording
                  </Badge>
                </CardHeader>
                <CardContent className="p-4">
                  {/* Video placeholder */}
                  <div
                    className="relative w-full aspect-video rounded-2xl overflow-hidden border flex flex-col items-center justify-center"
                    style={{ background:"#0D031B", borderColor:"rgba(255,255,255,0.08)" }}
                  >
                    <div
                      className="absolute inset-0 opacity-[0.04]"
                      style={{
                        backgroundImage:
                          "repeating-linear-gradient(45deg,#fff 0,#fff 1px,transparent 1px,transparent 20px)," +
                          "repeating-linear-gradient(-45deg,#fff 0,#fff 1px,transparent 1px,transparent 20px)",
                      }}
                    />
                    {/* Corner HUD marks */}
                    {["top-3 left-3","top-3 right-3","bottom-3 left-3","bottom-3 right-3"].map(pos => (
                      <div key={pos} className={cn("absolute w-4 h-4 border-2 border-white/20", pos.includes("right") ? "border-l-0 border-t-0" : "border-r-0 border-b-0", pos.includes("bottom") ? "border-t-0" : "border-b-0")} style={{ borderRadius:"2px" }} />
                    ))}
                    <Crosshair className="h-10 w-10 mb-3" style={{ color:"rgba(255,255,255,0.2)" }} />
                    <p className="text-[11px] font-bold uppercase " style={{ color:"rgba(255,255,255,0.4)" }}>
                      Encrypted Stream Active
                    </p>
                    <p className="text-[9px] mt-1 font-mono" style={{ color:"rgba(255,255,255,0.25)" }}>
                      {activeCamera} · {liveTime}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Camera grid */}
              <Card
                className="border rounded-3xl overflow-hidden shadow-sm"
                style={{ background:"rgba(255,255,255,0.9)", borderColor:"oklch(0.45 0.12 285 / 0.1)" }}
              >
                <CardHeader
                  className="px-5 py-4 border-b"
                  style={{ borderColor:"oklch(0.45 0.12 285 / 0.08)" }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="flex items-center justify-center w-8 h-8 rounded-lg" style={{ background:"oklch(0.45 0.12 285 / 0.1)" }}>
                        <Camera className="h-3.5 w-3.5" style={{ color:"oklch(0.45 0.12 285)" }} />
                      </div>
                      <CardTitle className="text-[13px] font-bold" style={{ color:"#0D031B" }}>Camera Matrix</CardTitle>
                    </div>
                    <div className="flex items-center gap-3 text-[10px] font-bold uppercase ">
                      <span className="flex items-center gap-1" style={{ color:"oklch(0.42 0.14 150)" }}>
                        <span className="w-2 h-2 rounded-full" style={{ background:"oklch(0.62 0.16 150)" }} />
                        {onlineCams} Online
                      </span>
                      {offlineCams > 0 && (
                        <span className="flex items-center gap-1" style={{ color:"oklch(0.55 0.18 25)" }}>
                          <span className="w-2 h-2 rounded-full" style={{ background:"oklch(0.65 0.18 25)" }} />
                          {offlineCams} Offline
                        </span>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {CAMERAS.map(cam => {
                      const isActive  = activeCamera === cam.id
                      const isOnline  = cam.status === "online"
                      const zoneColor = ZONE_COLORS[cam.zone] ?? "#9A94AA"
                      return (
                        <button
                          key={cam.id}
                          onClick={() => isOnline && setActiveCamera(cam.id)}
                          disabled={!isOnline}
                          className="relative flex flex-col items-start p-3 rounded-xl border text-left transition-all duration-200 hover:shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                          style={
                            isActive
                              ? { background:"oklch(0.45 0.12 285 / 0.08)", borderColor:"oklch(0.45 0.12 285 / 0.4)", boxShadow:"0 2px 10px oklch(0.45 0.12 285 / 0.12)" }
                              : { background:"#F5F2FB", borderColor:"oklch(0.45 0.12 285 / 0.1)" }
                          }
                        >
                          {/* Status dot */}
                          <span
                            className={cn("w-1.5 h-1.5 rounded-full mb-2", isOnline ? "animate-pulse" : "")}
                            style={{ background: isOnline ? "oklch(0.62 0.16 150)" : "oklch(0.65 0.18 25)" }}
                          />
                          <p className="text-[10px] font-bold leading-tight" style={{ color: isActive ? "oklch(0.45 0.12 285)" : "#0D031B" }}>
                            {cam.id}
                          </p>
                          <p className="text-[9px] truncate w-full mt-0.5" style={{ color:"#9A94AA" }}>
                            {cam.label}
                          </p>
                          <span
                            className="text-[8px] font-bold uppercase  mt-1.5 px-1.5 py-0.5 rounded-full"
                            style={{ background:`${zoneColor}18`, color:zoneColor }}
                          >
                            {cam.zone}
                          </span>
                        </button>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Alerts panel */}
            <div>
              <Card
                className="border rounded-3xl overflow-hidden shadow-sm sticky top-24"
                style={{ background:"rgba(255,255,255,0.9)", borderColor:"oklch(0.45 0.12 285 / 0.1)" }}
              >
                <div className="h-[3px]" style={{ background:"oklch(0.65 0.18 25)" }} />

                <CardHeader
                  className="px-5 py-4 border-b"
                  style={{ borderColor:"oklch(0.45 0.12 285 / 0.08)" }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="flex items-center justify-center w-8 h-8 rounded-lg" style={{ background:"oklch(0.65 0.18 25 / 0.1)" }}>
                        <AlertCircle className="h-3.5 w-3.5" style={{ color:"oklch(0.55 0.18 25)" }} />
                      </div>
                      <CardTitle className="text-[13px] font-bold" style={{ color:"#0D031B" }}>Recent Alerts</CardTitle>
                    </div>
                    {alerts.length > 0 && (
                      <Badge
                        className="text-[10px] font-bold px-2 py-0.5 rounded-full border"
                        style={{
                          background:"oklch(0.65 0.18 25 / 0.1)",
                          color:"oklch(0.55 0.18 25)",
                          borderColor:"oklch(0.65 0.18 25 / 0.25)",
                        }}
                      >
                        {alerts.length}
                      </Badge>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="p-4">
                  {alerts.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-10 gap-3">
                      <div
                        className="w-12 h-12 rounded-2xl flex items-center justify-center"
                        style={{ background:"oklch(0.62 0.16 150 / 0.1)" }}
                      >
                        <ShieldCheck className="h-6 w-6" style={{ color:"oklch(0.42 0.14 150)" }} />
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-bold" style={{ color:"#0D031B" }}>All clear</p>
                        <p className="text-xs mt-0.5" style={{ color:"#9A94AA" }}>No active alerts</p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {alerts.map(a => (
                        <div
                          key={a.id}
                          className="group relative flex items-start gap-3 p-3.5 rounded-2xl border transition-colors"
                          style={{
                            background: a.severity === "warning" ? "oklch(0.65 0.18 25 / 0.05)" : "oklch(0.45 0.12 285 / 0.04)",
                            borderColor: a.severity === "warning" ? "oklch(0.65 0.18 25 / 0.2)" : "oklch(0.45 0.12 285 / 0.12)",
                          }}
                        >
                          {/* Severity dot */}
                          <span
                            className="w-2 h-2 rounded-full shrink-0 mt-1.5"
                            style={{ background: a.severity === "warning" ? "oklch(0.65 0.18 25)" : "oklch(0.45 0.12 285)" }}
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-[12px] font-bold leading-tight" style={{ color:"#0D031B" }}>{a.title}</p>
                            <p className="text-[11px] mt-1 leading-relaxed" style={{ color:"#736C83" }}>{a.desc}</p>
                            <p className="text-[10px] mt-1.5 flex items-center gap-1" style={{ color:"#AEA6BF" }}>
                              <Clock className="h-3 w-3" />
                              {a.time}
                            </p>
                          </div>
                          <button
                            onClick={() => dismissAlert(a.id)}
                            className="opacity-0 group-hover:opacity-100 flex items-center justify-center w-6 h-6 rounded-lg shrink-0 transition-all hover:bg-[#EBE6F8] mt-0.5"
                            style={{ color:"#AEA6BF" }}
                            aria-label="Dismiss"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}

                      {/* Clear all */}
                      <button
                        onClick={() => setAlerts([])}
                        className="w-full text-[10px] font-bold uppercase  py-2 rounded-xl transition-colors hover:bg-[#EBE6F8]"
                        style={{ color:"#AEA6BF" }}
                      >
                        Dismiss all
                      </button>
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