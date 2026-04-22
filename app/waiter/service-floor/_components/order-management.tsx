"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import {
  UserGroupIcon as Users,
  ArrowLeftIcon as ArrowLeft,
  PlusIcon as Plus,
  AcademicCapIcon as ChefHat,
  BeakerIcon as Wine,
  CakeIcon as Cookie,
  GiftIcon as IceCream,
  ArrowRightIcon as ArrowRight,
  MinusIcon as Minus,
  TrashIcon as Trash2,
  ShoppingCartIcon as ShoppingCart,
  MagnifyingGlassIcon as Search,
  BriefcaseIcon as UtensilsCrossed,
  SparklesIcon as Crown,
  BoltIcon as Sparkles,
  Squares2X2Icon as AllIcon,
  ShoppingBagIcon as MainIcon,
  ArrowTrendingUpIcon as TrendingUp,
  ClockIcon as Clock,
  XMarkIcon as X,
  CheckIcon as Check,
  QueueListIcon as SeafoodIcon,
} from "@heroicons/react/24/outline";
import type { Table, TableStatus, MenuItem, OrderItem } from "@/lib/types";
import { cn } from "@/lib/utils";

// ─── CONFIGURATION ────────────────────────────────────────────────────────────

const statusConfig: Record<
  TableStatus,
  {
    label: string;
    Icon: any;
    gradient: string;
    badge: string;
    selectable: boolean;
  }
> = {
  available: {
    label: "Available",
    Icon: ChefHat,
    gradient: "from-emerald-500 to-emerald-600",
    badge: "bg-emerald-500",
    selectable: true,
  },
  occupied: {
    label: "Occupied",
    Icon: Users,
    gradient: "from-slate-500 to-slate-600",
    badge: "bg-slate-500",
    selectable: true,
  },
  reserved: {
    label: "Reserved",
    Icon: ShoppingCart,
    gradient: "from-amber-500 to-amber-600",
    badge: "bg-amber-500",
    selectable: false,
  },
  cleaning: {
    label: "Cleaning",
    Icon: Crown,
    gradient: "from-blue-500 to-blue-600",
    badge: "bg-blue-500",
    selectable: false,
  },
};

const categories = [
  { id: "all", label: "All", icon: AllIcon },
  { id: "starters", label: "Appetizers", icon: ChefHat },
  { id: "main", label: "Main Dishes", icon: MainIcon },
  { id: "drinks", label: "Beverages", icon: Wine },
  { id: "snacks", label: "Snacks", icon: Cookie },
  { id: "desserts", label: "Desserts", icon: IceCream },
  { id: "seafood", label: "Seafood", icon: SeafoodIcon },
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

// ─── ENHANCED TABLE GRID ──────────────────────────────────────────────────────

interface TableGridProps {
  tables: Table[];
  onSelectTable: (table: Table) => void;
}

export function TableGrid({ tables, onSelectTable }: TableGridProps) {
  const [activeZone, setActiveZone] = useState<string>("all");
  
  const zones = ["all", "A", "B", "C"];
  
  const filteredTables = activeZone === "all" 
    ? tables 
    : tables.filter(t => t.zone === activeZone);
    
  const availableCount = tables.filter(t => t.status === "available").length;
  const occupiedCount = tables.filter(t => t.status === "occupied").length;

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Interactive Floor Plan Header */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div 
            className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg p-2"
            style={{
              background: "linear-gradient(135deg, oklch(0.42 0.14 285) 0%, oklch(0.38 0.16 275) 100%)",
            }}
          >
            <img src="/service-floor-nav.png" className="w-full h-full brightness-0 invert object-contain" alt="Service Floor" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight" style={{ color: "#0D031B" }}>
              Interactive Floor Plan
            </h1>
            <p className="text-sm font-medium mt-1" style={{ color: "#736C83" }}>
              {availableCount} available • {occupiedCount} occupied
            </p>
          </div>
        </div>

        {/* Zone Filter */}
        <div className="flex bg-white/50 backdrop-blur-sm p-1.5 rounded-2xl w-fit border border-oklch(0.42 0.14 285 / 0.08) shrink-0">
          {zones.map(zone => (
            <button
              key={zone}
              onClick={() => setActiveZone(zone)}
              className={cn(
                "px-5 py-2.5 rounded-xl text-[11px] font-bold uppercase tracking-wider transition-all duration-300",
                activeZone === zone 
                  ? "bg-white text-oklch(0.42 0.14 285) shadow-lg" 
                  : "text-[#736C83] hover:text-oklch(0.42 0.14 285)"
              )}
            >
              Zone {zone.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-6 flex-wrap mb-8">
        {[
          { label: "Available", color: "bg-emerald-500" },
          { label: "Occupied", color: "bg-purple-500" },
          { label: "Reserved", color: "bg-amber-500" },
          { label: "Cleaning", color: "bg-blue-500" },
        ].map(item => (
          <div key={item.label} className="flex items-center gap-2">
            <div className={cn("w-2 h-2 rounded-full shadow-sm", item.color)} />
            <span className="text-xs font-bold text-[#736C83] tracking-wide">{item.label}</span>
          </div>
        ))}
      </div>

      {/* Enhanced Grid - 2 columns on mobile */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3 sm:gap-4 lg:gap-5">
        {filteredTables.length === 0 ? (
          <div className="col-span-full flex flex-col items-center justify-center py-16 sm:py-24 gap-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center" 
              style={{ background: "oklch(0.42 0.14 285 / 0.08)" }}>
              <UtensilsCrossed className="h-8 w-8 sm:h-10 sm:w-10" style={{ color: "#AEA6BF" }} strokeWidth={2.5} />
            </div>
            <p className="text-sm font-bold uppercase" style={{ color: "#9A94AA" }}>No tables found in this zone</p>
          </div>
        ) : (
          filteredTables.map((table, index) => {
            const config = statusConfig[table.status];
            const imgSrc = tableImages[index % tableImages.length];
            const Icon = config.Icon;
            
            return (
              <Card
                key={table.id}
                onClick={() => config.selectable && onSelectTable(table)}
                className={cn(
                  "group relative overflow-hidden border-0 rounded-xl shadow-md transition-all duration-500",
                  config.selectable
                    ? "cursor-pointer hover:shadow-2xl hover:-translate-y-2 active:translate-y-0 active:scale-95"
                    : "cursor-not-allowed opacity-60"
                )}
                style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.08)" }}
              >


                {/* Enhanced Image */}
                <div className="relative h-32 sm:h-40 overflow-hidden">
                  <img
                    src={imgSrc}
                    alt={`Table ${table.number}`}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                  {/* Status badge */}
                  <div className="absolute top-2 left-2">
                    <Badge className={cn("text-[8px] sm:text-[9px] font-bold uppercase px-2 py-0.5 rounded-lg border-0 text-white shadow-lg", config.badge)}>
                      {config.label}
                    </Badge>
                  </div>

                  {/* Capacity */}
                  <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-1 rounded-lg text-white backdrop-blur-md border border-white/20"
                    style={{ background: "rgba(0,0,0,0.4)" }}>
                    <Users className="h-3 w-3" strokeWidth={2.5} />
                    <span className="text-[10px] font-bold">{table.seats}</span>
                  </div>

                  {/* Table number */}
                  <div className="absolute bottom-2 left-2.5">
                    <span className="text-[9px] text-white/60 uppercase font-semibold block leading-none mb-0.5">Table</span>
                    <span className="text-2xl sm:text-3xl text-white font-bold leading-none">
                      {String(table.number).padStart(2, "0")}
                    </span>
                  </div>
                </div>

                {/* Details */}
                <CardContent className="p-3 sm:p-4 space-y-3">
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-[9px] uppercase font-semibold tracking-wide" style={{ color: "#9A94AA" }}>Zone</p>
                      <p className="text-xs font-bold mt-0.5" style={{ color: "#0D031B" }}>{table.zone || "\u2014"}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[9px] uppercase font-semibold tracking-wide" style={{ color: "#9A94AA" }}>Status</p>
                      <div className="flex items-center gap-1 justify-end mt-0.5">
                        <div className={cn("w-1.5 h-1.5 rounded-full bg-gradient-to-br", config.gradient)} />
                        <p className="text-xs font-bold" style={{ color: "#0D031B" }}>{config.label}</p>
                      </div>
                    </div>
                  </div>

                  {/* Action hint */}
                  {config.selectable && (
                    <div className="pt-2 border-t opacity-0 group-hover:opacity-100 transition-opacity duration-300" 
                      style={{ borderColor: "oklch(0.42 0.14 285 / 0.08)" }}>
                      <div className="flex items-center justify-center gap-1.5">
                        <span className="text-[9px] font-bold uppercase tracking-wide" style={{ color: "oklch(0.42 0.14 285)" }}>
                          Select Table
                        </span>
                        <ArrowRight className="h-3 w-3" style={{ color: "oklch(0.42 0.14 285)" }} strokeWidth={2.5} />
                      </div>
                    </div>
                  )}
                </CardContent>

                {/* Hover overlay */}
                {config.selectable && (
                  <div className="absolute inset-0 bg-gradient-to-br from-oklch(0.42 0.14 285)/0 to-oklch(0.42 0.14 285)/0 group-hover:from-oklch(0.42 0.14 285)/5 group-hover:to-oklch(0.42 0.14 285)/10 transition-all duration-500 pointer-events-none" />
                )}
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}

// ─── ENHANCED MENU GRID ───────────────────────────────────────────────────────

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
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Enhanced Header */}
      <div 
        className="px-4 sm:px-6 py-4 sm:py-5 border-b backdrop-blur-xl sticky top-0 z-10"
        style={{
          background: "rgba(255,255,255,0.92)",
          borderColor: "oklch(0.42 0.14 285 / 0.08)",
        }}
      >
        {/* Gradient accent */}
        <div className="absolute top-0 left-0 right-0 h-[2px]"
          style={{ background: "linear-gradient(90deg, oklch(0.42 0.14 285) 0%, oklch(0.55 0.18 270) 50%, oklch(0.42 0.14 285) 100%)" }}
        />

        <div className="flex flex-col gap-4">
          {/* Title row */}
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="icon"
              onClick={onBack}
              className="h-10 w-10 rounded-xl border-2 shrink-0 transition-all hover:scale-105 active:scale-95"
              style={{
                borderColor: "oklch(0.42 0.14 285 / 0.15)",
                color: "oklch(0.42 0.14 285)",
              }}
            >
              <ArrowLeft className="h-4 w-4" strokeWidth={2.5} />
            </Button>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight" style={{ color: "#0D031B" }}>
                  Grande Menu
                </h2>
                {selectedTable && (
                  <Badge className="text-[10px] font-bold px-2.5 py-1 rounded-lg border-0 text-white shadow-md"
                    style={{ background: "oklch(0.42 0.14 285)" }}>
                    Table {selectedTable.number.toString().padStart(2, "0")}
                  </Badge>
                )}
              </div>
              <p className="text-[11px] font-semibold mt-1" style={{ color: "#736C83" }}>
                {filtered.length} item{filtered.length !== 1 ? "s" : ""} available
              </p>
            </div>

            {/* Search - desktop */}
            <div className="relative w-64 shrink-0 hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: "#AEA6BF" }} strokeWidth={2.5} />
              <Input
                placeholder="Search menu…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 h-10 border-2 rounded-xl text-sm"
                style={{
                  borderColor: "oklch(0.42 0.14 285 / 0.12)",
                  color: "#0D031B",
                }}
              />
            </div>
          </div>

          {/* Search - mobile */}
          <div className="relative sm:hidden">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: "#AEA6BF" }} strokeWidth={2.5} />
            <Input
              placeholder="Search menu…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 h-10 border-2 rounded-xl text-sm"
              style={{
                borderColor: "oklch(0.42 0.14 285 / 0.12)",
                color: "#0D031B",
              }}
            />
          </div>

          {/* Enhanced Category tabs - scrollable on mobile */}
          <ScrollArea className="w-full">
            <Tabs value={activeCategory} onValueChange={onCategoryChange}>
              <TabsList className="bg-white border-2 p-1 h-auto gap-1 rounded-xl inline-flex w-full sm:w-auto"
                style={{ borderColor: "oklch(0.42 0.14 285 / 0.12)" }}>
                {categories.map((cat) => (
                  <TabsTrigger
                    key={cat.id}
                    value={cat.id}
                    className={cn(
                      "px-3 py-2 text-[10px] font-bold uppercase rounded-lg transition-all duration-300 whitespace-nowrap",
                      "data-[state=active]:text-white data-[state=active]:shadow-md",
                      "text-[#736C83]"
                    )}
                    style={{
                      background: activeCategory === cat.id
                        ? "linear-gradient(135deg, oklch(0.42 0.14 285) 0%, oklch(0.38 0.16 275) 100%)"
                        : "transparent"
                    }}
                  >
                    {cat.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </ScrollArea>
        </div>
      </div>

      {/* Menu Grid - 2 columns on mobile */}
      <ScrollArea className="flex-1">
        <div className="p-4 sm:p-6 lg:p-8 pb-24">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 sm:py-24 gap-4">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center"
                style={{ background: "oklch(0.42 0.14 285 / 0.08)" }}>
                <UtensilsCrossed className="h-8 w-8 sm:h-10 sm:w-10" style={{ color: "#AEA6BF" }} strokeWidth={2.5} />
              </div>
              <div className="text-center">
                <p className="text-sm font-bold" style={{ color: "#0D031B" }}>No items found</p>
                <p className="text-xs mt-1" style={{ color: "#9A94AA" }}>Try a different category or search term</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-5">
              {filtered.map((item) => {
                const imgSrc = item.image || categoryImages[item.category] || 
                  "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=300&h=200&fit=crop";
                
                return (
                  <Card
                    key={item.id}
                    onClick={() => onAddItem(item)}
                    className="group overflow-hidden border-0 rounded-2xl cursor-pointer transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 active:translate-y-0 active:scale-95"
                    style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.08)" }}
                  >
                    {/* Image */}
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <img
                        src={imgSrc}
                        alt={item.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                      {/* Hover overlay */}
                      <div className="absolute inset-0 bg-oklch(0.42 0.14 285)/0 group-hover:bg-oklch(0.42 0.14 285)/20 transition-all duration-500 flex items-center justify-center">
                        <div className="opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100 transition-all duration-300">
                          <div className="w-12 h-12 rounded-full flex items-center justify-center shadow-xl"
                            style={{ background: "white" }}>
                            <Plus className="h-6 w-6" style={{ color: "oklch(0.42 0.14 285)" }} strokeWidth={2.5} />
                          </div>
                        </div>
                      </div>

                      {/* Category badge */}
                      <div className="absolute top-2 left-2">
                        <Badge className="text-[9px] font-bold uppercase px-2 py-0.5 rounded-lg border-0 shadow-md"
                          style={{ background: "rgba(255,255,255,0.9)", color: "#736C83" }}>
                          {item.category}
                        </Badge>
                      </div>
                    </div>

                    {/* Content */}
                    <CardContent className="p-3 sm:p-4">
                      <h3 className="font-bold text-sm truncate leading-tight transition-colors group-hover:text-oklch(0.42 0.14 285)"
                        style={{ color: "#0D031B" }}>
                        {item.name}
                      </h3>
                      <div className="flex items-center justify-between mt-2.5">
                        <p className="text-sm font-bold" style={{ color: "oklch(0.42 0.14 285)" }}>
                          KES {item.price.toLocaleString()}
                        </p>
                        <div className="w-7 h-7 rounded-lg flex items-center justify-center border-2 transition-all group-hover:scale-110"
                          style={{
                            background: "oklch(0.42 0.14 285 / 0.08)",
                            borderColor: "oklch(0.42 0.14 285 / 0.2)",
                          }}>
                          <Plus className="h-3.5 w-3.5" style={{ color: "oklch(0.42 0.14 285)" }} strokeWidth={2.5} />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}

// ─── ENHANCED ORDER CART ──────────────────────────────────────────────────────

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
    <Card className="w-full h-full flex flex-col overflow-hidden border-0 rounded-[24px] shadow-xl"
      style={{ boxShadow: "0 8px 32px rgba(0,0,0,0.08)" }}>
      
      {/* Enhanced Header */}
      <CardHeader className="shrink-0 p-0">
        <div className="px-5 pt-5 pb-4 border-b"
          style={{
            background: "linear-gradient(135deg, oklch(0.42 0.14 285 / 0.04) 0%, oklch(0.42 0.14 285 / 0.02) 100%)",
            borderColor: "oklch(0.42 0.14 285 / 0.08)",
          }}>
          
          {/* Gradient accent */}
          <div className="absolute top-0 left-0 right-0 h-[3px]"
            style={{ background: "linear-gradient(90deg, oklch(0.42 0.14 285) 0%, oklch(0.55 0.18 270) 50%, oklch(0.42 0.14 285) 100%)" }}
          />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-md"
                style={{ background: "linear-gradient(135deg, oklch(0.42 0.14 285) 0%, oklch(0.38 0.16 275) 100%)" }}>
                <ShoppingCart className="h-5 w-5 text-white" strokeWidth={2.5} />
              </div>
              <div>
                <p className="text-sm font-bold leading-tight" style={{ color: "#0D031B" }}>Guest Order</p>
                <p className="text-[10px] font-medium mt-0.5" style={{ color: "#736C83" }}>Selection overview</p>
              </div>
            </div>

            {table ? (
              <Badge className="text-[11px] font-bold px-3 py-1 rounded-lg border-0 text-white shadow-md"
                style={{ background: "oklch(0.42 0.14 285)" }}>
                Table {table.number.toString().padStart(2, "0")}
              </Badge>
            ) : (
              <Badge variant="outline" className="text-[11px] px-3 py-1 rounded-lg border-2"
                style={{ borderColor: "#AEA6BF", color: "#736C83" }}>
                No Table
              </Badge>
            )}
          </div>

          {/* Enhanced Progress */}
          {items.length > 0 && (
            <div className="mt-4 flex items-center gap-2.5">
              <div className="h-2 flex-1 rounded-full overflow-hidden"
                style={{ background: "oklch(0.42 0.14 285 / 0.1)" }}>
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${Math.min((items.length / 10) * 100, 100)}%`,
                    background: "linear-gradient(90deg, oklch(0.42 0.14 285) 0%, oklch(0.55 0.18 270) 100%)",
                  }}
                />
              </div>
              <span className="text-[10px] font-bold shrink-0" style={{ color: "oklch(0.42 0.14 285)" }}>
                {items.length} item{items.length !== 1 ? "s" : ""}
              </span>
            </div>
          )}
        </div>
      </CardHeader>

      {/* Body */}
      <CardContent className="flex-1 flex flex-col p-0 overflow-hidden min-h-0">
        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-6 gap-4">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center"
              style={{ background: "oklch(0.42 0.14 285 / 0.08)" }}>
              <ShoppingCart className="h-8 w-8" style={{ color: "#AEA6BF" }} strokeWidth={2.5} />
            </div>
            <div className="text-center">
              <p className="text-sm font-bold" style={{ color: "#0D031B" }}>Cart is empty</p>
              <p className="text-xs mt-1 leading-relaxed" style={{ color: "#9A94AA" }}>
                {table ? "Browse the menu and add items" : "Select a table to get started"}
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* Cart Items */}
            <ScrollArea className="flex-1 min-h-0">
              <div className="p-4 space-y-2.5">
                {items.map((item, index) => (
                  <div
                    key={item.menuItem.id}
                    className="flex items-center gap-3 px-3 py-3 rounded-xl border-2 transition-all hover:shadow-md"
                    style={{
                      background: "oklch(0.42 0.14 285 / 0.02)",
                      borderColor: "oklch(0.42 0.14 285 / 0.08)",
                    }}
                  >
                    {/* Index */}
                    <div className="w-6 h-6 rounded-lg shrink-0 flex items-center justify-center text-[11px] font-bold border"
                      style={{
                        background: "white",
                        borderColor: "oklch(0.42 0.14 285 / 0.2)",
                        color: "oklch(0.42 0.14 285)",
                      }}>
                      {index + 1}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-bold truncate leading-tight" style={{ color: "#0D031B" }}>
                        {item.menuItem.name}
                      </p>
                      <p className="text-[11px] font-semibold mt-1" style={{ color: "#736C83" }}>
                        KES {item.menuItem.price.toLocaleString()}
                      </p>
                    </div>

                    {/* Controls */}
                    <div className="flex items-center gap-1.5 shrink-0">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-7 w-7 rounded-lg border-2 transition-all hover:scale-110 active:scale-95"
                        onClick={() => onUpdateQuantity(item.menuItem.id, item.quantity - 1)}
                        style={{
                          borderColor: "oklch(0.42 0.14 285 / 0.2)",
                          color: "oklch(0.42 0.14 285)",
                        }}
                      >
                        <Minus className="h-3 w-3" strokeWidth={2.5} />
                      </Button>
                      
                      <span className="w-6 text-center text-sm font-bold" style={{ color: "#0D031B" }}>
                        {item.quantity}
                      </span>
                      
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-7 w-7 rounded-lg border-2 transition-all hover:scale-110 active:scale-95"
                        onClick={() => onUpdateQuantity(item.menuItem.id, item.quantity + 1)}
                        style={{
                          borderColor: "oklch(0.42 0.14 285 / 0.2)",
                          color: "oklch(0.42 0.14 285)",
                        }}
                      >
                        <Plus className="h-3 w-3" strokeWidth={2.5} />
                      </Button>
                      
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 rounded-lg ml-1 text-red-400 hover:text-red-600 hover:bg-red-50 transition-all hover:scale-110 active:scale-95"
                        onClick={() => onRemoveItem(item.menuItem.id)}
                      >
                        <Trash2 className="h-3.5 w-3.5" strokeWidth={2.5} />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            {/* Enhanced Summary */}
            <div className="shrink-0 border-t" style={{ borderColor: "oklch(0.42 0.14 285 / 0.08)" }}>
              <div className="px-5 pt-4 pb-3 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-semibold" style={{ color: "#736C83" }}>Subtotal</span>
                  <span className="text-xs font-bold" style={{ color: "#0D031B" }}>KES {subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs font-semibold" style={{ color: "#736C83" }}>VAT (16%)</span>
                  <span className="text-xs font-bold" style={{ color: "#0D031B" }}>KES {tax.toLocaleString()}</span>
                </div>
                
                <Separator style={{ background: "oklch(0.42 0.14 285 / 0.08)" }} />
                
                <div className="flex justify-between items-end pt-1">
                  <span className="text-sm font-bold" style={{ color: "#0D031B" }}>Total</span>
                  <div className="text-right">
                    <p className="text-2xl font-bold leading-tight" style={{ color: "oklch(0.42 0.14 285)" }}>
                      KES {total.toLocaleString()}
                    </p>
                    <p className="text-[9px] font-medium mt-0.5" style={{ color: "#AEA6BF" }}>Inclusive of VAT</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 px-4 pb-4">
                <Button
                  variant="outline"
                  className="flex-1 h-10 text-xs font-bold uppercase rounded-xl border-2 transition-all hover:scale-105 active:scale-95"
                  onClick={onClearCart}
                  style={{
                    borderColor: "oklch(0.42 0.14 285 / 0.15)",
                    color: "#736C83",
                  }}
                >
                  Clear
                </Button>
                <Button
                  className="flex-[2] h-10 text-xs font-bold uppercase rounded-xl gap-2 border-0 text-white transition-all hover:-translate-y-0.5 hover:shadow-xl active:translate-y-0 active:scale-95 disabled:opacity-50"
                  onClick={onPlaceOrder}
                  disabled={!table}
                  style={{
                    background: "linear-gradient(135deg, oklch(0.42 0.14 285) 0%, oklch(0.38 0.16 275) 100%)",
                    boxShadow: "0 4px 16px oklch(0.42 0.14 285 / 0.3)",
                  }}
                >
                  <Check className="h-4 w-4" strokeWidth={2.5} />
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