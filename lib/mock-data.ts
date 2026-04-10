import { allMenuItems } from './menu-data'
import { 
  User, 
  MenuItem, 
  Table, 
  Order, 
  InventoryItem, 
  Payment, 
  DailySales 
} from './types'


// Staff Data
export const mockStaff: User[] = [
  { id: '1', name: 'John Kamau', email: 'john@restaurant.com', role: 'admin', status: 'active', createdAt: '2024-01-15' },
  { id: '2', name: 'Mary Wanjiku', email: 'mary@restaurant.com', role: 'manager', status: 'active', createdAt: '2024-02-01' },
  { id: '3', name: 'Peter Ochieng', email: 'peter@restaurant.com', role: 'waiter', status: 'active', createdAt: '2024-03-10' },
  { id: '4', name: 'Grace Muthoni', email: 'grace@restaurant.com', role: 'waiter', status: 'active', createdAt: '2024-03-15' },
  { id: '5', name: 'James Kiprop', email: 'james@restaurant.com', role: 'kitchen', status: 'active', createdAt: '2024-02-20' },
  { id: '6', name: 'Faith Akinyi', email: 'faith@restaurant.com', role: 'kitchen', status: 'inactive', createdAt: '2024-01-25' },
]

// Menu Items
export const mockMenuItems: MenuItem[] = allMenuItems


// Tables
export const mockTables: Table[] = [
  { id: '1',  number: 1,  seats: 4,  status: 'occupied',  zone: 'A' },
  { id: '2',  number: 2,  seats: 2,  status: 'available', zone: 'A' },
  { id: '3',  number: 3,  seats: 6,  status: 'occupied',  zone: 'A' },
  { id: '4',  number: 4,  seats: 4,  status: 'available', zone: 'A' },
  { id: '5',  number: 5,  seats: 8,  status: 'reserved',  zone: 'B' },
  { id: '6',  number: 6,  seats: 2,  status: 'cleaning',  zone: 'B' },
  { id: '7',  number: 7,  seats: 4,  status: 'available', zone: 'B' },
  { id: '8',  number: 8,  seats: 6,  status: 'occupied',  zone: 'B' },
  { id: '9',  number: 9,  seats: 4,  status: 'available', zone: 'C' },
  { id: '10', number: 10, seats: 10, status: 'reserved',  zone: 'C' },
]

// Orders
export const mockOrders: Order[] = [
  {
    id: 'ORD-001',
    tableNumber: 1,
    items: [
      { menuItem: mockMenuItems[0], quantity: 2, notes: 'Medium rare' },
      { menuItem: mockMenuItems[6], quantity: 2 },
      { menuItem: mockMenuItems[8], quantity: 2 },
    ],
    status: 'cooking',
    total: 2400,
    createdAt: new Date(Date.now() - 25 * 60000).toISOString(),
    updatedAt: new Date(Date.now() - 15 * 60000).toISOString(),
    waiter: mockStaff[2],
  },
  {
    id: 'ORD-002',
    tableNumber: 3,
    items: [
      { menuItem: mockMenuItems[4], quantity: 3 },
      { menuItem: mockMenuItems[9], quantity: 3 },
      { menuItem: mockMenuItems[10], quantity: 6 },
    ],
    status: 'pending',
    total: 2250,
    createdAt: new Date(Date.now() - 5 * 60000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 60000).toISOString(),
    waiter: mockStaff[3],
  },
  {
    id: 'ORD-003',
    tableNumber: 8,
    items: [
      { menuItem: mockMenuItems[1], quantity: 4 },
      { menuItem: mockMenuItems[7], quantity: 4 },
    ],
    status: 'ready',
    total: 2600,
    createdAt: new Date(Date.now() - 45 * 60000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 60000).toISOString(),
    waiter: mockStaff[2],
  },
  {
    id: 'ORD-004',
    tableNumber: 5,
    items: [
      { menuItem: mockMenuItems[2], quantity: 2 },
      { menuItem: mockMenuItems[11], quantity: 4 },
      { menuItem: mockMenuItems[6], quantity: 2 },
    ],
    status: 'served',
    total: 2000,
    createdAt: new Date(Date.now() - 90 * 60000).toISOString(),
    updatedAt: new Date(Date.now() - 60 * 60000).toISOString(),
    waiter: mockStaff[3],
  },
]

// Inventory
export const mockInventory: InventoryItem[] = [
  { id: '1', name: 'Beef', quantity: 15, unit: 'kg', minStock: 10, status: 'good', lastUpdated: '2024-03-20' },
  { id: '2', name: 'Chicken', quantity: 8, unit: 'kg', minStock: 10, status: 'low', lastUpdated: '2024-03-20' },
  { id: '3', name: 'Rice', quantity: 25, unit: 'kg', minStock: 20, status: 'good', lastUpdated: '2024-03-19' },
  { id: '4', name: 'Maize Flour', quantity: 30, unit: 'kg', minStock: 15, status: 'good', lastUpdated: '2024-03-18' },
  { id: '5', name: 'Potatoes', quantity: 5, unit: 'kg', minStock: 15, status: 'critical', lastUpdated: '2024-03-20' },
  { id: '6', name: 'Onions', quantity: 12, unit: 'kg', minStock: 8, status: 'good', lastUpdated: '2024-03-19' },
  { id: '7', name: 'Tomatoes', quantity: 6, unit: 'kg', minStock: 10, status: 'low', lastUpdated: '2024-03-20' },
  { id: '8', name: 'Cooking Oil', quantity: 20, unit: 'liters', minStock: 10, status: 'good', lastUpdated: '2024-03-17' },
  { id: '9', name: 'Salt', quantity: 5, unit: 'kg', minStock: 3, status: 'good', lastUpdated: '2024-03-15' },
  { id: '10', name: 'Tilapia', quantity: 0, unit: 'kg', minStock: 8, status: 'out', lastUpdated: '2024-03-20' },
  { id: '11', name: 'Passion Fruit', quantity: 3, unit: 'kg', minStock: 5, status: 'low', lastUpdated: '2024-03-20' },
  { id: '12', name: 'Mango', quantity: 8, unit: 'kg', minStock: 5, status: 'good', lastUpdated: '2024-03-19' },
]

// Payments
export const mockPayments: Payment[] = [
  { id: 'PAY-001', orderId: 'ORD-004', amount: 2000, method: 'mpesa', status: 'completed', createdAt: new Date(Date.now() - 60 * 60000).toISOString() },
  { id: 'PAY-002', orderId: 'ORD-003', amount: 2600, method: 'cash', status: 'pending', createdAt: new Date(Date.now() - 5 * 60000).toISOString() },
]

// Sales Data for Charts
export const mockDailySales: DailySales[] = [
  { date: '2024-03-14', revenue: 45000, orders: 32 },
  { date: '2024-03-15', revenue: 52000, orders: 38 },
  { date: '2024-03-16', revenue: 68000, orders: 45 },
  { date: '2024-03-17', revenue: 72000, orders: 48 },
  { date: '2024-03-18', revenue: 48000, orders: 35 },
  { date: '2024-03-19', revenue: 55000, orders: 40 },
  { date: '2024-03-20', revenue: 62000, orders: 42 },
]

// Dashboard Stats
export const mockDashboardStats = {
  todayRevenue: 62000,
  weeklyRevenue: 402000,
  monthlyRevenue: 1850000,
  todayOrders: 42,
  pendingOrders: 8,
  activeStaff: 5,
  lowStockItems: 4,
}
