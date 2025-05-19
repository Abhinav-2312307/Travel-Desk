import type { Metadata } from "next"
import TripPlanner from "@/components/planner/trip-planner"

export const metadata: Metadata = {
  title: "Trip Planner | TravelAI",
  description: "Plan your daily activities and keep track of your trip countdown.",
}

export default function PlannerPage() {
  return (
    <div className="container py-12">
      <div className="max-w-6xl mx-auto">
        <div className="space-y-4 mb-8">
          <h1 className="text-3xl font-bold">Trip Planner</h1>
          <p className="text-muted-foreground">Plan your daily activities and keep track of your trip countdown.</p>
        </div>

        <TripPlanner />
      </div>
    </div>
  )
}
