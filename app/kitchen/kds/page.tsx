"use client"

import { useState, useEffect, useCallback, useMemo } from "react";
import { CakeIcon } from "@heroicons/react/24/outline";
import { KitchenHeader } from "./components/KitchenHeader";
import { ThroughputBar } from "./components/ThroughputBar";
import { FilterBar, type FilterId } from "./components/FilterBar";
import { OrderCard } from "./components/OrderCard";
import { EmptyState } from "./components/EmptyState";
import { toast } from "./components/Toast";
import { OrderService } from "./lib/order-service";
import type { KitchenOrder, OrderStatus } from "./lib/types";

// ─── Served drawer ─────────────────────────────────────────────────────────────
function ServedBanner({ count }: { count: number }) {
  if (count === 0) return null;
  return (
    <div
      className="shrink-0 flex items-center gap-3 px-5 py-2.5 border-b"
      style={{
        background: "oklch(0.46 0.14 150 / 0.06)",
        borderColor: "oklch(0.62 0.16 150 / 0.15)",
      }}
    >
      <div className="w-2 h-2 rounded-full" style={{ background: "oklch(0.62 0.16 150)" }} />
      <span className="text-[11px] font-semibold" style={{ color: "oklch(0.38 0.12 150)" }}>
        {count} order{count !== 1 ? "s" : ""} served this session
      </span>
      <span className="ml-auto flex items-center gap-1">
        <CakeIcon className="h-3 w-3" style={{ color: "oklch(0.62 0.16 150)" }} />
        <span className="text-[10px] font-bold uppercase " style={{ color: "oklch(0.46 0.14 150)" }}>
          Great work!
        </span>
      </span>
    </div>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────────
export default function KDSPage() {
  const [orders, setOrders] = useState<KitchenOrder[]>([]);
  const [filter, setFilter] = useState<FilterId>("all");
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [prevLen, setPrevLen] = useState(0);

  // ── Subscribe to order service ────────────────────────────────────────────
  useEffect(() => {
    const unsub = OrderService.subscribe((liveOrders) => {
      setOrders(prev => {
        const active = liveOrders.filter(o => o.status !== "served" && o.status !== "cancelled");
        const prevActive = prev.filter(o => o.status !== "served" && o.status !== "cancelled");

        if (prevActive.length > 0 && active.length > prevActive.length) {
          const newest = active[0];
          toast.order(
            `New Order — Table ${newest.tableNumber}`,
            `${newest.items.length} item${newest.items.length !== 1 ? "s" : ""} · ${newest.waiter} · ${newest.priority === "urgent" ? "⚡ Urgent" : newest.section ?? ""}`
          );
        }
        return liveOrders;
      });
    });
    return () => { unsub?.(); };
  }, []);

  // Track served count
  useEffect(() => {
    const served = orders.filter(o => o.status === "served").length;
    if (served > prevLen) {
      const last = orders.find(o => o.status === "served");
      if (last) toast.success(`Order Served`, `Table ${last.tableNumber} has been marked as served.`);
    }
    setPrevLen(served);
  }, [orders]); // eslint-disable-line

  // ── Status update ─────────────────────────────────────────────────────────
  const handleUpdateStatus = useCallback((orderId: string, newStatus: OrderStatus) => {
    const order = orders.find(o => o.id === orderId);
    OrderService.updateOrderStatus(orderId, newStatus);
    if (order) {
      const msgs: Record<string, string> = {
        cooking: `Table ${order.tableNumber} is now cooking.`,
        ready:   `Table ${order.tableNumber} is ready to serve!`,
        served:  `Table ${order.tableNumber} has been served.`,
      };
      const titles: Record<string, string> = {
        cooking: "Started Cooking",
        ready:   "Order Ready! 🍽️",
        served:  "Order Served ✓",
      };
      if (msgs[newStatus]) {
        if (newStatus === "ready") toast.success(titles[newStatus], msgs[newStatus]);
        else toast.info(titles[newStatus], msgs[newStatus]);
      }
    }
  }, [orders]);

  // ── Derived counts ────────────────────────────────────────────────────────
  const active = useMemo(() => orders.filter(o => o.status !== "served" && o.status !== "cancelled"), [orders]);
  const pendingCount = useMemo(() => active.filter(o => o.status === "pending").length, [active]);
  const cookingCount = useMemo(() => active.filter(o => o.status === "cooking").length, [active]);
  const readyCount   = useMemo(() => active.filter(o => o.status === "ready").length,   [active]);
  const servedCount  = useMemo(() => orders.filter(o => o.status === "served").length,  [orders]);

  const filterCounts = useMemo<Record<FilterId, number>>(() => ({
    all:     pendingCount + cookingCount + readyCount,
    pending: pendingCount,
    cooking: cookingCount,
    ready:   readyCount,
  }), [pendingCount, cookingCount, readyCount]);

  // ── Filtered + searched orders ────────────────────────────────────────────
  const displayed = useMemo(() => {
    let list = filter === "all" ? active : active.filter(o => o.status === filter);

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(o =>
        String(o.tableNumber).includes(q) ||
        o.waiter.toLowerCase().includes(q) ||
        o.id.toLowerCase().includes(q) ||
        o.section?.toLowerCase().includes(q) ||
        o.items.some(i => i.name.toLowerCase().includes(q) || i.notes?.toLowerCase().includes(q))
      );
    }

    // Sort: urgent first, then by createdAt desc
    return [...list].sort((a, b) => {
      if (a.priority === "urgent" && b.priority !== "urgent") return -1;
      if (b.priority === "urgent" && a.priority !== "urgent") return 1;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [active, filter, search]);

  return (
    <>


      <div className="min-h-screen flex flex-col overflow-hidden" style={{ background: "#F0EBF8" }}>

        {/* Header */}
        <KitchenHeader
          pendingCount={pendingCount}
          cookingCount={cookingCount}
          readyCount={readyCount}
          viewMode={viewMode}
          onViewMode={setViewMode}
          onBellClick={() => setFilter("ready")}
        />

        {/* Throughput bar */}
        <ThroughputBar
          pendingCount={pendingCount}
          cookingCount={cookingCount}
          readyCount={readyCount}
        />

        {/* Served banner */}
        <ServedBanner count={servedCount} />

        {/* Filter + search */}
        <FilterBar
          active={filter}
          counts={filterCounts}
          search={search}
          onFilter={setFilter}
          onSearch={setSearch}
        />

        {/* Orders grid/list */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-5">
            {displayed.length === 0 ? (
              <EmptyState filter={filter} search={search} />
            ) : (
              <>
                {/* Section header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold uppercase " style={{ color: "var(--icon-primary)" }}>
                      {filter === "all" ? "Active Orders" : `${filter.charAt(0).toUpperCase()}${filter.slice(1)} Orders`}
                    </span>
                    <span
                      className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                      style={{ background: "oklch(0.45 0.12 285 / 0.08)", color: "oklch(0.42 0.14 285)" }}
                    >
                      {displayed.length}
                    </span>
                  </div>
                  <span className="text-[10px]" style={{ color: "#D0CBE4" }}>
                    {viewMode === "grid" ? "Grid view" : "List view"}
                  </span>
                </div>

                <div
                  className={
                    viewMode === "grid"
                      ? "grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
                      : "flex flex-col gap-3 max-w-4xl mx-auto"
                  }
                >
                  {displayed.map((order, i) => (
                    <OrderCard
                      key={order.id}
                      order={order}
                      onUpdateStatus={handleUpdateStatus}
                      listMode={viewMode === "list"}
                      animDelay={Math.min(i * 55, 330)}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Bottom safe area */}
        <div className="h-4 shrink-0" />
      </div>
    </>
  );
}
