import Link from "next/link"
import {
  Map,
  Briefcase,
  DollarSign,
  Calendar,
  ImageIcon,
  CreditCard,
  Languages,
  PieChart,
  Plane,
  Palette,
  Sparkles,
  type LucideIcon,
} from "lucide-react"
import { cn } from "@/lib/utils"

type IconName =
  | "Map"
  | "Briefcase"
  | "DollarSign"
  | "Calendar"
  | "Image"
  | "CreditCard"
  | "Languages"
  | "PieChart"
  | "Plane"
  | "Palette"
  | "Sparkles"

const iconMap: Record<IconName, LucideIcon> = {
  Map,
  Briefcase,
  DollarSign,
  Calendar,
  Image: ImageIcon,
  CreditCard,
  Languages,
  PieChart,
  Plane,
  Palette,
  Sparkles,
}

interface FeatureCardProps {
  title: string
  description: string
  icon: IconName
  href: string
  className?: string
}

export default function FeatureCard({ title, description, icon, href, className }: FeatureCardProps) {
  const Icon = iconMap[icon]

  return (
    <Link href={href} className={cn("group", className)}>
      <div className="bg-background rounded-xl border p-6 shadow-sm transition-all duration-200 hover:shadow-md hover:border-primary/50 h-full">
        <div className="bg-primary/10 text-primary rounded-full w-12 h-12 flex items-center justify-center mb-4 transition-transform group-hover:scale-110">
          <Icon className="h-6 w-6" />
        </div>
        <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
      </div>
    </Link>
  )
}
