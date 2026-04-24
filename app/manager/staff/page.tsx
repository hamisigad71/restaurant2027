"use client"

import { useState, useMemo, useCallback } from "react"
import { toast } from "sonner"
import { supabase } from "@/lib/supabase"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  ClockIcon,
  UserPlusIcon,
  PhoneIcon,
  CheckCircleIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  StarIcon,
  EnvelopeIcon,
  CalendarIcon,
  ChevronRightIcon,
  ArrowTrendingUpIcon,
  SparklesIcon,
  BoltIcon,
  HeartIcon,
  EllipsisHorizontalIcon,
  BellAlertIcon,
  XMarkIcon,
  ExclamationTriangleIcon,
  TrophyIcon,
  UserGroupIcon,
  FlagIcon,
  BoltIcon as Sparkles,
  ArrowUpRightIcon,
  UserCircleIcon,
  ChatBubbleLeftRightIcon,
} from "@heroicons/react/24/outline"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"
import { cn } from "@/lib/utils"

const mockStaff = [
  {
    id: 1,
    name: "Peter Ochieng",
    role: "Waiter",
    status: "active",
    tables: ["1", "2", "3"],
    shift: "8am – 4pm",
    shiftsThisWeek: 5,
    rating: 4.8,
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop&face",
  },
  {
    id: 2,
    name: "Mary Akinyi",
    role: "Waiter",
    status: "active",
    tables: ["4", "5", "12"],
    shift: "8am – 4pm",
    shiftsThisWeek: 4,
    rating: 4.9,
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&h=120&fit=crop&face",
  },
  {
    id: 3,
    name: "John Doe",
    role: "Kitchen",
    status: "break",
    tables: [],
    shift: "7am – 3pm",
    shiftsThisWeek: 6,
    rating: 4.5,
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&h=120&fit=crop&face",
  },
  {
    id: 4,
    name: "Grace Wanjiku",
    role: "Manager",
    status: "active",
    tables: [],
    shift: "9am – 6pm",
    shiftsThisWeek: 5,
    rating: 5.0,
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&h=120&fit=crop&face",
  },
  {
    id: 5,
    name: "Kevin Maina",
    role: "Waiter",
    status: "active",
    tables: ["6", "7"],
    shift: "12pm – 8pm",
    shiftsThisWeek: 3,
    rating: 4.7,
    avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a63c5?w=120&h=120&fit=crop&face",
  },
  {
    id: 6,
    name: "Amina Hassan",
    role: "Kitchen",
    status: "active",
    tables: [],
    shift: "6am – 2pm",
    shiftsThisWeek: 5,
    rating: 4.6,
    avatar: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=120&h=120&fit=crop&face",
  },
  {
    id: 7,
    name: "Daniel Njoroge",
    role: "Waiter",
    status: "break",
    tables: ["8", "9"],
    shift: "2pm – 10pm",
    shiftsThisWeek: 4,
    rating: 4.4,
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&h=120&fit=crop&face",
  },
  {
    id: 8,
    name: "Sophie Kamau",
    role: "Host",
    status: "active",
    tables: [],
    shift: "10am – 6pm",
    shiftsThisWeek: 5,
    rating: 4.9,
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120&h=120&fit=crop&face",
  },
  {
    id: 9,
    name: "Brian Otieno",
    role: "Bartender",
    status: "active",
    tables: [],
    shift: "4pm – 12am",
    shiftsThisWeek: 6,
    rating: 4.8,
    avatar: "https://images.unsplash.com/photo-1463453091185-61582044d556?w=120&h=120&fit=crop&face",
  },
]

const roleConfig: Record<string, { bg: string; text: string; icon: any }> = {
  Waiter:    { bg: "bg-sky-50", text: "text-sky-600", icon: UserGroupIcon },
  Kitchen:   { bg: "bg-orange-50", text: "text-orange-600", icon: FlagIcon },
  Manager:   { bg: "bg-purple-50", text: "text-purple-600", icon: TrophyIcon },
  Host:      { bg: "bg-pink-50", text: "text-pink-600", icon: HeartIcon },
  Bartender: { bg: "bg-rose-50", text: "text-rose-600", icon: BoltIcon },
}

const stats = [
  { label: "Active Duty",  value: "48",  sub: "85% capacity",  icon: "/employee.png",   from: "oklch(0.42 0.14 285)", to: "oklch(0.38 0.16 275)" },
  { label: "Avg. Rating",  value: "4.8", sub: "Top performers", icon: "/rating.png",       from: "oklch(0.42 0.14 285)", to: "oklch(0.38 0.16 275)" },
  { label: "Attendance",   value: "96%", sub: "Weekly avg",     icon: HeartIcon,      from: "oklch(0.42 0.14 285)", to: "oklch(0.38 0.16 275)" },
  { label: "Open Shifts",  value: "3",   sub: "Needs action",   icon: ArrowTrendingUpIcon, from: "oklch(0.42 0.14 285)", to: "oklch(0.38 0.16 275)" },
]

export default function ManagerStaffPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [roleFilter, setRoleFilter]   = useState("all")
  const [awards, setAwards] = useState<Record<number, number>>({})
  const [awardedFlash, setAwardedFlash] = useState<number | null>(null)
  const [summoned, setSummoned] = useState<Record<number, boolean>>({})
  const [summonBanner, setSummonBanner] = useState<{ id: number; name: string } | null>(null)
  const [isAuditOpen, setIsAuditOpen] = useState(false)

  // Audit Calculations
  const auditMetrics = useMemo(() => {
    const totalShifts = mockStaff.reduce((s, st) => s + st.shiftsThisWeek, 0)
    const avgRating = (mockStaff.reduce((s, st) => s + st.rating, 0) / mockStaff.length).toFixed(1)
    const topPerformer = [...mockStaff].sort((a,b) => b.rating - a.rating)[0]
    const overtimeStaff = mockStaff.filter(s => s.shiftsThisWeek > 5)
    
    return { totalShifts, avgRating, topPerformer, overtimeStaff }
  }, [])

  const giveAward = useCallback((staffId: number, stars: number) => {
    setAwards(prev => ({ ...prev, [staffId]: stars }))
    setAwardedFlash(staffId)
    toast.success(`${stars} star${stars > 1 ? 's' : ''} awarded!`, {
      description: `Performance recognition recorded`,
      icon: <StarIcon className="h-4 w-4 fill-amber-400 text-amber-400" />,
    })
    setTimeout(() => setAwardedFlash(null), 2000)
  }, [])

  const summonStaff = useCallback(async (staffId: number, name: string) => {
    setSummoned(prev => ({ ...prev, [staffId]: true }))
    setSummonBanner({ id: staffId, name })

    const { error } = await supabase
      .from('summons')
      .insert([
        { staff_id: staffId, staff_name: name, status: 'pending' }
      ])

    if (error) {
      console.error('Staff Summon Error:', error)
      toast.error(`Summon failed`, {
        description: error.message.includes('table') 
          ? 'Database table missing. Run the SQL setup script.' 
          : error.message,
      })
      setSummoned(prev => ({ ...prev, [staffId]: false }))
      setSummonBanner(null)
    } else {
      toast.success(`${name} summoned`, {
        description: "Notification sent to staff member",
        icon: <BellAlertIcon className="h-4 w-4" />,
      })
    }
  }, [])

  const dismissSummon = useCallback((staffId: number) => {
    setSummoned(prev => ({ ...prev, [staffId]: false }))
    if (summonBanner?.id === staffId) setSummonBanner(null)
  }, [summonBanner])

  const filtered = useMemo(() =>
    mockStaff.filter(s => {
      const q = searchQuery.toLowerCase()
      return (
        (s.name.toLowerCase().includes(q) || s.role.toLowerCase().includes(q)) &&
        (roleFilter === "all" || s.role.toLowerCase() === roleFilter)
      )
    }),
    [searchQuery, roleFilter]
  )

  return (
    <div className="flex flex-col min-h-screen" style={{ background: "linear-gradient(135deg, #F8F6FC 0%, #F0EBF8 50%, #E8E3F5 100%)" }}>
      <div className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 lg:space-y-8">

        {/* ── Enhanced Summon Banner ── */}
        {summonBanner && (
          <div 
            className="flex items-center gap-3 sm:gap-4 px-4 sm:px-6 py-4 rounded-[20px] shadow-xl animate-in slide-in-from-top-2 duration-500 overflow-hidden relative"
            style={{
              background: "linear-gradient(135deg, oklch(0.75 0.15 50) 0%, oklch(0.70 0.15 45) 100%)",
            }}
          >
            {/* Animated background glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse" />
            
            <div className="relative w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shrink-0 border border-white/30">
              <BellAlertIcon className="h-5 w-5 sm:h-6 sm:w-6 text-white animate-bounce" strokeWidth={2.5} />
            </div>
            
            <div className="flex-1 min-w-0 relative">
              <p className="text-[13px] sm:text-sm font-medium uppercase tracking-wide leading-none text-white">
                Notification Sent
              </p>
              <p className="text-[11px] sm:text-xs font-medium text-white/80 mt-1.5 line-clamp-1">
                {summonBanner.name} requested to report to manager's office
              </p>
            </div>
            
            <button
              onClick={() => setSummonBanner(null)}
              className="relative shrink-0 h-9 w-9 rounded-xl bg-white/20 backdrop-blur-sm hover:bg-white/30 flex items-center justify-center transition-all duration-200 border border-white/20 hover:scale-105 active:scale-95"
            >
              <XMarkIcon className="h-4 w-4 text-white" strokeWidth={2.5} />
            </button>
          </div>
        )}

        {/* ── Enhanced Header ── */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 lg:gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div 
                className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center shadow-lg"
                style={{
                  background: "linear-gradient(135deg, oklch(0.42 0.14 285) 0%, oklch(0.38 0.16 275) 100%)",
                }}
              >
                <img src="/service (1).png" className="h-7 w-7 text-white brightness-0 invert" alt="Service" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-medium tracking-tight leading-none" style={{ color: "#0D031B" }}>
                  Personnel Hub
                </h1>
                <div className="flex items-center gap-2 mt-1.5">
                  <div className="h-px w-8 bg-gradient-to-r from-oklch(0.42 0.14 285) to-transparent" />
                  <p className="text-[10px] sm:text-[11px] font-medium uppercase tracking-wider" style={{ color: "#736C83" }}>
                    Operational Control & Performance
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <Button 
            className="h-12 px-6 sm:px-8 gap-2.5 text-white font-medium rounded-[16px] shadow-xl transition-all duration-300 hover:-translate-y-0.5 hover:shadow-2xl active:translate-y-0 active:scale-95 border-0 text-[11px] sm:text-xs uppercase tracking-wide"
            style={{
              background: "linear-gradient(135deg, oklch(0.42 0.14 285) 0%, oklch(0.38 0.16 275) 100%)",
              boxShadow: "0 8px 32px oklch(0.42 0.14 285 / 0.35)",
            }}
          >
            <UserPlusIcon className="h-4 w-4 sm:h-4.5 sm:w-4.5" strokeWidth={2.5} />
            Recruit Staff
          </Button>
        </div>

        {/* ── Enhanced Stats Grid ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {stats.map((s, i) => (
            <Card 
              key={s.label} 
              className="group bg-white border-0 rounded-[28px] shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden hover:-translate-y-2 aspect-square"
              style={{
                boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
              }}
            >
              <CardContent className="p-5 h-full relative flex flex-col items-start justify-between overflow-hidden text-left">
                {/* Multi-layered background */}
                <div 
                  className="absolute inset-0 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-500"
                  style={{ background: `linear-gradient(135deg, ${s.from} 0%, ${s.to} 100%)` }}
                />
                <div className="absolute top-0 right-0 w-24 h-24 blur-3xl opacity-20 -mr-12 -mt-12 rounded-full"
                  style={{ background: s.from }} />
                
                <div className="relative z-10 flex flex-col items-start gap-3 w-full h-full justify-between">
                  {/* Icon with glow */}
                  <div 
                    className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-lg relative group-hover:scale-110 transition-transform duration-500 overflow-hidden"
                    style={{ 
                      background: `linear-gradient(135deg, ${s.from} 0%, ${s.to} 100%)`,
                      boxShadow: `0 8px 16px ${s.from}40`
                    }}
                  >
                    {typeof s.icon === 'string' ? (
                      <img src={s.icon} className="w-full h-full object-contain p-2.5 brightness-0 invert" alt={s.label} />
                    ) : (
                      <s.icon className="h-5.5 w-5.5 sm:h-6 sm:w-6 text-white" strokeWidth={2.5} />
                    )}
                  </div>

                  <div className="space-y-1">
                    <p className="text-3xl sm:text-4xl font-semibold leading-none tabular-nums tracking-tight" style={{ color: "#0D031B" }}>
                      {s.value}
                    </p>
                    <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.1em]" style={{ color: "#736C83" }}>
                      {s.label}
                    </p>
                  </div>

                  {/* Sub-metric badge */}
                  <div className="px-3 py-1 rounded-full bg-slate-50 border border-slate-100 flex items-center gap-1.5 transition-colors group-hover:bg-white w-fit">
                    <ArrowTrendingUpIcon className="h-2.5 w-2.5" style={{ color: s.from }} />
                    <span className="text-[9px] font-bold uppercase tracking-wider" style={{ color: "#9A94AA" }}>
                      {s.sub}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* ── Enhanced Filters ── */}
        <Card 
          className="border-0 rounded-[20px] shadow-lg overflow-hidden"
          style={{ background: "rgba(255,255,255,0.95)", backdropFilter: "blur(20px)" }}
        >
          <CardContent className="p-4 sm:p-5">
            <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
              {/* Search */}
              <div className="relative flex-1 group">
                <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 transition-colors" style={{ color: "oklch(0.42 0.14 285 / 0.4)" }} />
                <Input
                  placeholder="Search by name or role..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="pl-11 pr-4 h-11 sm:h-12 bg-white border-2 rounded-xl sm:rounded-2xl text-sm transition-all duration-200 focus-visible:ring-0"
                  style={{
                    borderColor: "oklch(0.42 0.14 285 / 0.12)",
                    color: "#0D031B",
                  }}
                />
              </div>

              {/* Filters */}
              <div className="flex items-center gap-2 sm:gap-3">
                <Select value={roleFilter} onValueChange={setRoleFilter}>
                  <SelectTrigger className="h-11 sm:h-12 w-full sm:w-40 bg-white border-2 rounded-xl sm:rounded-2xl text-xs font-medium uppercase tracking-wide transition-all"
                    style={{
                      borderColor: "oklch(0.42 0.14 285 / 0.12)",
                      color: "#736C83",
                    }}>
                    <SelectValue placeholder="Role" />
                  </SelectTrigger>
                  <SelectContent className="bg-white/98 backdrop-blur-xl border-0 rounded-2xl shadow-2xl">
                    {["all","waiter","kitchen","manager","host","bartender"].map(r => (
                      <SelectItem 
                        key={r} 
                        value={r} 
                        className="text-xs uppercase font-medium focus:bg-oklch(0.42 0.14 285 / 0.08) rounded-xl m-1"
                      >
                        {r === "all" ? "All Roles" : r}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Button 
                  variant="outline" 
                  size="icon" 
                  className="h-11 sm:h-12 w-11 sm:w-12 rounded-xl sm:rounded-2xl bg-white border-2 transition-all hover:scale-105 active:scale-95"
                  style={{
                    borderColor: "oklch(0.42 0.14 285 / 0.12)",
                    color: "oklch(0.42 0.14 285)",
                  }}
                >
                  <FunnelIcon className="h-4 w-4" strokeWidth={2.5} />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ── Enhanced Staff Grid ── */}
        <div className="grid gap-4 sm:gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
          {filtered.map(staff => {
            const roleInfo = roleConfig[staff.role] || roleConfig.Waiter
            const RoleIcon = roleInfo.icon

            return (
              <Card
                key={staff.id}
                className="group relative bg-white border-0 rounded-[24px] shadow-md hover:shadow-2xl transition-all duration-500 overflow-hidden hover:-translate-y-2"
                style={{
                  boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
                }}
              >
                {/* Status indicator bar */}
                <div 
                  className="h-1 w-full"
                  style={{
                    background: staff.status === "active" 
                      ? "linear-gradient(90deg, oklch(0.65 0.18 150) 0%, oklch(0.70 0.20 160) 100%)"
                      : "linear-gradient(90deg, oklch(0.75 0.15 50) 0%, oklch(0.70 0.15 45) 100%)"
                  }}
                />

                <CardContent className="p-5 space-y-4">

                  {/* Summoned Alert */}
                  {summoned[staff.id] && (
                    <div 
                      className="flex items-center gap-2 px-3 py-2 rounded-xl border animate-in fade-in zoom-in-95 duration-300"
                      style={{
                        background: "oklch(0.95 0.05 50 / 0.5)",
                        borderColor: "oklch(0.75 0.15 50 / 0.3)",
                      }}
                    >
                      <BellAlertIcon className="h-3.5 w-3.5 animate-pulse shrink-0" style={{ color: "oklch(0.65 0.15 45)" }} />
                      <span className="text-[10px] font-medium uppercase tracking-wide flex-1" style={{ color: "oklch(0.45 0.15 45)" }}>
                        Summoned to office
                      </span>
                      <button 
                        onClick={() => dismissSummon(staff.id)} 
                        className="text-[9px] font-medium uppercase transition-colors hover:opacity-70"
                        style={{ color: "oklch(0.65 0.15 45)" }}
                      >
                        Clear
                      </button>
                    </div>
                  )}

                  {/* Header: Avatar + Info + Menu */}
                  <div className="flex items-start gap-3">
                    <div className="relative shrink-0">
                      <div 
                        className="w-14 h-14 rounded-2xl overflow-hidden ring-2 ring-white shadow-lg transition-all duration-500 group-hover:scale-105 group-hover:rotate-3"
                        style={{ boxShadow: "0 4px 16px rgba(0,0,0,0.12)" }}
                      >
                        <img src={staff.avatar} alt={staff.name} className="w-full h-full object-cover" />
                      </div>
                      <div 
                        className={cn(
                          "absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white shadow-md",
                          staff.status === "active" ? "bg-emerald-500" : "bg-amber-500"
                        )}
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-sm uppercase truncate leading-tight" style={{ color: "#0D031B" }}>
                        {staff.name}
                      </h3>
                      <div className="flex items-center gap-1.5 mt-1.5">
                        <div 
                          className={cn(
                            "flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-medium uppercase tracking-wide",
                            roleInfo.bg,
                            roleInfo.text
                          )}
                        >
                          <RoleIcon className="h-3 w-3" strokeWidth={2.5} />
                          {staff.role}
                        </div>
                      </div>
                    </div>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="shrink-0 h-8 w-8 flex items-center justify-center rounded-xl transition-all hover:bg-oklch(0.42 0.14 285 / 0.08) active:scale-90"
                          style={{ color: "#9A94AA" }}>
                          <EllipsisHorizontalIcon className="h-4 w-4" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-white/98 backdrop-blur-xl border-0 rounded-2xl shadow-2xl w-48">
                        <DropdownMenuItem className="text-xs font-medium rounded-xl m-1 focus:bg-oklch(0.42 0.14 285 / 0.08)" style={{ color: "oklch(0.42 0.14 285)" }}>
                          <UserCircleIcon className="h-3.5 w-3.5 mr-2" />
                          Full Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-xs font-medium rounded-xl m-1 focus:bg-oklch(0.42 0.14 285 / 0.08)">
                          <ClockIcon className="h-3.5 w-3.5 mr-2" />
                          Duty Log
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-xs font-medium rounded-xl m-1 focus:bg-oklch(0.42 0.14 285 / 0.08)">
                          <ChatBubbleLeftRightIcon className="h-3.5 w-3.5 mr-2" />
                          Send Ping
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-oklch(0.42 0.14 285 / 0.05)" />
                        <DropdownMenuItem className="text-xs font-medium rounded-xl m-1 focus:bg-rose-50" style={{ color: "oklch(0.55 0.20 25)" }}>
                          Remove Staff
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  {/* Stats Row */}
                  <div className="grid grid-cols-2 gap-2">
                    <div 
                      className="rounded-xl px-3 py-2.5 flex items-center gap-2 transition-all hover:scale-105"
                      style={{ background: "oklch(0.95 0.05 50 / 0.4)" }}
                    >
                      <StarIcon className="h-3.5 w-3.5 fill-amber-400 text-amber-400 shrink-0" />
                      <div className="min-w-0">
                        <p className="text-sm font-medium leading-none" style={{ color: "oklch(0.45 0.15 45)" }}>
                          {staff.rating}
                        </p>
                        <p className="text-[9px] font-medium uppercase mt-0.5" style={{ color: "oklch(0.60 0.10 45)" }}>
                          Rating
                        </p>
                      </div>
                    </div>

                    <div 
                      className="rounded-xl px-3 py-2.5 flex items-center gap-2 transition-all hover:scale-105"
                      style={{ background: "oklch(0.42 0.14 285 / 0.06)" }}
                    >
                      <ClockIcon className="h-3.5 w-3.5 shrink-0" style={{ color: "oklch(0.42 0.14 285)" }} />
                      <div className="min-w-0">
                        <p className="text-[10px] font-medium leading-tight line-clamp-1" style={{ color: "#0D031B" }}>
                          {staff.shift}
                        </p>
                        <p className="text-[9px] font-medium uppercase mt-0.5" style={{ color: "#9A94AA" }}>
                          Shift
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Details Row */}
                  <div className="flex items-center justify-between text-[10px] font-medium uppercase tracking-wide">
                    <span className="flex items-center gap-1.5" style={{ color: "#9A94AA" }}>
                      <CalendarIcon className="h-3 w-3" />
                      {staff.shiftsThisWeek} shifts/wk
                    </span>
                    
                    {staff.role === "Waiter" && staff.tables.length > 0 && (
                      <div className="flex items-center gap-1">
                        {staff.tables.slice(0, 3).map(t => (
                          <span 
                            key={t} 
                            className="px-2 py-0.5 rounded-lg text-[10px] font-medium border"
                            style={{
                              background: "oklch(0.42 0.14 285 / 0.08)",
                              color: "oklch(0.42 0.14 285)",
                              borderColor: "oklch(0.42 0.14 285 / 0.2)",
                            }}
                          >
                            {t}
                          </span>
                        ))}
                        {staff.tables.length > 3 && (
                          <span className="text-[9px]" style={{ color: "#C4BAD8" }}>
                            +{staff.tables.length - 3}
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Performance Progress */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-[9px] font-medium uppercase tracking-wide">
                      <span style={{ color: "#9A94AA" }}>Performance</span>
                      <span className="tabular-nums" style={{ color: "oklch(0.42 0.14 285)" }}>
                        {Math.round(staff.rating * 20)}%
                      </span>
                    </div>
                    <div className="h-2 rounded-full overflow-hidden" style={{ background: "oklch(0.42 0.14 285 / 0.08)" }}>
                      <div 
                        className="h-full rounded-full transition-all duration-1000"
                        style={{ 
                          width: `${staff.rating * 20}%`,
                          background: "linear-gradient(90deg, oklch(0.42 0.14 285) 0%, oklch(0.55 0.18 270) 100%)",
                        }}
                      />
                    </div>
                  </div>

                  {/* Award Stars Section */}
                  <div className="pt-3 border-t space-y-2" style={{ borderColor: "oklch(0.42 0.14 285 / 0.08)" }}>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-medium uppercase tracking-wide" style={{ color: "#9A94AA" }}>
                        Performance Award
                      </span>
                      {awardedFlash === staff.id && (
                        <span className="text-[10px] font-medium uppercase animate-in fade-in zoom-in-95 duration-300" style={{ color: "oklch(0.65 0.15 45)" }}>
                          ⭐ Awarded!
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-1.5">
                      {[1, 2, 3, 4, 5].map(n => (
                        <button
                          key={n}
                          onClick={() => giveAward(staff.id, n)}
                          className="transition-all duration-200 hover:scale-125 active:scale-90"
                          title={`Give ${n} star${n > 1 ? 's' : ''}`}
                        >
                          <StarIcon
                            className={cn(
                              "h-5 w-5 transition-colors duration-200",
                              (awards[staff.id] ?? 0) >= n
                                ? "text-amber-400 fill-amber-400 drop-shadow-md"
                                : "text-muted-foreground/20 hover:text-amber-300"
                            )}
                          />
                        </button>
                      ))}
                      
                      {awards[staff.id] && (
                        <button
                          onClick={() => setAwards(prev => { const n = {...prev}; delete n[staff.id]; return n })}
                          className="ml-auto text-[9px] font-medium uppercase tracking-wide transition-colors hover:opacity-70"
                          style={{ color: "#C4BAD8" }}
                        >
                          Clear
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="grid grid-cols-2 gap-2 pt-2">
                    <Button
                      variant="ghost"
                      className="h-9 rounded-xl text-[10px] font-bold uppercase gap-1.5 transition-all hover:scale-105 active:scale-95"
                      style={{ color: "oklch(0.42 0.14 285)" }}
                    >
                      <PhoneIcon className="h-3.5 w-3.5" />
                      Call
                    </Button>
                    <Button
                      variant="ghost"
                      className="h-9 rounded-xl text-[10px] font-bold uppercase gap-1.5 transition-all hover:scale-105 active:scale-95"
                      style={{ color: "oklch(0.42 0.14 285)" }}
                    >
                      <EnvelopeIcon className="h-3.5 w-3.5" />
                      Email
                    </Button>
                  </div>

                  {/* Summon Button */}
                  <Button
                    onClick={() => summonStaff(staff.id, staff.name)}
                    disabled={summoned[staff.id]}
                    className={cn(
                      "w-full h-10 rounded-xl text-[11px] font-bold uppercase tracking-wide gap-2 border-0 transition-all duration-300",
                      summoned[staff.id]
                        ? "bg-amber-100 text-amber-600 cursor-not-allowed"
                        : "text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5 hover:scale-[1.02] active:translate-y-0 active:scale-95"
                    )}
                    style={
                      !summoned[staff.id]
                        ? {
                            background: "linear-gradient(135deg, oklch(0.42 0.14 285) 0%, oklch(0.38 0.16 275) 100%)",
                            boxShadow: "0 4px 16px oklch(0.42 0.14 285 / 0.3)",
                          }
                        : undefined
                    }
                  >
                    <BellAlertIcon className={cn("h-4 w-4", summoned[staff.id] && "animate-pulse")} strokeWidth={2.5} />
                    {summoned[staff.id] ? "Summoned" : "Report to Office"}
                  </Button>

                  {/* View Analytics Link */}
                  <button className="w-full h-8 flex items-center justify-center gap-1 text-[10px] font-medium uppercase tracking-wide transition-all hover:opacity-70 rounded-xl"
                    style={{ color: "#9A94AA" }}>
                    View Full Analytics
                    <ChevronRightIcon className="h-3 w-3" />
                  </button>

                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* ── Enhanced Footer Card ── */}
        <Card 
          className="border-0 rounded-[24px] shadow-xl overflow-hidden"
          style={{
            background: "white",
            boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
          }}
        >
          <CardContent className="p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-5 text-center md:text-left">
              <div 
                className="w-14 h-14 sm:w-16 sm:h-16 rounded-[20px] flex items-center justify-center shadow-lg shrink-0"
                style={{
                  background: "linear-gradient(135deg, oklch(0.65 0.18 150) 0%, oklch(0.70 0.20 160) 100%)",
                }}
              >
                <CheckCircleIcon className="h-7 w-7 sm:h-8 sm:w-8 text-white" strokeWidth={2.5} />
              </div>
              <div className="space-y-1.5">
                <h3 className="font-normal text-lg sm:text-xl uppercase tracking-tight leading-none" style={{ color: "#0D031B" }}>
                  Operational Saturation
                </h3>
                <p className="text-[11px] sm:text-xs font-medium" style={{ color: "#736C83" }}>
                  All station quotas met for the active shift cycle
                </p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <Button 
                variant="outline" 
                className="h-11 sm:h-12 px-6 sm:px-8 border-2 font-bold rounded-[14px] text-xs uppercase tracking-wide transition-all hover:scale-105 active:scale-95"
                style={{
                  borderColor: "oklch(0.42 0.14 285 / 0.15)",
                  color: "#736C83",
                }}
              >
                View Archive
              </Button>
              <Button 
                onClick={() => setIsAuditOpen(true)}
                className="h-11 sm:h-12 px-6 sm:px-8 text-white font-bold rounded-[14px] shadow-xl border-0 text-xs uppercase tracking-wide transition-all hover:-translate-y-0.5 hover:shadow-2xl active:translate-y-0 active:scale-95"
                style={{
                  background: "linear-gradient(135deg, oklch(0.42 0.14 285) 0%, oklch(0.38 0.16 275) 100%)",
                  boxShadow: "0 8px 32px oklch(0.42 0.14 285 / 0.35)",
                }}
              >
                <ArrowTrendingUpIcon className="h-4 w-4 mr-2" strokeWidth={2.5} />
                Weekly Roster Audit
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* ── Enhanced Roster Audit Sheet ── */}
        <Sheet open={isAuditOpen} onOpenChange={setIsAuditOpen}>
          <SheetContent 
            className="sm:max-w-lg p-0 overflow-hidden flex flex-col border-0"
            style={{
              background: "linear-gradient(135deg, #FFFFFF 0%, #F8F6FC 100%)",
            }}
          >
            {/* Gradient header bar */}
            <div 
              className="h-1.5 w-full"
              style={{
                background: "linear-gradient(90deg, oklch(0.42 0.14 285) 0%, oklch(0.55 0.18 270) 50%, oklch(0.42 0.14 285) 100%)"
              }}
            />

            <div className="p-6 sm:p-8 space-y-6 flex-1 overflow-y-auto">
              <SheetHeader className="text-left space-y-4">
                <div 
                  className="w-14 h-14 rounded-[18px] flex items-center justify-center shadow-lg"
                  style={{
                    background: "linear-gradient(135deg, oklch(0.42 0.14 285) 0%, oklch(0.38 0.16 275) 100%)",
                  }}
                >
                  <SparklesIcon className="h-7 w-7 text-white" strokeWidth={2.5} />
                </div>
                <div>
                  <SheetTitle className="text-2xl sm:text-3xl font-normal uppercase tracking-tight leading-none" style={{ color: "#0D031B" }}>
                    Weekly Roster Audit
                  </SheetTitle>
                  <SheetDescription className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider mt-2" style={{ color: "#736C83" }}>
                    Performance Analysis — Week 14, 2026
                  </SheetDescription>
                </div>
              </SheetHeader>

              <div className="space-y-6">
                {/* Metrics Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div 
                    className="p-5 rounded-[20px] border-2 transition-all hover:scale-105"
                    style={{
                      background: "oklch(0.65 0.18 150 / 0.08)",
                      borderColor: "oklch(0.65 0.18 150 / 0.2)",
                    }}
                  >
                    <p className="text-3xl font-normal leading-none tabular-nums" style={{ color: "oklch(0.45 0.18 150)" }}>
                      {auditMetrics.avgRating}
                    </p>
                    <p className="text-[10px] font-normal uppercase tracking-wide mt-2" style={{ color: "oklch(0.55 0.15 150)" }}>
                      Avg Service Rating
                    </p>
                  </div>
                  <div 
                    className="p-5 rounded-[20px] border-2 transition-all hover:scale-105"
                    style={{
                      background: "oklch(0.42 0.14 285 / 0.08)",
                      borderColor: "oklch(0.42 0.14 285 / 0.2)",
                    }}
                  >
                    <p className="text-3xl font-normal leading-none tabular-nums" style={{ color: "oklch(0.42 0.14 285)" }}>
                      {auditMetrics.totalShifts}
                    </p>
                    <p className="text-[10px] font-normal uppercase tracking-wide mt-2" style={{ color: "#9A94AA" }}>
                      Total Team Shifts
                    </p>
                  </div>
                </div>

                {/* Enhanced Top Performer Card */}
                <div 
                  className="p-6 rounded-[24px] overflow-hidden relative group"
                  style={{
                    background: "linear-gradient(135deg, #0D031B 0%, oklch(0.15 0.10 285) 100%)",
                  }}
                >
                  {/* Decorative orbs */}
                  <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full opacity-20 blur-3xl bg-gradient-to-br from-amber-400 to-amber-600" />
                  <div className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full opacity-10 blur-3xl" style={{ background: "oklch(0.42 0.14 285)" }} />
                  
                  <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-3">
                      <TrophyIcon className="h-4 w-4 text-amber-400 fill-amber-400" />
                      <span className="text-[10px] font-normal uppercase tracking-wider text-amber-400">
                        MVP of the Week
                      </span>
                    </div>

                    <div className="flex items-center gap-4 mb-4">
                      <div 
                        className="w-16 h-16 rounded-[18px] overflow-hidden ring-2 ring-white/20 shadow-xl shrink-0"
                      >
                        <img src={auditMetrics.topPerformer.avatar} alt="" className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xl font-normal uppercase truncate text-white leading-tight">
                          {auditMetrics.topPerformer.name}
                        </h4>
                        <p className="text-[11px] text-white/60 mt-1">
                          {auditMetrics.topPerformer.role} · {auditMetrics.topPerformer.rating} Rating
                        </p>
                      </div>
                    </div>
                    
                    <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                      <p className="text-[10px] text-white/50 uppercase tracking-wide">
                        Incentive Award Eligible
                      </p>
                      <Button 
                        size="sm" 
                        className="h-9 px-5 text-white font-normal text-[10px] uppercase rounded-xl border-0 shadow-lg"
                        style={{
                          background: "linear-gradient(135deg, oklch(0.65 0.15 45) 0%, oklch(0.70 0.15 50) 100%)",
                        }}
                      >
                        <TrophyIcon className="h-3 w-3 mr-1.5" />
                        Send Reward
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Enhanced Staff List */}
                <div className="space-y-3">
                  <h5 className="text-[11px] font-normal uppercase tracking-wider" style={{ color: "#9A94AA" }}>
                    Shift Compliance Overview
                  </h5>
                  <div className="space-y-2">
                    {mockStaff.slice(0, 6).map(s => (
                      <div 
                        key={s.id} 
                        className="flex items-center gap-3 p-4 rounded-[16px] border-2 transition-all hover:scale-[1.02] hover:shadow-md group"
                        style={{
                          background: "white",
                          borderColor: "oklch(0.42 0.14 285 / 0.08)",
                        }}
                      >
                        <div className="w-11 h-11 rounded-xl overflow-hidden shrink-0 ring-2 ring-white shadow-sm">
                          <img 
                            src={s.avatar} 
                            alt="" 
                            className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" 
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[12px] font-normal uppercase truncate leading-tight" style={{ color: "#0D031B" }}>
                            {s.name}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[10px] font-medium" style={{ color: "#9A94AA" }}>
                              {s.shiftsThisWeek} shifts
                            </span>
                            {s.shiftsThisWeek > 5 && (
                              <Badge 
                                className="text-[8px] py-0 px-2 h-auto font-normal uppercase border"
                                style={{
                                  background: "oklch(0.95 0.05 50 / 0.5)",
                                  color: "oklch(0.55 0.15 45)",
                                  borderColor: "oklch(0.75 0.15 50 / 0.3)",
                                }}
                              >
                                Overtime
                              </Badge>
                            )}
                          </div>
                        </div>
                        <CheckCircleIcon className="h-5 w-5 shrink-0" style={{ color: "oklch(0.65 0.18 150)" }} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced Footer */}
            <div 
              className="p-6 border-t space-y-4 shrink-0"
              style={{
                background: "white",
                borderColor: "oklch(0.42 0.14 285 / 0.08)",
              }}
            >
              <div 
                className="flex items-start gap-3 p-4 rounded-xl"
                style={{ background: "oklch(0.95 0.05 50 / 0.3)" }}
              >
                <ExclamationTriangleIcon className="h-4 w-4 shrink-0 mt-0.5" style={{ color: "oklch(0.65 0.15 45)" }} />
                <p className="text-[10px] leading-relaxed font-medium" style={{ color: "#736C83" }}>
                  Audit checks verified by AI Core. All shifts accounted for and validated.
                </p>
              </div>
              
              <Button 
                onClick={() => {
                  toast.success("Roster finalized!", {
                    description: "Successfully synced with Payroll system",
                    icon: <CheckCircleIcon className="h-4 w-4" />,
                  })
                  setIsAuditOpen(false)
                }}
                className="w-full h-13 text-white font-normal text-xs uppercase tracking-wide rounded-[16px] shadow-2xl border-0 transition-all hover:-translate-y-0.5 active:translate-y-0 active:scale-95"
                style={{
                  background: "linear-gradient(135deg, oklch(0.42 0.14 285) 0%, oklch(0.38 0.16 275) 100%)",
                  boxShadow: "0 8px 32px oklch(0.42 0.14 285 / 0.4)",
                }}
              >
                <CheckCircleIcon className="h-4 w-4 mr-2" strokeWidth={2.5} />
                Finalize & Release Roster
              </Button>
            </div>
          </SheetContent>
        </Sheet>

      </div>
    </div>
  )
}