"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Tooltip, TooltipContent, TooltipProvider, TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  ClockIcon,
  CheckCircleIcon,
  FireIcon,
  BellIcon,
  ExclamationTriangleIcon,
  ArrowTrendingUpIcon,
  BoltIcon,
  UserGroupIcon,
  ArrowUpRightIcon,
  CakeIcon,
} from "@heroicons/react/24/outline"
import {
  CheckCircleIcon as CheckCircleIconSolid,
  FireIcon as FireIconSolid,
  ClockIcon as ClockIconSolid,
} from "@heroicons/react/24/solid"
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

// ─── Enhanced Order Card ──────────────────────────────────────────────────────
function OrderCard({ order, onServe }: { order: LiveOrder; onServe:(id:string)=>void }) {
  const { minutes, overdue } = useElapsed(order.createdAt)
  const isReady = order.status === "ready"
  const primaryDish = order.items[0]?.name || "Order"

  return (
    <Card
      className="group relative overflow-hidden border-0 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl rounded-2xl"
      style={{
        background: "white",
        boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
      }}
    >
      {/* Status indicator bar with gradient */}
      <div 
        className="h-1.5 w-full"
        style={{
          background: isReady
            ? "linear-gradient(90deg, oklch(0.65 0.18 150) 0%, oklch(0.70 0.20 160) 100%)"
            : "linear-gradient(90deg, oklch(0.42 0.14 285) 0%, oklch(0.55 0.18 270) 100%)"
        }}
      />

      {/* Enhanced Hero Image */}
      <div className="relative h-44 sm:h-48 overflow-hidden mx-4 mt-4 rounded-xl">
        <img
          src={order.items[0]?.image || getDishImage(primaryDish)}
          alt={primaryDish}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          loading="lazy"
        />
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        {/* Animated glow on hover */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500 bg-gradient-to-br from-white via-transparent to-transparent" />

        {/* Table badge - Enhanced */}
        <div className="absolute bottom-3 left-3">
          <div
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-white font-bold text-sm shadow-xl"
            style={{
              background: isReady
                ? "linear-gradient(135deg, oklch(0.65 0.18 150) 0%, oklch(0.70 0.20 160) 100%)"
                : "linear-gradient(135deg, oklch(0.42 0.14 285) 0%, oklch(0.38 0.16 275) 100%)",
              boxShadow: isReady
                ? "0 4px 16px oklch(0.65 0.18 150 / 0.4)"
                : "0 4px 16px oklch(0.42 0.14 285 / 0.4)",
            }}
          >
            <UserGroupIcon className="h-3.5 w-3.5" strokeWidth={2.5} />
            T{order.tableId.padStart(2, '0')}
          </div>
        </div>

        {/* Order ID - Enhanced */}
        <div className="absolute bottom-3 right-3">
          <span
            className="text-[9px] font-mono font-bold text-white/90 px-2.5 py-1 rounded-lg backdrop-blur-md border border-white/20"
            style={{ background: "rgba(0,0,0,0.4)" }}
          >
            {order.id}
          </span>
        </div>

        {/* Timer badge - top right */}
        <div className="absolute top-3 right-3">
          <div
            className={cn(
              "flex items-center gap-1 text-[11px] font-mono font-bold px-2.5 py-1.5 rounded-xl backdrop-blur-md border",
              overdue ? "bg-red-500/90 text-white border-red-300/30" : "bg-black/40 text-white/90 border-white/20"
            )}
          >
            {overdue && <ExclamationTriangleIcon className="h-3 w-3" strokeWidth={2.5} />}
            <ClockIcon className="h-3 w-3" strokeWidth={2.5} />
            {minutes}m
          </div>
        </div>
      </div>

      <CardContent className="px-4 sm:px-5 pt-4 pb-5 space-y-4">

        {/* Status Row - Enhanced */}
        <div className="flex items-center justify-between">
          <Badge
            className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-bold uppercase border-2 rounded-xl"
            style={
              isReady
                ? {
                    background: "oklch(0.65 0.18 150 / 0.08)",
                    color: "oklch(0.45 0.18 150)",
                    borderColor: "oklch(0.65 0.18 150 / 0.25)",
                  }
                : {
                    background: "oklch(0.42 0.14 285 / 0.08)",
                    color: "oklch(0.42 0.14 285)",
                    borderColor: "oklch(0.42 0.14 285 / 0.25)",
                  }
            }
          >
            {isReady ? (
              <>
                <CheckCircleIcon className="h-3.5 w-3.5" strokeWidth={2.5} />
                Service Ready
              </>
            ) : (
              <>
                <FireIcon className="h-3.5 w-3.5" strokeWidth={2.5} />
                In Preparation
              </>
            )}
          </Badge>

          <div className="flex items-center gap-1.5">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center"
              style={{
                background: isReady
                  ? "oklch(0.65 0.18 150 / 0.1)"
                  : "oklch(0.42 0.14 285 / 0.1)",
              }}
            >
              {isReady ? (
                <CheckCircleIcon 
                  className="h-4 w-4" 
                  style={{ color: "oklch(0.45 0.18 150)" }} 
                  strokeWidth={2.5}
                />
              ) : (
                <FireIcon 
                  className="h-4 w-4" 
                  style={{ color: "oklch(0.42 0.14 285)" }} 
                  strokeWidth={2.5}
                />
              )}
            </div>
          </div>
        </div>

        <Separator style={{ background: "oklch(0.42 0.14 285 / 0.08)" }} />

        {/* Item List - Enhanced */}
        <div className="space-y-2.5">
          {order.items.map((item, i) => (
            <div key={i} className="flex items-center gap-3 group/item">
              <div
                className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0 border-2 transition-all group-hover/item:scale-105"
                style={{ borderColor: "oklch(0.42 0.14 285 / 0.08)" }}
              >
                <img
                  src={item.image || getDishImage(item.name)}
                  alt={item.name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/20" />
              </div>
              
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-bold truncate leading-tight" style={{ color: "#0D031B" }}>
                  {item.name}
                </p>
                <p className="text-[10px] font-semibold uppercase tracking-wide mt-1" style={{ color: "#9A94AA" }}>
                  {item.quantity}× {item.category || "item"}
                </p>
              </div>
              
              <div
                className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0 transition-all group-hover/item:scale-110"
                style={{
                  background: isReady
                    ? "oklch(0.65 0.18 150 / 0.15)"
                    : "oklch(0.42 0.14 285 / 0.1)",
                }}
              >
                {isReady ? (
                  <CheckCircleIcon 
                    className="h-3.5 w-3.5" 
                    style={{ color: "oklch(0.45 0.18 150)" }} 
                    strokeWidth={2.5}
                  />
                ) : (
                  <FireIcon 
                    className="h-3.5 w-3.5" 
                    style={{ color: "oklch(0.42 0.14 285)" }} 
                    strokeWidth={2.5}
                  />
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Action Button - Enhanced for Ready Orders */}
        {isReady ? (
          <button
            onClick={() => onServe(order.id)}
            className="w-full flex items-center justify-center gap-2.5 px-4 py-3.5 rounded-[16px] font-bold text-xs uppercase text-white transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl active:translate-y-0 active:scale-95 relative overflow-hidden group/btn"
            style={{
              background: "linear-gradient(135deg, oklch(0.65 0.18 150) 0%, oklch(0.70 0.20 160) 100%)",
              boxShadow: "0 8px 32px oklch(0.65 0.18 150 / 0.4)",
            }}
          >
            {/* Shine effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover/btn:translate-x-[200%] transition-transform duration-1000" />
            
            <CheckCircleIconSolid className="h-4.5 w-4.5 relative z-10" />
            <span className="relative z-10">Mark as Served</span>
            <BellIcon className="h-4.5 w-4.5 relative z-10" strokeWidth={2.5} />
          </button>
        ) : (
          // Cooking Progress Indicator
          <div
            className="flex items-center gap-2.5 px-4 py-3 rounded-[16px] border-2"
            style={{
              background: "oklch(0.42 0.14 285 / 0.04)",
              borderColor: "oklch(0.42 0.14 285 / 0.12)",
            }}
          >
            <FireIconSolid 
              className="h-4.5 w-4.5 shrink-0" 
              style={{ color: "oklch(0.42 0.14 285)" }} 
            />
            <span className="text-[11px] font-bold flex-1" style={{ color: "oklch(0.38 0.12 285)" }}>
              Kitchen is preparing
            </span>
            <span className="flex gap-1 ml-auto">
              {[0, 1, 2].map(i => (
                <span
                  key={i}
                  className="w-1.5 h-1.5 rounded-full"
                  style={{
                    background: "oklch(0.42 0.14 285)",
                    animation: `fade-dots 1.4s ease-in-out ${i * 0.2}s infinite`,
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

// ─── Enhanced Page ────────────────────────────────────────────────────────────
export default function OrderStatusPage() {
  const [orders, setOrders] = useState<LiveOrder[]>([])
  const [activeFilter, setActiveFilter] = useState<"all"|"cooking"|"ready">("all")

  useEffect(() => {
    const unsubscribe = OrderService.subscribe(allOrders => {
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

      <div 
        className="flex flex-col min-h-screen" 
        style={{ background: "linear-gradient(135deg, #F8F6FC 0%, #F0EBF8 50%, #E8E3F5 100%)" }}
      >

        {/* ── Enhanced Header ──────────────────────────────────────────── */}
        <div
          className="px-4 sm:px-6 py-4 sm:py-5 border-b backdrop-blur-xl sticky top-0 z-10"
          style={{
            background: "rgba(255,255,255,0.92)",
            borderColor: "oklch(0.42 0.14 285 / 0.08)",
            boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
          }}
        >
          {/* Gradient accent line */}
          <div 
            className="absolute top-0 left-0 right-0 h-[2px]"
            style={{
              background: "linear-gradient(90deg, oklch(0.42 0.14 285) 0%, oklch(0.55 0.18 270) 50%, oklch(0.42 0.14 285) 100%)"
            }}
          />

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            {/* Title Section */}
            <div className="flex items-center gap-3 sm:gap-4">
                <div
                className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center shadow-lg p-2"
                style={{
                  background: "linear-gradient(135deg, oklch(0.42 0.14 285) 0%, oklch(0.38 0.16 275) 100%)",
                }}
              >
                <img src="/order-tracking-nav.png" className="w-full h-full brightness-0 invert object-contain" alt="Order Tracking" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight leading-none" style={{ color: "#0D031B" }}>
                  Service Tracker
                </h1>
                <div className="flex items-center gap-2 mt-1.5">
                  <div className="h-px w-8 bg-gradient-to-r from-oklch(0.42 0.14 285) to-transparent" />
                  <p className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider" style={{ color: "#736C83" }}>
                    Real-time preparation status
                  </p>
                </div>
              </div>
            </div>

            {/* Stats Pills - Mobile Responsive */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0 -mx-4 px-4 sm:mx-0 sm:px-0">
              <div 
                className="flex items-center gap-2 px-3 py-2 rounded-xl border whitespace-nowrap"
                style={{
                  background: "oklch(0.42 0.14 285 / 0.06)",
                  borderColor: "oklch(0.42 0.14 285 / 0.15)",
                }}
              >
                <ArrowTrendingUpIcon className="h-3.5 w-3.5" style={{ color: "oklch(0.42 0.14 285)" }} strokeWidth={2.5} />
                <span className="text-[11px] font-bold" style={{ color: "oklch(0.42 0.14 285)" }}>
                  {orders.length} Active
                </span>
              </div>
              
              <div 
                className="flex items-center gap-2 px-3 py-2 rounded-xl border whitespace-nowrap"
                style={{
                  background: "oklch(0.65 0.18 150 / 0.06)",
                  borderColor: "oklch(0.65 0.18 150 / 0.15)",
                }}
              >
                <CheckCircleIcon className="h-3.5 w-3.5" style={{ color: "oklch(0.45 0.18 150)" }} strokeWidth={2.5} />
                <span className="text-[11px] font-bold" style={{ color: "oklch(0.45 0.18 150)" }}>
                  {readyCount} Ready
                </span>
              </div>
            </div>
          </div>

          {/* Enhanced Filter Pills - Fully Responsive */}
          <div className="flex items-center gap-2 mt-4 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0">
            {(["all", "cooking", "ready"] as const).map(f => {
              const count = f === "all" ? orders.length : f === "cooking" ? cookingCount : readyCount
              const active = activeFilter === f
              
              return (
                <button
                  key={f}
                  onClick={() => setActiveFilter(f)}
                  className="flex items-center gap-2 h-9 sm:h-10 px-3 sm:px-4 rounded-xl text-[11px] sm:text-xs font-bold uppercase tracking-wide transition-all duration-300 border-2 whitespace-nowrap hover:scale-105 active:scale-95"
                  style={
                    active
                      ? {
                          background: "linear-gradient(135deg, oklch(0.42 0.14 285) 0%, oklch(0.38 0.16 275) 100%)",
                          color: "white",
                          borderColor: "transparent",
                          boxShadow: "0 4px 16px oklch(0.42 0.14 285 / 0.3)",
                        }
                      : {
                          background: "white",
                          color: "#736C83",
                          borderColor: "oklch(0.42 0.14 285 / 0.12)",
                        }
                  }
                >
                  {f !== "all" && (
                    <span 
                      className="w-2 h-2 rounded-full shrink-0" 
                      style={{
                        background: active 
                          ? "rgba(255,255,255,0.6)" 
                          : f === "ready" 
                            ? "oklch(0.65 0.18 150)" 
                            : "oklch(0.42 0.14 285)"
                      }}
                    />
                  )}
                  
                  <span className="hidden xs:inline">
                    {f.charAt(0).toUpperCase() + f.slice(1)}
                  </span>
                  <span className="xs:hidden">
                    {f.charAt(0).toUpperCase()}
                  </span>
                  
                  {count > 0 && (
                    <span
                      className="min-w-[18px] h-5 rounded-full flex items-center justify-center text-[10px] font-bold px-1.5"
                      style={
                        active
                          ? { background: "rgba(255,255,255,0.25)", color: "white" }
                          : { background: "oklch(0.42 0.14 285 / 0.1)", color: "oklch(0.42 0.14 285)" }
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

        {/* ── Enhanced Grid - Fully Responsive ─────────────────────────── */}
        <div className="flex-1 p-4 sm:p-6 lg:p-8 pb-24">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 sm:py-24 gap-4 px-4">
              <div
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl flex items-center justify-center border-2 shadow-lg"
                style={{
                  background: "white",
                  borderColor: "oklch(0.42 0.14 285 / 0.15)",
                }}
              >
                <CheckCircleIcon className="h-8 w-8 sm:h-10 sm:w-10" style={{ color: "#AEA6BF" }} strokeWidth={2.5} />
              </div>
              <div className="text-center">
                <p className="font-bold text-lg sm:text-xl" style={{ color: "#0D031B" }}>
                  All Caught Up!
                </p>
                <p className="text-sm sm:text-base mt-2" style={{ color: "#736C83" }}>
                  No active orders right now.
                </p>
              </div>
            </div>
          ) : (
            // **2 columns on mobile, 3 on desktop**
            <div className="grid gap-4 sm:gap-5 lg:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filtered.map(order => (
                <OrderCard key={order.id} order={order} onServe={handleServe} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Custom breakpoint styles */}
      <style jsx global>{`
        @media (min-width: 375px) {
          .xs\:inline {
            display: inline;
          }
          .xs\:hidden {
            display: none;
          }
        }
      `}</style>
    </TooltipProvider>
  )
}