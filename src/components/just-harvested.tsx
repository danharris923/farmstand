"use client"

import Image from "next/image"
import { Plus, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

const products = [
  {
    id: 1,
    name: "Strawberries",
    farm: "Sunny Acres Farm",
    price: "$6",
    unit: "basket",
    image: "https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=400&q=80",
  },
  {
    id: 2,
    name: "Farm Fresh Eggs",
    farm: "Maple Grove Farm",
    price: "$6",
    unit: "Dozen",
    image: "https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=400&q=80",
  },
  {
    id: 3,
    name: "Asparagus Bunches",
    farm: "Willow Lane Farm",
    price: "$4",
    unit: "Bunch",
    image: "https://images.unsplash.com/photo-1515471209610-dae1c92d8777?w=400&q=80",
  },
  {
    id: 4,
    name: "Organic Tomatoes",
    farm: "Green Valley Farm",
    price: "$5",
    unit: "lb",
    image: "https://images.unsplash.com/photo-1546470427-e26264be0b0c?w=400&q=80",
  },
]

export function JustHarvested() {
  return (
    <section className="py-12 bg-background">
      <div className="container px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-foreground">
            Just Harvested Near You
          </h2>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" className="h-8 w-8 rounded-full">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" className="h-8 w-8 rounded-full">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {products.map((product) => (
            <Card key={product.id} className="group overflow-hidden border-border hover:shadow-lg transition-shadow">
              <div className="relative aspect-square overflow-hidden">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover transition-transform group-hover:scale-105"
                />
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold text-foreground truncate">
                  {product.name}
                </h3>
                <p className="text-sm text-muted-foreground truncate">
                  {product.farm}
                </p>
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-baseline gap-1">
                    <span className="text-lg font-bold text-foreground">
                      {product.price}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {product.unit}
                    </span>
                  </div>
                  <Button
                    size="sm"
                    className="h-8 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
