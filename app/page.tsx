import Link from "next/link"
import { ArrowRight, Globe } from "lucide-react"
import FeatureCard from "@/components/feature-card"
import ChatInterface from "@/components/chat-interface"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <section className="container py-24 md:py-32 flex flex-col md:flex-row items-center gap-8">
        <div className="flex-1 space-y-6">
          <div className="inline-flex items-center rounded-full border px-4 py-1.5 text-sm font-medium">
            <span className="flex h-2 w-2 rounded-full bg-primary mr-2"></span>
            <span>Introducing TravelAI 2.0</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold leading-tight">
            Plan Your Perfect Trip with <span className="text-primary">AI Assistance</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-[600px]">
            Your all-in-one travel companion. Plan, organize, and book your entire trip through a simple conversation
            with our AI assistant.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="#features"
              className="inline-flex h-11 items-center justify-center rounded-md bg-primary px-8 py-3 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
            >
              Explore Features <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
            <Link
              href="#chat"
              className="inline-flex h-11 items-center justify-center rounded-md border border-input bg-background px-8 py-3 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              Try AI Assistant
            </Link>
          </div>
        </div>
        <div className="flex-1 flex justify-center">
          <div className="relative w-full max-w-[500px] aspect-square rounded-lg overflow-hidden shadow-xl">
            <img
              src="/placeholder.svg?height=500&width=500&text=Travel+with+AI"
              alt="Travel destinations collage"
              className="object-cover w-full h-full"
            />
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="bg-muted/50 py-24">
        <div className="container">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold">Powerful Travel Planning Tools</h2>
            <p className="text-xl text-muted-foreground max-w-[800px] mx-auto">
              Everything you need to plan the perfect trip, all in one place.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard
              title="Destination Explorer"
              description="Browse and filter destinations by region, climate, and activities with helpful emoji indicators."
              icon="Map"
              href="/destinations"
            />
            <FeatureCard
              title="Packing Checklist"
              description="Create customized packing lists organized by categories to ensure you never forget essentials."
              icon="Briefcase"
              href="/packing"
            />
            <FeatureCard
              title="Currency Converter"
              description="Quickly convert between currencies to help budget and plan your expenses abroad."
              icon="DollarSign"
              href="/budget"
            />
            <FeatureCard
              title="Trip Countdown & Planner"
              description="Track the days until your trip and organize daily activities with notes."
              icon="Calendar"
              href="/planner"
            />
            <FeatureCard
              title="Travel Gallery"
              description="Create and share beautiful galleries of your travel experiences with expandable images."
              icon="Image"
              href="/gallery"
            />
            <FeatureCard
              title="Budget Tracker"
              description="Keep track of all your travel expenses with category breakdowns and totals."
              icon="CreditCard"
              href="/budget"
            />
            <FeatureCard
              title="Language Guide"
              description="Generate custom language cheat sheets based on your travel type and destination."
              icon="Languages"
              href="/language"
            />
            <FeatureCard
              title="Interactive Itinerary"
              description="Build and customize your daily plans with an intuitive drag-and-drop interface."
              icon="PieChart"
              href="/itinerary"
            />
            <FeatureCard
              title="Airport Navigation"
              description="Find your way around airports with gate filtering and terminal maps."
              icon="Plane"
              href="/airport"
            />
            <FeatureCard
              title="Trip Moodboard"
              description="Create visual inspiration boards for your upcoming trips with custom stickers."
              icon="Palette"
              href="/moodboard"
            />
            <FeatureCard
              title="AI Travel Assistant"
              description="Get personalized recommendations and book your travel through natural conversation."
              icon="Sparkles"
              href="#chat"
              className="md:col-span-2 lg:col-span-1"
            />
          </div>
        </div>
      </section>

      {/* Chat Interface */}
      <section id="chat" className="py-24">
        <div className="container">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold">AI Travel Assistant</h2>
            <p className="text-xl text-muted-foreground max-w-[800px] mx-auto">
              Ask about flights, hotels, or activities. Our AI will help you plan and book your perfect trip.
            </p>
          </div>
          <div className="max-w-3xl mx-auto">
            <ChatInterface />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-background border-t border-border/40 py-12">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 font-bold text-xl mb-4 md:mb-0">
              <Globe className="h-6 w-6 text-primary" />
              <span>TravelAI</span>
            </div>
            <div className="flex flex-col md:flex-row gap-4 md:gap-8">
              <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                Privacy Policy
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                Terms of Service
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                Contact Us
              </Link>
            </div>
          </div>
          <div className="mt-8 text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} TravelAI. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}
