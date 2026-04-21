"use client"

import { useState, useEffect } from "react"
import { 
  BoltIcon as SparklesIcon, 
  CheckCircleIcon, 
  ClockIcon, 
  ExclamationTriangleIcon, 
  BoltIcon, 
  UserGroupIcon, 
  ClipboardDocumentListIcon, 
  CloudIcon, 
  SunIcon 
} from "@heroicons/react/24/outline"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge }     from "@/components/ui/badge"
import { Button }    from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Progress }  from "@/components/ui/progress"
import {
  Tooltip, TooltipContent, TooltipProvider, TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

// ─── Types & data ─────────────────────────────────────────────────────────────
interface DirtyTable {
  id:      string
  time:    string
  urgency: "high" | "medium" | "low"
  reason:  string
  zone:    string
  guests:  number
}

const INITIAL_TABLES: DirtyTable[] = [
  { id:"T04", time:"10m ago", urgency:"high",   reason:"Guests just left — full clean required",      zone:"Main Dining",    guests:4 },
  { id:"T07", time:"25m ago", urgency:"medium",  reason:"Liquid spill reported by waiter",             zone:"Bar Side",       guests:2 },
  { id:"T12", time:"1h ago",  urgency:"low",     reason:"Routine post-shift sanitization",             zone:"Private Dining", guests:6 },
  { id:"T09", time:"18m ago", urgency:"medium",  reason:"Food debris, needs full wipe-down",           zone:"Main Dining",    guests:3 },
]

const URGENCY_CONFIG = {
  high:   { label:"Urgent",  accent:"oklch(0.65 0.18 25)", bg:"oklch(0.65 0.18 25 / 0.08)", border:"oklch(0.65 0.18 25 / 0.3)", icon:BoltIcon,          barBg:"oklch(0.65 0.18 25)", ctaBg:"oklch(0.65 0.18 25)" },
  medium: { label:"Due",     accent:"oklch(0.75 0.15 75)", bg:"oklch(0.75 0.15 75 / 0.06)", border:"oklch(0.75 0.15 75 / 0.2)", icon:ClockIcon,        barBg:"oklch(0.75 0.15 75)", ctaBg:"oklch(0.45 0.12 285)" },
  low:    { label:"Routine", accent:"oklch(0.45 0.12 285)", bg:"oklch(0.45 0.12 285 / 0.05)", border:"oklch(0.45 0.12 285 / 0.15)", icon:SparklesIcon, barBg:"oklch(0.45 0.12 285)", ctaBg:"oklch(0.45 0.12 285)" },
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function CleanersPage() {
  const [tables,      setTables]      = useState<DirtyTable[]>(INITIAL_TABLES)
  const [animatingId, setAnimatingId] = useState<string | null>(null)
  const [cleanedCount, setCleanedCount] = useState(0)

  const highCount   = tables.filter(t => t.urgency === "high").length
  const medCount    = tables.filter(t => t.urgency === "medium").length
  const totalTables = 16 // total in restaurant
  const cleanPct    = Math.round((cleanedCount / totalTables) * 100)

  const handleClean = (table: DirtyTable) => {
    setAnimatingId(table.id)
    toast.success(`Table ${table.id.replace("T","")} marked clean`, {
      description: table.zone,
      icon: <SparklesIcon className="h-4 w-4" />,
    })
    setTimeout(() => {
      setTables(prev => prev.filter(t => t.id !== table.id))
      setCleanedCount(prev => prev + 1)
      setAnimatingId(null)
    }, 350)
  }

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
            <SparklesIcon className="h-5 w-5 text-white" strokeWidth={2} />
          </div>

          <div className="min-w-0 flex-1">
            <h1 className="text-[15px] font-bold  leading-none" style={{ color:"#0D031B" }}>
              Housekeeping
            </h1>
            <p className="text-[10px] font-bold uppercase  mt-0.5" style={{ color:"#9A94AA" }}>
              Active Queue · {tables.length} pending
            </p>
          </div>

          {/* Priority counts */}
          <div className="hidden sm:flex items-center gap-2">
            {highCount > 0 && (
              <Badge
                className="flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-full border"
                style={{
                  background:"oklch(0.65 0.18 25 / 0.1)",
                  color:"oklch(0.55 0.18 25)",
                  borderColor:"oklch(0.65 0.18 25 / 0.25)",
                }}
              >
                <BoltIcon className="h-2.5 w-2.5 fill-current" />
                {highCount} urgent
              </Badge>
            )}
            <Badge
              className="text-[10px] font-bold px-2.5 py-1 rounded-full border"
              style={{
                background:"oklch(0.45 0.12 285 / 0.1)",
                color:"oklch(0.45 0.12 285)",
                borderColor:"oklch(0.45 0.12 285 / 0.2)",
              }}
            >
              {tables.length} total
            </Badge>
          </div>
        </header>

        <div className="flex-1 p-4 lg:p-6 max-w-2xl mx-auto w-full space-y-5">

          {/* ── Shift progress card ───────────────────────────────── */}
          <Card
            className="border rounded-3xl overflow-hidden shadow-sm"
            style={{ background:"rgba(255,255,255,0.9)", borderColor:"oklch(0.45 0.12 285 / 0.12)" }}
          >
            <div className="h-[3px]" style={{ background:"oklch(0.45 0.12 285)" }} />
            <CardContent className="px-5 py-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <div
                    className="flex items-center justify-center w-8 h-8 rounded-lg"
                    style={{ background:"oklch(0.45 0.12 285 / 0.1)" }}
                  >
                    <ClipboardDocumentListIcon className="h-3.5 w-3.5" style={{ color:"oklch(0.45 0.12 285)" }} />
                  </div>
                  <div>
                    <p className="text-[13px] font-bold" style={{ color:"#0D031B" }}>Shift Progress</p>
                    <p className="text-[10px] mt-0.5" style={{ color:"#9A94AA" }}>
                      {cleanedCount} of {totalTables} tables cleaned today
                    </p>
                  </div>
                </div>
                <p className="text-2xl font-bold tabular-nums" style={{ color:"oklch(0.45 0.12 285)" }}>
                  {cleanPct}%
                </p>
              </div>
              <Progress value={cleanPct} className="h-2 rounded-full" style={{ background:"rgba(0,0,0,0.06)" }} />

              <div className="grid grid-cols-3 gap-3 mt-4">
                {[
                  { label:"Cleaned",  value:cleanedCount, icon:CheckCircleIcon, color:"oklch(0.62 0.16 150)" },
                  { label:"Pending",  value:tables.length, icon:ClockIcon,        color:"oklch(0.75 0.15 75)"  },
                  { label:"Urgent",   value:highCount,     icon:BoltIcon,         color:"oklch(0.65 0.18 25)"  },
                ].map(s => (
                  <div
                    key={s.label}
                    className="flex flex-col items-center py-3 rounded-xl border"
                    style={{ background:"#F5F2FB", borderColor:"oklch(0.45 0.12 285 / 0.1)" }}
                  >
                    <s.icon className="h-4 w-4 mb-1.5" style={{ color:s.color }} />
                    <p className="text-xl font-bold tabular-nums" style={{ color:"#0D031B" }}>{s.value}</p>
                    <p className="text-[9px] font-bold uppercase  mt-0.5" style={{ color:"#9A94AA" }}>{s.label}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* ── Queue ────────────────────────────────────────────── */}
          {tables.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <div
                className="w-20 h-20 rounded-3xl flex items-center justify-center border"
                style={{ background:"rgba(255,255,255,0.9)", borderColor:"oklch(0.45 0.12 285 / 0.15)" }}
              >
                <SunIcon className="h-10 w-10" style={{ color:"oklch(0.45 0.12 285)" }} />
              </div>
              <div className="text-center">
                <p className="text-lg font-bold" style={{ color:"#0D031B" }}>All areas spotless!</p>
                <p className="text-sm mt-1" style={{ color:"#736C83" }}>
                  Great work. You'll be notified of new tasks.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {/* Sort by urgency: high → medium → low */}
              {[...tables]
                .sort((a,b) => {
                  const order = { high:0, medium:1, low:2 }
                  return order[a.urgency] - order[b.urgency]
                })
                .map((table) => {
                  const cfg    = URGENCY_CONFIG[table.urgency]
                  const Icon   = cfg.icon
                  const isAnim = animatingId === table.id

                  return (
                    <Card
                      key={table.id}
                      className={cn(
                        "relative overflow-hidden border rounded-3xl shadow-sm transition-all duration-300",
                        isAnim ? "opacity-0 -translate-y-2 scale-95" : "opacity-100 translate-y-0 scale-100",
                      )}
                      style={{ background:"rgba(255,255,255,0.9)", borderColor:cfg.border }}
                    >
                      {/* Top accent strip */}
                      <div className="absolute top-0 inset-x-0 h-[3px] rounded-t-3xl" style={{ background:cfg.barBg }} />

                      <CardContent className="px-5 pt-5 pb-4">

                        {/* Row 1: table number + urgency + time */}
                        <div className="flex items-start gap-4">
                          {/* Table number tile */}
                          <div
                            className="flex items-center justify-center w-14 h-14 rounded-2xl shrink-0 font-bold text-2xl"
                            style={{ background:cfg.bg, color:cfg.accent }}
                          >
                            {table.id.replace("T","")}
                          </div>

                          <div className="flex-1 min-w-0">
                            {/* Name + badge row */}
                            <div className="flex items-center gap-2 mb-1">
                              <p className="text-[15px] font-bold" style={{ color:"#0D031B" }}>
                                Table {table.id.replace("T","")}
                              </p>
                              <span
                                className="flex items-center gap-1 text-[9px] font-bold uppercase  px-2 py-0.5 rounded-full"
                                style={{ background:cfg.bg, color:cfg.accent }}
                              >
                                <Icon className="h-2.5 w-2.5" />
                                {cfg.label}
                              </span>
                            </div>

                            {/* Zone + guests */}
                            <div className="flex items-center gap-3 mb-2">
                              <span className="text-[11px] font-semibold" style={{ color:"#736C83" }}>
                                {table.zone}
                              </span>
                              <span style={{ color:"#D0CBE4" }}>·</span>
                              <span className="flex items-center gap-1 text-[11px]" style={{ color:"#9A94AA" }}>
                                <UserGroupIcon className="h-3 w-3" />
                                {table.guests} guests
                              </span>
                              <span style={{ color:"#D0CBE4" }}>·</span>
                              <span className="flex items-center gap-1 text-[11px]" style={{ color:"#9A94AA" }}>
                                <ClockIcon className="h-3 w-3" />
                                {table.time}
                              </span>
                            </div>

                            {/* Reason */}
                            <p className="text-[12px] leading-relaxed" style={{ color:"#736C83" }}>
                              {table.reason}
                            </p>
                          </div>
                        </div>

                        {/* Checklist */}
                        <div
                          className="grid grid-cols-3 gap-2 mt-4 px-1"
                        >
                          {[
                            { label:"Wipe surfaces", icon:CloudIcon },
                            { label:"Clear dishes",  icon:SparklesIcon },
                            { label:"Air & reset",   icon:SunIcon      },
                          ].map(step => (
                            <div
                              key={step.label}
                              className="flex flex-col items-center gap-1 py-2 rounded-xl"
                              style={{ background:"#F5F2FB" }}
                            >
                              <step.icon className="h-3.5 w-3.5" style={{ color:"#AEA6BF" }} />
                              <p className="text-[9px] font-bold uppercase  text-center" style={{ color:"#9A94AA" }}>
                                {step.label}
                              </p>
                            </div>
                          ))}
                        </div>

                        {/* CTA */}
                        <button
                          onClick={() => handleClean(table)}
                          className="w-full flex items-center justify-center gap-2.5 h-12 rounded-2xl mt-4 font-bold text-[12px] uppercase  text-white transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] relative overflow-hidden group"
                          style={{
                            background: cfg.ctaBg,
                            boxShadow: `0 4px 16px ${cfg.accent}40`,
                          }}
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                          <CheckCircleIcon className="h-4 w-4 relative z-10" />
                          <span className="relative z-10">Mark as Clean</span>
                        </button>
                      </CardContent>
                    </Card>
                  )
                })}
            </div>
          )}
        </div>
      </div>
    </TooltipProvider>
  )
}