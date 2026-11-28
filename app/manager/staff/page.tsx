"use client"

import { useState, useMemo, useCallback } from "react"
import { AnimatePresence, motion } from "motion/react"
import { FAST_TRANSITION } from "@/lib/motion"
import { toast } from "sonner"
import { supabase } from "@/lib/supabase"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
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
  UserCircleIcon,
  ChatBubbleLeftRightIcon,
} from "@heroicons/react/24/outline"
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
  { id: 1, name: "Peter Ochieng", role: "Waiter", status: "active", tables: ["1", "2", "3"], shift: "8am – 4pm", shiftsThisWeek: 5, rating: 4.8, avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop&face" },
  { id: 2, name: "Mary Akinyi", role: "Waiter", status: "active", tables: ["4", "5", "12"], shift: "8am – 4pm", shiftsThisWeek: 4, rating: 4.9, avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&h=120&fit=crop&face" },
  { id: 3, name: "John Doe", role: "Kitchen", status: "break", tables: [], shift: "7am – 3pm", shiftsThisWeek: 6, rating: 4.5, avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&h=120&fit=crop&face" },
  { id: 4, name: "Grace Wanjiku", role: "Manager", status: "active", tables: [], shift: "9am – 6pm", shiftsThisWeek: 5, rating: 5.0, avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&h=120&fit=crop&face" },
  { id: 5, name: "Kevin Maina", role: "Waiter", status: "active", tables: ["6", "7"], shift: "12pm – 8pm", shiftsThisWeek: 3, rating: 4.7, avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a63c5?w=120&h=120&fit=crop&face" },
  { id: 6, name: "Amina Hassan", role: "Kitchen", status: "active", tables: [], shift: "6am – 2pm", shiftsThisWeek: 5, rating: 4.6, avatar: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=120&h=120&fit=crop&face" },
  { id: 7, name: "Daniel Njoroge", role: "Waiter", status: "break", tables: ["8", "9"], shift: "2pm – 10pm", shiftsThisWeek: 4, rating: 4.4, avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&h=120&fit=crop&face" },
  { id: 8, name: "Sophie Kamau", role: "Host", status: "active", tables: [], shift: "10am – 6pm", shiftsThisWeek: 5, rating: 4.9, avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120&h=120&fit=crop&face" },
  { id: 9, name: "Brian Otieno", role: "Bartender", status: "active", tables: [], shift: "4pm – 12am", shiftsThisWeek: 6, rating: 4.8, avatar: "https://images.unsplash.com/photo-1463453091185-61582044d556?w=120&h=120&fit=crop&face" },
]

const roleConfig: Record<string, { tone: string; icon: typeof UserGroupIcon }> = {
  Waiter: { tone: "bg-sky-500/10 text-sky-600 border-sky-500/20", icon: UserGroupIcon },
  Kitchen: { tone: "bg-warning/10 text-warning border-warning/20", icon: FlagIcon },
  Manager: { tone: "bg-primary/10 text-primary border-primary/20", icon: TrophyIcon },
  Host: { tone: "bg-pink-500/10 text-pink-600 border-pink-500/20", icon: HeartIcon },
  Bartender: { tone: "bg-destructive/10 text-destructive border-destructive/20", icon: BoltIcon },
}

const stats = [
  { label: "Active Duty", value: "48", sub: "85% capacity", icon: "/employee.png" },
  { label: "Avg. Rating", value: "4.8", sub: "Top performers", icon: "/rating.png" },
  { label: "Attendance", value: "96%", sub: "Weekly avg", icon: HeartIcon },
  { label: "Open Shifts", value: "3", sub: "Needs action", icon: ArrowTrendingUpIcon },
]

export default function ManagerStaffPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")
  const [awards, setAwards] = useState<Record<number, number>>({})
  const [awardedFlash, setAwardedFlash] = useState<number | null>(null)
  const [summoned, setSummoned] = useState<Record<number, boolean>>({})
  const [summonBanner, setSummonBanner] = useState<{ id: number; name: string } | null>(null)
  const [isAuditOpen, setIsAuditOpen] = useState(false)

  const auditMetrics = useMemo(() => {
    const totalShifts = mockStaff.reduce((s, st) => s + st.shiftsThisWeek, 0)
    const avgRating = (mockStaff.reduce((s, st) => s + st.rating, 0) / mockStaff.length).toFixed(1)
    const topPerformer = [...mockStaff].sort((a, b) => b.rating - a.rating)[0]
    const overtimeStaff = mockStaff.filter((s) => s.shiftsThisWeek > 5)

    return { totalShifts, avgRating, topPerformer, overtimeStaff }
  }, [])

  const giveAward = useCallback((staffId: number, stars: number) => {
    setAwards((prev) => ({ ...prev, [staffId]: stars }))
    setAwardedFlash(staffId)
    toast.success(`${stars} star${stars > 1 ? "s" : ""} awarded!`, {
      description: "Performance recognition recorded",
      icon: <StarIcon className="size-4 fill-amber-400 text-amber-400" />,
    })
    setTimeout(() => setAwardedFlash(null), 2000)
  }, [])

  const summonStaff = useCallback(async (staffId: number, name: string) => {
    setSummoned((prev) => ({ ...prev, [staffId]: true }))
    setSummonBanner({ id: staffId, name })

    const { error } = await supabase
      .from("summons")
      .insert([{ staff_id: staffId, staff_name: name, status: "pending" }])

    if (error) {
      console.error("Staff Summon Error:", error)
      toast.error("Summon failed", {
        description: error.message.includes("table")
          ? "Database table missing. Run the SQL setup script."
          : error.message,
      })
      setSummoned((prev) => ({ ...prev, [staffId]: false }))
      setSummonBanner(null)
    } else {
      toast.success(`${name} summoned`, {
        description: "Notification sent to staff member",
        icon: <BellAlertIcon className="size-4" />,
      })
    }
  }, [])

  const dismissSummon = useCallback(
    (staffId: number) => {
      setSummoned((prev) => ({ ...prev, [staffId]: false }))
      if (summonBanner?.id === staffId) setSummonBanner(null)
    },
    [summonBanner],
  )

  const filtered = useMemo(
    () =>
      mockStaff.filter((s) => {
        const q = searchQuery.toLowerCase()
        return (
          (s.name.toLowerCase().includes(q) || s.role.toLowerCase().includes(q)) &&
          (roleFilter === "all" || s.role.toLowerCase() === roleFilter)
        )
      }),
    [searchQuery, roleFilter],
  )

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <div className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6">
        <AnimatePresence>
          {summonBanner && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={FAST_TRANSITION}
            >
              <Alert className="border-warning/30 bg-warning/10">
                <BellAlertIcon className="text-warning" />
                <AlertTitle>Notification Sent</AlertTitle>
                <AlertDescription className="flex items-center justify-between w-full">
                  <span>{summonBanner.name} requested to report to manager&apos;s office</span>
                  <Button
                    variant="ghost"
                    size="icon-xs"
                    onClick={() => setSummonBanner(null)}
                    aria-label="Dismiss notification"
                  >
                    <XMarkIcon className="size-4" />
                  </Button>
                </AlertDescription>
              </Alert>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex size-12 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
              <img src="/service (1).png" className="size-6 brightness-0 invert" alt="Service" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-semibold text-foreground leading-none">
                Personnel Hub
              </h1>
              <p className="text-xs font-medium uppercase text-muted-foreground mt-1">
                Operational Control &amp; Performance
              </p>
            </div>
          </div>

          <Button className="gap-2">
            <UserPlusIcon className="size-4" />
            Recruit Staff
          </Button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((s) => {
            const IconComp = typeof s.icon === "string" ? null : s.icon
            return (
              <Card key={s.label} size="sm">
                <CardHeader>
                  <CardDescription className="text-xs uppercase">{s.label}</CardDescription>
                  <CardAction>
                    <div className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                      {typeof s.icon === "string" ? (
                        <img
                          src={s.icon}
                          className="size-5 object-contain brightness-0 invert"
                          alt={s.label}
                        />
                      ) : IconComp ? (
                        <IconComp className="size-4" />
                      ) : null}
                    </div>
                  </CardAction>
                </CardHeader>
                <CardContent className="flex items-end justify-between gap-2">
                  <CardTitle className="text-3xl font-semibold tabular-nums">{s.value}</CardTitle>
                  <Badge variant="secondary" className="gap-1 text-[10px]">
                    <ArrowTrendingUpIcon className="size-3" />
                    {s.sub}
                  </Badge>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <Card size="sm">
          <CardContent className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
            <InputGroup className="flex-1">
              <InputGroupAddon>
                <MagnifyingGlassIcon />
              </InputGroupAddon>
              <InputGroupInput
                placeholder="Search by name or role..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </InputGroup>

            <div className="flex items-center gap-2">
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Role" />
                </SelectTrigger>
                <SelectContent>
                  {["all", "waiter", "kitchen", "manager", "host", "bartender"].map((r) => (
                    <SelectItem key={r} value={r} className="capitalize">
                      {r === "all" ? "All Roles" : r}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button variant="outline" size="icon">
                <FunnelIcon className="size-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
          {filtered.map((staff) => {
            const roleInfo = roleConfig[staff.role] || roleConfig.Waiter
            const RoleIcon = roleInfo.icon

            return (
              <Card key={staff.id} size="sm" className="group transition-shadow hover:shadow-md">
                <CardHeader>
                  <div className="flex items-start gap-3">
                    <div className="relative shrink-0">
                      <Avatar className="size-12 rounded-xl">
                        <AvatarImage src={staff.avatar} alt={staff.name} className="object-cover" />
                        <AvatarFallback>{staff.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span
                        className={cn(
                          "absolute -bottom-0.5 -right-0.5 size-3.5 rounded-full border-2 border-card",
                          staff.status === "active" ? "bg-success" : "bg-warning",
                        )}
                      />
                    </div>
                    <div className="min-w-0 flex-1 space-y-1">
                      <CardTitle className="text-sm truncate">{staff.name}</CardTitle>
                      <Badge variant="outline" className={cn("text-[10px] uppercase", roleInfo.tone)}>
                        <RoleIcon className="size-3" />
                        {staff.role}
                      </Badge>
                    </div>
                  </div>
                  <CardAction>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon-xs">
                          <EllipsisHorizontalIcon className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-44">
                        <DropdownMenuItem>
                          <UserCircleIcon className="size-4" />
                          Full Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <ClockIcon className="size-4" />
                          Duty Log
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <ChatBubbleLeftRightIcon className="size-4" />
                          Send Ping
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive">Remove Staff</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </CardAction>
                </CardHeader>

                <CardContent className="space-y-3 flex-1">
                  {summoned[staff.id] && (
                    <Alert className="py-2 bg-warning/10 border-warning/30">
                      <BellAlertIcon className="text-warning" />
                      <AlertDescription className="flex items-center justify-between w-full text-xs">
                        <span>Summoned</span>
                        <Button
                          variant="ghost"
                          size="xs"
                          onClick={() => dismissSummon(staff.id)}
                        >
                          Clear
                        </Button>
                      </AlertDescription>
                    </Alert>
                  )}

                  <div className="grid grid-cols-2 gap-2">
                    <div className="rounded-lg bg-warning/10 px-3 py-2 flex items-center gap-2">
                      <StarIcon className="size-4 fill-amber-400 text-amber-400 shrink-0" />
                      <div>
                        <p className="text-sm font-semibold leading-none">{staff.rating}</p>
                        <p className="text-[10px] text-muted-foreground uppercase mt-0.5">Rating</p>
                      </div>
                    </div>

                    <div className="rounded-lg bg-muted/60 px-3 py-2 flex items-center gap-2">
                      <ClockIcon className="size-4 text-primary shrink-0" />
                      <div className="min-w-0">
                        <p className="text-xs font-medium truncate">{staff.shift}</p>
                        <p className="text-[10px] text-muted-foreground uppercase mt-0.5">Shift</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1">
                      <CalendarIcon className="size-3.5" />
                      {staff.shiftsThisWeek} shifts/wk
                    </span>

                    {staff.role === "Waiter" && staff.tables.length > 0 && (
                      <div className="flex items-center gap-1">
                        {staff.tables.slice(0, 3).map((t) => (
                          <Badge key={t} variant="secondary" className="px-1.5 text-[10px]">
                            {t}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between text-[11px] text-muted-foreground">
                      <span>Performance</span>
                      <span className="font-semibold text-foreground tabular-nums">
                        {Math.round(staff.rating * 20)}%
                      </span>
                    </div>
                    <Progress value={staff.rating * 20} className="h-1.5" />
                  </div>

                  <Separator />

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase font-medium text-muted-foreground">
                        Performance Award
                      </span>
                      {awardedFlash === staff.id && (
                        <Badge variant="secondary" className="text-[10px]">
                          Awarded!
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((n) => (
                        <Button
                          key={n}
                          variant="ghost"
                          size="icon-xs"
                          onClick={() => giveAward(staff.id, n)}
                          title={`Give ${n} star${n > 1 ? "s" : ""}`}
                        >
                          <StarIcon
                            className={cn(
                              "size-4",
                              (awards[staff.id] ?? 0) >= n
                                ? "text-amber-400 fill-amber-400"
                                : "text-muted-foreground/40",
                            )}
                          />
                        </Button>
                      ))}
                      {awards[staff.id] && (
                        <Button
                          variant="ghost"
                          size="xs"
                          className="ml-auto text-[10px]"
                          onClick={() =>
                            setAwards((prev) => {
                              const next = { ...prev }
                              delete next[staff.id]
                              return next
                            })
                          }
                        >
                          Clear
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="flex-col gap-2 pt-0">
                  <div className="grid grid-cols-2 gap-2 w-full">
                    <Button variant="outline" size="xs" className="gap-1">
                      <PhoneIcon className="size-3.5" />
                      Call
                    </Button>
                    <Button variant="outline" size="xs" className="gap-1">
                      <EnvelopeIcon className="size-3.5" />
                      Email
                    </Button>
                  </div>

                  <Button
                    size="sm"
                    variant={summoned[staff.id] ? "secondary" : "default"}
                    disabled={summoned[staff.id]}
                    onClick={() => summonStaff(staff.id, staff.name)}
                    className="w-full gap-1.5"
                  >
                    <BellAlertIcon className="size-4" />
                    {summoned[staff.id] ? "Summoned" : "Report to Office"}
                  </Button>

                  <Button variant="ghost" size="xs" className="w-full text-muted-foreground">
                    View Full Analytics
                    <ChevronRightIcon className="size-3.5" />
                  </Button>
                </CardFooter>
              </Card>
            )
          })}
        </div>

        <Card>
          <CardContent className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4 text-center md:text-left">
              <div className="flex size-12 items-center justify-center rounded-xl bg-success text-success-foreground shrink-0">
                <CheckCircleIcon className="size-6" />
              </div>
              <div className="space-y-1">
                <CardTitle className="text-lg">Operational Saturation</CardTitle>
                <CardDescription>
                  All station quotas met for the active shift cycle
                </CardDescription>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <Button variant="outline">View Archive</Button>
              <Button onClick={() => setIsAuditOpen(true)} className="gap-2">
                <ArrowTrendingUpIcon className="size-4" />
                Weekly Roster Audit
              </Button>
            </div>
          </CardContent>
        </Card>

        <Sheet open={isAuditOpen} onOpenChange={setIsAuditOpen}>
          <SheetContent className="sm:max-w-lg p-0 flex flex-col">
            <div className="p-6 space-y-6 flex-1 overflow-y-auto">
              <SheetHeader className="text-left space-y-3">
                <div className="flex size-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                  <SparklesIcon className="size-6" />
                </div>
                <div>
                  <SheetTitle className="text-2xl">Weekly Roster Audit</SheetTitle>
                  <SheetDescription className="text-xs uppercase mt-1">
                    Performance Analysis — Week 14, 2026
                  </SheetDescription>
                </div>
              </SheetHeader>

              <div className="grid grid-cols-2 gap-4">
                <Card size="sm" className="bg-success/10 border-success/20">
                  <CardContent>
                    <p className="text-3xl font-semibold tabular-nums text-success">
                      {auditMetrics.avgRating}
                    </p>
                    <p className="text-xs uppercase text-muted-foreground mt-1">
                      Avg Service Rating
                    </p>
                  </CardContent>
                </Card>
                <Card size="sm" className="bg-primary/5 border-primary/20">
                  <CardContent>
                    <p className="text-3xl font-semibold tabular-nums text-primary">
                      {auditMetrics.totalShifts}
                    </p>
                    <p className="text-xs uppercase text-muted-foreground mt-1">
                      Total Team Shifts
                    </p>
                  </CardContent>
                </Card>
              </div>

              <Card className="bg-primary text-primary-foreground border-primary">
                <CardHeader>
                  <div className="flex items-center gap-2 text-accent text-xs uppercase font-semibold">
                    <TrophyIcon className="size-4" />
                    MVP of the Week
                  </div>
                </CardHeader>
                <CardContent className="flex items-center gap-4">
                  <Avatar className="size-14 rounded-xl">
                    <AvatarImage src={auditMetrics.topPerformer.avatar} alt="" />
                    <AvatarFallback>{auditMetrics.topPerformer.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg">{auditMetrics.topPerformer.name}</CardTitle>
                    <CardDescription className="text-primary-foreground/75 text-xs">
                      {auditMetrics.topPerformer.role} · {auditMetrics.topPerformer.rating} Rating
                    </CardDescription>
                  </div>
                </CardContent>
                <CardFooter className="border-t border-primary-foreground/15 justify-between">
                  <span className="text-xs text-primary-foreground/70">
                    Incentive Award Eligible
                  </span>
                  <Button size="sm" variant="secondary" className="gap-1.5">
                    <TrophyIcon className="size-3.5" />
                    Send Reward
                  </Button>
                </CardFooter>
              </Card>

              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase text-muted-foreground">
                  Shift Compliance Overview
                </p>
                <ItemGroup className="gap-2">
                  {mockStaff.slice(0, 6).map((s) => (
                    <Item key={s.id} variant="outline" size="sm">
                      <ItemMedia>
                        <Avatar className="size-9 rounded-lg">
                          <AvatarImage src={s.avatar} alt={s.name} />
                          <AvatarFallback>{s.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                      </ItemMedia>
                      <ItemContent>
                        <ItemTitle>{s.name}</ItemTitle>
                        <ItemDescription className="flex items-center gap-2 text-xs">
                          <span>{s.shiftsThisWeek} shifts</span>
                          {s.shiftsThisWeek > 5 && (
                            <Badge variant="outline" className="text-[10px] text-warning border-warning/30">
                              Overtime
                            </Badge>
                          )}
                        </ItemDescription>
                      </ItemContent>
                      <ItemActions>
                        <CheckCircleIcon className="size-5 text-success" />
                      </ItemActions>
                    </Item>
                  ))}
                </ItemGroup>
              </div>
            </div>

            <div className="p-6 border-t space-y-3 bg-card">
              <Alert>
                <ExclamationTriangleIcon className="text-warning" />
                <AlertDescription className="text-xs">
                  Audit checks verified by AI Core. All shifts accounted for and validated.
                </AlertDescription>
              </Alert>

              <Button
                onClick={() => {
                  toast.success("Roster finalized!", {
                    description: "Successfully synced with Payroll system",
                    icon: <CheckCircleIcon className="size-4" />,
                  })
                  setIsAuditOpen(false)
                }}
                size="lg"
                className="w-full gap-2"
              >
                <CheckCircleIcon className="size-4" />
                Finalize &amp; Release Roster
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  )
}
