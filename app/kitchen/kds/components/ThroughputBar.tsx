"use client"
import { ArrowTrendingUpIcon } from "@heroicons/react/24/outline"

interface ThroughputBarProps {
  pendingCount: number;
  cookingCount: number;
  readyCount: number;
}

export function ThroughputBar({ pendingCount, cookingCount, readyCount }: ThroughputBarProps) {
  const total = pendingCount + cookingCount + readyCount || 1
  return (
    <div className="flex items-center gap-4 px-5 py-3 border-b shrink-0" style={{ background: "rgba(255,255,255,0.75)", backdropFilter: "blur(12px)", borderColor: "oklch(0.45 0.12 285 / 0.1)" }}>
      <div className="flex items-center gap-1.5 shrink-0">
        <ArrowTrendingUpIcon className="h-3 w-3" style={{ color: "#3F3D8F" }} />
        <span className="text-[10px] font-bold uppercase " style={{ color: "#736C83" }}>
          Avg 18m
        </span>
      </div>

      <div className="flex-1 h-2 rounded-full overflow-hidden flex gap-px" style={{ background: "rgba(0,0,0,0.06)" }}>
        <div
          className="h-full rounded-l-full transition-all duration-500"
          style={{ width: `${(pendingCount / total) * 100}%`, background: "oklch(0.75 0.15 75)" }}
        />
        <div
          className="h-full transition-all duration-500"
          style={{ width: `${(cookingCount / total) * 100}%`, background: "#3F3D8F" }}
        />
        <div
          className="h-full rounded-r-full transition-all duration-500"
          style={{ width: `${(readyCount / total) * 100}%`, background: "oklch(0.62 0.16 150)" }}
        />
      </div>

      <div className="flex items-center gap-3 shrink-0 text-[10px] font-bold uppercase " style={{ color: "#736C83" }}>
        <span>{pendingCount} pending</span>
        <span style={{ color: "#D0CBE4" }}>·</span>
        <span>{cookingCount} cooking</span>
        <span style={{ color: "#D0CBE4" }}>·</span>
        <span>{readyCount} ready</span>
      </div>
    </div>
  )
}
