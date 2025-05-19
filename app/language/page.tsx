import type { Metadata } from "next"
import LanguageCheatSheet from "@/components/language/language-cheat-sheet"

export const metadata: Metadata = {
  title: "Language Guide | TravelAI",
  description: "Generate custom language cheat sheets for your travels.",
}

export default function LanguagePage() {
  return (
    <div className="container py-12">
      <div className="max-w-5xl mx-auto">
        <div className="space-y-4 mb-8">
          <h1 className="text-3xl font-bold">Language Cheat Sheet Generator</h1>
          <p className="text-muted-foreground">
            Create custom language guides based on your travel type and destination.
          </p>
        </div>

        <LanguageCheatSheet />
      </div>
    </div>
  )
}
