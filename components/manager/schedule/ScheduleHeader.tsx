import { CalendarIcon as Calendar, BoltIcon as Zap, PlusIcon as Plus } from "@heroicons/react/24/outline"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

export function ScheduleHeader() {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
      <div className="flex items-center gap-3">
        <div
          className="flex items-center justify-center w-10 h-10 rounded-xl shrink-0"
          style={{ background: "oklch(0.42 0.14 285)", boxShadow: "0 4px 14px oklch(0.45 0.12 285 / 0.35)" }}
        >
          <Calendar className="h-5 w-5 text-white" />
        </div>
        <div>
          <h1 className="text-[17px] font-bold tracking-tight leading-none" style={{ color: "#0D031B" }}>
            Staff Schedule
          </h1>
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] mt-0.5" style={{ color: "#9A94AA" }}>
            Resource Allocation & Weekly Rostering
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              className="h-10 px-4 gap-2 rounded-xl font-bold text-[11px] uppercase tracking-wider border transition-all hover:-translate-y-0.5"
              style={{ borderColor: "oklch(0.45 0.12 285 / 0.2)", color: "#736C83", background: "rgba(255,255,255,0.8)" }}
            >
              <Zap className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Auto-Generate</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>AI-generate optimal schedule</TooltipContent>
        </Tooltip>

        <Button
          className="h-10 px-4 gap-2 text-white font-bold rounded-xl border-none text-[11px] uppercase tracking-wider transition-all hover:-translate-y-0.5"
          style={{ background: "oklch(0.42 0.14 285)", boxShadow: "0 4px 16px oklch(0.45 0.12 285 / 0.35)" }}
        >
          <Plus className="h-3.5 w-3.5" />
          Add Shift
        </Button>
      </div>
    </div>
  )
}
