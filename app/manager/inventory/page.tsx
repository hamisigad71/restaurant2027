"use client"

import { useState } from "react"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
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
  MagnifyingGlassIcon,
  CubeIcon,
  ArrowUpRightIcon,
  ArrowTrendingDownIcon,
  ExclamationTriangleIcon,
  ClockIcon,
} from "@heroicons/react/24/outline"
import { cn } from "@/lib/utils"

const mockInventory = [
  { item: "Filet Mignon", stock: 12, unit: "kg", status: "low", price: 2500 },
  { item: "Atlantic Salmon", stock: 8, unit: "kg", status: "low", price: 1800 },
  { item: "Basmati Rice", stock: 45, unit: "kg", status: "good", price: 200 },
  { item: "Potatoes", stock: 110, unit: "kg", status: "good", price: 80 },
  { item: "Red Wine", stock: 24, unit: "bottles", status: "good", price: 3500 },
]

export default function ManagerInventoryPage() {
  const [searchQuery, setSearchQuery] = useState("")

  const filtered = mockInventory.filter((i) =>
    i.item.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="flex flex-col">
      <div className="flex-1 py-4 px-0 space-y-6">
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          <Card size="sm">
            <CardHeader>
              <CardDescription className="text-xs uppercase font-medium">
                Items at risk
              </CardDescription>
              <CardAction>
                <div className="flex size-9 items-center justify-center rounded-lg bg-destructive/10 text-destructive">
                  <ExclamationTriangleIcon className="size-5" />
                </div>
              </CardAction>
            </CardHeader>
            <CardContent>
              <CardTitle className="text-3xl font-semibold tabular-nums text-destructive">
                8
              </CardTitle>
            </CardContent>
          </Card>

          <Card size="sm">
            <CardHeader>
              <CardDescription className="text-xs uppercase font-medium">
                Pending Requests
              </CardDescription>
              <CardAction>
                <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <ClockIcon className="size-5" />
                </div>
              </CardAction>
            </CardHeader>
            <CardContent>
              <CardTitle className="text-3xl font-semibold tabular-nums text-primary">
                3
              </CardTitle>
            </CardContent>
          </Card>

          <Card size="sm">
            <CardHeader>
              <CardDescription className="text-xs uppercase font-medium">
                Total SKU
              </CardDescription>
              <CardAction>
                <div className="flex size-9 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                  <CubeIcon className="size-5" />
                </div>
              </CardAction>
            </CardHeader>
            <CardContent>
              <CardTitle className="text-3xl font-semibold tabular-nums">142</CardTitle>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <InputGroup className="w-full sm:w-96 bg-card">
            <InputGroupAddon>
              <MagnifyingGlassIcon />
            </InputGroupAddon>
            <InputGroupInput
              placeholder="Search inventory catalog..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </InputGroup>
          <Button className="w-full sm:w-auto gap-2">
            <ArrowUpRightIcon className="size-4" />
            Request Resupply
          </Button>
        </div>

        <Card className="pb-0 overflow-hidden">
          <CardHeader className="border-b">
            <CardTitle className="text-base">Operational Stock List</CardTitle>
            <CardDescription>Live warehouse quantities and unit valuations</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30">
                  <TableHead className="px-6">Item Identifier</TableHead>
                  <TableHead className="px-6">Volume</TableHead>
                  <TableHead className="px-6">Value (Unit)</TableHead>
                  <TableHead className="px-6">Status</TableHead>
                  <TableHead className="px-6 text-right">Operations</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((item) => (
                  <TableRow key={item.item}>
                    <TableCell className="px-6 font-medium">{item.item}</TableCell>
                    <TableCell className="px-6">
                      <div className="flex items-center gap-2">
                        <span
                          className={cn(
                            "text-sm tabular-nums",
                            item.status === "low" ? "text-destructive font-medium" : "text-foreground",
                          )}
                        >
                          {item.stock} {item.unit}
                        </span>
                        {item.status === "low" && (
                          <ArrowTrendingDownIcon className="size-3.5 text-destructive" />
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="px-6 text-xs text-muted-foreground tabular-nums">
                      KES {item.price.toLocaleString()}
                    </TableCell>
                    <TableCell className="px-6">
                      <Badge
                        variant="outline"
                        className={cn(
                          "text-[10px] uppercase",
                          item.status === "good"
                            ? "bg-success/10 text-success border-success/20"
                            : "bg-warning/10 text-warning border-warning/20",
                        )}
                      >
                        {item.status === "low" ? "Critically Low" : "In Stock"}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-6 text-right">
                      <Button variant="ghost" size="sm">
                        Order More
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
