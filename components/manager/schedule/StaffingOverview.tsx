import { 
  ArrowTrendingUpIcon as TrendingUp, 
  CheckIcon as UserCheck, 
  BriefcaseIcon as Briefcase, 
  ExclamationCircleIcon as AlertCircle, 
  CheckCircleIcon as CheckCircle2, 
  ChartBarIcon as Activity, 
  ClockIcon as Timer, 
  ArrowDownTrayIcon as Download 
} from "@heroicons/react/24/outline"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

interface StaffingOverviewProps {
  activeDay: string
  completedCount: number
  activeCount: number
  upcomingCount: number
  totalShifts: number
}

export function StaffingOverview({ activeDay, completedCount, activeCount, upcomingCount, totalShifts }: StaffingOverviewProps) {
  return (
    <div className="space-y-4">
      {/* Staffing Overview Card */}
      <Card
        className="rounded-3xl shadow-sm overflow-hidden"
        style={{ background: "rgba(255,255,255,0.9)", borderColor: "oklch(0.45 0.12 285 / 0.12)" }}
      >
        <CardHeader className="px-5 py-4">
          <div className="flex items-center gap-2.5">
            <div
              className="flex items-center justify-center w-8 h-8 rounded-lg"
              style={{ background: "oklch(0.75 0.15 75 / 0.12)" }}
            >
              <TrendingUp className="h-3.5 w-3.5" style={{ color: "oklch(0.55 0.15 75)" }} />
            </div>
            <CardTitle className="text-[13px] font-bold" style={{ color: "#0D031B" }}>
              Staffing Overview
            </CardTitle>
          </div>
        </CardHeader>

        <CardContent className="px-5 py-4 space-y-3">
          {[
            { label: "On Duty", value: "14", icon: UserCheck, accent: "oklch(0.62 0.16 150)" },
            { label: "Stations Covered", value: "100%", icon: Briefcase, accent: "oklch(0.42 0.14 285)" },
            { label: "Overtime Risk", value: "2", icon: AlertCircle, accent: "oklch(0.65 0.18 25)" },
          ].map(stat => (
            <div
              key={stat.label}
              className="flex items-center justify-between px-3 py-3 rounded-2xl"
              style={{ background: "#F5F2FB", borderColor: "oklch(0.45 0.12 285 / 0.08)" }}
            >
              <div className="flex items-center gap-2.5">
                <div
                  className="flex items-center justify-center w-7 h-7 rounded-lg shrink-0"
                  style={{ background: `${stat.accent}18` }}
                >
                  <stat.icon className="h-3.5 w-3.5" style={{ color: stat.accent }} />
                </div>
                <span className="text-[11px] font-semibold" style={{ color: "#736C83" }}>
                  {stat.label}
                </span>
              </div>
              <span className="text-lg font-bold tabular-nums" style={{ color: "#0D031B" }}>
                {stat.value}
              </span>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Breakdown Card */}
      <Card
        className="rounded-3xl shadow-sm overflow-hidden"
        style={{ background: "rgba(255,255,255,0.9)", borderColor: "oklch(0.45 0.12 285 / 0.12)" }}
      >
        <CardContent className="px-5 py-4 space-y-4">
          <p className="text-[11px] font-bold uppercase tracking-[0.18em]" style={{ color: "#9A94AA" }}>
            {activeDay} Breakdown
          </p>

          {[
            { label: "Completed", count: completedCount, total: totalShifts, accent: "oklch(0.62 0.16 150)", icon: CheckCircle2 },
            { label: "Active", count: activeCount, total: totalShifts, accent: "oklch(0.42 0.14 285)", icon: Activity },
            { label: "Upcoming", count: upcomingCount, total: totalShifts, accent: "oklch(0.75 0.15 75)", icon: Timer },
          ].map(row => {
            const pct = totalShifts > 0 ? Math.round((row.count / totalShifts) * 100) : 0
            return (
              <div key={row.label} className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <row.icon className="h-3.5 w-3.5" style={{ color: row.accent }} />
                    <span className="text-[11px] font-semibold" style={{ color: "#736C83" }}>{row.label}</span>
                  </div>
                  <span className="text-[11px] font-bold tabular-nums" style={{ color: "#0D031B" }}>
                    {row.count}/{row.total}
                  </span>
                </div>
                <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "oklch(0.45 0.12 285 / 0.08)" }}>
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${pct}%`, background: row.accent }}
                  />
                </div>
              </div>
            )
          })}
        </CardContent>
      </Card>

      {/* Quotas Card */}
      <Card
        className="rounded-3xl shadow-sm overflow-hidden"
        style={{ background: "oklch(0.42 0.14 285)", borderColor: "transparent" }}
      >
        <CardContent className="px-5 py-5 text-center relative">
          <div
            className="flex items-center justify-center w-12 h-12 rounded-2xl mx-auto mb-3"
            style={{ background: "rgba(255,255,255,0.15)" }}
          >
            <CheckCircle2 className="h-6 w-6 text-white" />
          </div>
          <p className="text-white font-bold text-[15px] tracking-tight leading-none">
            Quotas Satisfied
          </p>
          <p className="text-[11px] mt-2 leading-relaxed" style={{ color: "rgba(255,255,255,0.65)" }}>
            All roles for the current shift period are fully staffed.
          </p>

          <button
            className="w-full flex items-center justify-center gap-2 h-10 mt-4 rounded-2xl font-bold text-[11px] uppercase tracking-widest transition-all hover:-translate-y-0.5 hover:shadow-lg"
            style={{
              background: "rgba(255,255,255,0.15)",
              color: "white",
            }}
          >
            <Download className="h-3.5 w-3.5" />
            Export Roster
          </button>
        </CardContent>
      </Card>
    </div>
  )
}
