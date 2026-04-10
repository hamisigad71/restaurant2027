"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  Search, 
  Package, 
  ArrowUpRight,
  TrendingDown,
  AlertTriangle,
  History
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

const mockInventory = [
  { item: "Filet Mignon", stock: 12, unit: "kg", status: "low", price: 2500 },
  { item: "Atlantic Salmon", stock: 8, unit: "kg", status: "low", price: 1800 },
  { item: "Basmati Rice", stock: 45, unit: "kg", status: "good", price: 200 },
  { item: "Potatoes", stock: 110, unit: "kg", status: "good", price: 80 },
  { item: "Red Wine", stock: 24, unit: "bottles", status: "good", price: 3500 },
]

export default function ManagerInventoryPage() {
  return (
    <div className="flex flex-col">
      <div className="flex-1 py-4 px-0 space-y-6">
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          <Card className="group relative overflow-hidden bg-card border-border/50 p-5 shadow-sm transition-all hover:shadow-xl hover:shadow-destructive/5 hover:-translate-y-1">
            <div className="absolute inset-0 bg-gradient-to-br from-destructive/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative z-10 flex items-center justify-between">
              <div>
                <p className="text-[10px] uppercase text-muted-foreground mb-1">Items at risk</p>
                <p className="text-3xl font-heading  text-destructive">8</p>
              </div>
              <div className="p-3.5 rounded-2xl bg-destructive/10 text-destructive group-hover:scale-110 transition-transform">
                <AlertTriangle className="h-6 w-6" />
              </div>
            </div>
            <div className="absolute bottom-0 left-0 w-full h-[2px] bg-destructive/20 scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
          </Card>

          <Card className="group relative overflow-hidden bg-card border-border/50 p-5 shadow-sm transition-all hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative z-10 flex items-center justify-between">
              <div>
                <p className="text-[10px] uppercase text-muted-foreground mb-1">Pending Requests</p>
                <p className="text-3xl font-heading  text-primary">3</p>
              </div>
              <div className="p-3.5 rounded-2xl bg-primary/10 text-primary group-hover:scale-110 transition-transform">
                <History className="h-6 w-6" />
              </div>
            </div>
            <div className="absolute bottom-0 left-0 w-full h-[2px] bg-primary/20 scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
          </Card>

          <Card className="group relative overflow-hidden bg-card border-border/50 p-5 shadow-sm transition-all hover:shadow-xl hover:-translate-y-1">
            <div className="relative z-10 flex items-center justify-between">
              <div>
                <p className="text-[10px] uppercase text-muted-foreground mb-1">Total SKU</p>
                <p className="text-3xl font-heading  text-foreground">142</p>
              </div>
              <div className="p-3.5 rounded-2xl bg-muted text-muted-foreground group-hover:scale-110 transition-transform">
                <Package className="h-6 w-6" />
              </div>
            </div>
          </Card>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between pt-2">
          <div className="relative w-full sm:w-96 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-primary/40 group-focus-within:text-primary transition-colors" />
            <Input placeholder="Search inventory catalog..." className="pl-11 bg-card border-border/50 h-12 rounded-xl focus-visible:ring-primary/20" />
          </div>
          <Button className="w-full sm:w-auto h-12 px-6 gap-2 bg-primary text-white font-heading uppercase rounded-xl shadow-lg shadow-primary/20 hover:opacity-90">
            <ArrowUpRight className="h-4 w-4" />
            Request Resupply
          </Button>
        </div>

        <Card className="border-border/50 bg-card overflow-hidden rounded-2xl shadow-sm">
          <CardHeader className="pb-4 border-b border-border/50 bg-muted/20">
            <CardTitle className="text-[10px] font-heading  uppercase text-muted-foreground">Operational Stock List</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left border-collapse">
                <thead className="bg-muted/50 text-[10px] uppercase text-muted-foreground ">
                  <tr>
                    <th className="px-6 py-5">Item Identifier</th>
                    <th className="px-6 py-5">Volume</th>
                    <th className="px-6 py-5">Value (Unit)</th>
                    <th className="px-6 py-5">Status</th>
                    <th className="px-6 py-5 text-right">Operations</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/30">
                  {mockInventory.map((item, idx) => (
                    <tr key={item.item} className={cn(
                      "transition-colors hover:bg-primary/[0.02] group",
                      idx % 2 === 1 ? "bg-muted/5" : "bg-transparent"
                    )}>
                      <td className="px-6 py-4 font-heading text-base  text-foreground uppercase">{item.item}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className={cn(
                            "text-sm ",
                            item.status === "low" ? "text-destructive" : "text-foreground"
                          )}>
                            {item.stock} {item.unit}
                          </span>
                          {item.status === "low" && <TrendingDown className="h-3 w-3 text-destructive animate-pulse" />}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-xs font-heading text-muted-foreground">KES {item.price.toLocaleString()}</td>
                      <td className="px-6 py-4">
                        <Badge 
                          variant="outline" 
                          className={cn(
                            "text-[8px]  uppercase px-2.5 py-0.5 border-none",
                            item.status === "good" ? "bg-success/10 text-success" : "bg-warning/10 text-warning"
                          )}
                        >
                          {item.status === "low" ? "Critically Low" : "In Stock"}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Button variant="ghost" size="sm" className="h-8 text-[10px]  font-heading uppercase text-primary hover:bg-primary/10">
                          Order More
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
