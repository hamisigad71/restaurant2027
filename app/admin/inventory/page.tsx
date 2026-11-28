"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { FieldGroup, Field, FieldLabel } from "@/components/ui/field"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import {
  PlusIcon,
  MagnifyingGlassIcon,
  PencilIcon,
  CubeIcon as Package,
  ExclamationTriangleIcon as AlertTriangle,
  ExclamationCircleIcon as AlertCircle,
  XCircleIcon as XCircle,
} from "@heroicons/react/24/outline"
import { mockInventory } from "@/lib/mock-data"
import type { InventoryItem, StockStatus } from "@/lib/types"

const statusConfig: Record<
  StockStatus,
  { label: string; color: string; icon: typeof AlertTriangle }
> = {
  good: { label: "Good", color: "bg-success/10 text-success border-success/30", icon: Package },
  low: { label: "Low", color: "bg-warning/10 text-warning border-warning/30", icon: AlertTriangle },
  critical: { label: "Critical", color: "bg-destructive/10 text-destructive border-destructive/30", icon: AlertCircle },
  out: { label: "Out of Stock", color: "bg-destructive/10 text-destructive border-destructive/30", icon: XCircle },
}

export default function InventoryPage() {
  const [items] = useState<InventoryItem[]>(mockInventory)
  const [searchQuery, setSearchQuery] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null)

  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const stats = [
    { label: "Total Items", value: items.length, icon: Package, tone: "bg-primary/10 text-primary" },
    { label: "In Stock", value: items.filter((i) => i.status === "good").length, icon: Package, tone: "bg-success/10 text-success" },
    { label: "Low Stock", value: items.filter((i) => i.status === "low").length, icon: AlertTriangle, tone: "bg-warning/10 text-warning" },
    { label: "Critical", value: items.filter((i) => i.status === "critical" || i.status === "out").length, icon: XCircle, tone: "bg-destructive/10 text-destructive" },
  ]

  const handleEdit = (item: InventoryItem) => {
    setEditingItem(item)
    setIsDialogOpen(true)
  }

  const handleAddNew = () => {
    setEditingItem(null)
    setIsDialogOpen(true)
  }

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-1 py-4 px-0 space-y-6">
        <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
          {stats.map((s) => (
            <Card key={s.label} size="sm">
              <CardHeader>
                <CardDescription className="text-xs font-medium">{s.label}</CardDescription>
                <CardAction>
                  <div className={`flex size-8 items-center justify-center rounded-lg ${s.tone}`}>
                    <s.icon className="size-4" />
                  </div>
                </CardAction>
              </CardHeader>
              <CardContent>
                <CardTitle className="text-2xl font-semibold tabular-nums">{s.value}</CardTitle>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader className="border-b">
            <CardTitle className="text-base">Inventory Items</CardTitle>
            <CardDescription>Track stock levels and restock thresholds</CardDescription>
            <CardAction className="flex items-center gap-2">
              <InputGroup className="w-full sm:w-64">
                <InputGroupAddon>
                  <MagnifyingGlassIcon />
                </InputGroupAddon>
                <InputGroupInput
                  type="search"
                  placeholder="Search items..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </InputGroup>

              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" onClick={handleAddNew}>
                    <PlusIcon className="size-4" />
                    Add
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>{editingItem ? "Edit Item" : "Add Item"}</DialogTitle>
                    <DialogDescription>
                      {editingItem ? "Update inventory item" : "Add new inventory item"}
                    </DialogDescription>
                  </DialogHeader>
                  <form className="space-y-4">
                    <FieldGroup>
                      <Field>
                        <FieldLabel htmlFor="name">Name</FieldLabel>
                        <Input
                          id="name"
                          defaultValue={editingItem?.name}
                          placeholder="Item name"
                        />
                      </Field>
                      <div className="grid grid-cols-2 gap-4">
                        <Field>
                          <FieldLabel htmlFor="quantity">Quantity</FieldLabel>
                          <Input
                            id="quantity"
                            type="number"
                            defaultValue={editingItem?.quantity}
                            placeholder="0"
                          />
                        </Field>
                        <Field>
                          <FieldLabel htmlFor="unit">Unit</FieldLabel>
                          <Input
                            id="unit"
                            defaultValue={editingItem?.unit}
                            placeholder="kg, liters, etc."
                          />
                        </Field>
                      </div>
                      <Field>
                        <FieldLabel htmlFor="minStock">Minimum Stock Level</FieldLabel>
                        <Input
                          id="minStock"
                          type="number"
                          defaultValue={editingItem?.minStock}
                          placeholder="0"
                        />
                      </Field>
                    </FieldGroup>
                    <DialogFooter>
                      <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button type="submit" onClick={() => setIsDialogOpen(false)}>
                        {editingItem ? "Update" : "Add"}
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </CardAction>
          </CardHeader>
          <CardContent>
            {filteredItems.length === 0 ? (
              <Empty className="py-12">
                <EmptyHeader>
                  <EmptyMedia variant="icon">
                    <Package />
                  </EmptyMedia>
                  <EmptyTitle>No inventory items found</EmptyTitle>
                  <EmptyDescription>Try adjusting your search query.</EmptyDescription>
                </EmptyHeader>
              </Empty>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Unit</TableHead>
                    <TableHead>Min Stock</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Updated</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredItems.map((item) => {
                    const config = statusConfig[item.status]
                    const Icon = config.icon
                    return (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.name}</TableCell>
                        <TableCell className="tabular-nums">{item.quantity}</TableCell>
                        <TableCell className="text-muted-foreground">{item.unit}</TableCell>
                        <TableCell className="text-muted-foreground tabular-nums">
                          {item.minStock}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={config.color}>
                            <Icon />
                            {config.label}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">{item.lastUpdated}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            onClick={() => handleEdit(item)}
                          >
                            <PencilIcon className="size-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
