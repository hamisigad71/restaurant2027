"use client"

import { useState, useMemo, useEffect, use } from "react"
import { useRouter } from "next/navigation"
import { AnimatePresence, motion } from "motion/react"
import { EASE_OUT, FAST_TRANSITION, SPRING_POP } from "@/lib/motion"
import {
  DocumentTextIcon as Receipt,
  ShoppingCartIcon as ShoppingCart,
  ChevronLeftIcon as ChevronLeft,
  CheckIcon as Check,
  DevicePhoneMobileIcon as Smartphone,
  BanknotesIcon as Banknote,
  CreditCardIcon as CreditCard,
  BoltIcon as UtensilsCrossed,
  ArrowRightIcon as ArrowRight,
} from "@heroicons/react/24/outline"
import { OrderService, LiveOrder } from "@/lib/order-service"
import { calculateBillTotals } from "@/lib/restaurant-store"
import type { CartItem, PaymentMethod } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

const TIP_PRESETS = [
  { label: "10%", pct: 0.1 },
  { label: "15%", pct: 0.15 },
  { label: "20%", pct: 0.2 },
  { label: "Custom", pct: -1 },
]

const PAYMENT_METHODS = [
  { id: "mpesa", label: "M-Pesa", icon: Smartphone, tone: "bg-success/10 text-success", desc: "Mobile money transfer" },
  { id: "cash", label: "Cash", icon: Banknote, tone: "bg-warning/10 text-warning", desc: "Collected by waiter" },
  { id: "card", label: "Card", icon: CreditCard, tone: "bg-primary/10 text-primary", desc: "Tap or insert your card" },
]

const DISH_IMAGES: Record<string, string> = {
  "Nyama Choma": "https://images.unsplash.com/photo-1544025162-d76694265947?w=800&q=80",
  "Pilau": "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80",
  "Chicken Tikka": "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=800&q=80",
  "Filet Mignon": "https://images.unsplash.com/photo-1558030006-450675393462?w=400&q=80",
  "Lobster": "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&q=80",
  "Pasta": "https://images.unsplash.com/photo-1612874742237-6526221588e3?w=400&q=80",
  "Pizza": "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80",
  "Tiramisu": "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400&q=80",
  "Cappuccino": "https://images.unsplash.com/photo-1534778101976-62847782c213?w=400&q=80",
}
const FALLBACK = "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80"

function getDishImage(name: string) {
  for (const [k, v] of Object.entries(DISH_IMAGES)) {
    if (name.toLowerCase().includes(k.toLowerCase())) return v
  }
  return FALLBACK
}

const RATING_LABELS = ["", "Poor 😕", "Fair 😐", "Good 😊", "Great 😄", "Excellent 🤩"]

export default function BillingPage({ params }: { params: Promise<{ tableId: string }> }) {
  const { tableId } = use(params)
  const router = useRouter()
  const currentTableId = (tableId || "").replace(/^0+/, "")

  const [activeOrders, setActiveOrders] = useState<LiveOrder[]>([])
  const [paidSnapshot, setPaidSnapshot] = useState<{
    items: CartItem[]
    subtotal: number
    tax: number
    tip: number
    total: number
  } | null>(null)
  const [isPaid, setIsPaid] = useState(false)
  const [selectedTip, setSelectedTip] = useState<number>(0.1)
  const [customTip, setCustomTip] = useState("")
  const [isCustomTip, setIsCustomTip] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState("mpesa")
  const [rating, setRating] = useState(0)
  const [hoveredStar, setHoveredStar] = useState(0)

  useEffect(() => {
    const unsub = OrderService.subscribe((all: LiveOrder[]) => {
      setActiveOrders(
        all.filter(
          (o: LiveOrder) =>
            o.tableId === currentTableId &&
            o.paymentStatus !== "paid" &&
            o.status !== "cancelled",
        ),
      )
    })
    return unsub
  }, [currentTableId])

  const orderedItems = useMemo(() => activeOrders.flatMap((o) => o.items), [activeOrders])
  const subtotal = useMemo(
    () => orderedItems.reduce((s, i) => s + i.price * i.quantity, 0),
    [orderedItems],
  )

  const tipAmount = useMemo(() => {
    if (isCustomTip) return parseFloat(customTip) || 0
    return Math.round(subtotal * selectedTip)
  }, [subtotal, isCustomTip, customTip, selectedTip])

  const bill = useMemo(() => calculateBillTotals(subtotal, tipAmount), [subtotal, tipAmount])
  const taxAmount = bill.tax
  const grandTotal = bill.total

  const handlePay = () => {
    setPaidSnapshot({
      items: orderedItems,
      subtotal,
      tax: taxAmount,
      tip: tipAmount,
      total: grandTotal,
    })
    OrderService.settleTable(currentTableId, paymentMethod as PaymentMethod, tipAmount)
    setIsPaid(true)
    toast.success("Payment successful!", {
      description: `KSh ${grandTotal.toLocaleString()} received · Table closed & sent to Housekeeping`,
      icon: <Check className="size-4" />,
    })
  }

  if (isPaid) {
    return (
      <TooltipProvider>
        <div className="min-h-dvh flex flex-col items-center justify-center p-6 text-center bg-background">
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={SPRING_POP}
            className="flex size-20 items-center justify-center rounded-full bg-success text-success-foreground shadow-lg mb-6"
          >
            <Check className="size-10" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.24, ease: EASE_OUT, delay: 0.05 }}
          >
            <h1 className="text-3xl font-bold text-foreground">Paid Successfully!</h1>
            <p className="text-sm text-muted-foreground mt-2 mb-8">
              Hope you enjoyed your experience at Resto.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.28, ease: EASE_OUT, delay: 0.1 }}
            className="w-full max-w-sm mb-8"
          >
            <Card className="w-full text-left">
            <CardHeader>
              <CardDescription className="text-xs uppercase">Official Receipt</CardDescription>
              <CardTitle className="text-base">Table {tableId}</CardTitle>
              <CardAction>
                <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Receipt className="size-4" />
                </div>
              </CardAction>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="space-y-2.5">
                {(paidSnapshot?.items ?? orderedItems).map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="size-8 rounded-md overflow-hidden shrink-0 border bg-muted">
                      <img
                        src={getDishImage(item.name)}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-xs font-medium truncate block">
                        {item.name}{" "}
                        <span className="text-muted-foreground">×{item.quantity}</span>
                      </span>
                    </div>
                    <span className="text-xs font-semibold tabular-nums text-primary shrink-0">
                      KSh {(item.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>

              <Separator />

              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal</span>
                  <span className="tabular-nums">
                    KSh {(paidSnapshot?.subtotal ?? subtotal).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>VAT (16%)</span>
                  <span className="tabular-nums">
                    KSh {(paidSnapshot?.tax ?? taxAmount).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Tip</span>
                  <span className="tabular-nums">
                    KSh {(paidSnapshot?.tip ?? tipAmount).toLocaleString()}
                  </span>
                </div>
                <Separator className="my-1.5" />
                <div className="flex justify-between text-sm font-bold text-foreground">
                  <span>Total Paid</span>
                  <span className="tabular-nums text-primary">
                    KSh {(paidSnapshot?.total ?? grandTotal).toLocaleString()}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
          </motion.div>

          <p className="text-xs font-semibold uppercase text-muted-foreground mb-2">
            How was everything today?
          </p>
          <div className="flex gap-2 justify-center mb-3">
            {[1, 2, 3, 4, 5].map((s) => (
              <Button
                key={s}
                variant="ghost"
                size="icon"
                onMouseEnter={() => setHoveredStar(s)}
                onMouseLeave={() => setHoveredStar(0)}
                onClick={() => setRating(s)}
                className={cn(
                  "text-2xl transition-[transform,opacity] duration-150 ease-(--ease-out) active:scale-90",
                  (hoveredStar || rating) >= s ? "opacity-100 scale-105" : "opacity-30",
                )}
              >
                ⭐
              </Button>
            ))}
          </div>
          <div className="min-h-6 mb-4 flex items-center justify-center">
            <AnimatePresence mode="wait">
              {rating > 0 && (
                <motion.p
                  key={rating}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={FAST_TRANSITION}
                  className="text-xs text-muted-foreground"
                >
                  {RATING_LABELS[rating]} — Thank you for your feedback!
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          <div className="flex items-center gap-2 mb-6 text-muted-foreground">
            <UtensilsCrossed className="size-4" />
            <span className="text-xs font-medium uppercase">Resto · Experience Excellence</span>
          </div>

          <Button onClick={() => router.push(`/customer/${tableId}`)} size="lg">
            Return to Menu
          </Button>
        </div>
      </TooltipProvider>
    )
  }

  return (
    <TooltipProvider>
      <div className="min-h-dvh flex flex-col bg-background">
        <header className="flex items-center justify-between px-5 py-3.5 border-b bg-card/90 backdrop-blur-md sticky top-0 z-20 shrink-0">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="icon-sm" onClick={() => router.back()}>
                <ChevronLeft className="size-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Go back</TooltipContent>
          </Tooltip>

          <div className="text-center">
            <h1 className="text-base font-semibold text-foreground leading-none">Checkout</h1>
            <p className="text-xs font-medium uppercase text-primary mt-0.5">Table {tableId}</p>
          </div>

          <Badge variant="secondary">
            {orderedItems.reduce((s, i) => s + i.quantity, 0)} items
          </Badge>
        </header>

        <ScrollArea className="flex-1">
          <div className="max-w-lg mx-auto px-5 py-6 space-y-6">
            <Card size="sm">
              <CardHeader className="border-b">
                <CardTitle className="text-sm uppercase">Items Ordered</CardTitle>
                <CardDescription className="text-xs">Table {tableId} active bill</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                {orderedItems.length === 0 ? (
                  <Empty className="py-12">
                    <EmptyHeader>
                      <EmptyMedia variant="icon">
                        <ShoppingCart />
                      </EmptyMedia>
                      <EmptyTitle className="text-base">No items found</EmptyTitle>
                      <EmptyDescription>No active orders for this table</EmptyDescription>
                    </EmptyHeader>
                  </Empty>
                ) : (
                  <div className="divide-y">
                    {orderedItems.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-3.5 px-4 py-3">
                        <div className="size-11 rounded-lg overflow-hidden shrink-0 border bg-muted">
                          <img
                            src={getDishImage(item.name)}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold truncate">{item.name}</p>
                          <p className="text-xs text-muted-foreground">
                            ×{item.quantity} · KSh {item.price.toLocaleString()} each
                          </p>
                        </div>
                        <p className="text-sm font-bold tabular-nums text-primary shrink-0">
                          KSh {(item.price * item.quantity).toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card size="sm">
              <CardHeader>
                <CardTitle className="text-sm uppercase">Express Gratitude</CardTitle>
                <CardDescription className="text-xs">Optional gratuity for service</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-4 gap-2">
                  {TIP_PRESETS.map((t) => {
                    const isActive =
                      (!isCustomTip && selectedTip === t.pct) || (isCustomTip && t.pct === -1)
                    return (
                      <Button
                        key={t.label}
                        variant={isActive ? "default" : "outline"}
                        onClick={() => {
                          if (t.pct === -1) {
                            setIsCustomTip(true)
                            setSelectedTip(0)
                          } else {
                            setIsCustomTip(false)
                            setSelectedTip(t.pct)
                          }
                        }}
                      >
                        {t.label}
                      </Button>
                    )
                  })}
                </div>

                {isCustomTip && (
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-muted-foreground">
                      KSh
                    </span>
                    <Input
                      type="number"
                      placeholder="Enter amount"
                      value={customTip}
                      onChange={(e) => setCustomTip(e.target.value)}
                      className="pl-12"
                    />
                  </div>
                )}
              </CardContent>
            </Card>

            <Card size="sm">
              <CardHeader>
                <CardTitle className="text-sm uppercase">Payment Method</CardTitle>
                <CardDescription className="text-xs">Choose how to settle</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2.5">
                {PAYMENT_METHODS.map((method) => {
                  const Icon = method.icon
                  const active = paymentMethod === method.id
                  return (
                    <Button
                      key={method.id}
                      variant={active ? "secondary" : "outline"}
                      onClick={() => setPaymentMethod(method.id)}
                      className={cn(
                        "w-full h-auto justify-start gap-3.5 px-4 py-3 text-left",
                        active && "border-primary ring-1 ring-primary/25",
                      )}
                    >
                      <div
                        className={cn(
                          "flex size-10 items-center justify-center rounded-lg shrink-0",
                          method.tone,
                        )}
                      >
                        <Icon className="size-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-foreground">{method.label}</p>
                        <p className="text-xs text-muted-foreground font-normal">{method.desc}</p>
                      </div>
                      <div
                        className={cn(
                          "flex size-5 items-center justify-center rounded-full border-2 shrink-0",
                          active
                            ? "bg-primary border-primary text-primary-foreground"
                            : "border-border",
                        )}
                      >
                        {active && <Check className="size-3" />}
                      </div>
                    </Button>
                  )
                })}
              </CardContent>
            </Card>
          </div>
        </ScrollArea>

        <footer className="shrink-0 border-t bg-card px-5 py-4">
          <div className="max-w-lg mx-auto space-y-3">
            <Card size="sm" className="bg-muted/40">
              <CardContent className="flex items-center justify-between">
                <div className="space-y-1 text-xs">
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <span>Subtotal</span>
                    <span className="font-medium text-foreground tabular-nums">
                      KSh {subtotal.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <span>VAT (16%)</span>
                    <span className="font-medium text-foreground tabular-nums">
                      KSh {taxAmount.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <span>Tip</span>
                    <span className="font-medium text-foreground tabular-nums">
                      KSh {tipAmount.toLocaleString()}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-semibold uppercase text-muted-foreground">
                    Grand Total
                  </p>
                  <p className="text-2xl font-bold tabular-nums text-primary">
                    KSh {grandTotal.toLocaleString()}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Button
              onClick={handlePay}
              disabled={orderedItems.length === 0}
              size="lg"
              className="w-full h-12 gap-2"
            >
              <CreditCard className="size-4" />
              <span>Confirm &amp; Pay · KSh {grandTotal.toLocaleString()}</span>
              <ArrowRight className="size-4" />
            </Button>
          </div>
        </footer>
      </div>
    </TooltipProvider>
  )
}
