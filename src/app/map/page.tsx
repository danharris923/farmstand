"use client";

import { useState, useEffect, useCallback } from "react";
import { MapView } from "@/components/map-view";
import { Header } from "@/components/app-header";
import type { MarketWithDetails } from "@/lib/types";

export default function MapPage() {
  const [markets, setMarkets] = useState<MarketWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/markets?limit=500");
        const data = await res.json();
        const list: MarketWithDetails[] = (data.markets || []).filter(
          (m: MarketWithDetails) => m.latitude && m.longitude
        );
        setMarkets(list);
      } catch (err) {
        console.error("Failed to load markets:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleLocateMe = useCallback(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) =>
        setUserLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        }),
      () => setUserLocation({ lat: 49.2827, lng: -123.1207 })
    );
  }, []);

  return (
    <div className="h-screen flex flex-col bg-background">
      <Header onLocateMe={handleLocateMe} marketCount={markets.length} loading={loading} />
      <div className="flex-1 relative">
        <MapView markets={markets} userLocation={userLocation} />
      </div>
    </div>
  );
}
