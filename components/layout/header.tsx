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
import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { FAST_TRANSITION, SPRING_POP, SPRING_SNAPPY } from "@/lib/motion";
import { Button } from "@/components/ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
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
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemSeparator,
  ItemTitle,
} from "@/components/ui/item";
import { useAuth, type UserRole } from "@/lib/auth-context";
import { cn } from "@/lib/utils";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { toast } from "sonner";

const roleLabels: Record<UserRole, string> = {
  admin: "Administrator",
  manager: "Manager",
  waiter: "Waiter",
  kitchen: "Kitchen Staff",
  customer: "Customer",
  cleaner: "Cleaner",
  security: "Security",
};

const pageTitle: Record<string, { title: string; subtitle?: string }> = {
  "/admin/dashboard": { title: "Revenue & Insights", subtitle: "Executive performance overview" },
  "/admin/analytics": { title: "Business Analytics", subtitle: "Detailed data and trends" },
  "/admin/staff": { title: "Personnel Management", subtitle: "Manage your team and roles" },
  "/admin/inventory": { title: "Inventory Master", subtitle: "Complete stock control" },
  "/admin/menu": { title: "Grande Menu", subtitle: "Curate your offerings" },
  "/admin/payments": { title: "Financials", subtitle: "Transaction and billing history" },
  "/admin/reports": { title: "Executive Reports", subtitle: "Detailed business summaries" },
  "/admin/settings": { title: "System Settings", subtitle: "Branding and preferences" },
  "/manager/dashboard": { title: "Operations Hub", subtitle: "Real-time floor oversight" },
  "/manager/orders": { title: "Order Board", subtitle: "Manage and approve incoming orders" },
  "/manager/inventory": { title: "Stock Watch", subtitle: "Monitor and request supplies" },
  "/manager/staff": { title: "Staff Shift", subtitle: "Daily personnel oversight" },
  "/manager/reports": { title: "Daily Summaries", subtitle: "Operational performance reports" },
  "/manager/menu": { title: "Menu Management", subtitle: "Dish curation and availability" },
  "/manager/reservations": { title: "Reservations", subtitle: "Bookings and table allocation" },
  "/manager/expenses": { title: "Expenses", subtitle: "Daily operational costs" },
  "/manager/schedule": { title: "Shift Planning", subtitle: "Team roster and shifts" },
  "/waiter/dashboard": { title: "My Dashboard", subtitle: "Service overview & alerts" },
  "/waiter/service-floor": { title: "Service Floor", subtitle: "Floor plan and guest ordering" },
  "/waiter/menu": { title: "Service Menu", subtitle: "Live item availability" },
  "/waiter/order-tracking": { title: "Order Tracking", subtitle: "Real-time preparation status" },
  "/waiter/checkout": { title: "Settlement", subtitle: "Process payments and receipts" },
  "/kitchen/kds": { title: "Kitchen Display", subtitle: "Live preparation queue" },
  "/customer/qr-menu": { title: "Table QR Codes", subtitle: "Generate and download table menus" },
  "/customer": { title: "Digital Menu", subtitle: "Browse and order" },
};

const notifications = [
  {
    id: "1",
    icon: CubeIcon,
    iconColor: "text-warning bg-warning/10",
    title: "Low Stock Alert",
    body: "Potatoes running critically low",
    time: "2m ago",
    unread: true,
  },
  {
    id: "2",
    icon: ShoppingCartIcon,
    iconColor: "text-primary bg-primary/10",
    title: "New Order",
    body: "Table 3 placed a new order",
    time: "5m ago",
    unread: true,
  },
  {
    id: "3",
    icon: BoltIcon,
    iconColor: "text-success bg-success/10",
    title: "Order Ready",
    body: "Order #003 is ready to serve",
    time: "9m ago",
    unread: true,
  },
];

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

  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  const visibleNotifs = notifications.filter((n) => !dismissedNotifs.includes(n.id));
  const unreadCount = visibleNotifs.filter((n) => n.unread).length;

  return (
    <TooltipProvider delayDuration={300} skipDelayDuration={300}>
      <header className="sticky top-0 z-30 flex items-center h-14 px-4 lg:px-6 border-b bg-card/90 backdrop-blur-md border-border shadow-xs">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <SidebarTrigger className="-ml-1 size-9 rounded-lg hover:bg-muted text-muted-foreground transition-colors" />

          <Separator orientation="vertical" className="hidden lg:block h-5" />

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

        <div className="flex items-center gap-1.5 shrink-0">
          <div className="hidden md:flex items-center mr-1">
            <InputGroup className="h-8 w-44 focus-within:w-56 transition-[width,border-color,box-shadow] duration-200 ease-(--ease-out) bg-muted/40">
              <InputGroupAddon>
                <MagnifyingGlassIcon />
              </InputGroupAddon>
              <InputGroupInput type="search" placeholder="Search…" className="text-xs" />
            </InputGroup>
          </div>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon-sm"
                aria-label="Search"
                className="md:hidden text-muted-foreground"
                onClick={() => setSearchOpen((v) => !v)}
              >
                <MagnifyingGlassIcon className="size-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="text-xs">
              Search
            </TooltipContent>
          </Tooltip>

          <AnimatePresence>
            {searchOpen && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={FAST_TRANSITION}
                className="absolute top-14 left-0 right-0 z-40 md:hidden flex items-center gap-2 px-4 py-2.5 border-b bg-card/95 backdrop-blur-md"
              >
                <InputGroup className="flex-1 h-8">
                  <InputGroupAddon>
                    <MagnifyingGlassIcon />
                  </InputGroupAddon>
                  <InputGroupInput
                    autoFocus
                    type="search"
                    placeholder="Search tables, orders, staff…"
                    className="text-xs"
                  />
                </InputGroup>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => setSearchOpen(false)}
                  aria-label="Close search"
                >
                  <XMarkIcon className="size-4" />
                </Button>
              </motion.div>
            )}
          </AnimatePresence>

          <Separator orientation="vertical" className="h-5 mx-1 hidden sm:block" />

          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon-sm"
                aria-label="Notifications"
                className="relative text-muted-foreground"
              >
                <BellIcon className="size-4" />
                {unreadCount > 0 && (
                  <motion.span
                    key={unreadCount}
                    initial={{ scale: 0.85, opacity: 0.6 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={SPRING_POP}
                    className="absolute -top-1 -right-1"
                  >
                    <Badge className="h-4 min-w-4 px-1 text-[9px] bg-accent text-accent-foreground border-0">
                      {unreadCount}
                    </Badge>
                  </motion.span>
                )}
              </Button>
            </SheetTrigger>

            <SheetContent side="right" className="w-[300px] sm:w-[360px] p-0 bg-card">
              <SheetHeader className="px-5 py-4 border-b">
                <div className="flex items-center justify-between">
                  <SheetTitle className="flex items-center gap-2 text-sm font-semibold">
                    <BellIcon className="size-4 text-primary" />
                    Notifications
                    {unreadCount > 0 && (
                      <Badge variant="secondary" className="text-[10px]">
                        {unreadCount} new
                      </Badge>
                    )}
                  </SheetTitle>
                  {unreadCount > 0 && (
                    <Button
                      variant="ghost"
                      size="xs"
                      className="text-[10px] uppercase text-primary"
                      onClick={() => setDismissedNotifs(notifications.map((n) => n.id))}
                    >
                      Clear all
                    </Button>
                  )}
                </div>
              </SheetHeader>

              <ScrollArea className="h-[calc(100dvh-72px)] overscroll-contain">
                {visibleNotifs.length === 0 ? (
                  <Empty className="py-16">
                    <EmptyHeader>
                      <EmptyMedia variant="icon">
                        <BellIcon />
                      </EmptyMedia>
                      <EmptyTitle>You&apos;re all caught up</EmptyTitle>
                      <EmptyDescription>No new notifications</EmptyDescription>
                    </EmptyHeader>
                  </Empty>
                ) : (
                  <ItemGroup>
                    <AnimatePresence mode="popLayout" initial={false}>
                      {visibleNotifs.map((notif, idx) => {
                        const Icon = notif.icon;
                        return (
                          <motion.div
                            key={notif.id}
                            layout="position"
                            initial={{ opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, x: 16, scale: 0.96 }}
                            transition={SPRING_SNAPPY}
                          >
                            {idx > 0 && <ItemSeparator />}
                            <Item className="group rounded-none hover:bg-muted/40">
                              <ItemMedia variant="icon" className={notif.iconColor}>
                                <Icon className="size-4" />
                              </ItemMedia>
                              <ItemContent>
                                <ItemTitle>{notif.title}</ItemTitle>
                                <ItemDescription>{notif.body}</ItemDescription>
                                <span className="text-[10px] text-muted-foreground">{notif.time}</span>
                              </ItemContent>
                              <ItemActions>
                                <Button
                                  variant="ghost"
                                  size="icon-xs"
                                  aria-label="Dismiss"
                                  className="opacity-70 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-150"
                                  onClick={() => setDismissedNotifs((d) => [...d, notif.id])}
                                >
                                  <XMarkIcon className="size-3.5" />
                                </Button>
                              </ItemActions>
                            </Item>
                          </motion.div>
                        );
                      })}
                    </AnimatePresence>
                  </ItemGroup>
                )}
              </ScrollArea>
            </SheetContent>
          </Sheet>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="gap-2 pl-1.5 pr-2.5 h-8"
              >
                <Avatar className="size-6 shrink-0">
                  <AvatarFallback className="text-[10px] bg-primary/10 text-primary font-semibold">
                    {initials}
                  </AvatarFallback>
                </Avatar>

                <div className="hidden lg:flex flex-col items-start leading-none">
                  <span className="text-xs font-medium text-foreground">{user.name}</span>
                  <span className="text-[10px] text-muted-foreground">{roleLabels[user.role]}</span>
                </div>

                <ChevronDownIcon className="size-3 hidden lg:block text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-56 p-1.5">
              <div className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg bg-muted/50 mb-1">
                <Avatar className="size-9 shrink-0">
                  <AvatarFallback className="text-xs bg-primary/10 text-primary font-semibold">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-foreground truncate">{user.name}</p>
                  <p className="text-[11px] text-muted-foreground truncate">{user.email}</p>
                  <Badge variant="secondary" className="mt-1 text-[9px] uppercase">
                    {roleLabels[user.role]}
                  </Badge>
                </div>
              </div>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                className="gap-2.5 cursor-pointer"
                onClick={() =>
                  toast.info(`${user.name} (${roleLabels[user.role]})`, {
                    description: user.email,
                  })
                }
              >
                <UserIcon className="size-4 text-primary" />
                Profile
              </DropdownMenuItem>

              <DropdownMenuItem
                className="gap-2.5 cursor-pointer"
                onClick={() => {
                  if (user.role === "admin") {
                    router.push("/admin/settings");
                  } else {
                    toast.info("Settings are managed by the restaurant Admin");
                  }
                }}
              >
                <Cog6ToothIcon className="size-4 text-primary" />
                Settings
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                className={cn("gap-2.5 cursor-pointer text-destructive focus:text-destructive")}
                onClick={handleLogout}
              >
                <ArrowRightOnRectangleIcon className="size-4" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
    </TooltipProvider>
  );
}
