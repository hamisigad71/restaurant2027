"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { User, Shield, Briefcase } from "lucide-react"

const staffOnDuty = [
  { id: "1", name: "John Doe", role: "waiter", status: "Active", tables: [4, 5, 6] },
  { id: "2", name: "Chef Pierre", role: "kitchen", status: "Cooking", orders: 3 },
  { id: "3", name: "Elena R.", role: "waiter", status: "Break", tables: [] },
  { id: "4", name: "Marco S.", role: "kitchen", status: "Active", orders: 1 },
]

export function StaffOnDuty() {
  return (
    <Card className="bg-card border-border/50 shadow-sm relative overflow-hidden">
      <div className="absolute top-0 right-0 w-1 h-full bg-blue-500 opacity-30" />
      <CardHeader>
        <CardTitle className="text-xl font-heading text-foreground">Personnel on Duty</CardTitle>
        <p className="text-[10px] uppercase text-muted-foreground font-medium">Active shift oversight</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {staffOnDuty.map((staff) => (
            <div key={staff.id} className="flex items-center gap-4 p-4 rounded-xl border border-border/50 bg-card hover:bg-muted/10 transition-colors">
              <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
                {staff.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-heading text-foreground">{staff.name}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[10px] uppercase text-muted-foreground">{staff.role}</span>
                  <span className="w-1 h-1 rounded-full bg-muted-foreground/30" />
                  <span className="text-[10px] font-medium text-primary">
                    {staff.role === 'waiter' ? `${(staff as any).tables?.length || 0} tables` : `${(staff as any).orders || 0} orders`}
                  </span>
                </div>
              </div>
              <Badge variant="outline" className="text-[9px] uppercase px-2 h-5 text-success border-success/20 bg-success/5">
                {staff.status}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
