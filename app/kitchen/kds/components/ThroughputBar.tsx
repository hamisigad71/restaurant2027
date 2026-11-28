"use client"

import { ArrowTrendingUpIcon } from "@heroicons/react/24/outline"
import { Badge } from "@/components/ui/badge"

interface ThroughputBarProps {
  pendingCount: number
  cookingCount: number
  readyCount: number
}

export function ThroughputBar({ pendingCount, cookingCount, readyCount }: ThroughputBarProps) {
  const total = pendingCount + cookingCount + readyCount || 1
  return (
    <div className="flex items-center gap-4 px-5 py-2.5 border-b bg-card/80 backdrop-blur-sm shrink-0">
      <div className="flex items-center gap-1.5 shrink-0 text-muted-foreground">
        <ArrowTrendingUpIcon className="size-3.5 text-primary" />
        <span className="text-xs font-medium uppercase">Avg 18m</span>
      </div>

      <div className="flex-1 h-2 rounded-full overflow-hidden flex gap-px bg-muted">
        <div
          className="h-full bg-warning transition-[width] duration-300 ease-(--ease-out)"
          style={{ width: `${(pendingCount / total) * 100}%` }}
        />
        <div
          className="h-full bg-primary transition-[width] duration-300 ease-(--ease-out)"
          style={{ width: `${(cookingCount / total) * 100}%` }}
        />
        <div
          className="h-full bg-success transition-[width] duration-300 ease-(--ease-out)"
          style={{ width: `${(readyCount / total) * 100}%` }}
        />
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <Badge variant="outline" className="text-[10px]">{pendingCount} pending</Badge>
        <Badge variant="outline" className="text-[10px]">{cookingCount} cooking</Badge>
        <Badge variant="outline" className="text-[10px]">{readyCount} ready</Badge>
      </div>
    </div>
  )
}
