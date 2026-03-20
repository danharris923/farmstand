"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { FarmCard } from "@/components/farm-card";
import type { MarketWithDetails } from "@/lib/types";

export function FeaturedFarms({
  markets,
  loading,
}: {
  markets: MarketWithDetails[];
  loading: boolean;
}) {
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
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {featured.map((market) => (
              <FarmCard key={market.id} market={market} variant="large" />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
