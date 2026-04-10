"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  Tooltip, TooltipContent, TooltipProvider, TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  Clock, CheckCircle2, Flame, Timer, ChefHat,
  Utensils, Bell, AlertTriangle,
} from "lucide-react"
import { OrderService, LiveOrder } from "@/lib/order-service"
import { cn } from "@/lib/utils"

// ─── Dish images ──────────────────────────────────────────────────────────────
const DISH_IMAGES: Record<string,string> = {
  "Zucchini Chips":    "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400&q=80",
  "Grilled Sea Bass":  "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=400&q=80",
  "Steak au Poivre":   "https://images.unsplash.com/photo-1558030006-450675393462?w=400&q=80",
  "Chocolate Fondant": "https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=400&q=80",
}
const FALLBACK = "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&q=80"

function getDishImage(name: string) {
  const DISH_IMAGES_EXTENDED: Record<string,string> = {
    ...DISH_IMAGES,
    "Chicken Skewers": "https://i.pinimg.com/736x/a4/1b/72/a41b7293c9ca093447acf115b8f76eae.jpg",
    "Burrata":         "https://i.pinimg.com/736x/78/47/b4/7847b46b356ae578693105051bfaf4d1.jpg",
    "Calamari":        "https://i.pinimg.com/1200x/82/18/35/82183552a9adad429d834f4cee48a99c.jpg",
    "Samosa":          "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&q=80",
    "Carpaccio":       "https://i.pinimg.com/1200x/41/74/df/4174df3d7cea7280af57bcd0e37653d7.jpg",
    "Nyama Choma":     "https://images.unsplash.com/photo-1544025162-d76694265947?w=400",
    "Pilau":           "https://i.pinimg.com/1200x/1c/36/77/1c3677d96b0f166ba6498c0c94e5f0c2.jpg",
    "Chapati":         "https://i.pinimg.com/736x/a3/f6/77/a3f677fce631b6c472f9e8509d30032a.jpg",
    "Wings":           "https://images.unsplash.com/photo-1527477396000-e27163b481c2?w=400",
  }
  for (const [k, v] of Object.entries(DISH_IMAGES_EXTENDED)) {
    if (name.toLowerCase().includes(k.toLowerCase())) return v
  }
  return FALLBACK
}

// ─── Elapsed hook ─────────────────────────────────────────────────────────────
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

// ─── Order card ───────────────────────────────────────────────────────────────
function OrderCard({ order, onServe }: { order: LiveOrder; onServe:(id:string)=>void }) {
  const { minutes, overdue } = useElapsed(order.createdAt)
  const isReady = order.status === "ready"
  const primaryDish = order.items[0]?.name || "Order"

  const accent      = isReady ? "oklch(0.62 0.16 150)" : "oklch(0.45 0.12 285)"
  const badgeBg     = isReady ? "oklch(0.62 0.16 150 / 0.1)" : "oklch(0.45 0.12 285 / 0.1)"
  const badgeText   = isReady ? "oklch(0.42 0.14 150)"        : "oklch(0.38 0.12 285)"
  const badgeBorder = isReady ? "oklch(0.62 0.16 150 / 0.25)" : "oklch(0.45 0.12 285 / 0.25)"

  return (
    <Card
      className="relative overflow-hidden border transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl group rounded-3xl p-0"
      style={{
        background:"rgba(255,255,255,0.9)",
        backdropFilter:"blur(16px)",
        borderColor:`${accent}28`,
        boxShadow:"0 2px 12px rgba(13,3,27,0.07)",
      }}
    >
      {/* Top accent strip */}
      <div className="absolute top-0 inset-x-0 h-[3px] rounded-t-3xl" style={{ background: accent }} />

      {/* Hero image */}
      <div className="relative h-40 overflow-hidden mx-3 mt-4 rounded-2xl">
        <img
          src={order.items[0]?.image || getDishImage(primaryDish)}
          alt={primaryDish}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

        {/* Table pill */}
        <div className="absolute bottom-3 left-3">
          <div
            className="px-3 py-1 rounded-xl text-white font-bold text-sm"
            style={{ background: accent, boxShadow:`0 2px 10px ${accent}55` }}
          >
            T{order.tableId.padStart(2, '0')}
          </div>
        </div>

        {/* Order ID */}
        <div className="absolute bottom-3 right-3">
          <span
            className="text-[9px] font-mono text-white/75 px-2 py-0.5 rounded-lg"
            style={{ background:"rgba(0,0,0,0.35)", backdropFilter:"blur(6px)" }}
          >
            {order.id}
          </span>
        </div>
      </div>

      <CardContent className="px-4 pt-3.5 pb-4 space-y-3.5">

        {/* Status + timer row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              className="flex items-center justify-center w-7 h-7 rounded-lg"
              style={{ background: badgeBg }}
            >
              {isReady
                ? <CheckCircle2 className="h-3.5 w-3.5" style={{ color: badgeText }} />
                : <Flame       className="h-3.5 w-3.5" style={{ color: badgeText }} />
              }
            </div>
            <span
              className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border"
              style={{ background:badgeBg, color:badgeText, borderColor:badgeBorder }}
            >
              {isReady ? "Service Ready" : "In Preparation"}
            </span>
          </div>

          {/* Timer */}
          <div
            className="flex items-center gap-1 text-[11px] font-mono font-semibold px-2.5 py-1 rounded-lg"
            style={{
              background: overdue ? "oklch(0.65 0.18 25 / 0.1)" : "rgba(0,0,0,0.04)",
              color: overdue ? "oklch(0.55 0.18 25)" : "#736C83",
            }}
          >
            {overdue && <AlertTriangle className="h-3 w-3" />}
            <Timer className="h-3 w-3" />
            {minutes}m
          </div>
        </div>

        <Separator style={{ background:"rgba(0,0,0,0.06)" }} />

        {/* Item list */}
        <div className="space-y-2">
          {order.items.map((item, i) => (
            <div key={i} className="flex items-center gap-2.5">
              <div
                className="w-10 h-10 rounded-xl overflow-hidden shrink-0 border"
                style={{ borderColor:"rgba(0,0,0,0.06)" }}
              >
                <img
                  src={item.image || getDishImage(item.name)}
                  alt={item.name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[12px] font-semibold truncate" style={{ color:"#0D031B" }}>{item.name}</p>
                <p className="text-[10px] font-medium uppercase tracking-wider mt-0.5" style={{ color:"#AEA6BF" }}>
                  {item.quantity} × {item.category || "item"}
                </p>
              </div>
              <div
                className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                style={{ background: isReady ? "oklch(0.62 0.16 150 / 0.15)" : "oklch(0.45 0.12 285 / 0.1)" }}
              >
                {isReady
                  ? <CheckCircle2 className="h-3 w-3" style={{ color:"oklch(0.42 0.14 150)" }} />
                  : <Flame        className="h-3 w-3" style={{ color:"oklch(0.45 0.12 285)" }} />
                }
              </div>
            </div>
          ))}
        </div>

        {/* CTA — only for ready orders */}
        {isReady && (
          <button
            onClick={() => onServe(order.id)}
            className="w-full flex items-center gap-2.5 px-4 py-3.5 rounded-2xl font-bold text-[11px] tracking-widest uppercase text-white transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] relative overflow-hidden group/btn"
            style={{
              background:"oklch(0.62 0.16 150)",
              boxShadow:"0 4px 16px oklch(0.62 0.16 150 / 0.35)",
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent opacity-40 group-hover/btn:opacity-60 transition-opacity" />
            <CheckCircle2 className="h-4 w-4 relative z-10" />
            <span className="relative z-10 flex-1 text-left">Mark as Served</span>
            <Bell className="h-4 w-4 relative z-10" />
          </button>
        )}

        {/* Cooking state — progress indicator */}
        {!isReady && (
          <div
            className="flex items-center gap-2 px-3 py-2.5 rounded-xl"
            style={{ background:"oklch(0.45 0.12 285 / 0.06)", border:"1px solid oklch(0.45 0.12 285 / 0.12)" }}
          >
            <ChefHat className="h-4 w-4 shrink-0" style={{ color:"oklch(0.45 0.12 285)" }} />
            <span className="text-[11px] font-semibold" style={{ color:"oklch(0.38 0.12 285)" }}>
              Kitchen is preparing this order
            </span>
            <span className="flex gap-0.5 ml-auto">
              {[0,1,2].map(i => (
                <span
                  key={i}
                  className="w-1 h-1 rounded-full"
                  style={{
                    background:"oklch(0.45 0.12 285)",
                    animation:`fade-dots 1.4s ease-in-out ${i*0.2}s infinite`,
                  }}
                />
              ))}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function OrderStatusPage() {
  const [orders, setOrders] = useState<LiveOrder[]>([])
  const [activeFilter, setActiveFilter] = useState<"all"|"cooking"|"ready">("all")

  useEffect(() => {
    const unsubscribe = OrderService.subscribe(allOrders => {
      // For Waiter Status, we only show non-served orders
      setOrders(allOrders.filter(o => o.status !== "served" && o.status !== "cancelled"))
    })
    return unsubscribe
  }, [])

  const handleServe = (id: string) => {
    OrderService.updateOrderStatus(id, "served")
  }

  const filtered = activeFilter === "all" 
    ? orders 
    : orders.filter(o => {
        if (activeFilter === "cooking") return o.status === "pending" || o.status === "cooking"
        return o.status === "ready"
      })

  const cookingCount = orders.filter(o => o.status === "pending" || o.status === "cooking").length
  const readyCount   = orders.filter(o => o.status === "ready").length

  return (
    <TooltipProvider>
      <style>{`
        @keyframes fade-dots { 0%,100%{opacity:.3} 50%{opacity:1} }
      `}</style>

      <div className="flex flex-col min-h-screen" style={{ background:"#F0EBF8" }}>

        {/* ── Sub-header ─────────────────────────────────────────────── */}
        <div
          className="px-5 py-3.5 border-b flex items-center justify-between gap-4"
          style={{ background:"rgba(255,255,255,0.75)", backdropFilter:"blur(12px)", borderColor:"oklch(0.45 0.12 285 / 0.1)" }}
        >
          {/* Title */}
          <div className="flex items-center gap-3">
            <div
              className="flex items-center justify-center w-9 h-9 rounded-xl"
              style={{ background:"oklch(0.45 0.12 285 / 0.1)" }}
            >
              <Utensils className="h-4 w-4" style={{ color:"oklch(0.45 0.12 285)" }} />
            </div>
            <div>
              <p className="text-[15px] font-bold tracking-tight" style={{ color:"#0D031B" }}>Service Tracker</p>
              <p className="text-[10px] font-medium uppercase tracking-[0.15em]" style={{ color:"#9A94AA" }}>
                Real-time preparation status
              </p>
            </div>
          </div>

          {/* Filter pills */}
          <div className="flex items-center gap-1.5">
            {(["all","cooking","ready"] as const).map(f => {
              const count = f === "all" ? orders.length : f === "cooking" ? cookingCount : readyCount
              const accent = f === "ready" ? "oklch(0.62 0.16 150)" : f === "cooking" ? "oklch(0.45 0.12 285)" : "#736C83"
              const active = activeFilter === f
              return (
                <button
                  key={f}
                  onClick={() => setActiveFilter(f)}
                  className="flex items-center gap-1.5 h-8 px-3 rounded-xl text-[11px] font-bold uppercase tracking-wider transition-all duration-200 border"
                  style={
                    active
                      ? { background:"oklch(0.45 0.12 285)", color:"white", borderColor:"transparent", boxShadow:"0 2px 10px oklch(0.45 0.12 285 / 0.3)" }
                      : { background:"#F5F2FB", color:"#736C83", borderColor:"oklch(0.45 0.12 285 / 0.12)" }
                  }
                >
                  {f !== "all" && (
                    <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: active ? "rgba(255,255,255,0.6)" : accent }} />
                  )}
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                  {count > 0 && (
                    <span
                      className="min-w-[16px] h-4 rounded-full flex items-center justify-center text-[9px] font-bold px-1"
                      style={
                        active
                          ? { background:"rgba(255,255,255,0.22)", color:"white" }
                          : { background:"oklch(0.45 0.12 285 / 0.1)", color:"oklch(0.45 0.12 285)" }
                      }
                    >
                      {count}
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </div>

        {/* ── Grid ───────────────────────────────────────────────────── */}
        <div className="flex-1 p-5">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center border"
                style={{ background:"rgba(255,255,255,0.8)", borderColor:"oklch(0.45 0.12 285 / 0.15)" }}
              >
                <CheckCircle2 className="h-7 w-7" style={{ color:"#AEA6BF" }} />
              </div>
              <div className="text-center">
                <p className="font-bold text-lg" style={{ color:"#0D031B" }}>All served!</p>
                <p className="text-sm mt-1" style={{ color:"#736C83" }}>No active orders right now.</p>
              </div>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filtered.map(order => (
                <OrderCard key={order.id} order={order} onServe={handleServe} />
              ))}
            </div>
          )}
        </div>
      </div>
    </TooltipProvider>
  )
}