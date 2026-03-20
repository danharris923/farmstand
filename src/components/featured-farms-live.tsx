"use client";

import Image from "next/image";
import Link from "next/link";
import { MapPin, Phone, Globe, ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { MarketWithDetails } from "@/lib/types";

const seasonColors: Record<string, string> = {
  summer: "bg-green-100 text-green-700",
  winter: "bg-blue-100 text-blue-700",
  "year-round": "bg-purple-100 text-purple-700",
};

function formatDistance(meters: number | undefined): string {
  if (!meters) return "";
  const km = meters / 1000;
  return km < 1 ? `${Math.round(meters)}m away` : `${km.toFixed(1)} km away`;
}

export function FeaturedFarms({
  markets,
  loading,
}: {
  markets: MarketWithDetails[];
  loading: boolean;
}) {
  // Show markets that have images or descriptions (richer data = featured)
  const featured = markets
    .filter((m) => m.image_url || m.description || m.website)
    .slice(0, 6);

  return (
    <section className="py-12 bg-secondary/50">
      <div className="container px-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-foreground">
            Featured Farms & Markets
          </h2>
          <Link href="/farms">
            <Button variant="ghost" className="text-primary">
              View All
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </Link>
        </div>

        {loading ? (
          <div className="grid md:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <Skeleton className="h-48" />
                <CardContent className="p-4 space-y-2">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-4 w-1/3" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {featured.map((market) => (
              <Card
                key={market.id}
                className="group overflow-hidden border-border hover:shadow-lg transition-all cursor-pointer"
              >
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={
                      market.image_url ||
                      "https://images.unsplash.com/photo-1500076656116-558758c991c1?w=400&q=80"
                    }
                    alt={market.name}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                  />
                  <div className="absolute top-3 left-3 flex gap-1.5">
                    {market.season_type && (
                      <Badge
                        className={`${seasonColors[market.season_type] || ""} text-xs`}
                      >
                        {market.season_type}
                      </Badge>
                    )}
                  </div>
                </div>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-lg text-foreground line-clamp-1">
                      {market.name}
                    </h3>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
                    <MapPin className="h-4 w-4 shrink-0" />
                    <span className="truncate">
                      {market.city}
                      {market.distance_meters
                        ? ` · ${formatDistance(market.distance_meters)}`
                        : ""}
                    </span>
                  </div>
                  {market.description && (
                    <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
                      {market.description}
                    </p>
                  )}
                  <div className="flex items-center gap-2">
                    {market.website && (
                      <a
                        href={
                          market.website.startsWith("http")
                            ? market.website
                            : `https://${market.website}`
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                      >
                        <Globe className="h-3 w-3" />
                        Website
                      </a>
                    )}
                    {market.phone && (
                      <a
                        href={`tel:${market.phone}`}
                        className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
                      >
                        <Phone className="h-3 w-3" />
                        {market.phone}
                      </a>
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
