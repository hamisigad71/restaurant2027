"use client";

import { useState, useEffect, Suspense } from "react";
import {
  TableGrid,
  MenuGrid,
  OrderCart,
} from "./_components/order-management";
import { mockTables } from "@/lib/mock-data";
import { allMenuItems } from "@/lib/menu-data"; // Use this as fallback/initial if needed, or stick to fetch
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
  ShoppingCart,
  ChevronDown,
  ChevronRight,
  UtensilsCrossed,
  Sparkles,
  Receipt,
  X,
} from "lucide-react";
import { useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";

// ─── Loader fallback ─────────────────────────────────────────────────────────
function POSLoader() {
  return (
    <div
      className="flex items-center justify-center h-full"
      style={{ background: "#F0EBF8" }}
    >
      <div className="flex flex-col items-center gap-3">
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center animate-pulse"
          style={{ background: "oklch(0.45 0.12 285 / 0.12)" }}
        >
          <UtensilsCrossed
            className="h-6 w-6"
            style={{ color: "oklch(0.45 0.12 285)" }}
          />
        </div>
        <p
          className="text-[11px] font-bold uppercase "
          style={{ color: "#9A94AA" }}
        >
          Loading POS…
        </p>
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
  const tableParam   = searchParams.get("table");

  const [selectedTable,   setSelectedTable]   = useState<Table | null>(null);
  const [menuItems,       setMenuItems]       = useState<MenuItem[]>(allMenuItems);
  const [cartItems,       setCartItems]       = useState<OrderItem[]>([]);
  const [activeCategory,  setActiveCategory]  = useState<string>("all");
  const [cartOpen,        setCartOpen]        = useState(false);
  const [activeOrders,    setActiveOrders]    = useState<LiveOrder[]>([]);

  // Subscribe to live orders
  useEffect(() => {
    const unsubscribe = OrderService.subscribe(setActiveOrders);
    return unsubscribe;
  }, []);

  // Fetch true menu data
  useEffect(() => {
    fetch('/api/menu', { cache: 'no-store' })
      .then(res => res.json())
      .then(setMenuItems);
  }, []);

  // Pre-select table from Floor Plan deep-link
  useEffect(() => {
    if (tableParam) {
      const table = mockTables.find((t) => t.number.toString() === tableParam);
      if (table) setSelectedTable(table);
    }
  }, [tableParam]);

  // ── Cart handlers ─────────────────────────────────────────────────────────
  const handleTableSelect = (table: Table) => {
    setSelectedTable(table);
    setCartItems([]);
  };

  const handleAddToCart = (menuItem: MenuItem) => {
    setCartItems((prev) => {
      const ex = prev.find((i) => i.menuItem.id === menuItem.id);
      return ex
        ? prev.map((i) =>
            i.menuItem.id === menuItem.id
              ? { ...i, quantity: i.quantity + 1 }
              : i,
          )
        : [...prev, { menuItem, quantity: 1 }];
    });
    toast.success(`Added ${menuItem.name}`, {
      description: selectedTable ? `Table ${selectedTable.number}` : undefined,
      duration: 1800,
    });
  };

  const handleUpdateQuantity = (menuItemId: string, quantity: number) => {
    if (quantity <= 0) {
      setCartItems((prev) => prev.filter((i) => i.menuItem.id !== menuItemId));
    } else {
      setCartItems((prev) =>
        prev.map((i) =>
          i.menuItem.id === menuItemId ? { ...i, quantity } : i,
        ),
      );
    }
  };

  const handleRemoveItem = (menuItemId: string) =>
    setCartItems((prev) => prev.filter((i) => i.menuItem.id !== menuItemId));

  const handlePlaceOrder = () => {
    if (!selectedTable || cartItems.length === 0) return;

    OrderService.placeOrder(
      selectedTable.id.toString(),
      cartItems.map((item) => ({
        ...item.menuItem,
        quantity: item.quantity,
      })),
    );

    const tableLabel =
      selectedTable.number / 10 >= 1
        ? selectedTable.number
        : "0" + selectedTable.number;

    toast.success(`Order sent to kitchen!`, {
      description: `Table ${tableLabel} · ${cartCount} items`,
      icon: <UtensilsCrossed className="h-4 w-4" />,
    });

    setCartItems([]);
    setSelectedTable(null);
    setCartOpen(false);
  };

  const handleClearCart = () => {
    setCartItems([]);
    toast.info("Cart cleared");
  };

  // ── Derived state ─────────────────────────────────────────────────────────
  const filteredMenuItems =
    activeCategory === "all"
      ? menuItems.filter((i) => i.available)
      : menuItems.filter(
          (i) => i.category === activeCategory && i.available,
        );

  const subtotal  = cartItems.reduce((s, i) => s + i.menuItem.price * i.quantity, 0);
  const tax       = Math.round(subtotal * 0.16);
  const total     = subtotal + tax;
  const cartCount = cartItems.reduce((s, i) => s + i.quantity, 0);
  const hasItems  = cartItems.length > 0;

  // Enrich tables with live order status
  const enrichedTables = mockTables.map((t) => {
    const tableOrders = activeOrders.filter(
      (o) =>
        o.tableId === t.id.toString() &&
        o.status !== "served" &&
        o.status !== "cancelled",
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
        style={{ background: "#F0EBF8" }}
      >
        {/* ── Breadcrumb bar (visible only when a table is selected) ── */}
        {selectedTable && (
          <div
            className="flex items-center gap-2 px-4 sm:px-5 py-2.5 border-b shrink-0 text-xs"
            style={{
              background: "rgba(255,255,255,0.85)",
              backdropFilter: "blur(12px)",
              borderColor: "oklch(0.45 0.12 285 / 0.12)",
            }}
          >
            <button
              onClick={() => setSelectedTable(null)}
              className="font-medium transition-colors hover:opacity-70"
              style={{ color: "#736C83" }}
            >
              Tables
            </button>
            <ChevronRight className="h-3 w-3" style={{ color: "#C4BAD8" }} />
            <Badge
              className="text-[10px] font-bold px-2.5 py-0.5 rounded-full border"
              style={{
                background: "oklch(0.45 0.12 285 / 0.1)",
                color: "oklch(0.45 0.12 285)",
                borderColor: "oklch(0.45 0.12 285 / 0.2)",
              }}
            >
              Table {selectedTable.number}
            </Badge>

            {hasItems && (
              <>
                <span style={{ color: "#C4BAD8" }}>·</span>
                <span
                  className="flex items-center gap-1 font-semibold"
                  style={{ color: "oklch(0.45 0.12 285)" }}
                >
                  <Sparkles className="h-3 w-3" />
                  {cartCount} item{cartCount > 1 ? "s" : ""} ·{" "}
                  KES {total.toLocaleString()}
                </span>
              </>
            )}
          </div>
        )}

        {/* ── Main view (Table grid or Menu grid) ─────────────────── */}
        <ScrollArea className="flex-1 min-h-0">
          <div className={cn(selectedTable ? "pb-28 sm:pb-24" : "pb-24")}>
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

        {/* ── Floating Cart Pill ───────────────────────────────────── */}
        <div className="fixed bottom-5 right-4 sm:bottom-6 sm:right-6 z-50">
          <Popover open={cartOpen} onOpenChange={setCartOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "group h-auto py-2.5 px-4 rounded-2xl border transition-all duration-300",
                  "shadow-lg hover:shadow-[0_20px_40px_rgba(0,0,0,0.12)] hover:-translate-y-1 hover:scale-[1.03] active:translate-y-0 active:scale-[0.98]",
                  "bg-white/95 backdrop-blur-md hover:bg-white",
                  "relative overflow-hidden"
                )}
                style={{
                  borderColor: hasItems
                    ? "oklch(0.45 0.12 285 / 0.35)"
                    : "#E2DCF0",
                  boxShadow: hasItems
                    ? "0 8px 28px oklch(0.45 0.12 285 / 0.2), 0 2px 8px rgba(0,0,0,0.06)"
                    : "0 4px 16px rgba(0,0,0,0.08)",
                }}
              >
                {/* Shine effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-10 pointer-events-none group-hover:animate-[flow-shine_2s_ease-in-out_infinite]"
                     style={{ background: "linear-gradient(90deg, transparent, oklch(0.45 0.12 285), transparent)" }} />

                <div className="flex items-center gap-3 w-full relative z-10">
                  {/* Cart icon */}
                  <div
                    className="relative flex items-center justify-center w-9 h-9 rounded-xl shrink-0 transition-transform group-hover:scale-105"
                    style={{
                      background: "oklch(0.45 0.12 285)",
                      boxShadow: "0 3px 10px oklch(0.45 0.12 285 / 0.35)",
                    }}
                  >
                    <ShoppingCart className="h-4 w-4 text-white" />
                    {cartCount > 0 && (
                      <span
                        className="absolute -top-1.5 -right-1.5 flex items-center justify-center rounded-full text-[10px] font-bold text-white leading-none"
                        style={{
                          minWidth: "18px",
                          height: "18px",
                          padding: "0 4px",
                          background: "oklch(0.65 0.18 25)",
                          boxShadow: "0 2px 6px oklch(0.65 0.18 25 / 0.5)",
                        }}
                      >
                        {cartCount > 9 ? "9+" : cartCount}
                      </span>
                    )}
                  </div>

                  {/* Label */}
                  <div className="text-left flex flex-col min-w-0 flex-1">
                    <span
                      className="text-[13px] font-bold leading-tight  truncate"
                      style={{ color: "#0D031B" }}
                    >
                      Guest Order
                    </span>
                    <span
                      className="text-[10px] font-medium mt-0.5 truncate"
                      style={{ color: "#736C83" }}
                    >
                      {hasItems
                        ? `${cartCount} item${cartCount > 1 ? "s" : ""} · KES ${total.toLocaleString()}`
                        : "Empty cart"}
                    </span>
                  </div>

                  <ChevronDown
                    className="h-4 w-4 ml-1 shrink-0 transition-transform duration-200 group-data-[state=open]:rotate-180"
                    style={{ color: "#AEA6BF" }}
                  />
                </div>
              </Button>
            </PopoverTrigger>

            {/* ── Cart Popover ───────────────────────────────────── */}
            <PopoverContent
              side="top"
              align="end"
              sideOffset={10}
              className="p-0 overflow-hidden border-0"
              style={{
                width: "min(calc(100vw - 2rem), 400px)",
                borderRadius: "1.25rem",
                boxShadow:
                  "0 24px 60px oklch(0.45 0.12 285 / 0.18), 0 4px 20px rgba(0,0,0,0.1)",
                background: "#FDFCFF",
              }}
            >
              {/* Popover header */}
              <div
                className="flex items-center justify-between px-4 py-3 border-b"
                style={{
                  background: "oklch(0.45 0.12 285 / 0.05)",
                  borderColor: "oklch(0.45 0.12 285 / 0.1)",
                }}
              >
                <div className="flex items-center gap-2">
                  <Receipt
                    className="h-4 w-4"
                    style={{ color: "oklch(0.45 0.12 285)" }}
                  />
                  <span
                    className="text-[13px] font-bold "
                    style={{ color: "#0D031B" }}
                  >
                    Current Order
                  </span>
                  {selectedTable && (
                    <Badge
                      className="text-[10px] font-bold px-2 h-5 rounded-full border"
                      style={{
                        background: "oklch(0.45 0.12 285 / 0.1)",
                        color: "oklch(0.45 0.12 285)",
                        borderColor: "oklch(0.45 0.12 285 / 0.2)",
                      }}
                    >
                      Table {selectedTable.number}
                    </Badge>
                  )}
                </div>

                {hasItems && (
                  <div className="flex items-center gap-1.5">
                    <span
                      className="text-[11px] font-medium"
                      style={{ color: "#736C83" }}
                    >
                      KES {subtotal.toLocaleString()}
                    </span>
                  </div>
                )}
              </div>

              <Separator
                style={{ background: "oklch(0.45 0.12 285 / 0.07)" }}
              />

              {/* Cart body */}
              <div
                className="flex flex-col overflow-hidden"
                style={{ maxHeight: "75vh" }}
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
    </TooltipProvider>
  );
}