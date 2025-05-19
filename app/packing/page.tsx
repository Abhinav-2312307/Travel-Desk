import type { Metadata } from "next"
import PackingList from "@/components/packing/packing-list"

export const metadata: Metadata = {
  title: "Packing Checklist | TravelAI",
  description: "Create and manage your travel packing list with categories and smart suggestions.",
}

export default function PackingPage() {
  return (
    <div className="container py-12">
      <div className="max-w-5xl mx-auto">
        <div className="space-y-4 mb-8">
          <h1 className="text-3xl font-bold">Packing Checklist</h1>
          <p className="text-muted-foreground">
            Create and manage your travel packing list with categories and smart suggestions.
          </p>
        </div>

        <PackingList />
      </div>
    </div>
  )
}
