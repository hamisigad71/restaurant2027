"use client"

import { useState } from "react"
import { 
  Plus, 
  Search, 
  Calendar, 
  Clock, 
  Users, 
  ChevronRight,
  Filter,
  CheckCircle2,
  XCircle,
  MoreVertical,
  Table as TableIcon
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

const mockReservations = [
  { id: "RES-001", guest: "Amanda Chen", partySize: 4, date: "2026-04-03", time: "19:30", status: "confirmed", table: "12", notes: "Anniversary celebration" },
  { id: "RES-002", guest: "David Smith", partySize: 2, date: "2026-04-03", time: "20:00", status: "confirmed", table: "5", notes: "Window seat preferred" },
  { id: "RES-003", guest: "Sarah Johnson", partySize: 6, date: "2026-04-03", time: "18:45", status: "pending", table: null, notes: "Needs high chair" },
  { id: "RES-004", guest: "Michael Ross", partySize: 1, date: "2026-04-03", time: "21:15", status: "confirmed", table: "Bar 2", notes: "" },
]

const stats = [
  { label: "Today's Bookings", value: "18", icon: Calendar, color: "oklch(0.45 0.12 285)" },
  { label: "Total Guests", value: "54", icon: Users, color: "oklch(0.65 0.12 230)" },
  { label: "Pending Requests", value: "4", icon: Clock, color: "oklch(0.75 0.15 75)" },
]

export default function ManagerReservationsPage() {
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <div className="min-h-screen bg-[#FAFAF9] pb-20">
      <div className="max-w-7xl mx-auto px-[10px] pt-8 space-y-8">
        
        {/* ── Header ────────────────────────────────────────────── */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <h1 className="text-3xl font-heading  uppercase text-foreground leading-none">Reservations</h1>
            <div className="flex items-center gap-2 text-[10px] font-heading uppercase text-primary/60">
              <div className="w-8 h-[1px] bg-primary/20" />
              Guest Booking & Table Management
            </div>
          </div>
          <Button className="h-12 px-6 bg-primary text-white font-heading uppercase rounded-xl shadow-xl shadow-primary/20 hover:scale-105 transition-all border-none text-[11px] gap-3">
            <Plus className="h-4 w-4" /> New Booking
          </Button>
        </div>

        {/* ── Stats ─────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {stats.map((s, i) => (
            <Card key={i} className="border-none bg-white shadow-sm ring-1 ring-primary/5 rounded-2xl overflow-hidden hover:shadow-md transition-shadow">
              <CardContent className="p-5 flex items-center gap-4">
                <div 
                  className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: `${s.color}10`, color: s.color }}
                >
                  <s.icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-2xl font-heading  text-foreground leading-none tabular-nums">{s.value}</p>
                  <p className="text-[9px] font-heading uppercase text-muted-foreground mt-1">{s.label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* ── Toolbar ────────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="relative flex-1 w-full group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-primary/30 group-focus-within:text-primary transition-colors" />
            <Input 
              placeholder="Search by guest name or ID..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-12 pl-11 bg-white border-primary/5 rounded-xl text-sm focus-visible:ring-primary/10 shadow-sm transition-all"
            />
          </div>
          <Button variant="outline" className="h-12 w-full sm:w-auto px-6 border-primary/5 bg-white text-muted-foreground font-heading uppercase rounded-xl hover:bg-primary hover:text-white transition-all flex gap-2">
            <Filter className="h-4 w-4" /> Filter
          </Button>
        </div>

        {/* ── Reservations List ───────────────────────────────────── */}
        <Card className="border-none bg-white shadow-xl shadow-primary/5 rounded-[2rem] overflow-hidden">
          <CardHeader className="px-6 py-5 border-b border-primary/5">
            <CardTitle className="text-sm font-heading uppercase">Scheduled Guests</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-primary/[0.02]">
                  <tr className="text-[10px] font-heading uppercase text-muted-foreground">
                    <th className="px-6 py-4">Guest</th>
                    <th className="px-6 py-4">Party</th>
                    <th className="px-6 py-4">Timing</th>
                    <th className="px-6 py-4">Station</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-primary/5">
                  {mockReservations.map((res) => (
                    <tr key={res.id} className="group hover:bg-primary/[0.01] transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-heading  text-sm uppercase text-foreground">{res.guest}</div>
                        <div className="text-[10px] text-muted-foreground font-medium">{res.id}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5 text-xs">
                          <Users className="h-3 w-3 text-primary" /> {res.partySize}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5 text-xs">
                          <Clock className="h-3 w-3 text-primary" /> {res.time}
                        </div>
                        <div className="text-[9px] text-muted-foreground mt-0.5">{res.date}</div>
                      </td>
                      <td className="px-6 py-4">
                        {res.table ? (
                          <Badge variant="outline" className="bg-primary/5 text-primary border-none rounded-lg gap-1 uppercase font-heading text-[9px] px-2 py-0.5">
                            <TableIcon className="h-2.5 w-2.5" /> Table {res.table}
                          </Badge>
                        ) : (
                          <span className="text-[9px] text-warning uppercase">Unassigned</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <Badge className={cn(
                          "rounded-full px-3 py-1 font-heading text-[9px] uppercase border-none",
                          res.status === "confirmed" ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"
                        )}>
                          {res.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-right pr-8">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-white/95 backdrop-blur-xl border-primary/5 shadow-2xl rounded-xl">
                            <DropdownMenuItem className="text-xs font-heading uppercase  text-primary focus:bg-primary/5">Confirm Arrival</DropdownMenuItem>
                            <DropdownMenuItem className="text-xs font-heading uppercase  focus:bg-primary/5">Assign Table</DropdownMenuItem>
                            <DropdownMenuItem className="text-xs font-heading uppercase  text-destructive focus:bg-destructive/5">Cancel</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* ── Floor Insights ─────────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border-none bg-indigo-50 shadow-sm rounded-2xl overflow-hidden p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-600/20">
                <CheckCircle2 className="h-6 w-6 text-white" />
              </div>
              <div className="space-y-1">
                <h3 className="font-heading  text-xl  uppercase text-indigo-900 leading-none">Evening Rush Readiness</h3>
                <p className="text-[10px] font-heading uppercase  text-indigo-700/60">Floor setup is optimized for the 19:00 - 21:00 peak.</p>
              </div>
            </div>
          </Card>

          <Card className="border-none bg-primary shadow-sm rounded-2xl overflow-hidden p-6">
             <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
                <Users className="h-6 w-6 text-white" />
              </div>
              <div className="space-y-1 text-white">
                <h3 className="font-heading  text-xl  uppercase leading-none">VIP Alert</h3>
                <p className="text-[10px] font-heading uppercase  text-white/60">2 VIP tables arriving in the next hour.</p>
              </div>
            </div>
          </Card>
        </div>

      </div>
    </div>
  )
}
