"use client"

import { useState, useEffect, useMemo } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  Home, Utensils, ShoppingCart, Bell, 
  Users, Settings, ClipboardList, LayoutGrid,
  MapPin, ShoppingBag, Calculator, BarChart3,
  Shield, Brush, ChefHat
} from "lucide-react"
import { useAuth, UserRole } from "@/lib/auth-context"
import { cn } from "@/lib/utils"

interface NavItem {
  label: string
  icon: any
  href: string
}

export function MobileNav() {
  const { user } = useAuth()
  const pathname = usePathname()
  
  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)

  // Scroll logic: hide on scroll down, show on scroll up
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      
      // Show when at the very top, or scrolling up
      if (currentScrollY < 10 || currentScrollY < lastScrollY) {
        setIsVisible(true)
      } else if (currentScrollY > lastScrollY && currentScrollY > 70) {
        // Hide only after scrolling down a bit
        setIsVisible(false)
      }
      
      setLastScrollY(currentScrollY)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [lastScrollY])

  const role = user?.role || "customer"

  const navItems = useMemo<NavItem[]>(() => {
    // For customers, try to extract tableId from pathname
    const tableIdMatch = pathname.match(/\/customer\/([^/]+)/)
    const tableId = tableIdMatch ? tableIdMatch[1] : ""
    const customerPrefix = tableId ? `/customer/${tableId}` : "/customer"

    const configs: Record<UserRole, NavItem[]> = {
      admin: [
        { label: "Home", icon: Home, href: "/admin/dashboard" },
        { label: "Staff", icon: Users, href: "/admin/staff" },
        { label: "Menu", icon: Utensils, href: "/admin/menu" },
        { label: "Config", icon: Settings, href: "/admin/settings" },
      ],
      manager: [
        { label: "Home", icon: Home, href: "/manager/dashboard" },
        { label: "Orders", icon: ClipboardList, href: "/manager/orders" },
        { label: "Staff", icon: Users, href: "/manager/staff" },
        { label: "Tools", icon: LayoutGrid, href: "/manager/reports" },
      ],
      waiter: [
        { label: "Home", icon: Home, href: "/waiter/dashboard" },
        { label: "Floor", icon: MapPin, href: "/waiter/service-floor" },
        { label: "Status", icon: ShoppingBag, href: "/waiter/order-tracking" },
        { label: "Pay", icon: Calculator, href: "/waiter/checkout" },
      ],
      kitchen: [
        { label: "KDS", icon: ChefHat, href: "/kitchen/kds" },
        { label: "Stats", icon: BarChart3, href: "/kitchen/kds" },
        { label: "System", icon: Settings, href: "/kitchen/kds" },
      ],
      customer: [
        { label: "Home", icon: Home, href: customerPrefix },
        { label: "Menu", icon: Utensils, href: customerPrefix },
        { label: "Orders", icon: ClipboardList, href: `${customerPrefix}/status` }, // Placeholder for status
        { label: "Pay", icon: ShoppingCart, href: `${customerPrefix}/billing` },
      ],
      cleaner: [
        { label: "Tasks", icon: Brush, href: "/cleaners" },
        { label: "Alerts", icon: Bell, href: "/cleaners" },
      ],
      security: [
        { label: "Watch", icon: Shield, href: "/security" },
        { label: "Logs", icon: ClipboardList, href: "/security" },
      ]
    }
    return configs[role] || configs.customer
  }, [role, pathname])

  if (!user && !pathname.startsWith("/customer")) return null

  return (
    <nav 
      className={cn(
        "fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] w-[calc(100%-32px)] max-w-sm transition-all duration-700 ease-in-out md:hidden",
        isVisible ? "translate-y-0 opacity-100" : "translate-y-28 opacity-0 pointer-events-none"
      )}
    >
      {/* Decorative background glow */}
      <div className="absolute -inset-1.5 bg-oklch(0.42 0.14 285 / 0.15) blur-2xl rounded-full opacity-50 pointer-events-none" />

      <div 
        className="relative flex items-center justify-around px-2 py-2 rounded-[28px] border-2 shadow-[0_20px_50px_-12px_rgba(13,3,27,0.25)] backdrop-blur-2xl"
        style={{ 
          background: "rgba(255, 255, 255, 0.8)",
          borderColor: "rgba(115, 108, 131, 0.08)",
        }}
      >
        {/* Inner subtle border */}
        <div className="absolute inset-0 rounded-[26px] border border-white/40 pointer-events-none" />

        {/* Sliding Indicator Background */}
        <div 
          className="absolute h-[calc(100%-12px)] transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] rounded-2xl z-0"
          style={{
            width: `${100 / navItems.length}%`,
            left: `${(navItems.findIndex(item => pathname === item.href || (item.href !== '/' && item.href !== '#' && pathname.startsWith(item.href))) === -1 ? 0 : navItems.findIndex(item => pathname === item.href || (item.href !== '/' && item.href !== '#' && pathname.startsWith(item.href)))) * (100 / navItems.length)}%`,
            background: "oklch(0.42 0.14 285 / 0.08)",
            border: "1px solid oklch(0.42 0.14 285 / 0.15)",
            boxShadow: "0 4px 15px oklch(0.42 0.14 285 / 0.08)"
          }}
        />

        {navItems.map((item, i) => {
          const Icon = item.icon
          const isExact = pathname === item.href
          const isParent = item.href !== '/' && item.href !== '#' && pathname.startsWith(item.href)
          const isActive = isExact || isParent
          
          return (
            <Link 
              key={i} 
              href={item.href}
              className="flex-1 flex flex-col items-center gap-1 py-1.5 group relative z-10 no-tap-highlight"
            >
              <div 
                className={cn(
                  "p-2 rounded-xl transition-all duration-500",
                  isActive 
                    ? "text-oklch(0.42 0.14 285) scale-110" 
                    : "text-[#736C83] group-hover:text-oklch(0.42 0.14 285) group-active:scale-95"
                )}
              >
                <Icon className={cn("h-5 w-5 transition-all duration-300", isActive && "drop-shadow-[0_0_10px_oklch(0.42_0.14_285_/_0.5)]")} strokeWidth={isActive ? 2.5 : 1.8} />
              </div>
              
              <span className={cn(
                "text-[8px] font-bold uppercase tracking-[0.15em] transition-all duration-500",
                isActive ? "opacity-100 translate-y-0 text-oklch(0.42 0.14 285)" : "opacity-40 translate-y-0 text-[#736C83] group-hover:opacity-100"
              )}>
                {item.label}
              </span>

              {/* Individual tiny indicator dot */}
              <div className={cn(
                "absolute -bottom-1 w-1 h-1 rounded-full bg-oklch(0.42 0.14 285) transition-all duration-500 shadow-[0_0_8px_oklch(0.42_0.14_285)]",
                isActive ? "opacity-100 scale-100" : "opacity-0 scale-0"
              )} />
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
