"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Globe,
  Menu,
  Home,
  Map,
  Briefcase,
  Calendar,
  CreditCard,
  ImageIcon,
  Languages,
  Plane,
  PieChart,
  Palette,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"

const routes = [
  { name: "Home", path: "/", icon: Home },
  { name: "Destinations", path: "/destinations", icon: Map },
  { name: "Packing List", path: "/packing", icon: Briefcase },
  { name: "Trip Planner", path: "/planner", icon: Calendar },
  { name: "Budget Tracker", path: "/budget", icon: CreditCard },
  { name: "Gallery", path: "/gallery", icon: ImageIcon },
  { name: "Language Guide", path: "/language", icon: Languages },
  { name: "Itinerary", path: "/itinerary", icon: PieChart },
  { name: "Airport Guide", path: "/airport", icon: Plane },
  { name: "Moodboard", path: "/moodboard", icon: Palette },
]

export default function Navigation() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2 font-bold text-xl">
          <Globe className="h-6 w-6 text-primary" />
          <span>TravelAI</span>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          {routes.slice(0, 5).map((route) => (
            <Link
              key={route.path}
              href={route.path}
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                pathname === route.path ? "text-primary" : "text-muted-foreground",
              )}
            >
              {route.name}
            </Link>
          ))}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="text-muted-foreground">
                More <Menu className="ml-1 h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <div className="grid gap-2 py-6">
                {routes.slice(5).map((route) => (
                  <Link
                    key={route.path}
                    href={route.path}
                    className={cn(
                      "flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md hover:bg-accent",
                      pathname === route.path ? "bg-accent text-accent-foreground" : "text-muted-foreground",
                    )}
                    onClick={() => setOpen(false)}
                  >
                    <route.icon className="h-4 w-4" />
                    {route.name}
                  </Link>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </nav>

        {/* Mobile Navigation */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px] sm:w-[400px]">
            <div className="flex items-center gap-2 font-bold text-xl mb-8">
              <Globe className="h-6 w-6 text-primary" />
              <span>TravelAI</span>
            </div>
            <nav className="grid gap-2">
              {routes.map((route) => (
                <Link
                  key={route.path}
                  href={route.path}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md hover:bg-accent",
                    pathname === route.path ? "bg-accent text-accent-foreground" : "text-muted-foreground",
                  )}
                >
                  <route.icon className="h-4 w-4" />
                  {route.name}
                </Link>
              ))}
            </nav>
          </SheetContent>
        </Sheet>

        <div className="hidden md:flex items-center gap-4">
          <Link
            href="/login"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Log in
          </Link>
          <Link
            href="/signup"
            className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
          >
            Sign up
          </Link>
        </div>
      </div>
    </header>
  )
}
