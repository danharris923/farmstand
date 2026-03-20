"use client";

import { useEffect, useRef } from "react";
import { X, Navigation } from "lucide-react";
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

  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    if (!apiKey || !mapRef.current) return;

    function init() {
      if (!mapRef.current) return;
      const map = new google.maps.Map(mapRef.current, {
        center: { lat, lng },
        zoom: 14,
        disableDefaultUI: true,
        zoomControl: true,
        styles: [
          { featureType: "poi", stylers: [{ visibility: "off" }] },
          { featureType: "transit", stylers: [{ visibility: "off" }] },
          { featureType: "landscape", stylers: [{ color: "#f5f0e8" }] },
          { featureType: "water", stylers: [{ color: "#c4dfe6" }] },
        ],
      });

      new google.maps.Marker({
        map,
        position: { lat, lng },
        title: name,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 10,
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

  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-card rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div>
            <h3 className="font-bold text-foreground">{name}</h3>
            {address && <p className="text-xs text-muted-foreground mt-0.5">{address}</p>}
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center hover:bg-secondary/80">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Map */}
        <div ref={mapRef} className="w-full h-[300px] bg-secondary" />

        {/* Actions */}
        <div className="p-4">
          <a href={directionsUrl} target="_blank" rel="noopener noreferrer">
            <Button className="w-full gap-2 rounded-full">
              <Navigation className="w-4 h-4" />
              Get Directions
            </Button>
          </a>
        </div>
      </div>
    </div>
  );
}
