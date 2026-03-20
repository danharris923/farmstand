"use client"

import Image from "next/image"
import { MapPin, Star, ChevronRight } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

const farms = [
  {
    id: 1,
    name: "Willow Lane Farm",
    distance: "6.1 km away",
    rating: 4.9,
    reviews: 128,
    image: "https://images.unsplash.com/photo-1500076656116-558758c991c1?w=400&q=80",
    products: ["Vegetables", "Eggs", "Honey"],
    isOpen: true,
  },
  {
    id: 2,
    name: "Sunny Acres Farm",
    distance: "8.3 km away",
    rating: 4.8,
    reviews: 95,
    image: "https://images.unsplash.com/photo-1592982537447-6f2a6a0c8b8b?w=400&q=80",
    products: ["Berries", "Jam", "Preserves"],
    isOpen: true,
  },
  {
    id: 3,
    name: "Maple Grove Farm",
    distance: "12.5 km away",
    rating: 4.7,
    reviews: 67,
    image: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=400&q=80",
    products: ["Poultry", "Eggs", "Dairy"],
    isOpen: false,
  },
]

export function FeaturedFarms() {
  return (
    <section className="py-12 bg-secondary/50">
      <div className="container px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-foreground">
            Featured Farms
          </h2>
          <Button variant="ghost" className="text-primary">
            View All
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>

        {/* Farms Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {farms.map((farm) => (
            <Card key={farm.id} className="group overflow-hidden border-border hover:shadow-lg transition-all cursor-pointer">
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={farm.image}
                  alt={farm.name}
                  fill
                  className="object-cover transition-transform group-hover:scale-105"
                />
                <div className="absolute top-3 left-3">
                  <Badge 
                    variant={farm.isOpen ? "default" : "secondary"}
                    className={farm.isOpen ? "bg-primary text-primary-foreground" : ""}
                  >
                    {farm.isOpen ? "Open Now" : "Closed"}
                  </Badge>
                </div>
              </div>
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-lg text-foreground">
                    {farm.name}
                  </h3>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                    <span className="text-sm font-medium">{farm.rating}</span>
                    <span className="text-xs text-muted-foreground">({farm.reviews})</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-sm text-muted-foreground mb-3">
                  <MapPin className="h-4 w-4" />
                  {farm.distance}
                </div>
                <div className="flex flex-wrap gap-2">
                  {farm.products.map((product) => (
                    <Badge key={product} variant="outline" className="text-xs">
                      {product}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
