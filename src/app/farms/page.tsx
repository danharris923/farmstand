"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Phone, Globe, Search, ExternalLink } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import type { MarketWithDetails } from "@/lib/types";

const seasonColors: Record<string, string> = {
  summer: "bg-green-100 text-green-700",
  winter: "bg-blue-100 text-blue-700",
  "year-round": "bg-purple-100 text-purple-700",
};

export default function FarmsPage() {
  const [markets, setMarkets] = useState<MarketWithDetails[]>([]);
  const [filtered, setFiltered] = useState<MarketWithDetails[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const perPage = 24;

  useEffect(() => {
    async function load() {
      const res = await fetch("/api/markets?limit=500");
      const data = await res.json();
      setMarkets(data.markets || []);
      setLoading(false);
    }
    load();
  }, []);

  useEffect(() => {
    const q = search.toLowerCase();
    const results = q
      ? markets.filter(
          (m) =>
            m.name.toLowerCase().includes(q) ||
            (m.city || "").toLowerCase().includes(q) ||
            (m.description || "").toLowerCase().includes(q) ||
            (m.region || "").toLowerCase().includes(q)
        )
      : markets;
    setFiltered(results);
    setPage(1);
  }, [search, markets]);

  const pageMarkets = filtered.slice(0, page * perPage);
  const hasMore = pageMarkets.length < filtered.length;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container px-4 py-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Browse Farms & Markets</h1>
            <p className="text-muted-foreground mt-1">
              {filtered.length} farms and markets across British Columbia
            </p>
          </div>
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search by name, city, or region..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {loading ? (
          <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <Skeleton className="h-40" />
                <CardContent className="p-4 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4">
              {pageMarkets.map((market) => (
                <Card
                  key={market.id}
                  className="group overflow-hidden hover:shadow-lg transition-all"
                >
                  <div className="relative h-36 overflow-hidden bg-secondary">
                    {market.image_url ? (
                      <Image
                        src={market.image_url}
                        alt={market.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                        <MapPin className="w-8 h-8" />
                      </div>
                    )}
                    {market.season_type && (
                      <Badge
                        className={`absolute top-2 left-2 text-[10px] ${seasonColors[market.season_type] || ""}`}
                      >
                        {market.season_type}
                      </Badge>
                    )}
                  </div>
                  <CardContent className="p-3">
                    <h3 className="font-semibold text-sm line-clamp-1">
                      {market.name}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {market.city || market.address || "BC"}
                    </p>
                    {market.description && (
                      <p className="text-xs text-muted-foreground mt-1.5 line-clamp-2">
                        {market.description}
                      </p>
                    )}
                    <div className="flex items-center gap-2 mt-2">
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
                          <Globe className="w-3 h-3" />
                          Website
                        </a>
                      )}
                      {market.phone && (
                        <a
                          href={`tel:${market.phone}`}
                          className="inline-flex items-center gap-1 text-xs text-muted-foreground"
                        >
                          <Phone className="w-3 h-3" />
                          Call
                        </a>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            {hasMore && (
              <div className="flex justify-center mt-8">
                <Button
                  variant="outline"
                  onClick={() => setPage((p) => p + 1)}
                  className="rounded-full px-8"
                >
                  Load More
                </Button>
              </div>
            )}
            {filtered.length === 0 && (
              <div className="text-center py-16 text-muted-foreground">
                No farms or markets found for &quot;{search}&quot;
              </div>
            )}
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}
