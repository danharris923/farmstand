"use client";

import { useEffect, useRef, useState } from "react";
import type { MarketWithDetails } from "@/lib/types";

const BC_CENTER = { lat: 53.7, lng: -127.6 };
const BC_ZOOM = 5;

export function MapView({
  markets,
  selectedMarket,
  onSelectMarket,
  userLocation,
}: {
  markets: MarketWithDetails[];
  selectedMarket: MarketWithDetails | null;
  onSelectMarket: (market: MarketWithDetails) => void;
  userLocation: { lat: number; lng: number } | null;
}) {
  const mapRef = useRef<HTMLDivElement>(null);
  const googleMapRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.marker.AdvancedMarkerElement[]>([]);
  const [mapLoaded, setMapLoaded] = useState(false);

  // Load Google Maps script
  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    if (!apiKey || document.querySelector('script[src*="maps.googleapis.com"]'))
      return;

    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=marker&v=weekly`;
    script.async = true;
    script.onload = () => setMapLoaded(true);
    document.head.appendChild(script);

    return () => {};
  }, []);

  // Initialize map
  useEffect(() => {
    if (!mapLoaded || !mapRef.current || googleMapRef.current) return;

    googleMapRef.current = new google.maps.Map(mapRef.current, {
      center: userLocation || BC_CENTER,
      zoom: userLocation ? 11 : BC_ZOOM,
      mapId: "farmstand-map",
      disableDefaultUI: true,
      zoomControl: true,
      styles: [
        { featureType: "poi", stylers: [{ visibility: "off" }] },
        { featureType: "transit", stylers: [{ visibility: "off" }] },
        {
          featureType: "landscape",
          stylers: [{ color: "#f5f0e8" }],
        },
        {
          featureType: "water",
          stylers: [{ color: "#c4dfe6" }],
        },
      ],
    });
  }, [mapLoaded, userLocation]);

  // Update markers when markets change
  useEffect(() => {
    const map = googleMapRef.current;
    if (!map || !mapLoaded) return;

    // Clear old markers
    markersRef.current.forEach((m) => (m.map = null));
    markersRef.current = [];

    markets.forEach((market) => {
      if (!market.latitude || !market.longitude) return;

      const isSelected = selectedMarket?.id === market.id;

      const pin = document.createElement("div");
      pin.className = `transition-all duration-200 cursor-pointer`;
      pin.innerHTML = `
        <div class="flex flex-col items-center">
          <div class="${
            isSelected
              ? "w-10 h-10 bg-primary shadow-lg scale-110"
              : "w-7 h-7 bg-primary/80 hover:bg-primary hover:scale-110"
          } rounded-full flex items-center justify-center transition-all shadow-md border-2 border-white">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
          </div>
          ${isSelected ? `<div class="mt-1 px-2 py-0.5 bg-card border border-border rounded text-[10px] font-medium shadow-sm whitespace-nowrap max-w-[140px] truncate">${market.name}</div>` : ""}
        </div>
      `;

      try {
        const marker = new google.maps.marker.AdvancedMarkerElement({
          map,
          position: { lat: market.latitude, lng: market.longitude },
          content: pin,
        });

        marker.addListener("click", () => {
          onSelectMarket(market);
        });

        markersRef.current.push(marker);
      } catch {
        // AdvancedMarkerElement not available, use basic marker
        const marker = new google.maps.Marker({
          map,
          position: { lat: market.latitude, lng: market.longitude },
          title: market.name,
        });
        marker.addListener("click", () => onSelectMarket(market));
      }
    });
  }, [markets, selectedMarket, mapLoaded, onSelectMarket]);

  // Pan to selected market
  useEffect(() => {
    const map = googleMapRef.current;
    if (!map || !selectedMarket?.latitude) return;
    map.panTo({ lat: selectedMarket.latitude, lng: selectedMarket.longitude! });
    if (map.getZoom()! < 12) map.setZoom(12);
  }, [selectedMarket]);

  // Pan to user location
  useEffect(() => {
    const map = googleMapRef.current;
    if (!map || !userLocation) return;
    map.panTo(userLocation);
    map.setZoom(11);
  }, [userLocation]);

  return (
    <div ref={mapRef} className="w-full h-full bg-secondary">
      {!mapLoaded && (
        <div className="w-full h-full flex items-center justify-center text-muted-foreground">
          Loading map...
        </div>
      )}
    </div>
  );
}
