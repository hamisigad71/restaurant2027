import type { OrderStatus } from "@/lib/types"

export type { OrderStatus }

export interface OrderItem {
  id: string
  name: string
  quantity: number
  notes?: string
  image?: string
  category: string
}

export interface KitchenOrder {
  id: string
  tableNumber: number
  status: OrderStatus
  waiter: string
  priority: "normal" | "urgent"
  section?: string
  createdAt: string
  updatedAt: string
  items: OrderItem[]
}
