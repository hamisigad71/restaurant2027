import { MenuItem, CartItem } from "./types"

export interface LiveOrder {
  id: string
  tableId: string
  items: CartItem[]
  status: "pending" | "cooking" | "ready" | "served" | "cancelled"
  createdAt: string
  updatedAt: string
  waiter?: string
  priority: "normal" | "urgent"
}

const STORAGE_KEY = "resto_live_orders"

export const OrderService = {
  getOrders: (): LiveOrder[] => {
    if (typeof window === "undefined") return []
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  },

  saveOrders: (orders: LiveOrder[]) => {
    if (typeof window === "undefined") return
    localStorage.setItem(STORAGE_KEY, JSON.stringify(orders))
    // Manually trigger storage event for the current window if needed, 
    // but the 'storage' event only fires for other windows by default.
    window.dispatchEvent(new Event("storage"))
  },

  placeOrder: (tableId: string, items: CartItem[]) => {
    const orders = OrderService.getOrders()
    const newOrder: LiveOrder = {
      id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      tableId,
      items,
      status: "pending",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      priority: items.some(i => i.popular) ? "urgent" : "normal",
      waiter: "System"
    }
    OrderService.saveOrders([newOrder, ...orders])
    return newOrder
  },

  updateOrderStatus: (orderId: string, status: LiveOrder["status"]) => {
    const orders = OrderService.getOrders()
    const updated = orders.map(o => 
      o.id === orderId ? { ...o, status, updatedAt: new Date().toISOString() } : o
    )
    OrderService.saveOrders(updated)
  },

  subscribe: (callback: (orders: LiveOrder[]) => void) => {
    if (typeof window === "undefined") return () => {}
    
    const handler = (e: StorageEvent | Event) => {
      // Re-fetch even if it wasn't a storage event (for manual triggers)
      callback(OrderService.getOrders())
    }

    window.addEventListener("storage", handler)
    // Initial call
    callback(OrderService.getOrders())
    
    return () => window.removeEventListener("storage", handler)
  }
}
