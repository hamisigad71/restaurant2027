"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
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
  PlusIcon, 
  MagnifyingGlassIcon, 
  PencilIcon, 
  CubeIcon as Package, 
  ExclamationTriangleIcon as AlertTriangle, 
  ExclamationCircleIcon as AlertCircle, 
  XCircleIcon as XCircle 
} from "@heroicons/react/24/outline"
import { mockInventory } from "@/lib/mock-data"
import type { InventoryItem, StockStatus } from "@/lib/types"

const statusConfig: Record<StockStatus, { label: string; color: string; icon: typeof AlertTriangle }> = {
  good: { label: "Good", color: "bg-success/10 text-success border-success/30", icon: Package },
  low: { label: "Low", color: "bg-warning/10 text-warning border-warning/30", icon: AlertTriangle },
  critical: { label: "Critical", color: "bg-destructive/10 text-destructive border-destructive/30", icon: AlertCircle },
  out: { label: "Out of Stock", color: "bg-destructive/10 text-destructive border-destructive/30", icon: XCircle },
}

export default function InventoryPage() {
  const [items, setItems] = useState<InventoryItem[]>(mockInventory)
  const [searchQuery, setSearchQuery] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null)

  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const stats = {
    total: items.length,
    good: items.filter(i => i.status === "good").length,
    low: items.filter(i => i.status === "low").length,
    critical: items.filter(i => i.status === "critical" || i.status === "out").length,
  }

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
        {/* Stats Cards */}
        <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
          <Card className="bg-card border-border/50 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-1 h-full bg-primary opacity-50" />
            <CardContent className="p-5">
              <div className="flex items-center gap-4">
                <div className="p-2.5 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                  <Package className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-heading text-foreground">{stats.total}</p>
                  <p className="text-[10px] uppercase  text-muted-foreground font-medium">Total Items</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-success/10">
                  <Package className="h-5 w-5 text-success" />
                </div>
                <div>
                  <p className="text-2xl">{stats.good}</p>
                  <p className="text-sm text-muted-foreground">In Stock</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-warning/10">
                  <AlertTriangle className="h-5 w-5 text-warning" />
                </div>
                <div>
                  <p className="text-2xl">{stats.low}</p>
                  <p className="text-sm text-muted-foreground">Low Stock</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-destructive/10">
                  <XCircle className="h-5 w-5 text-destructive" />
                </div>
                <div>
                  <p className="text-2xl">{stats.critical}</p>
                  <p className="text-sm text-muted-foreground">Critical</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Inventory Table */}
        <Card className="bg-card border-border">
          <CardHeader className="pb-4">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <CardTitle className="text-base font-medium">Inventory Items</CardTitle>
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <div className="relative flex-1 sm:flex-initial">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search items..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 w-full sm:w-64 bg-secondary border-0"
                  />
                </div>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm" onClick={handleAddNew}>
                      <PlusIcon className="h-4 w-4 mr-2" />
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
                            className="bg-secondary border-border"
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
                              className="bg-secondary border-border"
                            />
                          </Field>
                          <Field>
                            <FieldLabel htmlFor="unit">Unit</FieldLabel>
                            <Input
                              id="unit"
                              defaultValue={editingItem?.unit}
                              placeholder="kg, liters, etc."
                              className="bg-secondary border-border"
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
                            className="bg-secondary border-border"
                          />
                        </Field>
                      </FieldGroup>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button type="submit" onClick={() => setIsDialogOpen(false)}>
                          {editingItem ? "Update" : "Add"}
                        </Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="border-border hover:bg-transparent">
                  <TableHead className="text-muted-foreground">Item</TableHead>
                  <TableHead className="text-muted-foreground">Quantity</TableHead>
                  <TableHead className="text-muted-foreground">Unit</TableHead>
                  <TableHead className="text-muted-foreground">Min Stock</TableHead>
                  <TableHead className="text-muted-foreground">Status</TableHead>
                  <TableHead className="text-muted-foreground">Last Updated</TableHead>
                  <TableHead className="text-muted-foreground text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredItems.map((item) => {
                  const config = statusConfig[item.status]
                  const Icon = config.icon
                  return (
                    <TableRow key={item.id} className="border-border">
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell className="text-muted-foreground">{item.unit}</TableCell>
                      <TableCell className="text-muted-foreground">{item.minStock}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={config.color}>
                          <Icon className="h-3 w-3 mr-1" />
                          {config.label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{item.lastUpdated}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleEdit(item)}
                        >
                          <PencilIcon className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
