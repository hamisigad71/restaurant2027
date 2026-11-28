"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item"

const staffOnDuty = [
  { id: "1", name: "John Doe", role: "waiter", status: "Active", tables: [4, 5, 6] },
  { id: "2", name: "Chef Pierre", role: "kitchen", status: "Cooking", orders: 3 },
  { id: "3", name: "Elena R.", role: "waiter", status: "Break", tables: [] },
  { id: "4", name: "Marco S.", role: "kitchen", status: "Active", orders: 1 },
]

export function StaffOnDuty() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Personnel on Duty</CardTitle>
        <CardDescription>Active shift oversight</CardDescription>
      </CardHeader>
      <CardContent>
        <ItemGroup className="gap-2.5">
          {staffOnDuty.map((staff) => (
            <Item key={staff.id} variant="outline" size="sm">
              <ItemMedia>
                <Avatar className="size-9">
                  <AvatarFallback className="text-xs font-medium">
                    {staff.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
              </ItemMedia>
              <ItemContent>
                <ItemTitle>{staff.name}</ItemTitle>
                <ItemDescription className="flex items-center gap-2 text-xs">
                  <span className="uppercase">{staff.role}</span>
                  <span>•</span>
                  <span className="text-primary font-medium">
                    {staff.role === "waiter"
                      ? `${staff.tables?.length || 0} tables`
                      : `${staff.orders || 0} orders`}
                  </span>
                </ItemDescription>
              </ItemContent>
              <ItemActions>
                <Badge
                  variant="outline"
                  className="text-[10px] uppercase text-success border-success/30 bg-success/10"
                >
                  {staff.status}
                </Badge>
              </ItemActions>
            </Item>
          ))}
        </ItemGroup>
      </CardContent>
    </Card>
  )
}
