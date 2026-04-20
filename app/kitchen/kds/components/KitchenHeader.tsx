"use client"
import { 
  FireIcon, 
  SignalIcon, 
  BellIcon, 
  Squares2X2Icon, 
  Bars3Icon 
} from "@heroicons/react/24/outline"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface KitchenHeaderProps {
  pendingCount: number;
  cookingCount: number;
  readyCount: number;
  viewMode: 'grid' | 'list';
  onViewMode: (mode: 'grid' | 'list') => void;
  onBellClick: () => void;
}

export function KitchenHeader({ 
  pendingCount, cookingCount, readyCount, 
  viewMode, onViewMode, onBellClick 
}: KitchenHeaderProps) {
  return (
    <div className="relative overflow-hidden px-5 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shrink-0" style={{ background: "oklch(0.45 0.12 285)" }}>
      {/* Brand */}
      <div className="relative z-10 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center border" style={{ background: "rgba(255,255,255,0.12)", borderColor: "rgba(255,255,255,0.2)" }}>
          <FireIcon className="h-5 w-5 text-white" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <p className="text-white font-bold  uppercase text-[15px] leading-none">Kitchen Display</p>
            <span className="flex items-center gap-1 text-[9px] font-bold uppercase  px-2.5 py-1 rounded-full" style={{ background: "rgba(255,255,255,0.15)", borderColor: "rgba(255,255,255,0.2)", color: "white", border: "1px solid rgba(255,255,255,0.2)" }}>
              <SignalIcon className="h-3 w-3 animate-pulse" style={{ color: "oklch(0.7 0.15 150)" }} />
              Live
            </span>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="relative z-10 flex items-center gap-2">
        <button
          className="relative flex items-center justify-center w-9 h-9 rounded-xl border transition-all hover:bg-white/20"
          style={{ background: "rgba(255,255,255,0.12)", borderColor: "rgba(255,255,255,0.2)", color: "white" }}
          onClick={onBellClick}
        >
          <BellIcon className="h-4 w-4" />
          {readyCount > 0 && (
            <span
              className="absolute -top-1 -right-1 w-4 h-4 flex items-center justify-center text-[9px] font-bold text-white rounded-full"
              style={{ background: "oklch(0.62 0.16 150)", boxShadow: "0 2px 6px oklch(0.62 0.16 150 / 0.5)" }}
            >
              {readyCount}
            </span>
          )}
        </button>

        {/* View mode toggle */}
        <div className="flex rounded-xl overflow-hidden border" style={{ borderColor: "rgba(255,255,255,0.2)", background: "rgba(255,255,255,0.1)" }}>
          <button
            className="flex items-center justify-center px-3 py-2 transition-colors text-white"
            style={{ background: viewMode === "grid" ? "rgba(255,255,255,0.22)" : "transparent" }}
            onClick={() => onViewMode("grid")}
          >
            <Squares2X2Icon className="h-4 w-4" />
          </button>
          <button
            className="flex items-center justify-center px-3 py-2 transition-colors text-white"
            style={{ background: viewMode === "list" ? "rgba(255,255,255,0.22)" : "transparent" }}
            onClick={() => onViewMode("list")}
          >
            <Bars3Icon className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
