"use client";

import { useEffect, useRef } from "react";
import { X, Navigation, Locate, ZoomIn, ZoomOut, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

export function MapModal({
  name,
  lat,
  lng,
  address,
  onClose,
}: {
  name: string;
  lat: number;
  lng: number;
  address?: string | null;
  onClose: () => void;
}) {
  const mapRef = useRef<HTMLDivElement>(null);
  const googleMapRef = useRef<google.maps.Map | null>(null);

  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    if (!apiKey || !mapRef.current) return;

    function init() {
      if (!mapRef.current) return;
      const map = new google.maps.Map(mapRef.current, {
        center: { lat, lng },
        zoom: 14,
        disableDefaultUI: true,
        zoomControl: false,
        gestureHandling: "greedy",
        styles: [
          { featureType: "poi", stylers: [{ visibility: "off" }] },
          { featureType: "transit", stylers: [{ visibility: "off" }] },
          { featureType: "landscape", stylers: [{ color: "#f5f0e8" }] },
          { featureType: "water", stylers: [{ color: "#c4dfe6" }] },
        ],
      });
      googleMapRef.current = map;

      new google.maps.Marker({
        map,
        position: { lat, lng },
        title: name,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 12,
          fillColor: "#2d6a4f",
          fillOpacity: 1,
          strokeColor: "#ffffff",
          strokeWeight: 3,
        },
      });
    }

    if (window.google?.maps) {
      init();
    } else {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&v=weekly`;
      script.async = true;
      script.onload = init;
      document.head.appendChild(script);
    }
  }, [lat, lng, name]);

  function handleLocateMe() {
    if (!navigator.geolocation || !googleMapRef.current) return;
    navigator.geolocation.getCurrentPosition((pos) => {
      const map = googleMapRef.current!;
      const userPos = { lat: pos.coords.latitude, lng: pos.coords.longitude };
      map.panTo(userPos);

      new google.maps.Marker({
        map,
        position: userPos,
        title: "You are here",
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 8,
          fillColor: "#3b82f6",
          fillOpacity: 1,
          strokeColor: "#ffffff",
          strokeWeight: 2,
        },
      });

      // Fit both markers
      const bounds = new google.maps.LatLngBounds();
      bounds.extend(userPos);
      bounds.extend({ lat, lng });
      map.fitBounds(bounds, 60);
    });
  }

  function handleZoom(delta: number) {
    const map = googleMapRef.current;
    if (!map) return;
    map.setZoom((map.getZoom() || 14) + delta);
  }

  function handleRecenter() {
    googleMapRef.current?.panTo({ lat, lng });
    googleMapRef.current?.setZoom(14);
  }

  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div
        className="bg-card rounded-t-2xl sm:rounded-2xl shadow-2xl w-full sm:max-w-lg sm:mx-4 max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-3 sm:p-4 border-b border-border">
          <div className="min-w-0 flex-1 mr-2">
            <h3 className="font-bold text-foreground text-sm sm:text-base truncate">{name}</h3>
            {address && <p className="text-xs text-muted-foreground mt-0.5 truncate">{address}</p>}
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center hover:bg-secondary/80 shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Map with controls */}
        <div className="relative">
          <div ref={mapRef} className="w-full h-[250px] sm:h-[300px] bg-secondary" />

          {/* Map controls overlay */}
          <div className="absolute top-3 right-3 flex flex-col gap-1.5">
            <button
              onClick={handleZoom.bind(null, 1)}
              className="w-9 h-9 bg-card/95 backdrop-blur border border-border rounded-lg shadow-md flex items-center justify-center hover:bg-card active:scale-95 transition"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={handleZoom.bind(null, -1)}
              className="w-9 h-9 bg-card/95 backdrop-blur border border-border rounded-lg shadow-md flex items-center justify-center hover:bg-card active:scale-95 transition"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
          </div>

          <div className="absolute bottom-3 right-3 flex gap-1.5">
            <button
              onClick={handleRecenter}
              className="h-9 px-3 bg-card/95 backdrop-blur border border-border rounded-lg shadow-md flex items-center justify-center gap-1.5 text-xs font-medium hover:bg-card active:scale-95 transition"
            >
              <MapPin className="w-3.5 h-3.5 text-primary" />
              Recenter
            </button>
            <button
              onClick={handleLocateMe}
              className="h-9 px-3 bg-primary text-primary-foreground rounded-lg shadow-md flex items-center justify-center gap-1.5 text-xs font-medium hover:bg-primary/90 active:scale-95 transition"
            >
              <Locate className="w-3.5 h-3.5" />
              Near Me
            </button>
          </div>
        </div>

        {/* Actions */}
        <div className="p-3 sm:p-4 flex gap-2">
          <a href={directionsUrl} target="_blank" rel="noopener noreferrer" className="flex-1">
            <Button className="w-full gap-2 rounded-full h-10 sm:h-11">
              <Navigation className="w-4 h-4" />
              Get Directions
            </Button>
          </a>
        </div>
      </div>
    </div>
  );
}
