"use client"

import { useState } from "react"
import { Plus, Trash2, Edit, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Define types
type PackingItem = {
  id: string
  name: string
  category: string
  packed: boolean
}

type Category = {
  id: string
  name: string
  emoji: string
}

// Initial categories
const initialCategories: Category[] = [
  { id: "essentials", name: "Essentials", emoji: "🔑" },
  { id: "clothing", name: "Clothing", emoji: "👕" },
  { id: "toiletries", name: "Toiletries", emoji: "🧴" },
  { id: "electronics", name: "Electronics", emoji: "📱" },
  { id: "documents", name: "Documents", emoji: "📄" },
  { id: "medical", name: "Medical", emoji: "💊" },
  { id: "misc", name: "Miscellaneous", emoji: "🧩" },
]

// Initial items
const initialItems: PackingItem[] = [
  { id: "1", name: "Passport", category: "documents", packed: false },
  { id: "2", name: "Phone Charger", category: "electronics", packed: false },
  { id: "3", name: "Toothbrush", category: "toiletries", packed: false },
  { id: "4", name: "T-shirts (5)", category: "clothing", packed: false },
  { id: "5", name: "Medications", category: "medical", packed: false },
  { id: "6", name: "Wallet", category: "essentials", packed: false },
  { id: "7", name: "Camera", category: "electronics", packed: false },
  { id: "8", name: "Sunglasses", category: "clothing", packed: false },
  { id: "9", name: "Travel Insurance", category: "documents", packed: false },
  { id: "10", name: "First Aid Kit", category: "medical", packed: false },
]

export default function PackingList() {
  const [items, setItems] = useState<PackingItem[]>(initialItems)
  const [categories, setCategories] = useState<Category[]>(initialCategories)
  const [newItemName, setNewItemName] = useState("")
  const [newItemCategory, setNewItemCategory] = useState("essentials")
  const [newCategoryName, setNewCategoryName] = useState("")
  const [newCategoryEmoji, setNewCategoryEmoji] = useState("📦")
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [activeTab, setActiveTab] = useState("all")

  // Add new item
  const addItem = () => {
    if (newItemName.trim()) {
      const newItem: PackingItem = {
        id: Date.now().toString(),
        name: newItemName.trim(),
        category: newItemCategory,
        packed: false,
      }
      setItems([...items, newItem])
      setNewItemName("")
    }
  }

  // Toggle item packed status
  const togglePacked = (id: string) => {
    setItems(items.map((item) => (item.id === id ? { ...item, packed: !item.packed } : item)))
  }

  // Delete item
  const deleteItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id))
  }

  // Add new category
  const addCategory = () => {
    if (newCategoryName.trim()) {
      const newCategory: Category = {
        id: newCategoryName.toLowerCase().replace(/\s+/g, "-"),
        name: newCategoryName.trim(),
        emoji: newCategoryEmoji,
      }
      setCategories([...categories, newCategory])
      setNewCategoryName("")
      setNewCategoryEmoji("📦")
    }
  }

  // Update category
  const updateCategory = () => {
    if (editingCategory && newCategoryName.trim()) {
      setCategories(
        categories.map((cat) =>
          cat.id === editingCategory.id ? { ...cat, name: newCategoryName, emoji: newCategoryEmoji } : cat,
        ),
      )
      setEditingCategory(null)
      setNewCategoryName("")
      setNewCategoryEmoji("📦")
    }
  }

  // Delete category and its items
  const deleteCategory = (id: string) => {
    setCategories(categories.filter((cat) => cat.id !== id))
    setItems(items.filter((item) => item.category !== id))
  }

  // Filter items based on active tab
  const filteredItems =
    activeTab === "all"
      ? items
      : activeTab === "packed"
        ? items.filter((item) => item.packed)
        : activeTab === "unpacked"
          ? items.filter((item) => !item.packed)
          : items.filter((item) => item.category === activeTab)

  // Calculate progress
  const packedCount = items.filter((item) => item.packed).length
  const progress = items.length > 0 ? Math.round((packedCount / items.length) * 100) : 0

  return (
    <div className="space-y-6">
      {/* Progress Bar */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm font-medium">Packing Progress</span>
              <span className="text-sm font-medium">{progress}%</span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-300 ease-in-out"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="text-xs text-muted-foreground">
              {packedCount} of {items.length} items packed
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Add Item Form */}
      <Card>
        <CardHeader>
          <CardTitle>Add Item</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-2">
            <Input
              placeholder="Item name"
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
              className="flex-1"
            />
            <Select value={newItemCategory} onValueChange={setNewItemCategory}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.emoji} {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={addItem}>
              <Plus className="h-4 w-4 mr-2" /> Add
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Packing List */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Your Packing List</CardTitle>

            {/* Category Management */}
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  Manage Categories
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Manage Categories</DialogTitle>
                </DialogHeader>

                <div className="space-y-4 my-4">
                  {/* Add/Edit Category Form */}
                  <div className="space-y-2">
                    <Label htmlFor="categoryName">{editingCategory ? "Edit Category" : "Add New Category"}</Label>
                    <div className="flex gap-2">
                      <Input
                        id="categoryEmoji"
                        placeholder="Emoji"
                        value={newCategoryEmoji}
                        onChange={(e) => setNewCategoryEmoji(e.target.value)}
                        className="w-16"
                      />
                      <Input
                        id="categoryName"
                        placeholder="Category name"
                        value={newCategoryName}
                        onChange={(e) => setNewCategoryName(e.target.value)}
                        className="flex-1"
                      />
                      <Button onClick={editingCategory ? updateCategory : addCategory}>
                        {editingCategory ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>

                  {/* Category List */}
                  <div className="space-y-2">
                    <Label>Current Categories</Label>
                    <div className="border rounded-md divide-y">
                      {categories.map((category) => (
                        <div key={category.id} className="flex items-center justify-between p-3">
                          <div className="flex items-center gap-2">
                            <span className="text-lg">{category.emoji}</span>
                            <span>{category.name}</span>
                          </div>
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                setEditingCategory(category)
                                setNewCategoryName(category.name)
                                setNewCategoryEmoji(category.emoji)
                              }}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => deleteCategory(category.id)}>
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline">Close</Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4 w-full justify-start overflow-auto">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="unpacked">Unpacked</TabsTrigger>
              <TabsTrigger value="packed">Packed</TabsTrigger>
              <div className="border-r h-6 mx-2" />
              {categories.map((category) => (
                <TabsTrigger key={category.id} value={category.id}>
                  {category.emoji} {category.name}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value={activeTab} className="mt-0">
              {filteredItems.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No items found. Add some items to your packing list!
                </div>
              ) : (
                <div className="space-y-2">
                  {categories.map((category) => {
                    const categoryItems = filteredItems.filter((item) => item.category === category.id)
                    if (categoryItems.length === 0 && activeTab !== category.id) return null

                    return (
                      <div key={category.id} className="space-y-2">
                        {(activeTab === "all" || activeTab === "packed" || activeTab === "unpacked") && (
                          <div className="flex items-center gap-2 mt-4 first:mt-0">
                            <span className="text-lg">{category.emoji}</span>
                            <h3 className="font-medium">{category.name}</h3>
                          </div>
                        )}

                        <div className="space-y-1">
                          {categoryItems.map((item) => (
                            <div
                              key={item.id}
                              className="flex items-center justify-between p-3 border rounded-md bg-background hover:bg-accent/50 transition-colors"
                            >
                              <div className="flex items-center gap-3">
                                <Checkbox
                                  id={`item-${item.id}`}
                                  checked={item.packed}
                                  onCheckedChange={() => togglePacked(item.id)}
                                />
                                <label
                                  htmlFor={`item-${item.id}`}
                                  className={`text-sm font-medium ${item.packed ? "line-through text-muted-foreground" : ""}`}
                                >
                                  {item.name}
                                </label>
                              </div>
                              <Button variant="ghost" size="icon" onClick={() => deleteItem(item.id)}>
                                <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
