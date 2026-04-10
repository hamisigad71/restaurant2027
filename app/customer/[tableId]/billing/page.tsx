"use client"

import { useState, useMemo, useEffect, use } from "react"
import { useRouter } from "next/navigation"
import {
  Receipt, ShoppingCart, ChevronLeft, Check,
  Smartphone, Banknote, CreditCard, Star,
  UtensilsCrossed, ArrowRight,
} from "lucide-react"
import { OrderService, LiveOrder } from "@/lib/order-service"
import { Button }    from "@/components/ui/button"
import { Input }     from "@/components/ui/input"
import { Badge }     from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Tooltip, TooltipContent, TooltipProvider, TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

// ─── Constants ────────────────────────────────────────────────────────────────
const TIP_PRESETS = [
  { label:"10%",    pct:0.10 },
  { label:"15%",    pct:0.15 },
  { label:"20%",    pct:0.20 },
  { label:"Custom", pct:-1   },
]

const PAYMENT_METHODS = [
  { id:"mpesa", label:"M-Pesa", icon:Smartphone, color:"text-green-600", bg:"bg-green-50",  desc:"Mobile money transfer" },
  { id:"cash",  label:"Cash",   icon:Banknote,   color:"text-amber-600", bg:"bg-amber-50",  desc:"Collected by waiter"   },
  { id:"card",  label:"Card",   icon:CreditCard, color:"text-blue-600",  bg:"bg-blue-50",   desc:"Tap or insert your card" },
]

// ─── Dish images ──────────────────────────────────────────────────────────────
const DISH_IMAGES: Record<string,string> = {
  "Nyama Choma":    "https://images.unsplash.com/photo-1544025162-d76694265947?w=800&q=80",
  "Pilau":          "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80",
  "Chicken Tikka":  "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=800&q=80",
  "Filet Mignon":   "https://images.unsplash.com/photo-1558030006-450675393462?w=400&q=80",
  "Lobster":        "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&q=80",
  "Pasta":          "https://images.unsplash.com/photo-1612874742237-6526221588e3?w=400&q=80",
  "Pizza":          "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80",
  "Tiramisu":       "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400&q=80",
  "Cappuccino":     "https://images.unsplash.com/photo-1534778101976-62847782c213?w=400&q=80",
}
const FALLBACK = "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80"

function getDishImage(name: string) {
  for (const [k, v] of Object.entries(DISH_IMAGES)) {
    if (name.toLowerCase().includes(k.toLowerCase())) return v
  }
  return FALLBACK
}

// ─── Rating labels ────────────────────────────────────────────────────────────
const RATING_LABELS = ["","Poor 😕","Fair 😐","Good 😊","Great 😄","Excellent 🤩"]

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function BillingPage({ params }: { params: Promise<{ tableId: string }> }) {
  const { tableId }      = use(params)
  const router           = useRouter()
  const currentTableId   = (tableId || "").replace(/^0+/, "")

  const [activeOrders,   setActiveOrders]   = useState<LiveOrder[]>([])
  const [isPaid,         setIsPaid]         = useState(false)
  const [selectedTip,    setSelectedTip]    = useState<number>(0.10)
  const [customTip,      setCustomTip]      = useState("")
  const [isCustomTip,    setIsCustomTip]    = useState(false)
  const [paymentMethod,  setPaymentMethod]  = useState("mpesa")
  const [rating,         setRating]         = useState(0)
  const [hoveredStar,    setHoveredStar]    = useState(0)

  useEffect(() => {
    const unsub = OrderService.subscribe((all: LiveOrder[]) => {
      setActiveOrders(
        all.filter(
          (o: LiveOrder) =>
            o.tableId === currentTableId &&
            o.status !== "served" &&
            o.status !== "cancelled",
        ),
      )
    })
    return unsub
  }, [currentTableId])

  const orderedItems = useMemo(() => activeOrders.flatMap((o) => o.items), [activeOrders])
  const subtotal     = useMemo(() => orderedItems.reduce((s, i) => s + i.price * i.quantity, 0), [orderedItems])

  const tipAmount = useMemo(() => {
    if (isCustomTip) return parseFloat(customTip) || 0
    return Math.round(subtotal * selectedTip)
  }, [subtotal, isCustomTip, customTip, selectedTip])

  const grandTotal = subtotal + tipAmount

  const handlePay = () => {
    setIsPaid(true)
    toast.success("Payment successful!", {
      description: `KSh ${grandTotal.toLocaleString()} received`,
      icon: <Check className="h-4 w-4" />,
    })
  }

  // ─── Post-payment success screen ──────────────────────────────────────────
  if (isPaid) {
    return (
      <TooltipProvider>
        <div
          className="min-h-screen flex flex-col items-center justify-center p-8 text-center animate-in fade-in duration-700"
          style={{ background: "#EBE6F8" }}
        >
          {/* Success ring */}
          <div className="relative mb-8">
            <div
              className="w-32 h-32 rounded-full flex items-center justify-center animate-in zoom-in duration-500"
              style={{ background: "oklch(0.7 0.15 150 / 0.12)" }}
            >
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center"
                style={{
                  background: "oklch(0.7 0.15 150)",
                  boxShadow: "0 8px 32px oklch(0.7 0.15 150 / 0.4)",
                }}
              >
                <Check className="h-10 w-10 text-white" strokeWidth={2.5} />
              </div>
            </div>
          </div>

          <h1 className="text-4xl font-bold tracking-tight" style={{ color: "#0D031B" }}>
            Paid Successfully!
          </h1>
          <p className="text-sm mt-2 mb-8" style={{ color: "#736C83" }}>
            Hope you enjoyed your experience at Resto.
          </p>

          {/* Receipt card */}
          <div
            className="w-full max-w-sm rounded-3xl p-6 mb-8 text-left"
            style={{
              background: "rgba(253,252,255,0.92)",
              backdropFilter: "blur(20px)",
              border: "1px solid oklch(0.45 0.12 285 / 0.12)",
              boxShadow: "0 16px 48px rgba(13,3,27,0.08)",
            }}
          >
            {/* Receipt header */}
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-[9px] font-bold uppercase tracking-[0.28em]" style={{ color: "#AEA6BF" }}>
                  Official Receipt
                </p>
                <p className="text-[11px] font-semibold mt-0.5" style={{ color: "#3D374C" }}>
                  Table {tableId}
                </p>
              </div>
              <div
                className="flex items-center justify-center w-9 h-9 rounded-xl"
                style={{ background: "oklch(0.45 0.12 285 / 0.1)" }}
              >
                <Receipt className="h-4 w-4" style={{ color: "oklch(0.45 0.12 285)" }} />
              </div>
            </div>

            {/* Line items */}
            <div className="space-y-2.5 mb-4">
              {orderedItems.map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg overflow-hidden shrink-0 border" style={{ borderColor: "rgba(0,0,0,0.06)" }}>
                    <img src={getDishImage(item.name)} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-[12px] font-medium truncate block" style={{ color: "#3D374C" }}>
                      {item.name}{" "}
                      <span style={{ color: "#AEA6BF" }}>×{item.quantity}</span>
                    </span>
                  </div>
                  <span className="text-[12px] font-semibold tabular-nums shrink-0" style={{ color: "oklch(0.45 0.12 285)" }}>
                    KSh {(item.price * item.quantity).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            {/* Dashed separator */}
            <div
              className="h-px mb-4"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(90deg,#D0CBE4 0,#D0CBE4 6px,transparent 6px,transparent 10px)",
              }}
            />

            <div className="space-y-2">
              <div className="flex justify-between text-[11px]" style={{ color: "#736C83" }}>
                <span>Subtotal</span>
                <span className="tabular-nums">KSh {subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-[11px]" style={{ color: "#736C83" }}>
                <span>Tip</span>
                <span className="tabular-nums">KSh {tipAmount.toLocaleString()}</span>
              </div>
              <div
                className="flex justify-between text-[15px] font-bold pt-1"
                style={{ color: "#0D031B" }}
              >
                <span>Total Paid</span>
                <span className="tabular-nums" style={{ color: "oklch(0.45 0.12 285)" }}>
                  KSh {grandTotal.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Star rating */}
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] mb-3" style={{ color: "#AEA6BF" }}>
            How was everything today?
          </p>
          <div className="flex gap-2.5 justify-center mb-3">
            {[1,2,3,4,5].map(s => (
              <button
                key={s}
                onMouseEnter={() => setHoveredStar(s)}
                onMouseLeave={() => setHoveredStar(0)}
                onClick={() => setRating(s)}
                className={cn(
                  "text-4xl transition-all duration-200 hover:scale-125",
                  (hoveredStar || rating) >= s ? "opacity-100" : "opacity-25",
                )}
              >
                ⭐
              </button>
            ))}
          </div>
          {rating > 0 && (
            <p className="text-xs animate-in fade-in mb-6" style={{ color: "#736C83" }}>
              {RATING_LABELS[rating]} — Thank you for your feedback!
            </p>
          )}

          <div className="flex items-center gap-2 mb-8" style={{ color: "oklch(0.45 0.12 285 / 0.45)" }}>
            <UtensilsCrossed className="h-4 w-4" />
            <span className="text-[10px] font-medium uppercase tracking-[0.25em]">
              Resto · Experience Excellence
            </span>
          </div>

          <Button
            onClick={() => router.push(`/customer/${tableId}`)}
            className={cn(
              "group rounded-2xl font-bold text-[11px] uppercase tracking-widest h-11 px-6 transition-all duration-300 text-white",
              "hover:-translate-y-1 hover:scale-[1.03] active:translate-y-0 active:scale-[0.98]",
              "relative overflow-hidden border-0"
            )}
            style={{
              background: "oklch(0.45 0.12 285)",
              boxShadow: "0 6px 24px oklch(0.45 0.12 285 / 0.35)",
            }}
          >
            {/* Shine effect */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-20 pointer-events-none group-hover:animate-[flow-shine_2s_ease-in-out_infinite]"
                 style={{ background: "linear-gradient(90deg, transparent, white, transparent)" }} />
            <span className="relative z-10 transition-colors">Return to Menu</span>
          </Button>
        </div>
      </TooltipProvider>
    )
  }

  // ─── Main billing view ────────────────────────────────────────────────────
  return (
    <TooltipProvider>
      <div className="min-h-screen flex flex-col" style={{ background: "#F5F2FB" }}>

        {/* ── Header ─────────────────────────────────────────────── */}
        <header
          className="flex items-center justify-between px-5 py-4 border-b sticky top-0 z-20 shrink-0"
          style={{
            background: "rgba(253,252,255,0.92)",
            backdropFilter: "blur(20px)",
            borderColor: "oklch(0.45 0.12 285 / 0.1)",
            boxShadow: "0 1px 12px oklch(0.45 0.12 285 / 0.06)",
          }}
        >
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={() => router.back()}
                className="flex items-center justify-center w-9 h-9 rounded-xl border transition-all hover:scale-105 active:scale-95"
                style={{
                  background: "#EBE6F8",
                  borderColor: "oklch(0.45 0.12 285 / 0.15)",
                  color: "#3D374C",
                }}
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent>Go back</TooltipContent>
          </Tooltip>

          <div className="text-center">
            <h1
              className="text-[15px] font-bold tracking-tight leading-none"
              style={{ color: "#0D031B" }}
            >
              Checkout
            </h1>
            <p
              className="text-[10px] font-bold uppercase tracking-[0.18em] mt-0.5"
              style={{ color: "oklch(0.45 0.12 285)" }}
            >
              Table {tableId}
            </p>
          </div>

          {/* Right: item count badge */}
          <Badge
            className="text-[10px] font-bold px-2.5 py-1 rounded-full border"
            style={{
              background: "oklch(0.45 0.12 285 / 0.1)",
              color: "oklch(0.45 0.12 285)",
              borderColor: "oklch(0.45 0.12 285 / 0.2)",
            }}
          >
            {orderedItems.reduce((s, i) => s + i.quantity, 0)} items
          </Badge>
        </header>

        {/* ── Scrollable body ────────────────────────────────────── */}
        <ScrollArea className="flex-1">
          <div className="max-w-lg mx-auto px-5 py-6 space-y-7 pb-4">

            {/* ── Order summary ──────────────────────────────────── */}
            <section>
              <div className="flex items-center justify-between mb-3">
                <p
                  className="text-[9px] font-bold uppercase tracking-[0.24em]"
                  style={{ color: "#AEA6BF" }}
                >
                  Items Ordered
                </p>
              </div>

              {orderedItems.length === 0 ? (
                <div
                  className="flex flex-col items-center justify-center py-16 gap-3 rounded-3xl border border-dashed"
                  style={{ borderColor: "oklch(0.45 0.12 285 / 0.2)" }}
                >
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center"
                    style={{ background: "oklch(0.45 0.12 285 / 0.08)" }}
                  >
                    <ShoppingCart className="h-6 w-6" style={{ color: "#AEA6BF" }} />
                  </div>
                  <p className="text-sm font-semibold" style={{ color: "#3D374C" }}>
                    No items found
                  </p>
                  <p className="text-xs" style={{ color: "#9A94AA" }}>
                    No active orders for this table
                  </p>
                </div>
              ) : (
                <div
                  className="rounded-3xl overflow-hidden border divide-y"
                  style={{
                    background: "rgba(255,255,255,0.9)",
                    borderColor: "oklch(0.45 0.12 285 / 0.1)",
                    
                  }}
                >
                  {orderedItems.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3.5 px-4 py-3.5">
                      {/* Thumbnail */}
                      <div
                        className="w-12 h-12 rounded-2xl overflow-hidden shrink-0 border"
                        style={{ borderColor: "rgba(0,0,0,0.06)" }}
                      >
                        <img
                          src={getDishImage(item.name)}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <p
                          className="text-[13px] font-semibold truncate"
                          style={{ color: "#0D031B" }}
                        >
                          {item.name}
                        </p>
                        <p
                          className="text-[11px] mt-0.5 font-medium"
                          style={{ color: "#9A94AA" }}
                        >
                          ×{item.quantity} · KSh {item.price.toLocaleString()} each
                        </p>
                      </div>

                      <p
                        className="text-[13px] font-bold tabular-nums shrink-0"
                        style={{ color: "oklch(0.45 0.12 285)" }}
                      >
                        KSh {(item.price * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* ── Tip section ────────────────────────────────────── */}
            <section>
              <p
                className="text-[9px] font-bold uppercase tracking-[0.24em] mb-3"
                style={{ color: "#AEA6BF" }}
              >
                Express Gratitude
              </p>

              <div className="grid grid-cols-4 gap-2.5">
                {TIP_PRESETS.map((t) => {
                  const isActive =
                    (!isCustomTip && selectedTip === t.pct) ||
                    (isCustomTip && t.pct === -1)
                  return (
                    <button
                      key={t.label}
                      onClick={() => {
                        if (t.pct === -1) { setIsCustomTip(true); setSelectedTip(0) }
                        else { setIsCustomTip(false); setSelectedTip(t.pct) }
                      }}
                      className="h-12 rounded-2xl text-[11px] font-bold uppercase tracking-wider transition-all duration-200 border"
                      style={
                        isActive
                          ? {
                              background: "oklch(0.45 0.12 285)",
                              color: "white",
                              borderColor: "transparent",
                              boxShadow: "0 4px 14px oklch(0.45 0.12 285 / 0.35)",
                              transform: "scale(1.04)",
                            }
                          : {
                              background: "rgba(255,255,255,0.85)",
                              color: "#3D374C",
                              borderColor: "oklch(0.45 0.12 285 / 0.14)",
                            }
                      }
                    >
                      {t.label}
                    </button>
                  )
                })}
              </div>

              {isCustomTip && (
                <div className="relative mt-3 animate-in slide-in-from-top-2 fade-in duration-300">
                  <span
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold"
                    style={{ color: "#9A94AA" }}
                  >
                    KSh
                  </span>
                  <Input
                    type="number"
                    placeholder="Enter amount"
                    value={customTip}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCustomTip(e.target.value)}
                    className="pl-14 h-12 rounded-2xl border text-sm font-semibold"
                    style={{
                      background: "rgba(255,255,255,0.9)",
                      borderColor: "oklch(0.45 0.12 285 / 0.2)",
                      color: "#0D031B",
                    }}
                  />
                </div>
              )}
            </section>

            {/* ── Payment method ─────────────────────────────────── */}
            <section>
              <p
                className="text-[9px] font-bold uppercase tracking-[0.24em] mb-3"
                style={{ color: "#AEA6BF" }}
              >
                Payment Method
              </p>

              <div className="space-y-2.5">
                {PAYMENT_METHODS.map((method) => {
                  const Icon   = method.icon
                  const active = paymentMethod === method.id
                  return (
                    <button
                      key={method.id}
                      onClick={() => setPaymentMethod(method.id)}
                      className="w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl border transition-all duration-200 text-left hover:-translate-y-0.5"
                      style={
                        active
                          ? {
                              background: "oklch(0.45 0.12 285 / 0.05)",
                              borderColor: "oklch(0.45 0.12 285 / 0.4)",
                              boxShadow: "0 2px 10px oklch(0.45 0.12 285 / 0.1)",
                            }
                          : {
                              background: "rgba(255,255,255,0.88)",
                              borderColor: "oklch(0.45 0.12 285 / 0.12)",
                            }
                      }
                    >
                      <div
                        className={cn(
                          "flex items-center justify-center w-11 h-11 rounded-xl shrink-0 transition-transform duration-200",
                          method.bg,
                          active && "scale-105",
                        )}
                      >
                        <Icon className={cn("h-5 w-5", method.color)} />
                      </div>

                      <div className="flex-1 min-w-0">
                        <p
                          className="text-[13px] font-bold"
                          style={{ color: "#0D031B" }}
                        >
                          {method.label}
                        </p>
                        <p
                          className="text-[11px] mt-0.5"
                          style={{ color: "#9A94AA" }}
                        >
                          {method.desc}
                        </p>
                      </div>

                      <div
                        className="w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all duration-200"
                        style={
                          active
                            ? { background: "oklch(0.45 0.12 285)", borderColor: "oklch(0.45 0.12 285)" }
                            : { borderColor: "#D0CBE4" }
                        }
                      >
                        {active && (
                          <Check className="h-3 w-3 text-white" strokeWidth={2.5} />
                        )}
                      </div>
                    </button>
                  )
                })}
              </div>
            </section>

            {/* Bottom spacer so footer doesn't cover last item */}
            <div className="h-2" />
          </div>
        </ScrollArea>

        {/* ── Sticky footer ──────────────────────────────────────── */}
        <footer
          className="shrink-0 border-t px-5 py-5"
          style={{
            background: "rgba(253,252,255,0.96)",
            backdropFilter: "blur(20px)",
            borderColor: "oklch(0.45 0.12 285 / 0.1)",
            boxShadow: "0 -4px 24px rgba(13,3,27,0.05)",
          }}
        >
          <div className="max-w-lg mx-auto space-y-4">

            {/* Summary row */}
            <div
              className="flex items-center justify-between px-4 py-3.5 rounded-2xl border"
              style={{
                background: "oklch(0.45 0.12 285 / 0.05)",
                borderColor: "oklch(0.45 0.12 285 / 0.1)",
              }}
            >
              <div className="space-y-1">
                <div className="flex items-center gap-3 text-[11px]" style={{ color: "#736C83" }}>
                  <span>Subtotal</span>
                  <span className="tabular-nums font-medium" style={{ color: "#3D374C" }}>
                    KSh {subtotal.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-[11px]" style={{ color: "#736C83" }}>
                  <span>Tip</span>
                  <span className="tabular-nums font-medium" style={{ color: "#3D374C" }}>
                    KSh {tipAmount.toLocaleString()}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "#AEA6BF" }}>
                  Grand Total
                </p>
                <p
                  className="text-2xl font-bold tabular-nums leading-tight"
                  style={{ color: "oklch(0.45 0.12 285)" }}
                >
                  KSh {grandTotal.toLocaleString()}
                </p>
              </div>
            </div>

            {/* Pay CTA */}
            <button
              onClick={handlePay}
              disabled={orderedItems.length === 0}
              className="w-full flex items-center gap-3 justify-center h-14 rounded-2xl font-bold text-[13px] uppercase tracking-widest text-white transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none relative overflow-hidden group"
              style={{
                background: "oklch(0.45 0.12 285)",
                boxShadow: "0 8px 28px oklch(0.45 0.12 285 / 0.4)",
              }}
            >
              {/* Shimmer on hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
              <CreditCard className="h-4 w-4 relative z-10" />
              <span className="relative z-10">
                Confirm & Pay · KSh {grandTotal.toLocaleString()}
              </span>
              <ArrowRight className="h-4 w-4 relative z-10 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </footer>
      </div>
    </TooltipProvider>
  )
}