"use client";

import { MapPin, Clock, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import type { MarketWithDetails } from "@/lib/types";

function getDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function formatTime(time: string | null): string {
  if (!time) return "";
  const [h, m] = time.split(":");
  const hour = parseInt(h);
  const ampm = hour >= 12 ? "pm" : "am";
  const h12 = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
  return `${h12}:${m} ${ampm}`;
}

const seasonColors: Record<string, string> = {
  summer: "bg-green-100 text-green-700",
  winter: "bg-blue-100 text-blue-700",
  "year-round": "bg-purple-100 text-purple-700",
};

export function MarketSidebar({
  markets,
  loading,
  selectedDay,
  onSelect,
  selectedMarket,
  userLocation,
}: {
  markets: MarketWithDetails[];
  loading: boolean;
  selectedDay: string;
  onSelect: (market: MarketWithDetails) => void;
  selectedMarket: MarketWithDetails | null;
  userLocation: { lat: number; lng: number } | null;
}) {
  // Sort by distance if we have user location
  const sorted = [...markets].sort((a, b) => {
    if (!userLocation || !a.latitude || !b.latitude) return 0;
    const distA = getDistance(
      userLocation.lat,
      userLocation.lng,
      a.latitude,
      a.longitude!
    );
    const distB = getDistance(
      userLocation.lat,
      userLocation.lng,
      b.latitude,
      b.longitude!
    );
    return distA - distB;
  });

  if (loading) {
    return (
      <div className="p-4 space-y-3">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
            <Skeleton className="h-3 w-1/3" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <ScrollArea className="flex-1">
      <div className="p-2">
        <div className="px-2 py-1.5 text-xs text-muted-foreground font-medium">
          {sorted.length} market{sorted.length !== 1 ? "s" : ""}
          {selectedDay ? ` open ${selectedDay}` : ""}
        </div>

        {sorted.map((market) => {
          const todayHours = market.hours?.find(
            (h) => h.day_of_week === selectedDay
          );
          const dist =
            userLocation && market.latitude
              ? getDistance(
                  userLocation.lat,
                  userLocation.lng,
                  market.latitude,
                  market.longitude!
                )
              : null;

          return (
            <button
              key={market.id}
              onClick={() => onSelect(market)}
              className={cn(
                "w-full text-left p-3 rounded-xl transition-all mb-1",
                selectedMarket?.id === market.id
                  ? "bg-primary/10 border border-primary/20"
                  : "hover:bg-secondary/80"
              )}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-sm text-foreground truncate">
                    {market.name}
                  </h3>
                  <div className="flex items-center gap-1 mt-0.5 text-xs text-muted-foreground">
                    <MapPin className="w-3 h-3 shrink-0" />
                    <span className="truncate">{market.city}</span>
                    {dist !== null && (
                      <span className="shrink-0">
                        · {dist < 1 ? `${(dist * 1000).toFixed(0)}m` : `${dist.toFixed(1)}km`}
                      </span>
                    )}
                  </div>
                  {todayHours && (
                    <div className="flex items-center gap-1 mt-1 text-xs text-primary font-medium">
                      <Clock className="w-3 h-3" />
                      {formatTime(todayHours.open_time)} –{" "}
                      {formatTime(todayHours.close_time)}
                    </div>
                  )}
                </div>
                <Badge
                  variant="secondary"
                  className={cn(
                    "text-[10px] shrink-0",
                    seasonColors[market.season_type || ""] || ""
                  )}
                >
                  {market.season_type || "–"}
                </Badge>
              </div>

              {market.products && market.products.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {market.products.slice(0, 4).map((p) => (
                    <span
                      key={p.product}
                      className="text-[10px] px-1.5 py-0.5 bg-secondary rounded-full text-muted-foreground"
                    >
                      {p.product.split(" / ")[0].split(" - ")[0]}
                    </span>
                  ))}
                  {market.products.length > 4 && (
                    <span className="text-[10px] px-1.5 py-0.5 text-muted-foreground">
                      +{market.products.length - 4}
                    </span>
                  )}
                </div>
              )}
            </button>
          );
        })}

        {sorted.length === 0 && (
          <div className="p-8 text-center text-muted-foreground text-sm">
            No markets match your filters.
            <br />
            Try a different day or product.
          </div>
        )}
      </div>
    </ScrollArea>
  );
}
