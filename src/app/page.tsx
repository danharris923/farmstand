"use client";

import { useState, useEffect, useCallback } from "react";
import { MapView } from "@/components/map-view";
import { MarketSidebar } from "@/components/market-sidebar";
import { ProductFilter } from "@/components/product-filter";
import { DayPicker } from "@/components/day-picker";
import { MarketSheet } from "@/components/market-sheet";
import { Header } from "@/components/app-header";
import type { MarketWithDetails } from "@/lib/types";

const DAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export default function Home() {
  const [markets, setMarkets] = useState<MarketWithDetails[]>([]);
  const [filtered, setFiltered] = useState<MarketWithDetails[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [selectedDay, setSelectedDay] = useState<string>(
    DAYS[new Date().getDay()]
  );
  const [selectedMarket, setSelectedMarket] =
    useState<MarketWithDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  // Fetch all markets with their products and hours
  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/markets?limit=200");
        const data = await res.json();
        const marketList: MarketWithDetails[] = data.markets || [];

        // Fetch products and hours for each market in parallel
        const detailed = await Promise.all(
          marketList.map(async (m) => {
            try {
              const res = await fetch(`/api/markets/${m.slug}`);
              const full = await res.json();
              return full as MarketWithDetails;
            } catch {
              return m;
            }
          })
        );

        setMarkets(detailed);
        setLoading(false);
      } catch (err) {
        console.error("Failed to load markets:", err);
        setLoading(false);
      }
    }
    load();
  }, []);

  // Filter markets by product and day
  useEffect(() => {
    let result = markets.filter((m) => m.latitude && m.longitude);

    if (selectedProduct) {
      result = result.filter((m) =>
        m.products?.some((p) => p.product === selectedProduct)
      );
    }

    if (selectedDay) {
      result = result.filter((m) =>
        m.hours?.some((h) => h.day_of_week === selectedDay)
      );
    }

    setFiltered(result);
  }, [markets, selectedProduct, selectedDay]);

  const handleLocateMe = useCallback(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
      },
      () => {
        // Default to Vancouver if denied
        setUserLocation({ lat: 49.2827, lng: -123.1207 });
      }
    );
  }, []);

  return (
    <div className="h-screen flex flex-col bg-background">
      <Header onLocateMe={handleLocateMe} />

      {/* Filters bar */}
      <div className="border-b border-border bg-card px-4 py-3 flex gap-3 items-center overflow-x-auto">
        <DayPicker selected={selectedDay} onSelect={setSelectedDay} />
        <div className="w-px h-6 bg-border shrink-0" />
        <ProductFilter
          selected={selectedProduct}
          onSelect={setSelectedProduct}
        />
      </div>

      {/* Main content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar - desktop only */}
        <div className="hidden md:flex w-[380px] border-r border-border flex-col">
          <MarketSidebar
            markets={filtered}
            loading={loading}
            selectedDay={selectedDay}
            onSelect={setSelectedMarket}
            selectedMarket={selectedMarket}
            userLocation={userLocation}
          />
        </div>

        {/* Map */}
        <div className="flex-1 relative">
          <MapView
            markets={filtered}
            selectedMarket={selectedMarket}
            onSelectMarket={setSelectedMarket}
            userLocation={userLocation}
          />

          {/* Mobile: market count pill */}
          <div className="md:hidden absolute bottom-4 left-1/2 -translate-x-1/2">
            <div className="bg-card/95 backdrop-blur border border-border rounded-full px-4 py-2 shadow-lg text-sm font-medium">
              {loading
                ? "Loading..."
                : `${filtered.length} markets ${selectedDay ? `on ${selectedDay}` : ""}`}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile bottom sheet for selected market */}
      {selectedMarket && (
        <MarketSheet
          market={selectedMarket}
          selectedDay={selectedDay}
          onClose={() => setSelectedMarket(null)}
        />
      )}
    </div>
  );
}
