"use client"

import { useState, useEffect } from "react"
import { AnimatePresence, motion } from "motion/react"
import { SPRING_SNAPPY } from "@/lib/motion"
import {
  PlusIcon as Plus,
  MagnifyingGlassIcon as Search,
  FunnelIcon as Filter,
  CurrencyDollarIcon as DollarSign,
  ArrowTrendingUpIcon as TrendingUp,
  ExclamationCircleIcon as AlertCircle,
  EyeIcon as Eye,
  EyeSlashIcon as EyeOff,
  ChevronRightIcon as ChevronRight,
  FireIcon as Flame,
  StarIcon as Star,
  HandThumbUpIcon as Leaf,
  BoltIcon as Zap,
  PencilSquareIcon as Edit3,
  EllipsisHorizontalIcon as MoreHorizontal,
  ArrowRightIcon as UtensilsCrossed,
  CubeIcon as Package,
} from "@heroicons/react/24/outline"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { MenuItem } from "@/lib/types"
import { allMenuItems } from "@/lib/menu-data"
import { MenuService } from "@/lib/restaurant-store"
import { toast } from "sonner"

const CATEGORY_MAP: Record<string, string> = {
  "All Items": "All Items",
  "Main Dishes": "main",
  "Appetizers": "starters",
  "Desserts": "desserts",
  "Beverages": "drinks",
  "Seafood": "seafood",
  "Snacks": "snacks",
}

const CATEGORIES = [
  "All Items",
  "Main Dishes",
  "Appetizers",
  "Seafood",
  "Snacks",
  "Desserts",
  "Beverages",
  "Vegetarian",
]

const INSIGHTS = [
  {
    icon: AlertCircle,
    title: "Supply Risk: Truffles",
    desc: "Inventory for Risotto is critical. Reorder by 22:00 tonight.",
    tone: "border-destructive/25 bg-destructive/5",
    iconTone: "bg-destructive text-destructive-foreground",
  },
  {
    icon: DollarSign,
    title: "Pricing Opportunity",
    desc: "Salmon margins improved. Suggested price adjustment: +KES 150.",
    tone: "border-success/25 bg-success/5",
    iconTone: "bg-success text-success-foreground",
  },
]

function MenuCard({
  item,
  onToggleAvailability,
}: {
  item: MenuItem
  onToggleAvailability: (id: string) => void
}) {
  return (
    <Card
      size="sm"
      className="group gap-0 py-0 overflow-hidden transition-[border-color,box-shadow] duration-150 ease-(--ease-out) hover:shadow-md h-full"
    >
      <div className="relative aspect-[4/3] overflow-hidden shrink-0 bg-muted">
        <img
          src={
            item.image ||
            "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&q=80"
          }
          alt={item.name}
          className="w-full h-full object-cover transition-transform duration-300 ease-(--ease-out) group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

        <div className="absolute top-2.5 left-2.5">
          <Badge
            variant={item.available ? "default" : "destructive"}
            className="text-[10px] uppercase gap-1"
          >
            <span className="size-1.5 rounded-full bg-current" />
            {item.available ? "Live" : "86'd"}
          </Badge>
        </div>

        {(item.popular || item.vegetarian) && (
          <div className="absolute top-2.5 right-2.5">
            <Badge variant="secondary" className="text-[10px] uppercase gap-1">
              {item.vegetarian ? <Leaf className="size-3" /> : <Flame className="size-3" />}
              {item.popular ? "Popular" : "Veg"}
            </Badge>
          </div>
        )}

        <div className="absolute bottom-2.5 left-3">
          <p className="text-white font-bold text-sm leading-none tabular-nums drop-shadow">
            KES {item.price.toLocaleString()}
          </p>
          <p className="text-white/70 text-[10px] font-medium uppercase mt-0.5">
            {item.category}
          </p>
        </div>

        <Badge
          variant="secondary"
          className="absolute bottom-2.5 right-2.5 gap-1 bg-black/60 text-white border-0"
        >
          <Star className="size-3 fill-yellow-400 text-yellow-400" />
          {item.rating ?? 4.5}
        </Badge>

        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-black/25">
          <Button size="xs" variant="secondary" className="gap-1.5 uppercase shadow-md">
            <Edit3 className="size-3.5" />
            Quick Edit
          </Button>
        </div>
      </div>

      <CardHeader className="pt-3 pb-2">
        <CardTitle className="text-sm leading-snug line-clamp-2">
          <h3>{item.name}</h3>
        </CardTitle>
        <CardAction>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon-xs">
                <MoreHorizontal className="size-3.5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44">
              <DropdownMenuItem>
                <Edit3 className="size-3.5" />
                Edit Details
              </DropdownMenuItem>
              <DropdownMenuItem>
                <DollarSign className="size-3.5" />
                Adjust Price
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive">
                <UtensilsCrossed className="size-3.5" />
                Remove Dish
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardAction>
      </CardHeader>

      <CardContent className="pb-3 flex-1">
        <div className="flex items-center justify-between text-[11px]">
          <span
            className={cn(
              "inline-flex items-center gap-1 font-medium uppercase",
              item.popular ? "text-warning" : "text-primary",
            )}
          >
            {item.popular ? (
              <>
                <TrendingUp className="size-3" /> High Demand
              </>
            ) : (
              <>
                <Zap className="size-3" /> Medium
              </>
            )}
          </span>
          <span className="text-muted-foreground">{item.popular ? "100+" : "50+"} orders</span>
        </div>
      </CardContent>

      <CardFooter className="border-t pt-2.5 pb-3 flex-col gap-1.5">
        <Button
          size="xs"
          variant={item.available ? "secondary" : "destructive"}
          className="w-full"
          onClick={() => onToggleAvailability(item.id)}
        >
          {item.available ? (
            <>
              <Eye /> Available
            </>
          ) : (
            <>
              <EyeOff /> 86&apos;d
            </>
          )}
        </Button>
        <Button size="xs" variant="ghost" className="w-full">
          Strategy
          <ChevronRight />
        </Button>
      </CardFooter>
    </Card>
  )
}

export default function ManagerMenuPage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>(allMenuItems)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState("All Items")

  useEffect(() => {
    return MenuService.subscribe(setMenuItems)
  }, [])

  const handleToggleAvailability = (id: string) => {
    const toggled = MenuService.toggleAvailability(id)
    if (toggled) {
      toast.info(`${toggled.name} marked ${toggled.available ? "Available" : "86'd (Unavailable)"}`)
    }
  }

  const filtered = menuItems.filter((item) => {
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

  const availableCount = menuItems.filter((i) => i.available).length
  const unavailableCount = menuItems.filter((i) => !i.available).length
  const popularCount = menuItems.filter((i) => i.popular).length

  return (
    <TooltipProvider>
      <div className="min-h-screen pb-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-5 pt-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
                <UtensilsCrossed className="size-5" />
              </div>
              <div>
                <h1 className="text-lg font-semibold leading-none text-foreground">
                  Menu Management
                </h1>
                <p className="text-xs font-medium uppercase text-muted-foreground mt-1">
                  Dish Orchestration &amp; Price Strategy
                </p>
              </div>
            </div>

            <Button className="gap-2 self-start sm:self-auto">
              <Plus className="size-4" />
              Add Item
            </Button>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {[
              { label: "Available", value: availableCount, tone: "bg-success/10 text-success", icon: Eye },
              { label: "Unavailable", value: unavailableCount, tone: "bg-destructive/10 text-destructive", icon: EyeOff },
              { label: "Popular", value: popularCount, tone: "bg-warning/10 text-warning", icon: TrendingUp },
            ].map((s) => (
              <Card key={s.label} size="sm">
                <CardHeader>
                  <CardDescription className="text-xs uppercase">{s.label}</CardDescription>
                  <CardAction>
                    <div className={`flex size-8 items-center justify-center rounded-lg ${s.tone}`}>
                      <s.icon className="size-4" />
                    </div>
                  </CardAction>
                </CardHeader>
                <CardContent>
                  <CardTitle className="text-2xl font-semibold tabular-nums">{s.value}</CardTitle>
                </CardContent>
              </Card>
            ))}
          </div>

          <Tabs value={activeCategory} onValueChange={setActiveCategory}>
            <TabsList className="flex-wrap h-auto">
              {CATEGORIES.map((cat) => {
                const isActive = activeCategory === cat
                return (
                  <TabsTrigger
                    key={cat}
                    value={cat}
                    className="relative data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                  >
                    {isActive && (
                      <motion.span
                        layoutId="manager-menu-cat"
                        transition={SPRING_SNAPPY}
                        aria-hidden="true"
                        className="absolute inset-0 rounded-md bg-background shadow-sm"
                      />
                    )}
                    <span className="relative z-10">{cat}</span>
                  </TabsTrigger>
                )
              })}
            </TabsList>
          </Tabs>

          <div className="flex gap-2.5">
            <InputGroup className="flex-1 bg-card">
              <InputGroupAddon>
                <Search />
              </InputGroupAddon>
              <InputGroupInput
                placeholder="Search dishes…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </InputGroup>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" className="gap-2 shrink-0">
                  <Filter className="size-4" />
                  <span className="hidden sm:inline">Filter</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Filter items</TooltipContent>
            </Tooltip>
          </div>

          <p className="text-xs font-medium uppercase text-muted-foreground">
            {filtered.length} of {menuItems.length} items
          </p>

          {filtered.length === 0 ? (
            <Empty className="py-16 border">
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <Package />
                </EmptyMedia>
                <EmptyTitle>No items found</EmptyTitle>
                <EmptyDescription>Try adjusting your search or filter.</EmptyDescription>
              </EmptyHeader>
            </Empty>
          ) : (
            <div className="grid gap-4 grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              <AnimatePresence mode="popLayout" initial={false}>
                {filtered.map((item) => (
                  <motion.div
                    key={item.id}
                    layout="position"
                    initial={{ opacity: 0, scale: 0.97 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={SPRING_SNAPPY}
                  >
                    <MenuCard
                      item={item}
                      onToggleAvailability={handleToggleAvailability}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            {INSIGHTS.map((insight) => (
              <Card key={insight.title} size="sm" className={insight.tone}>
                <CardHeader>
                  <div className="flex items-start gap-3">
                    <div
                      className={`flex size-10 items-center justify-center rounded-lg shrink-0 ${insight.iconTone}`}
                    >
                      <insight.icon className="size-5" />
                    </div>
                    <div className="space-y-1">
                      <CardTitle className="text-sm">{insight.title}</CardTitle>
                      <CardDescription className="text-xs">{insight.desc}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </TooltipProvider>
  )
}
