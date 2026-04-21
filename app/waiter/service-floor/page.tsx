"use client";

import { useState, useEffect, Suspense } from "react";
import {
  TableGrid,
  MenuGrid,
  OrderCart,
} from "./_components/order-management";
import { mockTables } from "@/lib/mock-data";
import { allMenuItems } from "@/lib/menu-data";
import type { Table, MenuItem, OrderItem } from "@/lib/types";
import { toast } from "sonner";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { OrderService, LiveOrder } from "@/lib/order-service";
import {
  ShoppingCartIcon as ShoppingCart,
  ChevronDownIcon as ChevronDown,
  ChevronRightIcon as ChevronRight,
  SparklesIcon as UtensilsCrossed,
  BoltIcon as Sparkles,
  DocumentTextIcon as Receipt,
  XMarkIcon as X,
  ArrowLeftIcon as ArrowLeft,
  ArrowTrendingUpIcon as TrendingUp,
  ClockIcon as Clock,
} from "@heroicons/react/24/outline";
import { useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";

// ─── Loader fallback ─────────────────────────────────────────────────────────
function POSLoader() {
  return (
    <div
      className="flex items-center justify-center min-h-screen"
      style={{ 
        background: "linear-gradient(135deg, #F8F6FC 0%, #F0EBF8 50%, #E8E3F5 100%)" 
      }}
    >
      <div className="flex flex-col items-center gap-4 relative">
        {/* Animated background orb */}
        <div 
          className="absolute inset-0 -m-20 rounded-full opacity-20 blur-3xl animate-pulse"
          style={{ background: "oklch(0.42 0.14 285)" }}
        />
        
        <div className="relative">
          {/* Rotating border */}
          <div 
            className="absolute inset-0 rounded-[20px] animate-spin"
            style={{ 
              background: "conic-gradient(from 0deg, oklch(0.42 0.14 285), transparent, oklch(0.42 0.14 285))",
              padding: "2px"
            }}
          />
          
          {/* Icon container */}
          <div
            className="relative w-16 h-16 rounded-[18px] flex items-center justify-center"
            style={{ 
              background: "white",
              boxShadow: "0 8px 32px oklch(0.42 0.14 285 / 0.2)"
            }}
          >
            <UtensilsCrossed
              className="h-7 w-7 animate-pulse"
              style={{ color: "oklch(0.42 0.14 285)" }}
              strokeWidth={2.5}
            />
          </div>
        </div>

        <div className="text-center space-y-1.5 relative">
          <p
            className="text-[13px] font-bold uppercase tracking-[0.12em]"
            style={{ color: "#0D031B" }}
          >
            Loading POS System
          </p>
          <p
            className="text-[11px] font-medium"
            style={{ color: "#736C83" }}
          >
            Please wait a moment...
          </p>
        </div>

        {/* Loading dots */}
        <div className="flex gap-1.5 mt-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full animate-bounce"
              style={{
                background: "oklch(0.42 0.14 285)",
                animationDelay: `${i * 0.15}s`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Root export ─────────────────────────────────────────────────────────────
export default function OrdersPage() {
  return (
    <Suspense fallback={<POSLoader />}>
      <OrdersContent />
    </Suspense>
  );
}

// ─── Main content ─────────────────────────────────────────────────────────────
function OrdersContent() {
  const searchParams = useSearchParams();
  const tableParam = searchParams.get("table");

  const [selectedTable, setSelectedTable] = useState<Table | null>(null);
  const [menuItems, setMenuItems] = useState<MenuItem[]>(allMenuItems);
  const [cartItems, setCartItems] = useState<OrderItem[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [cartOpen, setCartOpen] = useState(false);
  const [activeOrders, setActiveOrders] = useState<LiveOrder[]>([]);

  // Subscribe to live orders
  useEffect(() => {
    const unsubscribe = OrderService.subscribe(setActiveOrders);
    return unsubscribe;
  }, []);

  // Fetch menu data
  useEffect(() => {
    fetch("/api/menu", { cache: "no-store" })
      .then((res) => res.json())
      .then(setMenuItems)
      .catch(() => {
        toast.error("Failed to load menu items");
      });
  }, []);

  // Pre-select table from Floor Plan deep-link
  useEffect(() => {
    if (tableParam) {
      const table = mockTables.find((t) => t.number.toString() === tableParam);
      if (table) {
        setSelectedTable(table);
        toast.success(`Table ${table.number} selected`, {
          description: "Ready to take orders",
          duration: 2000,
        });
      }
    }
  }, [tableParam]);

  // ── Cart handlers ─────────────────────────────────────────────────────────
  const handleTableSelect = (table: Table) => {
    setSelectedTable(table);
    setCartItems([]);
    toast.success(`Table ${table.number} selected`, {
      icon: <UtensilsCrossed className="h-4 w-4" />,
    });
  };

  const handleAddToCart = (menuItem: MenuItem) => {
    setCartItems((prev) => {
      const ex = prev.find((i) => i.menuItem.id === menuItem.id);
      return ex
        ? prev.map((i) =>
            i.menuItem.id === menuItem.id
              ? { ...i, quantity: i.quantity + 1 }
              : i
          )
        : [...prev, { menuItem, quantity: 1 }];
    });

    // Enhanced toast with animation
    toast.success(`${menuItem.name} added`, {
      description: selectedTable 
        ? `Table ${selectedTable.number} · KES ${menuItem.price.toLocaleString()}`
        : `KES ${menuItem.price.toLocaleString()}`,
      duration: 1500,
      icon: <Sparkles className="h-4 w-4" />,
    });
  };

  const handleUpdateQuantity = (menuItemId: string, quantity: number) => {
    if (quantity <= 0) {
      setCartItems((prev) => prev.filter((i) => i.menuItem.id !== menuItemId));
      toast.info("Item removed from cart");
    } else {
      setCartItems((prev) =>
        prev.map((i) =>
          i.menuItem.id === menuItemId ? { ...i, quantity } : i
        )
      );
    }
  };

  const handleRemoveItem = (menuItemId: string) => {
    const item = cartItems.find((i) => i.menuItem.id === menuItemId);
    setCartItems((prev) => prev.filter((i) => i.menuItem.id !== menuItemId));
    if (item) {
      toast.info(`${item.menuItem.name} removed`);
    }
  };

  const handlePlaceOrder = () => {
    if (!selectedTable || cartItems.length === 0) return;

    OrderService.placeOrder(
      selectedTable.id.toString(),
      cartItems.map((item) => ({
        ...item.menuItem,
        quantity: item.quantity,
      }))
    );

    const tableLabel =
      selectedTable.number / 10 >= 1
        ? selectedTable.number
        : "0" + selectedTable.number;

    toast.success("Order sent to kitchen!", {
      description: `Table ${tableLabel} · ${cartCount} item${cartCount > 1 ? "s" : ""} · KES ${total.toLocaleString()}`,
      icon: <UtensilsCrossed className="h-4 w-4" />,
      duration: 3000,
    });

    setCartItems([]);
    setSelectedTable(null);
    setCartOpen(false);
  };

  const handleClearCart = () => {
    if (cartItems.length === 0) return;
    setCartItems([]);
    toast.info("Cart cleared", {
      description: "All items removed",
    });
  };

  // ── Derived state ─────────────────────────────────────────────────────────
  const filteredMenuItems =
    activeCategory === "all"
      ? menuItems.filter((i) => i.available)
      : menuItems.filter(
          (i) => i.category === activeCategory && i.available
        );

  const subtotal = cartItems.reduce(
    (s, i) => s + i.menuItem.price * i.quantity,
    0
  );
  const tax = Math.round(subtotal * 0.16);
  const total = subtotal + tax;
  const cartCount = cartItems.reduce((s, i) => s + i.quantity, 0);
  const hasItems = cartItems.length > 0;

  // Enrich tables with live order status
  const enrichedTables = mockTables.map((t) => {
    const tableOrders = activeOrders.filter(
      (o) =>
        o.tableId === t.id.toString() &&
        o.status !== "served" &&
        o.status !== "cancelled"
    );
    return {
      ...t,
      status: tableOrders.length > 0 ? ("occupied" as const) : t.status,
    };
  });

  return (
    <TooltipProvider>
      <div
        className="flex flex-col h-full overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #F8F6FC 0%, #F0EBF8 50%, #E8E3F5 100%)",
        }}
      >
        {/* ── Enhanced Breadcrumb bar ────────────────────────────── */}
        {selectedTable && (
          <div
            className="flex items-center justify-between px-4 sm:px-6 py-3.5 border-b shrink-0 backdrop-blur-xl relative overflow-hidden"
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

            {/* Breadcrumb */}
            <div className="flex items-center gap-2.5 text-[13px] relative z-10">
              <button
                onClick={() => setSelectedTable(null)}
                className="flex items-center gap-2 font-semibold transition-all hover:opacity-70 active:scale-95 group"
                style={{ color: "#736C83" }}
              >
                <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
                Tables
              </button>
              
              <ChevronRight className="h-3.5 w-3.5" style={{ color: "#C4BAD8" }} />
              
              <Badge
                className="flex items-center gap-1.5 text-[11px] font-bold px-3 py-1.5 rounded-xl border shadow-sm"
                style={{
                  background: "oklch(0.42 0.14 285 / 0.08)",
                  color: "oklch(0.42 0.14 285)",
                  borderColor: "oklch(0.42 0.14 285 / 0.2)",
                }}
              >
                <UtensilsCrossed className="h-3 w-3" />
                Table {selectedTable.number.toString().padStart(2, "0")}
              </Badge>
            </div>

            {/* Order summary */}
            {hasItems && (
              <div className="flex items-center gap-3 relative z-10">
                <Separator 
                  orientation="vertical" 
                  className="h-5" 
                  style={{ background: "oklch(0.42 0.14 285 / 0.12)" }}
                />
                
                <div className="flex items-center gap-2">
                  <div
                    className="flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-lg border"
                    style={{
                      background: "oklch(0.42 0.14 285 / 0.06)",
                      color: "oklch(0.42 0.14 285)",
                      borderColor: "oklch(0.42 0.14 285 / 0.15)",
                    }}
                  >
                    <Sparkles className="h-3 w-3" />
                    {cartCount} item{cartCount > 1 ? "s" : ""}
                  </div>

                  <div
                    className="text-[13px] font-bold px-2.5 py-1 rounded-lg"
                    style={{
                      background: "oklch(0.42 0.14 285 / 0.08)",
                      color: "oklch(0.42 0.14 285)",
                    }}
                  >
                    KES {total.toLocaleString()}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── Main view (Table grid or Menu grid) ─────────────────── */}
        <ScrollArea className="flex-1 min-h-0">
          <div className={cn(selectedTable ? "pb-32 sm:pb-28" : "pb-28")}>
            {!selectedTable ? (
              <TableGrid
                tables={enrichedTables}
                onSelectTable={handleTableSelect}
              />
            ) : (
              <MenuGrid
                items={filteredMenuItems}
                activeCategory={activeCategory}
                onCategoryChange={setActiveCategory}
                onAddItem={handleAddToCart}
                onBack={() => setSelectedTable(null)}
                selectedTable={selectedTable}
              />
            )}
          </div>
        </ScrollArea>

        {/* ── Floating Cart Pill (Enhanced) ────────────────────────── */}
        <div className="fixed bottom-6 right-4 sm:bottom-8 sm:right-6 z-50">
          <Popover open={cartOpen} onOpenChange={setCartOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "group h-auto py-3 px-4 rounded-[20px] border-2 transition-all duration-500",
                  "shadow-[0_8px_32px_rgba(0,0,0,0.12)] hover:shadow-[0_16px_48px_rgba(0,0,0,0.16)]",
                  "hover:-translate-y-1.5 hover:scale-[1.02] active:translate-y-0 active:scale-[0.98]",
                  "relative overflow-hidden",
                  hasItems
                    ? "bg-white backdrop-blur-xl"
                    : "bg-white/95 backdrop-blur-md"
                )}
                style={{
                  borderColor: hasItems
                    ? "oklch(0.42 0.14 285 / 0.25)"
                    : "oklch(0.42 0.14 285 / 0.12)",
                  boxShadow: hasItems
                    ? "0 12px 40px oklch(0.42 0.14 285 / 0.25), 0 4px 12px rgba(0,0,0,0.08)"
                    : "0 8px 24px rgba(0,0,0,0.1)",
                }}
              >
                {/* Animated gradient background */}
                <div 
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    background: "radial-gradient(circle at 50% 50%, oklch(0.42 0.14 285 / 0.03) 0%, transparent 70%)"
                  }}
                />

                {/* Shine effect */}
                <div 
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                  style={{
                    background: "linear-gradient(110deg, transparent 25%, oklch(0.42 0.14 285 / 0.08) 50%, transparent 75%)",
                    backgroundSize: "200% 100%",
                    animation: "shine 2s ease-in-out infinite"
                  }}
                />

                <div className="flex items-center gap-3.5 w-full relative z-10">
                  {/* Enhanced cart icon */}
                  <div
                    className="relative flex items-center justify-center w-11 h-11 rounded-[14px] shrink-0 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3"
                    style={{
                      background: hasItems
                        ? "linear-gradient(135deg, oklch(0.42 0.14 285) 0%, oklch(0.38 0.16 275) 100%)"
                        : "oklch(0.42 0.14 285)",
                      boxShadow: hasItems
                        ? "0 4px 16px oklch(0.42 0.14 285 / 0.4), inset 0 1px 0 rgba(255,255,255,0.2)"
                        : "0 3px 12px oklch(0.42 0.14 285 / 0.3)",
                    }}
                  >
                    <ShoppingCart 
                      className="h-5 w-5 text-white transition-transform group-hover:scale-110" 
                      strokeWidth={2.5}
                    />
                    
                    {/* Enhanced badge */}
                    {cartCount > 0 && (
                      <span
                        className="absolute -top-2 -right-2 flex items-center justify-center rounded-full text-[10px] font-bold text-white leading-none animate-bounce"
                        style={{
                          minWidth: "20px",
                          height: "20px",
                          padding: "0 5px",
                          background: "linear-gradient(135deg, oklch(0.65 0.20 25) 0%, oklch(0.58 0.18 25) 100%)",
                          boxShadow: "0 2px 8px oklch(0.65 0.18 25 / 0.5), inset 0 1px 0 rgba(255,255,255,0.3)",
                          border: "2px solid white",
                        }}
                      >
                        {cartCount > 9 ? "9+" : cartCount}
                      </span>
                    )}
                  </div>

                  {/* Enhanced label */}
                  <div className="text-left flex flex-col min-w-0 flex-1 gap-0.5">
                    <span
                      className="text-[14px] font-bold leading-none tracking-tight"
                      style={{ color: "#0D031B" }}
                    >
                      Current Order
                    </span>
                    <span
                      className="text-[11px] font-semibold mt-1 flex items-center gap-1.5"
                      style={{ 
                        color: hasItems ? "oklch(0.42 0.14 285)" : "#736C83" 
                      }}
                    >
                      {hasItems ? (
                        <>
                          <TrendingUp className="h-3 w-3" />
                          {cartCount} item{cartCount > 1 ? "s" : ""} · KES{" "}
                          {total.toLocaleString()}
                        </>
                      ) : (
                        <>
                          <Clock className="h-3 w-3" />
                          No items yet
                        </>
                      )}
                    </span>
                  </div>

                  <ChevronDown
                    className={cn(
                      "h-4.5 w-4.5 ml-1 shrink-0 transition-all duration-300",
                      cartOpen && "rotate-180"
                    )}
                    style={{ color: "#AEA6BF" }}
                  />
                </div>
              </Button>
            </PopoverTrigger>

            {/* ── Enhanced Cart Popover ─────────────────────────────── */}
            <PopoverContent
              side="top"
              align="end"
              sideOffset={12}
              className="p-0 overflow-hidden border-0"
              style={{
                width: "min(calc(100vw - 2rem), 420px)",
                borderRadius: "1.5rem",
                boxShadow:
                  "0 32px 64px oklch(0.42 0.14 285 / 0.2), 0 8px 24px rgba(0,0,0,0.12)",
                background: "white",
              }}
            >
              {/* Enhanced popover header */}
              <div
                className="relative px-5 py-4 border-b overflow-hidden"
                style={{
                  background: "linear-gradient(135deg, oklch(0.42 0.14 285 / 0.04) 0%, oklch(0.42 0.14 285 / 0.02) 100%)",
                  borderColor: "oklch(0.42 0.14 285 / 0.08)",
                }}
              >
                {/* Decorative gradient line */}
                <div 
                  className="absolute top-0 left-0 right-0 h-[3px]"
                  style={{
                    background: "linear-gradient(90deg, oklch(0.42 0.14 285) 0%, oklch(0.55 0.18 270) 50%, oklch(0.42 0.14 285) 100%)"
                  }}
                />

                <div className="flex items-center justify-between relative z-10">
                  <div className="flex items-center gap-2.5">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center"
                      style={{ 
                        background: "oklch(0.42 0.14 285 / 0.1)",
                        border: "1px solid oklch(0.42 0.14 285 / 0.2)"
                      }}
                    >
                      <Receipt
                        className="h-4 w-4"
                        style={{ color: "oklch(0.42 0.14 285)" }}
                      />
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <span
                        className="text-[14px] font-bold leading-none"
                        style={{ color: "#0D031B" }}
                      >
                        Order Details
                      </span>
                      {selectedTable && (
                        <span
                          className="text-[10px] font-medium"
                          style={{ color: "#736C83" }}
                        >
                          Table {selectedTable.number.toString().padStart(2, "0")}
                        </span>
                      )}
                    </div>
                  </div>

                  {hasItems && (
                    <div className="flex items-center gap-2">
                      <Badge
                        className="text-[10px] font-bold px-2.5 py-1 rounded-lg border"
                        style={{
                          background: "oklch(0.42 0.14 285 / 0.08)",
                          color: "oklch(0.42 0.14 285)",
                          borderColor: "oklch(0.42 0.14 285 / 0.2)",
                        }}
                      >
                        {cartCount} item{cartCount > 1 ? "s" : ""}
                      </Badge>
                      <span
                        className="text-[13px] font-bold"
                        style={{ color: "oklch(0.42 0.14 285)" }}
                      >
                        KES {subtotal.toLocaleString()}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Cart body */}
              <div
                className="flex flex-col overflow-hidden"
                style={{ maxHeight: "70vh" }}
              >
                <OrderCart
                  table={selectedTable}
                  items={cartItems}
                  onUpdateQuantity={handleUpdateQuantity}
                  onRemoveItem={handleRemoveItem}
                  onPlaceOrder={() => {
                    handlePlaceOrder();
                    setCartOpen(false);
                  }}
                  onClearCart={handleClearCart}
                />
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Add animation styles */}
      <style jsx global>{`
        @keyframes shine {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </TooltipProvider>
  );
}