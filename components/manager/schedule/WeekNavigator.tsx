"use client"

import {
  ChevronLeftIcon as ChevronLeft,
  ChevronRightIcon as ChevronRight,
} from "@heroicons/react/24/outline"
import { motion } from "motion/react"
import { SPRING_SNAPPY } from "@/lib/motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { DAYS, shifts } from "./constants"

interface WeekNavigatorProps {
  activeDay: string
  setActiveDay: (day: string) => void
}

export function WeekNavigator({ activeDay, setActiveDay }: WeekNavigatorProps) {
  return (
    <Card size="sm">
      <CardContent className="flex items-center gap-2">
        <Button variant="ghost" size="icon-sm" aria-label="Previous week" className="shrink-0">
          <ChevronLeft className="size-4" />
        </Button>

        <div className="flex gap-1.5 flex-1 overflow-x-auto no-scrollbar">
          {DAYS.map((day) => {
            const active = activeDay === day
            const dayShifts = shifts.filter((s) => s.day === day)
            const hasActive = dayShifts.some((s) => s.status === "active")
            return (
              <Button
                key={day}
                variant="ghost"
                size="sm"
                onClick={() => setActiveDay(day)}
                className={cn(
                  "relative h-auto flex-col gap-0.5 px-3 sm:px-4 py-2 shrink-0",
                  active && "text-primary-foreground hover:text-primary-foreground hover:bg-transparent",
                )}
              >
                {active && (
                  <motion.span
                    layoutId="week-day-pill"
                    transition={SPRING_SNAPPY}
                    aria-hidden="true"
                    className="absolute inset-0 rounded-md bg-primary -z-0"
                  />
                )}
                <span className="relative z-10 hidden sm:inline text-xs font-semibold uppercase">
                  {day}
                </span>
                <span className="relative z-10 sm:hidden text-xs font-semibold uppercase">
                  {day[0]}
                </span>
                {dayShifts.length > 0 && (
                  <Badge
                    variant={active ? "secondary" : "outline"}
                    className="relative z-10 h-4 px-1.5 text-[10px]"
                  >
                    {dayShifts.length}
                  </Badge>
                )}
                {hasActive && !active && (
                  <span className="absolute top-1.5 right-1.5 size-1.5 rounded-full bg-success" />
                )}
              </Button>
            )
          })}
        </div>

        <Button variant="ghost" size="icon-sm" aria-label="Next week" className="shrink-0">
          <ChevronRight className="size-4" />
        </Button>
      </CardContent>
    </Card>
  )
}
