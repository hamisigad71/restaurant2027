"use client"
import { useState, useEffect } from "react"
import {
  ClockIcon,
  FireIcon,
  CheckCircleIcon,
  ArrowRightIcon,
} from "@heroicons/react/24/outline"
import { BoltIcon as BoltIconSolid } from "@heroicons/react/24/solid"
import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import type { KitchenOrder, OrderStatus } from "../lib/types"

const DISH_IMAGES: Record<string, string> = {
  "Grilled Sea Bass": "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=400&q=80",
  "Filet Mignon": "https://images.unsplash.com/photo-1558030006-450675393462?w=400&q=80",
  "Lobster Thermidor": "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&q=80",
  "Beef Wellington": "https://images.unsplash.com/photo-1546964124-0cce460f38ef?w=400&q=80",
  "Caesar Salad": "https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400&q=80",
  "Pasta Carbonara": "https://images.unsplash.com/photo-1612874742237-6526221588e3?w=400&q=80",
  "Margherita Pizza": "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80",
  "Tiramisu": "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400&q=80",
  "Crème Brûlée": "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&q=80",
  "Cappuccino": "https://images.unsplash.com/photo-1534778101976-62847782c213?w=400&q=80",
  "Croissant": "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400&q=80",
  "Chocolate Fondant": "https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=400&q=80",
}
const FALLBACK = "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&q=80"

function getDishImage(name: string) {
  const EXTENDED: Record<string, string> = {
    ...DISH_IMAGES,
    "Chicken Skewers": "https://i.pinimg.com/736x/a4/1b/72/a41b7293c9ca093447acf115b8f76eae.jpg",
    "Burrata": "https://i.pinimg.com/736x/78/47/b4/7847b46b356ae578693105051bfaf4d1.jpg",
    "Calamari": "https://i.pinimg.com/1200x/82/18/35/82183552a9adad429d834f4cee48a99c.jpg",
    "Samosa": "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&q=80",
    "Nyama Choma": "https://images.unsplash.com/photo-1544025162-d76694265947?w=400",
    "Pilau": "https://i.pinimg.com/1200x/1c/36/77/1c3677d96b0f166ba6498c0c94e5f0c2.jpg",
    "Wings": "https://images.unsplash.com/photo-1527477396000-e27163b481c2?w=400",
  }
  for (const [k, v] of Object.entries(EXTENDED)) {
    if (name.toLowerCase().includes(k.toLowerCase())) return v
  }
  return FALLBACK
}

const STATUS_CONFIG = {
  pending: {
    label: "New Order",
    Icon: ClockIcon,
    badgeClass: "bg-secondary text-secondary-foreground border-border",
    nextLabel: "Start Cooking",
    nextStatus: "cooking" as OrderStatus,
    btnVariant: "default" as const,
  },
  cooking: {
    label: "Preparing",
    Icon: FireIcon,
    badgeClass: "bg-primary/10 text-primary border-primary/20",
    nextLabel: "Mark Ready",
    nextStatus: "ready" as OrderStatus,
    btnVariant: "default" as const,
  },
  ready: {
    label: "Ready",
    Icon: CheckCircleIcon,
    badgeClass: "bg-success/10 text-success border-success/20",
    nextLabel: "Mark Served",
    nextStatus: "served" as OrderStatus,
    btnVariant: "outline" as const,
  },
} as const

function useElapsed(createdAt: string) {
  const [elapsed, setElapsed] = useState(0)
  useEffect(() => {
    const update = () =>
      setElapsed(Math.floor((Date.now() - new Date(createdAt).getTime()) / 1000))
    update()
    const id = setInterval(update, 1000)
    return () => clearInterval(id)
  }, [createdAt])
  const m = Math.floor(elapsed / 60)
  const s = elapsed % 60
  return { display: `${m}:${String(s).padStart(2, "0")}`, minutes: m, overdue: m >= 15 }
}

interface OrderCardProps {
  order: KitchenOrder
  onUpdateStatus: (id: string, s: OrderStatus) => void
  listMode?: boolean
}

export function OrderCard({ order, onUpdateStatus, listMode }: OrderCardProps) {
  const cfg = STATUS_CONFIG[order.status as keyof typeof STATUS_CONFIG]
  const timer = useElapsed(order.createdAt)
  const primary = order.items.find((i) => i.category === "main") ?? order.items[0]
  const totalQty = order.items.reduce((s, i) => s + i.quantity, 0)

  if (!cfg) return null

  if (listMode) {
    return (
      <Card
        size="sm"
        className="group transition-shadow duration-150 ease-(--ease-out) hover:shadow-md"
      >
        <CardContent className="flex items-center gap-4">
          <div className="size-12 rounded-lg overflow-hidden shrink-0 border">
            <img
              src={primary.image || getDishImage(primary.name)}
              className="w-full h-full object-cover"
              alt={primary.name}
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <div className="font-semibold text-sm">T{order.tableNumber}</div>
              <span className="text-xs text-muted-foreground font-mono">{order.id}</span>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="outline" className={cn("text-[10px]", cfg.badgeClass)}>
                {cfg.label}
              </Badge>
              <span className="text-xs text-muted-foreground">{totalQty} items</span>
            </div>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <Badge variant="secondary" className="font-mono gap-1">
              <ClockIcon className="size-3" />
              {timer.display}
            </Badge>
            <Button
              size="sm"
              variant={cfg.btnVariant}
              onClick={() => onUpdateStatus(order.id, cfg.nextStatus)}
            >
              {cfg.nextLabel}
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card
      size="sm"
      className="group relative gap-0 py-0 overflow-hidden transition-[border-color,box-shadow] duration-150 ease-(--ease-out) hover:shadow-md h-full"
    >
      {order.priority === "urgent" && (
        <Badge
          variant="destructive"
          className="absolute top-3 right-3 z-20 gap-1 uppercase text-[10px]"
        >
          <BoltIconSolid className="size-2.5" /> Urgent
        </Badge>
      )}

      <div className="relative h-40 overflow-hidden bg-muted">
        <img
          src={primary.image || getDishImage(primary.name)}
          alt={primary.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent" />
        <div className="absolute bottom-3 left-3">
          <div className="inline-flex items-center justify-center px-3 py-1 rounded-lg bg-primary text-primary-foreground font-bold text-sm shadow-sm">
            T{order.tableNumber}
          </div>
        </div>
      </div>

      <CardHeader className="pt-4 pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <Badge variant="outline" className={cn("text-[10px] uppercase", cfg.badgeClass)}>
            {cfg.label}
          </Badge>
        </CardTitle>
        <CardAction>
          <span className="inline-flex items-center gap-1 text-xs font-mono text-muted-foreground">
            <ClockIcon className="size-3.5" />
            {timer.display}
          </span>
        </CardAction>
      </CardHeader>

      <Separator />

      <CardContent className="py-3 space-y-2 flex-1">
        {order.items.slice(0, 3).map((item) => (
          <div key={item.id} className="flex items-center justify-between gap-2 text-sm">
            <span className="font-medium truncate text-foreground">{item.name}</span>
            <Badge variant="secondary" className="text-[10px] shrink-0">
              ×{item.quantity}
            </Badge>
          </div>
        ))}
        {order.items.length > 3 && (
          <p className="text-[11px] text-center font-medium text-muted-foreground">
            +{order.items.length - 3} more items
          </p>
        )}
      </CardContent>

      <CardFooter className="pb-4 pt-1">
        <Button
          variant={cfg.btnVariant}
          size="sm"
          className="w-full justify-between"
          onClick={() => onUpdateStatus(order.id, cfg.nextStatus)}
        >
          <span className="inline-flex items-center gap-2">
            <cfg.Icon className="size-4" />
            {cfg.nextLabel}
          </span>
          <ArrowRightIcon className="size-3.5" />
        </Button>
      </CardFooter>
    </Card>
  )
}
