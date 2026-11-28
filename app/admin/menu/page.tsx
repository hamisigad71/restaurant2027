"use client"

import { useState, useEffect } from "react"
import { AnimatePresence, motion } from "motion/react"
import { SPRING_SNAPPY } from "@/lib/motion"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
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
  EyeSlashIcon,
} from "@heroicons/react/24/outline"
import { mockMenuItems, mockInventory } from "@/lib/mock-data"
import { MenuService } from "@/lib/restaurant-store"
import type { MenuItem } from "@/lib/types"
import { toast } from "sonner"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"

const categories = [
  { id: "all", label: "All" },
  { id: "starters", label: "Starters" },
  { id: "main", label: "Main Dishes" },
  { id: "seafood", label: "Seafood" },
  { id: "snacks", label: "Snacks" },
  { id: "desserts", label: "Desserts" },
  { id: "drinks", label: "Drinks" },
]

export default function MenuPage() {
  const [items, setItems] = useState<MenuItem[]>(mockMenuItems)
  const [activeCategory, setActiveCategory] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null)
  const [formName, setFormName] = useState("")
  const [formDescription, setFormDescription] = useState("")
  const [formPrice, setFormPrice] = useState("")
  const [formCategory, setFormCategory] = useState<MenuItem["category"]>("main")
  const [formIngredients, setFormIngredients] = useState<string[]>([])

  useEffect(() => {
    return MenuService.subscribe(setItems)
  }, [])

  const filteredItems = items.filter((item) => {
    const matchesCategory = activeCategory === "all" || item.category === activeCategory
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const handleDelete = (id: string) => {
    MenuService.deleteItem(id)
    toast.info("Menu item deleted across all portals")
  }

  const handleToggleAvailability = (id: string) => {
    const toggled = MenuService.toggleAvailability(id)
    if (toggled) {
      toast.info(`${toggled.name} marked ${toggled.available ? "Live" : "86'd (Hidden)"}`)
    }
  }

  const handleEdit = (item: MenuItem) => {
    setEditingItem(item)
    setFormName(item.name)
    setFormDescription(item.description)
    setFormPrice(String(item.price))
    setFormCategory(item.category)
    setFormIngredients(item.ingredients || [])
    setIsDialogOpen(true)
  }

  const handleAddNew = () => {
    setEditingItem(null)
    setFormName("")
    setFormDescription("")
    setFormPrice("")
    setFormCategory("main")
    setFormIngredients([])
    setIsDialogOpen(true)
  }

  const handleSaveItem = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formName.trim() || !formPrice) {
      toast.error("Please provide item name and price")
      return
    }
    const payload: MenuItem = {
      id: editingItem?.id || `item-${Date.now()}`,
      name: formName.trim(),
      description: formDescription.trim() || "Chef signature selection",
      price: Number(formPrice) || 0,
      category: formCategory,
      image: editingItem?.image || "/placeholder.jpg",
      ingredients: formIngredients,
      available: editingItem?.available ?? true,
      prepTime: editingItem?.prepTime ?? 15,
      popular: editingItem?.popular ?? false,
      rating: editingItem?.rating ?? 4.7,
      vegetarian: editingItem?.vegetarian ?? false,
    }
    MenuService.upsertItem(payload)
    setIsDialogOpen(false)
    toast.success(editingItem ? `${payload.name} updated` : `${payload.name} added to menu`, {
      description: "Synced live to Waiter & Customer menus",
    })
  }

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-1 py-4 px-0 space-y-6">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <InputGroup className="w-full sm:w-64">
            <InputGroupAddon>
              <MagnifyingGlassIcon />
            </InputGroupAddon>
            <InputGroupInput
              type="search"
              placeholder="Search menu..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </InputGroup>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={handleAddNew}>
                <PlusIcon className="size-4" />
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
              <form onSubmit={handleSaveItem} className="space-y-4">
                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="name">Name</FieldLabel>
                    <Input
                      id="name"
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      placeholder="Item name"
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="description">Description</FieldLabel>
                    <Input
                      id="description"
                      value={formDescription}
                      onChange={(e) => setFormDescription(e.target.value)}
                      placeholder="Brief description"
                    />
                  </Field>
                  <div className="grid grid-cols-2 gap-4">
                    <Field>
                      <FieldLabel htmlFor="price">Price (KES)</FieldLabel>
                      <Input
                        id="price"
                        type="number"
                        value={formPrice}
                        onChange={(e) => setFormPrice(e.target.value)}
                        placeholder="0"
                      />
                    </Field>
                    <Field>
                      <FieldLabel htmlFor="category">Category</FieldLabel>
                      <Select
                        value={formCategory}
                        onValueChange={(v) => setFormCategory(v as MenuItem["category"])}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="starters">Starters</SelectItem>
                          <SelectItem value="main">Main Dishes</SelectItem>
                          <SelectItem value="seafood">Seafood</SelectItem>
                          <SelectItem value="snacks">Snacks</SelectItem>
                          <SelectItem value="desserts">Desserts</SelectItem>
                          <SelectItem value="drinks">Drinks</SelectItem>
                        </SelectContent>
                      </Select>
                    </Field>
                  </div>
                  <Field>
                    <FieldLabel>Ingredients</FieldLabel>
                    <Card size="sm" className="bg-muted/30 py-2">
                      <ScrollArea className="h-32 px-3">
                        <div className="grid grid-cols-2 gap-2">
                          {mockInventory.map((item) => {
                            const ingKey = item.name.toLowerCase()
                            const checked = formIngredients.includes(ingKey)
                            return (
                              <div key={item.id} className="flex items-center space-x-2">
                                <Checkbox
                                  id={`ing-${item.id}`}
                                  checked={checked}
                                  onCheckedChange={(val) =>
                                    setFormIngredients((prev) =>
                                      val ? [...prev, ingKey] : prev.filter((x) => x !== ingKey),
                                    )
                                  }
                                />
                                <label
                                  htmlFor={`ing-${item.id}`}
                                  className="text-xs font-medium cursor-pointer"
                                >
                                  {item.name}
                                </label>
                              </div>
                            )
                          })}
                        </div>
                      </ScrollArea>
                    </Card>
                  </Field>
                </FieldGroup>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">{editingItem ? "Update" : "Create"}</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Tabs value={activeCategory} onValueChange={setActiveCategory}>
          <TabsList>
            {categories.map((category) => {
              const isActive = activeCategory === category.id
              return (
                <TabsTrigger
                  key={category.id}
                  value={category.id}
                  className="relative data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                >
                  {isActive && (
                    <motion.span
                      layoutId="admin-menu-cat"
                      transition={SPRING_SNAPPY}
                      aria-hidden="true"
                      className="absolute inset-0 rounded-md bg-background shadow-sm"
                    />
                  )}
                  <span className="relative z-10">{category.label}</span>
                </TabsTrigger>
              )
            })}
          </TabsList>
        </Tabs>

        {filteredItems.length === 0 ? (
          <Empty className="py-16 border">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <CakeIcon />
              </EmptyMedia>
              <EmptyTitle>No dishes match</EmptyTitle>
              <EmptyDescription>Try clearing your search or choosing another category.</EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <div className="grid gap-4 grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            <AnimatePresence mode="popLayout" initial={false}>
              {filteredItems.map((item) => (
                <motion.div
                  key={item.id}
                  layout="position"
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={SPRING_SNAPPY}
                >
                  <Card
                    size="sm"
                    className="group gap-0 py-0 overflow-hidden transition-[border-color,box-shadow] duration-150 ease-(--ease-out) hover:shadow-md h-full"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden shrink-0 bg-muted">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover transition-transform duration-300 ease-(--ease-out) group-hover:scale-105"
                        />
                      ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <CakeIcon className="size-12 text-muted-foreground/30" />
                    </div>
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

                  <div className="absolute top-2.5 left-2.5">
                    <Badge
                      variant={item.available ? "default" : "destructive"}
                      className="text-[10px] uppercase"
                    >
                      {item.available ? "Live" : "86'd"}
                    </Badge>
                  </div>

                  <div className="absolute top-2.5 right-2.5">
                    <Badge variant="secondary" className="text-[10px] uppercase">
                      {item.category}
                    </Badge>
                  </div>

                  <div className="absolute bottom-2.5 left-3">
                    <p className="text-white font-bold text-sm leading-none tabular-nums drop-shadow">
                      KSh {item.price.toLocaleString()}
                    </p>
                  </div>

                  <div
                    className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer bg-black/25"
                    onClick={() => handleEdit(item)}
                  >
                    <Badge className="gap-1.5 px-3 py-1.5 text-xs uppercase shadow-md">
                      <PencilIcon className="size-3.5" />
                      Edit Item
                    </Badge>
                  </div>
                </div>

                <CardHeader className="pt-3 pb-2">
                  <CardTitle className="text-sm leading-snug line-clamp-2">
                    <h3>{item.name}</h3>
                  </CardTitle>
                </CardHeader>

                <CardContent className="pb-3 flex-1">
                  <div className="flex flex-wrap gap-1">
                    {item.ingredients.slice(0, 2).map((ing) => (
                      <Badge key={ing} variant="secondary" className="text-[10px] uppercase">
                        {ing}
                      </Badge>
                    ))}
                    {item.ingredients.length > 2 && (
                      <Badge variant="outline" className="text-[10px]">
                        +{item.ingredients.length - 2}
                      </Badge>
                    )}
                  </div>
                </CardContent>

                <CardFooter className="border-t pt-2.5 pb-3 flex-col gap-2">
                  <Button
                    size="xs"
                    variant={item.available ? "secondary" : "destructive"}
                    className="w-full"
                    onClick={() => handleToggleAvailability(item.id)}
                  >
                    {item.available ? <EyeIcon /> : <EyeSlashIcon />}
                    {item.available ? "Visible" : "Hidden"}
                  </Button>
                  <div className="flex gap-2 w-full">
                    <Button
                      size="xs"
                      variant="outline"
                      className="flex-1"
                      onClick={() => handleEdit(item)}
                    >
                      <PencilIcon />
                      Edit
                    </Button>
                    <Button
                      size="icon-xs"
                      variant="ghost"
                      className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                      onClick={() => handleDelete(item.id)}
                    >
                      <TrashIcon />
                    </Button>
                  </div>
                </CardFooter>
              </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  )
}
