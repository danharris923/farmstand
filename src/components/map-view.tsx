"use client";

import { useEffect, useRef, useState } from "react";
import type { MarketWithDetails } from "@/lib/types";

const BC_CENTER = { lat: 53.7, lng: -127.6 };
const BC_ZOOM = 5;

export function MapView({
  markets,
  userLocation,
}: {
  markets: MarketWithDetails[];
  userLocation: { lat: number; lng: number } | null;
}) {
  const mapRef = useRef<HTMLDivElement>(null);
  const googleMapRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);
  const infoRef = useRef<google.maps.InfoWindow | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  // Load Google Maps script
  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    if (!apiKey) return;
    if (document.querySelector('script[src*="maps.googleapis.com"]')) {
      setMapLoaded(true);
      return;
    }

    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&v=weekly`;
    script.async = true;
    script.onload = () => setMapLoaded(true);
    document.head.appendChild(script);
  }, []);

  // Initialize map
  useEffect(() => {
    if (!mapLoaded || !mapRef.current || googleMapRef.current) return;

    googleMapRef.current = new google.maps.Map(mapRef.current, {
      center: userLocation || BC_CENTER,
      zoom: userLocation ? 11 : BC_ZOOM,
      disableDefaultUI: true,
      zoomControl: true,
      gestureHandling: "greedy",
      styles: [
        { featureType: "poi", stylers: [{ visibility: "off" }] },
        { featureType: "transit", stylers: [{ visibility: "off" }] },
        { featureType: "landscape", stylers: [{ color: "#f5f0e8" }] },
        { featureType: "water", stylers: [{ color: "#c4dfe6" }] },
      ],
    });

    infoRef.current = new google.maps.InfoWindow();
  }, [mapLoaded, userLocation]);

  // Place markers
  useEffect(() => {
    const map = googleMapRef.current;
    if (!map || !mapLoaded) return;

    // Clear old markers
    markersRef.current.forEach((m) => m.setMap(null));
    markersRef.current = [];

    const infoWindow = infoRef.current!;

    markets.forEach((market) => {
      if (!market.latitude || !market.longitude) return;

      const marker = new google.maps.Marker({
        map,
        position: { lat: market.latitude, lng: market.longitude },
        title: market.name,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 8,
          fillColor: "#2d6a4f",
          fillOpacity: 0.9,
          strokeColor: "#ffffff",
          strokeWeight: 2,
        },
      });

      const websiteLink = market.website
        ? `<a href="${market.website}" target="_blank" rel="noopener noreferrer" style="color:#2d6a4f;font-weight:600;text-decoration:none;display:inline-flex;align-items:center;gap:4px;">Visit Website &rarr;</a>`
        : "";

      const seasonBadge = market.season_type
        ? `<span style="display:inline-block;padding:2px 8px;border-radius:9999px;font-size:11px;font-weight:600;${
            market.season_type === "summer"
              ? "background:#dcfce7;color:#166534"
              : market.season_type === "winter"
                ? "background:#dbeafe;color:#1e40af"
                : "background:#f3e8ff;color:#6b21a8"
          }">${market.season_type}</span>`
        : "";

      const content = `
        <div style="font-family:Nunito,system-ui,sans-serif;max-width:260px;padding:4px;">
          <div style="font-size:15px;font-weight:700;margin-bottom:4px;color:#1a1a1a;">${market.name}</div>
          <div style="font-size:12px;color:#666;margin-bottom:6px;">${market.city || ""}${market.region ? " · " + market.region : ""}</div>
          ${market.address ? `<div style="font-size:12px;color:#888;margin-bottom:6px;">${market.address}</div>` : ""}
          <div style="display:flex;align-items:center;gap:6px;margin-bottom:8px;">
            ${seasonBadge}
            ${market.season_start ? `<span style="font-size:11px;color:#888;">${market.season_start} – ${market.season_end}</span>` : ""}
          </div>
          ${market.phone ? `<div style="font-size:12px;color:#666;margin-bottom:4px;">📞 ${market.phone}</div>` : ""}
          ${websiteLink}
        </div>
      `;

      marker.addListener("click", () => {
        infoWindow.setContent(content);
        infoWindow.open(map, marker);
      });

      // Show name on hover
      marker.addListener("mouseover", () => {
        infoWindow.setContent(content);
        infoWindow.open(map, marker);
      });

      markersRef.current.push(marker);
    });
  }, [markets, mapLoaded]);

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
