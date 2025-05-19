"use client"

import type React from "react"

import { useState } from "react"
import { Plus, Trash2, CreditCard, ShoppingBag, Utensils, Plane, Hotel, Ticket } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"

// Types
type ExpenseCategory = "accommodation" | "food" | "transportation" | "activities" | "shopping" | "other"

type Expense = {
  id: string
  amount: number
  description: string
  category: ExpenseCategory
  date: string
  currency: string
}

// Category icons and colors
const categoryConfig: Record<ExpenseCategory, { icon: React.ReactNode; color: string }> = {
  accommodation: {
    icon: <Hotel className="h-4 w-4" />,
    color: "bg-blue-100 text-blue-600",
  },
  food: {
    icon: <Utensils className="h-4 w-4" />,
    color: "bg-orange-100 text-orange-600",
  },
  transportation: {
    icon: <Plane className="h-4 w-4" />,
    color: "bg-green-100 text-green-600",
  },
  activities: {
    icon: <Ticket className="h-4 w-4" />,
    color: "bg-purple-100 text-purple-600",
  },
  shopping: {
    icon: <ShoppingBag className="h-4 w-4" />,
    color: "bg-pink-100 text-pink-600",
  },
  other: {
    icon: <CreditCard className="h-4 w-4" />,
    color: "bg-gray-100 text-gray-600",
  },
}

// Sample expenses
const initialExpenses: Expense[] = [
  {
    id: "1",
    amount: 120,
    description: "Hotel in Paris",
    category: "accommodation",
    date: "2025-05-15",
    currency: "EUR",
  },
  {
    id: "2",
    amount: 35,
    description: "Dinner at local restaurant",
    category: "food",
    date: "2025-05-15",
    currency: "EUR",
  },
  {
    id: "3",
    amount: 25,
    description: "Metro tickets",
    category: "transportation",
    date: "2025-05-16",
    currency: "EUR",
  },
  {
    id: "4",
    amount: 60,
    description: "Louvre Museum tickets",
    category: "activities",
    date: "2025-05-16",
    currency: "EUR",
  },
  {
    id: "5",
    amount: 45,
    description: "Souvenir shopping",
    category: "shopping",
    date: "2025-05-17",
    currency: "EUR",
  },
]

export default function BudgetTracker() {
  const [expenses, setExpenses] = useState<Expense[]>(initialExpenses)
  const [newExpense, setNewExpense] = useState<Omit<Expense, "id">>({
    amount: 0,
    description: "",
    category: "other",
    date: new Date().toISOString().split("T")[0],
    currency: "EUR",
  })
  const [activeTab, setActiveTab] = useState<string>("all")
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  // Add new expense
  const addExpense = () => {
    if (newExpense.amount > 0 && newExpense.description) {
      const expense: Expense = {
        ...newExpense,
        id: Date.now().toString(),
      }
      setExpenses([...expenses, expense])
      setNewExpense({
        amount: 0,
        description: "",
        category: "other",
        date: new Date().toISOString().split("T")[0],
        currency: "EUR",
      })
      setIsDialogOpen(false)
    }
  }

  // Delete expense
  const deleteExpense = (id: string) => {
    setExpenses(expenses.filter((expense) => expense.id !== id))
  }

  // Filter expenses based on active tab
  const filteredExpenses = activeTab === "all" ? expenses : expenses.filter((expense) => expense.category === activeTab)

  // Calculate totals
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0)

  // Calculate category totals
  const categoryTotals = expenses.reduce(
    (acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount
      return acc
    },
    {} as Record<ExpenseCategory, number>,
  )

  return (
    <div className="space-y-6">
      {/* Budget Summary */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Trip Budget</CardTitle>
          <CardDescription>Track your travel expenses</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-end">
              <div>
                <p className="text-sm text-muted-foreground">Total Expenses</p>
                <p className="text-3xl font-bold">€{totalExpenses.toFixed(2)}</p>
              </div>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Expense
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Expense</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="amount" className="text-right">
                        Amount
                      </Label>
                      <div className="col-span-3 flex">
                        <Select
                          value={newExpense.currency}
                          onValueChange={(value) => setNewExpense({ ...newExpense, currency: value })}
                        >
                          <SelectTrigger className="w-[80px] rounded-r-none">
                            <SelectValue placeholder="Currency" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="USD">USD</SelectItem>
                            <SelectItem value="EUR">EUR</SelectItem>
                            <SelectItem value="GBP">GBP</SelectItem>
                            <SelectItem value="JPY">JPY</SelectItem>
                          </SelectContent>
                        </Select>
                        <Input
                          id="amount"
                          type="number"
                          value={newExpense.amount || ""}
                          onChange={(e) =>
                            setNewExpense({ ...newExpense, amount: Number.parseFloat(e.target.value) || 0 })
                          }
                          className="rounded-l-none"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="description" className="text-right">
                        Description
                      </Label>
                      <Input
                        id="description"
                        value={newExpense.description}
                        onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="category" className="text-right">
                        Category
                      </Label>
                      <Select
                        value={newExpense.category}
                        onValueChange={(value) => setNewExpense({ ...newExpense, category: value as ExpenseCategory })}
                      >
                        <SelectTrigger id="category" className="col-span-3">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="accommodation">
                            <div className="flex items-center">
                              <Hotel className="mr-2 h-4 w-4" />
                              <span>Accommodation</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="food">
                            <div className="flex items-center">
                              <Utensils className="mr-2 h-4 w-4" />
                              <span>Food & Drinks</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="transportation">
                            <div className="flex items-center">
                              <Plane className="mr-2 h-4 w-4" />
                              <span>Transportation</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="activities">
                            <div className="flex items-center">
                              <Ticket className="mr-2 h-4 w-4" />
                              <span>Activities</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="shopping">
                            <div className="flex items-center">
                              <ShoppingBag className="mr-2 h-4 w-4" />
                              <span>Shopping</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="other">
                            <div className="flex items-center">
                              <CreditCard className="mr-2 h-4 w-4" />
                              <span>Other</span>
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="date" className="text-right">
                        Date
                      </Label>
                      <Input
                        id="date"
                        type="date"
                        value={newExpense.date}
                        onChange={(e) => setNewExpense({ ...newExpense, date: e.target.value })}
                        className="col-span-3"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button onClick={addExpense}>Add Expense</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            {/* Category breakdown */}
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Breakdown by Category</h4>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(categoryConfig).map(([category, config]) => {
                  const amount = categoryTotals[category as ExpenseCategory] || 0
                  const percentage = totalExpenses > 0 ? (amount / totalExpenses) * 100 : 0

                  return (
                    <div key={category} className="flex items-center gap-2">
                      <div className={`p-1.5 rounded-md ${config.color}`}>{config.icon}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between text-xs">
                          <span className="font-medium capitalize">{category}</span>
                          <span>€{amount.toFixed(2)}</span>
                        </div>
                        <div className="w-full h-1.5 bg-muted rounded-full mt-1 overflow-hidden">
                          <div className="h-full bg-primary" style={{ width: `${percentage}%` }} />
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Expense List */}
      <Card>
        <CardHeader>
          <CardTitle>Expense List</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4 w-full justify-start overflow-auto">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="accommodation">Accommodation</TabsTrigger>
              <TabsTrigger value="food">Food</TabsTrigger>
              <TabsTrigger value="transportation">Transportation</TabsTrigger>
              <TabsTrigger value="activities">Activities</TabsTrigger>
              <TabsTrigger value="shopping">Shopping</TabsTrigger>
              <TabsTrigger value="other">Other</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="mt-0">
              {filteredExpenses.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No expenses found. Add some expenses to your budget!
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredExpenses.map((expense) => (
                    <div
                      key={expense.id}
                      className="flex items-center justify-between p-3 border rounded-md bg-background hover:bg-accent/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-1.5 rounded-md ${categoryConfig[expense.category].color}`}>
                          {categoryConfig[expense.category].icon}
                        </div>
                        <div>
                          <p className="font-medium">{expense.description}</p>
                          <p className="text-xs text-muted-foreground">{new Date(expense.date).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">
                          {expense.currency} {expense.amount.toFixed(2)}
                        </Badge>
                        <Button variant="ghost" size="icon" onClick={() => deleteExpense(expense.id)}>
                          <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
