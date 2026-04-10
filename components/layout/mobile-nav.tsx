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
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([])

  // Scroll logic: hide on scroll down, show on scroll up
  useEffect(() => {
    let lastY = 0
    const handleScroll = (e: any) => {
      const currentScrollY = e.target === document 
        ? window.scrollY 
        : (e.target.scrollTop || 0)
      
      if (Math.abs(currentScrollY - lastY) < 5) return

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
        { label: "Home", icon: Home, href: "/admin/dashboard" },
        { label: "Staff", icon: Users, href: "/admin/staff" },
        { label: "Menu", icon: Utensils, href: "/admin/menu" },
        { label: "Config", icon: Settings, href: "/admin/settings" },
      ],
      manager: [
        { label: "Home", icon: Home, href: "/manager/dashboard" },
        { label: "Orders", icon: ClipboardList, href: "/manager/orders" },
        { label: "Menu", icon: Utensils, href: "/manager/menu" },
        { label: "Staff", icon: Users, href: "/manager/staff" },
        { label: "Reports", icon: BarChart3, href: "/manager/reports" },
      ],
      waiter: [
        { label: "Home", icon: Home, href: "/waiter/dashboard" },
        { label: "Floor", icon: MapPin, href: "/waiter/service-floor" },
        { label: "Menu", icon: Utensils, href: "/waiter/menu" },
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
        { label: "Orders", icon: ClipboardList, href: `${customerPrefix}/status` },
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

  const activeIndex = navItems.findIndex(item => 
    pathname === item.href || (item.href !== '/' && item.href !== '#' && pathname.startsWith(item.href))
  )

  const handleTap = (e: React.MouseEvent, index: number) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    
    const newRipple = { id: Date.now(), x, y }
    setRipples(prev => [...prev, newRipple])
    
    setTimeout(() => {
      setRipples(prev => prev.filter(r => r.id !== newRipple.id))
    }, 600)
  }

  if (!user && !pathname.startsWith("/customer")) return null

  return (
    <>
      {/* Add these styles to your global CSS */}
      <style jsx global>{`
        @keyframes ripple {
          0% {
            transform: scale(0);
            opacity: 0.5;
          }
          100% {
            transform: scale(2.5);
            opacity: 0;
          }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-3px); }
        }
        
        @keyframes pulse-glow {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.6; }
        }

        .no-tap-highlight {
          -webkit-tap-highlight-color: transparent;
          -webkit-touch-callout: none;
          -webkit-user-select: none;
          user-select: none;
        }
      `}</style>

      <nav 
        className={cn(
          "fixed bottom-0 left-0 right-0 z-[100] pb-safe md:hidden transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]",
          isVisible ? "translate-y-0 opacity-100" : "translate-y-[calc(100%+20px)] opacity-0 pointer-events-none"
        )}
      >
        {/* Gradient fade at top */}
        <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-t from-transparent to-[#F8F6FC] pointer-events-none" />

        {/* Main container with refined design - NOW FULL WIDTH */}
        <div className="relative mx-0 mb-0 overflow-hidden">
          
          {/* Sophisticated multi-layer background */}
          <div className="absolute inset-0">
            {/* Base layer - frosted glass effect */}
            <div 
              className="absolute inset-0 backdrop-blur-2xl"
              style={{ 
                background: "linear-gradient(180deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.92) 100%)"
              }}
            />
            
            {/* Noise texture overlay for premium feel */}
            <div 
              className="absolute inset-0 opacity-[0.015] mix-blend-overlay"
              style={{ 
                backgroundImage: "url(data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E)",
                backgroundSize: "128px 128px"
              }}
            />

            {/* Ambient glow effect removed */}
          </div>

          {/* Elegant border system */}
          <div className="absolute inset-0 rounded-t-[32px] border-t-2 border-x-2" 
            style={{ borderColor: "rgba(115, 108, 131, 0.06)" }} />
          <div className="absolute inset-0 rounded-t-[32px] border-t border-x border-white/60" />
          
          {/* Top highlight */}
          <div className="absolute top-0 left-[10%] right-[10%] h-px bg-gradient-to-r from-transparent via-white to-transparent" />

          {/* Content */}
          <div className="relative flex items-center justify-around px-1.5 py-1.5">
            
            {/* Animated Active Indicator - NOW A PERFECT SQUARE */}
            <div 
              className="absolute h-14 w-14 transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] z-0 flex items-center justify-center top-1/2 -translate-y-1/2"
              style={{
                width: `${100 / navItems.length}%`,
                left: `${(activeIndex === -1 ? 0 : activeIndex) * (100 / navItems.length)}%`,
              }}
            >
              {/* Inner Square Wrapper - MINIMALIST (No BG/Border) */}
              <div className="relative w-12 h-12">
                {/* Background and border removed as per request */}
              </div>
            </div>

            {/* Navigation Items */}
            {navItems.map((item, i) => {
              const Icon = item.icon
              const isExact = pathname === item.href
              const isParent = item.href !== '/' && item.href !== '#' && pathname.startsWith(item.href)
              const isActive = isExact || isParent
              
              return (
                <Link 
                  key={i} 
                  href={item.href}
                  onClick={(e) => handleTap(e, i)}
                  className="flex-1 flex flex-col items-center gap-1.5 py-3 group relative z-10 no-tap-highlight overflow-hidden"
                  style={{ minHeight: "64px" }}
                >
                  {/* Ripple effects */}
                  {ripples.map(ripple => (
                    <div
                      key={ripple.id}
                      className="absolute rounded-full bg-oklch(0.42 0.14 285 / 0.2) pointer-events-none"
                      style={{
                        left: ripple.x,
                        top: ripple.y,
                        width: "8px",
                        height: "8px",
                        transform: "translate(-50%, -50%)",
                        animation: "ripple 0.6s ease-out forwards"
                      }}
                    />
                  ))}

                  {/* Icon container with sophisticated hover */}
                  <div className="relative">
                    <div 
                      className={cn(
                        "p-2.5 rounded-none transition-all duration-500 relative",
                        isActive 
                          ? "text-oklch(0.42 0.14 285) scale-100" 
                          : "text-[#736C83] group-hover:text-oklch(0.42 0.14 285) group-active:scale-90"
                      )}
                      style={isActive ? { animation: "float 3s ease-in-out infinite" } : {}}
                    >
                      {/* Icon glow removed */}
                      
                      <Icon 
                        className={cn(
                          "h-5.5 w-5.5 transition-all duration-500 relative z-10",
                          isActive && "drop-shadow-[0_2px_8px_oklch(0.42_0.14_285_/_0.4)]"
                        )} 
                        strokeWidth={isActive ? 2.5 : 2} 
                      />
                    </div>
                  </div>
                  
                  {/* Label with refined typography */}
                  <span 
                    className={cn(
                      "text-[9px] font-bold uppercase tracking-[0.08em] transition-all duration-500 relative",
                      isActive 
                        ? "text-oklch(0.42 0.14 285) opacity-100 translate-y-0" 
                        : "text-[#736C83] opacity-50 translate-y-0.5 group-hover:opacity-100 group-hover:translate-y-0"
                    )}
                    style={isActive ? { 
                      textShadow: "0 0 8px oklch(0.42 0.14 285 / 0.3)"
                    } : {}}
                  >
                    {item.label}
                  </span>

                  {/* Active indicator dot with pulse */}
                  <div className="absolute -bottom-0.5 left-1/2 -translate-x-1/2">
                    <div className={cn(
                      "w-1 h-1 rounded-full transition-all duration-500",
                      isActive 
                        ? "opacity-100 scale-100 bg-oklch(0.42 0.14 285)" 
                        : "opacity-0 scale-0 bg-transparent"
                    )}>
                      {isActive && (
                        <>
                          {/* Pulsing outer ring */}
                          <div 
                            className="absolute inset-0 rounded-full bg-oklch(0.42 0.14 285)"
                            style={{ animation: "pulse-glow 2s ease-in-out infinite" }}
                          />
                          {/* Static glow */}
                          <div 
                            className="absolute inset-0 rounded-full blur-sm bg-oklch(0.42 0.14 285 / 0.6)"
                          />
                        </>
                      )}
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>

        {/* Safe area spacer for devices with notches */}
        <div className="h-safe bg-transparent" />
      </nav>
    </>
  )
}