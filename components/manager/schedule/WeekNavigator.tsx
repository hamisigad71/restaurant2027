import { ChevronLeftIcon as ChevronLeft, ChevronRightIcon as ChevronRight } from "@heroicons/react/24/outline"
import { Card, CardContent } from "@/components/ui/card"
import { DAYS, shifts } from "./constants"

interface WeekNavigatorProps {
  activeDay: string
  setActiveDay: (day: string) => void
}

export function WeekNavigator({ activeDay, setActiveDay }: WeekNavigatorProps) {
  return (
    <Card
      className="rounded-3xl shadow-sm overflow-hidden"
      style={{ background: "rgba(255,255,255,0.9)", borderColor: "oklch(0.45 0.12 285 / 0.12)" }}
    >
      <CardContent className="p-3">
        <div className="flex items-center gap-2">
          <button
            className="flex items-center justify-center w-9 h-9 rounded-xl shrink-0 transition-all hover:bg-[#EBE6F8] hover:-translate-x-0.5"
            style={{ borderColor: "oklch(0.45 0.12 285 / 0.15)", color: "#736C83" }}
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          <div className="flex gap-1.5 flex-1 overflow-x-auto no-scrollbar">
            {DAYS.map(day => {
              const active = activeDay === day
              const dayShifts = shifts.filter(s => s.day === day)
              const hasActive = dayShifts.some(s => s.status === "active")
              return (
                <button
                  key={day}
                  onClick={() => setActiveDay(day)}
                  className="relative flex flex-col items-center gap-0.5 px-3 sm:px-5 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all duration-200 shrink-0"
                  style={
                    active
                      ? { background: "oklch(0.42 0.14 285)", color: "white", borderColor: "transparent", boxShadow: "0 3px 10px oklch(0.45 0.12 285 / 0.3)" }
                      : { background: "transparent", color: "#9A94AA", borderColor: "transparent" }
                  }
                >
                  <span className="hidden sm:block">{day}</span>
                  <span className="sm:hidden">{day[0]}</span>
                  {/* Shift count dot */}
                  {dayShifts.length > 0 && (
                    <span
                      className="text-[8px] leading-none font-bold"
                      style={{ color: active ? "rgba(255,255,255,0.7)" : "var(--icon-primary)" }}
                    >
                      {dayShifts.length}
                    </span>
                  )}
                  {/* Active indicator */}
                  {hasActive && !active && (
                    <span
                      className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full animate-pulse"
                      style={{ background: "oklch(0.62 0.16 150)" }}
                    />
                  )}
                </button>
              )
            })}
          </div>

          <button
            className="flex items-center justify-center w-9 h-9 rounded-xl shrink-0 transition-all hover:bg-[#EBE6F8] hover:translate-x-0.5"
            style={{ borderColor: "oklch(0.45 0.12 285 / 0.15)", color: "#736C83" }}
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </CardContent>
    </Card>
  )
}
