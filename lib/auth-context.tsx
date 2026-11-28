"use client"

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react"

export type UserRole = "admin" | "manager" | "waiter" | "kitchen" | "customer" | "cleaner" | "security"
export type PortalKey = "admin" | "manager" | "waiter" | "kitchen" | "cleaner" | "security"

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
  isAuthReady: boolean
  login: (email: string, password: string, role: UserRole) => Promise<boolean>
  logout: () => void
  switchRole: (role: UserRole) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)
const AUTH_STORAGE_KEY = "tabletap_auth_user"

export const defaultPortalPath: Record<UserRole, string> = {
  admin: "/admin/dashboard",
  manager: "/manager/dashboard",
  waiter: "/waiter/dashboard",
  kitchen: "/kitchen/kds",
  customer: "/customer",
  cleaner: "/cleaners",
  security: "/security",
}

export const portalAllowedRoles: Record<PortalKey, UserRole[]> = {
  admin: ["admin"],
  manager: ["admin", "manager"],
  waiter: ["admin", "manager", "waiter"],
  kitchen: ["admin", "manager", "kitchen"],
  cleaner: ["admin", "manager", "cleaner"],
  security: ["admin", "manager", "security"],
}

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
  const [isAuthReady, setIsAuthReady] = useState(false)

  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(AUTH_STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        if (parsed?.role && demoUsers[parsed.role as UserRole]) {
          setUser(parsed)
        }
      }
    } catch {
      // Ignore storage access errors
    } finally {
      setIsAuthReady(true)
    }
  }, [])

  const login = useCallback(async (_email: string, _password: string, role: UserRole): Promise<boolean> => {
    const nextUser = demoUsers[role]
    setUser(nextUser)
    try {
      sessionStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(nextUser))
    } catch {
      // Ignore storage errors
    }
    return true
  }, [])

  const logout = useCallback(() => {
    setUser(null)
    try {
      sessionStorage.removeItem(AUTH_STORAGE_KEY)
    } catch {
      // Ignore storage errors
    }
  }, [])

  const switchRole = useCallback((role: UserRole) => {
    const nextUser = demoUsers[role]
    setUser(nextUser)
    try {
      sessionStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(nextUser))
    } catch {
      // Ignore storage errors
    }
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isAuthReady,
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
