"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { 
  PlusIcon, 
  MagnifyingGlassIcon, 
  PencilIcon, 
  TrashIcon, 
  CakeIcon,
  EyeIcon,
  EyeSlashIcon
} from "@heroicons/react/24/outline"
import { mockMenuItems, mockInventory } from "@/lib/mock-data"
import type { MenuItem } from "@/lib/types"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"

const categories = [
  { id: "all", label: "All" },
  { id: "food", label: "Food" },
  { id: "drinks", label: "Drinks" },
  { id: "snacks", label: "Snacks" },
  { id: "desserts", label: "Desserts" },
]

export default function MenuPage() {
  const [items, setItems] = useState<MenuItem[]>(mockMenuItems)
  const [activeCategory, setActiveCategory] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null)

  const filteredItems = items.filter(item => {
    const matchesCategory = activeCategory === "all" || item.category === activeCategory
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const handleDelete = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id))
  }

  const handleToggleAvailability = (id: string) => {
    setItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, available: !item.available } : item
      )
    )
  }

  const handleEdit = (item: MenuItem) => {
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
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-initial">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search menu..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 w-full sm:w-64 bg-secondary border-0"
              />
            </div>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={handleAddNew}>
                <PlusIcon className="h-4 w-4 mr-2" />
                Add Item
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>{editingItem ? "Edit Item" : "Add New Item"}</DialogTitle>
                <DialogDescription>
                  {editingItem ? "Update menu item details" : "Create a new menu item"}
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
                  <Field>
                    <FieldLabel htmlFor="description">Description</FieldLabel>
                    <Input
                      id="description"
                      defaultValue={editingItem?.description}
                      placeholder="Brief description"
                      className="bg-secondary border-border"
                    />
                  </Field>
                  <div className="grid grid-cols-2 gap-4">
                    <Field>
                      <FieldLabel htmlFor="price">Price (KES)</FieldLabel>
                      <Input
                        id="price"
                        type="number"
                        defaultValue={editingItem?.price}
                        placeholder="0"
                        className="bg-secondary border-border"
                      />
                    </Field>
                    <Field>
                      <FieldLabel htmlFor="category">Category</FieldLabel>
                      <Select defaultValue={editingItem?.category || "food"}>
                        <SelectTrigger className="bg-secondary border-border">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="food">Food</SelectItem>
                          <SelectItem value="drinks">Drinks</SelectItem>
                          <SelectItem value="snacks">Snacks</SelectItem>
                          <SelectItem value="desserts">Desserts</SelectItem>
                        </SelectContent>
                      </Select>
                    </Field>
                  </div>
                  <Field>
                    <FieldLabel>Ingredients</FieldLabel>
                    <Card className="bg-secondary/30 border-border">
                      <ScrollArea className="h-32 p-3">
                        <div className="grid grid-cols-2 gap-2">
                          {mockInventory.map((item) => (
                            <div key={item.id} className="flex items-center space-x-2">
                              <Checkbox id={`ing-${item.id}`} defaultChecked={editingItem?.ingredients.includes(item.name.toLowerCase())} />
                              <label htmlFor={`ing-${item.id}`} className="text-xs font-medium cursor-pointer">
                                {item.name}
                              </label>
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    </Card>
                  </Field>
                </FieldGroup>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="border-border">
                    Cancel
                  </Button>
                  <Button type="submit" onClick={() => setIsDialogOpen(false)}>
                    {editingItem ? "Update" : "Create"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Category Tabs */}
        <Tabs value={activeCategory} onValueChange={setActiveCategory}>
          <TabsList className="bg-secondary/50 p-1">
            {categories.map((category) => (
              <TabsTrigger
                key={category.id}
                value={category.id}
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                {category.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {/* Menu Grid */}
        <div className="grid gap-4 grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="group relative flex flex-col overflow-hidden rounded-lg border bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              style={{
                borderColor: "oklch(0.45 0.12 285 / 0.1)",
                boxShadow: "0 2px 10px rgba(13,3,27,0.06)",
              }}
            >
              {/* Image Section */}
              <div className="relative aspect-[4/3] overflow-hidden rounded-t-lg shrink-0 bg-secondary/30">
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <CakeIcon className="h-12 w-12 text-muted-foreground/20" />
                  </div>
                )}
                
                {/* Scrim */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

                {/* Status Badge - Top Left */}
                <div className="absolute top-2.5 left-2.5">
                  <span
                    className="flex items-center gap-1 text-[9px] font-bold uppercase px-2 py-1 rounded-full text-white"
                    style={{
                      background: item.available
                        ? "oklch(0.62 0.16 150 / 0.85)"
                        : "oklch(0.55 0.18 25 / 0.85)",
                      backdropFilter: "blur(6px)",
                    }}
                  >
                    {item.available ? "Live" : "86'd"}
                  </span>
                </div>

                {/* Categories/Tags - Top Right */}
                <div className="absolute top-2.5 right-2.5">
                   <span
                      className="flex items-center gap-1 text-[9px] font-bold uppercase px-2 py-1 rounded-full text-white"
                      style={{
                        background: "oklch(0.45 0.12 285 / 0.7)",
                        backdropFilter: "blur(6px)",
                      }}
                    >
                      {item.category}
                    </span>
                </div>

                {/* Price Overlay - Bottom Left */}
                <div className="absolute bottom-2.5 left-3">
                  <p className="text-white font-bold text-[15px] leading-none tabular-nums drop-shadow">
                    KSh {item.price.toLocaleString()}
                  </p>
                </div>

                {/* Edit Pencil - Hover Overlay */}
                <div 
                  className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer"
                  onClick={() => handleEdit(item)}
                >
                  <div
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-bold uppercase text-white"
                    style={{
                      background: "oklch(0.45 0.12 285 / 0.9)",
                      backdropFilter: "blur(8px)",
                      boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
                    }}
                  >
                    <PencilIcon className="h-3.5 w-3.5" />
                    Edit Item
                  </div>
                </div>
              </div>

              {/* Card Body */}
              <div className="flex flex-col flex-1 px-3 pt-3 pb-3 gap-2">
                <div className="flex items-start justify-between gap-1.5">
                  <h3 className="text-[12px] font-bold leading-tight line-clamp-2 text-[#0D031B]">
                    {item.name}
                  </h3>
                </div>

                {/* Ingredients strip */}
                <div className="flex flex-wrap gap-1">
                  {item.ingredients.slice(0, 2).map((ing) => (
                    <span key={ing} className="text-[9px] px-1.5 py-0.5 rounded-md bg-secondary/50 text-muted-foreground uppercase font-bold">
                      {ing}
                    </span>
                  ))}
                  {item.ingredients.length > 2 && (
                    <span className="text-[9px] text-muted-foreground/60 font-bold">+{item.ingredients.length - 2}</span>
                  )}
                </div>

                {/* Action Strip */}
                <div className="flex flex-col gap-2 pt-2 mt-auto border-t" style={{ borderColor: "oklch(0.45 0.12 285 / 0.08)" }}>
                  <button
                    onClick={() => handleToggleAvailability(item.id)}
                    className="flex items-center justify-center gap-1.5 text-[9px] font-bold uppercase px-2 py-1.5 rounded-lg transition-colors w-full"
                    style={
                      item.available
                        ? { color: "oklch(0.42 0.14 150)", background: "oklch(0.62 0.16 150 / 0.08)" }
                        : { color: "oklch(0.55 0.18 25)", background: "oklch(0.65 0.18 25 / 0.08)" }
                    }
                  >
                    {item.available ? <EyeIcon className="h-3 w-3" /> : <EyeSlashIcon className="h-3 w-3" />}
                    {item.available ? "Visible" : "Hidden"}
                  </button>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(item)}
                      className="flex-1 flex items-center justify-center gap-1.5 text-[9px] font-bold uppercase px-2 py-1.5 rounded-lg transition-colors hover:bg-secondary bg-secondary/30 text-muted-foreground"
                    >
                      <PencilIcon className="h-3 w-3" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="flex items-center justify-center w-8 h-8 rounded-lg transition-colors hover:bg-destructive/10 text-destructive bg-destructive/5"
                    >
                      <TrashIcon className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
