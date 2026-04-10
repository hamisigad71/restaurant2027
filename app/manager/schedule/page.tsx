"use client"

import { useState } from "react"
import { 
  Plus, 
  Calendar, 
  Clock, 
  Users, 
  ChevronRight,
  ChevronLeft,
  Filter,
  CheckCircle2,
  MoreVertical,
  UserCheck,
  AlertCircle,
  Briefcase,
  Download,
  Eye,
  Edit,
  Trash2,
  TrendingUp,
  Activity,
  Star,
  Bell,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
const shifts = [
  { id: 1, staff: "Peter Ochieng", role: "Waiter", day: "Mon", time: "8am - 4pm", status: "completed", avatar: "PO" },
  { id: 2, staff: "Grace Wanjiku", role: "Manager", day: "Mon", time: "9am - 6pm", status: "completed", avatar: "GW" },
  { id: 3, staff: "Mary Akinyi", role: "Kitchen", day: "Tue", time: "11am - 9pm", status: "active", avatar: "MA" },
  { id: 4, staff: "John Doe", role: "Waiter", day: "Tue", time: "2pm - 10pm", status: "active", avatar: "JD" },
  { id: 5, staff: "Alice Kipir", role: "Kitchen", day: "Wed", time: "8am - 4pm", status: "upcoming", avatar: "AK" },
  { id: 6, staff: "Kevin M.", role: "Waiter", day: "Wed", time: "4pm - 12am", status: "upcoming", avatar: "KM" },
  { id: 7, staff: "Sarah Lee", role: "Kitchen", day: "Thu", time: "7am - 3pm", status: "upcoming", avatar: "SL" },
  { id: 8, staff: "Michael Chen", role: "Waiter", day: "Thu", time: "3pm - 11pm", status: "upcoming", avatar: "MC" },
]

const roleConfig = {
  Waiter: { gradient: "from-blue-500 to-blue-600", bg: "bg-blue-50", text: "text-blue-600" },
  Kitchen: { gradient: "from-orange-500 to-orange-600", bg: "bg-orange-50", text: "text-orange-600" },
  Manager: { gradient: "from-purple-500 to-purple-600", bg: "bg-purple-50", text: "text-purple-600" },
}

export default function ManagerSchedulePage() {
  const [activeDay, setActiveDay] = useState("Tue")

  const todayShifts = shifts.filter(s => s.day === activeDay)

  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(135deg, #F8F6FC 0%, #F0EBF8 50%, #E8E3F5 100%)" }}>
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 pb-24 space-y-6 sm:space-y-8">
        
        {/* ── Enhanced Header ────────────────────────────────────────────── */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 lg:gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-3 sm:gap-4">
              <div 
                className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center shadow-lg"
                style={{
                  background: "linear-gradient(135deg, oklch(0.42 0.14 285) 0%, oklch(0.38 0.16 275) 100%)",
                }}
              >
                <Calendar className="h-6 w-6 sm:h-7 sm:w-7 text-white" strokeWidth={2.5} />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-medium tracking-tight leading-none" style={{ color: "#0D031B" }}>
                  Staff Schedule
                </h1>
                <div className="flex items-center gap-2 mt-1.5">
                  <div className="h-px w-8 bg-gradient-to-r from-oklch(0.42 0.14 285) to-transparent" />
                  <p className="text-[10px] sm:text-[11px] font-medium uppercase tracking-wider" style={{ color: "#736C83" }}>
                    Resource Allocation & Weekly Rostering
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <Button 
              variant="outline"
              className="h-11 sm:h-12 px-5 sm:px-6 gap-2 font-medium rounded-[14px] text-xs uppercase tracking-wide transition-all hover:scale-105 active:scale-95 border-2"
              style={{
                borderColor: "oklch(0.42 0.14 285 / 0.15)",
                color: "#736C83",
              }}
            >
              <Activity className="h-4 w-4" strokeWidth={2.5} />
              Auto-Generate
            </Button>
            <Button 
              className="h-11 sm:h-12 px-5 sm:px-6 gap-2.5 text-white font-medium rounded-[14px] shadow-xl border-0 text-xs uppercase tracking-wide transition-all hover:-translate-y-0.5 hover:shadow-2xl active:translate-y-0 active:scale-95"
              style={{
                background: "linear-gradient(135deg, oklch(0.42 0.14 285) 0%, oklch(0.38 0.16 275) 100%)",
                boxShadow: "0 8px 32px oklch(0.42 0.14 285 / 0.35)",
              }}
            >
              <Plus className="h-4 w-4" strokeWidth={2.5} />
              Add Shift
            </Button>
          </div>
        </div>

        {/* ── Enhanced Week Picker ────────────────────────────────────────── */}
        <Card 
          className="border-0 rounded-[20px] shadow-lg overflow-hidden"
          style={{ background: "rgba(255,255,255,0.95)", backdropFilter: "blur(20px)" }}
        >
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center justify-between gap-2">
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-10 w-10 rounded-xl transition-all hover:scale-110 active:scale-95 shrink-0"
                style={{ color: "#736C83" }}
              >
                <ChevronLeft className="h-5 w-5" strokeWidth={2.5} />
              </Button>
              
              <div className="flex gap-1.5 overflow-x-auto no-scrollbar flex-1">
                {days.map((day) => (
                  <Button
                    key={day}
                    onClick={() => setActiveDay(day)}
                    className={cn(
                      "h-11 px-4 sm:px-6 rounded-xl font-medium text-[11px] uppercase tracking-wide transition-all duration-300 border-0 shrink-0",
                      activeDay === day 
                        ? "text-white shadow-lg scale-105" 
                        : "bg-transparent hover:bg-oklch(0.42 0.14 285 / 0.08)"
                    )}
                    style={
                      activeDay === day
                        ? {
                            background: "linear-gradient(135deg, oklch(0.42 0.14 285) 0%, oklch(0.38 0.16 275) 100%)",
                            boxShadow: "0 4px 16px oklch(0.42 0.14 285 / 0.3)",
                          }
                        : { color: "#9A94AA" }
                    }
                  >
                    <span className="hidden sm:inline">{day}</span>
                    <span className="sm:hidden">{day.slice(0, 1)}</span>
                  </Button>
                ))}
              </div>
              
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-10 w-10 rounded-xl transition-all hover:scale-110 active:scale-95 shrink-0"
                style={{ color: "#736C83" }}
              >
                <ChevronRight className="h-5 w-5" strokeWidth={2.5} />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* ── Main Grid ─────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          
          {/* ── Enhanced Schedule List ──────────────────────────────────── */}
          <div className="lg:col-span-2 space-y-4">
            <Card 
              className="border-0 bg-white rounded-[24px] shadow-xl overflow-hidden"
              style={{ boxShadow: "0 8px 32px rgba(0,0,0,0.08)" }}
            >
              <CardHeader className="px-5 sm:px-6 py-5 border-b" style={{ borderColor: "oklch(0.42 0.14 285 / 0.08)" }}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{ background: "oklch(0.42 0.14 285 / 0.1)" }}
                    >
                      <Clock className="h-5 w-5" style={{ color: "oklch(0.42 0.14 285)" }} strokeWidth={2.5} />
                    </div>
                    <div>
                      <CardTitle className="text-sm sm:text-base font-medium uppercase tracking-tight" style={{ color: "#0D031B" }}>
                        {activeDay}'s Schedule
                      </CardTitle>
                      <p className="text-[10px] font-medium mt-0.5" style={{ color: "#9A94AA" }}>
                        {todayShifts.length} shift{todayShifts.length !== 1 ? 's' : ''} scheduled
                      </p>
                    </div>
                  </div>

                  <Badge 
                    className="flex items-center gap-1.5 text-[10px] font-medium px-3 py-1 rounded-lg border bg-emerald-50 text-emerald-600 border-emerald-200"
                  >
                    <CheckCircle2 className="h-3 w-3" strokeWidth={2.5} />
                    Active
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="p-0">
                <div className="divide-y" style={{ borderColor: "oklch(0.42 0.14 285 / 0.05)" }}>
                  {todayShifts.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 sm:py-24 gap-4 px-4">
                      <div 
                        className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center"
                        style={{ background: "oklch(0.42 0.14 285 / 0.08)" }}
                      >
                        <Calendar className="h-8 w-8 sm:h-10 sm:w-10" style={{ color: "#AEA6BF" }} strokeWidth={2.5} />
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-medium" style={{ color: "#0D031B" }}>No shifts published</p>
                        <p className="text-xs mt-1" style={{ color: "#9A94AA" }}>
                          No shifts scheduled for {activeDay}
                        </p>
                      </div>
                    </div>
                  ) : (
                    todayShifts.map((s) => {
                      const config = roleConfig[s.role as keyof typeof roleConfig]
                      
                      return (
                        <div 
                          key={s.id} 
                          className="group flex items-center justify-between p-4 sm:p-6 transition-all hover:bg-oklch(0.42 0.14 285 / 0.02)"
                        >
                          <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                            {/* Avatar */}
                            <div 
                              className="w-12 h-12 sm:w-14 sm:h-14 rounded-[18px] flex items-center justify-center font-medium text-white shrink-0 shadow-md"
                              style={{
                                background: `linear-gradient(135deg, ${config ? `var(--tw-gradient-stops)` : 'oklch(0.42 0.14 285), oklch(0.38 0.16 275)'})`,
                              }}
                            >
                              <span className="text-lg">{s.avatar}</span>
                            </div>

                            {/* Info */}
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-sm sm:text-base uppercase leading-tight truncate" style={{ color: "#0D031B" }}>
                                {s.staff}
                              </p>
                              <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                                <Badge 
                                  className={cn(
                                    "text-[9px] font-medium uppercase px-2 py-0.5 rounded-lg border",
                                    config?.bg,
                                    config?.text
                                  )}
                                  style={{ borderColor: "transparent" }}
                                >
                                  {s.role}
                                </Badge>
                                <span className="text-[10px] font-medium flex items-center gap-1" style={{ color: "#9A94AA" }}>
                                  <Clock className="h-3 w-3" strokeWidth={2.5} />
                                  {s.time}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Status & Actions */}
                          <div className="flex items-center gap-3 shrink-0 ml-3">
                            <Badge 
                              className={cn(
                                "hidden sm:flex items-center gap-1.5 text-[10px] font-medium uppercase px-3 py-1.5 rounded-xl border-2",
                                s.status === "completed" 
                                  ? "bg-emerald-50 text-emerald-600 border-emerald-200" 
                                  : s.status === "active"
                                  ? "bg-purple-50 text-purple-600 border-purple-200"
                                  : "bg-amber-50 text-amber-600 border-amber-200"
                              )}
                            >
                              {s.status === "completed" && <CheckCircle2 className="h-3 w-3" strokeWidth={2.5} />}
                              {s.status === "active" && <Activity className="h-3 w-3" strokeWidth={2.5} />}
                              {s.status === "upcoming" && <Clock className="h-3 w-3" strokeWidth={2.5} />}
                              {s.status}
                            </Badge>

                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="h-9 w-9 rounded-xl opacity-0 group-hover:opacity-100 transition-all hover:bg-oklch(0.42 0.14 285 / 0.08) active:scale-90"
                                >
                                  <MoreVertical className="h-4 w-4" style={{ color: "#9A94AA" }} />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="bg-white/98 backdrop-blur-xl border-0 rounded-2xl shadow-2xl w-48">
                                <DropdownMenuItem className="text-xs font-medium rounded-xl m-1 focus:bg-oklch(0.42 0.14 285 / 0.08)">
                                  <Eye className="h-3.5 w-3.5 mr-2" />
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-xs font-medium rounded-xl m-1 focus:bg-oklch(0.42 0.14 285 / 0.08)">
                                  <Edit className="h-3.5 w-3.5 mr-2" />
                                  Edit Shift
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-xs font-medium rounded-xl m-1 focus:bg-oklch(0.42 0.14 285 / 0.08)">
                                  <Bell className="h-3.5 w-3.5 mr-2" />
                                  Notify Staff
                                </DropdownMenuItem>
                                <DropdownMenuSeparator className="my-1" style={{ background: "oklch(0.42 0.14 285 / 0.08)" }} />
                                <DropdownMenuItem className="text-xs font-medium rounded-xl m-1 focus:bg-rose-50 text-rose-600">
                                  <Trash2 className="h-3.5 w-3.5 mr-2" />
                                  Cancel Shift
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      )
                    })
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* ── Enhanced Sidebar Stats ──────────────────────────────────── */}
          <div className="space-y-5 sm:space-y-6">
            
            {/* Stats Card */}
            <Card 
              className="border-0 bg-white rounded-[24px] shadow-xl overflow-hidden"
              style={{ boxShadow: "0 8px 32px rgba(0,0,0,0.08)" }}
            >
              <CardContent className="p-5 sm:p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div 
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ background: "oklch(0.42 0.14 285 / 0.1)" }}
                  >
                    <TrendingUp className="h-5 w-5" style={{ color: "oklch(0.42 0.14 285)" }} strokeWidth={2.5} />
                  </div>
                  <h3 className="font-medium text-sm uppercase tracking-tight" style={{ color: "#0D031B" }}>
                    Staffing Overview
                  </h3>
                </div>

                <div className="space-y-5">
                  {[
                    { label: "On Duty", value: "14", icon: UserCheck, gradient: "from-emerald-500 to-emerald-600" },
                    { label: "Stations Covered", value: "100%", icon: Briefcase, gradient: "from-purple-500 to-purple-600" },
                    { label: "Overtime Risk", value: "2", icon: AlertCircle, gradient: "from-amber-500 to-amber-600" },
                  ].map((stat, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-xl transition-all hover:bg-oklch(0.42 0.14 285 / 0.03)">
                      <div className="flex items-center gap-3">
                        <div 
                          className={cn(
                            "w-9 h-9 rounded-lg flex items-center justify-center bg-gradient-to-br",
                            stat.gradient
                          )}
                        >
                          <stat.icon className="h-4.5 w-4.5 text-white" strokeWidth={2.5} />
                        </div>
                        <span className="text-[11px] font-medium uppercase tracking-wide" style={{ color: "#736C83" }}>
                          {stat.label}
                        </span>
                      </div>
                      <span className="text-xl font-medium" style={{ color: "#0D031B" }}>{stat.value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Success Card */}
            <Card 
              className="border-0 rounded-[24px] shadow-xl overflow-hidden relative"
              style={{
                background: "linear-gradient(135deg, oklch(0.65 0.18 150) 0%, oklch(0.70 0.20 160) 100%)",
                boxShadow: "0 12px 40px oklch(0.65 0.18 150 / 0.3)",
              }}
            >
              {/* Decorative orbs */}
              <div className="absolute -top-12 -right-12 w-40 h-40 rounded-full opacity-10 blur-3xl bg-white" />
              <div className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full opacity-10 blur-2xl bg-white" />

              <CardContent className="p-6 text-center relative z-10">
                <div 
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg"
                  style={{ background: "rgba(255,255,255,0.2)", backdropFilter: "blur(10px)" }}
                >
                  <CheckCircle2 className="h-8 w-8 text-white" strokeWidth={2.5} />
                </div>
                
                <h4 className="font-semibold text-xl uppercase leading-tight text-white mb-2">
                  Quotas Satisfied
                </h4>
                <p className="text-xs text-white/80 leading-relaxed mb-6">
                  All roles for the current shift period are fully staffed. No immediate action required.
                </p>
                
                <Button 
                  className="w-full h-11 bg-white hover:bg-white/90 font-semibold uppercase text-xs rounded-xl border-0 transition-all hover:scale-105 active:scale-95 shadow-lg gap-2"
                  style={{ color: "oklch(0.65 0.18 150)" }}
                >
                  <Download className="h-4 w-4" strokeWidth={2.5} />
                  Export Roster
                </Button>
              </CardContent>
            </Card>

          </div>
        </div>

      </div>
    </div>
  )
}