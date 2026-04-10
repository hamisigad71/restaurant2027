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
  Users,
  ArrowLeft,
  Plus,
  UtensilsCrossed,
  Wine,
  Cookie,
  IceCream,
  ArrowRight,
  Minus,
  Trash2,
  ShoppingCart,
  Search,
  ChefHat,
  Crown,
} from "lucide-react";
import type { Table, TableStatus, MenuItem, OrderItem } from "@/lib/types";
import {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
  EmptyMedia,
} from "@/components/ui/empty";
import { cn } from "@/lib/utils";

// ─── TYPES ────────────────────────────────────────────────────────────────────

const zones = ["All", "A", "B", "C"];

const statusConfig: Record<
  TableStatus,
  {
    label: string,
    Icon: any,
    dot: string,
    topBar: string,
    cardBorder: string,
    cardBg: string,
    iconWrap: string,
    numberClr: string,
    badge: string,
    detailAccent: string,
    selectable: boolean;
  }
> = {
  available: {
    label:       "Available",
    Icon:        ChefHat,
    dot:         "bg-[oklch(0.7_0.15_150)]",
    topBar:      "bg-[oklch(0.7_0.15_150)]",
    cardBorder:  "border-[oklch(0.7_0.15_150)]/25 hover:border-[oklch(0.7_0.15_150)]/60",
    cardBg:      "bg-white/70 hover:bg-[oklch(0.7_0.15_150)]/5",
    iconWrap:    "bg-[oklch(0.7_0.15_150)]/12 text-[oklch(0.7_0.15_150)]",
    numberClr:   "text-[oklch(0.7_0.15_150)]",
    badge:       "bg-[oklch(0.7_0.15_150)] text-white shadow-xl shadow-[oklch(0.7_0.15_150)]/20 border-0",
    detailAccent:"oklch(0.7 0.15 150)",
    selectable:  true,
  },
  occupied: {
    label:       "Occupied",
    Icon:        Users,
    dot:         "bg-[oklch(0.45_0.12_285)]",
    topBar:      "bg-[oklch(0.45_0.12_285)]",
    cardBorder:  "border-[oklch(0.45_0.12_285)]/30 hover:border-[oklch(0.45_0.12_285)]/60",
    cardBg:      "bg-[oklch(0.45_0.12_285)]/5 hover:bg-[oklch(0.45_0.12_285)]/10",
    iconWrap:    "bg-[oklch(0.45_0.12_285)]/12 text-[oklch(0.45_0.12_285)]",
    numberClr:   "text-[oklch(0.45_0.12_285)]",
    badge:       "bg-[oklch(0.45_0.12_285)] text-white shadow-xl shadow-[oklch(0.45_0.12_285)]/20 border-0",
    detailAccent:"oklch(0.45 0.12 285)",
    selectable:  true,
  },
  reserved: {
    label:       "Reserved",
    Icon:        ShoppingCart,
    dot:         "bg-[#AEA6BF]",
    topBar:      "bg-[#AEA6BF]",
    cardBorder:  "border-[#AEA6BF]/40 hover:border-[#AEA6BF]/70",
    cardBg:      "bg-[#EBE6F8]/60 hover:bg-[#EBE6F8]/90",
    iconWrap:    "bg-[#AEA6BF]/15 text-[#736C83]",
    numberClr:   "text-[#736C83]",
    badge:       "bg-[#736C83] text-white shadow-xl shadow-[#736C83]/20 border-0",
    detailAccent:"#AEA6BF",
    selectable:  false,
  },
  cleaning: {
    label:       "Cleaning",
    Icon:        Crown,
    dot:         "bg-[oklch(0.75_0.15_75)]",
    topBar:      "bg-[oklch(0.75_0.15_75)]",
    cardBorder:  "border-[oklch(0.75_0.15_75)]/25 hover:border-[oklch(0.75_0.15_75)]/60",
    cardBg:      "bg-[oklch(0.75_0.15_75)]/5 hover:bg-[oklch(0.75_0.15_75)]/10",
    iconWrap:    "bg-[oklch(0.75_0.15_75)]/12 text-[oklch(0.75_0.15_75)]",
    numberClr:   "text-[oklch(0.75_0.15_75)]",
    badge:       "bg-[oklch(0.75_0.15_75)] text-white shadow-xl shadow-[oklch(0.75_0.15_75)]/20 border-0",
    detailAccent:"oklch(0.75 0.15 75)",
    selectable:  false,
  },
};

const categories = [
  { id: "all", label: "All", icon: UtensilsCrossed },
  { id: "starters", label: "Appetizers", icon: ChefHat },
  { id: "main", label: "Main Dishes", icon: UtensilsCrossed },
  { id: "drinks", label: "Beverages", icon: Wine },
  { id: "snacks", label: "Snacks", icon: Cookie },
  { id: "desserts", label: "Desserts", icon: IceCream },
  { id: "seafood", label: "Seafood", icon: Crown },
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
  const [filterZone, setFilterZone] = useState<string>("All");
  const filteredTables = tables.filter((t) => filterZone === "All" || t.zone === filterZone);
  
  const counts = {
    available: tables.filter((t) => t.status === "available").length,
    occupied:  tables.filter((t) => t.status === "occupied").length,
    total:     tables.length,
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      {/* ── Floor Plan Header ── */}
      <div className="bg-[#EBE6F8] border-b border-[#E2DCF3] px-6 py-5">
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5 mb-1">
              <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-[oklch(0.45_0.12_285)] shadow-md">
                <UtensilsCrossed className="h-4 w-4 text-white" />
              </div>
              <h2 className="text-xl font-heading text-[#0D031B] ">Interactive Floor Plan</h2>
            </div>
            <p className="text-xs font-medium text-[#736C83] ml-10 ">
              {counts.available} available • {counts.occupied} occupied
            </p>
          </div>

          {/* Zones & Stats */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center p-1 bg-white/50 backdrop-blur-sm rounded-xl border border-[#D6D0EC]">
              {zones.map((z) => (
                <button
                  key={z}
                  onClick={() => setFilterZone(z)}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-[10px] uppercase  transition-all",
                    filterZone === z
                      ? "bg-[oklch(0.45_0.12_285)] text-white shadow-sm"
                      : "text-[#736C83] hover:text-[#0D031B] hover:bg-white/50"
                  )}
                >
                  Zone {z}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-4 mt-4 ml-10">
          {Object.entries(statusConfig).map(([s, c]) => (
            <div key={s} className="flex items-center gap-2 text-[11px] text-[#736C83]">
              <span className={cn("h-1.5 w-1.5 rounded-full", c.dot)} />
              {c.label}
            </div>
          ))}
        </div>
      </div>

      {/* Table grid */}
      <div className="flex-1 overflow-y-auto px-6 py-8">
        {filteredTables.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4 opacity-40">
            <UtensilsCrossed className="h-12 w-12 text-[#AEA6BF]" />
            <p className="text-sm font-medium uppercase  text-[#736C83]">No tables in this zone</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-6">
            {filteredTables.map((table, index) => {
              const config = statusConfig[table.status];
              const imgSrc = tableImages[index % tableImages.length];
              
              return (
                <div
                  key={table.id}
                  onClick={() => config.selectable && onSelectTable(table)}
                  className={cn(
                    "relative flex flex-col transition-all duration-300 group overflow-hidden rounded-2xl bg-white border shadow-sm h-full",
                    config.selectable
                      ? "cursor-pointer hover:scale-[1.02] hover:shadow-xl hover:shadow-[oklch(0.45_0.12_285)]/10"
                      : "cursor-not-allowed opacity-80"
                  )}
                >
                  {/* Status Bar */}
                  <div className={cn("absolute bottom-0 left-0 right-0 h-[3px] z-10", config.topBar)} />

                  {/* Image Header */}
                  <div className="relative h-[140px] w-full shrink-0 overflow-hidden bg-muted">
                    <img
                      src={imgSrc}
                      alt={`Table ${table.number}`}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    
                    {/* Floating Info */}
                    <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5 px-2 py-1 bg-black/40 backdrop-blur-md rounded-lg text-white/90 text-[9px] uppercase  border border-white/10">
                      <Users className="h-3 w-3" />
                      <span>{table.seats}</span>
                    </div>

                    <div className="absolute top-2.5 left-2.5">
                      <Badge className={cn("text-[8px] uppercase  px-2 py-0.5 border-0 shadow-lg", config.badge)}>
                        {config.label}
                      </Badge>
                    </div>

                    {/* Table Name Overlay */}
                    <div className="absolute bottom-2.5 left-3">
                      <span className="text-[10px] text-white/60 uppercase  font-medium block leading-none mb-1">Table</span>
                      <span className="text-2xl text-white font-heading leading-none">
                        {String(table.number).padStart(2, "0")}
                      </span>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="p-4 flex-1 flex flex-col justify-between gap-4">
                    <div className="flex justify-between items-end">
                      <div className="space-y-1">
                        <p className="text-[8px] uppercase  text-[#736C83]">Zone</p>
                        <p className="text-xs font-semibold text-[#0D031B]">{table.zone || "-"}</p>
                      </div>
                      <div className="text-right space-y-1">
                        <p className="text-[8px] uppercase  text-[#736C83]">Status</p>
                        <p className={cn("text-xs font-medium", config.numberClr)}>{config.label}</p>
                      </div>
                    </div>

                    {/* Quick Action visual */}
                    {config.selectable && (
                      <div className="pt-2 border-t border-dashed border-[#D6D0EC] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                         <span className="text-[9px] uppercase  text-[oklch(0.45_0.12_285)] font-bold">Select Table</span>
                         <ArrowRight className="h-3 w-3 text-[oklch(0.45_0.12_285)]" />
                      </div>
                    )}
                  </div>

                  {/* Hover Effects */}
                  {config.selectable && (
                    <div className="absolute inset-0 bg-[oklch(0.45_0.12_285)]/0 group-hover:bg-[oklch(0.45_0.12_285)]/5 transition-colors pointer-events-none" />
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── MENU GRID ────────────────────────────────────────────────────────────────

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
    const matchesCat =
      activeCategory === "all" || item.category === activeCategory;
    const matchesSearch = item.name
      .toLowerCase()
      .includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="bg-[#EBE6F8] border-b border-[#E2DCF3] px-5 py-4">
        <div className="flex items-center gap-3 mb-4">
          <Button
            variant="outline"
            size="icon"
            onClick={onBack}
            className="h-8 w-8 rounded-lg border-[#D6D0EC] bg-white hover:bg-[#EBE6F8] hover:border-[oklch(0.45_0.12_285)] text-[oklch(0.45_0.12_285)] shrink-0"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-heading  text-[#0D031B] ">
                Grande Menu
              </h2>
              {selectedTable && (
                <Badge className="bg-[oklch(0.45_0.12_285)] text-white border-0 text-[10px] px-2.5 rounded-full">
                  Table {selectedTable.number}
                </Badge>
              )}
            </div>
            <p className="text-[10px] font-medium text-[#736C83]  mt-0.5">
              {filtered.length} items available
            </p>
          </div>

          {/* Search */}
          <div className="relative w-48 shrink-0">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#AEA6BF]" />
            <Input
              placeholder="Search menu…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 h-8 text-xs border-[#D6D0EC] bg-white rounded-lg focus:border-[oklch(0.45_0.12_285)] focus:ring-[oklch(0.45_0.12_285)]/20 text-[#0D031B] placeholder:text-[#AEA6BF]"
            />
          </div>
        </div>

        {/* Category tabs */}
        <Tabs value={activeCategory} onValueChange={onCategoryChange}>
          <TabsList className="bg-white/70 border border-[#E2DCF3] p-1 h-auto gap-1 rounded-xl">
            {categories.map((cat) => (
              <TabsTrigger
                key={cat.id}
                value={cat.id}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 text-[10px]  uppercase rounded-lg transition-all",
                  "data-[state=active]:bg-[oklch(0.45_0.12_285)] data-[state=active]:text-white data-[state=active]:shadow-sm",
                  "data-[state=active]:hover:bg-white data-[state=active]:hover:text-primary data-[state=active]:hover:scale-110 data-[state=active]:hover:shadow-lg",
                  "text-[#736C83] hover:text-primary hover:bg-primary/5 hover:scale-105",
                )}
              >
                <cat.icon className="h-3 w-3" />
                <span className="hidden sm:inline">{cat.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      {/* Menu items grid */}
      <ScrollArea className="flex-1">
        <div className="grid grid-cols-1 min-[440px]:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 py-5 px-0">
          {filtered.length === 0 ? (
            <div className="col-span-full flex flex-col items-center justify-center py-16 text-center">
              <div className="w-12 h-12 rounded-full bg-[#EBE6F8] flex items-center justify-center mb-3">
                <UtensilsCrossed className="h-5 w-5 text-[#AEA6BF]" />
              </div>
              <p className="text-sm text-[#3D374C]">No items found</p>
              <p className="text-xs text-[#AEA6BF] mt-1">
                Try a different category or search term
              </p>
            </div>
          ) : (
            filtered.map((item) => {
              const imgSrc =
                item.image ||
                categoryImages[item.category] ||
                `https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=300&h=200&fit=crop&auto=format`;
              return (
                <Card
                  key={item.id}
                  onClick={() => onAddItem(item)}
                  className="overflow-hidden border border-[#E2DCF3] rounded-xl cursor-pointer group transition-all duration-200 hover:border-[oklch(0.45_0.12_285)] hover:shadow-md hover:shadow-[oklch(0.45_0.12_285)]/10 hover:-translate-y-0.5 bg-white"
                >
                  {/* Image */}
                  <div className="relative aspect-[4/3] overflow-hidden bg-[#EBE6F8]">
                    <img
                      src={imgSrc}
                      alt={item.name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                    />
                    {/* Hover overlay with + button */}
                    <div className="absolute inset-0 bg-[oklch(0.45_0.12_285)]/0 group-hover:bg-[oklch(0.45_0.12_285)]/20 transition-all duration-200 flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transition-all duration-200 scale-75 group-hover:scale-100">
                        <div className="bg-white rounded-full p-2.5 shadow-lg">
                          <Plus className="h-5 w-5 text-[oklch(0.45_0.12_285)]" />
                        </div>
                      </div>
                    </div>
                    {/* Category chip on image */}
                    <div className="absolute top-2 left-2">
                      <Badge className="bg-white/90 text-[#736C83] border-0 text-[9px] uppercase  px-2 rounded-md shadow-sm">
                        {item.category}
                      </Badge>
                    </div>
                  </div>

                  {/* Card body */}
                  <CardContent className="p-3">
                    <h3 className="font-heading text-[13px] text-[#0D031B] truncate group-hover:text-[oklch(0.45_0.12_285)] transition-colors leading-tight">
                      {item.name}
                    </h3>
                    <div className="flex items-center justify-between mt-2.5">
                      <p className="text-sm  text-[oklch(0.45_0.12_285)] font-heading">
                        KES {item.price.toLocaleString()}
                      </p>
                      <div className="flex items-center justify-center w-6 h-6 rounded-md bg-[#EBE6F8] border border-[#D6D0EC] group-hover:bg-[oklch(0.45_0.12_285)] group-hover:border-[oklch(0.45_0.12_285)] transition-all">
                        <Plus className="h-3 w-3 text-[oklch(0.45_0.12_285)] group-hover:text-white transition-colors" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </ScrollArea>
    </div>
  );
}

// ─── ORDER CART ───────────────────────────────────────────────────────────────

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
  const subtotal = items.reduce(
    (sum, item) => sum + item.menuItem.price * item.quantity,
    0,
  );
  const tax = Math.round(subtotal * 0.16);
  const total = subtotal + tax;

  return (
    <Card className="w-full h-full flex flex-col overflow-hidden border border-[#E2DCF3] rounded-2xl bg-white shadow-[0_4px_32px_rgba(55,40,100,0.09)]">
      {/* ── Header ── */}
      <CardHeader className="shrink-0 p-0">
        <div className="bg-[#EBE6F8] px-4 pt-4 pb-3 border-b border-[#E2DCF3]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-[oklch(0.45_0.12_285)] shrink-0 shadow-sm">
                <ShoppingCart className="h-4 w-4 text-white" />
              </div>
              <div>
                <p className="text-sm text-[#0D031B] leading-tight ">
                  Guest Order
                </p>
                <p className="text-[10px] font-medium text-[#736C83]  mt-0.5">
                  Guest selection overview
                </p>
              </div>
            </div>

            {table ? (
              <Badge className="bg-[oklch(0.45_0.12_285)] text-white border-0 text-[11px] px-3 py-1 rounded-full">
                Table {table.number}
              </Badge>
            ) : (
              <Badge
                variant="outline"
                className="text-[11px] px-3 py-1 rounded-full border-[#AEA6BF] text-[#736C83]"
              >
                No Table
              </Badge>
            )}
          </div>

          {/* Progress bar */}
          {items.length > 0 && (
            <div className="mt-3 flex items-center gap-2">
              <div className="h-1.5 flex-1 rounded-full bg-[#D6D0EC] overflow-hidden">
                <div
                  className="h-full rounded-full bg-[oklch(0.45_0.12_285)] transition-all duration-500"
                  style={{
                    width: `${Math.min((items.length / 10) * 100, 100)}%`,
                  }}
                />
              </div>
              <span className="text-[10px] text-[#736C83] shrink-0">
                {items.length} item{items.length !== 1 ? "s" : ""}
              </span>
            </div>
          )}
        </div>
      </CardHeader>

      {/* ── Body ── */}
      <CardContent className="flex-1 flex flex-col p-0 overflow-hidden min-h-0">
        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-6 gap-3">
            <div className="w-16 h-16 rounded-2xl bg-[#EBE6F8] flex items-center justify-center">
              <ShoppingCart className="h-7 w-7 text-[#AEA6BF]" />
            </div>
            <div className="text-center">
              <p className="text-sm text-[#3D374C]">Cart is empty</p>
              <p className="text-[11px] text-[#AEA6BF] font-medium mt-1 leading-snug">
                {table
                  ? "Browse the menu and add items"
                  : "Select a table to get started"}
              </p>
            </div>
            {!table && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-50 border border-amber-200">
                <Crown className="h-3 w-3 text-amber-500" />
                <span className="text-[10px] text-amber-700">
                  Assign a table first
                </span>
              </div>
            )}
          </div>
        ) : (
          <>
            {/* Cart Items */}
            <ScrollArea className="flex-1 min-h-0">
              <div className="p-3 space-y-2">
                {items.map((item, index) => (
                  <div
                    key={item.menuItem.id}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-[#EBE6F8] border border-[#E2DCF3] hover:border-[oklch(0.45_0.12_285)]/50 transition-colors duration-150 group"
                  >
                    {/* Index */}
                    <div className="w-5 h-5 rounded-md shrink-0 flex items-center justify-center bg-white border border-[#E2DCF3] text-[10px] text-[#736C83]">
                      {index + 1}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-[12px] text-[#0D031B] truncate leading-tight">
                        {item.menuItem.name}
                      </p>
                      <p className="text-[10px] font-medium text-[#736C83] mt-0.5">
                        KES {item.menuItem.price.toLocaleString()}
                      </p>
                    </div>

                    {/* Controls */}
                    <div className="flex items-center gap-1 shrink-0">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-6 w-6 rounded-md p-0 bg-white border-[#E2DCF3] text-[#3D374C] hover:bg-[oklch(0.45_0.12_285)] hover:text-white hover:border-[oklch(0.45_0.12_285)] transition-all duration-150"
                        onClick={() =>
                          onUpdateQuantity(item.menuItem.id, item.quantity - 1)
                        }
                      >
                        <Minus className="h-2.5 w-2.5" />
                      </Button>
                      <span className="w-5 text-center text-[13px] text-[#0D031B]">
                        {item.quantity}
                      </span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-6 w-6 rounded-md p-0 bg-white border-[#E2DCF3] text-[#3D374C] hover:bg-[oklch(0.45_0.12_285)] hover:text-white hover:border-[oklch(0.45_0.12_285)] transition-all duration-150"
                        onClick={() =>
                          onUpdateQuantity(item.menuItem.id, item.quantity + 1)
                        }
                      >
                        <Plus className="h-2.5 w-2.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 rounded-md p-0 ml-0.5 text-[#D1C8E6] hover:bg-red-50 hover:text-red-500 transition-all duration-150"
                        onClick={() => onRemoveItem(item.menuItem.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            {/* Order Summary */}
            <div className="shrink-0 border-t border-[#E2DCF3] bg-[#fdfcff]">
              <div className="px-4 pt-3 pb-2 space-y-1.5">
                <div className="flex justify-between items-center">
                  <span className="text-[11px] font-medium text-[#736C83]">
                    Subtotal
                  </span>
                  <span className="text-[11px] text-[#3D374C]">
                    KES {subtotal.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[11px] font-medium text-[#736C83]">
                    VAT (16%)
                  </span>
                  <span className="text-[11px] text-[#3D374C]">
                    KES {tax.toLocaleString()}
                  </span>
                </div>
                <div className="border-t border-dashed border-[#E2DCF3] my-2" />
                <div className="flex justify-between items-end">
                  <span className="text-[13px] text-[#0D031B]">
                    Total
                  </span>
                  <div className="text-right">
                    <p className="text-xl text-[oklch(0.45_0.12_285)] leading-tight ">
                      KES {total.toLocaleString()}
                    </p>
                    <p className="text-[9px] font-medium text-[#AEA6BF]  mt-0.5">
                      Inclusive of VAT
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 px-3 pb-3 pt-2">
                <Button
                  variant="outline"
                  className="flex-1 h-9 text-[11px]  uppercase rounded-lg border-[#E2DCF3] text-[#736C83] bg-transparent hover:border-red-300 hover:text-red-500 hover:bg-red-50 transition-all duration-150"
                  onClick={onClearCart}
                >
                  Clear
                </Button>
                <Button
                  className="flex-[2] h-9 text-[11px]  uppercase rounded-lg gap-1.5 bg-[oklch(0.45_0.12_285)] text-white border-0 hover:opacity-90 hover:-translate-y-px disabled:opacity-40 disabled:cursor-not-allowed disabled:translate-y-0 transition-all duration-150"
                  onClick={onPlaceOrder}
                  disabled={!table}
                >
                  <ArrowRight className="h-3.5 w-3.5" />
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
