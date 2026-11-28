import { CalendarIcon as Calendar, BoltIcon as Zap, PlusIcon as Plus } from "@heroicons/react/24/outline"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

export function ScheduleHeader() {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm shrink-0">
          <Calendar className="size-5" />
        </div>
        <div>
          <h1 className="text-lg font-semibold leading-none text-foreground">
            Staff Schedule
          </h1>
          <p className="text-xs font-medium uppercase text-muted-foreground mt-1">
            Resource Allocation &amp; Weekly Rostering
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              <Zap className="size-4" />
              <span className="hidden sm:inline">Auto-Generate</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>AI-generate optimal schedule</TooltipContent>
        </Tooltip>

        <Button size="sm" className="gap-2">
          <Plus className="size-4" />
          Add Shift
        </Button>
      </div>
    </div>
  )
}
