"use client"

import { useState } from "react"
import { 
  Plus, 
  Search, 
  Filter,
  DollarSign,
  TrendingUp,
  AlertCircle,
  Eye,
  EyeOff,
  ChevronRight,
  Flame,
  Star,
  Leaf,
  Zap,
  Edit3,
  MoreHorizontal,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { useEffect } from "react"
import { MenuItem } from "@/lib/types"

const CATEGORY_MAP: Record<string, string> = {
  "All Items": "All Items",
  "Main Dishes": "main",
  "Appetizers": "starters",
  "Desserts": "desserts",
  "Beverages": "drinks",
  "Seafood": "seafood",
  "Snacks": "snacks"
}

// Status popularity config
const popularityConfig: Record<string, { color: string; icon: React.ReactNode }> = {
  High:     { color: "text-emerald-600", icon: <TrendingUp className="h-3 w-3" /> },
  Trending: { color: "text-amber-500",   icon: <Flame className="h-3 w-3" /> },
  Medium:   { color: "text-sky-500",     icon: <Zap className="h-3 w-3" /> },
  Low:      { color: "text-slate-400",   icon: <Star className="h-3 w-3" /> },
}

export default function ManagerMenuPage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState("All Items")

  useEffect(() => {
    fetch('/api/menu', { cache: 'no-store' }).then(res => res.json()).then(setMenuItems)
  }, [])

  const filtered = menuItems.filter((item) => {
    const matchSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase())
    
    let matchCat = activeCategory === "All Items"
    if (activeCategory === "Vegetarian") {
      matchCat = !!item.vegetarian
    } else {
      const mappedCat = CATEGORY_MAP[activeCategory]
      if (mappedCat) matchCat = item.category === mappedCat || activeCategory === "All Items"
    }
    
    return matchSearch && matchCat
  })

  return (
    <div className="min-h-screen bg-[#F7F7F6] pb-24">
      <div className="max-w-7xl mx-auto px-4 pt-8 space-y-8">

        {/* ── Header ── */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <h1 className="text-3xl font-heading uppercase text-foreground leading-none tracking-tight">
              Menu Management
            </h1>
            <div className="flex items-center gap-2 text-[10px] font-medium font-heading uppercase text-primary/50">
              <div className="w-8 h-[1px] bg-primary/20" />
              Dish Orchestration &amp; Price Strategy
            </div>
          </div>
          <Button className="h-12 px-6 bg-primary text-white font-heading uppercase rounded-xl shadow-xl shadow-primary/20 hover:scale-105 transition-all border-none text-[11px] gap-3">
            <Plus className="h-4 w-4" /> Add Item
          </Button>
        </div>

        {/* ── Category Tabs ── */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {["All Items", "Appetizers", "Main Dishes", "Seafood", "Snacks", "Desserts", "Beverages", "Vegetarian"].map((cat) => (
            <Button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              variant={activeCategory === cat ? "default" : "outline"}
              className={cn(
                "h-10 px-5 rounded-xl font-heading text-[9px] uppercase transition-all whitespace-nowrap",
                activeCategory === cat
                  ? "bg-primary text-white shadow-lg border-none"
                  : "border-primary/8 bg-white text-muted-foreground/70 hover:text-primary hover:bg-white hover:scale-105 hover:shadow-sm"
              )}
            >
              {cat}
            </Button>
          ))}
        </div>

        {/* ── Toolbar ── */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-primary/30 group-focus-within:text-primary transition-colors" />
            <Input
              placeholder="Search by dish name or SKU..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-12 pl-11 bg-white border-primary/5 rounded-xl text-sm focus-visible:ring-primary/10 shadow-sm"
            />
          </div>
          <Button variant="outline" className="h-12 w-full sm:w-auto px-6 border-primary/5 bg-white text-muted-foreground font-heading uppercase tracking-[0.12em] text-[10px] rounded-xl hover:bg-primary hover:text-white transition-all flex gap-2">
            <Filter className="h-4 w-4" /> Filter
          </Button>
        </div>

        {/* ── Count ── */}
        <p className="text-[10px] font-heading uppercase text-muted-foreground/60 tracking-widest -mt-4">
          Showing {filtered.length} of {menuItems.length} items
        </p>

        {/* ── Menu Grid ── */}
        <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {filtered.map((item) => {
            return (
              <Card
                key={item.id}
                className="group relative overflow-hidden bg-white border-0 shadow-md ring-1 ring-black/5 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-1.5 rounded-2xl p-0"
              >
                {/* Image */}
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                  />

                  {/* Gradient overlay always-on subtle */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/5 to-transparent" />

                  {/* Top-left: status badge */}
                  <div className="absolute top-3 left-3">
                    <Badge
                      className={cn(
                        "rounded-lg px-2.5 py-0.5 font-heading text-[8px] uppercase tracking-widest border-none shadow-md",
                        item.available
                          ? "bg-emerald-500 text-white"
                          : "bg-rose-500 text-white"
                      )}
                    >
                      {item.available ? "● Live" : "✕  86'd"}
                    </Badge>
                  </div>

                  {/* Top-right: tag badge */}
                  <div className="absolute top-3 right-3">
                    <Badge
                      className={cn(
                        "rounded-lg px-2.5 py-0.5 font-heading text-[8px] uppercase tracking-widest border-none shadow-md",
                        item.popular ? "bg-amber-500" : (item.vegetarian ? "bg-emerald-500" : "bg-sky-500"),
                        "text-white"
                      )}
                    >
                      {item.vegetarian ? (
                        <Leaf className="h-2 w-2 mr-1 inline" />
                      ) : null}
                      {item.popular ? "Bestseller" : (item.vegetarian ? "Vegetarian" : "Chef's Pick")}
                    </Badge>
                  </div>

                  {/* Bottom: price floated on image */}
                  <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
                    <div>
                      <p className="text-white/70 text-[8px] font-heading uppercase tracking-widest mb-0.5">
                        {item.category}
                      </p>
                      <p className="text-white text-base font-sans leading-none tabular-nums">
                        KES {item.price.toLocaleString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 bg-black/30 backdrop-blur-sm rounded-lg px-2 py-1">
                      <Star className="h-2.5 w-2.5 text-amber-400 fill-amber-400" />
                      <span className="text-white text-[9px] font-heading">{item.rating || 4.5}</span>
                    </div>
                  </div>

                  {/* Hover: Quick Edit overlay */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button className="flex items-center gap-2 bg-white/90 backdrop-blur-md text-primary rounded-xl px-4 py-2 text-[10px] font-heading uppercase tracking-widest shadow-xl hover:bg-white transition-all">
                      <Edit3 className="h-3.5 w-3.5" /> Quick Edit
                    </button>
                  </div>
                </div>

                {/* Card Body */}
                <CardContent className="px-4 pt-3.5 pb-3">
                  {/* Name & context menu */}
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-heading text-[11px] uppercase tracking-wide text-foreground leading-snug line-clamp-2 flex-1">
                      {item.name}
                    </h3>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="h-6 w-6 shrink-0 flex items-center justify-center rounded-lg text-muted-foreground/40 hover:text-primary hover:bg-primary/5 transition-all">
                          <MoreHorizontal className="h-3.5 w-3.5" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="text-xs">
                        <DropdownMenuItem className="text-[10px] font-heading uppercase tracking-widest text-primary focus:bg-primary/5">Edit Details</DropdownMenuItem>
                        <DropdownMenuItem className="text-[10px] font-heading uppercase tracking-widest focus:bg-primary/5">Adjust Price</DropdownMenuItem>
                        <DropdownMenuItem className="text-[10px] font-heading uppercase tracking-widest text-destructive focus:bg-destructive/5">Remove Dish</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  {/* Stats row */}
                  <div className="flex items-center justify-between mb-3">
                    <div className={cn("flex items-center gap-1 text-[9px] font-heading uppercase tracking-wide", item.popular ? popularityConfig["High"].color : popularityConfig["Medium"].color)}>
                      {item.popular ? popularityConfig["High"].icon : popularityConfig["Medium"].icon}
                      {item.popular ? "High" : "Medium"}
                    </div>
                    <span className="text-[9px] font-heading text-muted-foreground/50 uppercase">
                      {item.popular ? "100+" : "50+"} orders
                    </span>
                  </div>

                  {/* Divider + actions */}
                  <div className="grid grid-cols-2 gap-1.5 pt-3 border-t border-black/5">
                    <Button
                      variant="ghost"
                      className={cn(
                        "h-8 rounded-xl text-[8px] font-heading uppercase tracking-wide gap-1.5 justify-start px-2 transition-all",
                        !item.available
                          ? "text-rose-500/70 hover:text-rose-600 hover:bg-rose-50"
                          : "text-emerald-500/70 hover:text-emerald-600 hover:bg-emerald-50"
                      )}
                    >
                      {!item.available ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                      {!item.available ? "Mark 86'd" : "Mark Available"}
                    </Button>
                    <Button
                      variant="ghost"
                      className="h-8 rounded-xl text-[8px] font-heading uppercase tracking-wide gap-1 justify-end px-2 text-primary/50 hover:text-primary hover:bg-primary/5 transition-all"
                    >
                      Strategy <ChevronRight className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* ── Stock Insights ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Card className="border-none bg-gradient-to-br from-orange-50 to-orange-100/60 shadow-sm rounded-2xl overflow-hidden p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-orange-500 flex items-center justify-center shadow-lg shadow-orange-500/30 shrink-0">
                <AlertCircle className="h-6 w-6 text-white" />
              </div>
              <div className="space-y-1">
                <h3 className="font-heading text-base uppercase text-orange-900 leading-none tracking-tight">Supply Risk: Truffles</h3>
                <p className="text-[10px] font-heading uppercase text-orange-700/60 tracking-wide">
                  Inventory for Risotto is critical. Reorder by 22:00.
                </p>
              </div>
            </div>
          </Card>

          <Card className="border-none bg-gradient-to-br from-emerald-50 to-emerald-100/60 shadow-sm rounded-2xl overflow-hidden p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/30 shrink-0">
                <DollarSign className="h-6 w-6 text-white" />
              </div>
              <div className="space-y-1">
                <h3 className="font-heading text-base uppercase text-emerald-900 leading-none tracking-tight">Pricing Opportunity</h3>
                <p className="text-[10px] font-heading uppercase text-emerald-700/60 tracking-wide">
                  Salmon margins improved. Suggested price adjustment: +KES 150.
                </p>
              </div>
            </div>
          </Card>
        </div>

      </div>
    </div>
  )
}
