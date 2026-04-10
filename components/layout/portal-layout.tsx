"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { AppSidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { useAuth } from "@/lib/auth-context"
import { SidebarProvider } from "@/components/ui/sidebar"

interface PortalLayoutProps {
  children: React.ReactNode
  portal: "admin" | "manager" | "waiter" | "kitchen"
}

export function PortalLayout({ children, portal }: PortalLayoutProps) {
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, router])

  if (!isAuthenticated || !user) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="animate-pulse text-[10px] uppercase tracking-widest text-muted-foreground font-heading">
          Grande Cuisine Loading...
        </div>
      </div>
    )
  }

  return (
    <SidebarProvider>
      <div className="flex h-screen overflow-hidden bg-background w-full">
        <AppSidebar portal={portal} />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <main className="flex-1 overflow-y-auto px-[10px] py-4 md:py-6 lg:py-8">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}
