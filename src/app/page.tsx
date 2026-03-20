"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/header";
import { Hero } from "@/components/hero";
import { Categories } from "@/components/categories";
import { NearbyFarms } from "@/components/nearby-farms";
import { FeaturedFarms } from "@/components/featured-farms-live";
import { Footer } from "@/components/footer";
import type { MarketWithDetails } from "@/lib/types";

export default function Home() {
  const [markets, setMarkets] = useState<MarketWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  useEffect(() => {
    // Try geolocation
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) =>
          setUserLocation({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          }),
        () => setUserLocation({ lat: 49.2827, lng: -123.1207 }) // default Vancouver
      );
    }
  }, []);

  useEffect(() => {
    if (!userLocation) return;
    async function load() {
      try {
        const res = await fetch(
          `/api/markets/nearby?lat=${userLocation!.lat}&lng=${userLocation!.lng}&radius=100000`
        );
        const data = await res.json();
        setMarkets(data.markets || []);
      } catch (err) {
        // Fallback to all markets
        const res = await fetch("/api/markets?limit=50");
        const data = await res.json();
        setMarkets(data.markets || []);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [userLocation]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <Categories />
        <NearbyFarms markets={markets} loading={loading} />
        <FeaturedFarms markets={markets} loading={loading} />
      </main>
      <Footer />
    </div>
  );
}
