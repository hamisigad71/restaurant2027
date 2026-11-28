"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { FAST_TRANSITION, SPRING_SNAPPY } from "@/lib/motion";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import {
  UserGroupIcon as Users,
  ArrowLeftIcon as ArrowLeft,
  PlusIcon as Plus,
  ArrowRightIcon as ArrowRight,
  MinusIcon as Minus,
  TrashIcon as Trash2,
  ShoppingCartIcon as ShoppingCart,
  MagnifyingGlassIcon as Search,
  BriefcaseIcon as UtensilsCrossed,
  ArrowTrendingUpIcon as TrendingUp,
  CheckIcon as Check,
  StarIcon as Star,
  EllipsisHorizontalIcon as MoreHorizontal,
} from "@heroicons/react/24/outline";
import type { Table, TableStatus, MenuItem, OrderItem } from "@/lib/types";
import { cn } from "@/lib/utils";

const statusConfig: Record<
  TableStatus,
  { label: string; dot: string; selectable: boolean }
> = {
  available: { label: "Available", dot: "bg-success", selectable: true },
  occupied: { label: "Occupied", dot: "bg-primary", selectable: true },
  reserved: { label: "Reserved", dot: "bg-warning", selectable: false },
  cleaning: { label: "Cleaning", dot: "bg-sky-500", selectable: false },
};

const categories = [
  { id: "all", label: "All" },
  { id: "starters", label: "Appetizers" },
  { id: "main", label: "Main Dishes" },
  { id: "drinks", label: "Beverages" },
  { id: "snacks", label: "Snacks" },
  { id: "desserts", label: "Desserts" },
  { id: "seafood", label: "Seafood" },
];

const categoryImages: Record<string, string> = {
  starters: "https://images.unsplash.com/photo-1541014741259-df529411b96a?w=300&h=200&fit=crop",
  main: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300&h=200&fit=crop",
  drinks: "https://images.unsplash.com/photo-1544145945-f90425340c7e?w=300&h=200&fit=crop",
  snacks: "https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=300&h=200&fit=crop",
  desserts: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=300&h=200&fit=crop",
  seafood: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=300&h=200&fit=crop",
};

const tableImages = [
  "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=300&h=200&fit=crop",
  "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?w=300&h=200&fit=crop",
  "https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?w=300&h=200&fit=crop",
  "https://images.unsplash.com/photo-1525610553991-2bede1a236e2?w=300&h=200&fit=crop",
  "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=300&h=200&fit=crop",
  "https://images.unsplash.com/photo-1424847651672-bf20a4b0982b?w=300&h=200&fit=crop",
  "https://images.unsplash.com/photo-1522792043064-2db24c3a6479?w=300&h=200&fit=crop",
  "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=300&h=200&fit=crop",
  "https://images.unsplash.com/photo-1544148103-0773bf10d330?w=300&h=200&fit=crop",
  "https://images.unsplash.com/photo-1481833761820-0509d3217039?w=300&h=200&fit=crop",
];

interface TableGridProps {
  tables: Table[];
  onSelectTable: (table: Table) => void;
}

export function TableGrid({ tables, onSelectTable }: TableGridProps) {
  const [activeZone, setActiveZone] = useState<string>("all");
  const zones = ["all", "A", "B", "C"];

  const filteredTables =
    activeZone === "all" ? tables : tables.filter((t) => t.zone === activeZone);

  const availableCount = tables.filter((t) => t.status === "available").length;
  const occupiedCount = tables.filter((t) => t.status === "occupied").length;

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex size-12 items-center justify-center rounded-xl bg-primary p-2 shadow-sm">
            <img
              src="/service-floor-nav.png"
              className="w-full h-full brightness-0 invert object-contain"
              alt="Service Floor"
            />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-semibold text-foreground">
              Interactive Floor Plan
            </h1>
            <p className="text-sm text-muted-foreground">
              {availableCount} available • {occupiedCount} occupied
            </p>
          </div>
        </div>

        <Tabs value={activeZone} onValueChange={setActiveZone}>
          <TabsList>
            {zones.map((zone) => {
              const isActive = activeZone === zone;
              return (
                <TabsTrigger
                  key={zone}
                  value={zone}
                  className="relative uppercase text-xs data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                >
                  {isActive && (
                    <motion.span
                      layoutId="waiter-zone-pill"
                      transition={SPRING_SNAPPY}
                      aria-hidden="true"
                      className="absolute inset-0 rounded-md bg-background shadow-sm"
                    />
                  )}
                  <span className="relative z-10">Zone {zone.toUpperCase()}</span>
                </TabsTrigger>
              );
            })}
          </TabsList>
        </Tabs>
      </div>

      <div className="flex items-center gap-5 flex-wrap">
        {[
          { label: "Available", color: "bg-success" },
          { label: "Occupied", color: "bg-primary" },
          { label: "Reserved", color: "bg-warning" },
          { label: "Cleaning", color: "bg-sky-500" },
        ].map((item) => (
          <div key={item.label} className="flex items-center gap-2">
            <span className={cn("size-2 rounded-full", item.color)} />
            <span className="text-xs font-medium text-muted-foreground">{item.label}</span>
          </div>
        ))}
      </div>

      {filteredTables.length === 0 ? (
        <Empty className="py-16 border">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <UtensilsCrossed />
            </EmptyMedia>
            <EmptyTitle>No tables found in this zone</EmptyTitle>
            <EmptyDescription>Select another zone to view tables.</EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <div className="grid grid-cols-2 min-[480px]:grid-cols-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3 sm:gap-4">
          {filteredTables.map((table, index) => {
            const config = statusConfig[table.status];
            const imgSrc = tableImages[index % tableImages.length];

            return (
              <Card
                key={table.id}
                size="sm"
                onClick={() => config.selectable && onSelectTable(table)}
                className={cn(
                  "group relative gap-0 py-0 overflow-hidden transition-[border-color,box-shadow,opacity] duration-150 ease-(--ease-out)",
                  config.selectable
                    ? "cursor-pointer hover:shadow-md hover:border-primary/40"
                    : "cursor-not-allowed opacity-60",
                )}
              >
                <div className="relative h-28 sm:h-36 overflow-hidden bg-muted">
                  <img
                    src={imgSrc}
                    alt={`Table ${table.number}`}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />

                  <div className="absolute top-2 left-2">
                    <Badge variant="secondary" className="text-[10px] uppercase">
                      {config.label}
                    </Badge>
                  </div>

                  <Badge
                    variant="secondary"
                    className="absolute top-2 right-2 gap-1 bg-black/60 text-white border-0 text-[10px]"
                  >
                    <Users className="size-3" />
                    {table.seats}
                  </Badge>

                  <div className="absolute bottom-2 left-2.5">
                    <span className="text-[9px] text-white/70 uppercase font-semibold block leading-none mb-0.5">
                      Table
                    </span>
                    <span className="text-xl sm:text-2xl text-white font-bold leading-none">
                      {String(table.number).padStart(2, "0")}
                    </span>
                  </div>
                </div>

                <CardContent className="py-3 space-y-2">
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-[10px] uppercase text-muted-foreground font-medium">Zone</p>
                      <p className="text-xs font-semibold text-foreground">
                        {table.zone || "—"}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] uppercase text-muted-foreground font-medium">
                        Status
                      </p>
                      <div className="flex items-center gap-1 justify-end">
                        <span className={cn("size-1.5 rounded-full", config.dot)} />
                        <p className="text-xs font-semibold text-foreground">{config.label}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>

                {config.selectable && (
                  <CardFooter className="border-t py-2 justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase text-primary">
                      Select Table <ArrowRight className="size-3" />
                    </span>
                  </CardFooter>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

interface MenuGridProps {
  items: MenuItem[];
  activeCategory: string;
  onCategoryChange: (category: string) => void;
  onAddItem: (item: MenuItem) => void;
  onBack: () => void;
  selectedTable: Table | null;
}

export function MenuGrid({
  items,
  activeCategory,
  onCategoryChange,
  onAddItem,
  onBack,
  selectedTable,
}: MenuGridProps) {
  const [search, setSearch] = useState("");

  const filtered = items.filter((item) => {
    const matchesCat = activeCategory === "all" || item.category === activeCategory;
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="flex flex-col">
      <div className="px-4 sm:px-6 py-4 border-b bg-card/90 backdrop-blur-md sticky top-12 z-20 space-y-3">
        <div className="flex items-center gap-3">
          <Button variant="outline" size="icon-sm" onClick={onBack}>
            <ArrowLeft className="size-4" />
          </Button>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-lg sm:text-xl font-semibold text-foreground">Grande Menu</h2>
              {selectedTable && (
                <Badge>Table {selectedTable.number.toString().padStart(2, "0")}</Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              {filtered.length} item{filtered.length !== 1 ? "s" : ""} available
            </p>
          </div>

          <InputGroup className="w-60 hidden sm:flex">
            <InputGroupAddon>
              <Search />
            </InputGroupAddon>
            <InputGroupInput
              placeholder="Search menu…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </InputGroup>
        </div>

        <InputGroup className="sm:hidden">
          <InputGroupAddon>
            <Search />
          </InputGroupAddon>
          <InputGroupInput
            placeholder="Search menu…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </InputGroup>

        <ScrollArea className="w-full">
          <Tabs value={activeCategory} onValueChange={onCategoryChange}>
            <TabsList>
              {categories.map((cat) => {
                const isActive = activeCategory === cat.id;
                return (
                  <TabsTrigger
                    key={cat.id}
                    value={cat.id}
                    className="relative data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                  >
                    {isActive && (
                      <motion.span
                        layoutId="waiter-cat-pill"
                        transition={SPRING_SNAPPY}
                        aria-hidden="true"
                        className="absolute inset-0 rounded-md bg-background shadow-sm"
                      />
                    )}
                    <span className="relative z-10">{cat.label}</span>
                  </TabsTrigger>
                );
              })}
            </TabsList>
          </Tabs>
        </ScrollArea>
      </div>

      <div className="px-4 sm:px-6 lg:px-8 py-6 pb-24">
        {filtered.length === 0 ? (
          <Empty className="py-16 border">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <Search />
              </EmptyMedia>
              <EmptyTitle>No items found</EmptyTitle>
              <EmptyDescription>Try a different category or search term.</EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {filtered.map((item) => {
              const imgSrc =
                item.image ||
                categoryImages[item.category] ||
                "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=300&h=200&fit=crop";

              return (
                <Card
                  key={item.id}
                  size="sm"
                  className="group gap-0 py-0 overflow-hidden transition-[border-color,box-shadow] duration-150 ease-(--ease-out) hover:shadow-md"
                >
                  <div className="relative aspect-[4/3] overflow-hidden shrink-0 bg-muted">
                    <img
                      src={imgSrc}
                      alt={item.name}
                      className="w-full h-full object-cover transition-transform duration-300 ease-(--ease-out) group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

                    <Badge
                      variant="default"
                      className="absolute top-2 left-2 text-[9px] uppercase gap-1"
                    >
                      <span className="size-1.5 rounded-full bg-current" />
                      Live
                    </Badge>

                    <div className="absolute bottom-2 left-2.5">
                      <p className="text-white font-bold text-sm leading-none tabular-nums">
                        KES {item.price.toLocaleString()}
                      </p>
                      <p className="text-white/70 text-[9px] font-medium uppercase mt-0.5">
                        {item.category}
                      </p>
                    </div>

                    <Badge
                      variant="secondary"
                      className="absolute bottom-2 right-2 gap-1 bg-black/60 text-white border-0 text-[10px]"
                    >
                      <Star className="size-2.5 fill-yellow-400 text-yellow-400" />
                      4.8
                    </Badge>
                  </div>

                  <CardHeader className="pt-3 pb-1">
                    <CardTitle className="text-xs leading-snug line-clamp-2">
                      {item.name}
                    </CardTitle>
                    <CardAction>
                      <MoreHorizontal className="size-3.5 text-muted-foreground" />
                    </CardAction>
                  </CardHeader>

                  <CardContent className="pb-2 flex-1">
                    <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                      <span className="inline-flex items-center gap-1 uppercase font-medium">
                        <TrendingUp className="size-3 text-primary" /> High Demand
                      </span>
                      <span>50+ orders</span>
                    </div>
                  </CardContent>

                  <CardFooter className="pt-0 pb-3">
                    <Button
                      size="xs"
                      variant="secondary"
                      className="w-full"
                      onClick={() => onAddItem(item)}
                    >
                      <ShoppingCart className="size-3" />
                      Add to Order
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

interface OrderCartProps {
  table: Table | null;
  items: OrderItem[];
  onUpdateQuantity: (menuItemId: string, quantity: number) => void;
  onRemoveItem: (menuItemId: string) => void;
  onPlaceOrder: () => void;
  onClearCart: () => void;
}

export function OrderCart({
  table,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onPlaceOrder,
  onClearCart,
}: OrderCartProps) {
  const subtotal = items.reduce((sum, item) => sum + item.menuItem.price * item.quantity, 0);
  const tax = Math.round(subtotal * 0.16);
  const total = subtotal + tax;

  return (
    <Card className="w-full h-full gap-0 py-0 overflow-hidden border-0 shadow-none">
      <CardHeader className="py-4 border-b bg-muted/30">
        <div className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <ShoppingCart className="size-4" />
          </div>
          <div>
            <CardTitle className="text-sm">Guest Order</CardTitle>
            <CardDescription className="text-xs">Selection overview</CardDescription>
          </div>
        </div>
        <CardAction>
          {table ? (
            <Badge>Table {table.number.toString().padStart(2, "0")}</Badge>
          ) : (
            <Badge variant="outline">No Table</Badge>
          )}
        </CardAction>

        {items.length > 0 && (
          <div className="col-span-full mt-2 flex items-center gap-2.5">
            <Progress value={Math.min((items.length / 10) * 100, 100)} className="h-1.5 flex-1" />
            <span className="text-xs font-medium text-primary shrink-0">
              {items.length} item{items.length !== 1 ? "s" : ""}
            </span>
          </div>
        )}
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0 overflow-hidden min-h-0">
        {items.length === 0 ? (
          <Empty className="py-12">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <ShoppingCart />
              </EmptyMedia>
              <EmptyTitle className="text-base">Cart is empty</EmptyTitle>
              <EmptyDescription>
                {table ? "Browse the menu and add items" : "Select a table to get started"}
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <>
            <ScrollArea className="flex-1 min-h-0">
              <div className="p-4 space-y-2.5">
                <AnimatePresence mode="popLayout" initial={false}>
                  {items.map((item, index) => (
                    <motion.div
                      key={item.menuItem.id}
                      layout="position"
                      initial={{ opacity: 0, y: 6, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, x: 14, scale: 0.96 }}
                      transition={FAST_TRANSITION}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg border bg-muted/20"
                    >
                      <Badge variant="outline" className="size-6 p-0 justify-center shrink-0">
                        {index + 1}
                      </Badge>

                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate text-foreground">
                          {item.menuItem.name}
                        </p>
                        <p className="text-xs text-muted-foreground tabular-nums">
                          KES {item.menuItem.price.toLocaleString()}
                        </p>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <ButtonGroup>
                          <Button
                            variant="outline"
                            size="icon-xs"
                            onClick={() => onUpdateQuantity(item.menuItem.id, item.quantity - 1)}
                          >
                            <Minus className="size-3" />
                          </Button>
                          <span className="inline-flex items-center justify-center w-7 text-xs font-semibold tabular-nums border-y bg-background">
                            {item.quantity}
                          </span>
                          <Button
                            variant="outline"
                            size="icon-xs"
                            onClick={() => onUpdateQuantity(item.menuItem.id, item.quantity + 1)}
                          >
                            <Plus className="size-3" />
                          </Button>
                        </ButtonGroup>

                        <Button
                          variant="ghost"
                          size="icon-xs"
                          className="text-destructive hover:bg-destructive/10 hover:text-destructive ml-1"
                          onClick={() => onRemoveItem(item.menuItem.id)}
                        >
                          <Trash2 className="size-3.5" />
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </ScrollArea>

            <div className="shrink-0 border-t bg-card">
              <div className="px-5 pt-3.5 pb-3 space-y-1.5 text-xs">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal</span>
                  <span className="font-medium text-foreground tabular-nums">
                    KES {subtotal.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>VAT (16%)</span>
                  <span className="font-medium text-foreground tabular-nums">
                    KES {tax.toLocaleString()}
                  </span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between items-baseline">
                  <span className="text-sm font-semibold text-foreground">Total</span>
                  <div className="text-right">
                    <p className="text-xl font-bold text-primary tabular-nums">
                      KES {total.toLocaleString()}
                    </p>
                    <p className="text-[10px] text-muted-foreground">Inclusive of VAT</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 px-4 pb-4">
                <Button variant="outline" className="flex-1" onClick={onClearCart}>
                  Clear
                </Button>
                <Button
                  className="flex-[2] gap-2"
                  onClick={onPlaceOrder}
                  disabled={!table}
                >
                  <Check className="size-4" />
                  Place Order
                </Button>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
