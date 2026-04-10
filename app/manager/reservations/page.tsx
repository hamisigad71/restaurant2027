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
  Table as TableIcon,
  Star,
  TrendingUp,
  Activity,
  AlertCircle,
  Eye,
  Edit,
  Trash2,
  Phone,
  Mail,
  MapPin,
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
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { Separator } from "@/components/ui/separator"

const mockReservations = [
  { id: "RES-001", guest: "Amanda Chen", partySize: 4, date: "2026-04-03", time: "19:30", status: "confirmed", table: "12", notes: "Anniversary celebration", vip: true },
  { id: "RES-002", guest: "David Smith", partySize: 2, date: "2026-04-03", time: "20:00", status: "confirmed", table: "5", notes: "Window seat preferred", vip: false },
  { id: "RES-003", guest: "Sarah Johnson", partySize: 6, date: "2026-04-03", time: "18:45", status: "pending", table: null, notes: "Needs high chair", vip: false },
  { id: "RES-004", guest: "Michael Ross", partySize: 1, date: "2026-04-03", time: "21:15", status: "confirmed", table: "Bar 2", notes: "", vip: false },
  { id: "RES-005", guest: "Emily Watson", partySize: 8, date: "2026-04-03", time: "19:00", status: "confirmed", table: "15", notes: "Corporate dinner", vip: true },
  { id: "RES-006", guest: "James Brown", partySize: 3, date: "2026-04-03", time: "20:30", status: "pending", table: null, notes: "Birthday party", vip: false },
]

const stats = [
  { label: "Today's Bookings", value: "18", icon: Calendar, from: "oklch(0.42 0.14 285)", to: "oklch(0.38 0.16 275)", change: "+12%" },
  { label: "Total Guests", value: "54", icon: Users, from: "oklch(0.42 0.14 285)", to: "oklch(0.38 0.16 275)", change: "+8%" },
  { label: "Pending Requests", value: "4", icon: Clock, from: "oklch(0.42 0.14 285)", to: "oklch(0.38 0.16 275)", change: "+2" },
  { label: "VIP Arrivals", value: "2", icon: Star, from: "oklch(0.42 0.14 285)", to: "oklch(0.38 0.16 275)", change: "Today" },
]

export default function ManagerReservationsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")

  const filteredReservations = mockReservations.filter(res => {
    const matchesSearch = res.guest.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         res.id.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = filterStatus === "all" || res.status === filterStatus
    return matchesSearch && matchesFilter
  })

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
                  Reservations
                </h1>
                <div className="flex items-center gap-2 mt-1.5">
                  <div className="h-px w-8 bg-gradient-to-r from-oklch(0.42 0.14 285) to-transparent" />
                  <p className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider" style={{ color: "#736C83" }}>
                    Guest Booking & Table Management
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <Button 
            className="h-11 sm:h-12 px-5 sm:px-8 gap-2.5 text-white font-medium rounded-[14px] shadow-xl border-0 text-xs uppercase tracking-wide transition-all hover:-translate-y-0.5 hover:shadow-2xl active:translate-y-0 active:scale-95"
            style={{
              background: "linear-gradient(135deg, oklch(0.42 0.14 285) 0%, oklch(0.38 0.16 275) 100%)",
              boxShadow: "0 8px 32px oklch(0.42 0.14 285 / 0.35)",
            }}
          >
            <Plus className="h-4 w-4" strokeWidth={2.5} />
            New Booking
          </Button>
        </div>

        {/* ── Enhanced Stats Grid ───────────────────────────────────────── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {stats.map((s, i) => (
            <Card 
              key={i} 
              className="group border-0 bg-white rounded-[20px] shadow-md hover:shadow-2xl transition-all duration-500 overflow-hidden hover:-translate-y-1"
              style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.08)" }}
            >
              <CardContent className="p-4 sm:p-5 relative overflow-hidden">
                {/* Gradient background on hover */}
                <div 
                  className="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-500"
                  style={{ background: `linear-gradient(135deg, ${s.from} 0%, ${s.to} 100%)` }}
                />
                
                <div className="flex items-start justify-between relative z-10">
                  <div className="flex-1 space-y-2">
                    <div 
                      className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 shadow-lg"
                      style={{ background: `linear-gradient(135deg, ${s.from} 0%, ${s.to} 100%)` }}
                    >
                      <s.icon className="h-5 w-5 text-white" strokeWidth={2.5} />
                    </div>
                    <div>
                      <p className="text-2xl sm:text-3xl font-normal leading-none tabular-nums" style={{ color: "#0D031B" }}>
                        {s.value}
                      </p>
                      <p className="text-[10px] sm:text-[11px] font-medium uppercase tracking-wide mt-1" style={{ color: "#9A94AA" }}>
                        {s.label}
                      </p>
                    </div>
                  </div>

                  <Badge 
                    className="text-[9px] font-medium px-2 py-0.5 rounded-lg border"
                    style={{
                      background: "oklch(0.42 0.14 285 / 0.08)",
                      color: "oklch(0.42 0.14 285)",
                      borderColor: "oklch(0.42 0.14 285 / 0.2)",
                    }}
                  >
                    {s.change}
                  </Badge>
                </div>

                <div className="mt-3 pt-3 border-t relative z-10" style={{ borderColor: "oklch(0.42 0.14 285 / 0.08)" }}>
                  <p className="text-[10px] font-medium flex items-center gap-1.5" style={{ color: "#9A94AA" }}>
                    <Activity className="h-3 w-3" />
                    vs. yesterday
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* ── Enhanced Toolbar ────────────────────────────────────────────── */}
        <Card className="border-0 rounded-[20px] shadow-lg overflow-hidden"
          style={{ background: "rgba(255,255,255,0.95)", backdropFilter: "blur(20px)" }}>
          <CardContent className="p-4 sm:p-5">
            <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
              {/* Search */}
              <div className="relative flex-1 group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 transition-colors" 
                  style={{ color: "oklch(0.42 0.14 285 / 0.4)" }} strokeWidth={2.5} />
                <Input 
                  placeholder="Search by guest name or ID..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-11 pr-4 h-11 sm:h-12 bg-white border-2 rounded-xl text-sm transition-all duration-200"
                  style={{
                    borderColor: "oklch(0.42 0.14 285 / 0.12)",
                    color: "#0D031B",
                  }}
                />
              </div>

              {/* Filter Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="outline"
                    className="h-11 sm:h-12 px-5 sm:px-6 gap-2 font-medium rounded-xl text-xs uppercase tracking-wide transition-all hover:scale-105 active:scale-95 border-2"
                    style={{
                      borderColor: "oklch(0.42 0.14 285 / 0.15)",
                      color: "#736C83",
                    }}
                  >
                    <Filter className="h-4 w-4" strokeWidth={2.5} />
                    <span className="hidden sm:inline">Filter</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-white/98 backdrop-blur-xl border-0 rounded-2xl shadow-2xl w-48">
                  <DropdownMenuItem 
                    onClick={() => setFilterStatus("all")}
                    className="text-xs font-semibold rounded-xl m-1 focus:bg-oklch(0.42 0.14 285 / 0.08)"
                  >
                    All Reservations
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => setFilterStatus("confirmed")}
                    className="text-xs font-semibold rounded-xl m-1 focus:bg-oklch(0.42 0.14 285 / 0.08)"
                  >
                    Confirmed Only
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => setFilterStatus("pending")}
                    className="text-xs font-semibold rounded-xl m-1 focus:bg-oklch(0.42 0.14 285 / 0.08)"
                  >
                    Pending Only
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardContent>
        </Card>

        {/* ── Enhanced Reservations Table ───────────────────────────────────── */}
        <Card 
          className="border-0 bg-white rounded-[24px] shadow-xl overflow-hidden"
          style={{ boxShadow: "0 8px 32px rgba(0,0,0,0.08)" }}
        >
          <CardHeader className="px-5 sm:px-6 py-5 border-b" style={{ borderColor: "oklch(0.42 0.14 285 / 0.08)" }}>
            <div className="flex items-center gap-3">
              <div 
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: "oklch(0.42 0.14 285 / 0.1)" }}
              >
                <Users className="h-5 w-5" style={{ color: "oklch(0.42 0.14 285)" }} strokeWidth={2.5} />
              </div>
              <div>
                <CardTitle className="text-sm sm:text-base font-normal uppercase tracking-tight" style={{ color: "#0D031B" }}>
                  Scheduled Guests
                </CardTitle>
                <p className="text-[10px] font-medium mt-0.5" style={{ color: "#9A94AA" }}>
                  {filteredReservations.length} reservation{filteredReservations.length !== 1 ? 's' : ''} found
                </p>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="p-0">
            {/* Desktop Table View */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead style={{ background: "oklch(0.42 0.14 285 / 0.03)" }}>
                  <tr className="text-[10px] font-medium uppercase tracking-wider" style={{ color: "#9A94AA" }}>
                    <th className="px-6 py-4">Guest Details</th>
                    <th className="px-6 py-4">Party Size</th>
                    <th className="px-6 py-4">Date & Time</th>
                    <th className="px-6 py-4">Table</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y" style={{ borderColor: "oklch(0.42 0.14 285 / 0.05)" }}>
                  {filteredReservations.map((res) => (
                    <tr key={res.id} className="group transition-all hover:bg-oklch(0.42 0.14 285 / 0.02)">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="font-medium text-sm uppercase leading-tight" style={{ color: "#0D031B" }}>
                            {res.guest}
                          </div>
                          {res.vip && (
                            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" strokeWidth={2.5} />
                          )}
                        </div>
                        <div className="text-[10px] font-medium mt-1" style={{ color: "#9A94AA" }}>{res.id}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5 text-xs font-medium" style={{ color: "#0D031B" }}>
                          <Users className="h-3.5 w-3.5" style={{ color: "oklch(0.42 0.14 285)" }} strokeWidth={2.5} />
                          {res.partySize} guests
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5 text-xs font-medium" style={{ color: "#0D031B" }}>
                          <Clock className="h-3.5 w-3.5" style={{ color: "oklch(0.42 0.14 285)" }} strokeWidth={2.5} />
                          {res.time}
                        </div>
                        <div className="text-[10px] font-medium mt-1" style={{ color: "#9A94AA" }}>{res.date}</div>
                      </td>
                      <td className="px-6 py-4">
                        {res.table ? (
                          <Badge 
                            className="flex items-center gap-1.5 text-[10px] font-medium uppercase px-2.5 py-1 rounded-lg border w-fit"
                            style={{
                              background: "oklch(0.42 0.14 285 / 0.08)",
                              color: "oklch(0.42 0.14 285)",
                              borderColor: "oklch(0.42 0.14 285 / 0.2)",
                            }}
                          >
                            <TableIcon className="h-3 w-3" strokeWidth={2.5} />
                            Table {res.table}
                          </Badge>
                        ) : (
                          <Badge className="text-[10px] font-medium uppercase px-2.5 py-1 rounded-lg border bg-amber-50 text-amber-600 border-amber-200">
                            <AlertCircle className="h-3 w-3 mr-1" strokeWidth={2.5} />
                            Unassigned
                          </Badge>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <Badge 
                          className={cn(
                            "text-[10px] font-medium uppercase px-3 py-1.5 rounded-xl border-2",
                            res.status === "confirmed" 
                              ? "bg-emerald-50 text-emerald-600 border-emerald-200" 
                              : "bg-amber-50 text-amber-600 border-amber-200"
                          )}
                        >
                          {res.status === "confirmed" ? (
                            <CheckCircle2 className="h-3 w-3 mr-1 inline" strokeWidth={2.5} />
                          ) : (
                            <Clock className="h-3 w-3 mr-1 inline" strokeWidth={2.5} />
                          )}
                          {res.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-9 w-9 rounded-xl transition-all hover:bg-oklch(0.42 0.14 285 / 0.08) active:scale-90"
                            >
                              <MoreVertical className="h-4 w-4" style={{ color: "#9A94AA" }} />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-white/98 backdrop-blur-xl border-0 rounded-2xl shadow-2xl w-48">
                            <DropdownMenuItem className="text-xs font-semibold rounded-xl m-1 focus:bg-oklch(0.42 0.14 285 / 0.08)">
                              <Eye className="h-3.5 w-3.5 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-xs font-semibold rounded-xl m-1 focus:bg-oklch(0.42 0.14 285 / 0.08)">
                              <CheckCircle2 className="h-3.5 w-3.5 mr-2" />
                              Confirm Arrival
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-xs font-semibold rounded-xl m-1 focus:bg-oklch(0.42 0.14 285 / 0.08)">
                              <TableIcon className="h-3.5 w-3.5 mr-2" />
                              Assign Table
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-xs font-semibold rounded-xl m-1 focus:bg-oklch(0.42 0.14 285 / 0.08)">
                              <Edit className="h-3.5 w-3.5 mr-2" />
                              Edit Booking
                            </DropdownMenuItem>
                            <DropdownMenuSeparator className="my-1" style={{ background: "oklch(0.42 0.14 285 / 0.08)" }} />
                            <DropdownMenuItem className="text-xs font-semibold rounded-xl m-1 focus:bg-rose-50 text-rose-600">
                              <XCircle className="h-3.5 w-3.5 mr-2" />
                              Cancel Booking
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="lg:hidden space-y-3 p-4">
              {filteredReservations.map((res) => (
                <Card 
                  key={res.id}
                  className="border-0 rounded-[20px] shadow-md overflow-hidden"
                  style={{ boxShadow: "0 4px 16px rgba(0,0,0,0.06)" }}
                >
                  <CardContent className="p-4 space-y-3">
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium text-sm" style={{ color: "#0D031B" }}>{res.guest}</h3>
                          {res.vip && <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />}
                        </div>
                        <p className="text-[10px] font-medium mt-0.5" style={{ color: "#9A94AA" }}>{res.id}</p>
                      </div>
                      <Badge 
                        className={cn(
                          "text-[9px] font-medium uppercase px-2 py-0.5 rounded-lg border",
                          res.status === "confirmed" 
                            ? "bg-emerald-50 text-emerald-600 border-emerald-200" 
                            : "bg-amber-50 text-amber-600 border-amber-200"
                        )}
                      >
                        {res.status}
                      </Badge>
                    </div>

                    <Separator style={{ background: "oklch(0.42 0.14 285 / 0.08)" }} />

                    {/* Details Grid */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex items-center gap-1.5">
                        <Users className="h-3.5 w-3.5" style={{ color: "oklch(0.42 0.14 285)" }} />
                        <span className="text-xs font-medium" style={{ color: "#0D031B" }}>{res.partySize} guests</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5" style={{ color: "oklch(0.42 0.14 285)" }} />
                        <span className="text-xs font-medium" style={{ color: "#0D031B" }}>{res.time}</span>
                      </div>
                    </div>

                    {res.table ? (
                      <Badge 
                        className="flex items-center gap-1.5 text-[10px] font-medium uppercase px-2.5 py-1 rounded-lg border w-fit"
                        style={{
                          background: "oklch(0.42 0.14 285 / 0.08)",
                          color: "oklch(0.42 0.14 285)",
                          borderColor: "oklch(0.42 0.14 285 / 0.2)",
                        }}
                      >
                        <TableIcon className="h-3 w-3" />
                        Table {res.table}
                      </Badge>
                    ) : (
                      <Badge className="text-[10px] font-medium uppercase px-2.5 py-1 rounded-lg border bg-amber-50 text-amber-600 border-amber-200 w-fit">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        Unassigned
                      </Badge>
                    )}

                    {/* Actions */}
                    <div className="flex gap-2 pt-2">
                      <Button 
                        className="flex-1 h-9 text-xs font-medium uppercase rounded-xl"
                        style={{
                          background: "oklch(0.42 0.14 285)",
                          color: "white",
                        }}
                      >
                        <CheckCircle2 className="h-3.5 w-3.5 mr-1.5" />
                        Confirm
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="icon" className="h-9 w-9 rounded-xl border-2"
                            style={{ borderColor: "oklch(0.42 0.14 285 / 0.15)" }}>
                            <MoreVertical className="h-4 w-4" style={{ color: "#9A94AA" }} />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-white/98 backdrop-blur-xl border-0 rounded-2xl shadow-2xl w-48">
                          <DropdownMenuItem className="text-xs font-semibold rounded-xl m-1">
                            <Eye className="h-3.5 w-3.5 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-xs font-semibold rounded-xl m-1">
                            <TableIcon className="h-3.5 w-3.5 mr-2" />
                            Assign Table
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-xs font-semibold rounded-xl m-1">
                            <Edit className="h-3.5 w-3.5 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-xs font-semibold rounded-xl m-1 text-rose-600">
                            <XCircle className="h-3.5 w-3.5 mr-2" />
                            Cancel
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* ── Enhanced Insight Cards ─────────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
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

            <CardContent className="p-6 relative z-10">
              <div className="flex items-start gap-4">
                <div 
                  className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg shrink-0"
                  style={{ background: "rgba(255,255,255,0.2)", backdropFilter: "blur(10px)" }}
                >
                  <CheckCircle2 className="h-7 w-7 text-white" strokeWidth={2.5} />
                </div>
                <div className="flex-1 text-white">
                  <h3 className="font-normal text-xl uppercase leading-tight">Evening Rush Readiness</h3>
                  <p className="text-xs mt-2 text-white/80 leading-relaxed">
                    Floor setup is optimized for the 19:00 - 21:00 peak period. All stations prepared.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card 
            className="border-0 rounded-[24px] shadow-xl overflow-hidden relative"
            style={{
              background: "linear-gradient(135deg, oklch(0.42 0.14 285) 0%, oklch(0.35 0.15 280) 100%)",
              boxShadow: "0 12px 40px oklch(0.42 0.14 285 / 0.4)",
            }}
          >
            {/* Decorative orbs */}
            <div className="absolute -top-12 -right-12 w-40 h-40 rounded-full opacity-10 blur-3xl bg-white" />
            <div className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full opacity-10 blur-2xl bg-white" />

            <CardContent className="p-6 relative z-10">
              <div className="flex items-start gap-4">
                <div 
                  className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg shrink-0"
                  style={{ background: "rgba(255,255,255,0.2)", backdropFilter: "blur(10px)" }}
                >
                  <Star className="h-7 w-7 text-white fill-white" strokeWidth={2.5} />
                </div>
                <div className="flex-1 text-white">
                  <h3 className="font-normal text-xl uppercase leading-tight">VIP Alert</h3>
                  <p className="text-xs mt-2 text-white/80 leading-relaxed">
                    2 VIP tables arriving in the next hour. Premium service ready.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  )
}