import {
  ClockIcon as Clock,
  ChartBarIcon as Activity,
  ClockIcon as Timer,
  EllipsisVerticalIcon as MoreVertical,
  EyeIcon as Eye,
  PencilIcon as Edit,
  BellIcon as Bell,
  TrashIcon as Trash2,
  CalendarIcon as Calendar,
} from "@heroicons/react/24/outline"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemSeparator,
  ItemTitle,
} from "@/components/ui/item"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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

export function ShiftList({
  activeDay,
  todayShifts,
  activeCount,
  upcomingCount,
}: ShiftListProps) {
  return (
    <div className="lg:col-span-2">
      <Card>
        <CardHeader className="border-b">
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Clock className="size-4" />
            </div>
            <div className="space-y-1">
              <CardTitle>{activeDay}&apos;s Schedule</CardTitle>
              <CardDescription>
                {todayShifts.length} shift{todayShifts.length !== 1 ? "s" : ""} scheduled
              </CardDescription>
            </div>
          </div>
          <CardAction className="hidden sm:flex items-center gap-1.5">
            {activeCount > 0 && (
              <Badge variant="secondary" className="gap-1">
                <Activity className="size-3" />
                {activeCount} active
              </Badge>
            )}
            {upcomingCount > 0 && (
              <Badge variant="outline" className="gap-1 text-warning border-warning/30 bg-warning/10">
                <Timer className="size-3" />
                {upcomingCount} upcoming
              </Badge>
            )}
          </CardAction>
        </CardHeader>

        <CardContent className="p-0">
          <ScrollArea className="max-h-[520px]">
            {todayShifts.length === 0 ? (
              <Empty className="py-16">
                <EmptyHeader>
                  <EmptyMedia variant="icon">
                    <Calendar />
                  </EmptyMedia>
                  <EmptyTitle>No shifts scheduled</EmptyTitle>
                  <EmptyDescription>No shifts published for {activeDay}.</EmptyDescription>
                </EmptyHeader>
              </Empty>
            ) : (
              <ItemGroup>
                {todayShifts.map((s, idx) => {
                  const role = ROLE_CONFIG[s.role as keyof typeof ROLE_CONFIG]
                  const status = STATUS_CONFIG[s.status as keyof typeof STATUS_CONFIG]
                  const StatusIcon = status.icon

                  return (
                    <div key={s.id}>
                      {idx > 0 && <ItemSeparator />}
                      <Item className="group rounded-none hover:bg-muted/40">
                        <ItemMedia>
                          <Avatar className="size-10">
                            <AvatarFallback
                              className="text-xs font-semibold"
                              style={{ background: `${role.avatar}15`, color: role.avatar }}
                            >
                              {s.avatar}
                            </AvatarFallback>
                          </Avatar>
                        </ItemMedia>

                        <ItemContent>
                          <ItemTitle className="truncate">{s.staff}</ItemTitle>
                          <ItemDescription className="flex items-center gap-2 flex-wrap">
                            <Badge variant="outline" className="text-[10px] uppercase">
                              {s.role}
                            </Badge>
                            <span className="inline-flex items-center gap-1 text-xs">
                              <Clock className="size-3" />
                              {s.time}
                            </span>
                          </ItemDescription>
                        </ItemContent>

                        <ItemActions>
                          <Badge variant="secondary" className="hidden sm:inline-flex gap-1">
                            <StatusIcon className="size-3" />
                            {status.label}
                          </Badge>

                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon-sm"
                                className="opacity-70 group-hover:opacity-100"
                              >
                                <MoreVertical className="size-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-44">
                              <DropdownMenuItem className="gap-2 cursor-pointer">
                                <Eye className="size-4" /> View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem className="gap-2 cursor-pointer">
                                <Edit className="size-4" /> Edit Shift
                              </DropdownMenuItem>
                              <DropdownMenuItem className="gap-2 cursor-pointer">
                                <Bell className="size-4" /> Notify Staff
                              </DropdownMenuItem>
                              <DropdownMenuItem className="gap-2 cursor-pointer text-destructive">
                                <Trash2 className="size-4" /> Cancel Shift
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </ItemActions>
                      </Item>
                    </div>
                  )
                })}
              </ItemGroup>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}
