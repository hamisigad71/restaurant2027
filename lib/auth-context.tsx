"use client"

import { createContext, useContext, useState, useCallback, type ReactNode } from "react"

export type UserRole = "admin" | "manager" | "waiter" | "kitchen" | "customer" | "cleaner" | "security"

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  avatar?: string
  restaurantId?: string
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  login: (email: string, password: string, role: UserRole) => Promise<boolean>
  logout: () => void
  switchRole: (role: UserRole) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Demo users for different roles
const demoUsers: Record<UserRole, User> = {
  admin: {
    id: "admin-001",
    name: "James Mwangi",
    email: "admin@smartrestaurant.co.ke",
    role: "admin",
    restaurantId: "rest-001",
  },
  manager: {
    id: "mgr-001",
    name: "Grace Wanjiku",
    email: "manager@smartrestaurant.co.ke",
    role: "manager",
    restaurantId: "rest-001",
  },
  waiter: {
    id: "waiter-001",
    name: "Peter Ochieng",
    email: "waiter@smartrestaurant.co.ke",
    role: "waiter",
    restaurantId: "rest-001",
  },
  kitchen: {
    id: "kitchen-001",
    name: "Mary Akinyi",
    email: "kitchen@smartrestaurant.co.ke",
    role: "kitchen",
    restaurantId: "rest-001",
  },
  customer: {
    id: "cust-001",
    name: "Guest Customer",
    email: "guest@email.com",
    role: "customer",
  },
  cleaner: {
    id: "cl-001",
    name: "Facility Team",
    email: "cleaner@smartrestaurant.co.ke",
    role: "cleaner",
    restaurantId: "rest-001",
  },
  security: {
    id: "sec-001",
    name: "Security Chief",
    email: "security@smartrestaurant.co.ke",
    role: "security",
    restaurantId: "rest-001",
  },
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  const login = useCallback(async (email: string, password: string, role: UserRole): Promise<boolean> => {
    // Demo login - in production this would call an API
    await new Promise((resolve) => setTimeout(resolve, 500))
    setUser(demoUsers[role])
    return true
  }, [])

  const logout = useCallback(() => {
    setUser(null)
  }, [])

  const switchRole = useCallback((role: UserRole) => {
    setUser(demoUsers[role])
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
        switchRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

// Role-based access control helpers
export const rolePermissions: Record<UserRole, string[]> = {
  admin: [
    "dashboard",
    "analytics",
    "inventory",
    "menu",
    "staff",
    "payments",
    "reports",
    "settings",
  ],
  manager: [
    "dashboard",
    "orders",
    "inventory",
    "staff",
    "reports",
    "reservations",
    "expenses",
    "schedule",
    "menu",
  ],
  waiter: [
    "dashboard",
    "tables",
    "orders",
    "status",
    "checkout",
  ],
  kitchen: [
    "kitchen",
  ],
  customer: [
    "menu",
    "cart",
    "orders",
  ],
  cleaner: [
    "cleaners",
  ],
  security: [
    "security",
  ],
}

export function hasPermission(role: UserRole, permission: string): boolean {
  return rolePermissions[role]?.includes(permission) ?? false
}
