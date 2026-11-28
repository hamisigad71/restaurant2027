"use client"

import { useState, useMemo, useEffect, useRef, use } from "react"
import { useRouter } from "next/navigation"
import { AnimatePresence, motion } from "motion/react"
import { FAST_TRANSITION, SPRING_POP, SPRING_SNAPPY } from "@/lib/motion"
import { useIsMobile } from "@/hooks/use-mobile"
import { cn } from "@/lib/utils"
import {
  ShoppingCartIcon as ShoppingCart,
  PlusIcon as Plus,
  MinusIcon as Minus,
  MagnifyingGlassIcon as Search,
  XMarkIcon as X,
  BoltIcon as UtensilsCrossed,
  ClockIcon as Clock,
  StarIcon as Star,
  DocumentTextIcon as Receipt,
  CheckIcon as Check,
  ChevronRightIcon as ChevronRight,
  HandThumbUpIcon as Leaf,
  AcademicCapIcon as ChefHat,
  SparklesIcon as Crown,
  BellAlertIcon as BellRing,
} from "@heroicons/react/24/outline"
import { MenuItem, CartItem } from "@/lib/types"
import { allMenuItems } from "@/lib/menu-data"
import { MenuService } from "@/lib/restaurant-store"
import { OrderService, LiveOrder } from "@/lib/order-service"
import { supabase } from "@/lib/supabase"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { ButtonGroup } from "@/components/ui/button-group"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Field, FieldLabel } from "@/components/ui/field"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

const DISH_IMAGES: Record<string, string> = {
  "Nyama Choma": "https://images.unsplash.com/photo-1544025162-d76694265947?w=800&q=80",
  "Pilau": "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80",
  "Chicken Tikka": "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=800&q=80",
  "Filet Mignon": "https://images.unsplash.com/photo-1558030006-450675393462?w=800&q=80",
  "Caesar Salad": "https://images.unsplash.com/photo-1546793665-c74683f339c1?w=800&q=80",
  "Pasta": "https://images.unsplash.com/photo-1612874742237-6526221588e3?w=800&q=80",
  "Pizza": "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&q=80",
  "Tiramisu": "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=800&q=80",
  "Chocolate": "https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=800&q=80",
  "Cappuccino": "https://images.unsplash.com/photo-1534778101976-62847782c213?w=800&q=80",
  "Samosa": "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&q=80",
  "Soup": "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=800&q=80",
  "Beef Stew": "https://images.unsplash.com/photo-1534939561126-855b8675edd7?w=800&q=80",
  "Wings": "https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=800&q=80",
  "Greek Salad": "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=800&q=80",
  "Spring Rolls": "https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?w=800&q=80",
  "Coffee": "https://images.unsplash.com/photo-1461023233037-9619c235bb6c?w=800&q=80",
  "Smoothie": "https://images.unsplash.com/photo-1502741224143-90386d7cd8c9?w=800&q=80",
  "Fruit Salad": "https://images.unsplash.com/photo-1519996529931-28324d5a630e?w=800&q=80",
  "Pancakes": "https://images.unsplash.com/photo-1528207776546-365bb710ee93?w=800&q=80",
  "Red Velvet": "https://images.unsplash.com/photo-1586788680434-30d324671ff6?w=800&q=80",
  "Apple Pie": "https://images.unsplash.com/photo-1535927842962-cfb0929b291d?w=800&q=80",
}
const FALLBACK = "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80"
const HERO_IMAGE = "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=1200&q=80"

const CATEGORY_DISPLAY: Record<string, { label: string; emoji: string }> = {
  All: { label: "All", emoji: "🍽️" },
  starters: { label: "Appetizers", emoji: "🥗" },
  main: { label: "Main Dishes", emoji: "🥩" },
  seafood: { label: "Seafood", emoji: "🦞" },
  snacks: { label: "Snacks", emoji: "🍿" },
  desserts: { label: "Desserts", emoji: "🍰" },
  drinks: { label: "Beverages", emoji: "🍷" },
}

function getDishImage(item: MenuItem | string) {
  const name = typeof item === "string" ? item : item.name
  const image = typeof item === "object" ? item.image : ""

  if (image) return image
  for (const [k, v] of Object.entries(DISH_IMAGES)) {
    if (name.toLowerCase().includes(k.toLowerCase())) return v
  }
  return FALLBACK
}

const categories = ["All", "starters", "main", "seafood", "snacks", "desserts", "drinks"]

export default function CustomerMenuPage({ params }: { params: Promise<{ tableId: string }> }) {
  const { tableId } = use(params)
  const router = useRouter()
  const isMobile = useIsMobile()

  const [menuItems, setMenuItems] = useState<MenuItem[]>(allMenuItems)
  const [cart, setCart] = useState<CartItem[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState("All")
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null)
  const [itemNotes, setItemNotes] = useState("")
  const [cartOpen, setCartOpen] = useState(false)

  const currentTableId = (tableId || "").replace(/^0+/, "")
  const [orderedItems, setOrderedItems] = useState<CartItem[]>([])
  const [showBillBanner, setShowBillBanner] = useState(false)
  const [orderConfirmed, setOrderConfirmed] = useState(false)
  const billTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    return MenuService.subscribe(setMenuItems)
  }, [])

  useEffect(() => {
    const unsubscribe = OrderService.subscribe((allOrders: LiveOrder[]) => {
      const myTableOrders = allOrders.filter(
        (o: LiveOrder) =>
          o.tableId === currentTableId &&
          o.paymentStatus !== "paid" &&
          o.status !== "cancelled",
      )

      if (myTableOrders.length > 0) {
        const allItems = myTableOrders.flatMap((o: LiveOrder) => o.items)
        setOrderedItems(allItems)
        setShowBillBanner(
          myTableOrders.some((o: LiveOrder) => o.status === "ready" || o.status === "served"),
        )
      } else {
        setOrderedItems([])
        setShowBillBanner(false)
      }
    })
    return unsubscribe
  }, [tableId, currentTableId])

  const handleCallWaiter = async () => {
    const { error } = await supabase
      .from("summons")
      .insert([{ staff_id: 0, staff_name: `Table ${tableId}`, status: "pending" }])

    if (error) {
      console.error("Summon Error:", error)
      toast.error("Call failed. Please try again or visit the counter.")
      return
    }

    toast.custom(
      (t) => (
        <Card size="sm" className="w-[320px] shadow-lg">
          <CardContent className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary shrink-0">
              <BellRing className="size-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold">Request Sent</p>
              <p className="text-xs text-muted-foreground">
                A waiter is on their way to Table {tableId} right now.
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon-xs"
              onClick={() => toast.dismiss(t)}
              aria-label="Close"
            >
              <X className="size-4" />
            </Button>
          </CardContent>
        </Card>
      ),
      { duration: 5000, position: "top-center" },
    )
  }

  const filteredItems = useMemo(
    () =>
      menuItems.filter((item) => {
        const matchCat = activeCategory === "All" || item.category === activeCategory
        const matchSearch =
          item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.description.toLowerCase().includes(searchQuery.toLowerCase())
        return matchCat && matchSearch
      }),
    [menuItems, activeCategory, searchQuery],
  )

  const popularItems = useMemo(
    () => menuItems.filter((item) => item.popular && item.available),
    [menuItems],
  )

  const cartTotal = useMemo(() => cart.reduce((s, i) => s + i.price * i.quantity, 0), [cart])
  const cartItemCount = useMemo(() => cart.reduce((s, i) => s + i.quantity, 0), [cart])

  const addToCart = (item: MenuItem, notes?: string) =>
    setCart((prev) => {
      const ex = prev.find((i) => i.id === item.id)
      return ex
        ? prev.map((i) =>
            i.id === item.id ? { ...i, quantity: i.quantity + 1, notes: notes || i.notes } : i,
          )
        : [...prev, { ...item, quantity: 1, notes }]
    })

  const updateQuantity = (id: string, delta: number) =>
    setCart((prev) =>
      prev
        .map((i) => (i.id === id ? { ...i, quantity: i.quantity + delta } : i))
        .filter((i) => i.quantity > 0),
    )

  const removeFromCart = (id: string) => setCart((prev) => prev.filter((i) => i.id !== id))

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

  return (
    <TooltipProvider>
      <div className="flex flex-col min-h-screen pb-32 bg-background">
        <div className="relative h-72 sm:h-80 w-full overflow-hidden">
          <img
            src={HERO_IMAGE}
            alt="Restaurant ambiance"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

          <div className="absolute bottom-0 left-0 right-0 p-6 pb-7">
            <div className="flex items-end justify-between max-w-7xl mx-auto">
              <div>
                <div className="flex items-center gap-3 mb-1.5">
                  <div className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-md">
                    <UtensilsCrossed className="size-4" />
                  </div>
                  <h1 className="text-3xl font-bold text-white uppercase">Resto</h1>
                </div>
                <p className="text-xs text-white/75 uppercase font-medium flex items-center gap-2 pl-1">
                  <span className="w-6 h-px bg-white/40 inline-block" />
                  Experience Excellence
                </p>
              </div>

              <div className="flex flex-col items-center justify-center px-4 py-2 rounded-xl bg-white/15 backdrop-blur-md border border-white/20 text-center">
                <span className="text-[10px] text-white/70 uppercase font-medium">Table</span>
                <span className="text-2xl font-bold text-white leading-none mt-0.5">{tableId}</span>
              </div>
            </div>
          </div>

          <div className="absolute top-5 right-5 flex items-center gap-2">
            <Button
              variant="secondary"
              size="icon"
              aria-label="Open order tray"
              onClick={() => setCartOpen(true)}
              className="relative bg-white/15 backdrop-blur-md border border-white/20 text-white hover:bg-white/25 hover:text-white"
            >
              <ShoppingCart className="size-4" />
              {cartItemCount > 0 && (
                <motion.span
                  key={cartItemCount}
                  initial={{ scale: 0.8, opacity: 0.6 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={SPRING_POP}
                  className="absolute -top-1.5 -right-1.5"
                >
                  <Badge
                    variant="destructive"
                    className="h-5 min-w-5 px-1 text-[10px]"
                  >
                    {cartItemCount}
                  </Badge>
                </motion.span>
              )}
            </Button>
          </div>
        </div>

        <AnimatePresence>
          {orderConfirmed && (
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
              transition={FAST_TRANSITION}
              className="max-w-7xl mx-auto w-full px-4 -mt-5 relative z-20"
            >
              <Alert className="bg-success text-success-foreground border-success shadow-lg">
                <Check className="size-4" />
                <AlertTitle>Order Confirmed!</AlertTitle>
                <AlertDescription className="text-success-foreground/90">
                  Kitchen is preparing your meal.
                </AlertDescription>
              </Alert>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="max-w-7xl mx-auto w-full px-4 mt-5 space-y-5 flex-1">
          <InputGroup className="bg-card h-11">
            <InputGroupAddon>
              <Search />
            </InputGroupAddon>
            <InputGroupInput
              placeholder="Search the menu…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <InputGroupAddon align="inline-end">
                <InputGroupButton
                  size="icon-xs"
                  aria-label="Clear search"
                  onClick={() => setSearchQuery("")}
                >
                  <X className="size-3.5" />
                </InputGroupButton>
              </InputGroupAddon>
            )}
          </InputGroup>

          <ScrollArea className="w-full">
            <Tabs value={activeCategory} onValueChange={setActiveCategory}>
              <TabsList>
                {categories.map((cat) => {
                  const display = CATEGORY_DISPLAY[cat] || { label: cat, emoji: "🍽️" }
                  const isActive = activeCategory === cat
                  return (
                    <TabsTrigger
                      key={cat}
                      value={cat}
                      className="relative gap-1.5 px-3 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                    >
                      {isActive && (
                        <motion.span
                          layoutId="customer-cat-pill"
                          transition={SPRING_SNAPPY}
                          aria-hidden="true"
                          className="absolute inset-0 rounded-md bg-background shadow-sm"
                        />
                      )}
                      <span className="relative z-10">{display.emoji}</span>
                      <span className="relative z-10">{display.label}</span>
                    </TabsTrigger>
                  )
                })}
              </TabsList>
            </Tabs>
          </ScrollArea>

          {activeCategory === "All" && !searchQuery && popularItems.length > 0 && (
            <div className="space-y-2.5">
              <div className="flex items-center justify-between px-1">
                <p className="text-xs font-semibold uppercase tracking-wide text-foreground flex items-center gap-1.5">
                  <Crown className="size-3.5 text-primary" />
                  Chef&apos;s Picks
                </p>
                <span className="text-[11px] text-muted-foreground">Swipe to explore</span>
              </div>
              <Carousel opts={{ align: "start", dragFree: true }} className="w-full">
                <CarouselContent className="-ml-3">
                  {popularItems.map((item) => {
                    const inCart = cart.find((i) => i.id === item.id)
                    return (
                      <CarouselItem
                        key={`pick-${item.id}`}
                        className="pl-3 basis-[72%] sm:basis-[44%] md:basis-[32%] lg:basis-[24%]"
                      >
                        <Card
                          size="sm"
                          onClick={() => setSelectedItem(item)}
                          className="group gap-0 py-0 overflow-hidden cursor-pointer transition-[border-color,box-shadow] duration-150 ease-(--ease-out) hover:shadow-md h-full"
                        >
                          <div className="relative aspect-[16/10] overflow-hidden shrink-0 bg-muted">
                            <img
                              src={getDishImage(item)}
                              alt={item.name}
                              className="w-full h-full object-cover transition-transform duration-300 ease-(--ease-out) group-hover:scale-105"
                              loading="lazy"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                            <div className="absolute bottom-2 left-3">
                              <p className="text-white font-bold text-sm leading-none tabular-nums">
                                <span className="text-[10px] font-medium text-white/75 mr-0.5 uppercase">
                                  KSh
                                </span>
                                {item.price.toLocaleString()}
                              </p>
                            </div>
                            <Badge
                              variant="secondary"
                              className="absolute bottom-2 right-2 gap-1 bg-black/60 text-white border-0 text-[10px]"
                            >
                              <Star className="size-3 fill-yellow-400 text-yellow-400" />
                              {item.rating || 4.5}
                            </Badge>
                          </div>
                          <CardHeader className="pt-2.5 pb-2">
                            <CardTitle className="text-xs sm:text-sm leading-snug line-clamp-1">
                              {item.name}
                            </CardTitle>
                            <CardDescription className="text-[11px] line-clamp-1">
                              {item.prepTime}
                            </CardDescription>
                          </CardHeader>
                          <CardFooter className="border-t pt-2 pb-2.5 mt-auto">
                            {!inCart ? (
                              <Button
                                size="xs"
                                className="w-full gap-1.5"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  addToCart(item)
                                }}
                              >
                                <Plus className="size-3.5" />
                                Add to Tray
                              </Button>
                            ) : (
                              <Badge
                                variant="outline"
                                className="border-success/30 bg-success/10 text-success text-[10px] uppercase gap-1"
                              >
                                <Check className="size-3" />
                                In Tray ({inCart.quantity})
                              </Badge>
                            )}
                          </CardFooter>
                        </Card>
                      </CarouselItem>
                    )
                  })}
                </CarouselContent>
              </Carousel>
            </div>
          )}

          <div className="flex items-center justify-between px-1 text-xs text-muted-foreground">
            <p className="font-medium uppercase">
              {filteredItems.length} {filteredItems.length === 1 ? "dish" : "dishes"}
              {activeCategory !== "All" &&
                ` · ${CATEGORY_DISPLAY[activeCategory]?.label || activeCategory}`}
            </p>
            {searchQuery && (
              <p>
                Showing results for &ldquo;
                <span className="font-semibold text-primary">{searchQuery}</span>&rdquo;
              </p>
            )}
          </div>

          {filteredItems.length === 0 ? (
            <Empty className="py-20 border">
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <ChefHat />
                </EmptyMedia>
                <EmptyTitle>No dishes found</EmptyTitle>
                <EmptyDescription>Try a different search or category</EmptyDescription>
              </EmptyHeader>
            </Empty>
          ) : (
            <div className="grid gap-4 grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 pb-12">
              {filteredItems.map((item) => {
                const inCart = cart.find((i) => i.id === item.id)
                const qty = inCart?.quantity || 0
                return (
                  <Card
                    key={item.id}
                    size="sm"
                    onClick={() => setSelectedItem(item)}
                    className="group gap-0 py-0 overflow-hidden cursor-pointer transition-[border-color,box-shadow] duration-150 ease-(--ease-out) hover:shadow-md"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden shrink-0 bg-muted">
                      <img
                        src={getDishImage(item)}
                        alt={item.name}
                        className="w-full h-full object-cover transition-transform duration-300 ease-(--ease-out) group-hover:scale-105"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

                      <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 items-start">
                        {item.popular && (
                          <Badge className="text-[10px] uppercase gap-1">
                            <Crown className="size-3" />
                            Chef&apos;s Pick
                          </Badge>
                        )}
                        {item.vegetarian && (
                          <Badge variant="secondary" className="text-[10px] uppercase gap-1">
                            <Leaf className="size-3" />
                            Veg
                          </Badge>
                        )}
                      </div>

                      <Badge
                        variant="secondary"
                        className="absolute top-2.5 right-2.5 text-[10px] uppercase"
                      >
                        {item.category}
                      </Badge>

                      <div className="absolute bottom-2.5 left-3">
                        <p className="text-white font-bold text-sm leading-none tabular-nums drop-shadow">
                          <span className="text-[10px] font-medium text-white/75 mr-0.5 uppercase">
                            KSh
                          </span>
                          {item.price.toLocaleString()}
                        </p>
                      </div>

                      <Badge
                        variant="secondary"
                        className="absolute bottom-2.5 right-2.5 gap-1 bg-black/60 text-white border-0 text-[10px]"
                      >
                        <Star className="size-3 fill-yellow-400 text-yellow-400" />
                        {item.rating || 4.5}
                      </Badge>

                      {inCart && (
                        <div
                          className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-black/25"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <ButtonGroup className="bg-card rounded-full p-1 shadow-lg">
                            <Button
                              variant="ghost"
                              size="icon-xs"
                              onClick={() => updateQuantity(item.id, -1)}
                            >
                              <Minus className="size-3.5" />
                            </Button>
                            <span className="inline-flex items-center justify-center w-6 text-xs font-bold tabular-nums">
                              {qty}
                            </span>
                            <Button
                              size="icon-xs"
                              onClick={() => updateQuantity(item.id, 1)}
                            >
                              <Plus className="size-3.5" />
                            </Button>
                          </ButtonGroup>
                        </div>
                      )}
                    </div>

                    <CardHeader className="pt-3 pb-1">
                      <CardTitle className="text-xs sm:text-sm leading-snug line-clamp-2">
                        {item.name}
                      </CardTitle>
                      <CardDescription className="text-[11px] line-clamp-1 italic">
                        {item.description || "Prepared with fresh local ingredients"}
                      </CardDescription>
                    </CardHeader>

                    <CardFooter className="border-t pt-2.5 pb-3 mt-auto">
                      {!inCart ? (
                        <Button
                          size="xs"
                          className="w-full gap-1.5"
                          onClick={(e) => {
                            e.stopPropagation()
                            addToCart(item)
                          }}
                        >
                          <Plus className="size-3.5" />
                          Add to Tray
                        </Button>
                      ) : (
                        <div className="flex items-center justify-between w-full">
                          <Badge
                            variant="outline"
                            className="border-success/30 bg-success/10 text-success text-[10px] uppercase gap-1"
                          >
                            <Check className="size-3" />
                            In Tray
                          </Badge>
                          <Button
                            variant="link"
                            size="xs"
                            onClick={(e) => {
                              e.stopPropagation()
                              setSelectedItem(item)
                            }}
                          >
                            View Details
                          </Button>
                        </div>
                      )}
                    </CardFooter>
                  </Card>
                )
              })}
            </div>
          )}
        </div>

        <Drawer
          direction={isMobile ? "bottom" : "right"}
          open={cartOpen}
          onOpenChange={setCartOpen}
        >
          <DrawerContent className="w-full sm:max-w-[420px] p-0 flex flex-col max-h-[88dvh] md:max-h-dvh">
            <DrawerHeader className="px-6 pt-4 md:pt-6 pb-4 border-b shrink-0 text-left">
              <div className="flex items-center gap-3">
                <div className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <ShoppingCart className="size-4" />
                </div>
                <div>
                  <DrawerTitle className="text-base">Your Order</DrawerTitle>
                  <DrawerDescription className="text-xs uppercase font-medium">
                    Table {tableId}
                  </DrawerDescription>
                </div>
              </div>
            </DrawerHeader>

            <ScrollArea className="flex-1 px-6 py-4 overscroll-contain">
              {orderConfirmed ? (
                <div className="flex flex-col items-center justify-center py-20 text-center gap-4">
                  <motion.div
                    initial={{ scale: 0.85, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={SPRING_POP}
                    className="flex size-16 items-center justify-center rounded-full bg-success text-success-foreground shadow-md"
                  >
                    <Check className="size-7" />
                  </motion.div>
                  <div>
                    <h3 className="font-semibold text-lg">Order Confirmed!</h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      Your selection is on its way to the kitchen.
                    </p>
                  </div>
                </div>
              ) : cart.length === 0 ? (
                <Empty className="py-16">
                  <EmptyHeader>
                    <EmptyMedia variant="icon">
                      <ShoppingCart />
                    </EmptyMedia>
                    <EmptyTitle className="text-base">Nothing here yet</EmptyTitle>
                    <EmptyDescription>Browse the menu and add items</EmptyDescription>
                  </EmptyHeader>
                </Empty>
              ) : (
                <div className="space-y-3">
                  <AnimatePresence mode="popLayout" initial={false}>
                    {cart.map((item) => (
                      <motion.div
                        key={item.id}
                        layout="position"
                        initial={{ opacity: 0, y: 6, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, x: 16, scale: 0.96 }}
                        transition={FAST_TRANSITION}
                      >
                        <Card size="sm">
                          <CardContent className="flex items-center gap-3">
                            <div className="size-12 rounded-lg overflow-hidden shrink-0 border bg-muted">
                              <img
                                src={getDishImage(item)}
                                alt={item.name}
                                className="w-full h-full object-cover"
                              />
                            </div>

                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold truncate">{item.name}</p>
                              <p className="text-xs font-medium text-primary tabular-nums">
                                KSh {(item.price * item.quantity).toLocaleString()}
                              </p>
                            </div>

                            <ButtonGroup data-vaul-no-drag>
                              <Button
                                variant="outline"
                                size="icon-xs"
                                onClick={() => updateQuantity(item.id, -1)}
                              >
                                <Minus className="size-3" />
                              </Button>
                              <span className="inline-flex items-center justify-center w-7 text-xs font-bold tabular-nums border-y">
                                {item.quantity}
                              </span>
                              <Button
                                size="icon-xs"
                                onClick={() => updateQuantity(item.id, 1)}
                              >
                                <Plus className="size-3" />
                              </Button>
                            </ButtonGroup>

                            <Button
                              data-vaul-no-drag
                              variant="ghost"
                              size="icon-xs"
                              className="text-muted-foreground hover:text-destructive"
                              onClick={() => removeFromCart(item.id)}
                            >
                              <X className="size-3.5" />
                            </Button>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </ScrollArea>

            {cart.length > 0 && !orderConfirmed && (
              <DrawerFooter className="flex-col gap-3 px-6 py-5 border-t shrink-0">
                <div className="flex justify-between items-center px-4 py-3 rounded-xl bg-muted/50">
                  <span className="text-sm font-semibold">Total</span>
                  <span className="text-lg font-bold tabular-nums text-primary">
                    KSh {cartTotal.toLocaleString()}
                  </span>
                </div>

                <Button
                  data-vaul-no-drag
                  size="lg"
                  className="w-full gap-2"
                  onClick={handlePlaceOrder}
                >
                  <Check className="size-4" />
                  Confirm Order
                </Button>
              </DrawerFooter>
            )}
          </DrawerContent>
        </Drawer>

        <Dialog
          open={!!selectedItem}
          onOpenChange={() => {
            setSelectedItem(null)
            setItemNotes("")
          }}
        >
          <DialogContent className="max-w-sm p-0 overflow-hidden">
            {selectedItem && (
              <>
                <div className="relative h-56 overflow-hidden bg-muted">
                  <img
                    src={getDishImage(selectedItem)}
                    alt={selectedItem.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />

                  <div className="absolute top-3 left-3 flex gap-1.5">
                    {selectedItem.popular && (
                      <Badge className="text-[10px] uppercase gap-1">
                        <Crown className="size-3" />
                        Chef&apos;s Pick
                      </Badge>
                    )}
                    {selectedItem.vegetarian && (
                      <Badge variant="secondary" className="text-[10px] uppercase gap-1">
                        <Leaf className="size-3" />
                        Vegetarian
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="px-5 pb-5 space-y-4">
                  <DialogHeader>
                    <DialogTitle className="text-xl">{selectedItem.name}</DialogTitle>
                    <DialogDescription className="text-xs leading-relaxed">
                      {selectedItem.description}
                    </DialogDescription>
                  </DialogHeader>

                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="gap-1">
                      <Clock className="size-3" />
                      {selectedItem.prepTime}
                    </Badge>
                    <Badge variant="outline" className="gap-1 text-warning border-warning/30">
                      <Star className="size-3 fill-current" />
                      {selectedItem.rating} rating
                    </Badge>
                    <span className="ml-auto text-base font-bold text-primary tabular-nums">
                      KSh {selectedItem.price.toLocaleString()}
                    </span>
                  </div>

                  <Field>
                    <FieldLabel htmlFor="special-notes" className="text-xs uppercase">
                      Special Instructions
                    </FieldLabel>
                    <Textarea
                      id="special-notes"
                      placeholder="E.g., No onions, extra spicy, well done…"
                      value={itemNotes}
                      onChange={(e) => setItemNotes(e.target.value)}
                      className="resize-none h-20"
                    />
                  </Field>

                  <DialogFooter>
                    <Button
                      size="lg"
                      className="w-full gap-2"
                      onClick={() => {
                        addToCart(selectedItem, itemNotes)
                        setSelectedItem(null)
                        setItemNotes("")
                      }}
                    >
                      <Plus className="size-4" />
                      Add to Order
                    </Button>
                  </DialogFooter>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>

        <div className="fixed bottom-28 md:bottom-6 left-4 right-4 max-w-lg mx-auto z-50 flex items-stretch gap-2.5">
          <AnimatePresence mode="popLayout">
            {orderedItems.length > 0 && (
              <motion.div
                key="bill-status-cta"
                initial={{ opacity: 0, y: 10, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.96 }}
                transition={FAST_TRANSITION}
                className="flex-1 flex"
              >
                <Button
                  onClick={() => router.push(`/customer/${tableId}/billing`)}
                  className="flex-1 h-14 justify-between px-4 rounded-2xl shadow-lg"
                  variant={showBillBanner ? "default" : "secondary"}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="flex size-9 items-center justify-center rounded-xl bg-primary/15 shrink-0">
                      {showBillBanner ? <Receipt className="size-5" /> : <Clock className="size-5" />}
                    </div>
                    <div className="text-left min-w-0">
                      <p className="text-xs font-bold uppercase truncate">
                        {showBillBanner ? "Bill Ready" : "Preparing Order"}
                      </p>
                      <p className="text-[10px] opacity-80 truncate">
                        {showBillBanner
                          ? "Tap to settle & rate"
                          : "Live status tracking · View details"}
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="size-4 shrink-0" />
                </Button>
              </motion.div>
            )}
          </AnimatePresence>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="size-14 rounded-2xl bg-card shadow-lg shrink-0"
                onClick={handleCallWaiter}
                aria-label="Call waiter"
              >
                <UtensilsCrossed className="size-5 text-primary" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top">Call waiter</TooltipContent>
          </Tooltip>

          <AnimatePresence mode="popLayout">
            {cartItemCount > 0 && (
              <motion.div
                key="view-order-cta"
                initial={{ opacity: 0, y: 10, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.96 }}
                transition={FAST_TRANSITION}
                className="flex-1 flex"
              >
                <Button
                  size="lg"
                  className="flex-1 h-14 rounded-2xl shadow-lg gap-2"
                  onClick={() => setCartOpen(true)}
                >
                  <ShoppingCart className="size-5" />
                  <span>
                    View Order ({cartItemCount}) · KSh {cartTotal.toLocaleString()}
                  </span>
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </TooltipProvider>
  )
}
