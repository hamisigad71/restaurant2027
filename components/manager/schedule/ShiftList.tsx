import { 
  ClockIcon as Clock, 
  ChartBarIcon as Activity, 
  ClockIcon as Timer, 
  EllipsisVerticalIcon as MoreVertical, 
  EyeIcon as Eye, 
  PencilIcon as Edit, 
  BellIcon as Bell, 
  TrashIcon as Trash2, 
  CalendarIcon as Calendar 
} from "@heroicons/react/24/outline"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ROLE_CONFIG, STATUS_CONFIG } from "./constants"

interface Shift {
  id: number
  staff: string
  role: string
  day: string
  time: string
  status: string
  avatar: string
}

interface ShiftListProps {
  activeDay: string
  todayShifts: Shift[]
  activeCount: number
  upcomingCount: number
}

export function ShiftList({ activeDay, todayShifts, activeCount, upcomingCount }: ShiftListProps) {
  return (
    <div className="lg:col-span-2">
      <Card
        className="rounded-3xl shadow-sm overflow-hidden"
        style={{ background: "rgba(255,255,255,0.9)", borderColor: "oklch(0.45 0.12 285 / 0.12)" }}
      >
        <CardHeader className="px-5 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className="flex items-center justify-center w-9 h-9 rounded-xl"
                style={{ background: "oklch(0.45 0.12 285 / 0.1)" }}
              >
                <Clock className="h-4 w-4" style={{ color: "oklch(0.45 0.12 285)" }} />
              </div>
              <div>
                <CardTitle className="text-[14px] font-bold" style={{ color: "#0D031B" }}>
                  {activeDay}'s Schedule
                </CardTitle>
                <p className="text-[10px] font-medium mt-0.5" style={{ color: "#9A94AA" }}>
                  {todayShifts.length} shift{todayShifts.length !== 1 ? "s" : ""} scheduled
                </p>
              </div>
            </div>

            <div className="hidden sm:flex items-center gap-1.5">
              {activeCount > 0 && (
                <span
                  className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider px-2 py-1 rounded-full"
                  style={{ background: "oklch(0.45 0.12 285 / 0.1)", color: "oklch(0.38 0.12 285)" }}
                >
                  <Activity className="h-2.5 w-2.5 animate-pulse" />
                  {activeCount} active
                </span>
              )}
              {upcomingCount > 0 && (
                <span
                  className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider px-2 py-1 rounded-full"
                  style={{ background: "oklch(0.75 0.15 75 / 0.1)", color: "oklch(0.55 0.15 75)" }}
                >
                  <Timer className="h-2.5 w-2.5" />
                  {upcomingCount} upcoming
                </span>
              )}
            </div>
          </div>
        </CardHeader>

        <ScrollArea className="max-h-[520px]">
          {todayShifts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center"
                style={{ background: "#F5F2FB", borderColor: "oklch(0.45 0.12 285 / 0.15)" }}
              >
                <Calendar className="h-7 w-7" style={{ color: "#AEA6BF" }} />
              </div>
              <div className="text-center">
                <p className="text-sm font-semibold" style={{ color: "#0D031B" }}>No shifts scheduled</p>
                <p className="text-xs mt-1" style={{ color: "#9A94AA" }}>
                  No shifts published for {activeDay}
                </p>
              </div>
            </div>
          ) : (
            <div>
              {todayShifts.map(s => {
                const role = ROLE_CONFIG[s.role as keyof typeof ROLE_CONFIG]
                const status = STATUS_CONFIG[s.status as keyof typeof STATUS_CONFIG]
                const StatusIcon = status.icon

                return (
                  <div
                    key={s.id}
                    className="group flex items-center gap-4 px-5 py-4 transition-colors hover:bg-[#F5F2FB]"
                  >
                    <Avatar className="h-11 w-11 shrink-0">
                      <AvatarFallback
                        className="text-xs font-bold"
                        style={{ background: `${role.avatar}15`, color: role.avatar }}
                      >
                        {s.avatar}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-bold truncate" style={{ color: "#0D031B" }}>
                        {s.staff}
                      </p>
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        <span
                          className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border"
                          style={{ background: role.bg, color: role.text, borderColor: role.border }}
                        >
                          {s.role}
                        </span>
                        <span className="flex items-center gap-1 text-[10px] font-medium" style={{ color: "#9A94AA" }}>
                          <Clock className="h-3 w-3" />
                          {s.time}
                        </span>
                      </div>
                    </div>

                    <span
                      className="hidden sm:flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-wider px-2.5 py-1.5 rounded-full shrink-0"
                      style={{ background: status.bg, color: status.text, borderColor: status.border }}
                    >
                      <StatusIcon className="h-3 w-3" />
                      {status.label}
                    </span>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button
                          className="opacity-0 group-hover:opacity-100 flex items-center justify-center w-8 h-8 rounded-xl shrink-0 transition-all hover:bg-[#EBE6F8]"
                          style={{ color: "#AEA6BF" }}
                        >
                          <MoreVertical className="h-4 w-4" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="w-44 rounded-2xl p-1.5"
                        style={{ background: "#FDFCFF", borderColor: "oklch(0.45 0.12 285 / 0.15)", boxShadow: "0 8px 28px rgba(13,3,27,0.12)" }}
                      >
                        <DropdownMenuItem className="flex items-center gap-2 text-[11px] font-semibold rounded-xl px-2.5 py-2 cursor-pointer" style={{ color: "oklch(0.45 0.12 285)" }}>
                          <Eye className="h-3.5 w-3.5" /> View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem className="flex items-center gap-2 text-[11px] font-semibold rounded-xl px-2.5 py-2 cursor-pointer" style={{ color: "#3D374C" }}>
                          <Edit className="h-3.5 w-3.5" /> Edit Shift
                        </DropdownMenuItem>
                        <DropdownMenuItem className="flex items-center gap-2 text-[11px] font-semibold rounded-xl px-2.5 py-2 cursor-pointer" style={{ color: "#3D374C" }}>
                          <Bell className="h-3.5 w-3.5" /> Notify Staff
                        </DropdownMenuItem>
                        <DropdownMenuItem className="flex items-center gap-2 text-[11px] font-semibold rounded-xl px-2.5 py-2 cursor-pointer text-red-500">
                          <Trash2 className="h-3.5 w-3.5" /> Cancel Shift
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                )
              })}
            </div>
          )}
        </ScrollArea>
      </Card>
    </div>
  )
}
