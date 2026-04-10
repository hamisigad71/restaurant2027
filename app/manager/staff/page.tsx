"use client"

import { useState, useMemo, useCallback } from "react"
import { toast } from "sonner"
import { supabase } from "@/lib/supabase"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Clock,
  UserPlus,
  Phone,
  CheckCircle2,
  Search,
  Filter,
  Star,
  Mail,
  Calendar,
  ChevronRight,
  TrendingUp,
  Activity,
  Heart,
  MoreHorizontal,
  BellRing,
  X,
  AlertTriangle,
} from "lucide-react"
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

const roleColor: Record<string, string> = {
  Waiter:    "bg-sky-50 text-sky-600",
  Kitchen:   "bg-orange-50 text-orange-600",
  Manager:   "bg-primary/10 text-primary",
  Host:      "bg-purple-50 text-purple-600",
  Bartender: "bg-rose-50 text-rose-600",
}

const stats = [
  { label: "Active Duty",  value: "48",  sub: "85% capacity",  icon: Activity,   color: "bg-primary/10 text-primary" },
  { label: "Avg. Rating",  value: "4.8", sub: "Top performers", icon: Star,       color: "bg-amber-100 text-amber-600" },
  { label: "Attendance",   value: "96%", sub: "Weekly avg",     icon: Heart,      color: "bg-emerald-100 text-emerald-600" },
  { label: "Open Shifts",  value: "3",   sub: "Needs action",   icon: TrendingUp, color: "bg-blue-100 text-blue-600" },
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
    setTimeout(() => setAwardedFlash(null), 1500)
  }, [])

  const summonStaff = useCallback(async (staffId: number, name: string) => {
    // Optimistic UI
    setSummoned(prev => ({ ...prev, [staffId]: true }))
    setSummonBanner({ id: staffId, name })

    // Database Insert
    const { error } = await supabase
      .from('summons')
      .insert([
        { staff_id: staffId, staff_name: name, status: 'pending' }
      ])

    if (error) {
      console.error('Staff Summon Error:', error)
      toast.error(`Summon failed: ${error.message === 'Could not find the table \'public.summons\' in the schema cache' ? 'Database table missing. Run the SQL setup script.' : error.message}`)

      // Rollback on error
      setSummoned(prev => ({ ...prev, [staffId]: false }))
      setSummonBanner(null)
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
    <div className="flex flex-col min-h-screen">
      <div className="flex-1 py-4 space-y-6">

        {/* ── Summon Banner ── */}
        {summonBanner && (
          <div className="flex items-center gap-4 bg-amber-500 text-white px-5 py-3.5 rounded-2xl shadow-lg shadow-amber-500/30 animate-in slide-in-from-top-2 duration-300">
            <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
              <BellRing className="h-4 w-4 animate-bounce" />
            </div>
            <div className="flex-1">
              <p className="text-[11px] font-heading uppercase  leading-none">Notification Sent</p>
              <p className="text-[10px] font-heading uppercase text-white/70 mt-0.5 ">
                {summonBanner.name} has been asked to report to the manager's office
              </p>
            </div>
            <button
              onClick={() => setSummonBanner(null)}
              className="shrink-0 h-7 w-7 rounded-lg bg-white/20 hover:bg-white/30 flex items-center justify-center transition-all"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        )}

        {/* ── Header ── */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-0.5">
            <h1 className="text-3xl font-heading uppercase text-foreground leading-none">Personnel Hub</h1>
            <div className="flex items-center gap-2 text-[10px] font-medium font-heading uppercase text-primary/50">
              <div className="w-8 h-[1px] bg-primary/20" />
              Operational Control &amp; Performance
            </div>
          </div>
          <Button className="h-11 px-7 gap-2.5 bg-primary text-white font-heading uppercase rounded-xl shadow-lg shadow-primary/25 hover:scale-105 hover:-translate-y-0.5 transition-all duration-300 border-none text-[10px]">
            <UserPlus className="h-4 w-4" /> Recruit Staff
          </Button>
        </div>

        {/* ── Stats ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {stats.map(s => (
            <Card key={s.label} className="bg-white border-primary/5 rounded-2xl shadow-sm group hover:shadow-md transition-all overflow-hidden">
              <CardContent className="p-4 flex items-center gap-3">
                <div className={cn("p-2.5 rounded-xl group-hover:scale-110 transition-transform shrink-0", s.color)}>
                  <s.icon className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xl font-heading text-foreground leading-none tabular-nums">{s.value}</p>
                  <p className="text-[8px] font-heading uppercase text-muted-foreground/60 mt-0.5">{s.label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* ── Filters ── */}
        <div className="flex flex-col sm:flex-row gap-3 items-center bg-white/60 backdrop-blur-xl p-2.5 rounded-2xl border border-primary/5">
          <div className="relative w-full sm:flex-1 group">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-primary/30 group-focus-within:text-primary transition-colors" />
            <Input
              placeholder="Search by name or role..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-10 bg-white border-primary/5 h-10 rounded-xl focus-visible:ring-primary/10 text-sm shadow-sm"
            />
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="h-10 w-full sm:w-36 bg-white border-primary/5 rounded-xl text-[9px] font-heading uppercase text-muted-foreground focus:ring-primary/10">
                <SelectValue placeholder="Role" />
              </SelectTrigger>
              <SelectContent className="bg-white/95 backdrop-blur-xl border-primary/10">
                {["all","waiter","kitchen","manager","host","bartender"].map(r => (
                  <SelectItem key={r} value={r} className="text-[9px] uppercase">{r === "all" ? "All Roles" : r}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon" className="h-10 w-10 rounded-xl bg-white border-primary/5 text-primary/60 shrink-0">
              <Filter className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>

        {/* ── Staff Grid ── */}
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {filtered.map(staff => (
            <Card
              key={staff.id}
              className="group relative bg-white border-0 ring-1 ring-black/5 shadow-sm hover:shadow-xl hover:shadow-primary/8 hover:-translate-y-1 transition-all duration-400 rounded-2xl overflow-hidden"
            >
              {/* Subtle top accent bar */}
              <div className={cn(
                "h-0.5 w-full",
                staff.status === "active" ? "bg-gradient-to-r from-emerald-400 to-emerald-300" : "bg-gradient-to-r from-amber-400 to-amber-300"
              )} />

              <CardContent className="p-4 space-y-3">

                {/* Summoned badge */}
                {summoned[staff.id] && (
                  <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-200 rounded-xl px-3 py-1.5 mb-2">
                    <BellRing className="h-3 w-3 text-amber-500 animate-pulse shrink-0" />
                    <span className="text-[8px] font-heading uppercase  text-amber-600 flex-1">Summoned to office</span>
                    <button onClick={() => dismissSummon(staff.id)} className="text-[7px] font-heading uppercase text-amber-400 hover:text-rose-500 transition-colors">
                      dismiss
                    </button>
                  </div>
                )}

                {/* Row 1: Avatar + Name + Menu */}
                <div className="flex items-center gap-3">
                  <div className="relative shrink-0">
                    <div className="w-11 h-11 rounded-xl overflow-hidden ring-2 ring-white shadow-md group-hover:scale-105 transition-transform duration-500">
                      <img src={staff.avatar} alt={staff.name} className="w-full h-full object-cover" />
                    </div>
                    <div className={cn(
                      "absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white",
                      staff.status === "active" ? "bg-emerald-500" : "bg-amber-400"
                    )} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="font-heading text-[11px] uppercase text-foreground truncate leading-tight">{staff.name}</h3>
                    <span className={cn(
                      "inline-block mt-0.5 px-2 py-0.5 rounded-md text-[8px] font-heading uppercase ",
                      roleColor[staff.role] ?? "bg-slate-100 text-slate-500"
                    )}>
                      {staff.role}
                    </span>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="shrink-0 h-6 w-6 flex items-center justify-center rounded-lg text-muted-foreground/30 hover:text-primary hover:bg-primary/5 transition-all">
                        <MoreHorizontal className="h-3.5 w-3.5" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="text-xs">
                      <DropdownMenuItem className="text-[9px] font-heading uppercase  text-primary focus:bg-primary/5">View Profile</DropdownMenuItem>
                      <DropdownMenuItem className="text-[9px] font-heading uppercase  focus:bg-primary/5">Reassign Tables</DropdownMenuItem>
                      <DropdownMenuItem className="text-[9px] font-heading uppercase  text-destructive focus:bg-destructive/5">Remove</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Row 2: Rating + Shift */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-amber-50 rounded-xl px-2.5 py-2 flex items-center gap-1.5">
                    <Star className="h-3 w-3 text-amber-400 fill-amber-400 shrink-0" />
                    <div>
                      <p className="text-[10px] font-heading text-amber-700 leading-none">{staff.rating}</p>
                      <p className="text-[7px] font-heading uppercase text-amber-500/70 mt-0.5">Rating</p>
                    </div>
                  </div>
                  <div className="bg-primary/5 rounded-xl px-2.5 py-2 flex items-center gap-1.5">
                    <Clock className="h-3 w-3 text-primary/50 shrink-0" />
                    <div>
                      <p className="text-[8px] font-heading text-foreground/80 leading-tight">{staff.shift}</p>
                      <p className="text-[7px] font-heading uppercase text-primary/40 mt-0.5">Shift</p>
                    </div>
                  </div>
                </div>

                {/* Row 3: P/wk + Tables (waiter only) */}
                <div className="flex items-center justify-between text-[8px] font-heading uppercase">
                  <span className="text-muted-foreground/50 flex items-center gap-1">
                    <Calendar className="h-2.5 w-2.5" /> {staff.shiftsThisWeek} shifts/wk
                  </span>
                  {staff.role === "Waiter" && staff.tables.length > 0 && (
                    <div className="flex items-center gap-1">
                      {staff.tables.slice(0, 3).map(t => (
                        <span key={t} className="px-1.5 py-0.5 rounded-md bg-primary/8 text-primary text-[8px] border border-primary/10">{t}</span>
                      ))}
                      {staff.tables.length > 3 && (
                        <span className="text-[7px] text-muted-foreground/50">+{staff.tables.length - 3}</span>
                      )}
                    </div>
                  )}
                </div>

                {/* Row 4: Progress */}
                <div className="space-y-1">
                  <div className="flex justify-between items-center text-[7.5px] font-heading uppercase text-muted-foreground/50">
                    <span>Performance</span>
                    <span className="tabular-nums">{Math.round(staff.rating * 20)}%</span>
                  </div>
                  <Progress value={staff.rating * 20} className="h-1 bg-primary/5" />
                </div>

                {/* Row 5: Award Stars */}
                <div className="pt-2 border-t border-black/5 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[7.5px] font-heading uppercase text-muted-foreground/50 ">Award Stars</span>
                    {awardedFlash === staff.id && (
                      <span className="text-[7.5px] font-heading uppercase text-amber-500 animate-in fade-in zoom-in duration-300">⭐ Awarded!</span>
                    )}
                  </div>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map(n => (
                      <button
                        key={n}
                        onClick={() => giveAward(staff.id, n)}
                        className="transition-all duration-200 hover:scale-125 active:scale-95"
                        title={`Give ${n} star${n > 1 ? 's' : ''}`}
                      >
                        <Star
                          className={`h-4 w-4 transition-colors duration-150 ${
                            (awards[staff.id] ?? 0) >= n
                              ? "text-amber-400 fill-amber-400"
                              : "text-muted-foreground/20 hover:text-amber-300"
                          }`}
                        />
                      </button>
                    ))}
                    {awards[staff.id] && (
                      <button
                        onClick={() => setAwards(prev => { const n = {...prev}; delete n[staff.id]; return n })}
                        className="ml-auto text-[7px] font-heading uppercase text-muted-foreground/30 hover:text-rose-400 transition-colors"
                      >
                        clear
                      </button>
                    )}
                  </div>
                </div>

                {/* Row 6: Actions */}
                <div className="grid grid-cols-2 gap-1.5 pt-1 border-t border-black/5">
                  <Button
                    variant="ghost"
                    className="h-7 rounded-lg text-[8px] font-heading uppercase gap-1 text-primary/60 hover:text-primary hover:bg-primary/5 transition-all"
                  >
                    <Phone className="h-3 w-3" /> Call
                  </Button>
                  <Button
                    variant="ghost"
                    className="h-7 rounded-lg text-[8px] font-heading uppercase gap-1 text-primary/60 hover:text-primary hover:bg-primary/5 transition-all"
                  >
                    <Mail className="h-3 w-3" /> Email
                  </Button>
                </div>

                {/* Summon button */}
                <Button
                  onClick={() => summonStaff(staff.id, staff.name)}
                  disabled={summoned[staff.id]}
                  className={cn(
                    "w-full h-8 rounded-xl text-[8px] font-heading uppercase  gap-1.5 border-none transition-all",
                    summoned[staff.id]
                      ? "bg-amber-100 text-amber-600 cursor-not-allowed"
                      : "bg-primary/8 text-primary hover:bg-primary hover:text-white shadow-none hover:shadow-md hover:shadow-primary/20 hover:scale-[1.02] active:scale-[0.98]"
                  )}
                >
                  <BellRing className={cn("h-3 w-3", summoned[staff.id] && "animate-pulse")} />
                  {summoned[staff.id] ? "Summoned" : "Report to Office"}
                </Button>

                <Button
                  variant="ghost"
                  className="w-full h-6 text-[7px] font-heading uppercase text-muted-foreground/35 hover:text-primary hover:bg-primary/5 transition-all rounded-lg gap-1"
                >
                  Full Analytics <ChevronRight className="h-2.5 w-2.5" />
                </Button>

              </CardContent>
            </Card>
          ))}
        </div>

        {/* ── Footer ── */}
        <Card className="border-none bg-white shadow-lg shadow-primary/5 rounded-2xl overflow-hidden">
          <CardContent className="p-6 flex flex-col md:flex-row items-center justify-between gap-5">
            <div className="flex items-center gap-5">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-inner shrink-0">
                <CheckCircle2 className="h-7 w-7" />
              </div>
              <div className="space-y-0.5 text-center md:text-left">
                <h3 className="font-heading text-xl uppercase text-foreground leading-none">Operational Saturation</h3>
                <p className="text-[10px] font-heading uppercase text-muted-foreground/60 ">All station quotas met for the active shift cycle.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="h-11 px-6 border-primary/10 text-muted-foreground font-heading uppercase rounded-xl hover:bg-primary/5 transition-all text-[10px]">
                Archive
              </Button>
              <Button 
                onClick={() => setIsAuditOpen(true)}
                className="h-11 px-7 bg-primary text-white font-heading uppercase rounded-xl shadow-lg shadow-primary/20 hover:opacity-90 transition-all border-none text-[10px]"
              >
                Weekly Roster Audit
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* ── Roster Audit Sheet ── */}
        <Sheet open={isAuditOpen} onOpenChange={setIsAuditOpen}>
          <SheetContent className="sm:max-w-md bg-white/95 backdrop-blur-xl border-l border-primary/10 p-0 overflow-hidden flex flex-col">
            <div className="p-6 space-y-6 flex-1 overflow-y-auto custom-scrollbar">
              <SheetHeader className="text-left">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-4">
                  <Activity className="h-6 w-6" />
                </div>
                <SheetTitle className="text-2xl font-heading uppercase text-foreground">Weekly Roster Audit</SheetTitle>
                <SheetDescription className="text-[10px] font-heading uppercase  text-primary/50">
                  Performance Analysis — Week 14, 2026
                </SheetDescription>
              </SheetHeader>

              <div className="space-y-5">
                {/* Metrics Grid */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-4 rounded-3xl bg-emerald-50 border border-emerald-100/50">
                    <p className="text-2xl font-heading text-emerald-600 leading-none tabular-nums">{auditMetrics.avgRating}</p>
                    <p className="text-[9px] font-heading uppercase text-emerald-600/60 mt-1">Avg Service Rating</p>
                  </div>
                  <div className="p-4 rounded-3xl bg-primary/5 border border-primary/10">
                    <p className="text-2xl font-heading text-primary leading-none tabular-nums">{auditMetrics.totalShifts}</p>
                    <p className="text-[9px] font-heading uppercase text-primary/40 mt-1">Total Team Shifts</p>
                  </div>
                </div>

                {/* Top Performer Section */}
                <div className="p-5 rounded-[2rem] bg-[#0D031B] text-white overflow-hidden relative group">
                  {/* Decorative Sparkle */}
                  <div className="absolute -top-6 -right-6 w-24 h-24 bg-primary/20 rounded-full blur-2xl group-hover:bg-primary/30 transition-all duration-500" />
                  
                  <div className="relative z-10 flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl overflow-hidden ring-2 ring-primary/20 shrink-0">
                      <img src={auditMetrics.topPerformer.avatar} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 mb-1">
                        <Star className="h-3 w-3 text-amber-400 fill-amber-400" />
                        <span className="text-[8px] font-heading uppercase  text-primary">MVP of the Week</span>
                      </div>
                      <h4 className="text-lg font-heading uppercase truncate">{auditMetrics.topPerformer.name}</h4>
                      <p className="text-[10px] text-white/50">{auditMetrics.topPerformer.role} · {auditMetrics.topPerformer.rating} High-score</p>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between">
                    <p className="text-[9px] text-white/40 uppercase ">Incentive Award Eligible</p>
                    <Button size="sm" className="h-7 px-3 bg-primary text-white text-[9px] uppercase font-heading rounded-lg border-none shadow-lg shadow-primary/20">
                      Reward
                    </Button>
                  </div>
                </div>

                {/* Staff Attendance List */}
                <div className="space-y-3">
                  <h5 className="text-[10px] font-heading uppercase  text-muted-foreground/60">Shift Compliance</h5>
                  <div className="space-y-2">
                    {mockStaff.slice(0, 6).map(s => (
                      <div key={s.id} className="flex items-center gap-3 p-3 rounded-2xl bg-white border border-black/[0.03] hover:border-primary/20 transition-all group">
                        <div className="w-8 h-8 rounded-xl bg-slate-100 overflow-hidden shrink-0">
                          <img src={s.avatar} alt="" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[11px] font-heading uppercase text-foreground truncate">{s.name}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[8px] text-muted-foreground/50">{s.shiftsThisWeek} shifts completed</span>
                            {s.shiftsThisWeek > 5 && (
                              <Badge className="bg-amber-100 text-amber-600 border-none text-[7px] py-0 px-1.5 h-auto uppercase">Overtime</Badge>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                           <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 pt-2 border-t border-primary/5 space-y-3 shrink-0">
               <div className="flex items-center gap-2 text-[9px] text-muted-foreground/60 italic leading-relaxed">
                  <AlertTriangle className="h-3 w-3 text-amber-400 shrink-0" />
                  Audit checks verified by AI Core. All shifts accounted for.
               </div>
               <Button 
                onClick={() => {
                  toast.success("Roster finalized and synced with Payroll successfully!")
                  setIsAuditOpen(false)
                }}
                className="w-full h-12 bg-primary text-white font-heading uppercase text-xs  rounded-2xl shadow-xl shadow-primary/25 border-none"
               >
                 Finalize & Release Roster
               </Button>
            </div>
          </SheetContent>
        </Sheet>

      </div>
    </div>
  )
}
