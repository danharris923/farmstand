"use client"

import { Apple, Egg, Drumstick, Milk, Tag, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

const categories = [
  {
    name: "Fruits & Veggies",
    icon: Apple,
    color: "bg-green-50 text-green-600 border-green-100",
  },
  {
    name: "Farm Fresh Eggs",
    icon: Egg,
    color: "bg-amber-50 text-amber-600 border-amber-100",
  },
  {
    name: "Meat & Poultry",
    icon: Drumstick,
    color: "bg-red-50 text-red-600 border-red-100",
  },
  {
    name: "Dairy & Honey",
    icon: Milk,
    color: "bg-yellow-50 text-yellow-600 border-yellow-100",
  },
  {
    name: "Sales & More",
    icon: Tag,
    color: "bg-blue-50 text-blue-600 border-blue-100",
  },
]

export function Categories() {
  return (
    <section className="py-8 border-b border-border bg-card">
      <div className="container px-4">
        <div className="flex items-center gap-4 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map((category) => (
            <button
              key={category.name}
              className={`flex flex-col items-center gap-2 min-w-[100px] p-4 rounded-xl border transition-all hover:shadow-md hover:-translate-y-0.5 ${category.color}`}
            >
              <category.icon className="h-8 w-8" />
              <span className="text-xs font-medium text-center whitespace-nowrap">
                {category.name}
              </span>
            </button>
          ))}
          <Button
            variant="outline"
            className="flex items-center gap-1 min-w-[100px] h-auto py-4 rounded-xl"
          >
            <span className="text-xs font-medium">View All</span>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  )
}
