"use client"

import { useState, useMemo, useEffect, useRef, useCallback } from "react"
import { use } from "react"
import { useRouter, usePathname } from "next/navigation"
import {
  ShoppingCart, Plus, Minus, Search, X,
  UtensilsCrossed, Clock, Star, Receipt,
  Check, ChevronRight, Volume2, VolumeX,
  Flame, Leaf, ChefHat, Crown, Loader2, BellRing
} from "lucide-react"
import { MenuItem, CartItem } from "@/lib/types"
import { OrderService, LiveOrder } from "@/lib/order-service"
import { supabase } from "@/lib/supabase"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import {
  Sheet, SheetContent, SheetDescription,
  SheetHeader, SheetTitle, SheetTrigger, SheetFooter,
} from "@/components/ui/sheet"
import {
  Dialog, DialogContent, DialogDescription,
  DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

// ─── Imagery ──────────────────────────────────────────────────────────────────
const DISH_IMAGES: Record<string, string> = {
  "Nyama Choma":   "https://images.unsplash.com/photo-1544025162-d76694265947?w=800&q=80",
  "Pilau":         "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80",
  "Chicken Tikka": "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=800&q=80",
  "Filet Mignon":  "https://images.unsplash.com/photo-1558030006-450675393462?w=800&q=80",
  "Caesar Salad":  "https://images.unsplash.com/photo-1546793665-c74683f339c1?w=800&q=80",
  "Pasta":         "https://images.unsplash.com/photo-1612874742237-6526221588e3?w=800&q=80",
  "Pizza":         "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&q=80",
  "Tiramisu":      "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=800&q=80",
  "Chocolate":     "https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=800&q=80",
  "Cappuccino":    "https://images.unsplash.com/photo-1534778101976-62847782c213?w=800&q=80",
  "Samosa":        "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&q=80",
  "Soup":          "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=800&q=80",
  "Beef Stew":     "https://images.unsplash.com/photo-1534939561126-855b8675edd7?w=800&q=80",
  "Wings":         "https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=800&q=80",
  "Greek Salad":   "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=800&q=80",
  "Spring Rolls":  "https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?w=800&q=80",
  "Coffee":        "https://images.unsplash.com/photo-1461023233037-9619c235bb6c?w=800&q=80",
  "Smoothie":      "https://images.unsplash.com/photo-1502741224143-90386d7cd8c9?w=800&q=80",
  "Fruit Salad":   "https://images.unsplash.com/photo-1519996529931-28324d5a630e?w=800&q=80",
  "Pancakes":      "https://images.unsplash.com/photo-1528207776546-365bb710ee93?w=800&q=80",
  "Red Velvet":    "https://images.unsplash.com/photo-1586788680434-30d324671ff6?w=800&q=80",
  "Apple Pie":     "https://images.unsplash.com/photo-1535927842962-cfb0929b291d?w=800&q=80",
}
const FALLBACK  = "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80"
const HERO_IMAGE = "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=1200&q=80"

const CATEGORY_DISPLAY: Record<string, { label: string; emoji: string }> = {
  All:      { label: "All",         emoji: "🍽️" },
  starters: { label: "Appetizers",  emoji: "🥗" },
  main:     { label: "Main Dishes", emoji: "🥩" },
  seafood:  { label: "Seafood",     emoji: "🦞" },
  snacks:   { label: "Snacks",      emoji: "🍿" },
  desserts: { label: "Desserts",    emoji: "🍰" },
  drinks:   { label: "Beverages",   emoji: "🍷" },
}

function getDishImage(item: MenuItem | string) {
  const name = typeof item === 'string' ? item : item.name
  const image = typeof item === 'object' ? item.image : ""
  
  if (image) return image
  for (const [k, v] of Object.entries(DISH_IMAGES)) {
    if (name.toLowerCase().includes(k.toLowerCase())) return v
  }
  return FALLBACK
}

// ─── Types ────────────────────────────────────────────────────────────────────
// Using types from @/lib/types
// Types
// (CartItem and MenuItem are imported from @/lib/types)

const categories = ["All", "starters", "main", "seafood", "snacks", "desserts", "drinks"]



// ─────────────────────────────────────────────────────────────────────────────
export default function CustomerMenuPage({ params }: { params: Promise<{ tableId: string }> }) {
  const { tableId } = use(params)
  const router = useRouter()

  const [menuItems, setMenuItems]           = useState<MenuItem[]>([])
  const [isLoading, setIsLoading]           = useState(true)
  const [cart, setCart]                     = useState<CartItem[]>([])
  const [searchQuery, setSearchQuery]       = useState("")
  const [activeCategory, setActiveCategory] = useState("All")
  const [selectedItem, setSelectedItem]     = useState<MenuItem | null>(null)
  const [itemNotes, setItemNotes]           = useState("")

  // ─── Fetch Menu Data ──────────────────────────────────────────────────────
  useEffect(() => {
    async function fetchMenu() {
      try {
        const response = await fetch('/api/menu', { cache: 'no-store' })
        const data = await response.json()
        setMenuItems(data)
      } catch (error) {
        console.error("Failed to fetch menu:", error)
        toast.error("Failed to load menu items.")
      } finally {
        setIsLoading(false)
      }
    }
    fetchMenu()
  }, [])

  const currentTableId = (tableId || "").replace(/^0+/, "")
  const [activeOrders, setActiveOrders]     = useState<LiveOrder[]>([])
  const [orderedItems, setOrderedItems]     = useState<CartItem[]>([])
  const [showBillBanner, setShowBillBanner] = useState(false)
  const [orderConfirmed, setOrderConfirmed] = useState(false)
  const billTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const [hasStarted, setHasStarted] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)
  const [isMuted, setIsMuted] = useState(false)

  // ─── Live Data Sync ────────────────────────────────────────────────────────
  useEffect(() => {
    const unsubscribe = OrderService.subscribe((allOrders: LiveOrder[]) => {
      const myTableOrders = allOrders.filter((o: LiveOrder) => 
        o.tableId === currentTableId && 
        o.status !== "served" && 
        o.status !== "cancelled"
      )
      
      setActiveOrders(myTableOrders)

      if (myTableOrders.length > 0) {
        const allItems = myTableOrders.flatMap((o: LiveOrder) => o.items)
        setOrderedItems(allItems)
        
        // Show bill banner if anything is ready
        if (myTableOrders.some((o: LiveOrder) => o.status === "ready")) {
          setShowBillBanner(true)
        } else {
          setShowBillBanner(false)
        }
      } else {
        setOrderedItems([])
        setShowBillBanner(false)
      }
    })
    return unsubscribe
  }, [tableId, currentTableId])

  // ─── Playback handling ──────────────────────────────────────────────────────
  const attemptPlay = useCallback(() => {
    setHasStarted(true) // Instant transition on first tap
    if (audioRef.current) {
      audioRef.current.muted = false
      audioRef.current.play()
        .then(() => {
          setIsMuted(false)
          // Success! Remove all possible triggers
          window.removeEventListener("click", attemptPlay, true)
          window.removeEventListener("touchstart", attemptPlay, true)
          window.removeEventListener("scroll", attemptPlay, true)
        })
        .catch((err) => {
          console.log("Audio still blocked:", err)
          setHasStarted(true) // Ensure menu opens even if audio fails
        })
    }
  }, [])

  useEffect(() => {
    // Aggressive fallback: "Capture phase" listeners to catch interactions
    window.addEventListener("click", attemptPlay, { capture: true })
    window.addEventListener("touchstart", attemptPlay, { capture: true })
    window.addEventListener("scroll", attemptPlay, { capture: true })

    // Try playing immediately (might work if coming from same-tab navigation)
    attemptPlay()

    return () => {
      window.removeEventListener("click", attemptPlay, true)
      window.removeEventListener("touchstart", attemptPlay, true)
      window.removeEventListener("scroll", attemptPlay, true)
    }
  }, [attemptPlay])

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !audioRef.current.muted
      setIsMuted(audioRef.current.muted)
      if (!audioRef.current.muted && audioRef.current.paused)
        audioRef.current.play().catch(() => {})
    }
  }

  const handleCallWaiter = async () => {
    // Send to Supabase for real-time alerting
    const { error } = await supabase
      .from('summons')
      .insert([
        { 
          staff_id: 0, // 0 signifies a Customer Call
          staff_name: `Table ${tableId}`, 
          status: 'pending' 
        }
      ])

    if (error) {
      console.error("Summon Error:", error)
      toast.error("Call failed. Please try again or visit the counter.")
      return
    }

    toast.custom((t) => (
      <div className="w-[320px] bg-white/95 dark:bg-zinc-900/95 backdrop-blur-xl border border-primary/10 rounded-2xl p-4 shadow-2xl flex items-center gap-4 animate-in slide-in-from-top-2 duration-300">
        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
          <BellRing className="h-6 w-6 text-primary animate-pulse" />
        </div>
        <div className="flex-1">
          <h4 className="text-sm font-bold text-zinc-900 dark:text-white uppercase ">Request Sent</h4>
          <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5 leading-relaxed">
            A waiter is on their way to Table {tableId} right now.
          </p>
        </div>
        <button onClick={() => toast.dismiss(t)} className="text-zinc-400 hover:text-zinc-900 dark:hover:text-white">
          <X className="h-4 w-4" />
        </button>
      </div>
    ), { duration: 5000, position: "top-center" })
  }

  const filteredItems = useMemo(() =>
    menuItems.filter(item => {
      const matchCat    = activeCategory === "All" || item.category === activeCategory
      const matchSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.description.toLowerCase().includes(searchQuery.toLowerCase())
      return matchCat && matchSearch
    }), [menuItems, activeCategory, searchQuery])

  const cartTotal     = useMemo(() => cart.reduce((s, i) => s + i.price * i.quantity, 0), [cart])
  const cartItemCount = useMemo(() => cart.reduce((s, i) => s + i.quantity, 0), [cart])

  const orderedSubtotal = useMemo(() =>
    orderedItems.reduce((s, i) => s + i.price * i.quantity, 0), [orderedItems])

  const addToCart = (item: MenuItem, notes?: string) =>
    setCart(prev => {
      const ex = prev.find(i => i.id === item.id)
      return ex
        ? prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1, notes: notes || i.notes } : i)
        : [...prev, { ...item, quantity: 1, notes }]
    })

  const updateQuantity = (id: string, delta: number) =>
    setCart(prev => prev.map(i => i.id === id ? { ...i, quantity: i.quantity + delta } : i).filter(i => i.quantity > 0))

  const removeFromCart = (id: string) => setCart(prev => prev.filter(i => i.id !== id))

  const handlePlaceOrder = () => {
    const snapshot = [...cart]
    
    try {
      OrderService.placeOrder(currentTableId, snapshot)
      toast.success("Order sent to kitchen!")
      
      setOrderConfirmed(true)
      setCart([])
      
      if (billTimerRef.current) clearTimeout(billTimerRef.current)
      billTimerRef.current = setTimeout(() => setShowBillBanner(true), 10000)
      setTimeout(() => setOrderConfirmed(false), 3000)
    } catch (err) {
      console.error("Failed to broadcast order:", err)
      toast.error("Connectivity issue. Try again.")
    }
  }

  // ── Cart Sheet ───────────────────────────────────────────────────────────
  const CartSheet = () => (
    <SheetContent
      className="w-full sm:max-w-[420px] p-0 flex flex-col border-l"
      style={{ background:"#FDFCFF", borderColor:"oklch(0.45 0.12 285 / 0.12)" }}
    >
      <SheetHeader
        className="px-6 pt-6 pb-4 shrink-0"
      >
        <div className="flex items-center gap-3">
          <div
            className="flex items-center justify-center w-9 h-9 rounded-xl"
            style={{ background:"oklch(0.45 0.12 285 / 0.1)" }}
          >
            <ShoppingCart className="h-4 w-4" style={{ color:"oklch(0.45 0.12 285)" }} />
          </div>
          <div>
            <SheetTitle className="text-[15px] font-bold " style={{ color:"#0D031B" }}>
              Your Order
            </SheetTitle>
            <SheetDescription className="text-[10px] uppercase  font-semibold mt-0.5" style={{ color:"oklch(0.45 0.12 285)" }}>
              Table {tableId}
            </SheetDescription>
          </div>
        </div>
      </SheetHeader>

      <ScrollArea className="flex-1 px-6 py-4">
        {orderConfirmed ? (
          <div className="flex flex-col items-center justify-center py-20 text-center gap-4 animate-in fade-in zoom-in duration-500">
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center"
              style={{ background:"oklch(0.7 0.15 150 / 0.12)" }}
            >
              <div
                className="w-13 h-13 rounded-full flex items-center justify-center shadow-lg w-12 h-12"
                style={{ background:"oklch(0.7 0.15 150)", boxShadow:"0 4px 16px oklch(0.7 0.15 150 / 0.4)" }}
              >
                <Check className="text-white w-6 h-6" />
              </div>
            </div>
            <div>
              <h3 className="font-bold text-lg " style={{ color:"#0D031B" }}>Order Confirmed!</h3>
              <p className="text-xs mt-1 leading-relaxed" style={{ color:"#736C83" }}>
                Your selection is on its way to the kitchen.
              </p>
            </div>
          </div>
        ) : cart.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center gap-4">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ background:"oklch(0.45 0.12 285 / 0.08)" }}>
              <ShoppingCart className="h-8 w-8" style={{ color:"oklch(0.45 0.12 285 / 0.4)" }} />
            </div>
            <div>
              <p className="font-semibold text-sm" style={{ color:"#3D374C" }}>Nothing here yet</p>
              <p className="text-xs mt-0.5" style={{ color:"#736C83" }}>Browse the menu and add items</p>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {cart.map(item => (
              <div
                key={item.id}
                className="flex items-center gap-3 p-3 rounded-2xl"
                style={{ background:"white" }}
              >
                {/* Item thumbnail */}
                <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0">
                  <img src={getDishImage(item)} alt={item.name} className="w-full h-full object-cover" />
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-semibold truncate" style={{ color:"#0D031B" }}>{item.name}</p>
                  <p className="text-[11px] font-medium mt-0.5" style={{ color:"oklch(0.45 0.12 285)" }}>
                    KSh {(item.price * item.quantity).toLocaleString()}
                  </p>
                </div>

                <div
                  className="flex items-center gap-1.5 rounded-full p-1"
                  style={{ background:"oklch(0.45 0.12 285 / 0.06)" }}
                >
                  <button
                    className="flex items-center justify-center w-7 h-7 rounded-full transition-colors hover:bg-white"
                    style={{ color:"oklch(0.45 0.12 285)" }}
                    onClick={() => updateQuantity(item.id, -1)}
                  >
                    <Minus className="h-3 w-3" />
                  </button>
                  <span className="w-5 text-center text-xs font-bold" style={{ color:"#0D031B" }}>{item.quantity}</span>
                  <button
                    className="flex items-center justify-center w-7 h-7 rounded-full text-white transition-colors"
                    style={{ background:"oklch(0.45 0.12 285)" }}
                    onClick={() => updateQuantity(item.id, 1)}
                  >
                    <Plus className="h-3 w-3" />
                  </button>
                </div>

                <button
                  className="flex items-center justify-center w-7 h-7 rounded-full transition-colors hover:bg-red-50"
                  style={{ color:"#AEA6BF" }}
                  onClick={() => removeFromCart(item.id)}
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>

      {cart.length > 0 && !orderConfirmed && (
        <SheetFooter
          className="flex-col gap-4 px-6 py-5 border-t shrink-0"
          style={{ borderColor:"oklch(0.45 0.12 285 / 0.1)" }}
        >
          {/* Total row */}
          <div
            className="flex justify-between items-center px-4 py-3 rounded-2xl"
            style={{ background:"oklch(0.45 0.12 285 / 0.06)" }}
          >
            <span className="text-sm font-semibold" style={{ color:"#3D374C" }}>Total</span>
            <span className="text-lg font-bold tabular-nums" style={{ color:"oklch(0.45 0.12 285)" }}>
              KSh {cartTotal.toLocaleString()}
            </span>
          </div>

          <Button
            className="w-full h-13 text-[13px] font-bold uppercase  text-white rounded-2xl transition-all hover:opacity-90 hover:-translate-y-0.5 active:translate-y-0 border-none h-12"
            style={{
              background:"oklch(0.45 0.12 285)",
              boxShadow:"0 6px 24px oklch(0.45 0.12 285 / 0.35)",
            }}
            onClick={handlePlaceOrder}
          >
            <Check className="h-4 w-4 mr-2" />
            Confirm Order
          </Button>
        </SheetFooter>
      )}
    </SheetContent>
  )

  // ─────────────────────────────────────────────────────────── MAIN PAGE ──

  // ─────────────────────────────────────────────────────────── MAIN PAGE ──
  return (
    <TooltipProvider>
      <style>{`
        @keyframes pulse-ready {
          0% { box-shadow: 0 0 0 0 oklch(0.62 0.16 150 / 0.4); }
          70% { box-shadow: 0 0 0 10px oklch(0.62 0.16 150 / 0); }
          100% { box-shadow: 0 0 0 0 oklch(0.62 0.16 150 / 0); }
        }
        @keyframes flow-shine {
          0% { transform: translateX(-150%) skewX(-25deg); }
          50%, 100% { transform: translateX(150%) skewX(-25deg); }
        }
      `}</style>
      <div className={cn("flex flex-col min-h-screen pb-32 transition-all duration-1000", !hasStarted ? "blur-xl" : "blur-0")} style={{ background:"#F5F2FB" }}>

        <audio ref={audioRef} src="/preview.mp3" autoPlay loop className="hidden" playsInline />

        {/* ── Welcome Overlay ─────────────────────────────────────── */}
        {!hasStarted && (
          <div 
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center p-6 text-center overflow-hidden animate-in fade-in duration-1000"
            style={{ 
              background: `oklch(0.45 0.12 285) url(${HERO_IMAGE})`,
              backgroundSize: "cover",
              backgroundPosition: "center"
            }}
          >
            {/* Bright Premium Glass Layer */}
            <div 
               className="absolute inset-0 backdrop-blur-xl transition-all duration-1000"
               style={{ 
                 background: "linear-gradient(135deg, oklch(0.6 0.15 285 / 0.4), oklch(0.45 0.12 285 / 0.8))" 
               }} 
            />
            
            <div className="relative space-y-12 animate-in zoom-in-95 slide-in-from-bottom-12 duration-1000">
              <div className="flex flex-col items-center gap-6">
                <div 
                  className="flex items-center justify-center w-28 h-28 rounded-[3rem] animate-pulse"
                  style={{ 
                    background:"oklch(0.45 0.12 285)", 
                    boxShadow:"0 20px 60px oklch(0.45 0.12 285 / 0.7)",
                    border: "1px solid rgba(255,255,255,0.3)"
                  }}
                >
                  <UtensilsCrossed className="h-12 w-12 text-white" />
                </div>
                <div className="space-y-2 text-center">
                  <h1 className="text-7xl font-black text-white tracking-tighter uppercase ">Resto</h1>
                  <p className="text-white/60 text-[11px] font-bold uppercase tracking-[0.4em] flex items-center gap-4 justify-center">
                    <span className="w-10 h-px bg-white/20" />
                    Bespoke Dining
                    <span className="w-10 h-px bg-white/20" />
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-white/70 text-[13px] font-medium">
                  Welcome to <span className="font-bold text-white">Table {tableId}</span>
                </p>
                
                <button
                  onClick={() => attemptPlay()}
                  className="group relative px-16 py-5 rounded-full transition-all hover:scale-105 active:scale-[0.98] overflow-hidden"
                  style={{ 
                    background: "white",
                    boxShadow: "0 25px 50px rgba(0,0,0,0.4)"
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span className="relative flex items-center gap-4 text-[15px] font-black uppercase tracking-widest text-[#0D031B]">
                    Enjoy Experience
                    <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center transition-transform group-hover:translate-x-1">
                      <ChevronRight className="h-4 w-4 text-primary" />
                    </div>
                  </span>
                </button>
              </div>
            </div>

            {/* Premium Branding Footer */}
            <div className="absolute bottom-12 left-0 right-0 flex flex-col items-center gap-3 opacity-40 select-none animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-500">
               <div className="w-1 h-12 bg-gradient-to-b from-transparent via-white/50 to-transparent rounded-full" />
              <span className="text-[10px] text-white font-bold uppercase tracking-[0.3em]">Tap to begin</span>
            </div>
          </div>
        )}

        <div className="relative h-80 w-full overflow-hidden">
          <img
            src={HERO_IMAGE}
            alt="Restaurant ambiance"
            className="w-full h-full object-cover scale-105 animate-in fade-in zoom-in duration-1000"
          />
          {/* Gradient overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0D031B]/90 via-[#0D031B]/30 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0D031B]/30 to-transparent" />

          {/* Brand */}
          <div className="absolute bottom-0 left-0 right-0 p-6 pb-8">
            <div className="flex items-end justify-between">
              <div>
                <div className="flex items-center gap-3 mb-1.5">
                  <div
                    className="flex items-center justify-center w-9 h-9 rounded-xl"
                    style={{ background:"oklch(0.45 0.12 285)", boxShadow:"0 4px 16px oklch(0.45 0.12 285 / 0.5)" }}
                  >
                    <UtensilsCrossed className="h-4.5 w-4.5 text-white" />
                  </div>
                  <h1 className="text-3xl font-bold  text-white uppercase">Resto</h1>
                </div>
                <p className="text-[10px] text-white/70 uppercase  font-medium flex items-center gap-2 pl-1">
                  <span className="w-6 h-px bg-white/40 inline-block" />
                  Experience Excellence
                </p>
              </div>

              {/* Table badge */}
              <div
                className="flex flex-col items-center justify-center px-4 py-2.5 rounded-2xl text-center"
                style={{
                  background:"rgba(255,255,255,0.1)",
                  backdropFilter:"blur(12px)",
                  border:"1px solid rgba(255,255,255,0.18)",
                }}
              >
                <span className="text-[9px] text-white/60 uppercase  font-medium">Table</span>
                <span className="text-2xl font-bold text-white leading-none mt-0.5">{tableId}</span>
              </div>
            </div>
          </div>

          {/* Top-right controls */}
          <div className="absolute top-5 right-5 flex items-center gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={toggleMute}
                  className="flex items-center justify-center w-10 h-10 rounded-xl transition-all hover:scale-105"
                  style={{
                    background:"rgba(255,255,255,0.12)",
                    backdropFilter:"blur(12px)",
                    border:"1px solid rgba(255,255,255,0.18)",
                    color:"white",
                  }}
                >
                  {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                </button>
              </TooltipTrigger>
              <TooltipContent>{isMuted ? "Unmute" : "Mute"} music</TooltipContent>
            </Tooltip>

            <Sheet>
              <SheetTrigger asChild>
                <button
                  className="relative flex items-center justify-center w-10 h-10 rounded-xl transition-all hover:scale-105"
                  style={{
                    background:"rgba(255,255,255,0.12)",
                    backdropFilter:"blur(12px)",
                    border:"1px solid rgba(255,255,255,0.18)",
                    color:"white",
                  }}
                >
                  <ShoppingCart className="h-4 w-4" />
                  {cartItemCount > 0 && (
                    <span
                      className="absolute -top-1.5 -right-1.5 flex items-center justify-center rounded-full text-[10px] font-bold text-white"
                      style={{
                        minWidth:"18px", height:"18px", padding:"0 4px",
                        background:"oklch(0.65 0.18 25)",
                        boxShadow:"0 2px 8px oklch(0.65 0.18 25 / 0.5)",
                      }}
                    >
                      {cartItemCount}
                    </span>
                  )}
                </button>
              </SheetTrigger>
              <CartSheet />
            </Sheet>
          </div>
        </div>

        {/* ── Order confirmed toast ──────────────────────────────────── */}
        {orderConfirmed && (
          <div className="mx-4 -mt-5 relative z-20 animate-in slide-in-from-bottom-4 fade-in duration-500">
            <div
              className="flex items-center gap-3 px-5 py-4 rounded-2xl shadow-xl"
              style={{
                background:"oklch(0.7 0.15 150)",
                boxShadow:"0 8px 32px oklch(0.7 0.15 150 / 0.4)",
              }}
            >
              <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                <Check className="h-4 w-4 text-white" />
              </div>
              <div>
                <p className="text-sm font-bold text-white">Order Confirmed!</p>
                <p className="text-[11px] text-white/80">Kitchen is preparing your meal.</p>
              </div>
            </div>
          </div>
        )}

        {/* ── Main content ─────────────────────────────────────────────── */}
        <div className="max-w-7xl mx-auto w-full px-4 mt-5 space-y-5 flex-1">

          {/* Search */}
          <div className="relative">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 pointer-events-none"
              style={{ color:"#AEA6BF" }}
            />
            <Input
              placeholder="Search the menu…"
              value={searchQuery}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
              className="pl-11 h-12 rounded-2xl text-sm border"
              style={{
                background:"rgba(255,255,255,0.85)",
                backdropFilter:"blur(12px)",
                borderColor:"oklch(0.45 0.12 285 / 0.15)",
                color:"#0D031B",
              }}
            />
            {searchQuery && (
              <button
                className="absolute right-3.5 top-1/2 -translate-y-1/2 flex items-center justify-center w-6 h-6 rounded-full"
                style={{ background:"#EBE6F8", color:"#736C83" }}
                onClick={() => setSearchQuery("")}
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Categories */}
          <div className="flex gap-2.5 overflow-x-auto py-1 no-scrollbar">
            {categories.map(cat => {
              const active = activeCategory === cat
              const display = CATEGORY_DISPLAY[cat] || { label: cat, emoji: "🍽️" }
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={cn(
                    "flex items-center gap-2 whitespace-nowrap px-4 h-10 rounded-xl text-[11px] font-bold uppercase  transition-all duration-200 shrink-0",
                    active ? "text-white scale-105" : "hover:scale-105",
                  )}
                  style={
                    active
                      ? { background:"oklch(0.45 0.12 285)", boxShadow:"0 4px 16px oklch(0.45 0.12 285 / 0.35)", color:"white" }
                      : { background:"rgba(255,255,255,0.8)", color:"#3D374C" }
                  }
                >
                  <span style={{ fontSize:15 }}>{display.emoji}</span>
                  {display.label}
                </button>
              )
            })}
          </div>

          {/* ── Results count ─────────────────────────────────────────── */}
          <div className="flex items-center justify-between px-1">
            <p className="text-[11px] font-medium uppercase " style={{ color:"#9A94AA" }}>
              {filteredItems.length} {filteredItems.length === 1 ? "dish" : "dishes"}
              {activeCategory !== "All" && ` · ${CATEGORY_DISPLAY[activeCategory]?.label || activeCategory}`}
            </p>
            {searchQuery && (
              <p className="text-[11px]" style={{ color:"#9A94AA" }}>
                Showing results for "<span style={{ color:"oklch(0.45 0.12 285)" }}>{searchQuery}</span>"
              </p>
            )}
          </div>

          {/* ── Menu Grid ─────────────────────────────────────────────── */}
          <div className="grid gap-4 grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 pb-12">
            {filteredItems.map((item, idx) => {
              const inCart = cart.find(i => i.id === item.id)
              const qty    = inCart?.quantity || 0
              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedItem(item)}
                  className="group cursor-pointer rounded-lg overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl"
                  style={{
                    background:"rgba(255,255,255,0.88)",
                    backdropFilter:"blur(12px)",
                    boxShadow:"0 2px 12px rgba(13,3,27,0.06)",
                    animationDelay:`${idx * 40}ms`,
                  }}
                >
                  {/* Image */}
                  <div className="relative aspect-[4/3] overflow-hidden rounded-t-lg mx-0 shrink-0">
                    <img
                      src={getDishImage(item)}
                      alt={item.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                      loading="lazy"
                    />
                    {/* Scrim */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

                    {/* Top-left badges */}
                    <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 items-start">
                      {item.popular && (
                        <span
                          className="flex items-center gap-1 text-[9px] font-bold uppercase  px-2 py-1 rounded-full"
                          style={{ background:"oklch(0.45 0.12 285 / 0.85)", color:"white", backdropFilter:"blur(8px)" }}
                        >
                          <Crown className="h-2.5 w-2.5" />
                          Chef's Pick
                        </span>
                      )}
                      {item.vegetarian && (
                        <span
                          className="flex items-center gap-1 text-[9px] font-bold uppercase  px-2 py-1 rounded-full"
                          style={{ background:"oklch(0.7 0.15 150 / 0.85)", color:"white", backdropFilter:"blur(8px)" }}
                        >
                          <Leaf className="h-2.5 w-2.5" />
                          Veg
                        </span>
                      )}
                    </div>

                    {/* Category Label - Top Right */}
                    <div className="absolute top-2.5 right-2.5">
                      <span
                        className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider px-2 py-1 rounded-full text-white"
                        style={{
                          background: "oklch(0.45 0.12 285 / 0.7)",
                          backdropFilter: "blur(6px)",
                        }}
                      >
                        {item.category}
                      </span>
                    </div>

                    {/* Price bottom-left */}
                    <div className="absolute bottom-2.5 left-3">
                      <p className="text-white font-bold text-[15px] leading-none tabular-nums drop-shadow">
                        <span className="text-[10px] font-medium text-white/75 mr-0.5 uppercase">KSh</span>
                        {item.price.toLocaleString()}
                      </p>
                    </div>

                    {/* Rating bottom-right */}
                    <div
                      className="absolute bottom-2.5 right-2.5 flex items-center gap-1 px-2 py-1 rounded-xl"
                      style={{ background:"rgba(0,0,0,0.35)", backdropFilter:"blur(6px)" }}
                    >
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <span className="text-white text-[10px] font-bold">{item.rating || 4.5}</span>
                    </div>

                    {/* Quantity Control Overlay - Bottom Centre */}
                    {inCart && (
                        <div 
                          className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                          onClick={e => e.stopPropagation()}
                        >
                           <div
                              className="flex items-center gap-1.5 rounded-full p-1 border shadow-xl"
                              style={{ 
                                background:"rgba(255,255,255,0.92)", 
                                backdropFilter:"blur(12px)",
                                borderColor:"oklch(0.45 0.12 285 / 0.15)"
                              }}
                            >
                              <button
                                className="flex items-center justify-center w-8 h-8 rounded-full transition-colors hover:bg-[#EBE6F8]"
                                style={{ color:"oklch(0.45 0.12 285)" }}
                                onClick={() => updateQuantity(item.id, -1)}
                              >
                                <Minus className="h-3.5 w-3.5" />
                              </button>
                              <span className="text-[13px] font-bold w-6 text-center" style={{ color:"#0D031B" }}>{qty}</span>
                              <button
                                className="flex items-center justify-center w-8 h-8 rounded-full text-white"
                                style={{ background:"oklch(0.45 0.12 285)" }}
                                onClick={() => updateQuantity(item.id, 1)}
                              >
                                <Plus className="h-3.5 w-3.5" />
                              </button>
                            </div>
                        </div>
                    )}
                  </div>

                  {/* Body */}
                  <div className="flex flex-col flex-1 px-3 pt-3 pb-3 gap-2">
                    <div className="flex items-start justify-between gap-1.5">
                      <h3 className="text-[12px] font-bold leading-tight line-clamp-2 text-[#0D031B]">
                        {item.name}
                      </h3>
                    </div>

                    {/* Ingredients / Description strip */}
                    <p className="text-[10px] text-muted-foreground/80 line-clamp-1 italic">
                      {item.description || "Prepared with fresh local ingredients"}
                    </p>

                    {/* Action Strip */}
                    <div className="flex flex-col gap-2 pt-2 mt-auto border-t" style={{ borderColor: "oklch(0.45 0.12 285 / 0.08)" }}>
                      {!inCart ? (
                        <button
                          onClick={(e) => { e.stopPropagation(); addToCart(item); }}
                          className="flex items-center justify-center gap-1.5 text-[9px] font-bold uppercase tracking-wider px-2 py-2 rounded-lg transition-all text-white active:scale-95"
                          style={{
                            background: "oklch(0.45 0.12 285)",
                            boxShadow: "0 4px 12px oklch(0.45 0.12 285 / 0.25)"
                          }}
                        >
                          <Plus className="h-3 w-3" />
                          Add to Tray
                        </button>
                      ) : (
                        <div className="flex items-center justify-between w-full px-1 py-1">
                           <div className="flex items-center gap-1.5 text-[9px] font-bold uppercase text-emerald-600">
                             <Check className="h-3 w-3" />
                             In Tray
                           </div>
                           <button
                             onClick={(e) => { e.stopPropagation(); setSelectedItem(item); }}
                             className="text-[9px] font-bold uppercase text-muted-foreground/60 hover:text-primary transition-colors"
                           >
                             View Details
                           </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}

            {/* Empty state */}
            {filteredItems.length === 0 && (
              <div className="col-span-full flex flex-col items-center justify-center py-20 gap-4">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ background:"oklch(0.45 0.12 285 / 0.08)" }}>
                  <ChefHat className="h-8 w-8" style={{ color:"oklch(0.45 0.12 285 / 0.4)" }} />
                </div>
                <div className="text-center">
                  <p className="font-semibold text-sm" style={{ color:"#3D374C" }}>No dishes found</p>
                  <p className="text-xs mt-0.5" style={{ color:"#736C83" }}>Try a different search or category</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── Item Detail Dialog ────────────────────────────────────── */}
        <Dialog open={!!selectedItem} onOpenChange={() => { setSelectedItem(null); setItemNotes("") }}>
          <DialogContent
            className="max-w-sm p-0 overflow-hidden border rounded-3xl"
            style={{ background:"#FDFCFF", borderColor:"oklch(0.45 0.12 285 / 0.12)" }}
          >
            {selectedItem && (
              <>
                {/* Hero image */}
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={getDishImage(selectedItem)}
                    alt={selectedItem.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#FDFCFF] via-transparent to-transparent" />

                  {/* Chips */}
                  <div className="absolute top-3 left-3 flex gap-1.5">
                    {selectedItem.popular && (
                      <span
                        className="flex items-center gap-1 text-[9px] font-bold uppercase  px-2.5 py-1 rounded-full"
                        style={{ background:"oklch(0.45 0.12 285 / 0.85)", color:"white" }}
                      >
                        <Crown className="h-2.5 w-2.5" />
                        Chef's Pick
                      </span>
                    )}
                    {selectedItem.vegetarian && (
                      <span
                        className="flex items-center gap-1 text-[9px] font-bold uppercase  px-2.5 py-1 rounded-full"
                        style={{ background:"oklch(0.7 0.15 150 / 0.85)", color:"white" }}
                      >
                        <Leaf className="h-2.5 w-2.5" />
                        Vegetarian
                      </span>
                    )}
                  </div>
                </div>

                <div className="px-5 pb-5 -mt-2">
                  <DialogHeader className="mb-4">
                    <DialogTitle className="text-xl font-bold " style={{ color:"#0D031B" }}>
                      {selectedItem.name}
                    </DialogTitle>
                    <DialogDescription className="text-xs leading-relaxed mt-1" style={{ color:"#736C83" }}>
                      {selectedItem.description}
                    </DialogDescription>
                  </DialogHeader>

                  {/* Meta chips */}
                  <div className="flex items-center gap-2 mb-4">
                    <span
                      className="flex items-center gap-1.5 text-[10px] font-semibold uppercase  px-3 py-1.5 rounded-lg"
                      style={{ background:"oklch(0.45 0.12 285 / 0.08)", color:"oklch(0.45 0.12 285)" }}
                    >
                      <Clock className="h-3 w-3" />
                      {selectedItem.prepTime}
                    </span>
                    <span
                      className="flex items-center gap-1.5 text-[10px] font-semibold uppercase  px-3 py-1.5 rounded-lg"
                      style={{ background:"oklch(0.75 0.15 75 / 0.1)", color:"oklch(0.55 0.15 75)" }}
                    >
                      <Star className="h-3 w-3 fill-current" />
                      {selectedItem.rating} rating
                    </span>
                    <span
                      className="ml-auto text-[15px] font-bold"
                      style={{ color:"oklch(0.45 0.12 285)" }}
                    >
                      KSh {selectedItem.price.toLocaleString()}
                    </span>
                  </div>

                  {/* Notes */}
                  <div className="space-y-2 mb-5">
                    <label
                      className="text-[10px] font-bold uppercase "
                      style={{ color:"#AEA6BF" }}
                    >
                      Special Instructions
                    </label>
                    <Textarea
                      placeholder="E.g., No onions, extra spicy, well done…"
                      value={itemNotes}
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setItemNotes(e.target.value)}
                      className="resize-none h-20 rounded-xl text-sm border"
                      style={{
                        background:"#F5F2FB",
                        borderColor:"oklch(0.45 0.12 285 / 0.15)",
                        color:"#0D031B",
                      }}
                    />
                  </div>

                  <DialogFooter>
                    <Button
                      className="w-full h-12 text-[13px] font-bold uppercase  text-white rounded-2xl border-none transition-all hover:opacity-90"
                      style={{
                        background:"oklch(0.45 0.12 285)",
                        boxShadow:"0 6px 24px oklch(0.45 0.12 285 / 0.35)",
                      }}
                      onClick={() => { addToCart(selectedItem, itemNotes); setSelectedItem(null); setItemNotes("") }}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add to Order
                    </Button>
                  </DialogFooter>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>

        {/* ── Checkout Sheet Removed (Moved to dedicated /billing page) ── */}

        {/* ── Floating Action Bar ───────────────────────────────────── */}
        <div className="fixed bottom-28 md:bottom-6 left-4 right-4 max-w-lg mx-auto z-50 flex items-stretch gap-2.5 transition-all duration-500">
          {/* Live Session Banner */}
          {orderedItems.length > 0 && (
            <button
              onClick={() => router.push(`/customer/${tableId}/billing`)}
              className="flex-1 flex items-center gap-3 px-4 py-3.5 rounded-[24px] border transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl active:scale-[0.96] animate-in slide-in-from-bottom-6 fade-in duration-700 relative overflow-hidden group"
              style={{
                background: showBillBanner 
                  ? "linear-gradient(135deg, oklch(0.62 0.16 150) 0%, oklch(0.55 0.14 150) 100%)"
                  : "oklch(0.45 0.12 285)",
                backdropFilter: "blur(20px)",
                borderColor: showBillBanner ? "oklch(0.62 0.16 150 / 0.4)" : "rgba(255,255,255,0.12)",
                boxShadow: showBillBanner 
                  ? "0 12px 32px oklch(0.62 0.16 150 / 0.35)"
                  : "0 12px 32px oklch(0.45 0.12 285 / 0.4)",
                animation: showBillBanner ? "pulse-ready 2s infinite" : "none",
              }}
            >
              {/* Shine effect */}
              <div className="absolute inset-0 opacity-20 pointer-events-none group-hover:animate-[flow-shine_2.5s_infinite]"
                   style={{ background: "linear-gradient(90deg, transparent, white, transparent)" }} />

              <div
                className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-inner relative z-10"
                style={{
                  background: showBillBanner ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(255,255,255,0.15)",
                }}
              >
                <div className="relative">
                  <div className="absolute inset-0 blur-lg bg-white/20 animate-pulse" />
                  {showBillBanner ? (
                    <Receipt className="h-5 w-5 relative z-10 text-white" />
                  ) : (
                    <Clock className="h-5 w-5 relative z-10 text-white" />
                  )
                  }
                </div>
              </div>

              <div className="flex-1 text-left min-w-0 relative z-10">
                <p className="text-[12px] font-bold text-white  uppercase truncate">
                  {showBillBanner ? "Bill Ready" : "Preparing Order"}
                </p>
                <p className="text-[10px] font-medium leading-tight opacity-80 truncate" style={{ color: "white" }}>
                  {showBillBanner ? "Tap to settle & rate" : "Live status tracking · View details"}
                </p>
              </div>

              <div
                className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 relative z-10"
                style={{ background: "rgba(255,255,255,0.12)" }}
              >
                <ChevronRight className="h-4 w-4 text-white/80" />
              </div>
            </button>
          )}

          {/* Call waiter */}
          <Tooltip>
            <TooltipTrigger asChild>
                <button
                  className="flex items-center justify-center w-[58px] h-[58px] rounded-[24px] shrink-0 border transition-all duration-300 hover:scale-110 active:scale-90 relative overflow-hidden group/waiter"
                  style={{
                    background: "rgba(255,255,255,0.95)",
                    backdropFilter: "blur(16px)",
                    borderColor: "oklch(0.45 0.12 285 / 0.25)",
                    boxShadow: "0 8px 24px rgba(13,3,27,0.12)",
                    color: "oklch(0.45 0.12 285)",
                  }}
                  onClick={handleCallWaiter}
                >
                  <div className="absolute inset-0 bg-gradient-to-tr from-oklch(0.45 0.12 285 / 0.05) to-transparent opacity-0 group-hover/waiter:opacity-100 transition-opacity" />
                  <UtensilsCrossed className="h-5.5 w-5.5 relative z-10 transition-transform group-hover/waiter:-rotate-12" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="top">Call waiter</TooltipContent>
            </Tooltip>

            {/* Cart CTA */}
            {cartItemCount > 0 && (
              <Sheet>
                <SheetTrigger asChild>
                  <button
                    className="flex-1 flex items-center justify-center gap-2.5 h-[58px] rounded-[24px] text-[13px] font-bold uppercase  text-white transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl active:translate-y-0 relative overflow-hidden group"
                    style={{
                      background: "linear-gradient(135deg, oklch(0.45 0.12 285) 0%, oklch(0.38 0.12 285) 100%)",
                      boxShadow: "0 10px 30px oklch(0.45 0.12 285 / 0.4)",
                      border: "1px solid oklch(0.45 0.12 285 / 0.15)",
                    }}
                  >
                    {/* Gloss Reflection */}
                    <div className="absolute top-0 inset-x-0 h-1/2 bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />
                    
                    {/* Shine */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-20 pointer-events-none group-hover:animate-[flow-shine_2.5s_infinite]"
                         style={{ background: "linear-gradient(90deg, transparent, white, transparent)" }} />

                    <div className="bg-white/15 p-1.5 rounded-xl shrink-0 group-hover:scale-110 transition-transform">
                      <ShoppingCart className="h-4.5 w-4.5 h-5 w-5" />
                    </div>
                    <span>
                      View Order <span className="opacity-60 font-medium">({cartItemCount})</span> · KSh {cartTotal.toLocaleString()}
                    </span>
                  </button>
                </SheetTrigger>
                <CartSheet />
              </Sheet>
            )}
        </div>
      </div>
    </TooltipProvider>
  )
}