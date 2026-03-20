"use client";

import { useState } from "react";
import Image from "next/image";
import { MapPin, Globe, Map, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapModal } from "@/components/map-modal";
import type { MarketWithDetails } from "@/lib/types";

const seasonColors: Record<string, string> = {
  summer: "bg-green-100 text-green-700",
  winter: "bg-blue-100 text-blue-700",
  "year-round": "bg-purple-100 text-purple-700",
};

const productImages: Record<string, string> = {
  berry: "https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=400&q=80",
  egg: "https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=400&q=80",
  meat: "https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=400&q=80",
  dairy: "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&q=80",
  honey: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=400&q=80",
  seafood: "https://images.unsplash.com/photo-1615141982883-c7ad0e69fd62?w=400&q=80",
  vegetable: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&q=80",
  fruit: "https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=400&q=80",
  default: "https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=400&q=80",
};

function getImage(m: MarketWithDetails): string {
  if (m.image_url) return m.image_url;
  const d = (m.description || m.name || "").toLowerCase();
  if (d.includes("berry") || d.includes("strawber")) return productImages.berry;
  if (d.includes("egg") || d.includes("poultry")) return productImages.egg;
  if (d.includes("meat") || d.includes("beef") || d.includes("pork")) return productImages.meat;
  if (d.includes("dairy") || d.includes("cheese")) return productImages.dairy;
  if (d.includes("honey")) return productImages.honey;
  if (d.includes("seafood") || d.includes("fish")) return productImages.seafood;
  if (d.includes("fruit") || d.includes("orchard")) return productImages.fruit;
  if (d.includes("veget") || d.includes("produce")) return productImages.vegetable;
  return productImages.default;
}

function formatDistance(meters: number | undefined): string {
  if (!meters) return "";
  const km = meters / 1000;
  return km < 1 ? `${Math.round(meters)}m` : `${km.toFixed(1)}km`;
}

export function FarmCard({
  market,
  variant = "small",
}: {
  market: MarketWithDetails;
  variant?: "small" | "large";
}) {
  const [showMap, setShowMap] = useState(false);
  const websiteUrl = market.website
    ? market.website.startsWith("http")
      ? market.website
      : `https://${market.website}`
    : null;

  if (variant === "large") {
    return (
      <>
        <Card className="group overflow-hidden border-border hover:shadow-lg transition-all">
          <div className="relative h-48 overflow-hidden">
            <Image
              src={getImage(market)}
              alt={market.name}
              fill
              className="object-cover transition-transform group-hover:scale-105"
            />
            {market.season_type && (
              <Badge className={`absolute top-3 left-3 text-xs ${seasonColors[market.season_type] || ""}`}>
                {market.season_type}
              </Badge>
            )}
          </div>
          <CardContent className="p-4">
            <h3 className="font-semibold text-lg text-foreground line-clamp-1">{market.name}</h3>
            <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
              <MapPin className="h-4 w-4 shrink-0" />
              <span className="truncate">
                {market.city}
                {market.distance_meters ? ` · ${formatDistance(market.distance_meters)}` : ""}
              </span>
            </div>
            {market.description && (
              <p className="text-xs text-muted-foreground line-clamp-2 mt-2">{market.description}</p>
            )}
            {/* Buttons */}
            <div className="flex gap-2 mt-3">
              {websiteUrl && (
                <a href={websiteUrl} target="_blank" rel="noopener noreferrer" className="flex-1">
                  <Button variant="outline" size="sm" className="w-full gap-1.5 rounded-full text-xs">
                    <Globe className="w-3.5 h-3.5" />
                    Website
                  </Button>
                </a>
              )}
              {market.latitude && market.longitude && (
                <Button
                  variant="default"
                  size="sm"
                  className="flex-1 gap-1.5 rounded-full text-xs"
                  onClick={() => setShowMap(true)}
                >
                  <Map className="w-3.5 h-3.5" />
                  Show on Map
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {showMap && market.latitude && market.longitude && (
          <MapModal
            name={market.name}
            lat={market.latitude}
            lng={market.longitude}
            address={market.address}
            onClose={() => setShowMap(false)}
          />
        )}
      </>
    );
  }

  // Small variant
  return (
    <>
      <Card className="group overflow-hidden border-border hover:shadow-lg transition-shadow">
        <div className="relative aspect-square overflow-hidden">
          <Image
            src={getImage(market)}
            alt={market.name}
            fill
            className="object-cover transition-transform group-hover:scale-105"
          />
        </div>
        <CardContent className="p-3">
          <h3 className="font-semibold text-foreground truncate text-sm">{market.name}</h3>
          <p className="text-xs text-muted-foreground truncate mt-0.5">
            {market.city || market.address}
            {market.distance_meters ? ` · ${formatDistance(market.distance_meters)}` : ""}
          </p>
          {/* Buttons */}
          <div className="flex gap-1.5 mt-2">
            {websiteUrl ? (
              <a href={websiteUrl} target="_blank" rel="noopener noreferrer" className="flex-1">
                <Button variant="outline" size="sm" className="w-full gap-1 rounded-full text-[11px] h-7 px-2">
                  <Globe className="w-3 h-3" />
                  Visit
                </Button>
              </a>
            ) : (
              <div className="flex-1" />
            )}
            {market.latitude && market.longitude && (
              <Button
                variant="default"
                size="sm"
                className="flex-1 gap-1 rounded-full text-[11px] h-7 px-2"
                onClick={() => setShowMap(true)}
              >
                <Map className="w-3 h-3" />
                Map
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {showMap && market.latitude && market.longitude && (
        <MapModal
          name={market.name}
          lat={market.latitude}
          lng={market.longitude}
          address={market.address}
          onClose={() => setShowMap(false)}
        />
      )}
    </>
  );
}
