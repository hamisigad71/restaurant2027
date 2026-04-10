// User & Auth Types
export type UserRole = 'admin' | 'manager' | 'waiter' | 'kitchen' | 'customer' | 'cleaner' | 'security'

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  avatar?: string
  status: 'active' | 'inactive'
  createdAt: string
}

// Menu Types
export interface MenuItem {
  id: string
  name: string
  description: string
  price: number
  category: 'starters' | 'main' | 'drinks' | 'snacks' | 'desserts' | 'seafood'
  image: string
  ingredients: string[]
  available: boolean
  prepTime?: number
  popular?: boolean
  rating?: number
  vegetarian?: boolean
}

export interface CartItem extends MenuItem {
  quantity: number
  notes?: string
}

// Order Types
export type OrderStatus = 'pending' | 'confirmed' | 'cooking' | 'ready' | 'served' | 'cancelled'

export interface OrderItem {
  menuItem: MenuItem
  quantity: number
  notes?: string
}

export interface Order {
  id: string
  tableNumber: number
  items: OrderItem[]
  status: OrderStatus
  total: number
  createdAt: string
  updatedAt: string
  waiter?: User
}

// Table Types
export type TableStatus = 'available' | 'occupied' | 'reserved' | 'cleaning'

export interface Table {
  id: string
  number: number
  seats: number
  status: TableStatus
  currentOrder?: Order
  zone?: string
}

// Inventory Types
export type StockStatus = 'good' | 'low' | 'critical' | 'out'

export interface InventoryItem {
  id: string
  name: string
  quantity: number
  unit: string
  minStock: number
  status: StockStatus
  lastUpdated: string
}

// Payment Types
export type PaymentMethod = 'cash' | 'mpesa' | 'card'
export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded'

export interface Payment {
  id: string
  orderId: string
  amount: number
  method: PaymentMethod
  status: PaymentStatus
  createdAt: string
}

// Analytics Types
export interface DailySales {
  date: string
  revenue: number
  orders: number
}

export interface TopProduct {
  menuItem: MenuItem
  quantity: number
  revenue: number
}
