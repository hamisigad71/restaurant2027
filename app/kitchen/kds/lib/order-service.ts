"use client"
import { OrderService as BaseService } from "@/lib/order-service"
import type { KitchenOrder, OrderStatus } from "./types"

export const OrderService = {
  subscribe: (callback: (orders: KitchenOrder[]) => void) => {
    return BaseService.subscribe((rawOrders: any[]) => {
      const mapped: KitchenOrder[] = rawOrders.map(o => ({
        id: o.id || `ORD-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
        tableNumber: typeof o.tableNumber === 'number' ? o.tableNumber : (parseInt(o.tableId) || 0),
        status: (o.status as OrderStatus) || "pending",
        waiter: o.waiter?.name || o.waiter || "System",
        priority: o.priority || (new Date().getTime() - new Date(o.createdAt).getTime() > 15 * 60000 ? "urgent" : "normal"),
        section: o.section || (o.tableNumber && o.tableNumber < 10 ? "Terrace" : "Main Hall"),
        createdAt: o.createdAt || new Date().toISOString(),
        updatedAt: o.updatedAt || new Date().toISOString(),
        items: (o.items || []).map((item: any) => ({
          id: item.id || `item-${Math.random().toString(36).substr(2, 6)}`,
          name: item.menuItem?.name || item.name || "Unknown Item",
          quantity: item.quantity || 1,
          notes: item.notes,
          image: item.menuItem?.image || item.image,
          category: item.menuItem?.category || item.category || "main",
        }))
      }))
      callback(mapped)
    })
  },
  updateOrderStatus: (id: string, status: OrderStatus) => {
    return BaseService.updateOrderStatus(id, status as any)
  }
}
