"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { CakeIcon } from "@heroicons/react/24/outline"
import { AnimatePresence, motion } from "motion/react"
import { SPRING_SNAPPY } from "@/lib/motion"
import { Badge } from "@/components/ui/badge"
import { KitchenHeader } from "./components/KitchenHeader"
import { ThroughputBar } from "./components/ThroughputBar"
import { FilterBar, type FilterId } from "./components/FilterBar"
import { OrderCard } from "./components/OrderCard"
import { EmptyState } from "./components/EmptyState"
import { toast } from "./components/Toast"
import { OrderService } from "./lib/order-service"
import type { KitchenOrder, OrderStatus } from "./lib/types"

function ServedBanner({ count }: { count: number }) {
  if (count === 0) return null
  return (
    <div className="shrink-0 flex items-center gap-3 px-5 py-2 border-b bg-success/10 border-success/20">
      <span className="size-2 rounded-full bg-success" />
      <span className="text-xs font-medium text-success">
        {count} order{count !== 1 ? "s" : ""} served this session
      </span>
      <span className="ml-auto flex items-center gap-1 text-xs font-semibold uppercase text-success">
        <CakeIcon className="size-3.5" />
        Great work!
      </span>
    </div>
  )
}

export default function KDSPage() {
  const [orders, setOrders] = useState<KitchenOrder[]>([])
  const [filter, setFilter] = useState<FilterId>("all")
  const [search, setSearch] = useState("")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [prevLen, setPrevLen] = useState(0)

  useEffect(() => {
    const unsub = OrderService.subscribe((liveOrders) => {
      setOrders((prev) => {
        const active = liveOrders.filter((o) => o.status !== "served" && o.status !== "cancelled")
        const prevActive = prev.filter((o) => o.status !== "served" && o.status !== "cancelled")

        if (prevActive.length > 0 && active.length > prevActive.length) {
          const newest = active[0]
          toast.order(
            `New Order — Table ${newest.tableNumber}`,
            `${newest.items.length} item${newest.items.length !== 1 ? "s" : ""} · ${newest.waiter} · ${newest.priority === "urgent" ? "⚡ Urgent" : newest.section ?? ""}`,
          )
        }
        return liveOrders
      })
    })
    return () => {
      unsub?.()
    }
  }, [])

  useEffect(() => {
    const served = orders.filter((o) => o.status === "served").length
    if (served > prevLen) {
      const last = orders.find((o) => o.status === "served")
      if (last) toast.success("Order Served", `Table ${last.tableNumber} has been marked as served.`)
    }
    setPrevLen(served)
  }, [orders]) // eslint-disable-line

  const handleUpdateStatus = useCallback(
    (orderId: string, newStatus: OrderStatus) => {
      const order = orders.find((o) => o.id === orderId)
      OrderService.updateOrderStatus(orderId, newStatus)
      if (order) {
        const msgs: Record<string, string> = {
          cooking: `Table ${order.tableNumber} is now cooking.`,
          ready: `Table ${order.tableNumber} is ready to serve!`,
          served: `Table ${order.tableNumber} has been served.`,
        }
        const titles: Record<string, string> = {
          cooking: "Started Cooking",
          ready: "Order Ready!",
          served: "Order Served",
        }
        if (msgs[newStatus]) {
          if (newStatus === "ready") toast.success(titles[newStatus], msgs[newStatus])
          else toast.info(titles[newStatus], msgs[newStatus])
        }
      }
    },
    [orders],
  )

  const active = useMemo(
    () => orders.filter((o) => o.status !== "served" && o.status !== "cancelled"),
    [orders],
  )
  const pendingCount = useMemo(() => active.filter((o) => o.status === "pending").length, [active])
  const cookingCount = useMemo(() => active.filter((o) => o.status === "cooking").length, [active])
  const readyCount = useMemo(() => active.filter((o) => o.status === "ready").length, [active])
  const servedCount = useMemo(() => orders.filter((o) => o.status === "served").length, [orders])

  const filterCounts = useMemo<Record<FilterId, number>>(
    () => ({
      all: pendingCount + cookingCount + readyCount,
      pending: pendingCount,
      cooking: cookingCount,
      ready: readyCount,
    }),
    [pendingCount, cookingCount, readyCount],
  )

  const displayed = useMemo(() => {
    let list = filter === "all" ? active : active.filter((o) => o.status === filter)

    if (search.trim()) {
      const q = search.trim().toLowerCase()
      list = list.filter(
        (o) =>
          String(o.tableNumber).includes(q) ||
          o.waiter.toLowerCase().includes(q) ||
          o.id.toLowerCase().includes(q) ||
          o.section?.toLowerCase().includes(q) ||
          o.items.some((i) => i.name.toLowerCase().includes(q) || i.notes?.toLowerCase().includes(q)),
      )
    }

    return [...list].sort((a, b) => {
      if (a.priority === "urgent" && b.priority !== "urgent") return -1
      if (b.priority === "urgent" && a.priority !== "urgent") return 1
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    })
  }, [active, filter, search])

  return (
    <div className="min-h-screen flex flex-col overflow-hidden bg-background">
      <KitchenHeader
        pendingCount={pendingCount}
        cookingCount={cookingCount}
        readyCount={readyCount}
        viewMode={viewMode}
        onViewMode={setViewMode}
        onBellClick={() => setFilter("ready")}
      />

      <ThroughputBar
        pendingCount={pendingCount}
        cookingCount={cookingCount}
        readyCount={readyCount}
      />

      <ServedBanner count={servedCount} />

      <FilterBar
        active={filter}
        counts={filterCounts}
        search={search}
        onFilter={setFilter}
        onSearch={setSearch}
      />

      <div className="flex-1 overflow-y-auto">
        <div className="p-5">
          {displayed.length === 0 ? (
            <EmptyState filter={filter} search={search} />
          ) : (
            <>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold uppercase text-primary">
                    {filter === "all"
                      ? "Active Orders"
                      : `${filter.charAt(0).toUpperCase()}${filter.slice(1)} Orders`}
                  </span>
                  <Badge variant="secondary">{displayed.length}</Badge>
                </div>
                <span className="text-xs text-muted-foreground">
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
                <AnimatePresence mode="popLayout" initial={false}>
                  {displayed.map((order) => (
                    <motion.div
                      key={order.id}
                      layout="position"
                      initial={{ opacity: 0, scale: 0.96 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.96 }}
                      transition={SPRING_SNAPPY}
                    >
                      <OrderCard
                        order={order}
                        onUpdateStatus={handleUpdateStatus}
                        listMode={viewMode === "list"}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
