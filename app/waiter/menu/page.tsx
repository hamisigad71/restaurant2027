"use client"

import { useState, useEffect } from "react"
import {
  MagnifyingGlassIcon as Search, 
  AdjustmentsHorizontalIcon as Filter, 
  ArrowTrendingUpIcon as TrendingUp,
  ExclamationCircleIcon as AlertCircle, 
  EyeIcon as Eye, 
  EyeSlashIcon as EyeOff, 
  ChevronRightIcon as ChevronRight,
  StarIcon as Star, 
  HandThumbUpIcon as Leaf, 
  BoltIcon as Zap, 
  EllipsisHorizontalIcon as MoreHorizontal, 
  FireIcon as Flame,
  BoltIcon as UtensilsCrossed, 
  CubeIcon as Package,
} from "@heroicons/react/24/outline"
import { Button }  from "@/components/ui/button"
import { Input }   from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Tooltip, TooltipContent, TooltipProvider, TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { MenuItem } from "@/lib/types"

// ─── Category mapping ─────────────────────────────────────────────────────────
const CATEGORY_MAP: Record<string, string> = {
  "All Items":   "All Items",
  "Main Dishes": "main",
  "Appetizers":  "starters",
  "Desserts":    "desserts",
  "Beverages":   "drinks",
  "Seafood":     "seafood",
  "Snacks":      "snacks",
}

const CATEGORIES = [
  "All Items", "Main Dishes", "Appetizers",
  "Seafood", "Snacks", "Desserts", "Beverages", "Vegetarian",
]

// ─── Menu Card (Waitstaff View) ────────────────────────────────────────────────
function MenuCard({
  item,
  onToggleAvailability,
}: {
  item: MenuItem
  onToggleAvailability: (id: string) => void
}) {
  return (
    <div
      className="group relative flex flex-col overflow-hidden rounded-lg border bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
      style={{
        borderColor: "oklch(0.45 0.12 285 / 0.1)",
        boxShadow: "0 2px 10px rgba(13,3,27,0.06)",
      }}
    >
      {/* ── Image section ──────────────────────────────────────── */}
      <div className="relative aspect-[4/3] overflow-hidden rounded-t-lg mx-0 shrink-0">
        <img
          src={item.image || "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&q=80"}
          alt={item.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          loading="lazy"
        />
        {/* Scrim */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

        {/* Live/86'd badge — top-left */}
        <div className="absolute top-2.5 left-2.5">
          <span
            className="flex items-center gap-1 text-[9px] font-bold uppercase px-2 py-1 rounded-full text-white"
            style={{
              background: item.available
                ? "oklch(0.62 0.16 150 / 0.85)"
                : "oklch(0.55 0.18 25 / 0.85)",
              backdropFilter: "blur(6px)",
            }}
          >
            <span
              className={cn("w-1.5 h-1.5 rounded-full", item.available ? "animate-pulse" : "")}
              style={{ background: "white" }}
            />
            {item.available ? "Live" : "86'd"}
          </span>
        </div>

        {/* Tag badge — top-right */}
        {(item.popular || item.vegetarian) && (
          <div className="absolute top-2.5 right-2.5">
            <span
              className="flex items-center gap-1 text-[9px] font-bold uppercase px-2 py-1 rounded-full text-white"
              style={{
                background: item.popular
                  ? "oklch(0.75 0.15 75 / 0.9)"
                  : "oklch(0.62 0.16 150 / 0.9)",
                backdropFilter: "blur(6px)",
              }}
            >
              {item.vegetarian ? <Leaf className="h-2.5 w-2.5" /> : <Flame className="h-2.5 w-2.5" />}
              {item.popular ? "Popular" : "Veg"}
            </span>
          </div>
        )}

        {/* Price — bottom-left */}
        <div className="absolute bottom-2.5 left-3">
          <p className="text-white font-bold text-[15px] leading-none tabular-nums drop-shadow">
            KES {item.price.toLocaleString()}
          </p>
          <p className="text-white/65 text-[9px] font-bold uppercase mt-0.5">
            {item.category}
          </p>
        </div>

        {/* Rating — bottom-right */}
        <div
          className="absolute bottom-2.5 right-2.5 flex items-center gap-1 px-2 py-1 rounded-xl"
          style={{ background:"rgba(0,0,0,0.35)", backdropFilter:"blur(6px)" }}
        >
          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
          <span className="text-white text-[10px] font-bold">{item.rating ?? 4.5}</span>
        </div>
      </div>

      {/* ── Card body ──────────────────────────────────────────── */}
      <div className="flex flex-col flex-1 px-3 pt-3 pb-3 gap-2">

        {/* Name + info menu */}
        <div className="flex items-start justify-between gap-1.5">
          <h3
            className="text-[12px] font-bold leading-tight line-clamp-2 flex-1"
            style={{ color: "#0D031B" }}
          >
            {item.name}
          </h3>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className="flex items-center justify-center w-6 h-6 rounded-lg shrink-0 transition-colors hover:bg-[#EBE6F8]"
                style={{ color: "var(--icon-primary)" }}
              >
                <MoreHorizontal className="h-3.5 w-3.5" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-44 rounded-2xl border p-1.5"
              style={{
                background:"#FDFCFF",
                borderColor:"oklch(0.45 0.12 285 / 0.15)",
                boxShadow:"0 8px 28px rgba(13,3,27,0.12)",
              }}
            >
              <DropdownMenuItem
                className="flex items-center gap-2 text-[11px] font-semibold rounded-xl px-2.5 py-2 cursor-pointer"
                style={{ color:"#3F3D8F" }}
              >
                <Package className="h-3.5 w-3.5" />
                View Ingredients
              </DropdownMenuItem>
              <DropdownMenuItem
                className="flex items-center gap-2 text-[11px] font-semibold rounded-xl px-2.5 py-2 cursor-pointer"
                style={{ color:"#3D374C" }}
              >
                <AlertCircle className="h-3.5 w-3.5" />
                Report Supply Low
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Popularity row */}
        <div className="flex items-center justify-between">
          <div
            className="flex items-center gap-1 text-[9px] font-bold uppercase"
            style={{ color: item.popular ? "oklch(0.55 0.15 75)" : "var(--icon-primary)" }}
          >
            {item.popular
              ? <><TrendingUp className="h-3 w-3" /> High Demand</>
              : <><Zap className="h-3 w-3" /> Medium</>
            }
          </div>
          <span className="text-[9px] font-medium" style={{ color:"var(--icon-primary)" }}>
            {item.popular ? "100+" : "50+"} orders
          </span>
        </div>

        {/* Action row */}
        <div
          className="flex flex-col gap-2 pt-2 mt-auto border-t"
          style={{ borderColor:"oklch(0.45 0.12 285 / 0.08)" }}
        >
          <button
            onClick={() => onToggleAvailability(item.id)}
            className="flex items-center justify-center gap-1 text-[9px] font-bold uppercase px-2 py-1.5 rounded-lg transition-colors w-full"
            style={
              item.available
                ? { color:"oklch(0.42 0.14 150)", background:"oklch(0.62 0.16 150 / 0.08)" }
                : { color:"oklch(0.55 0.18 25)",  background:"oklch(0.65 0.18 25 / 0.08)"  }
            }
          >
            {item.available
              ? <><Eye className="h-3 w-3" />Available</>
              : <><EyeOff className="h-3 w-3" />Mark 86'd</>
            }
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Waiter Menu Page ────────────────────────────────────────────────────────
export default function WaiterMenuPage() {
  const [menuItems,      setMenuItems]      = useState<MenuItem[]>([])
  const [searchQuery,    setSearchQuery]    = useState("")
  const [activeCategory, setActiveCategory] = useState("All Items")

  useEffect(() => {
    fetch("/api/menu", { cache:"no-store" })
      .then(res => res.json())
      .then(setMenuItems)
  }, [])

  const handleToggleAvailability = (id: string) => {
    setMenuItems(prev =>
      prev.map(item => item.id === id ? { ...item, available: !item.available } : item),
    )
  }

  const filtered = menuItems.filter(item => {
    const matchSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase())
    let matchCat = activeCategory === "All Items"
    if (activeCategory === "Vegetarian") {
      matchCat = !!item.vegetarian
    } else {
      const mapped = CATEGORY_MAP[activeCategory]
      if (mapped) matchCat = item.category === mapped || activeCategory === "All Items"
    }
    return matchSearch && matchCat
  })

  return (
    <TooltipProvider>
      <div className="min-h-screen pb-16" style={{ background:"#F0EBF8" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-5 pt-6 space-y-6">

          {/* ── Page header ──────────────────────────────────────── */}
          <div className="flex items-center gap-2 mb-1.5">
            <div
              className="flex items-center justify-center w-9 h-9 rounded-xl p-1.5"
              style={{ background:"#3F3D8F", boxShadow:"0 4px 12px oklch(0.45 0.12 285 / 0.35)" }}
            >
              <img src="/menu-nav.png" className="w-full h-full brightness-0 invert object-contain" alt="Menu" style={{ filter: "brightness(0) invert(1)" }} />
            </div>
            <div>
              <h1 className="text-[17px] font-bold leading-none" style={{ color:"#0D031B" }}>
                Service Menu
              </h1>
              <p className="text-[10px] font-bold uppercase mt-0.5" style={{ color:"#9A94AA" }}>
                Real-time Dish Availability
              </p>
            </div>
          </div>

          {/* ── Category tabs ────────────────────────────────────── */}
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1 -mx-1 px-1">
            {CATEGORIES.map(cat => {
              const active = activeCategory === cat
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className="flex items-center h-9 px-4 rounded-xl text-[10px] font-bold uppercase whitespace-nowrap shrink-0 border transition-all duration-200"
                  style={
                    active
                      ? { background:"#3F3D8F", color:"white", borderColor:"transparent", boxShadow:"0 3px 10px oklch(0.45 0.12 285 / 0.3)" }
                      : { background:"rgba(255,255,255,0.8)", color:"#736C83", borderColor:"oklch(0.45 0.12 285 / 0.12)" }
                  }
                >
                  {cat}
                </button>
              )
            })}
          </div>

          {/* ── Search + filter ──────────────────────────────────── */}
          <div className="flex gap-2.5">
            <div className="relative flex-1">
              <Search
                className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 pointer-events-none"
                style={{ color:"var(--icon-primary)" }}
              />
              <Input
                placeholder="Search dishes…"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="h-10 pl-10 rounded-xl border text-sm"
                style={{
                  background:"rgba(255,255,255,0.85)",
                  borderColor:"oklch(0.45 0.12 285 / 0.15)",
                  color:"#0D031B",
                }}
              />
            </div>
          </div>

          {/* Count label */}
          <p className="text-[10px] font-bold uppercase -mt-2" style={{ color:"var(--icon-primary)" }}>
            {filtered.length} of {menuItems.length} items
          </p>

          {/* ── Menu grid ────────────────────────────────────────── */}
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center border"
                style={{ background:"rgba(255,255,255,0.8)", borderColor:"oklch(0.45 0.12 285 / 0.15)" }}
              >
                <Package className="h-7 w-7" style={{ color:"var(--icon-primary)" }} />
              </div>
              <div className="text-center">
                <p className="font-bold text-base" style={{ color:"#0D031B" }}>No items found</p>
                <p className="text-sm mt-1" style={{ color:"#736C83" }}>Try adjusting your search</p>
              </div>
            </div>
          ) : (
            <div className="grid gap-3 sm:gap-4 grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {filtered.map(item => (
                <MenuCard
                  key={item.id}
                  item={item}
                  onToggleAvailability={handleToggleAvailability}
                />
              ))}
            </div>
          )}

        </div>
      </div>
    </TooltipProvider>
  )
}
