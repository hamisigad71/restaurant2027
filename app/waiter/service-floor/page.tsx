"use client";

import { useState, useEffect, Suspense } from "react";
import { AnimatePresence, motion } from "motion/react";
import { FAST_TRANSITION, SPRING_POP } from "@/lib/motion";
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
import { Spinner } from "@/components/ui/spinner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { OrderService, LiveOrder } from "@/lib/order-service";
import { useAuth } from "@/lib/auth-context";
import {
  calculateBillTotals,
  MenuService,
  normalizeTableId,
  TableService,
} from "@/lib/restaurant-store";
import {
  ShoppingCartIcon as ShoppingCart,
  ChevronDownIcon as ChevronDown,
  ChevronRightIcon as ChevronRight,
  BoltIcon as Sparkles,
  DocumentTextIcon as Receipt,
  ArrowLeftIcon as ArrowLeft,
  ArrowTrendingUpIcon as TrendingUp,
  ClockIcon as Clock,
} from "@heroicons/react/24/outline";
import { useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";

function POSLoader() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="flex flex-col items-center gap-3">
        <Spinner className="size-8 text-primary" />
        <p className="text-sm font-semibold text-foreground">Loading POS System</p>
        <p className="text-xs text-muted-foreground">Please wait a moment...</p>
      </div>
    </div>
  );
}

export default function OrdersPage() {
  return (
    <Suspense fallback={<POSLoader />}>
      <OrdersContent />
    </Suspense>
  );
}

function OrdersContent() {
  const searchParams = useSearchParams();
  const tableParam = searchParams.get("table");
  const { user } = useAuth();

  const [selectedTable, setSelectedTable] = useState<Table | null>(null);
  const [tables, setTables] = useState<Table[]>(mockTables);
  const [menuItems, setMenuItems] = useState<MenuItem[]>(allMenuItems);
  const [cartItems, setCartItems] = useState<OrderItem[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [cartOpen, setCartOpen] = useState(false);
  const [activeOrders, setActiveOrders] = useState<LiveOrder[]>([]);

  useEffect(() => {
    const unsubOrders = OrderService.subscribe(setActiveOrders);
    const unsubMenu = MenuService.subscribe(setMenuItems);
    const unsubTables = TableService.subscribe(setTables);
    return () => {
      unsubOrders();
      unsubMenu();
      unsubTables();
    };
  }, []);

  useEffect(() => {
    if (tableParam) {
      const table = tables.find(
        (t) => t.number.toString() === normalizeTableId(tableParam),
      );
      if (table) {
        setSelectedTable(table);
        toast.success(`Table ${table.number} selected`, {
          description: "Ready to take orders",
          duration: 2000,
        });
      }
    }
  }, [tableParam, tables]);

  const handleTableSelect = (table: Table) => {
    setSelectedTable(table);
    setCartItems([]);
    toast.success(`Table ${table.number} selected`);
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

    toast.success(`${menuItem.name} added`, {
      description: selectedTable
        ? `Table ${selectedTable.number} · KES ${menuItem.price.toLocaleString()}`
        : `KES ${menuItem.price.toLocaleString()}`,
      duration: 1500,
      icon: <Sparkles className="size-4" />,
    });
  };

  const handleUpdateQuantity = (menuItemId: string, quantity: number) => {
    if (quantity <= 0) {
      setCartItems((prev) => prev.filter((i) => i.menuItem.id !== menuItemId));
      toast.info("Item removed from cart");
    } else {
      setCartItems((prev) =>
        prev.map((i) =>
          i.menuItem.id === menuItemId ? { ...i, quantity } : i,
        ),
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
      selectedTable.number.toString(),
      cartItems.map((item) => ({
        ...item.menuItem,
        quantity: item.quantity,
      })),
      user?.name || "Waiter",
    );

    const tableLabel =
      selectedTable.number / 10 >= 1
        ? selectedTable.number
        : "0" + selectedTable.number;

    toast.success("Order sent to kitchen!", {
      description: `Table ${tableLabel} · ${cartCount} item${cartCount > 1 ? "s" : ""} · KES ${total.toLocaleString()}`,
      duration: 3000,
    });

    setCartItems([]);
    setSelectedTable(null);
    setCartOpen(false);
  };

  const handleClearCart = () => {
    if (cartItems.length === 0) return;
    setCartItems([]);
    toast.info("Cart cleared", { description: "All items removed" });
  };

  const filteredMenuItems =
    activeCategory === "all"
      ? menuItems.filter((i) => i.available)
      : menuItems.filter((i) => i.category === activeCategory && i.available);

  const subtotal = cartItems.reduce(
    (s, i) => s + i.menuItem.price * i.quantity,
    0,
  );
  const { total } = calculateBillTotals(subtotal);
  const cartCount = cartItems.reduce((s, i) => s + i.quantity, 0);
  const hasItems = cartItems.length > 0;

  const enrichedTables = tables.map((t) => {
    const tableOrders = activeOrders.filter(
      (o) =>
        normalizeTableId(o.tableId) === String(t.number) &&
        o.paymentStatus !== "paid" &&
        o.status !== "cancelled",
    );
    return {
      ...t,
      status: tableOrders.length > 0 ? ("occupied" as const) : t.status,
    };
  });

  return (
    <TooltipProvider>
      <div className="flex flex-col min-h-screen">
        {selectedTable && (
          <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-b bg-card/90 backdrop-blur-md sticky top-0 z-30">
            <div className="flex items-center gap-2 text-sm">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedTable(null)}
                className="gap-1.5"
              >
                <ArrowLeft className="size-3.5" />
                Tables
              </Button>

              <ChevronRight className="size-3.5 text-muted-foreground" />

              <Badge variant="secondary" className="gap-1.5">
                Table {selectedTable.number.toString().padStart(2, "0")}
              </Badge>
            </div>

            {hasItems && (
              <div className="flex items-center gap-2">
                <Separator orientation="vertical" className="h-5" />
                <Badge variant="outline" className="gap-1">
                  <Sparkles className="size-3" />
                  {cartCount} item{cartCount > 1 ? "s" : ""}
                </Badge>
                <Badge variant="default" className="tabular-nums">
                  KES {total.toLocaleString()}
                </Badge>
              </div>
            )}
          </div>
        )}

        <AnimatePresence mode="wait" initial={false}>
          {!selectedTable ? (
            <motion.div
              key="floor-tables-view"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={FAST_TRANSITION}
              className="pb-28"
            >
              <TableGrid tables={enrichedTables} onSelectTable={handleTableSelect} />
            </motion.div>
          ) : (
            <motion.div
              key={`floor-menu-view-${selectedTable.number}`}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={FAST_TRANSITION}
              className="pb-28"
            >
              <MenuGrid
                items={filteredMenuItems}
                activeCategory={activeCategory}
                onCategoryChange={setActiveCategory}
                onAddItem={handleAddToCart}
                onBack={() => setSelectedTable(null)}
                selectedTable={selectedTable}
              />
            </motion.div>
          )}
        </AnimatePresence>

        <div className="fixed bottom-6 right-4 sm:bottom-8 sm:right-6 z-50">
          <Popover open={cartOpen} onOpenChange={setCartOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "h-auto py-2.5 px-4 rounded-xl bg-card shadow-lg border transition-[border-color,box-shadow] duration-150 ease-(--ease-out)",
                  hasItems && "border-primary/40",
                )}
              >
                <div className="flex items-center gap-3">
                  <div className="relative flex size-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                    <ShoppingCart className="size-5" />
                    {cartCount > 0 && (
                      <motion.span
                        key={cartCount}
                        initial={{ scale: 0.8, opacity: 0.6 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={SPRING_POP}
                        className="absolute -top-2 -right-2"
                      >
                        <Badge
                          variant="destructive"
                          className="h-5 min-w-5 px-1 text-[10px]"
                        >
                          {cartCount > 9 ? "9+" : cartCount}
                        </Badge>
                      </motion.span>
                    )}
                  </div>

                  <div className="text-left flex flex-col">
                    <span className="text-sm font-semibold text-foreground leading-none">
                      Current Order
                    </span>
                    <span className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                      {hasItems ? (
                        <>
                          <TrendingUp className="size-3 text-primary" />
                          {cartCount} item{cartCount > 1 ? "s" : ""} · KES{" "}
                          {total.toLocaleString()}
                        </>
                      ) : (
                        <>
                          <Clock className="size-3" />
                          No items yet
                        </>
                      )}
                    </span>
                  </div>

                  <ChevronDown
                    className={cn(
                      "size-4 text-muted-foreground transition-transform",
                      cartOpen && "rotate-180",
                    )}
                  />
                </div>
              </Button>
            </PopoverTrigger>

            <PopoverContent
              side="top"
              align="end"
              sideOffset={12}
              className="p-0 overflow-hidden w-[min(calc(100vw-2rem),420px)] rounded-xl"
            >
              <div className="px-5 py-3.5 border-b bg-muted/40 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Receipt className="size-4" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold leading-none">Order Details</p>
                    {selectedTable && (
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Table {selectedTable.number.toString().padStart(2, "0")}
                      </p>
                    )}
                  </div>
                </div>

                {hasItems && (
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">
                      {cartCount} item{cartCount > 1 ? "s" : ""}
                    </Badge>
                    <span className="text-xs font-semibold text-primary tabular-nums">
                      KES {subtotal.toLocaleString()}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex flex-col overflow-hidden max-h-[70vh]">
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
