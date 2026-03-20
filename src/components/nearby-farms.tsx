"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { FarmCard } from "@/components/farm-card";
import type { MarketWithDetails } from "@/lib/types";

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
          <Link href="/map">
            <Button variant="ghost" className="text-primary text-sm">
              View Map
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </Link>
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
              <FarmCard key={market.id} market={market} variant="small" />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
