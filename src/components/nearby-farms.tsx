"use client";

import Image from "next/image";
import Link from "next/link";
import { MapPin, ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import type { MarketWithDetails } from "@/lib/types";

// Product images mapped to keywords
const productImages: Record<string, string> = {
  fruit: "https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=400&q=80",
  vegetable: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&q=80",
  egg: "https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=400&q=80",
  meat: "https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=400&q=80",
  dairy: "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&q=80",
  honey: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=400&q=80",
  berry: "https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=400&q=80",
  seafood: "https://images.unsplash.com/photo-1615141982883-c7ad0e69fd62?w=400&q=80",
  baking: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&q=80",
  plant: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&q=80",
  default: "https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=400&q=80",
};

function getProductImage(market: MarketWithDetails): string {
  const desc = (market.description || market.name || "").toLowerCase();
  if (desc.includes("berry") || desc.includes("strawber")) return productImages.berry;
  if (desc.includes("egg") || desc.includes("poultry")) return productImages.egg;
  if (desc.includes("meat") || desc.includes("beef") || desc.includes("pork")) return productImages.meat;
  if (desc.includes("dairy") || desc.includes("cheese") || desc.includes("milk")) return productImages.dairy;
  if (desc.includes("honey") || desc.includes("apiar")) return productImages.honey;
  if (desc.includes("seafood") || desc.includes("fish")) return productImages.seafood;
  if (desc.includes("bak") || desc.includes("bread")) return productImages.baking;
  if (desc.includes("plant") || desc.includes("nursery") || desc.includes("flower")) return productImages.plant;
  if (desc.includes("fruit") || desc.includes("orchard") || desc.includes("apple")) return productImages.fruit;
  if (desc.includes("veget") || desc.includes("produce") || desc.includes("farm")) return productImages.vegetable;
  return productImages.default;
}

function formatDistance(meters: number | undefined): string {
  if (!meters) return "";
  const km = meters / 1000;
  return km < 1 ? `${Math.round(meters)}m` : `${km.toFixed(1)}km`;
}

export function NearbyFarms({
  markets,
  loading,
}: {
  markets: MarketWithDetails[];
  loading: boolean;
}) {
  const nearby = markets.slice(0, 8);

  return (
    <section className="py-12 bg-background">
      <div className="container px-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-foreground">
            Just Harvested Near You
          </h2>
          <div className="flex items-center gap-2">
            <Link href="/map">
              <Button variant="ghost" className="text-primary text-sm">
                View Map
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <Skeleton className="aspect-square" />
                <CardContent className="p-4 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {nearby.map((market) => (
              <Card
                key={market.id}
                className="group overflow-hidden border-border hover:shadow-lg transition-shadow"
              >
                <div className="relative aspect-square overflow-hidden">
                  <Image
                    src={market.image_url || getProductImage(market)}
                    alt={market.name}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                  />
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-foreground truncate text-sm">
                    {market.name}
                  </h3>
                  <p className="text-xs text-muted-foreground truncate">
                    {market.city || market.address}
                  </p>
                  <div className="flex items-center justify-between mt-3">
                    {market.distance_meters ? (
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        {formatDistance(market.distance_meters)}
                      </div>
                    ) : (
                      <div />
                    )}
                    {market.website ? (
                      <a
                        href={
                          market.website.startsWith("http")
                            ? market.website
                            : `https://${market.website}`
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button
                          size="sm"
                          className="h-7 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full text-xs px-3"
                        >
                          Visit
                          <ExternalLink className="h-3 w-3 ml-1" />
                        </Button>
                      </a>
                    ) : (
                      <Badge variant="secondary" className="text-[10px]">
                        {market.season_type || "Local"}
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
