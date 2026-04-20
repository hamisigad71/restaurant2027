import { 
  ShieldCheckIcon as Shield, 
  UserGroupIcon as Users, 
  ShoppingCartIcon as ShoppingCart, 
  CakeIcon as ChefHat, 
  SparklesIcon as Sparkles, 
  ArrowTrendingUpIcon as TrendingUp, 
  BoltIcon as Zap, 
  SparklesIcon as UtensilsCrossed 
} from "@heroicons/react/24/outline"

export type UserRole = 'admin' | 'manager' | 'waiter' | 'kitchen' | 'customer' | 'cleaner' | 'security'

export const roleOptions = [
  { role: "admin" as UserRole, label: "Admin", description: "Full access", icon: Shield },
  { role: "manager" as UserRole, label: "Manager", description: "Ops & reports", icon: Users },
  { role: "waiter" as UserRole, label: "Staff", description: "Waiter & support", icon: ShoppingCart },
  { role: "kitchen" as UserRole, label: "Kitchen", description: "Preparation", icon: ChefHat },
]

export const defaultRedirects: Record<UserRole, string> = {
  admin: "/admin/dashboard",
  manager: "/manager/dashboard",
  waiter: "/waiter/dashboard",
  kitchen: "/kitchen/kds",
  customer: "/customer",
  cleaner: "/cleaners",
  security: "/security",
}

export const stats = [
  { value: "5", label: "Portals", icon: Sparkles },
  { value: "99.9%", label: "Uptime", icon: TrendingUp },
  { value: "Real-time", label: "Sync", icon: Zap },
]

export const testimonials = [
  {
    text: "Resto transformed our operations overnight. Table turns up 40%, zero miscommunications.",
    author: "Chef Amara Osei",
    role: "Executive Chef, Nairobi",
    avatar: "AO",
    rating: 5,
  },
  {
    text: "The KDS alone paid for itself in two weeks. Our kitchen has never run this clean.",
    author: "Grace Wambua",
    role: "Operations Manager",
    avatar: "GW",
    rating: 5,
  },
]

export const STAFF_SUB_ROLES = [
  { id: "waiter", label: "Waiter", icon: ShoppingCart, desc: "Orders & Tables", path: "/waiter/dashboard" },
  { id: "kitchen", label: "Chef", icon: ChefHat, desc: "Kitchen KDS", path: "/kitchen/kds" },
  { id: "cleaner", label: "Cleaner", icon: UtensilsCrossed, desc: "Facility Maintenance", path: "/cleaners" },
  { id: "security", label: "Security", icon: Shield, desc: "Safety & Access", path: "/security" },
]

export const features = [
  "Floor Plan View",
  "KDS Display",
  "Live Analytics",
  "5 Portals",
  "Real-time Sync",
  "Cloud Storage"
]
