"use client"

import { useState } from "react"
import { TooltipProvider } from "@/components/ui/tooltip"
import { shifts } from "@/components/manager/schedule/constants"
import { ScheduleHeader } from "@/components/manager/schedule/ScheduleHeader"
import { WeekNavigator } from "@/components/manager/schedule/WeekNavigator"
import { ShiftList } from "@/components/manager/schedule/ShiftList"
import { StaffingOverview } from "@/components/manager/schedule/StaffingOverview"

export default function ManagerSchedulePage() {
  const [activeDay, setActiveDay] = useState("Tue")
  const todayShifts = shifts.filter(s => s.day === activeDay)

  const completedCount = todayShifts.filter(s => s.status === "completed").length
  const activeCount    = todayShifts.filter(s => s.status === "active").length
  const upcomingCount  = todayShifts.filter(s => s.status === "upcoming").length

  return (
    <TooltipProvider>
      <div className="min-h-screen pb-16" style={{ background: "#F0EBF8" }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-6 space-y-5">
          <ScheduleHeader />

          <WeekNavigator 
            activeDay={activeDay} 
            setActiveDay={setActiveDay} 
          />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-start">
            <ShiftList 
              activeDay={activeDay}
              todayShifts={todayShifts}
              activeCount={activeCount}
              upcomingCount={upcomingCount}
            />

            <StaffingOverview 
              activeDay={activeDay}
              completedCount={completedCount}
              activeCount={activeCount}
              upcomingCount={upcomingCount}
              totalShifts={todayShifts.length}
            />
          </div>
        </div>
      </div>
    </TooltipProvider>
  )
}