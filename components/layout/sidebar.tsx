"use client";

import * as React from "react"
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Squares2X2Icon,
  ChartBarIcon,
  CubeIcon,
  ClipboardDocumentListIcon,
  UserGroupIcon,
  CreditCardIcon,
  DocumentChartBarIcon,
  Cog6ToothIcon,
  ShoppingCartIcon,
  CalendarIcon,
  ClockIcon,
  BanknotesIcon,
  TableCellsIcon,
  QueueListIcon,
  ComputerDesktopIcon,
  QuestionMarkCircleIcon,
  MagnifyingGlassIcon,
  ArrowRightOnRectangleIcon,
  PresentationChartBarIcon,
} from "@heroicons/react/24/outline"

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
  { name: "Dashboard", href: "/admin/dashboard", icon: "/dashboard.png", permission: "dashboard", portal: "admin" },
  { name: "Analytics", href: "/admin/analytics", icon: "/report.png", permission: "analytics", portal: "admin" },
  { name: "Inventory", href: "/admin/inventory", icon: "/logistics.png", permission: "inventory", portal: "admin" },
  { name: "Menu", href: "/admin/menu", icon: "/menu-nav.png", permission: "menu", portal: "admin" },
  { name: "Staff", href: "/admin/staff", icon: "/staff.png", permission: "staff", portal: "admin" },
  { name: "Payments", href: "/admin/payments", icon: CreditCardIcon, permission: "payments", portal: "admin" },
  { name: "Reports", href: "/admin/reports", icon: "/report.png", permission: "reports", portal: "admin" },
  { name: "Settings", href: "/admin/settings", icon: "/system-administration.png", permission: "settings", portal: "admin" },
  
  // Manager
  { name: "Dashboard", href: "/manager/dashboard", icon: "/dashboard.png", permission: "dashboard", portal: "manager" },
  { name: "Orders", href: "/manager/orders", icon: "/food-delivery.png", permission: "orders", portal: "manager" },
  { name: "Inventory", href: "/manager/inventory", icon: "/logistics.png", permission: "inventory", portal: "manager" },
  { name: "Menu", href: "/manager/menu", icon: "/menu-nav.png", permission: "menu", portal: "manager" },
  { name: "Staff Oversight", href: "/manager/staff", icon: "/staff.png", permission: "staff", portal: "manager" },
  { name: "Reservations", href: "/manager/reservations", icon: "/calendar.png", permission: "reservations", portal: "manager" },
  { name: "Expenses", href: "/manager/expenses", icon: "/expences.png", permission: "expenses", portal: "manager" },
  { name: "Shift Planning", href: "/manager/schedule", icon: "/shift.png", permission: "schedule", portal: "manager" },
  { name: "Reports", href: "/manager/reports", icon: "/report.png", permission: "reports", portal: "manager" },
  
  // Waiter
  { name: "Dashboard", href: "/waiter/dashboard", icon: "/dashboard.png", permission: "dashboard", portal: "waiter" },
  { name: "Service Floor", href: "/waiter/service-floor", icon: "/service-floor-nav.png", permission: "orders", portal: "waiter" },
  { name: "Order Tracking", href: "/waiter/order-tracking", icon: "/food-delivery.png", permission: "orders", portal: "waiter" },
  { name: "Menu", href: "/waiter/menu", icon: "/menu-nav.png", permission: "orders", portal: "waiter" },
  { name: "Checkout", href: "/waiter/checkout", icon: "/checkout-nav.png", permission: "orders", portal: "waiter" },
  
  // Kitchen
  { name: "Kitchen Display", href: "/kitchen/kds", icon: "/chef-icon.png", permission: "kitchen", portal: "kitchen", badge: "Live" },
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
        icon: QuestionMarkCircleIcon,
      },
      {
        title: "Search",
        url: "#",
        icon: MagnifyingGlassIcon,
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
                <div className="flex aspect-square size-20 items-center justify-center rounded-xl text-primary-foreground shadow-lg shadow-primary/20 p-1.5 shrink-0">
                  <img src="/logo-icon.png" alt="Resto" className="size-full object-contain" />
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
              <ArrowRightOnRectangleIcon className="size-4 shrink-0" />
              <span className="font-medium">Sign Out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}

