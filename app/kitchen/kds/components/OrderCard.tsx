"use client"
import { useState, useEffect } from "react"
import { Clock, Flame, CheckCircle2, Timer, Utensils, ArrowRight, Zap } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import type { KitchenOrder, OrderStatus } from "../lib/types"

// ─── Imagery ──────────────────────────────────────────────────────────────────
const DISH_IMAGES: Record<string, string> = {
  "Grilled Sea Bass":  "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=400&q=80",
  "Filet Mignon":      "https://images.unsplash.com/photo-1558030006-450675393462?w=400&q=80",
  "Lobster Thermidor": "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&q=80",
  "Beef Wellington":   "https://images.unsplash.com/photo-1546964124-0cce460f38ef?w=400&q=80",
  "Caesar Salad":      "https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400&q=80",
  "Pasta Carbonara":   "https://images.unsplash.com/photo-1612874742237-6526221588e3?w=400&q=80",
  "Margherita Pizza":  "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80",
  "Tiramisu":          "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400&q=80",
  "Crème Brûlée":      "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&q=80",
  "Cappuccino":        "https://images.unsplash.com/photo-1534778101976-62847782c213?w=400&q=80",
  "Croissant":         "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400&q=80",
  "Chocolate Fondant": "https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=400&q=80",
}
const FALLBACK = "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&q=80"

function getDishImage(name: string) {
  const EXTENDED: Record<string, string> = {
    ...DISH_IMAGES,
    "Chicken Skewers": "https://i.pinimg.com/736x/a4/1b/72/a41b7293c9ca093447acf115b8f76eae.jpg",
    "Burrata":         "https://i.pinimg.com/736x/78/47/b4/7847b46b356ae578693105051bfaf4d1.jpg",
    "Calamari":        "https://i.pinimg.com/1200x/82/18/35/82183552a9adad429d834f4cee48a99c.jpg",
    "Samosa":          "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&q=80",
    " Nyama Choma":    "https://images.unsplash.com/photo-1544025162-d76694265947?w=400",
    "Pilau":           "https://i.pinimg.com/1200x/1c/36/77/1c3677d96b0f166ba6498c0c94e5f0c2.jpg",
    "Wings":           "https://images.unsplash.com/photo-1527477396000-e27163b481c2?w=400",
  }
  for (const [k, v] of Object.entries(EXTENDED)) {
    if (name.toLowerCase().includes(k.toLowerCase())) return v
  }
  return FALLBACK
}

// ─── Status config ────────────────────────────────────────────────────────────
const STATUS_CONFIG = {
  pending: {
    label: "New Order", Icon: Clock,
    cardAccent: "oklch(0.45 0.12 285)",
    cardBg: "rgba(255,255,255,0.85)",
    badgeBg: "oklch(0.45 0.12 285 / 0.08)", badgeText: "oklch(0.45 0.12 285)", badgeBorder: "oklch(0.45 0.12 285 / 0.15)",
    iconBg: "oklch(0.45 0.12 285 / 0.1)", iconColor: "oklch(0.45 0.12 285)",
    statusText: "Waiting to start",
    nextLabel: "Start Cooking", nextStatus: "cooking" as OrderStatus,
    nextBg: "oklch(0.45 0.12 285)", nextShadow: "oklch(0.45 0.12 285 / 0.3)",
  },
  cooking: {
    label: "Preparing", Icon: Flame,
    cardAccent: "oklch(0.45 0.12 285)",
    cardBg: "rgba(255,255,255,0.85)",
    badgeBg: "oklch(0.45 0.12 285 / 0.1)", badgeText: "oklch(0.45 0.12 285)", badgeBorder: "oklch(0.45 0.12 285 / 0.2)",
    iconBg: "oklch(0.45 0.12 285 / 0.12)", iconColor: "oklch(0.45 0.12 285)",
    statusText: "In the kitchen",
    nextLabel: "Mark Ready", nextStatus: "ready" as OrderStatus,
    nextBg: "oklch(0.62 0.16 150)", nextShadow: "oklch(0.62 0.16 150 / 0.3)",
  },
  ready: {
    label: "Ready", Icon: CheckCircle2,
    cardAccent: "oklch(0.62 0.16 150)",
    cardBg: "rgba(255,255,255,0.92)",
    badgeBg: "oklch(0.62 0.16 150 / 0.1)", badgeText: "oklch(0.42 0.14 150)", badgeBorder: "oklch(0.62 0.16 150 / 0.2)",
    iconBg: "oklch(0.62 0.16 150 / 0.1)", iconColor: "oklch(0.42 0.14 150)",
    statusText: "Ready to serve",
    nextLabel: "Mark Served", nextStatus: "served" as OrderStatus,
    nextBg: "oklch(0.3 0.08 285)", nextShadow: "rgba(13,3,27,0.2)",
  },
} as const

// ─── Timer hook ───────────────────────────────────────────────────────────────
function useElapsed(createdAt: string) {
  const [elapsed, setElapsed] = useState(0)
  useEffect(() => {
    const update = () => setElapsed(Math.floor((Date.now() - new Date(createdAt).getTime()) / 1000))
    update()
    const id = setInterval(update, 1000)
    return () => clearInterval(id)
  }, [createdAt])
  const m = Math.floor(elapsed / 60)
  const s = elapsed % 60
  return { display: `${m}:${String(s).padStart(2, "0")}`, minutes: m, overdue: m >= 15 }
}

interface OrderCardProps {
  order: KitchenOrder;
  onUpdateStatus: (id: string, s: OrderStatus) => void;
  listMode?: boolean;
  animDelay?: number;
}

export function OrderCard({ order, onUpdateStatus, listMode, animDelay = 0 }: OrderCardProps) {
  const cfg = (STATUS_CONFIG as any)[order.status]
  const timer = useElapsed(order.createdAt)
  const primary = order.items.find(i => i.category === "main") ?? order.items[0]
  const totalQty = order.items.reduce((s, i) => s + i.quantity, 0)

  if (!cfg) return null

  // ─── List Mode Render ─────────────────────────────────────────────────────
  if (listMode) {
    return (
      <div 
        className="flex items-center gap-4 p-3 rounded-2xl border bg-white/70 backdrop-blur-xl transition-all hover:bg-white/90 animate-in fade-in slide-in-from-right-4"
        style={{ animationDelay: `${animDelay}ms` }}
      >
        <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0">
          <img src={primary.image || getDishImage(primary.name)} className="w-full h-full object-cover" alt="" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm">Table {order.tableNumber}</span>
            <span className="text-[10px] text-muted-foreground font-mono">{order.id}</span>
          </div>
          <div className="flex items-center gap-3 mt-1">
            <span className="text-[11px] font-medium" style={{ color: cfg.badgeText }}>{cfg.label}</span>
            <span className="text-[10px] text-muted-foreground">{totalQty} items</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-black/5 font-mono text-[11px]">
            <Timer className="h-3 w-3" />
            {timer.display}
          </div>
          <button 
            onClick={() => onUpdateStatus(order.id, cfg.nextStatus)}
            className="px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest text-white transition-all hover:scale-105 active:scale-95"
            style={{ background: cfg.nextBg }}
          >
            {cfg.nextLabel}
          </button>
        </div>
      </div>
    )
  }

  // ─── Grid Mode Render ─────────────────────────────────────────────────────
  return (
    <Card
      className="relative overflow-hidden border transition-all duration-700 hover:-translate-y-2 hover:shadow-[0_20px_60px_oklch(0.45_0.12_285_/_0.18)] group p-0 rounded-[2.5rem] animate-in zoom-in-95"
      style={{
        background: "linear-gradient(135deg, rgba(255,255,255,0.92) 0%, rgba(255,255,255,0.75) 100%)",
        backdropFilter: "blur(32px) saturate(180%)",
        borderColor: "rgba(255,255,255,0.5)",
        boxShadow: "0 8px 32px rgba(13,3,27,0.06), inset 0 0 0 1px rgba(255,255,255,0.4)",
        animationDelay: `${animDelay}ms`
      }}
    >
      <div 
        className="absolute top-0 inset-x-0 h-1 blur-md transition-all duration-500" 
        style={{ background: cfg.cardAccent, opacity: order.status === "cooking" ? 0.8 : 0.4 }} 
      />

      {order.priority === "urgent" && (
        <div className="absolute top-4 right-4 z-20">
          <span className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full text-white" style={{ background: "oklch(0.65 0.18 25)", boxShadow: "0 2px 8px oklch(0.65 0.18 25 / 0.45)" }}>
            <Zap className="h-2 w-2 fill-current" /> Urgent
          </span>
        </div>
      )}

      <div className="relative h-44 overflow-hidden mx-3 mt-3 rounded-[2rem]">
        <img src={primary.image || getDishImage(primary.name)} alt="" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.04]" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
        <div className="absolute bottom-3 left-3">
          <div className="flex items-center justify-center px-4 py-1.5 rounded-xl text-white font-bold text-base" style={{ background: cfg.cardAccent, boxShadow: `0 4px 12px ${cfg.cardAccent}55` }}>
            T{order.tableNumber}
          </div>
        </div>
      </div>

      <CardContent className="px-5 pt-4 pb-5 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border" style={{ background: cfg.badgeBg, color: cfg.badgeText, borderColor: cfg.badgeBorder }}>{cfg.label}</span>
          <div className="flex items-center gap-1 text-[11px] font-mono font-semibold text-[#736C83]">
            <Timer className="h-3 w-3" /> {timer.display}
          </div>
        </div>

        <Separator style={{ background: "rgba(0,0,0,0.06)" }} />

        <div className="space-y-3">
          {order.items.slice(0, 3).map(item => (
            <div key={item.id} className="flex items-center justify-between gap-2">
              <span className="text-[12px] font-semibold truncate text-[#0D031B]">{item.name}</span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-black/5">×{item.quantity}</span>
            </div>
          ))}
          {order.items.length > 3 && (
            <p className="text-[10px] text-center font-bold text-[#AEA6BF] uppercase tracking-wider">+{order.items.length - 3} more items</p>
          )}
        </div>

        <button
          onClick={() => onUpdateStatus(order.id, cfg.nextStatus)}
          className="w-full flex items-center gap-2.5 px-4 py-4 rounded-2xl font-bold text-[11px] tracking-widest uppercase text-white transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl active:translate-y-0 active:scale-[0.98] overflow-hidden relative group/btn mt-2"
          style={{ background: cfg.nextBg, boxShadow: `0 8px 24px ${cfg.nextShadow}` }}
        >
          <cfg.Icon className="h-4 w-4 relative z-10 transition-transform group-hover/btn:scale-125" />
          <span className="relative z-10 flex-1 text-left">{cfg.nextLabel}</span>
          <ArrowRight className="h-3 w-3 relative z-10 transition-transform group-hover/btn:translate-x-0.5" />
        </button>
      </CardContent>
    </Card>
  )
}
