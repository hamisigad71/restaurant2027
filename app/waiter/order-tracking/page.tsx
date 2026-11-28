"use client"

import { useState, useEffect } from "react"
import { AnimatePresence, motion } from "motion/react"
import { SPRING_SNAPPY } from "@/lib/motion"
import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { TooltipProvider } from "@/components/ui/tooltip"
import {
  ClockIcon,
  CheckCircleIcon,
  FireIcon,
  BellIcon,
  ExclamationTriangleIcon,
  ArrowTrendingUpIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline"
import {
  CheckCircleIcon as CheckCircleIconSolid,
  FireIcon as FireIconSolid,
} from "@heroicons/react/24/solid"
import { OrderService, LiveOrder } from "@/lib/order-service"
import { cn } from "@/lib/utils"

const DISH_IMAGES: Record<string, string> = {
  "Zucchini Chips": "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400&q=80",
  "Grilled Sea Bass": "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=400&q=80",
  "Steak au Poivre": "https://images.unsplash.com/photo-1558030006-450675393462?w=400&q=80",
  "Chocolate Fondant": "https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=400&q=80",
}
const FALLBACK = "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&q=80"

function getDishImage(name: string) {
  const DISH_IMAGES_EXTENDED: Record<string, string> = {
    ...DISH_IMAGES,
    "Chicken Skewers": "https://i.pinimg.com/736x/a4/1b/72/a41b7293c9ca093447acf115b8f76eae.jpg",
    "Burrata": "https://i.pinimg.com/736x/78/47/b4/7847b46b356ae578693105051bfaf4d1.jpg",
    "Calamari": "https://i.pinimg.com/1200x/82/18/35/82183552a9adad429d834f4cee48a99c.jpg",
    "Samosa": "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&q=80",
    "Carpaccio": "https://i.pinimg.com/1200x/41/74/df/4174df3d7cea7280af57bcd0e37653d7.jpg",
    "Nyama Choma": "https://images.unsplash.com/photo-1544025162-d76694265947?w=400",
    "Pilau": "https://i.pinimg.com/1200x/1c/36/77/1c3677d96b0f166ba6498c0c94e5f0c2.jpg",
    "Chapati": "https://i.pinimg.com/736x/a3/f6/77/a3f677fce631b6c472f9e8509d30032a.jpg",
    "Wings": "https://images.unsplash.com/photo-1527477396000-e27163b481c2?w=400",
  }
  for (const [k, v] of Object.entries(DISH_IMAGES_EXTENDED)) {
    if (name.toLowerCase().includes(k.toLowerCase())) return v
  }
  return FALLBACK
}

function useElapsed(initialDate: string) {
  const [minutes, setMinutes] = useState(0)

  useEffect(() => {
    const calc = () => {
      const diff = Math.floor((new Date().getTime() - new Date(initialDate).getTime()) / 60000)
      setMinutes(diff)
    }
    calc()
    const id = setInterval(calc, 60000)
    return () => clearInterval(id)
  }, [initialDate])

  return { minutes, overdue: minutes >= 20 }
}

function OrderCard({ order, onServe }: { order: LiveOrder; onServe: (id: string) => void }) {
  const { minutes, overdue } = useElapsed(order.createdAt)
  const isReady = order.status === "ready"
  const primaryDish = order.items[0]?.name || "Order"

  return (
    <Card size="sm" className="group gap-0 py-0 overflow-hidden transition-shadow hover:shadow-md">
      <div className="relative h-44 overflow-hidden bg-muted">
        <img
          src={order.items[0]?.image || getDishImage(primaryDish)}
          alt={primaryDish}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        <div className="absolute bottom-3 left-3">
          <Badge className="gap-1.5 text-sm font-bold">
            <UserGroupIcon className="size-3.5" />
            T{order.tableId.padStart(2, "0")}
          </Badge>
        </div>

        <Badge
          variant="secondary"
          className="absolute bottom-3 right-3 font-mono text-[10px] bg-black/60 text-white border-0"
        >
          {order.id}
        </Badge>

        <Badge
          variant={overdue ? "destructive" : "secondary"}
          className={cn(
            "absolute top-3 right-3 font-mono text-xs gap-1",
            !overdue && "bg-black/60 text-white border-0",
          )}
        >
          {overdue && <ExclamationTriangleIcon className="size-3" />}
          <ClockIcon className="size-3" />
          {minutes}m
        </Badge>
      </div>

      <CardHeader className="pt-4 pb-2">
        <Badge
          variant="outline"
          className={cn(
            "uppercase text-[10px]",
            isReady
              ? "bg-success/10 text-success border-success/30"
              : "bg-primary/10 text-primary border-primary/20",
          )}
        >
          {isReady ? (
            <>
              <CheckCircleIcon />
              Service Ready
            </>
          ) : (
            <>
              <FireIcon />
              In Preparation
            </>
          )}
        </Badge>
        <CardAction>
          <div
            className={cn(
              "flex size-8 items-center justify-center rounded-lg",
              isReady ? "bg-success/10 text-success" : "bg-primary/10 text-primary",
            )}
          >
            {isReady ? <CheckCircleIcon className="size-4" /> : <FireIcon className="size-4" />}
          </div>
        </CardAction>
      </CardHeader>

      <Separator />

      <CardContent className="py-3 space-y-2.5 flex-1">
        {order.items.map((item, i) => (
          <div key={i} className="flex items-center gap-3">
            <div className="size-10 rounded-lg overflow-hidden shrink-0 border bg-muted">
              <img
                src={item.image || getDishImage(item.name)}
                alt={item.name}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate text-foreground">{item.name}</p>
              <p className="text-xs text-muted-foreground">
                {item.quantity}× {item.category || "item"}
              </p>
            </div>
          </div>
        ))}
      </CardContent>

      <CardFooter className="pb-4 pt-1">
        {isReady ? (
          <Button onClick={() => onServe(order.id)} className="w-full gap-2">
            <CheckCircleIconSolid className="size-4" />
            Mark as Served
            <BellIcon className="size-4" />
          </Button>
        ) : (
          <div className="w-full flex items-center gap-2 px-3 py-2 rounded-lg border bg-muted/40 text-xs font-medium text-primary">
            <FireIconSolid className="size-4 shrink-0" />
            <span>Kitchen is preparing</span>
          </div>
        )}
      </CardFooter>
    </Card>
  )
}

export default function OrderStatusPage() {
  const [orders, setOrders] = useState<LiveOrder[]>([])
  const [activeFilter, setActiveFilter] = useState<"all" | "cooking" | "ready">("all")

  useEffect(() => {
    const unsubscribe = OrderService.subscribe((allOrders) => {
      setOrders(allOrders.filter((o) => o.status !== "served" && o.status !== "cancelled"))
    })
    return unsubscribe
  }, [])

  const handleServe = (id: string) => {
    OrderService.updateOrderStatus(id, "served")
  }

  const filtered =
    activeFilter === "all"
      ? orders
      : orders.filter((o) => {
          if (activeFilter === "cooking") return o.status === "pending" || o.status === "cooking"
          return o.status === "ready"
        })

  const cookingCount = orders.filter((o) => o.status === "pending" || o.status === "cooking").length
  const readyCount = orders.filter((o) => o.status === "ready").length

  return (
    <TooltipProvider>
      <div className="flex flex-col min-h-screen bg-background">
        <div className="px-4 sm:px-6 py-4 border-b bg-card/90 backdrop-blur-md sticky top-0 z-10 space-y-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex size-11 items-center justify-center rounded-xl bg-primary p-2 shadow-sm">
                <img
                  src="/order-tracking-nav.png"
                  className="w-full h-full brightness-0 invert object-contain"
                  alt="Order Tracking"
                />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-semibold text-foreground leading-none">
                  Service Tracker
                </h1>
                <p className="text-xs font-medium uppercase text-muted-foreground mt-1">
                  Real-time preparation status
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Badge variant="outline" className="gap-1.5">
                <ArrowTrendingUpIcon className="size-3.5 text-primary" />
                {orders.length} Active
              </Badge>
              <Badge variant="outline" className="gap-1.5 border-success/30 bg-success/10 text-success">
                <CheckCircleIcon className="size-3.5" />
                {readyCount} Ready
              </Badge>
            </div>
          </div>

          <Tabs
            value={activeFilter}
            onValueChange={(v) => setActiveFilter(v as "all" | "cooking" | "ready")}
          >
            <TabsList>
              {[
                { value: "all", label: "All", count: orders.length },
                { value: "cooking", label: "Cooking", count: cookingCount },
                { value: "ready", label: "Ready", count: readyCount },
              ].map((t) => {
                const isActive = activeFilter === t.value
                return (
                  <TabsTrigger
                    key={t.value}
                    value={t.value}
                    className="relative gap-1.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                  >
                    {isActive && (
                      <motion.span
                        layoutId="waiter-track-filter"
                        transition={SPRING_SNAPPY}
                        aria-hidden="true"
                        className="absolute inset-0 rounded-md bg-background shadow-sm"
                      />
                    )}
                    <span className="relative z-10">{t.label}</span>
                    <Badge variant="secondary" className="relative z-10">
                      {t.count}
                    </Badge>
                  </TabsTrigger>
                )
              })}
            </TabsList>
          </Tabs>
        </div>

        <div className="flex-1 p-4 sm:p-6 lg:p-8 pb-24">
          {filtered.length === 0 ? (
            <Empty className="py-20 border">
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <CheckCircleIcon />
                </EmptyMedia>
                <EmptyTitle>All Caught Up!</EmptyTitle>
                <EmptyDescription>No active orders right now.</EmptyDescription>
              </EmptyHeader>
            </Empty>
          ) : (
            <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              <AnimatePresence mode="popLayout" initial={false}>
                {filtered.map((order) => (
                  <motion.div
                    key={order.id}
                    layout="position"
                    initial={{ opacity: 0, scale: 0.97 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={SPRING_SNAPPY}
                  >
                    <OrderCard order={order} onServe={handleServe} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </TooltipProvider>
  )
}
