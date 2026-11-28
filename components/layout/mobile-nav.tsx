"use client"

import { useState, useEffect, useMemo } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "motion/react"
import { useAuth, UserRole } from "@/lib/auth-context"
import { useSidebar } from "@/components/ui/sidebar"
import { SPRING_SNAPPY } from "@/lib/motion"
import { cn } from "@/lib/utils"

interface NavItem {
  label: string
  icon: string
  href: string
}

const PORTAL_PREFIXES = ["/admin", "/manager", "/waiter", "/kitchen"]
const HIDDEN_ROUTES = new Set(["/", "/login", "/signup", "/forgot-password"])

export function MobileNav({ rootLevel = false }: { rootLevel?: boolean }) {
  const { user } = useAuth()
  const sidebar = useSidebar()
  const openMobile = sidebar?.openMobile ?? false
  const pathname = usePathname()

  const [isVisible, setIsVisible] = useState(true)

  const isPortalRoute = PORTAL_PREFIXES.some((prefix) => pathname.startsWith(prefix))

  useEffect(() => {
    let lastY = 0
    const handleScroll = (e: Event) => {
      const target = e.target as Document | HTMLElement
      const currentScrollY =
        target === document ? window.scrollY : (target as HTMLElement).scrollTop || 0

      if (Math.abs(currentScrollY - lastY) < 6) return

      if (currentScrollY < 20 || currentScrollY < lastY) {
        setIsVisible(true)
      } else if (currentScrollY > lastY && currentScrollY > 70) {
        setIsVisible(false)
      }

      lastY = currentScrollY
    }

    window.addEventListener("scroll", handleScroll, { passive: true, capture: true })
    return () => window.removeEventListener("scroll", handleScroll, { capture: true })
  }, [])

  const role = user?.role || "customer"

  const navItems = useMemo<NavItem[]>(() => {
    const tableIdMatch = pathname.match(/\/customer\/([^/]+)/)
    const tableId = tableIdMatch ? tableIdMatch[1] : ""
    const customerPrefix = tableId ? `/customer/${tableId}` : "/customer"

    const configs: Record<UserRole, NavItem[]> = {
      admin: [
        { label: "Home", icon: "/home.png", href: "/admin/dashboard" },
        { label: "Staff", icon: "/staff.png", href: "/admin/staff" },
        { label: "Menu", icon: "/menu-nav.png", href: "/admin/menu" },
        { label: "Config", icon: "/system-administration.png", href: "/admin/settings" },
      ],
      manager: [
        { label: "Home", icon: "/home.png", href: "/manager/dashboard" },
        { label: "Orders", icon: "/food-delivery.png", href: "/manager/orders" },
        { label: "Menu", icon: "/menu-nav.png", href: "/manager/menu" },
        { label: "Staff", icon: "/staff.png", href: "/manager/staff" },
        { label: "Reports", icon: "/graphic-progression.png", href: "/manager/reports" },
      ],
      waiter: [
        { label: "Home", icon: "/home.png", href: "/waiter/dashboard" },
        { label: "Floor", icon: "/service-floor-nav.png", href: "/waiter/service-floor" },
        { label: "Menu", icon: "/menu-nav.png", href: "/waiter/menu" },
        { label: "Status", icon: "/food-delivery.png", href: "/waiter/order-tracking" },
        { label: "Pay", icon: "/checkout-nav.png", href: "/waiter/checkout" },
      ],
      kitchen: [
        { label: "KDS", icon: "/chef-icon.png", href: "/kitchen/kds" },
        { label: "Stats", icon: "/graphic-progression.png", href: "/kitchen/kds" },
        { label: "System", icon: "/operation.png", href: "/kitchen/kds" },
      ],
      customer: [
        { label: "Menu", icon: "/menu-nav.png", href: customerPrefix },
        { label: "Bill & Pay", icon: "/checkout-nav.png", href: `${customerPrefix}/billing` },
      ],
      cleaner: [
        { label: "Tasks", icon: "/office.png", href: "/cleaners" },
        { label: "Alerts", icon: "/food-delivery.png", href: "/cleaners" },
      ],
      security: [
        { label: "Watch", icon: "/policeman.png", href: "/security" },
        { label: "Logs", icon: "/report.png", href: "/security" },
      ],
    }
    return configs[role] || configs.customer
  }, [role, pathname])

  if (HIDDEN_ROUTES.has(pathname)) return null
  if (rootLevel && isPortalRoute) return null
  if (!user && !pathname.startsWith("/customer")) return null

  return (
    <nav
      className={cn(
        "fixed bottom-[calc(1rem+env(safe-area-inset-bottom,0px))] left-4 right-4 z-40 max-w-md mx-auto md:hidden transition-[transform,opacity] duration-250 ease-(--ease-out) rounded-2xl shadow-lg border border-border/80 bg-card/95 backdrop-blur-xl",
        isVisible && !openMobile
          ? "translate-y-0 opacity-100"
          : "translate-y-[calc(100%+40px)] opacity-0 pointer-events-none",
      )}
    >
      <div className="relative flex items-center justify-around px-1.5 py-1.5">
        {navItems.map((item, i) => {
          const isExact = pathname === item.href
          const isParent =
            item.href !== "/" && item.href !== "#" && pathname.startsWith(item.href)
          const isActive = isExact || isParent

          return (
            <Link
              key={`${item.href}-${i}`}
              href={item.href}
              className="flex-1 flex flex-col items-center justify-center gap-1 py-2.5 min-h-14 relative z-10 no-tap-highlight rounded-xl active:scale-95 transition-transform duration-100 ease-(--ease-out)"
            >
              {isActive && (
                <motion.span
                  layoutId="mobile-nav-pill"
                  transition={SPRING_SNAPPY}
                  aria-hidden="true"
                  className="absolute inset-1 rounded-xl bg-primary/10 -z-10"
                />
              )}

              <div
                className="size-5 transition-[opacity,background-color] duration-150"
                style={{
                  backgroundColor: isActive ? "var(--primary)" : "var(--muted-foreground)",
                  WebkitMaskImage: `url(${item.icon})`,
                  WebkitMaskSize: "contain",
                  WebkitMaskRepeat: "no-repeat",
                  WebkitMaskPosition: "center",
                  maskImage: `url(${item.icon})`,
                  maskSize: "contain",
                  maskRepeat: "no-repeat",
                  maskPosition: "center",
                  opacity: isActive ? 1 : 0.75,
                }}
              />

              <span
                className={cn(
                  "text-[10px] font-semibold uppercase tracking-tight leading-none transition-colors duration-150",
                  isActive ? "text-primary" : "text-muted-foreground",
                )}
              >
                {item.label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
