"use client"

import { useState } from "react"
import {
  Plus, Calendar, Clock, Users, ChevronRight, ChevronLeft,
  CheckCircle2, MoreVertical, UserCheck, AlertCircle,
  Briefcase, Download, Eye, Edit, Trash2, TrendingUp,
  Activity, Bell, Zap, Timer,
} from "lucide-react"
import { Button }   from "@/components/ui/button"
import { Badge }    from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuTrigger, DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import {
  Tooltip, TooltipContent, TooltipProvider, TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

// ─── Data ─────────────────────────────────────────────────────────────────────
const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

const shifts = [
  { id:1, staff:"Peter Ochieng",  role:"Waiter",   day:"Mon", time:"8am – 4pm",  status:"completed", avatar:"PO" },
  { id:2, staff:"Grace Wanjiku",  role:"Manager",  day:"Mon", time:"9am – 6pm",  status:"completed", avatar:"GW" },
  { id:3, staff:"Mary Akinyi",    role:"Kitchen",  day:"Tue", time:"11am – 9pm", status:"active",    avatar:"MA" },
  { id:4, staff:"John Doe",       role:"Waiter",   day:"Tue", time:"2pm – 10pm", status:"active",    avatar:"JD" },
  { id:5, staff:"Alice Kipir",    role:"Kitchen",  day:"Wed", time:"8am – 4pm",  status:"upcoming",  avatar:"AK" },
  { id:6, staff:"Kevin M.",       role:"Waiter",   day:"Wed", time:"4pm – 12am", status:"upcoming",  avatar:"KM" },
  { id:7, staff:"Sarah Lee",      role:"Kitchen",  day:"Thu", time:"7am – 3pm",  status:"upcoming",  avatar:"SL" },
  { id:8, staff:"Michael Chen",   role:"Waiter",   day:"Thu", time:"3pm – 11pm", status:"upcoming",  avatar:"MC" },
]

// Role colours — all within the Lavender Light palette
const ROLE_CONFIG = {
  Waiter:  { bg:"oklch(0.45 0.12 285 / 0.1)", text:"oklch(0.38 0.12 285)", border:"oklch(0.45 0.12 285 / 0.25)", avatar:"oklch(0.45 0.12 285)" },
  Kitchen: { bg:"oklch(0.75 0.15 75 / 0.1)",  text:"oklch(0.55 0.15 75)",  border:"oklch(0.75 0.15 75 / 0.25)",  avatar:"oklch(0.75 0.15 75)"  },
  Manager: { bg:"oklch(0.62 0.16 150 / 0.1)", text:"oklch(0.42 0.14 150)", border:"oklch(0.62 0.16 150 / 0.25)", avatar:"oklch(0.62 0.16 150)" },
}

const STATUS_CONFIG = {
  completed: { label:"Completed", bg:"oklch(0.62 0.16 150 / 0.1)", text:"oklch(0.42 0.14 150)", border:"oklch(0.62 0.16 150 / 0.25)", icon:CheckCircle2 },
  active:    { label:"Active",    bg:"oklch(0.45 0.12 285 / 0.1)", text:"oklch(0.38 0.12 285)", border:"oklch(0.45 0.12 285 / 0.25)", icon:Activity     },
  upcoming:  { label:"Upcoming",  bg:"oklch(0.75 0.15 75 / 0.1)",  text:"oklch(0.55 0.15 75)",  border:"oklch(0.75 0.15 75 / 0.25)",  icon:Timer        },
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function ManagerSchedulePage() {
  const [activeDay, setActiveDay] = useState("Tue")
  const todayShifts = shifts.filter(s => s.day === activeDay)

  const completedCount = todayShifts.filter(s => s.status === "completed").length
  const activeCount    = todayShifts.filter(s => s.status === "active").length
  const upcomingCount  = todayShifts.filter(s => s.status === "upcoming").length

  return (
    <TooltipProvider>
      <div className="min-h-screen pb-16" style={{ background:"#F0EBF8" }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-6 space-y-5">

          {/* ── Page header ──────────────────────────────────────── */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div
                className="flex items-center justify-center w-10 h-10 rounded-xl shrink-0"
                style={{ background:"oklch(0.45 0.12 285)", boxShadow:"0 4px 14px oklch(0.45 0.12 285 / 0.35)" }}
              >
                <Calendar className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-[17px] font-bold tracking-tight leading-none" style={{ color:"#0D031B" }}>
                  Staff Schedule
                </h1>
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] mt-0.5" style={{ color:"#9A94AA" }}>
                  Resource Allocation & Weekly Rostering
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    className="h-10 px-4 gap-2 rounded-xl font-bold text-[11px] uppercase tracking-wider border transition-all hover:-translate-y-0.5"
                    style={{ borderColor:"oklch(0.45 0.12 285 / 0.2)", color:"#736C83", background:"rgba(255,255,255,0.8)" }}
                  >
                    <Zap className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">Auto-Generate</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>AI-generate optimal schedule</TooltipContent>
              </Tooltip>

              <Button
                className="h-10 px-4 gap-2 text-white font-bold rounded-xl border-none text-[11px] uppercase tracking-wider transition-all hover:-translate-y-0.5"
                style={{ background:"oklch(0.45 0.12 285)", boxShadow:"0 4px 16px oklch(0.45 0.12 285 / 0.35)" }}
              >
                <Plus className="h-3.5 w-3.5" />
                Add Shift
              </Button>
            </div>
          </div>

          {/* ── Week navigator ───────────────────────────────────── */}
          <Card
            className="rounded-3xl shadow-sm overflow-hidden"
            style={{ background:"rgba(255,255,255,0.9)", borderColor:"oklch(0.45 0.12 285 / 0.12)" }}
          >
            <CardContent className="p-3">
              <div className="flex items-center gap-2">
                <button
                  className="flex items-center justify-center w-9 h-9 rounded-xl shrink-0 transition-all hover:bg-[#EBE6F8] hover:-translate-x-0.5"
                  style={{ borderColor:"oklch(0.45 0.12 285 / 0.15)", color:"#736C83" }}
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>

                <div className="flex gap-1.5 flex-1 overflow-x-auto no-scrollbar">
                  {DAYS.map(day => {
                    const active     = activeDay === day
                    const dayShifts  = shifts.filter(s => s.day === day)
                    const hasActive  = dayShifts.some(s => s.status === "active")
                    return (
                      <button
                        key={day}
                        onClick={() => setActiveDay(day)}
                        className="relative flex flex-col items-center gap-0.5 px-3 sm:px-5 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all duration-200 shrink-0"
                        style={
                          active
                            ? { background:"oklch(0.45 0.12 285)", color:"white", borderColor:"transparent", boxShadow:"0 3px 10px oklch(0.45 0.12 285 / 0.3)" }
                            : { background:"transparent", color:"#9A94AA", borderColor:"transparent" }
                        }
                      >
                        <span className="hidden sm:block">{day}</span>
                        <span className="sm:hidden">{day[0]}</span>
                        {/* Shift count dot */}
                        {dayShifts.length > 0 && (
                          <span
                            className="text-[8px] leading-none font-bold"
                            style={{ color: active ? "rgba(255,255,255,0.7)" : "#AEA6BF" }}
                          >
                            {dayShifts.length}
                          </span>
                        )}
                        {/* Active indicator */}
                        {hasActive && !active && (
                          <span
                            className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full animate-pulse"
                            style={{ background:"oklch(0.62 0.16 150)" }}
                          />
                        )}
                      </button>
                    )
                  })}
                </div>

                <button
                  className="flex items-center justify-center w-9 h-9 rounded-xl shrink-0 transition-all hover:bg-[#EBE6F8] hover:translate-x-0.5"
                  style={{ borderColor:"oklch(0.45 0.12 285 / 0.15)", color:"#736C83" }}
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </CardContent>
          </Card>

          {/* ── Main layout ──────────────────────────────────────── */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-start">

            {/* ── Shift list ───────────────────────────────────── */}
            <div className="lg:col-span-2">
              <Card
                className="rounded-3xl shadow-sm overflow-hidden"
                style={{ background:"rgba(255,255,255,0.9)", borderColor:"oklch(0.45 0.12 285 / 0.12)" }}
              >

                <CardHeader
                  className="px-5 py-4"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className="flex items-center justify-center w-9 h-9 rounded-xl"
                        style={{ background:"oklch(0.45 0.12 285 / 0.1)" }}
                      >
                        <Clock className="h-4 w-4" style={{ color:"oklch(0.45 0.12 285)" }} />
                      </div>
                      <div>
                        <CardTitle className="text-[14px] font-bold" style={{ color:"#0D031B" }}>
                          {activeDay}'s Schedule
                        </CardTitle>
                        <p className="text-[10px] font-medium mt-0.5" style={{ color:"#9A94AA" }}>
                          {todayShifts.length} shift{todayShifts.length !== 1 ? "s" : ""} scheduled
                        </p>
                      </div>
                    </div>

                    {/* Status summary pills */}
                    <div className="hidden sm:flex items-center gap-1.5">
                      {activeCount > 0 && (
                        <span
                          className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider px-2 py-1 rounded-full"
                          style={{ background:"oklch(0.45 0.12 285 / 0.1)", color:"oklch(0.38 0.12 285)" }}
                        >
                          <Activity className="h-2.5 w-2.5 animate-pulse" />
                          {activeCount} active
                        </span>
                      )}
                      {upcomingCount > 0 && (
                        <span
                          className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider px-2 py-1 rounded-full"
                          style={{ background:"oklch(0.75 0.15 75 / 0.1)", color:"oklch(0.55 0.15 75)" }}
                        >
                          <Timer className="h-2.5 w-2.5" />
                          {upcomingCount} upcoming
                        </span>
                      )}
                    </div>
                  </div>
                </CardHeader>

                <ScrollArea className="max-h-[520px]">
                  {todayShifts.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-4">
                      <div
                        className="w-14 h-14 rounded-2xl flex items-center justify-center"
                        style={{ background:"#F5F2FB", borderColor:"oklch(0.45 0.12 285 / 0.15)" }}
                      >
                        <Calendar className="h-7 w-7" style={{ color:"#AEA6BF" }} />
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-semibold" style={{ color:"#0D031B" }}>No shifts scheduled</p>
                        <p className="text-xs mt-1" style={{ color:"#9A94AA" }}>
                          No shifts published for {activeDay}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div>
                      {todayShifts.map(s => {
                        const role   = ROLE_CONFIG[s.role as keyof typeof ROLE_CONFIG]
                        const status = STATUS_CONFIG[s.status as keyof typeof STATUS_CONFIG]
                        const StatusIcon = status.icon

                        return (
                          <div
                            key={s.id}
                            className="group flex items-center gap-4 px-5 py-4 transition-colors hover:bg-[#F5F2FB]"
                          >
                            {/* Avatar */}
                            <Avatar className="h-11 w-11 shrink-0">
                              <AvatarFallback
                                className="text-xs font-bold"
                                style={{ background:`${role.avatar}15`, color:role.avatar }}
                              >
                                {s.avatar}
                              </AvatarFallback>
                            </Avatar>

                            {/* Info */}
                            <div className="flex-1 min-w-0">
                              <p className="text-[13px] font-bold truncate" style={{ color:"#0D031B" }}>
                                {s.staff}
                              </p>
                              <div className="flex items-center gap-2 mt-1 flex-wrap">
                                <span
                                  className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border"
                                  style={{ background:role.bg, color:role.text, borderColor:role.border }}
                                >
                                  {s.role}
                                </span>
                                <span className="flex items-center gap-1 text-[10px] font-medium" style={{ color:"#9A94AA" }}>
                                  <Clock className="h-3 w-3" />
                                  {s.time}
                                </span>
                              </div>
                            </div>

                            {/* Status badge */}
                            <span
                              className="hidden sm:flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-wider px-2.5 py-1.5 rounded-full shrink-0"
                              style={{ background:status.bg, color:status.text, borderColor:status.border }}
                            >
                              <StatusIcon className="h-3 w-3" />
                              {status.label}
                            </span>

                            {/* Context menu */}
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <button
                                  className="opacity-0 group-hover:opacity-100 flex items-center justify-center w-8 h-8 rounded-xl shrink-0 transition-all hover:bg-[#EBE6F8]"
                                  style={{ color:"#AEA6BF" }}
                                >
                                  <MoreVertical className="h-4 w-4" />
                                </button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent
                                align="end"
                                className="w-44 rounded-2xl p-1.5"
                                style={{ background:"#FDFCFF", borderColor:"oklch(0.45 0.12 285 / 0.15)", boxShadow:"0 8px 28px rgba(13,3,27,0.12)" }}
                              >
                                <DropdownMenuItem className="flex items-center gap-2 text-[11px] font-semibold rounded-xl px-2.5 py-2 cursor-pointer" style={{ color:"oklch(0.45 0.12 285)" }}>
                                  <Eye className="h-3.5 w-3.5" /> View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem className="flex items-center gap-2 text-[11px] font-semibold rounded-xl px-2.5 py-2 cursor-pointer" style={{ color:"#3D374C" }}>
                                  <Edit className="h-3.5 w-3.5" /> Edit Shift
                                </DropdownMenuItem>
                                <DropdownMenuItem className="flex items-center gap-2 text-[11px] font-semibold rounded-xl px-2.5 py-2 cursor-pointer" style={{ color:"#3D374C" }}>
                                  <Bell className="h-3.5 w-3.5" /> Notify Staff
                                </DropdownMenuItem>
                                <DropdownMenuItem className="flex items-center gap-2 text-[11px] font-semibold rounded-xl px-2.5 py-2 cursor-pointer text-red-500">
                                  <Trash2 className="h-3.5 w-3.5" /> Cancel Shift
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </ScrollArea>
              </Card>
            </div>

            {/* ── Sidebar ──────────────────────────────────────── */}
            <div className="space-y-4">

              {/* Staffing overview */}
              <Card
                className="rounded-3xl shadow-sm overflow-hidden"
                style={{ background:"rgba(255,255,255,0.9)", borderColor:"oklch(0.45 0.12 285 / 0.12)" }}
              >

                <CardHeader
                  className="px-5 py-4"
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className="flex items-center justify-center w-8 h-8 rounded-lg"
                      style={{ background:"oklch(0.75 0.15 75 / 0.12)" }}
                    >
                      <TrendingUp className="h-3.5 w-3.5" style={{ color:"oklch(0.55 0.15 75)" }} />
                    </div>
                    <CardTitle className="text-[13px] font-bold" style={{ color:"#0D031B" }}>
                      Staffing Overview
                    </CardTitle>
                  </div>
                </CardHeader>

                <CardContent className="px-5 py-4 space-y-3">
                  {[
                    { label:"On Duty",           value:"14",   icon:UserCheck,  accent:"oklch(0.62 0.16 150)" },
                    { label:"Stations Covered",  value:"100%", icon:Briefcase,  accent:"oklch(0.45 0.12 285)" },
                    { label:"Overtime Risk",      value:"2",   icon:AlertCircle,accent:"oklch(0.65 0.18 25)"  },
                  ].map(stat => (
                    <div
                      key={stat.label}
                      className="flex items-center justify-between px-3 py-3 rounded-2xl"
                      style={{ background:"#F5F2FB", borderColor:"oklch(0.45 0.12 285 / 0.08)" }}
                    >
                      <div className="flex items-center gap-2.5">
                        <div
                          className="flex items-center justify-center w-7 h-7 rounded-lg shrink-0"
                          style={{ background:`${stat.accent}18` }}
                        >
                          <stat.icon className="h-3.5 w-3.5" style={{ color:stat.accent }} />
                        </div>
                        <span className="text-[11px] font-semibold" style={{ color:"#736C83" }}>
                          {stat.label}
                        </span>
                      </div>
                      <span className="text-lg font-bold tabular-nums" style={{ color:"#0D031B" }}>
                        {stat.value}
                      </span>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Shift breakdown */}
              <Card
                className="rounded-3xl shadow-sm overflow-hidden"
                style={{ background:"rgba(255,255,255,0.9)", borderColor:"oklch(0.45 0.12 285 / 0.12)" }}
              >
                <CardContent className="px-5 py-4 space-y-4">
                  <p className="text-[11px] font-bold uppercase tracking-[0.18em]" style={{ color:"#9A94AA" }}>
                    {activeDay} Breakdown
                  </p>

                  {[
                    { label:"Completed", count:completedCount,  total:todayShifts.length, accent:"oklch(0.62 0.16 150)", icon:CheckCircle2 },
                    { label:"Active",    count:activeCount,     total:todayShifts.length, accent:"oklch(0.45 0.12 285)", icon:Activity     },
                    { label:"Upcoming",  count:upcomingCount,   total:todayShifts.length, accent:"oklch(0.75 0.15 75)",  icon:Timer        },
                  ].map(row => {
                    const pct = todayShifts.length > 0 ? Math.round((row.count / todayShifts.length) * 100) : 0
                    return (
                      <div key={row.label} className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <row.icon className="h-3.5 w-3.5" style={{ color:row.accent }} />
                            <span className="text-[11px] font-semibold" style={{ color:"#736C83" }}>{row.label}</span>
                          </div>
                          <span className="text-[11px] font-bold tabular-nums" style={{ color:"#0D031B" }}>
                            {row.count}/{row.total}
                          </span>
                        </div>
                        <div className="h-1.5 rounded-full overflow-hidden" style={{ background:"oklch(0.45 0.12 285 / 0.08)" }}>
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{ width:`${pct}%`, background:row.accent }}
                          />
                        </div>
                      </div>
                    )
                  })}
                </CardContent>
              </Card>

              {/* Quotas card */}
              <Card
                className="rounded-3xl shadow-sm overflow-hidden"
                style={{ background:"oklch(0.45 0.12 285)", borderColor:"transparent" }}
              >

                <CardContent className="px-5 py-5 text-center relative">
                  <div
                    className="flex items-center justify-center w-12 h-12 rounded-2xl mx-auto mb-3"
                    style={{ background:"rgba(255,255,255,0.15)" }}
                  >
                    <CheckCircle2 className="h-6 w-6 text-white" />
                  </div>
                  <p className="text-white font-bold text-[15px] tracking-tight leading-none">
                    Quotas Satisfied
                  </p>
                  <p className="text-[11px] mt-2 leading-relaxed" style={{ color:"rgba(255,255,255,0.65)" }}>
                    All roles for the current shift period are fully staffed.
                  </p>

                  <button
                    className="w-full flex items-center justify-center gap-2 h-10 mt-4 rounded-2xl font-bold text-[11px] uppercase tracking-widest transition-all hover:-translate-y-0.5 hover:shadow-lg"
                    style={{
                      background:"rgba(255,255,255,0.15)",
                      color:"white",
                    }}
                  >
                    <Download className="h-3.5 w-3.5" />
                    Export Roster
                  </button>
                </CardContent>
              </Card>

            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  )
}