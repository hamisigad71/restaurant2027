"use client"

import { useState } from "react"
import {
  PlusIcon,
  MagnifyingGlassIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  CurrencyDollarIcon,
  ArrowUpRightIcon,
  ArrowDownRightIcon,
  ChartPieIcon,
  FunnelIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  EllipsisHorizontalIcon,
  BanknotesIcon,
  ShoppingCartIcon,
  BoltIcon,
  UserGroupIcon,
  CloudArrowDownIcon,
  CalendarIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  DocumentTextIcon,
  ClockIcon,
  CreditCardIcon,
  CheckBadgeIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
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
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"

const mockExpenses = [
  { id: "EXP-8821", category: "Inventory", item: "Fresh Produce - Batch A", amount: 42500, date: "2026-04-03", status: "paid", method: "M-Pesa" },
  { id: "EXP-8822", category: "Utilities", item: "Electricity Bill (March)", amount: 12400, date: "2026-04-02", status: "pending", method: "Bank Transfer" },
  { id: "EXP-8823", category: "Payroll", item: "Kitchen Staff (Weekly)", amount: 85000, date: "2026-04-02", status: "paid", method: "Direct Deposit" },
  { id: "EXP-8824", category: "Marketing", item: "Social Media Ads", amount: 5000, date: "2026-04-01", status: "paid", method: "Card" },
  { id: "EXP-8825", category: "Inventory", item: "Dry Goods Restock", amount: 28300, date: "2026-04-01", status: "paid", method: "M-Pesa" },
  { id: "EXP-8826", category: "Maintenance", item: "Kitchen Equipment Repair", amount: 15600, date: "2026-03-31", status: "pending", method: "Bank Transfer" },
]

const budgetStats = [
  { label: "Daily Revenue", value: "142,500", icon: ArrowTrendingUpIcon, delta: "+12%", trend: "up" as const },
  { label: "Daily Expenses", value: "89,400", icon: ArrowTrendingDownIcon, delta: "-4%", trend: "down" as const },
  { label: "Net Profit", value: "53,100", icon: CurrencyDollarIcon, delta: "+8%", trend: "up" as const },
]

const budgetCategories = [
  { label: "Inventory", val: 65, icon: ShoppingCartIcon, amount: "KES 182,500" },
  { label: "Labor", val: 45, icon: UserGroupIcon, amount: "KES 126,450" },
  { label: "Utilities", val: 15, icon: BoltIcon, amount: "KES 42,150" },
  { label: "Misc", val: 10, icon: BanknotesIcon, amount: "KES 28,100" },
]

export default function ManagerExpensesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")

  const filteredExpenses = mockExpenses.filter((exp) => {
    const matchesSearch =
      exp.item.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exp.category.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = filterStatus === "all" || exp.status === filterStatus
    return matchesSearch && matchesFilter
  })

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-20 space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex size-12 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
              <ChartPieIcon className="size-6" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-semibold text-foreground leading-none">
                Finance Hub
              </h1>
              <p className="text-xs font-medium uppercase text-muted-foreground mt-1">
                Expenditure Tracking &amp; COGS Control
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" className="gap-2">
              <CloudArrowDownIcon className="size-4" />
              <span className="hidden sm:inline">Export</span>
            </Button>
            <Button className="gap-2">
              <PlusIcon className="size-4" />
              Log Expense
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {budgetStats.map((s) => (
            <Card key={s.label} size="sm">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                    <s.icon className="size-5" />
                  </div>
                  <div className="space-y-1">
                    <CardDescription className="text-xs uppercase">{s.label}</CardDescription>
                    <CardTitle className="text-2xl font-semibold tabular-nums">
                      KES {s.value}
                    </CardTitle>
                  </div>
                </div>
                <CardAction>
                  <Badge
                    variant="outline"
                    className={cn(
                      "gap-1",
                      s.trend === "up"
                        ? "border-success/30 bg-success/10 text-success"
                        : "border-destructive/30 bg-destructive/10 text-destructive",
                    )}
                  >
                    {s.trend === "up" ? (
                      <ArrowUpRightIcon className="size-3" />
                    ) : (
                      <ArrowDownRightIcon className="size-3" />
                    )}
                    {s.delta}
                  </Badge>
                </CardAction>
              </CardHeader>
              <CardFooter className="border-t text-xs text-muted-foreground gap-1.5">
                <ChartBarIcon className="size-3.5" />
                vs. last period
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 pb-0 overflow-hidden">
            <CardHeader className="border-b">
              <div className="flex items-center gap-3">
                <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <DocumentTextIcon className="size-5" />
                </div>
                <div className="space-y-1">
                  <CardTitle className="text-base">Transaction Ledger</CardTitle>
                  <CardDescription>
                    {filteredExpenses.length} transaction
                    {filteredExpenses.length !== 1 ? "s" : ""} found
                  </CardDescription>
                </div>
              </div>
              <CardAction className="flex items-center gap-2">
                <InputGroup className="w-48 sm:w-64">
                  <InputGroupAddon>
                    <MagnifyingGlassIcon />
                  </InputGroupAddon>
                  <InputGroupInput
                    placeholder="Search transactions..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </InputGroup>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon">
                      <FunnelIcon className="size-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-44">
                    <DropdownMenuItem onClick={() => setFilterStatus("all")}>
                      All Status
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setFilterStatus("paid")}>
                      Paid Only
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setFilterStatus("pending")}>
                      Pending Only
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardAction>
            </CardHeader>

            <CardContent className="p-0">
              {filteredExpenses.length === 0 ? (
                <Empty className="py-16">
                  <EmptyHeader>
                    <EmptyMedia variant="icon">
                      <DocumentTextIcon />
                    </EmptyMedia>
                    <EmptyTitle>No transactions found</EmptyTitle>
                    <EmptyDescription>Try adjusting your search or filters.</EmptyDescription>
                  </EmptyHeader>
                </Empty>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/30">
                      <TableHead className="px-6">Item / Category</TableHead>
                      <TableHead className="px-6">Amount</TableHead>
                      <TableHead className="px-6">Status</TableHead>
                      <TableHead className="px-6">Method</TableHead>
                      <TableHead className="px-6 text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredExpenses.map((exp) => (
                      <TableRow key={exp.id}>
                        <TableCell className="px-6">
                          <div className="font-medium text-foreground">{exp.item}</div>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="secondary" className="text-[10px] uppercase">
                              {exp.category}
                            </Badge>
                            <span className="text-[11px] text-muted-foreground">{exp.id}</span>
                          </div>
                        </TableCell>
                        <TableCell className="px-6">
                          <div className="font-medium tabular-nums">
                            KES {exp.amount.toLocaleString()}
                          </div>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                            <CalendarIcon className="size-3" />
                            {exp.date}
                          </div>
                        </TableCell>
                        <TableCell className="px-6">
                          <Badge
                            variant="outline"
                            className={cn(
                              "uppercase text-[10px]",
                              exp.status === "paid"
                                ? "bg-success/10 text-success border-success/20"
                                : "bg-warning/10 text-warning border-warning/20",
                            )}
                          >
                            {exp.status === "paid" ? <CheckCircleIcon /> : <ClockIcon />}
                            {exp.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="px-6">
                          <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                            <CreditCardIcon className="size-3.5" />
                            {exp.method}
                          </span>
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
                                <PencilIcon className="size-4" />
                                Edit Transaction
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <CloudArrowDownIcon className="size-4" />
                                Download Receipt
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-destructive">
                                <TrashIcon className="size-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card>
              <CardHeader className="border-b">
                <div className="flex items-center gap-2.5">
                  <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <CheckBadgeIcon className="size-5" />
                  </div>
                  <CardTitle className="text-base">Budget Allocation</CardTitle>
                </div>
              </CardHeader>

              <CardContent className="space-y-5">
                {budgetCategories.map((item) => {
                  const Icon = item.icon
                  return (
                    <div key={item.label} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <div className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                            <Icon className="size-4" />
                          </div>
                          <div>
                            <p className="text-xs font-semibold uppercase leading-none">
                              {item.label}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">{item.amount}</p>
                          </div>
                        </div>
                        <span className="text-sm font-semibold tabular-nums text-primary">
                          {item.val}%
                        </span>
                      </div>
                      <Progress value={item.val} className="h-2" />
                    </div>
                  )
                })}
              </CardContent>
            </Card>

            <Card className="bg-primary text-primary-foreground border-primary">
              <CardHeader>
                <div className="flex items-start gap-3">
                  <div className="flex size-10 items-center justify-center rounded-xl bg-primary-foreground/15 shrink-0">
                    <ExclamationCircleIcon className="size-5" />
                  </div>
                  <div className="space-y-1">
                    <CardTitle>Budget Warning</CardTitle>
                    <CardDescription className="text-primary-foreground/75 text-xs uppercase">
                      Immediate Action Required
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="p-3.5 rounded-lg bg-primary-foreground/10 text-xs leading-relaxed">
                  Produce expenditure is <span className="font-semibold">12% over projection</span>{" "}
                  for this week. Audit required for Batch A inventory to prevent further budget
                  deviation.
                </div>
              </CardContent>
              <CardFooter className="gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 bg-transparent border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/15 hover:text-primary-foreground"
                >
                  View Details
                </Button>
                <Button variant="secondary" size="sm" className="flex-1">
                  Create Plan
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
