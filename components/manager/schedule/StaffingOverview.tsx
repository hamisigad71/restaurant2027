import {
  ArrowTrendingUpIcon as TrendingUp,
  CheckIcon as UserCheck,
  BriefcaseIcon as Briefcase,
  ExclamationCircleIcon as AlertCircle,
  CheckCircleIcon as CheckCircle2,
  ChartBarIcon as Activity,
  ClockIcon as Timer,
  ArrowDownTrayIcon as Download,
} from "@heroicons/react/24/outline"
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
  CardDescription,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item"

interface StaffingOverviewProps {
  activeDay: string
  completedCount: number
  activeCount: number
  upcomingCount: number
  totalShifts: number
}

export function StaffingOverview({
  activeDay,
  completedCount,
  activeCount,
  upcomingCount,
  totalShifts,
}: StaffingOverviewProps) {
  return (
    <div className="space-y-4">
      <Card size="sm">
        <CardHeader>
          <div className="flex items-center gap-2.5">
            <div className="flex size-8 items-center justify-center rounded-lg bg-warning/10 text-warning">
              <TrendingUp className="size-4" />
            </div>
            <CardTitle className="text-sm">Staffing Overview</CardTitle>
          </div>
        </CardHeader>

        <CardContent>
          <ItemGroup className="gap-2">
            {[
              { label: "On Duty", value: "14", icon: UserCheck, color: "text-success bg-success/10" },
              { label: "Stations Covered", value: "100%", icon: Briefcase, color: "text-primary bg-primary/10" },
              { label: "Overtime Risk", value: "2", icon: AlertCircle, color: "text-destructive bg-destructive/10" },
            ].map((stat) => (
              <Item key={stat.label} variant="muted" size="sm">
                <ItemMedia variant="icon" className={stat.color}>
                  <stat.icon className="size-4" />
                </ItemMedia>
                <ItemContent>
                  <ItemTitle className="text-xs text-muted-foreground">{stat.label}</ItemTitle>
                </ItemContent>
                <ItemActions>
                  <span className="text-lg font-semibold tabular-nums">{stat.value}</span>
                </ItemActions>
              </Item>
            ))}
          </ItemGroup>
        </CardContent>
      </Card>

      <Card size="sm">
        <CardHeader>
          <CardTitle className="text-sm">{activeDay} Breakdown</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[
            { label: "Completed", count: completedCount, total: totalShifts, icon: CheckCircle2, color: "text-success" },
            { label: "Active", count: activeCount, total: totalShifts, icon: Activity, color: "text-primary" },
            { label: "Upcoming", count: upcomingCount, total: totalShifts, icon: Timer, color: "text-warning" },
          ].map((row) => {
            const pct = totalShifts > 0 ? Math.round((row.count / totalShifts) * 100) : 0
            return (
              <div key={row.label} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <row.icon className={`size-3.5 ${row.color}`} />
                    <span className="font-medium">{row.label}</span>
                  </div>
                  <span className="font-semibold tabular-nums">
                    {row.count}/{row.total}
                  </span>
                </div>
                <Progress value={pct} className="h-1.5" />
              </div>
            )
          })}
        </CardContent>
      </Card>

      <Card size="sm" className="bg-primary text-primary-foreground border-primary">
        <CardHeader className="text-center">
          <div className="mx-auto mb-1 flex size-10 items-center justify-center rounded-xl bg-primary-foreground/15">
            <CheckCircle2 className="size-5" />
          </div>
          <CardTitle className="text-base">Quotas Satisfied</CardTitle>
          <CardDescription className="text-primary-foreground/75 text-xs">
            All roles for the current shift period are fully staffed.
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <Button variant="secondary" size="sm" className="w-full gap-2">
            <Download className="size-4" />
            Export Roster
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
