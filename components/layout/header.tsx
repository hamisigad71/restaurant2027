"use client";

import {
  BellIcon,
  MagnifyingGlassIcon,
  Cog6ToothIcon,
  UserIcon,
  ArrowRightOnRectangleIcon,
  CubeIcon,
  ShoppingCartIcon,
  BoltIcon,
  XMarkIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";
import {
  BellIcon as BellIconSolid,
  MagnifyingGlassIcon as MagnifyingGlassIconSolid,
  UserIcon as UserIconSolid,
  BoltIcon as BoltIconSolid,
} from "@heroicons/react/24/solid";
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
    bg: "rgba(11, 59, 54,  0.08)",
    text: "#0B3B36",
    dot: "#0B3B36",
    avatarBg: "rgba(11, 59, 54,  0.1)",
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
    icon: CubeIcon,
    iconColor: "oklch(0.55 0.15 75)",
    iconBg: "oklch(0.75 0.15 75 / 0.1)",
    title: "Low Stock Alert",
    body: "Potatoes running critically low",
    time: "2m ago",
    unread: true,
  },
  {
    id: "2",
    icon: ShoppingCartIcon,
    iconColor: "#0B3B36",
    iconBg: "rgba(11,59,54,0.08)",
    title: "New Order",
    body: "Table 3 placed a new order",
    time: "5m ago",
    unread: true,
  },
  {
    id: "3",
    icon: BoltIcon,
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
        className="sticky top-0 z-30 flex items-center h-14 px-4 lg:px-6 border-b bg-card/90 backdrop-blur-md border-border/60 shadow-xs"
      >
        {/* ── Left: spacer + page title ───────────────────────── */}
        <div className="flex items-center gap-3 min-w-0 flex-1">
          {/* Sidebar Toggle */}
          <SidebarTrigger className="-ml-1 h-9 w-9 rounded-xl hover:bg-muted text-muted-foreground transition-colors" />

          {/* Thin vertical rule */}
          <div className="hidden lg:block h-5 w-px bg-border shrink-0" />

          <div className="min-w-0">
            <h1 className="text-[15px] font-semibold text-foreground leading-none truncate">
              {currentPage.title}
            </h1>
            {currentPage.subtitle && (
              <p className="text-[10px] uppercase font-medium mt-1 hidden sm:block truncate text-muted-foreground">
                {currentPage.subtitle}
              </p>
            )}
          </div>
        </div>

        {/* ── Right: actions ──────────────────────────────────── */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* Search — desktop */}
          <div className="hidden md:flex items-center relative mr-1">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 pointer-events-none text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search…"
              className={cn(
                "h-8 pl-8 pr-3 text-[13px] rounded-lg border",
                "bg-muted/50 border-border/50 placeholder:text-muted-foreground/70",
                "focus:bg-card focus:border-primary/50",
                "focus:ring-1 focus:ring-primary/20",
                "transition-all duration-200 w-44 focus:w-56 text-foreground",
              )}
            />
          </div>

          {/* Search toggle — mobile */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Search"
                className="md:hidden h-8 w-8 rounded-lg hover:bg-[#F4FAF7] transition-colors"
                style={{ color: "#4B6E67" }}
                onClick={() => setSearchOpen((v) => !v)}
              >
                <MagnifyingGlassIcon className="h-4 w-4" />
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
                borderColor: "#D8E7E1",
              }}
            >
              <div className="relative flex-1">
                <MagnifyingGlassIcon
                  className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 pointer-events-none"
                  style={{ color: "#8FAEA7" }}
                />
                <Input
                  autoFocus
                  type="search"
                  placeholder="Search tables, orders, staff…"
                  className="w-full h-8 pl-8 pr-8 text-[13px] rounded-lg border bg-[#EBF6F1] border-transparent focus:bg-white focus:border-[#0B3B36/0.3]"
                  style={{ color: "#082420" }}
                />
              </div>
              <button
                onClick={() => setSearchOpen(false)}
                className="flex items-center justify-center h-7 w-7 rounded-md hover:bg-[#F4FAF7] shrink-0"
                style={{ color: "#4B6E67" }}
                aria-label="Close search"
              >
                <XMarkIcon className="h-3.5 w-3.5" />
              </button>
            </div>
          )}

          {/* Thin divider */}
          <div className="h-5 w-px bg-[#D8E7E1] mx-1 hidden sm:block" />

          {/* ── Notifications ─────────────────────────────────── */}
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Notifications"
                className="relative h-8 w-8 rounded-lg hover:bg-muted text-muted-foreground transition-colors"
              >
                <BellIcon className="h-4 w-4" />
                {unreadCount > 0 && (
                  <span
                    className="absolute -top-0.5 -right-0.5 flex items-center justify-center rounded-full text-[9px] font-bold text-foreground bg-accent leading-none"
                    style={{
                      minWidth: "16px",
                      height: "16px",
                      padding: "0 3px",
                      boxShadow: "0 2px 6px rgba(122, 231, 42, 0.4)",
                    }}
                  >
                    {unreadCount}
                  </span>
                )}
              </Button>
            </SheetTrigger>

            <SheetContent
              side="right"
              className="w-[300px] sm:w-[360px] p-0 border-border bg-card"
            >
              <SheetHeader
                className="px-5 py-4 border-b border-border/60"
              >
                <div className="flex items-center justify-between">
                  <SheetTitle
                    className="flex items-center gap-2 text-[13px] text-foreground font-semibold"
                  >
                    <BellIcon className="h-3.5 w-3.5 text-primary" />
                    Notifications
                    {unreadCount > 0 && (
                      <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-accent/20 text-foreground font-bold">
                        {unreadCount} new
                      </span>
                    )}
                  </SheetTitle>
                  {unreadCount > 0 && (
                    <button
                      className="text-[10px] font-medium uppercase text-primary hover:opacity-75 transition-opacity"
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
                      <BellIcon
                        className="h-5 w-5"
                        style={{ color: "oklch(0.42 0.14 150)" }}
                      />
                    </div>
                    <p
                      className="text-[13px]"
                      style={{ color: "#133D38" }}
                    >
                      You're all caught up
                    </p>
                    <p className="text-xs" style={{ color: "#628C84" }}>
                      No new notifications
                    </p>
                  </div>
                ) : (
                  <div style={{ borderColor: "#E4EFEA" }} className="divide-y">
                    {visibleNotifs.map((notif) => {
                      const Icon = notif.icon;
                      return (
                        <div
                          key={notif.id}
                          className="group relative flex items-start gap-3 px-5 py-4 transition-colors hover:bg-[#EBF6F1]"
                        >
                          {notif.unread && (
                            <span
                              className="absolute left-1.5 top-[22px] w-1.5 h-1.5 rounded-full"
                              style={{ background: "#0B3B36" }}
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
                              style={{ color: "#082420" }}
                            >
                              {notif.title}
                            </p>
                            <p
                              className="text-xs mt-0.5"
                              style={{ color: "#4B6E67" }}
                            >
                              {notif.body}
                            </p>
                            <p
                              className="text-[10px] mt-1 font-medium"
                              style={{ color: "#8FAEA7" }}
                            >
                              {notif.time}
                            </p>
                          </div>

                          <button
                            aria-label="Dismiss"
                            className="opacity-0 group-hover:opacity-100 flex items-center justify-center w-5 h-5 rounded-md shrink-0 mt-0.5 transition-all hover:bg-[#D8E7E1]"
                            style={{ color: "#628C84" }}
                            onClick={() =>
                              setDismissedNotifs((d) => [...d, notif.id])
                            }
                          >
                            <XMarkIcon className="h-3 w-3" />
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
                  "hover:bg-[#F4FAF7] hover:border-[#D8E7E1]",
                  "focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0B3B36/0.4]",
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
                    style={{ color: "#082420" }}
                  >
                    {user.name}
                  </span>
                  <span
                    className="text-[10px] mt-0.5"
                    style={{ color: "#628C84" }}
                  >
                    {roleLabels[user.role]}
                  </span>
                </div>

                <ChevronDownIcon
                  className="h-3 w-3 hidden lg:block"
                  style={{ color: "#8FAEA7" }}
                />
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              className="w-56 rounded-xl border p-1.5"
              style={{
                borderColor: "#D8E7E1",
                background: "#FFFFFF",
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
                    style={{ color: "#082420" }}
                  >
                    {user.name}
                  </p>
                  <p
                    className="text-[10px] truncate mt-0.5"
                    style={{ color: "#4B6E67" }}
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

              <DropdownMenuSeparator style={{ background: "#E4EFEA" }} />

              <DropdownMenuItem
                className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] cursor-pointer hover:bg-[#EBF6F1] focus:bg-[#EBF6F1]"
                style={{ color: "#133D38" }}
              >
                <span
                  className="flex items-center justify-center w-6 h-6 rounded-md"
                  style={{ background: "rgba(11, 59, 54,  0.08)" }}
                >
                  <UserIcon
                    className="h-3.5 w-3.5"
                    style={{ color: "#0B3B36" }}
                  />
                </span>
                Profile
              </DropdownMenuItem>

              <DropdownMenuItem
                className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] cursor-pointer hover:bg-[#EBF6F1] focus:bg-[#EBF6F1]"
                style={{ color: "#133D38" }}
                onClick={() => router.push("/settings")}
              >
                <span
                  className="flex items-center justify-center w-6 h-6 rounded-md"
                  style={{ background: "rgba(11, 59, 54,  0.08)" }}
                >
                  <Cog6ToothIcon
                    className="h-3.5 w-3.5"
                    style={{ color: "#0B3B36" }}
                  />
                </span>
                Settings
              </DropdownMenuItem>

              <DropdownMenuSeparator style={{ background: "#E4EFEA" }} />

              <DropdownMenuItem
                className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] cursor-pointer hover:bg-red-50 focus:bg-red-50 text-[#4B6E67] hover:text-red-600"
                onClick={handleLogout}
              >
                <span className="flex items-center justify-center w-6 h-6 rounded-md bg-red-50 group-hover:bg-red-100">
                  <ArrowRightOnRectangleIcon className="h-3.5 w-3.5 text-red-400" />
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
