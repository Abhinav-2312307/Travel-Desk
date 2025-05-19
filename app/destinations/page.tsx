import type { Metadata } from "next"
import DestinationExplorer from "@/components/destinations/destination-explorer"

export const metadata: Metadata = {
  title: "Destinations | TravelAI",
  description: "Explore travel destinations with filters for regions, activities, and more.",
}

export default function DestinationsPage() {
  return (
    <div className="container py-12">
      <div className="max-w-7xl mx-auto">
        <div className="space-y-4 mb-8">
          <h1 className="text-3xl font-bold">Destination Explorer</h1>
          <p className="text-muted-foreground">
            Discover your next adventure. Browse destinations by region, climate, and activities.
          </p>
        </div>

        <DestinationExplorer />
      </div>
    </div>
  )
}
