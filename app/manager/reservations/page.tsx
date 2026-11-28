"use client"

import { useState } from "react"
import {
  PlusIcon,
  MagnifyingGlassIcon,
  CalendarIcon,
  ClockIcon,
  UserGroupIcon,
  FunnelIcon,
  EllipsisHorizontalIcon,
  PencilIcon,
  CheckCircleIcon,
  EyeIcon,
  StarIcon,
  ChartBarIcon,
  ExclamationCircleIcon,
  TableCellsIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { Separator } from "@/components/ui/separator"

const mockReservations = [
  { id: "RES-001", guest: "Amanda Chen", partySize: 4, date: "2026-04-03", time: "19:30", status: "confirmed", table: "12", notes: "Anniversary celebration", vip: true },
  { id: "RES-002", guest: "David Smith", partySize: 2, date: "2026-04-03", time: "20:00", status: "confirmed", table: "5", notes: "Window seat preferred", vip: false },
  { id: "RES-003", guest: "Sarah Johnson", partySize: 6, date: "2026-04-03", time: "18:45", status: "pending", table: null, notes: "Needs high chair", vip: false },
  { id: "RES-004", guest: "Michael Ross", partySize: 1, date: "2026-04-03", time: "21:15", status: "confirmed", table: "Bar 2", notes: "", vip: false },
  { id: "RES-005", guest: "Emily Watson", partySize: 8, date: "2026-04-03", time: "19:00", status: "confirmed", table: "15", notes: "Corporate dinner", vip: true },
  { id: "RES-006", guest: "James Brown", partySize: 3, date: "2026-04-03", time: "20:30", status: "pending", table: null, notes: "Birthday party", vip: false },
]

const stats = [
  { label: "Today's Bookings", value: "18", icon: CalendarIcon, change: "+12%" },
  { label: "Total Guests", value: "54", icon: UserGroupIcon, change: "+8%" },
  { label: "Pending Requests", value: "4", icon: ClockIcon, change: "+2" },
  { label: "VIP Arrivals", value: "2", icon: StarIcon, change: "Today" },
]

export default function ManagerReservationsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")

  const filteredReservations = mockReservations.filter((res) => {
    const matchesSearch =
      res.guest.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.id.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = filterStatus === "all" || res.status === filterStatus
    return matchesSearch && matchesFilter
  })

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-20 space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex size-12 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
              <CalendarIcon className="size-6" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-semibold text-foreground leading-none">
                Reservations
              </h1>
              <p className="text-xs font-medium uppercase text-muted-foreground mt-1">
                Guest Booking &amp; Table Management
              </p>
            </div>
          </div>

          <Button className="gap-2">
            <PlusIcon className="size-4" />
            New Booking
          </Button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((s) => (
            <Card key={s.label} size="sm">
              <CardHeader>
                <div className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground mb-1">
                  <s.icon className="size-4" />
                </div>
                <CardDescription className="text-xs uppercase">{s.label}</CardDescription>
                <CardAction>
                  <Badge variant="secondary">{s.change}</Badge>
                </CardAction>
              </CardHeader>
              <CardContent className="space-y-2">
                <CardTitle className="text-2xl sm:text-3xl font-semibold tabular-nums">
                  {s.value}
                </CardTitle>
                <p className="text-xs text-muted-foreground flex items-center gap-1.5 pt-2 border-t">
                  <ChartBarIcon className="size-3.5" />
                  vs. yesterday
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card size="sm">
          <CardContent className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
            <InputGroup className="flex-1">
              <InputGroupAddon>
                <MagnifyingGlassIcon />
              </InputGroupAddon>
              <InputGroupInput
                placeholder="Search by guest name or ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </InputGroup>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <FunnelIcon className="size-4" />
                  <span className="hidden sm:inline">Filter</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-44">
                <DropdownMenuItem onClick={() => setFilterStatus("all")}>
                  All Reservations
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterStatus("confirmed")}>
                  Confirmed Only
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterStatus("pending")}>
                  Pending Only
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </CardContent>
        </Card>

        <Card className="pb-0 overflow-hidden">
          <CardHeader className="border-b">
            <div className="flex items-center gap-3">
              <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <UserGroupIcon className="size-5" />
              </div>
              <div className="space-y-1">
                <CardTitle className="text-base">Scheduled Guests</CardTitle>
                <CardDescription>
                  {filteredReservations.length} reservation
                  {filteredReservations.length !== 1 ? "s" : ""} found
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            {filteredReservations.length === 0 ? (
              <Empty className="py-16">
                <EmptyHeader>
                  <EmptyMedia variant="icon">
                    <CalendarIcon />
                  </EmptyMedia>
                  <EmptyTitle>No reservations found</EmptyTitle>
                  <EmptyDescription>Try adjusting your search or filter.</EmptyDescription>
                </EmptyHeader>
              </Empty>
            ) : (
              <>
                <div className="hidden lg:block">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/30">
                        <TableHead className="px-6">Guest Details</TableHead>
                        <TableHead className="px-6">Party Size</TableHead>
                        <TableHead className="px-6">Date &amp; Time</TableHead>
                        <TableHead className="px-6">Table</TableHead>
                        <TableHead className="px-6">Status</TableHead>
                        <TableHead className="px-6 text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredReservations.map((res) => (
                        <TableRow key={res.id}>
                          <TableCell className="px-6">
                            <div className="flex items-center gap-2 font-medium">
                              <span>{res.guest}</span>
                              {res.vip && (
                                <StarIcon className="size-3.5 fill-warning text-warning" />
                              )}
                            </div>
                            <div className="text-xs text-muted-foreground">{res.id}</div>
                          </TableCell>
                          <TableCell className="px-6">
                            <span className="inline-flex items-center gap-1.5 text-xs font-medium">
                              <UserGroupIcon className="size-3.5 text-primary" />
                              {res.partySize} guests
                            </span>
                          </TableCell>
                          <TableCell className="px-6">
                            <div className="inline-flex items-center gap-1.5 text-xs font-medium">
                              <ClockIcon className="size-3.5 text-primary" />
                              {res.time}
                            </div>
                            <div className="text-xs text-muted-foreground">{res.date}</div>
                          </TableCell>
                          <TableCell className="px-6">
                            {res.table ? (
                              <Badge variant="secondary" className="gap-1">
                                <TableCellsIcon className="size-3" />
                                Table {res.table}
                              </Badge>
                            ) : (
                              <Badge
                                variant="outline"
                                className="gap-1 bg-warning/10 text-warning border-warning/20"
                              >
                                <ExclamationCircleIcon className="size-3" />
                                Unassigned
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell className="px-6">
                            <Badge
                              variant="outline"
                              className={cn(
                                "uppercase text-[10px]",
                                res.status === "confirmed"
                                  ? "bg-success/10 text-success border-success/20"
                                  : "bg-warning/10 text-warning border-warning/20",
                              )}
                            >
                              {res.status === "confirmed" ? <CheckCircleIcon /> : <ClockIcon />}
                              {res.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="px-6 text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon-sm">
                                  <EllipsisHorizontalIcon className="size-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-48">
                                <DropdownMenuItem>
                                  <EyeIcon className="size-4" />
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <CheckCircleIcon className="size-4" />
                                  Confirm Arrival
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <TableCellsIcon className="size-4" />
                                  Assign Table
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <PencilIcon className="size-4" />
                                  Edit Booking
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-destructive">
                                  <XMarkIcon className="size-4" />
                                  Cancel Booking
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                <div className="lg:hidden space-y-3 p-4">
                  {filteredReservations.map((res) => (
                    <Card key={res.id} size="sm">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-sm">
                          <span>{res.guest}</span>
                          {res.vip && <StarIcon className="size-3.5 fill-warning text-warning" />}
                        </CardTitle>
                        <CardDescription className="text-xs">{res.id}</CardDescription>
                        <CardAction>
                          <Badge
                            variant="outline"
                            className={cn(
                              "uppercase text-[10px]",
                              res.status === "confirmed"
                                ? "bg-success/10 text-success border-success/20"
                                : "bg-warning/10 text-warning border-warning/20",
                            )}
                          >
                            {res.status}
                          </Badge>
                        </CardAction>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <Separator />
                        <div className="grid grid-cols-2 gap-3 text-xs font-medium">
                          <div className="flex items-center gap-1.5">
                            <UserGroupIcon className="size-3.5 text-primary" />
                            <span>{res.partySize} guests</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <ClockIcon className="size-3.5 text-primary" />
                            <span>{res.time}</span>
                          </div>
                        </div>

                        {res.table ? (
                          <Badge variant="secondary" className="gap-1">
                            <TableCellsIcon className="size-3" />
                            Table {res.table}
                          </Badge>
                        ) : (
                          <Badge
                            variant="outline"
                            className="gap-1 bg-warning/10 text-warning border-warning/20"
                          >
                            <ExclamationCircleIcon className="size-3" />
                            Unassigned
                          </Badge>
                        )}

                        <div className="flex gap-2 pt-1">
                          <Button size="sm" className="flex-1">
                            <CheckCircleIcon className="size-3.5" />
                            Confirm
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="outline" size="icon-sm">
                                <EllipsisHorizontalIcon className="size-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-44">
                              <DropdownMenuItem>
                                <EyeIcon className="size-4" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <TableCellsIcon className="size-4" />
                                Assign Table
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <PencilIcon className="size-4" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-destructive">
                                <XMarkIcon className="size-4" />
                                Cancel
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Card className="bg-success text-success-foreground border-success">
            <CardHeader>
              <div className="flex items-start gap-4">
                <div className="flex size-12 items-center justify-center rounded-xl bg-success-foreground/15 shrink-0">
                  <CheckCircleIcon className="size-6" />
                </div>
                <div className="space-y-1">
                  <CardTitle className="text-lg">Evening Rush Readiness</CardTitle>
                  <CardDescription className="text-success-foreground/85 text-xs leading-relaxed">
                    Floor setup is optimized for the 19:00 - 21:00 peak period. All stations prepared.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>

          <Card className="bg-primary text-primary-foreground border-primary">
            <CardHeader>
              <div className="flex items-start gap-4">
                <div className="flex size-12 items-center justify-center rounded-xl bg-primary-foreground/15 shrink-0">
                  <StarIcon className="size-6 fill-current" />
                </div>
                <div className="space-y-1">
                  <CardTitle className="text-lg">VIP Alert</CardTitle>
                  <CardDescription className="text-primary-foreground/80 text-xs leading-relaxed">
                    2 VIP tables arriving in the next hour. Premium service ready.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>
        </div>
      </div>
    </div>
  )
}
