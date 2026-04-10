"use client";

import * as React from "react"
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  IconDashboard,
  IconListDetails,
  IconChartBar,
  IconFolder,
  IconUsers,
  IconSettings,
  IconHelp,
  IconSearch,
  IconDatabase,
  IconReport,
  IconFileWord,
  IconTools,
  IconToolsKitchen2,
  IconLayoutDashboard,
  IconPackage,
  IconToolsKitchen,
  IconCalendarEvent,
  IconClock,
  IconShoppingCart,
  IconGridDots,
} from "@tabler/icons-react"

import { NavMain } from "@/components/nav-main"
import { NavDocuments } from "@/components/nav-documents"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { useAuth, type UserRole, hasPermission } from "@/lib/auth-context";
import { LogOut } from "lucide-react";

// ─── Data Mapping ────────────────────────────────────────────────────────────

interface NavItem {
  name: string;
  href: string;
  icon: any;
  permission: string;
  portal: "admin" | "manager" | "waiter" | "kitchen" | "customer";
  badge?: string;
}

const allNavItems: NavItem[] = [
  // Admin
  { name: "Dashboard", href: "/admin/dashboard", icon: IconLayoutDashboard, permission: "dashboard", portal: "admin" },
  { name: "Analytics", href: "/admin/analytics", icon: IconChartBar, permission: "analytics", portal: "admin" },
  { name: "Inventory", href: "/admin/inventory", icon: IconPackage, permission: "inventory", portal: "admin" },
  { name: "Menu", href: "/admin/menu", icon: IconToolsKitchen, permission: "menu", portal: "admin" },
  { name: "Staff", href: "/admin/staff", icon: IconUsers, permission: "staff", portal: "admin" },
  { name: "Payments", href: "/admin/payments", icon: IconDatabase, permission: "payments", portal: "admin" },
  { name: "Reports", href: "/admin/reports", icon: IconReport, permission: "reports", portal: "admin" },
  { name: "Settings", href: "/admin/settings", icon: IconSettings, permission: "settings", portal: "admin" },
  
  // Manager
  { name: "Dashboard", href: "/manager/dashboard", icon: IconLayoutDashboard, permission: "dashboard", portal: "manager" },
  { name: "Orders", href: "/manager/orders", icon: IconShoppingCart, permission: "orders", portal: "manager" },
  { name: "Inventory", href: "/manager/inventory", icon: IconPackage, permission: "inventory", portal: "manager" },
  { name: "Menu", href: "/manager/menu", icon: IconToolsKitchen, permission: "menu", portal: "manager" },
  { name: "Staff Oversight", href: "/manager/staff", icon: IconUsers, permission: "staff", portal: "manager" },
  { name: "Reservations", href: "/manager/reservations", icon: IconClock, permission: "reservations", portal: "manager" },
  { name: "Expenses", href: "/manager/expenses", icon: IconDatabase, permission: "expenses", portal: "manager" },
  { name: "Shift Planning", href: "/manager/schedule", icon: IconCalendarEvent, permission: "schedule", portal: "manager" },
  { name: "Reports", href: "/manager/reports", icon: IconReport, permission: "reports", portal: "manager" },
  
  // Waiter
  { name: "Dashboard", href: "/waiter/dashboard", icon: IconLayoutDashboard, permission: "dashboard", portal: "waiter" },
  { name: "Service Floor", href: "/waiter/service-floor", icon: IconGridDots, permission: "orders", portal: "waiter" },
  { name: "Order Tracking", href: "/waiter/order-tracking", icon: IconToolsKitchen2, permission: "orders", portal: "waiter" },
  { name: "Menu", href: "/waiter/menu", icon: IconToolsKitchen, permission: "orders", portal: "waiter" },
  { name: "Checkout", href: "/waiter/checkout", icon: IconDatabase, permission: "orders", portal: "waiter" },
  
  // Kitchen
  { name: "Kitchen Display", href: "/kitchen/kds", icon: IconToolsKitchen2, permission: "kitchen", portal: "kitchen", badge: "Live" },
];

export function AppSidebar({
  portal,
  ...props
}: React.ComponentProps<typeof Sidebar> & {
  portal: "admin" | "manager" | "waiter" | "kitchen";
}) {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const navigation = React.useMemo(() => {
    if (!user) return [];
    return allNavItems.filter(
      (item) =>
        item.portal === portal && hasPermission(user.role, item.permission),
    );
  }, [user, portal]);

  if (!user) return null;

  const data = {
    user: {
      name: user.name,
      email: user.email,
      avatar: "", // Can be connected to user.avatar if available
    },
    navMain: navigation.map((item) => ({
      title: item.name,
      url: item.href,
      icon: item.icon,
      isActive: pathname === item.href || pathname.startsWith(item.href + "/"),
      badge: item.badge,
    })),
    navSecondary: [
      {
        title: "Support",
        url: "#",
        icon: IconHelp,
      },
      {
        title: "Search",
        url: "#",
        icon: IconSearch,
      },
    ],
    documents: [],
  }

  return (
    <Sidebar collapsible="offcanvas" {...props} className="border-r border-border/40">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild className="hover:bg-primary/5">
              <a href="#">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-lg shadow-primary/20">
                  <IconToolsKitchen className="size-4.5" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate   uppercase">Resto</span>
                  <span className="truncate text-[10px] text-muted-foreground uppercase ">Grande Cuisine</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavDocuments items={data.documents} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter className="border-t border-border/40 p-2">
        <NavUser user={data.user} logout={logout} />
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton 
              onClick={() => {
                logout()
                window.location.href = "/login"
              }}
              className="mt-1 text-red-500 hover:text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut className="size-4 shrink-0" />
              <span className="font-medium">Sign Out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}

