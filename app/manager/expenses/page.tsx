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
  ChartBarIcon
} from "@heroicons/react/24/outline"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
  { id: "EXP-8821", category: "Inventory", item: "Fresh Produce - Batch A", amount: 42500, date: "2026-04-03", status: "paid", method: "M-Pesa", priority: "high" },
  { id: "EXP-8822", category: "Utilities", item: "Electricity Bill (March)", amount: 12400, date: "2026-04-02", status: "pending", method: "Bank Transfer", priority: "medium" },
  { id: "EXP-8823", category: "Payroll", item: "Kitchen Staff (Weekly)", amount: 85000, date: "2026-04-02", status: "paid", method: "Direct Deposit", priority: "high" },
  { id: "EXP-8824", category: "Marketing", item: "Social Media Ads", amount: 5000, date: "2026-04-01", status: "paid", method: "Card", priority: "low" },
  { id: "EXP-8825", category: "Inventory", item: "Dry Goods Restock", amount: 28300, date: "2026-04-01", status: "paid", method: "M-Pesa", priority: "medium" },
  { id: "EXP-8826", category: "Maintenance", item: "Kitchen Equipment Repair", amount: 15600, date: "2026-03-31", status: "pending", method: "Bank Transfer", priority: "high" },
]

const budgetStats = [
  { label: "Daily Revenue", value: "142,500", icon: ArrowTrendingUpIcon, from: "#3F3D8F", to: "oklch(0.38 0.16 275)", delta: "+12%", trend: "up" },
  { label: "Daily Expenses", value: "89,400", icon: ArrowTrendingDownIcon, from: "#3F3D8F", to: "oklch(0.38 0.16 275)", delta: "-4%", trend: "down" },
  { label: "Net Profit", value: "53,100", icon: CurrencyDollarIcon, from: "#3F3D8F", to: "oklch(0.38 0.16 275)", delta: "+8%", trend: "up" },
]

const budgetCategories = [
  { label: "Inventory", val: 65, icon: ShoppingCartIcon, from: "#3F3D8F", to: "oklch(0.38 0.16 275)", amount: "KES 182,500" },
  { label: "Labor", val: 45, icon: UserGroupIcon, from: "#3F3D8F", to: "oklch(0.38 0.16 275)", amount: "KES 126,450" },
  { label: "Utilities", val: 15, icon: BoltIcon, from: "#3F3D8F", to: "oklch(0.38 0.16 275)", amount: "KES 42,150" },
  { label: "Misc", val: 10, icon: BanknotesIcon, from: "#3F3D8F", to: "oklch(0.38 0.16 275)", amount: "KES 28,100" },
]

export default function ManagerExpensesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")

  const filteredExpenses = mockExpenses.filter(exp => {
    const matchesSearch = exp.item.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         exp.category.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = filterStatus === "all" || exp.status === filterStatus
    return matchesSearch && matchesFilter
  })

  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(135deg, #F8F6FC 0%, #F0EBF8 50%, #E8E3F5 100%)" }}>
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 pb-24 space-y-6 sm:space-y-8">
        
        {/* ── Enhanced Header ────────────────────────────────────────────── */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 lg:gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-3 sm:gap-4">
              <div 
                className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center shadow-lg"
                style={{
                  background: "linear-gradient(135deg, #3F3D8F 0%, oklch(0.38 0.16 275) 100%)",
                }}
              >
                <ChartPieIcon className="h-6 w-6 sm:h-7 sm:w-7 text-white" strokeWidth={2.5} />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-normal leading-none" style={{ color: "#0D031B" }}>
                  Finance Hub
                </h1>
                <div className="flex items-center gap-2 mt-1.5">
                  <div className="h-px w-8 bg-gradient-to-r from-[#3F3D8F] to-transparent" />
                  <p className="text-[10px] sm:text-[11px] font-semibold uppercase" style={{ color: "#736C83" }}>
                    Expenditure Tracking & COGS Control
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex gap-3">
            <Button 
              variant="outline"
              className="h-11 sm:h-12 px-5 sm:px-6 gap-2 font-normal rounded-[14px] text-xs uppercase transition-all hover:scale-105 active:scale-95 border-2"
              style={{
                borderColor: "oklch(0.42 0.14 285 / 0.15)",
                color: "#736C83",
              }}
            >
              <CloudArrowDownIcon className="h-4 w-4" strokeWidth={2.5} />
              <span className="hidden sm:inline">Export</span>
            </Button>
            <Button 
              className="h-11 sm:h-12 px-5 sm:px-6 gap-2.5 text-white font-normal rounded-[14px] shadow-xl border-0 text-xs uppercase transition-all hover:-translate-y-0.5 hover:shadow-2xl active:translate-y-0 active:scale-95"
              style={{
                background: "linear-gradient(135deg, #3F3D8F 0%, oklch(0.38 0.16 275) 100%)",
                boxShadow: "0 8px 32px oklch(0.42 0.14 285 / 0.35)",
              }}
            >
              <PlusIcon className="h-4 w-4" strokeWidth={2.5} />
              Log Expense
            </Button>
          </div>
        </div>

        {/* ── Enhanced Budget Stats ───────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {budgetStats.map((s, i) => (
            <Card 
              key={i} 
              className="group border-0 bg-white rounded-[20px] shadow-md hover:shadow-2xl transition-all duration-500 overflow-hidden hover:-translate-y-1"
              style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.08)" }}
            >
              <CardContent className="p-5 sm:p-6 relative overflow-hidden">
                {/* Gradient background on hover */}
                <div 
                  className="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-500 bg-gradient-to-br"
                  style={{ background: `linear-gradient(135deg, ${s.from} 0%, ${s.to} 100%)` }}
                />
                
                <div className="flex items-start justify-between relative z-10">
                  <div className="flex items-start gap-3 sm:gap-4 flex-1">
                    <div 
                      className="w-10 h-10 sm:w-12 sm:h-12 rounded-[18px] flex items-center justify-center shrink-0 shadow-lg"
                      style={{ background: `linear-gradient(135deg, ${s.from} 0%, ${s.to} 100%)` }}
                    >
                      <s.icon className="h-5 w-5 sm:h-6 sm:w-6 text-white" strokeWidth={2.5} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] sm:text-[11px] font-normal uppercase mb-1.5" style={{ color: "#9A94AA" }}>
                        {s.label}
                      </p>
                      <p className="text-2xl sm:text-3xl font-normal leading-none tabular-nums" style={{ color: "#0D031B" }}>
                        <span className="text-lg sm:text-xl" style={{ color: "#736C83" }}>KES </span>
                        {s.value}
                      </p>
                    </div>
                  </div>

                  <div 
                    className={cn(
                      "flex items-center gap-1 text-[10px] font-normal uppercase px-2.5 py-1.5 rounded-xl border",
                      s.trend === "up" 
                        ? "bg-emerald-50 text-emerald-600 border-emerald-200" 
                        : "bg-rose-50 text-rose-600 border-rose-200"
                    )}
                  >
                    {s.trend === "up" ? (
                      <ArrowUpRightIcon className="h-3.5 w-3.5" strokeWidth={2.5} />
                    ) : (
                      <ArrowDownRightIcon className="h-3.5 w-3.5" strokeWidth={2.5} />
                    )}
                    {s.delta}
                  </div>
                </div>

                {/* Bottom accent line */}
                <div className="mt-4 pt-4 border-t relative z-10" style={{ borderColor: "oklch(0.42 0.14 285 / 0.08)" }}>
                  <p className="text-[10px] font-medium flex items-center gap-1.5" style={{ color: "#9A94AA" }}>
                    <ChartBarIcon className="h-3 w-3" />
                    vs. last period
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* ── Enhanced Transaction Ledger ────────────────────────────── */}
          <Card className="lg:col-span-2 border-0 bg-white rounded-[24px] shadow-xl overflow-hidden"
            style={{ boxShadow: "0 8px 32px rgba(0,0,0,0.08)" }}>
            
            {/* Enhanced Header */}
            <CardHeader className="px-5 sm:px-6 py-5 border-b" style={{ borderColor: "oklch(0.42 0.14 285 / 0.08)" }}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ background: "oklch(0.42 0.14 285 / 0.1)" }}
                  >
                    <DocumentTextIcon className="h-5 w-5" style={{ color: "#3F3D8F" }} strokeWidth={2.5} />
                  </div>
                  <div>
                    <CardTitle className="text-sm sm:text-base font-normal uppercase" style={{ color: "#0D031B" }}>
                      Transaction Ledger
                    </CardTitle>
                    <p className="text-[10px] font-medium mt-0.5" style={{ color: "#9A94AA" }}>
                      {filteredExpenses.length} transaction{filteredExpenses.length !== 1 ? 's' : ''} found
                    </p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <div className="relative flex-1 sm:flex-none sm:w-64">
                    <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: "oklch(0.42 0.14 285 / 0.4)" }} />
                    <Input
                      placeholder="Search transactions..."
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      className="pl-10 h-10 bg-white border-2 rounded-xl text-sm"
                      style={{
                        borderColor: "oklch(0.42 0.14 285 / 0.12)",
                        color: "#0D031B",
                      }}
                    />
                  </div>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="h-10 w-10 rounded-xl border-2 transition-all hover:scale-105 active:scale-95"
                        style={{
                          borderColor: "oklch(0.42 0.14 285 / 0.12)",
                          color: "#3F3D8F",
                        }}
                      >
                        <FunnelIcon className="h-4 w-4" strokeWidth={2.5} />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-white/98 backdrop-blur-xl border-0 rounded-2xl shadow-2xl w-48">
                      <DropdownMenuItem 
                        onClick={() => setFilterStatus("all")}
                        className="text-xs font-semibold rounded-xl m-1 focus:bg-oklch(0.42 0.14 285 / 0.08)"
                      >
                        All Status
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => setFilterStatus("paid")}
                        className="text-xs font-semibold rounded-xl m-1 focus:bg-oklch(0.42 0.14 285 / 0.08)"
                      >
                        Paid Only
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => setFilterStatus("pending")}
                        className="text-xs font-semibold rounded-xl m-1 focus:bg-oklch(0.42 0.14 285 / 0.08)"
                      >
                        Pending Only
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardHeader>

            {/* Enhanced Table */}
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead style={{ background: "oklch(0.42 0.14 285 / 0.03)" }}>
                    <tr className="text-[10px] font-normal uppercase" style={{ color: "#9A94AA" }}>
                      <th className="px-5 sm:px-6 py-4 whitespace-nowrap">Item / Category</th>
                      <th className="px-5 sm:px-6 py-4 whitespace-nowrap">Amount</th>
                      <th className="px-5 sm:px-6 py-4 whitespace-nowrap">Status</th>
                      <th className="px-5 sm:px-6 py-4 whitespace-nowrap">Method</th>
                      <th className="px-5 sm:px-6 py-4 text-right whitespace-nowrap">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y" style={{ borderColor: "oklch(0.42 0.14 285 / 0.05)" }}>
                    {filteredExpenses.map((exp) => (
                      <tr 
                        key={exp.id} 
                        className="group transition-all hover:bg-oklch(0.42 0.14 285 / 0.02)"
                      >
                        <td className="px-5 sm:px-6 py-4">
                          <div className="font-normal text-sm uppercase leading-tight" style={{ color: "#0D031B" }}>
                            {exp.item}
                          </div>
                          <div className="flex items-center gap-2 mt-1.5">
                            <Badge 
                              className="text-[9px] py-0 px-2 h-auto font-normal uppercase border"
                              style={{
                                background: "oklch(0.42 0.14 285 / 0.08)",
                                color: "#3F3D8F",
                                borderColor: "oklch(0.42 0.14 285 / 0.2)",
                              }}
                            >
                              {exp.category}
                            </Badge>
                            <span className="text-[9px] font-medium" style={{ color: "#C4BAD8" }}>
                              {exp.id}
                            </span>
                          </div>
                        </td>
                        <td className="px-5 sm:px-6 py-4">
                          <div className="font-normal text-sm tabular-nums" style={{ color: "#0D031B" }}>
                            KES {exp.amount.toLocaleString()}
                          </div>
                          <div className="flex items-center gap-1.5 text-[10px] font-medium mt-1" style={{ color: "#9A94AA" }}>
                            <CalendarIcon className="h-3 w-3" />
                            {exp.date}
                          </div>
                        </td>
                        <td className="px-5 sm:px-6 py-4">
                          <Badge 
                            className={cn(
                              "rounded-xl px-3 py-1.5 font-normal text-[10px] uppercase border-2 flex items-center gap-1.5 w-fit",
                              exp.status === "paid" 
                                ? "bg-emerald-50 text-emerald-600 border-emerald-200" 
                                : "bg-amber-50 text-amber-600 border-amber-200"
                            )}
                          >
                            {exp.status === "paid" ? (
                              <CheckCircleIcon className="h-3 w-3" strokeWidth={2.5} />
                            ) : (
                              <ClockIcon className="h-3 w-3" strokeWidth={2.5} />
                            )}
                            {exp.status}
                          </Badge>
                        </td>
                        <td className="px-5 sm:px-6 py-4">
                          <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase" style={{ color: "#9A94AA" }}>
                            <CreditCardIcon className="h-3 w-3" />
                            {exp.method}
                          </div>
                        </td>
                        <td className="px-5 sm:px-6 py-4 text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-9 w-9 rounded-xl transition-all hover:bg-oklch(0.42 0.14 285 / 0.08) active:scale-90"
                              >
                                <MoreVertical className="h-4 w-4" style={{ color: "#9A94AA" }} />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="bg-white/98 backdrop-blur-xl border-0 rounded-2xl shadow-2xl w-48">
                              <DropdownMenuItem className="text-xs font-semibold rounded-xl m-1 focus:bg-oklch(0.42 0.14 285 / 0.08)">
                                <Eye className="h-3.5 w-3.5 mr-2" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-xs font-semibold rounded-xl m-1 focus:bg-oklch(0.42 0.14 285 / 0.08)">
                                <Edit className="h-3.5 w-3.5 mr-2" />
                                Edit Transaction
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-xs font-semibold rounded-xl m-1 focus:bg-oklch(0.42 0.14 285 / 0.08)">
                                <Download className="h-3.5 w-3.5 mr-2" />
                                Download Receipt
                              </DropdownMenuItem>
                              <DropdownMenuSeparator className="my-1" style={{ background: "oklch(0.42 0.14 285 / 0.08)" }} />
                              <DropdownMenuItem className="text-xs font-semibold rounded-xl m-1 focus:bg-rose-50 text-rose-600">
                                <TrashIcon className="h-3.5 w-3.5 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Empty state */}
              {filteredExpenses.length === 0 && (
                <div className="flex flex-col items-center justify-center py-16 px-4">
                  <div 
                    className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
                    style={{ background: "oklch(0.42 0.14 285 / 0.08)" }}
                  >
                    <FileText className="h-8 w-8" style={{ color: "oklch(0.42 0.14 285 / 0.4)" }} />
                  </div>
                  <p className="text-sm font-normal uppercase" style={{ color: "#9A94AA" }}>
                    No transactions found
                  </p>
                  <p className="text-xs font-medium mt-1" style={{ color: "#C4BAD8" }}>
                    Try adjusting your search or filters
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* ── Enhanced Sidebar ───────────────────────────────────────── */}
          <div className="space-y-6">
            
            {/* Budget Allocation Card */}
            <Card 
              className="border-0 bg-white rounded-[24px] shadow-xl overflow-hidden"
              style={{ boxShadow: "0 8px 32px rgba(0,0,0,0.08)" }}
            >
              <CardHeader className="px-6 py-5 border-b" style={{ borderColor: "oklch(0.42 0.14 285 / 0.08)" }}>
                <div className="flex items-center gap-3">
                  <div 
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ background: "oklch(0.42 0.14 285 / 0.1)" }}
                  >
                    <CheckBadgeIcon className="h-5 w-5" style={{ color: "#3F3D8F" }} strokeWidth={2.5} />
                  </div>
                  <CardTitle className="text-sm font-normal uppercase" style={{ color: "#0D031B" }}>
                    Budget Allocation
                  </CardTitle>
                </div>
              </CardHeader>
              
              <CardContent className="p-6 space-y-5">
                {budgetCategories.map((item, i) => {
                  const Icon = item.icon
                  return (
                    <div key={i} className="space-y-3 group">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <div 
                            className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 shadow-md"
                            style={{ background: `linear-gradient(135deg, ${item.from} 0%, ${item.to} 100%)` }}
                          >
                            <Icon className="h-5 w-5 text-white" strokeWidth={2.5} />
                          </div>
                          <div>
                            <span className="text-xs font-normal uppercase block leading-none" style={{ color: "#0D031B" }}>
                              {item.label}
                            </span>
                            <span className="text-[10px] font-medium block mt-1" style={{ color: "#9A94AA" }}>
                              {item.amount}
                            </span>
                          </div>
                        </div>
                        <span className="text-sm font-medium tabular-nums" style={{ color: "#3F3D8F" }}>
                          {item.val}%
                        </span>
                      </div>
                      
                      <div className="h-2.5 rounded-full overflow-hidden" style={{ background: "oklch(0.42 0.14 285 / 0.08)" }}>
                        <div 
                          className="h-full rounded-full transition-all duration-1000"
                          style={{ 
                            width: `${item.val}%`,
                            background: `linear-gradient(to right, ${item.from}, ${item.to})`
                          }}
                        />
                      </div>
                    </div>
                  )
                })}
              </CardContent>
            </Card>

            {/* Enhanced Budget Warning Card */}
            <Card 
              className="border-0 rounded-[24px] shadow-2xl overflow-hidden relative"
              style={{
                background: "linear-gradient(135deg, #3F3D8F 0%, oklch(0.35 0.15 280) 100%)",
                boxShadow: "0 12px 40px oklch(0.42 0.14 285 / 0.4)",
              }}
            >
              {/* Decorative orbs */}
              <div className="absolute -top-12 -right-12 w-40 h-40 rounded-full opacity-10 blur-3xl bg-white" />
              <div className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full opacity-10 blur-2xl bg-white" />

              <CardContent className="p-6 relative z-10">
                <div className="flex items-start gap-3 mb-4">
                  <div 
                    className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg"
                    style={{ background: "rgba(255,255,255,0.15)", backdropFilter: "blur(10px)" }}
                  >
                    <ExclamationCircleIcon className="h-6 w-6 text-white" strokeWidth={2.5} />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-lg uppercase leading-tight text-white">
                      Budget Warning
                    </h4>
                    <p className="text-[10px] font-medium text-white/70 mt-1 uppercase">
                      Immediate Action Required
                    </p>
                  </div>
                </div>
                
                <div 
                  className="p-4 rounded-xl mb-4"
                  style={{ background: "rgba(255,255,255,0.1)", backdropFilter: "blur(10px)" }}
                >
                  <p className="text-xs leading-relaxed text-white/90">
                    Produce expenditure is <span className="font-medium text-white">12% over projection</span> for this week. 
                    Audit required for Batch A inventory to prevent further budget deviation.
                  </p>
                </div>

                <div className="flex gap-2">
                  <Button 
                    className="flex-1 h-11 border-2 border-white/30 bg-white/10 hover:bg-white/20 text-white font-medium rounded-xl text-xs uppercase transition-all hover:scale-105 active:scale-95 backdrop-blur-sm"
                  >
                    View Details
                  </Button>
                  <Button 
                    className="flex-1 h-11 bg-white text-purple-900 font-medium rounded-xl text-xs uppercase transition-all hover:scale-105 active:scale-95 shadow-lg"
                  >
                    Create Plan
                  </Button>
                </div>
              </CardContent>
            </Card>

          </div>
        </div>

      </div>
    </div>
  )
}