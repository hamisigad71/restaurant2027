"use client"

import { CartItem, PaymentMethod } from "./types"
import {
  calculateBillTotals,
  CleaningService,
  normalizeTableId,
  PaymentService,
  TableService,
} from "./restaurant-store"

export interface LiveOrder {
  id: string
  tableId: string
  items: CartItem[]
  status: "pending" | "cooking" | "ready" | "served" | "cancelled"
  paymentStatus: "unpaid" | "paid"
  paymentMethod?: PaymentMethod
  subtotal?: number
  tax?: number
  tip?: number
  total?: number
  paidAt?: string
  createdAt: string
  updatedAt: string
  waiter?: string
  priority: "normal" | "urgent"
}

const STORAGE_KEY = "resto_live_orders"
const ORDERS_EVENT = "tabletap:orders"
const SYNC_CHANNEL = "tabletap_sync"

function broadcastOrders() {
  if (typeof window === "undefined") return
  window.dispatchEvent(new CustomEvent(ORDERS_EVENT))
  window.dispatchEvent(new Event("storage"))
  try {
    const ch = new BroadcastChannel(SYNC_CHANNEL)
    ch.postMessage({ type: ORDERS_EVENT })
    ch.close()
  } catch {
    // Ignore unsupported environments
  }
}

function normalizeOrder(raw: any): LiveOrder {
  const items: CartItem[] = Array.isArray(raw.items) ? raw.items : []
  const computedSub = items.reduce((s, i) => s + Number(i.price || 0) * Number(i.quantity || 0), 0)
  const totals = calculateBillTotals(raw.subtotal ?? computedSub, raw.tip ?? 0)
  return {
    ...raw,
    tableId: normalizeTableId(raw.tableId ?? raw.tableNumber ?? "0"),
    status: raw.status || "pending",
    paymentStatus: raw.paymentStatus ?? "unpaid",
    subtotal: raw.subtotal ?? totals.subtotal,
    tax: raw.tax ?? totals.tax,
    total: raw.total ?? totals.total,
  }
}

export const OrderService = {
  getOrders: (): LiveOrder[] => {
    if (typeof window === "undefined") return []
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      const parsed = stored ? JSON.parse(stored) : []
      return Array.isArray(parsed) ? parsed.map(normalizeOrder) : []
    } catch {
      return []
    }
  },

  saveOrders: (orders: LiveOrder[]) => {
    if (typeof window === "undefined") return
    localStorage.setItem(STORAGE_KEY, JSON.stringify(orders))
    broadcastOrders()
  },

  placeOrder: (tableId: string | number, items: CartItem[], waiterName?: string) => {
    const normalizedTable = normalizeTableId(tableId)
    const orders = OrderService.getOrders()
    const rawSub = items.reduce((s, i) => s + i.price * i.quantity, 0)
    const totals = calculateBillTotals(rawSub)
    const now = new Date().toISOString()

    const newOrder: LiveOrder = {
      id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      tableId: normalizedTable,
      items,
      status: "pending",
      paymentStatus: "unpaid",
      subtotal: totals.subtotal,
      tax: totals.tax,
      total: totals.total,
      createdAt: now,
      updatedAt: now,
      priority: items.some((i) => i.popular) ? "urgent" : "normal",
      waiter: waiterName || "Self-Service QR",
    }

    OrderService.saveOrders([newOrder, ...orders])
    TableService.setTableStatus(normalizedTable, "occupied")
    return newOrder
  },

  updateOrderStatus: (orderId: string, status: LiveOrder["status"]) => {
    const orders = OrderService.getOrders()
    const target = orders.find((o) => o.id === orderId)
    const updated = orders.map((o) =>
      o.id === orderId ? { ...o, status, updatedAt: new Date().toISOString() } : o,
    )
    OrderService.saveOrders(updated)

    if (target && status === "cancelled") {
      const hasOtherActive = updated.some(
        (o) =>
          o.tableId === target.tableId &&
          o.paymentStatus !== "paid" &&
          o.status !== "cancelled",
      )
      if (!hasOtherActive) {
        TableService.setTableStatus(target.tableId, "available")
      }
    }
  },

  settleTable: (tableId: string | number, method: PaymentMethod, tip = 0) => {
    const normalizedTable = normalizeTableId(tableId)
    const orders = OrderService.getOrders()
    const targetOrders = orders.filter(
      (o) =>
        o.tableId === normalizedTable &&
        o.paymentStatus !== "paid" &&
        o.status !== "cancelled",
    )

    if (targetOrders.length === 0) {
      return { ordersCount: 0, total: 0 }
    }

    const now = new Date().toISOString()
    const combinedSubtotal = targetOrders.reduce(
      (sum, o) => sum + o.items.reduce((s, i) => s + i.price * i.quantity, 0),
      0,
    )
    const totals = calculateBillTotals(combinedSubtotal, tip)

    const updated = orders.map((o) =>
      o.tableId === normalizedTable && o.paymentStatus !== "paid" && o.status !== "cancelled"
        ? {
            ...o,
            status: "served" as const,
            paymentStatus: "paid" as const,
            paymentMethod: method,
            tip,
            paidAt: now,
            updatedAt: now,
          }
        : o,
    )

    OrderService.saveOrders(updated)

    PaymentService.recordPayment({
      orderId: targetOrders.map((o) => o.id).join(", "),
      tableId: normalizedTable,
      amount: totals.total,
      method,
      status: "completed",
    })

    CleaningService.enqueueTable(
      normalizedTable,
      "Guests paid & departed — full clean required",
      "high",
    )

    return { ordersCount: targetOrders.length, total: totals.total }
  },

  settleOrder: (orderId: string, method: PaymentMethod) => {
    const orders = OrderService.getOrders()
    const target = orders.find((o) => o.id === orderId)
    if (!target || target.paymentStatus === "paid" || target.status === "cancelled") {
      return null
    }

    const now = new Date().toISOString()
    const rawSub = target.items.reduce((s, i) => s + i.price * i.quantity, 0)
    const totals = calculateBillTotals(rawSub, target.tip ?? 0)

    const updated = orders.map((o) =>
      o.id === orderId
        ? {
            ...o,
            status: "served" as const,
            paymentStatus: "paid" as const,
            paymentMethod: method,
            paidAt: now,
            updatedAt: now,
          }
        : o,
    )
    OrderService.saveOrders(updated)

    const payment = PaymentService.recordPayment({
      orderId: target.id,
      tableId: target.tableId,
      amount: totals.total,
      method,
      status: "completed",
    })

    const hasOtherUnpaid = updated.some(
      (o) =>
        o.tableId === target.tableId &&
        o.paymentStatus !== "paid" &&
        o.status !== "cancelled",
    )
    if (!hasOtherUnpaid) {
      CleaningService.enqueueTable(
        target.tableId,
        "Guests paid & departed — full clean required",
        "high",
      )
    }

    return payment
  },

  subscribe: (callback: (orders: LiveOrder[]) => void) => {
    if (typeof window === "undefined") return () => {}

    const handler = () => callback(OrderService.getOrders())
    const onStorage = (e: StorageEvent) => {
      if (!e.key || e.key === STORAGE_KEY) handler()
    }

    let ch: BroadcastChannel | null = null
    const onChannel = (e: MessageEvent) => {
      if (!e.data?.type || e.data.type === ORDERS_EVENT) handler()
    }
    try {
      ch = new BroadcastChannel(SYNC_CHANNEL)
      ch.addEventListener("message", onChannel)
    } catch {
      ch = null
    }

    window.addEventListener("storage", onStorage)
    window.addEventListener(ORDERS_EVENT, handler)
    callback(OrderService.getOrders())

    return () => {
      window.removeEventListener("storage", onStorage)
      window.removeEventListener(ORDERS_EVENT, handler)
      ch?.removeEventListener("message", onChannel)
      ch?.close()
    }
  },
}
