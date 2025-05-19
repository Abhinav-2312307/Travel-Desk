import type { Metadata } from "next"
import BudgetTracker from "@/components/budget/budget-tracker"
import CurrencyConverter from "@/components/budget/currency-converter"

export const metadata: Metadata = {
  title: "Budget Tracker | TravelAI",
  description: "Track your travel expenses and convert currencies for your trip.",
}

export default function BudgetPage() {
  return (
    <div className="container py-12">
      <div className="max-w-5xl mx-auto">
        <div className="space-y-4 mb-8">
          <h1 className="text-3xl font-bold">Budget Tracker</h1>
          <p className="text-muted-foreground">Track your travel expenses and convert currencies for your trip.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <BudgetTracker />
          </div>
          <div>
            <CurrencyConverter />
          </div>
        </div>
      </div>
    </div>
  )
}
