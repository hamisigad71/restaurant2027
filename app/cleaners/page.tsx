"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { AnimatePresence, motion } from "motion/react"
import { FAST_TRANSITION, SPRING_SNAPPY } from "@/lib/motion"
import {
  BoltIcon as SparklesIcon,
  CheckCircleIcon,
  ClockIcon,
  BoltIcon,
  UserGroupIcon,
  ClipboardDocumentListIcon,
  CloudIcon,
  SunIcon,
} from "@heroicons/react/24/outline"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
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
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import { defaultPortalPath, portalAllowedRoles, useAuth } from "@/lib/auth-context"
import { CleaningService, CleaningTask, TableService } from "@/lib/restaurant-store"
import { mockTables } from "@/lib/mock-data"
import { SummonsListener } from "@/components/layout/summons-listener"

const URGENCY_CONFIG = {
  high: {
    label: "Urgent",
    badgeVariant: "destructive" as const,
    tileClass: "bg-destructive/10 text-destructive",
    borderClass: "border-destructive/30",
    buttonVariant: "destructive" as const,
    icon: BoltIcon,
  },
  medium: {
    label: "Due",
    badgeVariant: "secondary" as const,
    tileClass: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    borderClass: "border-amber-500/25",
    buttonVariant: "default" as const,
    icon: ClockIcon,
  },
  low: {
    label: "Routine",
    badgeVariant: "outline" as const,
    tileClass: "bg-primary/10 text-primary",
    borderClass: "border-border",
    buttonVariant: "default" as const,
    icon: SparklesIcon,
  },
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function CleanersPage() {
  const { user, isAuthenticated, isAuthReady } = useAuth()
  const router = useRouter()

  const [tables, setTables] = useState<CleaningTask[]>([])
  const [cleanedCount, setCleanedCount] = useState(0)
  const [totalTables, setTotalTables] = useState(mockTables.length)

  const isAuthorized = !!user && portalAllowedRoles.cleaner.includes(user.role)

  useEffect(() => {
    if (!isAuthReady) return
    if (!isAuthenticated || !user) {
      router.replace("/login")
      return
    }
    if (!portalAllowedRoles.cleaner.includes(user.role)) {
      router.replace(defaultPortalPath[user.role])
    }
  }, [isAuthReady, isAuthenticated, user, router])

  useEffect(() => {
    const unsubClean = CleaningService.subscribe((state) => {
      setTables(state.tasks)
      setCleanedCount(state.cleanedCount)
    })
    const unsubTables = TableService.subscribe((floorTables) => {
      setTotalTables(floorTables.length || mockTables.length)
    })
    return () => {
      unsubClean()
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

  const highCount = tables.filter((t) => t.urgency === "high").length
  const cleanPct = totalTables > 0 ? Math.min(100, Math.round((cleanedCount / totalTables) * 100)) : 0

  const handleClean = (table: CleaningTask) => {
    toast.success(`Table ${table.tableNumber} marked clean`, {
      description: `${table.zone} · Now Available on Service Floor`,
      icon: <SparklesIcon className="h-4 w-4" />,
    })
    CleaningService.markCleaned(table.id)
  }

  return (
    <>
      <SummonsListener />
      <div className="min-h-screen flex flex-col bg-background">
        {/* ── Header ─────────────────────────────────────────────── */}
        <header className="px-5 py-4 border-b border-border bg-background/95 backdrop-blur sticky top-0 z-20 flex items-center gap-4 shrink-0">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary text-primary-foreground shadow-sm shrink-0">
            <SparklesIcon className="h-5 w-5" strokeWidth={2} />
          </div>

          <div className="min-w-0 flex-1">
            <h1 className="text-sm font-semibold leading-none text-foreground">
              Housekeeping
            </h1>
            <p className="text-[11px] font-medium uppercase tracking-wide mt-1 text-muted-foreground">
              Active Queue · {tables.length} pending
            </p>
          </div>

          <div className="hidden sm:flex items-center gap-2">
            {highCount > 0 && (
              <Badge variant="destructive" className="gap-1">
                <BoltIcon className="size-3" />
                {highCount} urgent
              </Badge>
            )}
            <Badge variant="secondary">{tables.length} total</Badge>
          </div>
        </header>

        <div className="flex-1 p-4 lg:p-6 max-w-2xl mx-auto w-full space-y-5">
          {/* ── Shift progress card ───────────────────────────────── */}
          <Card size="sm">
            <CardHeader>
              <div className="flex items-center gap-2.5">
                <div className="flex items-center justify-center size-8 rounded-lg bg-primary/10 text-primary">
                  <ClipboardDocumentListIcon className="size-4" />
                </div>
                <div>
                  <CardTitle className="text-sm">Shift Progress</CardTitle>
                  <CardDescription className="text-xs">
                    {cleanedCount} of {totalTables} tables cleaned today
                  </CardDescription>
                </div>
              </div>
              <CardAction>
                <span className="text-2xl font-bold tabular-nums text-primary">
                  {cleanPct}%
                </span>
              </CardAction>
            </CardHeader>
            <CardContent className="space-y-4">
              <Progress value={cleanPct} className="h-2" />

              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: "Cleaned", value: cleanedCount, icon: CheckCircleIcon, color: "text-emerald-600 dark:text-emerald-400" },
                  { label: "Pending", value: tables.length, icon: ClockIcon, color: "text-amber-600 dark:text-amber-400" },
                  { label: "Urgent", value: highCount, icon: BoltIcon, color: "text-destructive" },
                ].map((s) => (
                  <div
                    key={s.label}
                    className="flex flex-col items-center py-3 rounded-xl border border-border bg-muted/50"
                  >
                    <s.icon className={cn("size-4 mb-1.5", s.color)} />
                    <p className="text-xl font-bold tabular-nums text-foreground">{s.value}</p>
                    <p className="text-[10px] font-semibold uppercase tracking-wide mt-0.5 text-muted-foreground">
                      {s.label}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* ── Queue ────────────────────────────────────────────── */}
          {tables.length === 0 ? (
            <Empty className="py-16 border border-dashed border-border rounded-xl bg-card">
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <SunIcon className="size-6 text-primary" />
                </EmptyMedia>
                <EmptyTitle>All areas spotless!</EmptyTitle>
                <EmptyDescription>
                  Great work. You&apos;ll be notified of new tasks.
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          ) : (
            <div className="space-y-3">
              <AnimatePresence mode="popLayout" initial={false}>
                {[...tables]
                  .sort((a, b) => {
                    const order = { high: 0, medium: 1, low: 2 }
                    return order[a.urgency] - order[b.urgency]
                  })
                  .map((table) => {
                    const cfg = URGENCY_CONFIG[table.urgency]
                    const Icon = cfg.icon

                    return (
                      <motion.div
                        key={table.id}
                        layout="position"
                        initial={{ opacity: 0, y: 8, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8, scale: 0.96 }}
                        transition={SPRING_SNAPPY}
                      >
                        <Card
                          size="sm"
                          className={cn(
                            "transition-[border-color,box-shadow] duration-150 ease-(--ease-out)",
                            cfg.borderClass,
                          )}
                        >
                      <CardContent className="space-y-4">
                        <div className="flex items-start gap-4">
                          <div
                            className={cn(
                              "flex items-center justify-center w-14 h-14 rounded-xl shrink-0 font-bold text-2xl tabular-nums",
                              cfg.tileClass,
                            )}
                          >
                            {String(table.tableNumber).padStart(2, "0")}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <p className="text-sm font-semibold text-foreground">
                                Table {String(table.tableNumber).padStart(2, "0")}
                              </p>
                              <Badge variant={cfg.badgeVariant} className="gap-1 text-[10px] uppercase">
                                <Icon className="size-3" />
                                {cfg.label}
                              </Badge>
                            </div>

                            <div className="flex flex-wrap items-center gap-2 mb-2 text-xs text-muted-foreground">
                              <span className="font-medium text-foreground/80">{table.zone}</span>
                              <span>·</span>
                              <span className="flex items-center gap-1">
                                <UserGroupIcon className="size-3.5" />
                                {table.guests} guests
                              </span>
                              <span>·</span>
                              <span className="flex items-center gap-1">
                                <ClockIcon className="size-3.5" />
                                {table.time}
                              </span>
                            </div>

                            <p className="text-xs leading-relaxed text-muted-foreground">
                              {table.reason}
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-2">
                          {[
                            { label: "Wipe surfaces", icon: CloudIcon },
                            { label: "Clear dishes", icon: SparklesIcon },
                            { label: "Air & reset", icon: SunIcon },
                          ].map((step) => (
                            <div
                              key={step.label}
                              className="flex flex-col items-center gap-1 py-2 rounded-lg bg-muted/60"
                            >
                              <step.icon className="size-3.5 text-primary" />
                              <p className="text-[10px] font-semibold uppercase text-center text-muted-foreground">
                                {step.label}
                              </p>
                            </div>
                          ))}
                        </div>
                      </CardContent>

                      <CardFooter>
                        <Button
                          onClick={() => handleClean(table)}
                          variant={cfg.buttonVariant}
                          size="lg"
                          className="w-full gap-2 font-semibold"
                        >
                          <CheckCircleIcon className="size-4" />
                          <span>Mark as Clean</span>
                        </Button>
                      </CardFooter>
                    </Card>
                  </motion.div>
                )
              })}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
