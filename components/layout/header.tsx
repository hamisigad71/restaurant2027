"use client";

import {
  Bell,
  Search,
  Settings,
  User,
  LogOut,
  Package,
  ShoppingCart,
  ChefHat,
  X,
  ChevronDown,
} from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth, type UserRole } from "@/lib/auth-context";
import { cn } from "@/lib/utils";
import { SidebarTrigger } from "@/components/ui/sidebar";

// ─── Role config ─────────────────────────────────────────────────────────────

const roleLabels: Record<UserRole, string> = {
  admin: "Administrator",
  manager: "Manager",
  waiter: "Waiter",
  kitchen: "Kitchen Staff",
  customer: "Customer",
  cleaner: "Cleaner",
  security: "Security",
};

const roleAccent: Record<
  UserRole,
  { bg: string; text: string; dot: string; avatarBg: string }
> = {
  admin: {
    bg: "oklch(0.45 0.12 285 / 0.08)",
    text: "oklch(0.38 0.12 285)",
    dot: "oklch(0.45 0.12 285)",
    avatarBg: "oklch(0.45 0.12 285 / 0.1)",
  },
  manager: {
    bg: "oklch(0.65 0.12 230 / 0.08)",
    text: "oklch(0.45 0.12 230)",
    dot: "oklch(0.65 0.12 230)",
    avatarBg: "oklch(0.65 0.12 230 / 0.1)",
  },
  waiter: {
    bg: "oklch(0.7 0.15 150 / 0.08)",
    text: "oklch(0.42 0.14 150)",
    dot: "oklch(0.7 0.15 150)",
    avatarBg: "oklch(0.7 0.15 150 / 0.1)",
  },
  kitchen: {
    bg: "oklch(0.75 0.15 75 / 0.08)",
    text: "oklch(0.5 0.15 75)",
    dot: "oklch(0.75 0.15 75)",
    avatarBg: "oklch(0.75 0.15 75 / 0.1)",
  },
  customer: {
    bg: "oklch(0.65 0.18 25 / 0.08)",
    text: "oklch(0.48 0.16 25)",
    dot: "oklch(0.65 0.18 25)",
    avatarBg: "oklch(0.65 0.18 25 / 0.1)",
  },
  cleaner: {
    bg: "oklch(0.6 0.05 200 / 0.08)",
    text: "oklch(0.5 0.05 200)",
    dot: "oklch(0.6 0.05 200)",
    avatarBg: "oklch(0.6 0.05 200 / 0.1)",
  },
  security: {
    bg: "oklch(0.5 0.15 45 / 0.08)",
    text: "oklch(0.4 0.15 45)",
    dot: "oklch(0.5 0.15 45)",
    avatarBg: "oklch(0.5 0.15 45 / 0.1)",
  },
};

// ─── Page titles ─────────────────────────────────────────────────────────────

const pageTitle: Record<string, { title: string; subtitle?: string }> = {
  "/admin/dashboard": {
    title: "Revenue & Insights",
    subtitle: "Executive performance overview",
  },
  "/admin/analytics": {
    title: "Business Analytics",
    subtitle: "Detailed data and trends",
  },
  "/admin/staff": {
    title: "Personnel Management",
    subtitle: "Manage your team and roles",
  },
  "/admin/inventory": {
    title: "Inventory Master",
    subtitle: "Complete stock control",
  },
  "/admin/menu": { title: "Grande Menu", subtitle: "Curate your offerings" },
  "/admin/payments": {
    title: "Financials",
    subtitle: "Transaction and billing history",
  },
  "/admin/reports": {
    title: "Executive Reports",
    subtitle: "Detailed business summaries",
  },
  "/admin/settings": {
    title: "System Settings",
    subtitle: "Branding and preferences",
  },
  "/manager/dashboard": {
    title: "Operations Hub",
    subtitle: "Real-time floor oversight",
  },
  "/manager/orders": {
    title: "Order Board",
    subtitle: "Manage and approve incoming orders",
  },
  "/manager/inventory": {
    title: "Stock Watch",
    subtitle: "Monitor and request supplies",
  },
  "/manager/staff": {
    title: "Staff Shift",
    subtitle: "Daily personnel oversight",
  },
  "/manager/reports": {
    title: "Daily Summaries",
    subtitle: "Operational performance reports",
  },
  "/waiter/dashboard": {
    title: "My Dashboard",
    subtitle: "Service overview & alerts",
  },
  "/waiter/service-floor": {
    title: "Service Floor",
    subtitle: "Floor plan and guest ordering",
  },
  "/waiter/order-tracking": {
    title: "Order Tracking",
    subtitle: "Real-time preparation status",
  },
  "/waiter/checkout": {
    title: "Settlement",
    subtitle: "Process payments and receipts",
  },
  "/kitchen/kds": {
    title: "Kitchen Display",
    subtitle: "Live preparation queue",
  },
  "/customer": { title: "Digital Menu", subtitle: "Browse and order" },
};

// ─── Notification data ───────────────────────────────────────────────────────

const notifications = [
  {
    id: "1",
    icon: Package,
    iconColor: "oklch(0.55 0.15 75)",
    iconBg: "oklch(0.75 0.15 75 / 0.1)",
    title: "Low Stock Alert",
    body: "Potatoes running critically low",
    time: "2m ago",
    unread: true,
  },
  {
    id: "2",
    icon: ShoppingCart,
    iconColor: "oklch(0.45 0.12 285)",
    iconBg: "oklch(0.45 0.12 285 / 0.08)",
    title: "New Order",
    body: "Table 3 placed a new order",
    time: "5m ago",
    unread: true,
  },
  {
    id: "3",
    icon: ChefHat,
    iconColor: "oklch(0.42 0.14 150)",
    iconBg: "oklch(0.7 0.15 150 / 0.1)",
    title: "Order Ready",
    body: "Order #003 is ready to serve",
    time: "9m ago",
    unread: true,
  },
];

// ─── Component ───────────────────────────────────────────────────────────────

export function Header({
  title,
  subtitle,
}: {
  title?: string;
  subtitle?: string;
}) {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [searchOpen, setSearchOpen] = useState(false);
  const [dismissedNotifs, setDismissedNotifs] = useState<string[]>([]);

  const currentPage = {
    title: title || pageTitle[pathname]?.title || "Resto",
    subtitle: subtitle || pageTitle[pathname]?.subtitle || "",
  };

  const handleLogout = () => {
    logout();
    router.push("/login");
  };
  if (!user) return null;

  const accent = roleAccent[user.role] ?? roleAccent.waiter;
  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  const visibleNotifs = notifications.filter(
    (n) => !dismissedNotifs.includes(n.id),
  );
  const unreadCount = visibleNotifs.filter((n) => n.unread).length;

  return (
    <TooltipProvider delayDuration={300}>
      <header
        className="sticky top-0 z-30 flex items-center h-14 px-4 lg:px-6 border-b"
        style={{
          background: "rgba(250,250,249,0.94)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderColor: "#E2DCF0",
          boxShadow: "0 1px 0 #E2DCF0",
        }}
      >
        {/* ── Left: spacer + page title ───────────────────────── */}
        <div className="flex items-center gap-3 min-w-0 flex-1">
          {/* Sidebar Toggle */}
          <SidebarTrigger className="-ml-1 h-9 w-9 rounded-xl hover:bg-[#EBE6F8] text-[#736C83]" />

          {/* Thin vertical rule */}
          <div className="hidden lg:block h-5 w-px bg-[#D8D2E8] shrink-0" />

          <div className="min-w-0">
            <h1
              className="text-[15px]  leading-none truncate"
              style={{ color: "#0D031B" }}
            >
              {currentPage.title}
            </h1>
            {currentPage.subtitle && (
              <p
                className="text-[10px]  uppercase font-medium mt-0.5 hidden sm:block truncate"
                style={{ color: "#9A94AA" }}
              >
                {currentPage.subtitle}
              </p>
            )}
          </div>
        </div>

        {/* ── Right: actions ──────────────────────────────────── */}
        <div className="flex items-center gap-1 shrink-0">
          {/* Search — desktop */}
          <div className="hidden md:flex items-center relative mr-1">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 pointer-events-none"
              style={{ color: "#B8B2C8" }}
            />
            <Input
              type="search"
              placeholder="Search…"
              className={cn(
                "h-8 pl-8 pr-3 text-[13px] rounded-lg border",
                "bg-[#F4F1FA] border-transparent placeholder:text-[#B8B2C8]",
                "focus:bg-white focus:border-[oklch(0.45_0.12_285)/0.35]",
                "focus:ring-1 focus:ring-[oklch(0.45_0.12_285)/0.2]",
                "transition-all duration-200 w-44 focus:w-56",
              )}
              style={{ color: "#0D031B" }}
            />
          </div>

          {/* Search toggle — mobile */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Search"
                className="md:hidden h-8 w-8 rounded-lg hover:bg-[#EBE6F8] transition-colors"
                style={{ color: "#736C83" }}
                onClick={() => setSearchOpen((v) => !v)}
              >
                <Search className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="text-xs">
              Search
            </TooltipContent>
          </Tooltip>

          {/* Mobile search bar */}
          {searchOpen && (
            <div
              className="absolute top-14 left-0 right-0 z-40 md:hidden flex items-center gap-2 px-4 py-2.5 border-b"
              style={{
                background: "rgba(250,250,249,0.98)",
                borderColor: "#E2DCF0",
              }}
            >
              <div className="relative flex-1">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 pointer-events-none"
                  style={{ color: "#B8B2C8" }}
                />
                <Input
                  autoFocus
                  type="search"
                  placeholder="Search tables, orders, staff…"
                  className="w-full h-8 pl-8 pr-8 text-[13px] rounded-lg border bg-[#F4F1FA] border-transparent focus:bg-white focus:border-[oklch(0.45_0.12_285)/0.3]"
                  style={{ color: "#0D031B" }}
                />
              </div>
              <button
                onClick={() => setSearchOpen(false)}
                className="flex items-center justify-center h-7 w-7 rounded-md hover:bg-[#EBE6F8] shrink-0"
                style={{ color: "#736C83" }}
                aria-label="Close search"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          )}

          {/* Thin divider */}
          <div className="h-5 w-px bg-[#E2DCF0] mx-1 hidden sm:block" />

          {/* ── Notifications ─────────────────────────────────── */}
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Notifications"
                className="relative h-8 w-8 rounded-lg hover:bg-[#EBE6F8] transition-colors"
                style={{ color: "#736C83" }}
              >
                <Bell className="h-4 w-4" />
                {unreadCount > 0 && (
                  <span
                    className="absolute -top-0.5 -right-0.5 flex items-center justify-center rounded-full text-[9px] text-white"
                    style={{
                      minWidth: "16px",
                      height: "16px",
                      padding: "0 3px",
                      background: "oklch(0.55 0.18 25)",
                      boxShadow: "0 1px 4px oklch(0.55 0.18 25 / 0.45)",
                    }}
                  >
                    {unreadCount}
                  </span>
                )}
              </Button>
            </SheetTrigger>

            <SheetContent
              side="right"
              className="w-[300px] sm:w-[360px] p-0"
              style={{ borderColor: "#E2DCF0", background: "#FAFAF9" }}
            >
              <SheetHeader
                className="px-5 py-4"
                style={{ borderBottom: "1px solid #EEEBF5" }}
              >
                <div className="flex items-center justify-between">
                  <SheetTitle
                    className="flex items-center gap-2 text-[13px]"
                    style={{ color: "#0D031B" }}
                  >
                    <Bell
                      className="h-3.5 w-3.5"
                      style={{ color: "oklch(0.45 0.12 285)" }}
                    />
                    Notifications
                    {unreadCount > 0 && (
                      <span
                        className="text-[9px] px-1.5 py-0.5 rounded-full"
                        style={{
                          background: "oklch(0.45 0.12 285 / 0.1)",
                          color: "oklch(0.45 0.12 285)",
                        }}
                      >
                        {unreadCount} new
                      </span>
                    )}
                  </SheetTitle>
                  {unreadCount > 0 && (
                    <button
                      className="text-[10px] font-medium uppercase  hover:opacity-60 transition-opacity"
                      style={{ color: "oklch(0.45 0.12 285)" }}
                      onClick={() =>
                        setDismissedNotifs(notifications.map((n) => n.id))
                      }
                    >
                      Clear all
                    </button>
                  )}
                </div>
              </SheetHeader>

              <ScrollArea className="h-[calc(100vh-72px)]">
                {visibleNotifs.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 gap-3">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center"
                      style={{ background: "oklch(0.7 0.15 150 / 0.1)" }}
                    >
                      <Bell
                        className="h-5 w-5"
                        style={{ color: "oklch(0.42 0.14 150)" }}
                      />
                    </div>
                    <p
                      className="text-[13px]"
                      style={{ color: "#3D374C" }}
                    >
                      You're all caught up
                    </p>
                    <p className="text-xs" style={{ color: "#9A94AA" }}>
                      No new notifications
                    </p>
                  </div>
                ) : (
                  <div style={{ borderColor: "#EEEBF5" }} className="divide-y">
                    {visibleNotifs.map((notif) => {
                      const Icon = notif.icon;
                      return (
                        <div
                          key={notif.id}
                          className="group relative flex items-start gap-3 px-5 py-4 transition-colors hover:bg-[#F4F1FA]"
                        >
                          {notif.unread && (
                            <span
                              className="absolute left-1.5 top-[22px] w-1.5 h-1.5 rounded-full"
                              style={{ background: "oklch(0.45 0.12 285)" }}
                            />
                          )}

                          <div
                            className="flex items-center justify-center w-8 h-8 rounded-lg shrink-0 mt-0.5"
                            style={{ background: notif.iconBg }}
                          >
                            <Icon
                              className="h-3.5 w-3.5"
                              style={{ color: notif.iconColor }}
                            />
                          </div>

                          <div className="flex-1 min-w-0">
                            <p
                              className="text-[13px] leading-tight"
                              style={{ color: "#0D031B" }}
                            >
                              {notif.title}
                            </p>
                            <p
                              className="text-xs mt-0.5"
                              style={{ color: "#736C83" }}
                            >
                              {notif.body}
                            </p>
                            <p
                              className="text-[10px] mt-1 font-medium"
                              style={{ color: "#B8B2C8" }}
                            >
                              {notif.time}
                            </p>
                          </div>

                          <button
                            aria-label="Dismiss"
                            className="opacity-0 group-hover:opacity-100 flex items-center justify-center w-5 h-5 rounded-md shrink-0 mt-0.5 transition-all hover:bg-[#E2DCF0]"
                            style={{ color: "#9A94AA" }}
                            onClick={() =>
                              setDismissedNotifs((d) => [...d, notif.id])
                            }
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </ScrollArea>
            </SheetContent>
          </Sheet>

          {/* ── User dropdown ─────────────────────────────────── */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className={cn(
                  "flex items-center gap-2 h-8 pl-1.5 pr-2.5 rounded-lg",
                  "border border-transparent transition-all duration-150",
                  "hover:bg-[#EBE6F8] hover:border-[#D8D2E8]",
                  "focus:outline-none focus-visible:ring-2 focus-visible:ring-[oklch(0.45_0.12_285)/0.4]",
                )}
              >
                <Avatar className="h-6 w-6 shrink-0">
                  <AvatarFallback
                    className="text-[10px]"
                    style={{ background: accent.avatarBg, color: accent.text }}
                  >
                    {initials}
                  </AvatarFallback>
                </Avatar>

                <div className="hidden lg:flex flex-col items-start leading-none">
                  <span
                    className="text-[12px]"
                    style={{ color: "#0D031B" }}
                  >
                    {user.name}
                  </span>
                  <span
                    className="text-[10px] mt-0.5"
                    style={{ color: "#9A94AA" }}
                  >
                    {roleLabels[user.role]}
                  </span>
                </div>

                <ChevronDown
                  className="h-3 w-3 hidden lg:block"
                  style={{ color: "#B8B2C8" }}
                />
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              className="w-56 rounded-xl border p-1.5"
              style={{
                borderColor: "#E2DCF0",
                background: "#FAFAF9",
                boxShadow:
                  "0 8px 32px rgba(13,3,27,0.1), 0 2px 8px rgba(13,3,27,0.06)",
              }}
            >
              {/* Identity block */}
              <div
                className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg mb-1"
                style={{ background: accent.bg }}
              >
                <Avatar className="h-9 w-9 shrink-0">
                  <AvatarFallback
                    className="text-xs"
                    style={{
                      background: "rgba(255,255,255,0.55)",
                      color: accent.text,
                    }}
                  >
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <p
                    className="text-[13px] truncate"
                    style={{ color: "#0D031B" }}
                  >
                    {user.name}
                  </p>
                  <p
                    className="text-[10px] truncate mt-0.5"
                    style={{ color: "#736C83" }}
                  >
                    {user.email}
                  </p>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span
                      className="w-1.5 h-1.5 rounded-full shrink-0"
                      style={{ background: accent.dot }}
                    />
                    <span
                      className="text-[9px] uppercase "
                      style={{ color: accent.text }}
                    >
                      {roleLabels[user.role]}
                    </span>
                  </div>
                </div>
              </div>

              <DropdownMenuSeparator style={{ background: "#EEEBF5" }} />

              <DropdownMenuItem
                className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] cursor-pointer hover:bg-[#F4F1FA] focus:bg-[#F4F1FA]"
                style={{ color: "#3D374C" }}
              >
                <span
                  className="flex items-center justify-center w-6 h-6 rounded-md"
                  style={{ background: "oklch(0.45 0.12 285 / 0.08)" }}
                >
                  <User
                    className="h-3.5 w-3.5"
                    style={{ color: "oklch(0.45 0.12 285)" }}
                  />
                </span>
                Profile
              </DropdownMenuItem>

              <DropdownMenuItem
                className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] cursor-pointer hover:bg-[#F4F1FA] focus:bg-[#F4F1FA]"
                style={{ color: "#3D374C" }}
                onClick={() => router.push("/settings")}
              >
                <span
                  className="flex items-center justify-center w-6 h-6 rounded-md"
                  style={{ background: "oklch(0.45 0.12 285 / 0.08)" }}
                >
                  <Settings
                    className="h-3.5 w-3.5"
                    style={{ color: "oklch(0.45 0.12 285)" }}
                  />
                </span>
                Settings
              </DropdownMenuItem>

              <DropdownMenuSeparator style={{ background: "#EEEBF5" }} />

              <DropdownMenuItem
                className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] cursor-pointer hover:bg-red-50 focus:bg-red-50 text-[#736C83] hover:text-red-600"
                onClick={handleLogout}
              >
                <span className="flex items-center justify-center w-6 h-6 rounded-md bg-red-50 group-hover:bg-red-100">
                  <LogOut className="h-3.5 w-3.5 text-red-400" />
                </span>
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
    </TooltipProvider>
  );
}
