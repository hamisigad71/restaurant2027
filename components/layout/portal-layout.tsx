"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { AppSidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { defaultPortalPath, portalAllowedRoles, useAuth } from "@/lib/auth-context"
import { SidebarProvider } from "@/components/ui/sidebar"
import { Spinner } from "@/components/ui/spinner"
import { MobileNav } from "@/components/layout/mobile-nav"
import { SummonsListener } from "@/components/layout/summons-listener"

interface PortalLayoutProps {
  children: React.ReactNode
  portal: "admin" | "manager" | "waiter" | "kitchen"
}

export function PortalLayout({ children, portal }: PortalLayoutProps) {
  const { user, isAuthenticated, isAuthReady } = useAuth()
  const router = useRouter()

  const isAuthorized = !!user && portalAllowedRoles[portal].includes(user.role)

  useEffect(() => {
    if (!isAuthReady) return
    if (!isAuthenticated || !user) {
      router.replace("/login")
      return
    }
    if (!portalAllowedRoles[portal].includes(user.role)) {
      router.replace(defaultPortalPath[user.role])
    }
  }, [isAuthReady, isAuthenticated, user, portal, router])

  if (!isAuthReady || !isAuthenticated || !user || !isAuthorized) {
    return (
      <div className="flex h-dvh items-center justify-center bg-background">
        <div className="flex items-center gap-2 text-[11px] uppercase tracking-wider text-muted-foreground font-heading">
          <Spinner className="size-4 text-primary" />
          <span>TableTap Loading...</span>
        </div>
      </div>
    )
  }

  return (
    <SidebarProvider>
      <SummonsListener />
      <div className="flex h-dvh overflow-hidden bg-background w-full">
        <AppSidebar portal={portal} />
        <div className="flex-1 flex flex-col overflow-hidden relative">
          <Header />
          <main className="flex-1 overflow-y-auto overscroll-contain px-[10px] py-4 md:py-6 lg:py-8 pb-32 md:pb-6">
            {children}
          </main>
          <MobileNav />
        </div>
      </div>
    </SidebarProvider>
  )
}
