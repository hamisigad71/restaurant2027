"use client"

import { useState } from "react"
import { 
  Plus, 
  Search, 
  TrendingUp, 
  TrendingDown,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  PieChart,
  Filter,
  CheckCircle2,
  AlertCircle,
  MoreVertical,
  Banknote,
  ShoppingCart,
  Zap,
  Users
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"

const mockExpenses = [
  { id: "EXP-8821", category: "Inventory", item: "Fresh Produce - Batch A", amount: 42500, date: "2026-04-03", status: "paid", method: "M-Pesa" },
  { id: "EXP-8822", category: "Utilities", item: "Electricity Bill (March)", amount: 12400, date: "2026-04-02", status: "pending", method: "Bank Transfer" },
  { id: "EXP-8823", category: "Payroll", item: "Kitchen Staff (Weekly)", amount: 85000, date: "2026-04-02", status: "paid", method: "Direct Deposit" },
  { id: "EXP-8824", category: "Marketing", item: "Social Media Ads", amount: 5000, date: "2026-04-01", status: "paid", method: "Card" },
]

const budgetStats = [
  { label: "Daily Revenue", value: "KES 142,500", icon: TrendingUp, color: "oklch(0.7_0.15_150)", delta: "+12%" },
  { label: "Daily Expenses", value: "KES 89,400", icon: TrendingDown, color: "oklch(0.6_0.2_25)", delta: "-4%" },
  { label: "Net Profit", value: "KES 53,100", icon: DollarSign, color: "oklch(0.45_0.12_285)", delta: "+8%" },
]

export default function ManagerExpensesPage() {
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <div className="min-h-screen bg-[#FAFAF9] pb-20">
      <div className="max-w-7xl mx-auto px-[10px] pt-8 space-y-8">
        
        {/* ── Header ────────────────────────────────────────────── */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <h1 className="text-3xl font-heading  uppercase text-foreground leading-none">Finance Hub</h1>
            <div className="flex items-center gap-2 text-[10px] font-heading uppercase text-primary/60">
              <div className="w-8 h-[1px] bg-primary/20" />
              Expenditure Tracking & COGS Control
            </div>
          </div>
          <Button className="h-12 px-6 bg-primary text-white font-heading uppercase rounded-xl shadow-xl shadow-primary/20 hover:scale-105 transition-all border-none text-[11px] gap-3">
            <Plus className="h-4 w-4" /> Log Expense
          </Button>
        </div>

        {/* ── Budget Stats ───────────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {budgetStats.map((s, i) => (
            <Card key={i} className="border-none bg-white shadow-sm ring-1 ring-primary/5 rounded-2xl overflow-hidden group hover:shadow-md transition-all">
              <CardContent className="p-5 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div 
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: `${s.color}15`, color: s.color }}
                  >
                    <s.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xl font-heading  text-foreground leading-none tabular-nums">{s.value}</p>
                    <p className="text-[9px] font-heading uppercase text-muted-foreground mt-1">{s.label}</p>
                  </div>
                </div>
                <div className={cn(
                  "flex items-center gap-1 text-[9px]  uppercase font-heading px-2 py-1 rounded-lg",
                  s.delta.startsWith('+') ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
                )}>
                  {s.delta.startsWith('+') ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                  {s.delta}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* ── Recent Expenses Table ────────────────────────────── */}
          <Card className="lg:col-span-2 border-none bg-white shadow-xl shadow-primary/5 rounded-[2rem] overflow-hidden">
            <CardHeader className="px-6 py-5 border-b border-primary/5 flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-heading uppercase">Transaction Ledger</CardTitle>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" className="h-8 w-8 rounded-lg p-0 hover:bg-primary/5">
                  <Filter className="h-4 w-4 text-muted-foreground" />
                </Button>
                <Button variant="ghost" size="sm" className="h-8 w-8 rounded-lg p-0 hover:bg-primary/5">
                  <Search className="h-4 w-4 text-muted-foreground" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-primary/[0.02]">
                    <tr className="text-[10px] font-heading uppercase text-muted-foreground">
                      <th className="px-6 py-4">Item / Category</th>
                      <th className="px-6 py-4">Amount</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4">Method</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-primary/5">
                    {mockExpenses.map((exp) => (
                      <tr key={exp.id} className="group hover:bg-primary/[0.01] transition-colors">
                        <td className="px-6 py-4">
                          <div className="font-heading  text-sm uppercase text-foreground">{exp.item}</div>
                          <div className="text-[10px] text-muted-foreground font-medium uppercase mt-0.5">{exp.category}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-heading  text-sm text-foreground tabular-nums">KES {exp.amount.toLocaleString()}</div>
                          <div className="text-[9px] text-muted-foreground mt-0.5">{exp.date}</div>
                        </td>
                        <td className="px-6 py-4">
                          <Badge className={cn(
                            "rounded-full px-3 py-1 font-heading text-[9px] uppercase border-none",
                            exp.status === "paid" ? "bg-emerald-50 text-emerald-600" : "bg-orange-50 text-orange-600"
                          )}>
                            {exp.status}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 text-[10px] uppercase text-muted-foreground/70">
                          {exp.method}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* ── Expenditure Breakdown ───────────────────────────── */}
          <div className="space-y-6">
            <Card className="border-none bg-white shadow-xl shadow-primary/5 rounded-[2rem] overflow-hidden">
               <CardHeader className="px-6 py-5 border-b border-primary/5">
                <CardTitle className="text-sm font-heading uppercase ">Budget Allocation</CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                {[
                  { label: "Inventory", val: 65, icon: ShoppingCart, color: "text-blue-500", bg: "bg-blue-100" },
                  { label: "Labor", val: 45, icon: Users, color: "text-emerald-500", bg: "bg-emerald-100" },
                  { label: "Utilities", val: 15, icon: Zap, color: "text-amber-500", bg: "bg-amber-100" },
                  { label: "Misc", val: 10, icon: Banknote, color: "text-rose-500", bg: "bg-rose-100" },
                ].map((item, i) => (
                  <div key={i} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={cn("p-1.5 rounded-lg", item.bg)}>
                          <item.icon className={cn("h-3.5 w-3.5", item.color)} />
                        </div>
                        <span className="text-[10px] font-heading uppercase  text-foreground">{item.label}</span>
                      </div>
                      <span className="text-[10px]  font-sans tabular-nums text-primary">{item.val}%</span>
                    </div>
                    <Progress value={item.val} className="h-1.5 bg-primary/5" />
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="border-none bg-[oklch(0.45_0.12_285)] shadow-xl shadow-primary/20 rounded-[2rem] overflow-hidden p-6 text-white">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-xl bg-white/10">
                  <AlertCircle className="h-5 w-5" />
                </div>
                <h4 className="font-heading  text-lg  uppercase">Budget Warning</h4>
              </div>
              <p className="text-[10px] leading-relaxed text-white/70 uppercase  mb-4">
                Produce expenditure is 12% over projection for this week. Audit required for Batch A inventory.
              </p>
              <Button variant="outline" className="w-full h-11 border-white/20 bg-white/10 hover:bg-white/20 text-white font-heading uppercase  rounded-xl text-[10px]">
                Create Resolution Plan
              </Button>
            </Card>
          </div>
        </div>

      </div>
    </div>
  )
}
