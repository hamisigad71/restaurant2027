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
import { Plus, Search, Pencil, Trash2, UtensilsCrossed, Leaf } from "lucide-react"
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
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
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
                <Plus className="h-4 w-4 mr-2" />
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
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredItems.map((item) => (
            <Card key={item.id} className="overflow-hidden bg-card border-border">
              <div className="aspect-video bg-secondary/50 relative flex items-center justify-center">
                <UtensilsCrossed className="h-12 w-12 text-muted-foreground/30" />
                {!item.available && (
                  <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
                    <Badge variant="secondary">Unavailable</Badge>
                  </div>
                )}
              </div>
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="">{item.name}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-1">{item.description}</p>
                  </div>
                  <Badge variant="outline" className="capitalize shrink-0 font-medium tracking-wider">
                    {item.category}
                  </Badge>
                </div>
                <div className="flex flex-wrap gap-1 mt-2">
                  {item.ingredients.slice(0, 3).map((ing) => (
                    <Badge key={ing} variant="secondary" className="text-[9px] py-0 px-1.5 h-4 bg-muted/40 uppercase tracking-tighter">
                      {ing}
                    </Badge>
                  ))}
                  {item.ingredients.length > 3 && (
                    <span className="text-[9px] text-muted-foreground ml-1">+{item.ingredients.length - 3}</span>
                  )}
                </div>
                <div className="flex items-center justify-between mt-4 pb-1">
                  <span className="text-lg font-heading text-primary">
                    KSh {item.price.toLocaleString()}
                  </span>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleToggleAvailability(item.id)}
                    >
                      <span className={item.available ? "text-success" : "text-muted-foreground"}>
                        {item.available ? "ON" : "OFF"}
                      </span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleEdit(item)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive"
                      onClick={() => handleDelete(item.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
