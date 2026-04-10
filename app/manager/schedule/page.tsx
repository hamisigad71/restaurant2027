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
  Briefcase
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
const shifts = [
  { id: 1, staff: "Peter Ochieng", role: "Waiter", day: "Mon", time: "8am - 4pm", status: "completed" },
  { id: 2, staff: "Grace Wanjiku", role: "Manager", day: "Mon", time: "9am - 6pm", status: "completed" },
  { id: 3, staff: "Mary Akinyi", role: "Kitchen", day: "Tue", time: "11am - 9pm", status: "active" },
  { id: 4, staff: "John Doe", role: "Waiter", day: "Tue", time: "2pm - 10pm", status: "active" },
  { id: 5, staff: "Alice Kipir", role: "Kitchen", day: "Wed", time: "8am - 4pm", status: "upcoming" },
  { id: 6, staff: "Kevin M.", role: "Waiter", day: "Wed", time: "4pm - 12am", status: "upcoming" },
]

export default function ManagerSchedulePage() {
  const [activeDay, setActiveDay] = useState("Tue")

  return (
    <div className="min-h-screen bg-[#FAFAF9] pb-20">
      <div className="max-w-7xl mx-auto px-[10px] pt-8 space-y-8">
        
        {/* ── Header ────────────────────────────────────────────── */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <h1 className="text-3xl font-heading  uppercase text-foreground leading-none">Shift Planning</h1>
            <div className="flex items-center gap-2 text-[10px] font-heading uppercase  text-primary/60">
              <div className="w-8 h-[1px] bg-primary/20" />
              Resource Allocation & Weekly Rostering
            </div>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="h-12 px-6 border-primary/5 bg-white text-muted-foreground font-heading uppercase rounded-xl hover:bg-primary/5 transition-all">
              Auto-Generate
            </Button>
            <Button className="h-12 px-6 bg-primary text-white font-heading uppercase rounded-xl shadow-xl shadow-primary/20 hover:scale-105 transition-all border-none text-[11px] gap-3">
              <Plus className="h-4 w-4" /> Add Shift
            </Button>
          </div>
        </div>

        {/* ── Week Picker ────────────────────────────────────────── */}
        <div className="flex items-center justify-between bg-white p-2 rounded-2xl shadow-sm ring-1 ring-primary/5">
          <Button variant="ghost" size="icon" className="h-10 w-10 text-muted-foreground">
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <div className="flex gap-1 overflow-x-auto no-scrollbar">
            {days.map((day) => (
              <Button
                key={day}
                onClick={() => setActiveDay(day)}
                variant={activeDay === day ? "default" : "ghost"}
                className={cn(
                  "h-12 px-6 rounded-xl font-heading text-[10px] uppercase transition-all",
                  activeDay === day ? "bg-primary text-white shadow-lg" : "text-muted-foreground/60 hover:text-primary"
                )}
              >
                {day}
              </Button>
            ))}
          </div>
          <Button variant="ghost" size="icon" className="h-10 w-10 text-muted-foreground">
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>

        {/* ── Daily View ─────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2 space-y-4">
            <Card className="border-none bg-white shadow-xl shadow-primary/5 rounded-[2rem] overflow-hidden">
               <CardHeader className="px-6 py-5 border-b border-primary/5 flex flex-row items-center justify-between">
                <CardTitle className="text-sm font-heading uppercase">{activeDay}'s Schedule</CardTitle>
                <Badge variant="outline" className="bg-emerald-50 text-emerald-600 border-none font-heading text-[9px] px-3 py-1 uppercase">
                  Active Shift cycle
                </Badge>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-primary/5">
                  {shifts.filter(s => s.day === activeDay).map((s) => (
                    <div key={s.id} className="group flex items-center justify-between p-6 hover:bg-primary/[0.01] transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-[1.2rem] bg-primary/5 text-primary flex items-center justify-center font-heading  text-lg">
                          {s.staff[0]}
                        </div>
                        <div>
                          <p className="font-heading  text-base uppercase text-foreground leading-none">{s.staff}</p>
                          <p className="text-[10px] font-heading uppercase text-muted-foreground mt-1.5">{s.role}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-12">
                        <div className="hidden md:block">
                          <div className="flex items-center gap-2 text-[10px] text-foreground">
                            <Clock className="h-3.5 w-3.5 text-primary/40" />
                            {s.time}
                          </div>
                        </div>
                        <Badge className={cn(
                          "rounded-full px-3 py-1 font-heading text-[9px] uppercase border-none min-w-[80px] justify-center",
                          s.status === "completed" ? "bg-emerald-50 text-emerald-600" : 
                          s.status === "active" ? "bg-primary text-white shadow-lg shadow-primary/20" : 
                          "bg-amber-50 text-amber-600"
                        )}>
                          {s.status}
                        </Badge>
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  {shifts.filter(s => s.day === activeDay).length === 0 && (
                    <div className="p-12 text-center space-y-4">
                      <div className="w-16 h-16 rounded-2xl bg-primary/5 flex items-center justify-center mx-auto">
                        <Calendar className="h-8 w-8 text-primary/20" />
                      </div>
                      <p className="text-[10px] font-heading uppercase text-muted-foreground">No shifts published for {activeDay}.</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* ── Schedule Stats ───────────────────────────────────── */}
          <div className="space-y-6">
            <Card className="border-none bg-white shadow-xl shadow-primary/5 rounded-[2rem] overflow-hidden p-6">
              <h3 className="font-heading  text-sm uppercase  text-foreground/40 mb-6">Staffing Overview</h3>
              <div className="space-y-6">
                {[
                  { label: "On Duty", value: "14", icon: UserCheck, color: "text-emerald-500" },
                  { label: "Stations Covered", value: "100%", icon: Briefcase, color: "text-primary" },
                  { label: "Overtime Risk", value: "2", icon: AlertCircle, color: "text-amber-500" },
                ].map((stat, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <stat.icon className={cn("h-4 w-4", stat.color)} />
                      <span className="text-[10px] font-heading uppercase  text-muted-foreground">{stat.label}</span>
                    </div>
                    <span className="text-xl font-heading  text-foreground">{stat.value}</span>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="border-none bg-emerald-600 shadow-xl shadow-emerald-600/20 rounded-[2rem] overflow-hidden p-6 text-white text-center">
              <CheckCircle2 className="h-10 w-10 text-white/40 mx-auto mb-4" />
              <h4 className="font-heading  text-lg  uppercase mb-2">Quotas Satisfied</h4>
              <p className="text-[10px] text-white/70  uppercase mb-6 leading-relaxed">
                All roles for the current shift period are fully staffed. No immediate action required.
              </p>
              <Button className="w-full h-12 bg-white text-emerald-600 hover:bg-white/90 font-heading uppercase  rounded-xl text-[10px] border-none">
                Export Roster
              </Button>
            </Card>
          </div>

        </div>

      </div>
    </div>
  )
}
