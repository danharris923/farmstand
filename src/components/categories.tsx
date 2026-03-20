"use client"

import Link from "next/link"
import { Apple, Egg, Drumstick, Milk, Tag, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

const categories = [
  { name: "Fruits & Veggies", icon: Apple, color: "bg-green-50 text-green-600 border-green-100" },
  { name: "Farm Fresh Eggs", icon: Egg, color: "bg-amber-50 text-amber-600 border-amber-100" },
  { name: "Meat & Poultry", icon: Drumstick, color: "bg-red-50 text-red-600 border-red-100" },
  { name: "Dairy & Honey", icon: Milk, color: "bg-yellow-50 text-yellow-600 border-yellow-100" },
  { name: "Sales & More", icon: Tag, color: "bg-blue-50 text-blue-600 border-blue-100" },
]

export function Categories() {
  return (
    <section className="py-4 sm:py-8 border-b border-border bg-card">
      <div className="container px-4">
        <div className="flex items-center gap-2 sm:gap-4 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4 snap-x snap-mandatory">
          {categories.map((category) => (
            <button
              key={category.name}
              className={`flex flex-col items-center gap-1.5 sm:gap-2 min-w-[80px] sm:min-w-[100px] p-3 sm:p-4 rounded-xl border transition-all active:scale-95 hover:shadow-md snap-start ${category.color}`}
            >
              <category.icon className="h-6 w-6 sm:h-8 sm:w-8" />
              <span className="text-[10px] sm:text-xs font-medium text-center whitespace-nowrap">
                {category.name}
              </span>
            </button>
          ))}
          <Link href="/farms" className="snap-start">
            <Button
              variant="outline"
              className="flex items-center gap-1 min-w-[80px] sm:min-w-[100px] h-auto py-3 sm:py-4 rounded-xl"
            >
              <span className="text-[10px] sm:text-xs font-medium">View All</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
