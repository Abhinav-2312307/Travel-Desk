"use client"

import { useState } from "react"
import { Search, MapPin, Sun, Umbrella } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

// Define types
type Region = "asia" | "europe" | "northAmerica" | "southAmerica" | "africa" | "oceania"
type Climate = "tropical" | "mediterranean" | "continental" | "polar" | "arid" | "temperate"
type Activity = "beach" | "hiking" | "cityExplore" | "food" | "culture" | "wildlife" | "skiing"

type Destination = {
  id: string
  name: string
  country: string
  region: Region
  emoji: string
  climate: Climate[]
  activities: Activity[]
  description: string
  imageUrl: string
}

// Region emoji mapping
const regionEmojis: Record<Region, string> = {
  asia: "🌏",
  europe: "🇪🇺",
  northAmerica: "🌎",
  southAmerica: "🌎",
  africa: "🌍",
  oceania: "🌏",
}

// Climate emoji mapping
const climateEmojis: Record<Climate, string> = {
  tropical: "🌴",
  mediterranean: "🍊",
  continental: "🍁",
  polar: "❄️",
  arid: "🏜️",
  temperate: "🌿",
}

// Activity emoji mapping
const activityEmojis: Record<Activity, string> = {
  beach: "🏖️",
  hiking: "🥾",
  cityExplore: "🏙️",
  food: "🍜",
  culture: "🏛️",
  wildlife: "🦁",
  skiing: "⛷️",
}

// Sample destinations data
const destinations: Destination[] = [
  {
    id: "1",
    name: "Bali",
    country: "Indonesia",
    region: "asia",
    emoji: "🇮🇩",
    climate: ["tropical"],
    activities: ["beach", "culture", "food"],
    description: "Tropical paradise with beautiful beaches, vibrant culture, and delicious cuisine.",
    imageUrl: "/placeholder.svg?height=300&width=500&text=Bali",
  },
  {
    id: "2",
    name: "Paris",
    country: "France",
    region: "europe",
    emoji: "🇫🇷",
    climate: ["continental", "temperate"],
    activities: ["cityExplore", "culture", "food"],
    description: "The City of Light offers iconic landmarks, world-class museums, and exquisite dining.",
    imageUrl: "/placeholder.svg?height=300&width=500&text=Paris",
  },
  {
    id: "3",
    name: "New York",
    country: "United States",
    region: "northAmerica",
    emoji: "🇺🇸",
    climate: ["continental"],
    activities: ["cityExplore", "food", "culture"],
    description: "The Big Apple features skyscrapers, Broadway shows, and diverse neighborhoods.",
    imageUrl: "/placeholder.svg?height=300&width=500&text=New+York",
  },
  {
    id: "4",
    name: "Cape Town",
    country: "South Africa",
    region: "africa",
    emoji: "🇿🇦",
    climate: ["mediterranean"],
    activities: ["beach", "hiking", "wildlife"],
    description: "Stunning coastal city with Table Mountain, beaches, and nearby wildlife reserves.",
    imageUrl: "/placeholder.svg?height=300&width=500&text=Cape+Town",
  },
  {
    id: "5",
    name: "Tokyo",
    country: "Japan",
    region: "asia",
    emoji: "🇯🇵",
    climate: ["temperate"],
    activities: ["cityExplore", "food", "culture"],
    description: "Ultra-modern metropolis with ancient temples, innovative technology, and incredible food.",
    imageUrl: "/placeholder.svg?height=300&width=500&text=Tokyo",
  },
  {
    id: "6",
    name: "Rio de Janeiro",
    country: "Brazil",
    region: "southAmerica",
    emoji: "🇧🇷",
    climate: ["tropical"],
    activities: ["beach", "hiking", "culture"],
    description: "Vibrant city with iconic beaches, Christ the Redeemer, and samba culture.",
    imageUrl: "/placeholder.svg?height=300&width=500&text=Rio+de+Janeiro",
  },
  {
    id: "7",
    name: "Sydney",
    country: "Australia",
    region: "oceania",
    emoji: "🇦🇺",
    climate: ["temperate"],
    activities: ["beach", "cityExplore", "culture"],
    description: "Harbor city known for the Opera House, beautiful beaches, and laid-back lifestyle.",
    imageUrl: "/placeholder.svg?height=300&width=500&text=Sydney",
  },
  {
    id: "8",
    name: "Marrakech",
    country: "Morocco",
    region: "africa",
    emoji: "🇲🇦",
    climate: ["arid"],
    activities: ["culture", "food", "cityExplore"],
    description: "Ancient city with vibrant souks, palaces, and a rich cultural heritage.",
    imageUrl: "/placeholder.svg?height=300&width=500&text=Marrakech",
  },
  {
    id: "9",
    name: "Swiss Alps",
    country: "Switzerland",
    region: "europe",
    emoji: "🇨🇭",
    climate: ["continental", "polar"],
    activities: ["skiing", "hiking"],
    description: "Majestic mountain range perfect for skiing in winter and hiking in summer.",
    imageUrl: "/placeholder.svg?height=300&width=500&text=Swiss+Alps",
  },
  {
    id: "10",
    name: "Bangkok",
    country: "Thailand",
    region: "asia",
    emoji: "🇹🇭",
    climate: ["tropical"],
    activities: ["food", "culture", "cityExplore"],
    description: "Bustling city with ornate shrines, floating markets, and amazing street food.",
    imageUrl: "/placeholder.svg?height=300&width=500&text=Bangkok",
  },
  {
    id: "11",
    name: "Vancouver",
    country: "Canada",
    region: "northAmerica",
    emoji: "🇨🇦",
    climate: ["temperate"],
    activities: ["hiking", "cityExplore"],
    description: "Coastal city surrounded by mountains, offering urban amenities and outdoor adventures.",
    imageUrl: "/placeholder.svg?height=300&width=500&text=Vancouver",
  },
  {
    id: "12",
    name: "Santorini",
    country: "Greece",
    region: "europe",
    emoji: "🇬🇷",
    climate: ["mediterranean"],
    activities: ["beach", "culture"],
    description: "Stunning island with white-washed buildings, blue domes, and spectacular sunsets.",
    imageUrl: "/placeholder.svg?height=300&width=500&text=Santorini",
  },
]

export default function DestinationExplorer() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedRegions, setSelectedRegions] = useState<Region[]>([])
  const [selectedClimates, setSelectedClimates] = useState<Climate[]>([])
  const [selectedActivities, setSelectedActivities] = useState<Activity[]>([])
  const [selectedDestination, setSelectedDestination] = useState<Destination | null>(null)

  // Filter destinations based on search and filters
  const filteredDestinations = destinations.filter((destination) => {
    // Search filter
    const matchesSearch =
      searchQuery === "" ||
      destination.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      destination.country.toLowerCase().includes(searchQuery.toLowerCase())

    // Region filter
    const matchesRegion = selectedRegions.length === 0 || selectedRegions.includes(destination.region)

    // Climate filter
    const matchesClimate =
      selectedClimates.length === 0 || destination.climate.some((climate) => selectedClimates.includes(climate))

    // Activity filter
    const matchesActivity =
      selectedActivities.length === 0 ||
      destination.activities.some((activity) => selectedActivities.includes(activity))

    return matchesSearch && matchesRegion && matchesClimate && matchesActivity
  })

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search destinations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex gap-2">
          {/* Region Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex gap-2">
                <MapPin className="h-4 w-4" />
                Regions
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Filter by Region</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem
                checked={selectedRegions.includes("asia")}
                onCheckedChange={(checked) => {
                  setSelectedRegions(
                    checked ? [...selectedRegions, "asia"] : selectedRegions.filter((r) => r !== "asia"),
                  )
                }}
              >
                {regionEmojis.asia} Asia
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={selectedRegions.includes("europe")}
                onCheckedChange={(checked) => {
                  setSelectedRegions(
                    checked ? [...selectedRegions, "europe"] : selectedRegions.filter((r) => r !== "europe"),
                  )
                }}
              >
                {regionEmojis.europe} Europe
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={selectedRegions.includes("northAmerica")}
                onCheckedChange={(checked) => {
                  setSelectedRegions(
                    checked
                      ? [...selectedRegions, "northAmerica"]
                      : selectedRegions.filter((r) => r !== "northAmerica"),
                  )
                }}
              >
                {regionEmojis.northAmerica} North America
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={selectedRegions.includes("southAmerica")}
                onCheckedChange={(checked) => {
                  setSelectedRegions(
                    checked
                      ? [...selectedRegions, "southAmerica"]
                      : selectedRegions.filter((r) => r !== "southAmerica"),
                  )
                }}
              >
                {regionEmojis.southAmerica} South America
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={selectedRegions.includes("africa")}
                onCheckedChange={(checked) => {
                  setSelectedRegions(
                    checked ? [...selectedRegions, "africa"] : selectedRegions.filter((r) => r !== "africa"),
                  )
                }}
              >
                {regionEmojis.africa} Africa
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={selectedRegions.includes("oceania")}
                onCheckedChange={(checked) => {
                  setSelectedRegions(
                    checked ? [...selectedRegions, "oceania"] : selectedRegions.filter((r) => r !== "oceania"),
                  )
                }}
              >
                {regionEmojis.oceania} Oceania
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Climate Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex gap-2">
                <Sun className="h-4 w-4" />
                Climate
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Filter by Climate</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem
                checked={selectedClimates.includes("tropical")}
                onCheckedChange={(checked) => {
                  setSelectedClimates(
                    checked ? [...selectedClimates, "tropical"] : selectedClimates.filter((c) => c !== "tropical"),
                  )
                }}
              >
                {climateEmojis.tropical} Tropical
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={selectedClimates.includes("mediterranean")}
                onCheckedChange={(checked) => {
                  setSelectedClimates(
                    checked
                      ? [...selectedClimates, "mediterranean"]
                      : selectedClimates.filter((c) => c !== "mediterranean"),
                  )
                }}
              >
                {climateEmojis.mediterranean} Mediterranean
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={selectedClimates.includes("continental")}
                onCheckedChange={(checked) => {
                  setSelectedClimates(
                    checked
                      ? [...selectedClimates, "continental"]
                      : selectedClimates.filter((c) => c !== "continental"),
                  )
                }}
              >
                {climateEmojis.continental} Continental
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={selectedClimates.includes("polar")}
                onCheckedChange={(checked) => {
                  setSelectedClimates(
                    checked ? [...selectedClimates, "polar"] : selectedClimates.filter((c) => c !== "polar"),
                  )
                }}
              >
                {climateEmojis.polar} Polar
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={selectedClimates.includes("arid")}
                onCheckedChange={(checked) => {
                  setSelectedClimates(
                    checked ? [...selectedClimates, "arid"] : selectedClimates.filter((c) => c !== "arid"),
                  )
                }}
              >
                {climateEmojis.arid} Arid
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={selectedClimates.includes("temperate")}
                onCheckedChange={(checked) => {
                  setSelectedClimates(
                    checked ? [...selectedClimates, "temperate"] : selectedClimates.filter((c) => c !== "temperate"),
                  )
                }}
              >
                {climateEmojis.temperate} Temperate
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Activities Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex gap-2">
                <Umbrella className="h-4 w-4" />
                Activities
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Filter by Activities</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem
                checked={selectedActivities.includes("beach")}
                onCheckedChange={(checked) => {
                  setSelectedActivities(
                    checked ? [...selectedActivities, "beach"] : selectedActivities.filter((a) => a !== "beach"),
                  )
                }}
              >
                {activityEmojis.beach} Beach
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={selectedActivities.includes("hiking")}
                onCheckedChange={(checked) => {
                  setSelectedActivities(
                    checked ? [...selectedActivities, "hiking"] : selectedActivities.filter((a) => a !== "hiking"),
                  )
                }}
              >
                {activityEmojis.hiking} Hiking
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={selectedActivities.includes("cityExplore")}
                onCheckedChange={(checked) => {
                  setSelectedActivities(
                    checked
                      ? [...selectedActivities, "cityExplore"]
                      : selectedActivities.filter((a) => a !== "cityExplore"),
                  )
                }}
              >
                {activityEmojis.cityExplore} City Exploration
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={selectedActivities.includes("food")}
                onCheckedChange={(checked) => {
                  setSelectedActivities(
                    checked ? [...selectedActivities, "food"] : selectedActivities.filter((a) => a !== "food"),
                  )
                }}
              >
                {activityEmojis.food} Food & Cuisine
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={selectedActivities.includes("culture")}
                onCheckedChange={(checked) => {
                  setSelectedActivities(
                    checked ? [...selectedActivities, "culture"] : selectedActivities.filter((a) => a !== "culture"),
                  )
                }}
              >
                {activityEmojis.culture} Culture & History
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={selectedActivities.includes("wildlife")}
                onCheckedChange={(checked) => {
                  setSelectedActivities(
                    checked ? [...selectedActivities, "wildlife"] : selectedActivities.filter((a) => a !== "wildlife"),
                  )
                }}
              >
                {activityEmojis.wildlife} Wildlife
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={selectedActivities.includes("skiing")}
                onCheckedChange={(checked) => {
                  setSelectedActivities(
                    checked ? [...selectedActivities, "skiing"] : selectedActivities.filter((a) => a !== "skiing"),
                  )
                }}
              >
                {activityEmojis.skiing} Skiing
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Clear Filters */}
          {(selectedRegions.length > 0 || selectedClimates.length > 0 || selectedActivities.length > 0) && (
            <Button
              variant="ghost"
              onClick={() => {
                setSelectedRegions([])
                setSelectedClimates([])
                setSelectedActivities([])
              }}
            >
              Clear Filters
            </Button>
          )}
        </div>
      </div>

      {/* Active Filters */}
      {(selectedRegions.length > 0 || selectedClimates.length > 0 || selectedActivities.length > 0) && (
        <div className="flex flex-wrap gap-2">
          {selectedRegions.map((region) => (
            <Badge key={region} variant="outline" className="flex items-center gap-1">
              {regionEmojis[region]} {region.charAt(0).toUpperCase() + region.slice(1).replace(/([A-Z])/g, " $1")}
              <button
                className="ml-1 rounded-full hover:bg-accent w-4 h-4 inline-flex items-center justify-center"
                onClick={() => setSelectedRegions(selectedRegions.filter((r) => r !== region))}
              >
                ×
              </button>
            </Badge>
          ))}

          {selectedClimates.map((climate) => (
            <Badge key={climate} variant="outline" className="flex items-center gap-1">
              {climateEmojis[climate]} {climate.charAt(0).toUpperCase() + climate.slice(1)}
              <button
                className="ml-1 rounded-full hover:bg-accent w-4 h-4 inline-flex items-center justify-center"
                onClick={() => setSelectedClimates(selectedClimates.filter((c) => c !== climate))}
              >
                ×
              </button>
            </Badge>
          ))}

          {selectedActivities.map((activity) => (
            <Badge key={activity} variant="outline" className="flex items-center gap-1">
              {activityEmojis[activity]}{" "}
              {activity.charAt(0).toUpperCase() + activity.slice(1).replace(/([A-Z])/g, " $1")}
              <button
                className="ml-1 rounded-full hover:bg-accent w-4 h-4 inline-flex items-center justify-center"
                onClick={() => setSelectedActivities(selectedActivities.filter((a) => a !== activity))}
              >
                ×
              </button>
            </Badge>
          ))}
        </div>
      )}

      {/* Destinations Grid */}
      {filteredDestinations.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            No destinations match your filters. Try adjusting your search criteria.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredDestinations.map((destination) => (
            <Dialog key={destination.id}>
              <DialogTrigger asChild>
                <Card className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow">
                  <div className="aspect-[4/3] relative">
                    <img
                      src={destination.imageUrl || "/placeholder.svg"}
                      alt={destination.name}
                      className="object-cover w-full h-full"
                    />
                    <div className="absolute top-2 right-2">
                      <Badge className="text-lg">{destination.emoji}</Badge>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      <div>
                        <h3 className="font-semibold text-lg">{destination.name}</h3>
                        <p className="text-sm text-muted-foreground">{destination.country}</p>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {destination.climate.map((climate) => (
                          <Badge key={climate} variant="outline" className="text-xs">
                            {climateEmojis[climate]} {climate.charAt(0).toUpperCase() + climate.slice(1)}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {destination.activities.map((activity) => (
                          <Badge key={activity} variant="secondary" className="text-xs">
                            {activityEmojis[activity]}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2 text-2xl">
                    {destination.name} {destination.emoji}
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="aspect-video overflow-hidden rounded-md">
                    <img
                      src={destination.imageUrl || "/placeholder.svg"}
                      alt={destination.name}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <div>
                    <h4 className="font-medium text-lg">{destination.country}</h4>
                    <p className="text-muted-foreground">{destination.description}</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium">Climate</h4>
                    <div className="flex flex-wrap gap-2">
                      {destination.climate.map((climate) => (
                        <Badge key={climate} variant="outline">
                          {climateEmojis[climate]} {climate.charAt(0).toUpperCase() + climate.slice(1)}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium">Activities</h4>
                    <div className="flex flex-wrap gap-2">
                      {destination.activities.map((activity) => (
                        <Badge key={activity} variant="secondary">
                          {activityEmojis[activity]}{" "}
                          {activity.charAt(0).toUpperCase() + activity.slice(1).replace(/([A-Z])/g, " $1")}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <Button>Plan a Trip Here</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          ))}
        </div>
      )}
    </div>
  )
}
