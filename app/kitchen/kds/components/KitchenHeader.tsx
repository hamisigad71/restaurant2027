"use client"

import {
  SignalIcon,
  BellIcon,
  Squares2X2Icon,
  Bars3Icon,
} from "@heroicons/react/24/outline"
import { Button } from "@/components/ui/button"
import { ButtonGroup } from "@/components/ui/button-group"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface KitchenHeaderProps {
  pendingCount: number
  cookingCount: number
  readyCount: number
  viewMode: "grid" | "list"
  onViewMode: (mode: "grid" | "list") => void
  onBellClick: () => void
}

export function KitchenHeader({
  readyCount,
  viewMode,
  onViewMode,
  onBellClick,
}: KitchenHeaderProps) {
  return (
    <TooltipProvider>
      <div className="px-5 py-3.5 bg-primary text-primary-foreground flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shrink-0">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-xl flex items-center justify-center border border-primary-foreground/20 bg-primary-foreground/10 p-1.5">
            <img src="/chef-icon.png" alt="Chef" className="w-full h-full brightness-0 invert object-contain" />
          </div>
          <div className="flex items-center gap-2.5">
            <p className="font-semibold uppercase text-sm leading-none">Kitchen Display</p>
            <Badge variant="secondary" className="gap-1 bg-primary-foreground/15 text-primary-foreground border-primary-foreground/20">
              <SignalIcon className="size-3 text-accent" />
              Live
            </Badge>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Filter ready orders"
                className="relative bg-primary-foreground/10 border border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/20 hover:text-primary-foreground"
                onClick={onBellClick}
              >
                <BellIcon className="size-4" />
                {readyCount > 0 && (
                  <Badge className="absolute -top-1.5 -right-1.5 h-4 min-w-4 px-1 text-[9px] bg-accent text-accent-foreground border-0">
                    {readyCount}
                  </Badge>
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>Show ready orders</TooltipContent>
          </Tooltip>

          <ButtonGroup className="border border-primary-foreground/20 rounded-md overflow-hidden">
            <Button
              variant={viewMode === "grid" ? "secondary" : "ghost"}
              size="icon"
              aria-label="Grid view"
              className={viewMode === "grid" ? "" : "text-primary-foreground hover:bg-primary-foreground/15 hover:text-primary-foreground"}
              onClick={() => onViewMode("grid")}
            >
              <Squares2X2Icon className="size-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "secondary" : "ghost"}
              size="icon"
              aria-label="List view"
              className={viewMode === "list" ? "" : "text-primary-foreground hover:bg-primary-foreground/15 hover:text-primary-foreground"}
              onClick={() => onViewMode("list")}
            >
              <Bars3Icon className="size-4" />
            </Button>
          </ButtonGroup>
        </div>
      </div>
    </TooltipProvider>
  )
}
